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
        description: 'Personal assistant and all-in-one organizer API',
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
              phone: { type: :string, nullable: true },
              connected_providers: { type: :array, items: { type: :string } }
            }
          },
          subscription: {
            type: :object,
            nullable: true,
            properties: {
              id: { type: :string },
              status: { type: :string, enum: %w[active cancelled freezed pending] },
              sub_status: { type: :string },
              service_type: { type: :string },
              service_details: { type: :object, nullable: true }
            }
          },
          habit: {
            type: :object,
            properties: {
              _id: { type: :string },
              name: { type: :string },
              description: { type: :string, nullable: true },
              recurrence_type: { type: :string, enum: %w[daily weekly monthly yearly infinite] },
              recurrence_details: { type: :object, nullable: true, properties: { rule: { type: :string } } },
              order: { type: :number, nullable: true },
              delta_enabled: { type: :boolean },
              rule_engine_enabled: { type: :boolean },
              rule_engine_details: { type: :object, nullable: true },
              start_date: { type: :string, format: 'date-time', nullable: true },
              end_date: { type: :string, format: 'date-time', nullable: true },
              finished_at: { type: :string, format: 'date-time', nullable: true },
              paused_at: { type: :string, format: 'date-time', nullable: true },
              last_check: { type: :string, format: 'date-time', nullable: true },
              parent_habit_id: { type: :string, nullable: true },
              habit_category_id: { type: :string, nullable: true },
              account_id: { type: :string },
              created_at: { type: :string, format: 'date-time' },
              updated_at: { type: :string, format: 'date-time' }
            }
          },
          habit_check: {
            type: :object,
            properties: {
              _id: { type: :string },
              habit_id: { type: :string },
              account_id: { type: :string },
              checked: { type: :boolean },
              finished_at: { type: :string, format: 'date-time', nullable: true },
              created_at: { type: :string, format: 'date-time' },
              updated_at: { type: :string, format: 'date-time' }
            }
          },
          habit_category: {
            type: :object,
            properties: {
              _id: { type: :string },
              name: { type: :string },
              order: { type: :number },
              icon: { type: :string, nullable: true },
              account_id: { type: :string },
              created_at: { type: :string, format: 'date-time' },
              updated_at: { type: :string, format: 'date-time' }
            }
          },
          mood: {
            type: :object,
            properties: {
              _id: { type: :string },
              value: { type: :string, enum: %w[terrible bad neutral good great amazing] },
              description: { type: :string, nullable: true },
              hour_block: { type: :integer },
              date: { type: :string, format: :date },
              account_id: { type: :string },
              created_at: { type: :string, format: 'date-time' },
              updated_at: { type: :string, format: 'date-time' }
            }
          },
          plan: {
            type: :object,
            properties: {
              plan_key: { type: :string },
              key: { type: :string },
              price: { type: :string },
              features: {
                type: :array,
                items: {
                  type: :object,
                  properties: {
                    key: { type: :string }
                  }
                }
              }
            }
          },
          auth_response: {
            type: :object,
            properties: {
              message: { type: :string },
              token: { type: :string }
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
