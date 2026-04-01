# 37signals Coding Style Guide

Guia de estilo baseado na análise de 265 PRs do Fizzy (37signals). Adaptado para o contexto do Victus.

> **Fonte**: [Unofficial 37signals Coding Style Guide](https://github.com/marckohlbrugge/unofficial-37signals-coding-style-guide)

---

## Filosofia de Desenvolvimento

### Ship, Validate, Refine

Priorize código funcionando em produção. Valide suposições com uso real antes de polir. Features evoluem através de iterações baseadas em feedback de produção.

### Fix Root Causes, Not Symptoms

- **Race conditions**: Use `enqueue_after_transaction_commit` ao invés de retry logic
- **Problemas de CSRF**: Evite HTTP caching em páginas com forms

### Vanilla Rails Over Abstractions

- Thin controllers delegando para rich domain models
- Service objects apenas quando genuinamente justificados
- ActiveRecord direto é aceitável: `@card.comments.create!(params)`

---

## Padrões de Models

### Heavy Use of Concerns

Cada concern lida com um aspecto distinto de funcionalidade:

```ruby
class Card < ApplicationRecord
  include Assignable      # Lógica de atribuição
  include Closeable       # Lógica de fechamento
  include Eventable       # Tracking de eventos
  include Searchable      # Full-text search
  include Taggable        # Associações de tags
end
```

**Guidelines**:
- Cada concern: 50-150 linhas
- Deve demonstrar coesão
- Não criar concerns apenas para reduzir tamanho do arquivo
- Nomeie concerns pela capability: `Closeable`, `Watchable`, `Assignable`

### Concern Structure

```ruby
module Card::Closeable
  extend ActiveSupport::Concern

  included do
    has_one :closure, dependent: :destroy
    scope :closed, -> { joins(:closure) }
    scope :open, -> { where.missing(:closure) }
  end

  def closed?
    closure.present?
  end

  def close(user: Current.user)
    unless closed?
      transaction do
        create_closure! user: user
        track_event :closed, creator: user
      end
    end
  end
end
```

### State as Records, Not Booleans

Ao invés de `closed: boolean`, crie records separados:

```ruby
# RUIM: Boolean column
class Card < ApplicationRecord
  scope :closed, -> { where(closed: true) }
end

# BOM: Record separado
class Closure < ApplicationRecord
  belongs_to :card, touch: true
  belongs_to :user, optional: true
  # created_at = quando
  # user = quem
end

class Card < ApplicationRecord
  has_one :closure, dependent: :destroy
  scope :closed, -> { joins(:closure) }
  scope :open, -> { where.missing(:closure) }
end
```

**Benefícios**:
- Timestamps indicando quando mudanças ocorreram
- Identificação de quem fez mudanças
- Scoping simplificado via `joins` e `where.missing`

### Default Values via Lambdas

```ruby
class Card < ApplicationRecord
  belongs_to :account, default: -> { board.account }
  belongs_to :creator, class_name: "User", default: -> { Current.user }
end
```

### Minimal Validations

```ruby
class Account < ApplicationRecord
  validates :name, presence: true  # Só isso
end
```

Use validações contextuais quando necessário:

```ruby
validates :email, format: { with: URI::MailTo::EMAIL_REGEXP }, on: :identity_creation
validates :full_name, presence: true, on: :completion
```

### Let It Crash (Bang Methods)

```ruby
def create
  @comment = @card.comments.create!(comment_params)  # Raise on failure
end
```

### Callbacks Sparingly

Use callbacks apenas para setup/cleanup, não business logic:

```ruby
class MagicLink < ApplicationRecord
  before_validation :generate_code, on: :create
  before_validation :set_expiration, on: :create
end
```

### Scope Naming

Nomes focados em negócio, não SQL:

```ruby
# Bom
scope :active, -> { where.missing(:pop) }
scope :unassigned, -> { where.missing(:assignments) }

# Evite
scope :without_pop, -> { ... }
scope :no_assignments, -> { ... }
```

### POROs (Plain Old Ruby Objects)

Use para lógica de apresentação e operações complexas:

```ruby
# app/models/event/description.rb
class Event::Description
  attr_reader :event

  def initialize(event)
    @event = event
  end

  def to_s
    case event.action
    when "created" then "#{creator_name} created this card"
    when "closed"  then "#{creator_name} closed this card"
    end
  end
end
```

---

## Padrões de Controllers

### Core Philosophy

Controllers são orquestradores. Business logic vive em models.

```ruby
# RUIM
def close
  @card.transaction do
    @card.update!(closed: true)
    Notification.create!(...)
  end
end

# BOM
def close
  @card.close  # Model encapsula a lógica
end
```

### Authorization Pattern

Checks no controller, lógica no model:

```ruby
# Controller
before_action :ensure_can_edit, only: [:edit, :update]

def ensure_can_edit
  head :forbidden unless @card.editable_by?(Current.user)
end

# Model
def editable_by?(user)
  creator == user || user.admin?
end
```

### Reusable Concerns

```ruby
module CardScoped
  extend ActiveSupport::Concern

  included do
    before_action :set_card
  end

  private

  def set_card
    @card = Card.find(params[:card_id])
  end
end
```

---

## Routing

### Everything is CRUD

Converta verbos em substantivos:

| Ação | Resource |
|------|----------|
| Closing | `closure` |
| Watching | `watching` |
| Publishing | `publication` |
| Assigning | `assignment` |

```ruby
# RUIM
resources :cards do
  post :close
  post :reopen
end

# BOM
resources :cards do
  resource :closure, only: [:create, :destroy]
end
```

### Singular vs Plural

- `resource` (singular): um por parent
- `resources` (plural): múltiplos por parent

### Shallow Nesting

```ruby
resources :boards, shallow: true do
  resources :cards do
    resources :comments
  end
end
```

---

## Background Jobs

### Transaction Safety

```ruby
ActiveJob::Base.enqueue_after_transaction_commit = true
```

### Shallow Jobs

Delegue trabalho para métodos do model:

```ruby
class NotifyRecipientsJob < ApplicationJob
  def perform(notifiable)
    notifiable.notify_recipients
  end
end
```

### Error Handling

```ruby
# Erros transientes - retry com backoff
retry_on Net::OpenTimeout, wait: :polynomially_longer

# Erros permanentes - log sem retry
rescue_from Net::SMTPSyntaxError do |error|
  Rails.logger.info("Permanent error: #{error.message}")
end
```

### Convenção `_later` e `_now`

```ruby
def notify_recipients
  Notifier.for(self)&.notify
end

private

def notify_recipients_later
  NotifyRecipientsJob.perform_later(self)
end
```

---

## Testing

### Framework

Minitest + fixtures ao invés de RSpec + FactoryBot (37signals preference). No Victus usamos RSpec, mas os princípios se aplicam.

### Fixtures/Factories

- Carregue dados uma vez, reutilize
- Relações explícitas
- IDs determinísticos

### Test Structure

```ruby
test "closes card and tracks event" do
  assert_difference -> { Event.count } do
    @card.close
  end

  assert @card.closed?
end
```

### Ship with Features

Testes vão no mesmo commit que a feature.

---

## O Que Evitar

### Gems Rejeitadas pela 37signals

| Categoria | Rejeitado | Alternativa |
|-----------|-----------|-------------|
| Auth | Devise | ~150 linhas custom passwordless |
| Authorization | Pundit/CanCanCan | Predicates no model |
| Services | Service objects | Rich domain models |
| Forms | Form objects | Strong parameters |
| Views | ViewComponent | ERB partials |
| Frontend | SPA frameworks | Turbo + Stimulus |
| Queue | Sidekiq | Solid Queue (sem Redis) |
| CSS | Tailwind | Native CSS + cascade layers |
| Testing | RSpec + FactoryBot | Minitest + fixtures |

### Princípio Guia

> "We reach for gems when Rails doesn't provide a solution. But Rails provides most solutions."

Antes de adicionar dependência:
1. Vanilla Rails resolve?
2. Complexidade adicional justifica benefícios?
3. Melhora clareza do código?

---

## Rails 7.1+ Features

### `params.expect`

```ruby
# Antes
params.require(:user).permit(:name, :email)

# Depois
params.expect(user: [:name, :email])
```

Retorna 400 (Bad Request) ao invés de 500 para parâmetros inválidos.

### `normalizes`

```ruby
class Webhook < ApplicationRecord
  normalizes :subscribed_actions,
    with: ->(value) { Array.wrap(value).map(&:to_s).uniq }
end
```

### StringInquirer

```ruby
# Ruim
if event.action == "completed"

# Bom
if event.action.completed?

# Implementation
def action
  self[:action].inquiry
end
```

---

## Caching

### Design Early

Cache reveals architectural issues:
- Não use `Current.user` em cached partials
- Push lógica user-specific para Stimulus controllers

### Write-Time vs Read-Time

Toda manipulação de dados ocorre durante saves, não apresentação:
- Pre-compute roll-ups no write time
- Use `dependent: :delete_all` quando callbacks não são necessários
- Implemente counter caches

---

## Review Patterns (DHH)

Temas comuns em code reviews:

- Questione indireção e abstração desnecessária
- Prefira diretividade (collapsed 6 notifier subclasses into 2)
- Favoreça explicitness over cleverness
- Elimine layers "anêmicos" sem valor
- Database constraints > ActiveRecord validations
- Nomes afirmativos (`active` not `not_deleted`)
