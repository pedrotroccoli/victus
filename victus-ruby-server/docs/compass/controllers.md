# Controllers

> Thin controllers, rich models, composable concerns. API-focused.

## Core: Thin Controllers, Rich Models

```ruby
# GOOD: Controller just orchestrates
class Cards::ClosuresController < ApplicationController
  include CardScoped

  def create
    @card.close
    head :no_content
  end

  def destroy
    @card.reopen
    head :no_content
  end
end
```

```ruby
# BAD: Business logic in controller
class Cards::ClosuresController < ApplicationController
  def create
    @card.transaction do
      @card.create_closure!(user: Current.user)
      @card.events.create!(action: :closed, creator: Current.user)
      @card.watchers.each { |w| NotificationJob.perform_later(w, @card) }
    end
  end
end
```

## Authorization: Controller Checks, Model Defines

```ruby
# Controller checks permission
class CardsController < ApplicationController
  before_action :ensure_permission_to_administer_card, only: [:destroy]

  private
    def ensure_permission_to_administer_card
      head :forbidden unless Current.user.can_administer_card?(@card)
    end
end

# Model defines what permission means
class User < ApplicationRecord
  def can_administer_card?(card)
    admin? || card.creator == self
  end
end
```

## Resource Scoping Concerns

```ruby
module CardScoped
  extend ActiveSupport::Concern
  included do
    before_action :set_card
  end
  private
    def set_card
      @card = Current.user.accessible_cards.find_by!(number: params[:card_id])
    end
end
```

Multiple controllers reuse the same concern:

```ruby
class Cards::ClosuresController < ApplicationController
  include CardScoped
end

class Cards::WatchesController < ApplicationController
  include CardScoped
end

class Cards::PinsController < ApplicationController
  include CardScoped
end
```

## Request Context Concern

```ruby
module CurrentRequest
  extend ActiveSupport::Concern
  included do
    before_action do
      Current.http_method = request.method
      Current.request_id  = request.uuid
      Current.user_agent  = request.user_agent
      Current.ip_address  = request.ip
    end
  end
end
```

## Filtering Concern

```ruby
module FilterScoped
  extend ActiveSupport::Concern
  included do
    before_action :set_filter
  end
  private
    def set_filter
      @filter = Current.user.filters.from_params(filter_params)
    end
    def filter_params
      params.permit(*Filter::PERMITTED_PARAMS)
    end
end
```

The Filter model does the heavy lifting:

```ruby
class Filter < ApplicationRecord
  def cards
    result = creator.accessible_cards.preloaded
    result = result.where(board: boards.ids) if boards.present?
    result = result.tagged_with(tags.ids) if tags.present?
    result = result.assigned_to(assignees.ids) if assignees.present?
    result.distinct
  end
end
```

## API Response Patterns

```ruby
# Prefer head :no_content for updates/deletes
def update
  @card.update!(card_params)
  head :no_content
end

# 201 + Location for creates
def create
  @card = current_account.cards.create!(card_params)
  render json: @card, status: :created, location: @card
end
```

| Action | Success Code |
|--------|--------------|
| Create | `201 Created` + `Location` header |
| Update | `204 No Content` |
| Delete | `204 No Content` |

## Concern Composition Rules

1. Concerns can include other concerns
2. Use `before_action` in `included` block
3. Provide shared private methods
4. Add to `etag` for HTTP caching
