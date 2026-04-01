# Filtering

> Filter POROs, composable scopes, URL-based state.

## The Problem

Controllers doing too much — mixing query logic with HTTP concerns:

```ruby
# BAD: controller doing filtering
def index
  @cards = current_account.cards
  @cards = @cards.where(status: params[:status]) if params[:status].present?
  @cards = @cards.where(assignee_id: params[:assignee]) if params[:assignee].present?
  @cards = @cards.tagged_with(params[:tag]) if params[:tag].present?
  @cards = @cards.page(params[:page])
end
```

## The Solution: Filter PORO

```ruby
class Bucket::BubbleFilter
  attr_reader :bucket, :user, :params

  def initialize(bucket:, user:, params: {})
    @bucket = bucket
    @user = user
    @params = params.to_h.symbolize_keys
  end

  def cards
    @cards ||= begin
      scope = bucket.cards.visible_to(user)
      scope = apply_status_filter(scope)
      scope = apply_assignee_filter(scope)
      scope = apply_tag_filter(scope)
      scope = apply_search(scope)
      scope = apply_sort(scope)
      scope
    end
  end

  def any_active?
    params.except(:sort).values.any?(&:present?)
  end

  private

  def apply_status_filter(scope)
    return scope unless params[:status].present?
    scope.where(status: params[:status])
  end

  def apply_assignee_filter(scope)
    return scope unless params[:assignee].present?
    params[:assignee] == "none" ? scope.unassigned : scope.where(assignee_id: params[:assignee])
  end

  def apply_tag_filter(scope)
    return scope unless params[:tag].present?
    scope.tagged_with(params[:tag])
  end

  def apply_search(scope)
    return scope unless params[:query].present?
    scope.search(params[:query])
  end

  def apply_sort(scope)
    case params[:sort]
    when "newest"  then scope.order(created_at: :desc)
    when "oldest"  then scope.order(created_at: :asc)
    when "updated" then scope.order(updated_at: :desc)
    else scope.order(position: :asc)
    end
  end
end
```

Controller becomes trivial:

```ruby
def index
  filter = Bucket::BubbleFilter.new(
    bucket: current_account, user: current_user, params: filter_params
  )
  @cards = filter.cards.page(params[:page])
  render json: @cards
end
```

## Key Pattern: Each filter returns scope unchanged if param is blank

This enables clean chaining without conditionals in the caller.

## URL-Based State

Filters encoded as query parameters are bookmarkable, shareable, and work with back/forward:

```
GET /api/v1/habits?status=active&tag=health&sort=newest
```

## Filter Params Module

```ruby
module Filter::Params
  PERMITTED_PARAMS = %i[status assignee tag query sort].freeze

  def as_params
    params.slice(*PERMITTED_PARAMS).compact_blank
  end

  def as_params_without(*keys)
    as_params.except(*keys)
  end
end
```

## Key Principles

1. **Extract filter logic into POROs** — controllers delegate to filter objects
2. **Compose scopes lazily** — each method returns scope unchanged if inactive
3. **URL state for filters** — query parameters, not session/cookies
4. **Memoize the result** — `@cards ||= begin...end`
5. **Always scope through user** — `bucket.cards.visible_to(user)`
