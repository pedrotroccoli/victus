require 'rails_helper'

RSpec.describe Subscription, type: :model do
  describe '#active?' do
    it 'returns true when status is active' do
      subscription = build(:subscription, :active)
      expect(subscription).to be_active
    end

    it 'returns false when status is cancelled' do
      subscription = build(:subscription, :cancelled)
      expect(subscription).not_to be_active
    end

    it 'returns false when status is freezed' do
      subscription = build(:subscription, :freezed)
      expect(subscription).not_to be_active
    end
  end

  describe '#trialing?' do
    it 'returns true when sub_status is trial' do
      subscription = build(:subscription, :trial)
      expect(subscription).to be_trialing
    end

    it 'returns false when sub_status is success' do
      subscription = build(:subscription, sub_status: 'success')
      expect(subscription).not_to be_trialing
    end
  end

  describe '#success?' do
    it 'returns true when sub_status is success' do
      subscription = build(:subscription, sub_status: 'success')
      expect(subscription).to be_success
    end

    it 'returns false when sub_status is trial' do
      subscription = build(:subscription, :trial)
      expect(subscription).not_to be_success
    end
  end

  describe '#cancelled?' do
    it 'returns true when status is cancelled' do
      subscription = build(:subscription, :cancelled)
      expect(subscription).to be_cancelled
    end

    it 'returns false when status is active' do
      subscription = build(:subscription, :active)
      expect(subscription).not_to be_cancelled
    end
  end

  describe '#pending_cancellation?' do
    it 'returns true when sub_status is pending_cancellation' do
      subscription = build(:subscription, :pending_cancellation)
      expect(subscription).to be_pending_cancellation
    end

    it 'returns false when sub_status is success' do
      subscription = build(:subscription, sub_status: 'success')
      expect(subscription).not_to be_pending_cancellation
    end
  end
end
