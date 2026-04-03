# Architecture Refactor Plan

> Plano para alinhar o projeto com os padrões do [Compass](compass/index.md).
> Este documento é apenas um plano. Nada será implementado até aprovação.

---

## 1. Routing — Tudo deveria ser CRUD

**Problema**: Rotas manuais com `get/post/put/delete` em vez de `resources`. Rotas duplicadas (habits declarados manualmente E com `resources`). URLs com hifens (`habits-check`) em vez de underscores.

**Arquivo**: `config/routes.rb`

**Antes**:
```ruby
get 'habits/:id', to: 'habits#show'
get 'habits', to: 'habits#index'
post 'habits', to: 'habits#create'
put 'habits/:id', to: 'habits#update'
delete 'habits/:id', to: 'habits#destroy'
resources :habits  # DUPLICADO!

get 'habits-check', to: 'habits_check#all'
get 'habits-check/:habit_id', to: 'habits_check#index'
post 'habits-check/:habit_id', to: 'habits_check#create'

post 'checkout/create', to: 'checkout#create'
post 'subscription/cancel', to: 'subscription#cancel'
post 'subscription/create_session', to: 'subscription#create_session'
```

**Depois**:
```ruby
namespace :api do
  namespace :v1 do
    scope module: :private do
      resource :me, only: [:show, :update], controller: 'me'
      resources :habits do
        resources :checks, controller: 'habits_check', only: [:index, :show, :create, :update]
      end
      resources :checks, controller: 'habits_check', only: [:index]  # GET /checks (all)
      resources :habits_categories, only: [:index, :create, :update, :destroy]
      resources :moods
      resources :plans, only: [:index]
      resource :checkout, only: [:create]
      resource :subscription, only: [:show] do
        resource :cancellation, only: [:create]     # POST cancel
        resource :session, only: [:create]           # POST create_session
      end
    end

    scope module: :public do
      resource :sign_in, only: [:create], controller: 'auth/sign_in'
      resource :sign_up, only: [:create], controller: 'auth/sign_up'
      resource :siwe, only: [:show, :create], controller: 'auth/siwe'    # GET nonce, POST verify
      resource :google_auth, only: [:create], controller: 'auth/google'
    end

    scope module: :internal do
      resource :stripe_webhook, only: [:create]
    end
  end
end
```

**Mudanças-chave**:
- Remover rotas duplicadas de habits
- `habits-check` → nested resource `habits/:habit_id/checks`
- `subscription/cancel` → `subscription/cancellation` (noun, not verb)
- `subscription/create_session` → `subscription/session` (CRUD)
- `auth/sign-in` e `auth/sign-up` → resources separados
- `namespace` em vez de `scope` para API versionamento correto

---

## 2. Controllers — Gordos demais, lógica de negócio vazando

### 2.1 `ApplicationController` — Auth não deveria estar aqui

**Problema**: `authorize_request` e `check_subscription` estão no `ApplicationController`, mas só são usados por controllers privados. Isso polui o controller base.

**Solução**: Mover `authorize_request` e `check_subscription` para dentro do concern `ActiveAndAuthorized`. O `ApplicationController` deve ser mínimo.

**Arquivo**: `app/controllers/application_controller.rb`

**Antes**: Auth + subscription logic no ApplicationController
**Depois**: `ApplicationController` só com `ActionController::API` (não `ActionController::Base`!) e configuração global.

Bonus: Trocar `ActionController::Base` por `ActionController::API` — é uma API, não precisa de CSRF, cookies, sessions.

### 2.2 `AuthController` — 230 linhas, 4 auth methods, zero extração

**Problema**: Um único controller com `sign_in`, `sign_up`, `start_siwe_auth`, `siwe_verify`, `google_auth`. Cada método tem 30-60 linhas de business logic inline. Viola "thin controllers".

**Solução**: Separar em controllers por método de auth:
- `Public::Auth::SignInController` — email/password sign in
- `Public::Auth::SignUpController` — email/password sign up
- `Public::Auth::SiweController` — SIWE nonce + verify
- `Public::Auth::GoogleController` — Google OAuth

Extrair lógica para o model `Account`:
```ruby
class Account
  def self.authenticate_with_email(email, password)
    account = find_by(email: email)
    account if account&.authenticate(password)
  end

  def self.find_or_create_from_google(payload)
    # lógica de merge por google_id/email
  end

  def self.find_or_create_from_siwe(address)
    # lógica de find_or_create_by world_address
  end

  def generate_jwt
    JWT.encode({ account_id: id }, ENV['JWT_SECRET'], 'HS256')
  end

  def ensure_provider(provider)
    unless connected_providers.include?(provider)
      connected_providers << provider
      save!
    end
  end
end
```

### 2.3 `CheckoutController` — 95 linhas de Stripe logic inline

**Problema**: Toda a lógica de checkout (criar customer, verificar subscription, criar session) está no controller.

**Solução**: Mover para `Account` ou para uma Operation `Checkout::Create`:
```ruby
class Account
  def create_stripe_checkout(lookup_key:)
    # toda a lógica de checkout
  end
end
```

