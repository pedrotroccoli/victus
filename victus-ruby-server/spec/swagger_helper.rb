# frozen_string_literal: true

require 'rails_helper'

RSpec.configure do |config|
  config.openapi_root = Rails.root.join('swagger').to_s

  config.openapi_specs = {
    'v1/swagger.yaml' => {
      openapi: '3.0.1',
      info: {
        title: 'Victus API V1',
        version: 'v1',
        description: 'Habit tracking API with subscription management',
        contact: {
          name: 'Victus Team'
        }
      },
      paths: {},
      servers: [
        {
          url: 'http://localhost:3000',
          description: 'Development server'
        },
        {
          url: 'https://api.victus.app',
          description: 'Production server'
        }
      ],
      components: {
        securitySchemes: {
          bearer_auth: {
            type: :http,
            scheme: :bearer,
            bearerFormat: :JWT,
            description: 'JWT token from sign-in or sign-up'
          }
        },
        schemas: {
          error: {
            type: :object,
            properties: {
              error: { type: :string },
              message: { type: :string }
            }
          },
          account: {
            type: :object,
            properties: {
              id: { type: :string },
              email: { type: :string, format: :email },
              name: { type: :string },
              created_at: { type: :string, format: 'date-time' },
              updated_at: { type: :string, format: 'date-time' }
            }
          },
          subscription: {
            type: :object,
            properties: {
              id: { type: :string },
              status: { type: :string, enum: %w[active inactive trial canceled] },
              stripe_subscription_id: { type: :string },
              current_period_start: { type: :string, format: 'date-time' },
              current_period_end: { type: :string, format: 'date-time' }
            }
          },
          habit: {
            type: :object,
            properties: {
              id: { type: :string },
              name: { type: :string },
              description: { type: :string },
              emoji: { type: :string },
              recurrence: { type: :string, description: 'RRULE format' },
              goal: { type: :integer },
              metric: { type: :string },
              category_id: { type: :string },
              rule_engine_enabled: { type: :boolean },
              rule_engine_details: { type: :object },
              created_at: { type: :string, format: 'date-time' },
              updated_at: { type: :string, format: 'date-time' }
            },
            required: %w[name recurrence]
          },
          habit_check: {
            type: :object,
            properties: {
              id: { type: :string },
              habit_id: { type: :string },
              checked_at: { type: :string, format: 'date-time' },
              value: { type: :number },
              notes: { type: :string }
            }
          },
          habit_category: {
            type: :object,
            properties: {
              id: { type: :string },
              name: { type: :string },
              color: { type: :string }
            }
          },
          mood: {
            type: :object,
            properties: {
              id: { type: :string },
              score: { type: :integer, minimum: 1, maximum: 5 },
              notes: { type: :string },
              recorded_at: { type: :string, format: 'date-time' }
            }
          },
          plan: {
            type: :object,
            properties: {
              id: { type: :string },
              name: { type: :string },
              price: { type: :number },
              currency: { type: :string },
              interval: { type: :string }
            }
          },
          auth_response: {
            type: :object,
            properties: {
              token: { type: :string },
              account: { '$ref' => '#/components/schemas/account' },
              subscription: { '$ref' => '#/components/schemas/subscription' }
            }
          }
        }
      },
      tags: [
        { name: 'Authentication', description: 'Sign in, sign up, and Web3 auth' },
        { name: 'Account', description: 'Current user profile' },
        { name: 'Habits', description: 'Habit CRUD operations' },
        { name: 'Habit Checks', description: 'Track habit completions' },
        { name: 'Categories', description: 'Habit categories' },
        { name: 'Mood', description: 'Mood tracking' },
        { name: 'Subscription', description: 'Stripe subscription management' },
        { name: 'Plans', description: 'Available subscription plans' }
      ]
    }
  }

  config.openapi_format = :yaml
end
