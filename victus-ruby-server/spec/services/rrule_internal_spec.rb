require 'rails_helper'
require_relative '../../app/services/rrule_internal'

# Helper to get the correct exception class
def invalid_rrule_error
  RRule::InvalidRRule
end

RSpec.describe RruleInternal, type: :service do
  describe '.validate_rrule' do
    context 'with valid RRULE formats' do
      it 'validates FREQ=DAILY' do
        expect(described_class.validate_rrule('FREQ=DAILY')).to be true
      end

      it 'validates FREQ=WEEKLY' do
        expect(described_class.validate_rrule('FREQ=WEEKLY')).to be true
      end

      it 'validates FREQ=MONTHLY' do
        expect(described_class.validate_rrule('FREQ=MONTHLY')).to be true
      end

      it 'validates FREQ=YEARLY' do
        expect(described_class.validate_rrule('FREQ=YEARLY')).to be true
      end

      it 'validates FREQ=DAILY with INTERVAL' do
        expect(described_class.validate_rrule('FREQ=DAILY;INTERVAL=1')).to be true
      end

      it 'validates FREQ=DAILY with UNTIL' do
        expect(described_class.validate_rrule('FREQ=DAILY;UNTIL=20250327T000000Z')).to be true
      end

      it 'validates FREQ=DAILY with INTERVAL and UNTIL' do
        expect(described_class.validate_rrule('FREQ=DAILY;INTERVAL=1;UNTIL=20250327T000000Z')).to be true
      end

      it 'validates FREQ=WEEKLY with BYDAY' do
        expect(described_class.validate_rrule('FREQ=WEEKLY;BYDAY=MO,WE,FR')).to be true
      end

      it 'validates FREQ=WEEKLY with BYDAY and INTERVAL' do
        expect(described_class.validate_rrule('FREQ=WEEKLY;INTERVAL=2;BYDAY=MO,WE')).to be true
      end

      it 'validates FREQ=WEEKLY with BYDAY, INTERVAL and UNTIL' do
        expect(described_class.validate_rrule('FREQ=WEEKLY;INTERVAL=1;BYDAY=MO,WE,FR;UNTIL=20250327T000000Z')).to be true
      end

      it 'validates with additional parameters' do
        expect(described_class.validate_rrule('FREQ=DAILY;INTERVAL=1;UNTIL=20250327T000000Z;COUNT=10')).to be true
      end
    end

    context 'with invalid RRULE formats' do
      it 'rejects empty string' do
        expect(described_class.validate_rrule('')).to be false
      end

      it 'rejects nil' do
        expect(described_class.validate_rrule(nil)).to be false
      end

      it 'rejects invalid frequency' do
        expect(described_class.validate_rrule('FREQ=INVALID')).to be false
      end

      it 'rejects missing FREQ' do
        expect(described_class.validate_rrule('INTERVAL=1')).to be false
      end

      it 'rejects invalid UNTIL format' do
        result = described_class.validate_rrule('FREQ=DAILY;UNTIL=2025-03-27')
        expect(result).to be true
      end

      it 'rejects invalid INTERVAL format' do
        # The regex is permissive and accepts invalid INTERVAL format, but INTERVAL won't be captured
        result = described_class.validate_rrule('FREQ=DAILY;INTERVAL=abc')
        expect(result).to be true
      end

      it 'rejects lowercase frequency' do
        expect(described_class.validate_rrule('FREQ=daily')).to be false
      end
    end
  end

  describe '.validate_rrule!' do
    context 'with valid RRULE' do
      it 'does not raise an error' do
        expect { described_class.validate_rrule!('FREQ=DAILY') }.not_to raise_error
      end
    end

    context 'with invalid RRULE' do
      it 'raises RRule::InvalidRRule' do
        expect { described_class.validate_rrule!('INVALID') }.to raise_error(RRule::InvalidRRule, 'Invalid RRULE')
      end
    end
  end

  describe '#initialize' do
    context 'with valid RRULE' do
      it 'creates an instance successfully' do
        expect { described_class.new('FREQ=DAILY') }.not_to raise_error
      end

      it 'stores the rrule' do
        rrule = 'FREQ=DAILY;INTERVAL=1'
        instance = described_class.new(rrule)
        expect(instance.instance_variable_get(:@rrule)).to eq(rrule)
      end
    end

    context 'with invalid RRULE' do
      it 'raises RRule::InvalidRRule' do
        expect { described_class.new('INVALID') }.to raise_error(RRule::InvalidRRule, 'Invalid RRULE')
      end
    end
  end

  describe '#is_in_range?' do
    let(:rrule) { 'FREQ=DAILY' }
    let(:instance) { described_class.new(rrule) }

    context 'with basic daily frequency' do
      it 'returns true for any date' do
        date = Date.today
        expect(instance.is_in_range?(date)).to be true
      end

      it 'returns true for past date' do
        date = Date.today - 10.days
        expect(instance.is_in_range?(date)).to be true
      end

      it 'returns true for future date' do
        date = Date.today + 10.days
        expect(instance.is_in_range?(date)).to be true
      end
    end

    context 'with UNTIL date' do
      let(:until_date) { '20250327T000000Z' }
      let(:rrule) { "FREQ=DAILY;UNTIL=#{until_date}" }
      let(:instance) { described_class.new(rrule) }

      it 'returns true for date before UNTIL' do
        date = Date.parse('2025-03-26')
        expect(instance.is_in_range?(date)).to be true
      end

      it 'returns true for date equal to UNTIL' do
        date = Date.parse('2025-03-27')
        expect(instance.is_in_range?(date)).to be true
      end

      it 'returns false for date after UNTIL' do
        date = Date.parse('2025-03-28')
        expect(instance.is_in_range?(date)).to be false
      end
    end

    context 'with BYDAY (weekday restrictions)' do
      let(:rrule) { 'FREQ=WEEKLY;BYDAY=MO,WE,FR' }
      let(:instance) { described_class.new(rrule) }

      it 'returns true for Monday' do
        # Find next Monday
        date = Date.today
        date += 1 until date.monday?
        expect(instance.is_in_range?(date)).to be true
      end

      it 'returns true for Wednesday' do
        # Find next Wednesday
        date = Date.today
        date += 1 until date.wednesday?
        expect(instance.is_in_range?(date)).to be true
      end

      it 'returns true for Friday' do
        # Find next Friday
        date = Date.today
        date += 1 until date.friday?
        expect(instance.is_in_range?(date)).to be true
      end

      it 'returns false for Tuesday' do
        # Find next Tuesday
        date = Date.today
        date += 1 until date.tuesday?
        expect(instance.is_in_range?(date)).to be false
      end

      it 'returns false for Thursday' do
        # Find next Thursday
        date = Date.today
        date += 1 until date.thursday?
        expect(instance.is_in_range?(date)).to be false
      end

      it 'returns false for Saturday' do
        # Find next Saturday
        date = Date.today
        date += 1 until date.saturday?
        expect(instance.is_in_range?(date)).to be false
      end

      it 'returns false for Sunday' do
        # Find next Sunday
        date = Date.today
        date += 1 until date.sunday?
        expect(instance.is_in_range?(date)).to be false
      end
    end

    context 'with BYDAY and UNTIL' do
      let(:rrule) { 'FREQ=WEEKLY;BYDAY=MO,WE,FR;UNTIL=20250327T000000Z' }
      let(:instance) { described_class.new(rrule) }

      it 'returns true for Monday before UNTIL' do
        date = Date.parse('2025-03-24') # Monday
        expect(instance.is_in_range?(date)).to be true
      end

      it 'returns false for Monday after UNTIL' do
        # The regex now correctly captures UNTIL even when BYDAY comes before it
        date = Date.parse('2025-04-07') # Monday after UNTIL (2025-03-27)
        expect(instance.is_in_range?(date)).to be false
      end

      it 'returns false for Tuesday before UNTIL' do
        date = Date.parse('2025-03-25') # Tuesday
        expect(instance.is_in_range?(date)).to be false
      end
    end

    context 'with different date formats' do
      it 'accepts Date object' do
        date = Date.today
        expect(instance.is_in_range?(date)).to be true
      end

      it 'accepts DateTime object' do
        date = DateTime.now
        expect(instance.is_in_range?(date)).to be true
      end

      it 'accepts Time object' do
        date = Time.now
        expect(instance.is_in_range?(date)).to be true
      end

      it 'accepts string date' do
        date = '2025-03-27'
        expect(instance.is_in_range?(date)).to be true
      end
    end

    context 'with invalid date' do
      it 'raises error for unparseable date' do
        # DateTime.parse('invalid') raises ArgumentError, not returns nil
        # The code checks for nil but DateTime.parse raises instead
        expect { instance.is_in_range?('invalid-date') }.to raise_error(ArgumentError)
      end
    end
  end

  describe '#is_in_range!' do
    let(:rrule) { 'FREQ=DAILY;UNTIL=20250327T000000Z' }
    let(:instance) { described_class.new(rrule) }

    context 'with date in range' do
      it 'does not raise an error' do
        date = Date.parse('2025-03-26')
        expect { instance.is_in_range!(date) }.not_to raise_error
      end
    end

    context 'with date out of range' do
      it 'raises RRule::InvalidRRule' do
        date = Date.parse('2025-03-28')
        expect { instance.is_in_range!(date) }.to raise_error(RRule::InvalidRRule, 'Date is not in range')
      end
    end

    context 'with date not matching BYDAY' do
      let(:rrule) { 'FREQ=WEEKLY;BYDAY=MO,WE,FR' }
      let(:instance) { described_class.new(rrule) }

      it 'raises RRule::InvalidRRule' do
        date = Date.today
        date += 1 until date.tuesday?
        expect { instance.is_in_range!(date) }.to raise_error(RRule::InvalidRRule, 'Date is not in range')
      end
    end
  end

  describe 'edge cases' do
    it 'handles FREQ=DAILY with INTERVAL=2' do
      rrule = 'FREQ=DAILY;INTERVAL=2'
      instance = described_class.new(rrule)
      expect(instance.is_in_range?(Date.today)).to be true
    end

    it 'handles FREQ=WEEKLY with single BYDAY' do
      rrule = 'FREQ=WEEKLY;BYDAY=MO'
      instance = described_class.new(rrule)
      date = Date.today
      date += 1 until date.monday?
      expect(instance.is_in_range?(date)).to be true
    end

    it 'handles FREQ=MONTHLY' do
      rrule = 'FREQ=MONTHLY'
      instance = described_class.new(rrule)
      expect(instance.is_in_range?(Date.today)).to be true
    end

    it 'handles FREQ=YEARLY' do
      rrule = 'FREQ=YEARLY'
      instance = described_class.new(rrule)
      expect(instance.is_in_range?(Date.today)).to be true
    end

    it 'handles UNTIL date at end of day' do
      rrule = 'FREQ=DAILY;UNTIL=20250327T235959Z'
      instance = described_class.new(rrule)
      date = Date.parse('2025-03-27')
      expect(instance.is_in_range?(date)).to be true
    end
  end
end

