# Routing

> Everything is CRUD. Resource-based routing over custom actions.

## The CRUD Principle

Every action maps to a CRUD verb. When something doesn't fit, **create a new resource**.

```ruby
# BAD: Custom actions on existing resource
resources :cards do
  post :close
  post :reopen
  post :archive
end

# GOOD: New resources for each state change
resources :cards do
  resource :closure      # POST to close, DELETE to reopen
  resource :goldness     # POST to gild, DELETE to ungild
  resource :pin          # POST to pin, DELETE to unpin
  resource :watch        # POST to watch, DELETE to unwatch
end
```

## Noun-Based Resources

Turn verbs into nouns:

| Action | Resource |
|--------|----------|
| Close a card | `card.closure` |
| Watch a board | `board.watching` |
| Pin an item | `item.pin` |
| Publish a board | `board.publication` |
| Assign a user | `card.assignment` |

## Module Scoping

```ruby
# scope module (no URL prefix)
resources :cards do
  scope module: :cards do
    resource :closure      # Cards::ClosuresController at /cards/:id/closure
    resources :assignments
    resources :comments
  end
end
```

## Shallow Nesting

```ruby
resources :boards, shallow: true do
  resources :cards
end
# /boards/:board_id/cards      (index, new, create)
# /cards/:id                   (show, edit, update, destroy)
```

## Singular Resources

Use `resource` (singular) for one-per-parent:

```ruby
resources :cards do
  resource :closure
  resource :watching
end
```

## API Namespace

```ruby
namespace :api do
  namespace :v1 do
    namespace :private do
      resources :habits
      resources :habits_check
    end
    namespace :public do
      resources :auth, only: [] do
        collection do
          post :sign_in
          post :sign_up
        end
      end
    end
  end
end
```

## Key Principles

1. **Every action is CRUD** — create, read, update, or destroy something
2. **Verbs become nouns** — "close" becomes "closure" resource
3. **Shallow nesting** — avoid deep URL nesting
4. **Singular when appropriate** — `resource` for one-per-parent
5. **Same controller, different format** — no separate API controllers when possible
