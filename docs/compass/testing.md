# Testing

> RSpec with FactoryBot (project convention). Patterns from 37signals adapted.

**Note**: This project uses RSpec + FactoryBot (not Minitest + Fixtures as 37signals does).
The principles below still apply regardless of framework.

## Test the Behavior, Not the Implementation

Assert what the user sees (responses, JSON payloads) not internal state.
Test public interfaces, not private methods.

```ruby
# Good — tests behavior
it "closes the card" do
  post close_card_path(card), headers: auth_headers
  expect(card.reload).to be_closed
end

# Bad — tests implementation
it "creates a closure record" do
  expect { post close_card_path(card) }.to change(Closure, :count).by(1)
end
```

## Test Structure: Setup, Action, Assertion

```ruby
describe "POST /api/v1/habits" do
  let(:account) { create(:account) }
  let(:headers) { auth_headers_for(account) }

  it "creates a habit" do
    post api_v1_habits_path, params: { habit: valid_params }, headers: headers

    expect(response).to have_http_status(:created)
    expect(json_response["title"]).to eq("Exercise")
  end
end
```

## Integration Tests Cover the Full Stack

- Happy path
- Authentication (missing/invalid token)
- Authorization (wrong account)
- Validation errors
- Edge cases

## Testing Time

```ruby
it "expires after 15 minutes" do
  travel_to 16.minutes.from_now do
    expect(magic_link).to be_expired
  end
end
```

## VCR for External APIs

```ruby
VCR.configure do |config|
  config.cassette_library_dir = "spec/vcr_cassettes"
  config.hook_into :webmock
  config.filter_sensitive_data('<API_KEY>') { ENV['STRIPE_API_KEY'] }
end
```

To update cassettes: `VCR_RECORD=1 bundle exec rspec`

## Testing Jobs

```ruby
it "enqueues notification job" do
  expect {
    create(:habit_check, habit: habit)
  }.to have_enqueued_job(NotifyJob)
end
```

## Don't Let Tests Shape Design

- Avoid test-induced design damage
- Never add code just for testability
- Tests ship with features, same commit

## Key Principles

1. Test behavior, not implementation
2. Integration tests for full stack coverage
3. VCR for external APIs — fast, deterministic, offline
4. Tests ship with features — no test debt
5. Keep tests fast — mock external, parallelize