### 2.4 `SubscriptionController` — Stripe calls no controller

**Problema**: `show`, `cancel`, `create_session` fazem chamadas diretas ao Stripe no controller.

**Solução**: Mover para `Subscription` model ou Operations:
```ruby
class Subscription
  def stripe_details
    # fetch from Stripe
  end

  def cancel!(immediate: false, reason: nil)
    # cancel logic
  end
end
```

### 2.5 `HabitsCheckController` — `update` com 20 linhas de delta manipulation

**Problema**: O `update` do HabitsCheckController tem lógica complexa de merge/create/destroy de deltas inline.

**Solução**: Extrair para o model `HabitCheck`:
```ruby
class HabitCheck
  def sync_deltas(deltas_attributes)
    # merge/create/destroy logic
  end
end
```

### 2.6 `HabitsCategoryController` — Sem tenant scoping no update/destroy

**Problema**: `update` e `destroy` usam `HabitCategory.find(params[:id])` sem scoping por account. **Falha de segurança** — qualquer usuário pode editar/deletar categorias de outros.

**Solução**: Sempre scoper por `@current_account`:
```ruby
def set_category
  @category = HabitCategory.where(account_id: @current_account.id).find(params[:id])
end
```

---

## 3. Models — Lógica faltando, concerns subutilizados

### 3.1 `Account` — Muito magro, deveria ser mais rico

**Problema**: Account tem quase zero lógica de negócio. Toda a lógica de auth, checkout, subscription está nos controllers.

**Solução**: Mover para Account:
- `Account#generate_jwt`
- `Account#authenticate_with_email`
- `Account#ensure_provider(provider)`
- `Account#subscription_active?`
- `Account.find_or_create_from_google(payload)`
- `Account.find_or_create_from_siwe(address)`

### 3.2 `Subscription` — Sem métodos de domínio

**Problema**: Status é verificado com string comparison inline nos controllers (`status != 'active'`). Sem predicates.

**Solução**:
```ruby
class Subscription
  def active?
    status == 'active'
  end

  def trialing?
    sub_status == 'trial'
  end

  def pending_cancellation?
    sub_status == 'pending_cancellation'
  end
end
```

### 3.3 `Habit` — Business logic ok, falta scopes

**Problema**: Não tem scopes de negócio. Queries ficam nos controllers (`where(:start_date.lte => end_date)`).

**Solução**: Adicionar scopes:
```ruby
class Habit
  scope :active, -> { where(finished_at: nil, paused_at: nil) }
  scope :paused, -> { where(:paused_at.ne => nil) }
  scope :finished, -> { where(:finished_at.ne => nil) }
  scope :in_range, ->(start_date, end_date) {
    where(:start_date.lte => end_date).any_of(
      { :end_date.gte => start_date },
      { :end_date => nil }
    )
  }
  scope :ordered, -> { order_by(order: :asc) }
  scope :preloaded, -> { includes(:habit_category) }
end
```

### 3.4 `HabitCheck` — Lógica de validação muito complexa inline

**Problema**: `and_validation` e `or_validation` fazem queries no validate, acopladas a `Time.current`. Difícil de testar.

**Solução**: Extrair para concern `RuleEngineValidatable` ou methods mais limpos que aceitem a data como parâmetro.

### 3.5 `Mongoid::Paranoia` — Soft deletes

**Problema**: Habit, HabitCheck, HabitCheckDelta, HabitDelta, Mood, Subscription usam `Mongoid::Paranoia` (soft deletes). O compass diz "hard deletes + audit logs".

**Decisão necessária**: Manter Paranoia (praticidade) ou migrar para hard deletes + audit logs (compass)?
- Já existe `Auditable` concern — mas não está em todos os models
- Paranoia adiciona complexidade (`deleted_at`, scoping automático)

### 3.6 `ApplicationRecord` — Deveria ser removido

**Problema**: `ApplicationRecord < ActiveRecord::Base` existe mas o projeto usa Mongoid, não ActiveRecord. Código morto.

---

## 4. Services — Avaliar necessidade

### 4.1 `StripeService` — Wrapper fino sobre a gem

**Problema**: `StripeService` é um wrapper 1:1 sobre a Stripe gem. Cada método apenas delega para `Stripe::*`. Segundo o compass, isso é abstração desnecessária.

**Opções**:
- **A**: Remover e chamar `Stripe::*` diretamente (compass puro)
- **B**: Manter — isola Stripe da business logic, facilita mock em testes

### 4.2 `EmailService` — Deveria ser model method ou job

**Problema**: `EmailService` é chamado pelo `EmailJob`. Poderia ser um método no Account.

**Solução**: Mover para `Account#send_welcome_email` ou manter como service (já que é integração externa).

### 4.3 `RruleInternal` e `DateInternal` — Ok como POROs

Estes são utilities legítimos, não service objects. Podem ficar em `app/services/` ou mover para `app/models/` (mais alinhado ao compass).

---

## 5. Operations & Contracts — Inconsistência

**Problema**: Só `Habits::Create` usa Trailblazer Operation. Todos os outros CRUDs (HabitCheck, Mood, Category, etc.) fazem tudo inline no controller.

**Decisão**:
- **A**: Adotar Operations para TODOS os creates/updates complexos (consistência)
- **B**: Remover Trailblazer, usar model methods (compass puro)
- **C**: Manter Operations apenas para fluxos complexos (habits create), model methods para o resto

---

## 6. Background Jobs

### 6.1 `EmailJob` — Sem error handling

**Problema**: Nenhum `retry_on` ou `discard_on`. Se a entrega de email falhar, o job vai pro dead queue sem contexto.

**Solução**: Migrado para Resend + Action Mailer. Error handling implementado:
```ruby
class EmailJob < ApplicationJob
  retry_on Net::OpenTimeout, Net::ReadTimeout, wait: :polynomially_longer, attempts: 3
  discard_on ActiveJob::DeserializationError

  def perform(account_id)
    account = Account.find(account_id)
    AccountMailer.with(account: account).welcome_email.deliver_now
  end
end
```

---

## 7. Segurança

### 7.1 `ActionController::Base` → `ActionController::API`

**Problema**: Herda de `ActionController::Base` com `protect_from_forgery` e depois `skip_before_action :verify_authenticity_token`. É uma API — não precisa de CSRF.

### 7.2 Tenant scoping falho no `HabitsCategoryController`

**Arquivo**: `app/controllers/private/habits_category_controller.rb:19,26`

`update` e `destroy` usam `HabitCategory.find(params[:id])` sem scoping. **Qualquer usuário autenticado pode editar/deletar categorias de outros accounts.**

### 7.3 `rescue Exception => e` no `AuthController#siwe_verify`

**Problema**: Captura `Exception` (inclui `SystemExit`, `NoMemoryError`). Deveria ser `StandardError`.

### 7.4 JWT sem expiração

**Problema**: `JWT.encode({ account_id: account.id }, ...)` sem `exp` claim. Tokens nunca expiram.

**Solução**: Adicionar `exp: 24.hours.from_now.to_i` ao payload.

### 7.5 `WEBHOOK_SECRET` como constante global

**Problema**: `WEBHOOK_SECRET = ENV['STRIPE_WEBHOOK_SECRET']` está no nível do arquivo, fora da classe. Deveria ser lido dentro do método.

---

## 8. Observabilidade

### 8.1 `puts` no lugar de logging

**Problema**: `EmailService` usa `puts` para erros. Deveria usar `Rails.logger.error`.

### 8.2 Sem structured logging

**Problema**: Não há structured logging. Logs são strings soltas.

---

## 9. Testing Gaps

### 9.1 Sem testes para:
- `StripeWebhookController`
- `CheckoutController`
- `SubscriptionController`
- `AuthController#google_auth`
- `AuthController#siwe_verify`
- `Auditable` concern
- `RruleInternal`

(Verificar cobertura real nos specs existentes)

---

## 10. Ordem de Execução Sugerida

### Fase 1 — Segurança (urgente)
1. Fix tenant scoping no `HabitsCategoryController`
2. Adicionar JWT expiration
3. `rescue Exception` → `rescue StandardError`
4. `WEBHOOK_SECRET` → dentro do método

### Fase 2 — Foundation
5. `ActionController::Base` → `ActionController::API`
6. Mover auth logic do `ApplicationController` para `ActiveAndAuthorized`
7. Remover `ApplicationRecord` (código morto)
8. Enriquecer models: `Account#generate_jwt`, `Subscription#active?`, `Habit` scopes

### Fase 3 — Controllers
9. Extrair methods do `AuthController` para `Account` model (manter 1 controller)
10. Extrair checkout/subscription logic para models (chamar `Stripe::*` direto)
11. Remover `StripeService` — chamar Stripe gem diretamente
12. Extrair delta manipulation do `HabitsCheckController` para model
13. Fix error handling no `EmailJob`

### Fase 4 — Operations → Model Methods
14. Mover `Habits::Create` operation para `Account#create_habit` ou `Habit` class method
15. Remover Trailblazer + Dry-Validation, usar validações no model
16. Remover `app/operations/` e `app/contracts/`

### Fase 5 — Routing
17. Reescrever `routes.rb` com `resources` e `namespace`
18. Remover rotas duplicadas

### Fase 6 — Cleanup
19. `puts` → `Rails.logger`
20. Structured logging

### Fase 7 — Testes
21. Testes para controllers sem cobertura
22. Testes de segurança (tenant isolation)

---

## Decisões Tomadas

| # | Decisão | Resultado |
|---|---------|-----------|
| 1 | Soft deletes (Paranoia) vs Hard deletes | **Manter Paranoia** — já está em 6 models, funciona |
| 2 | StripeService | **Remover** — chamar `Stripe::*` direto, sem wrapper |
| 3 | Trailblazer Operations | **Remover** — mover lógica para model methods |
| 4 | AuthController | **Manter 1 controller** — extrair methods para `Account` model |
