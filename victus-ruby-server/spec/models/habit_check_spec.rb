require 'rails_helper'

RSpec.describe HabitCheck, type: :model do
  let(:account) { create(:account) }
  let(:habit) { create(:habit, account: account) }

  describe 'associations' do
    it 'belongs to habit' do
      habit_check = HabitCheck.new(habit: habit, account: account, checked: true)
      expect(habit_check.habit).to eq(habit)
    end

    it 'belongs to account' do
      habit_check = HabitCheck.new(habit: habit, account: account, checked: true)
      expect(habit_check.account).to eq(account)
    end

    it 'embeds many habit_check_deltas' do
      habit_check = create(:habit_check, habit: habit, account: account, checked: true)
      delta = habit_check.habit_check_deltas.build(habit_delta_id: '123', value: '10')
      expect(habit_check.habit_check_deltas).to include(delta)
    end
  end

  describe 'validations' do
    describe 'checked field' do
      it 'validates presence of checked' do
        habit_check = HabitCheck.new(habit: habit, account: account, checked: nil)
        expect(habit_check).not_to be_valid
        expect(habit_check.errors[:checked]).to include("can't be blank")
      end

      it 'is valid with checked as true when habit has valid recurrence rule' do
        habit_with_rule = create(:habit, account: account, recurrence_details: { rule: 'FREQ=DAILY' })
        habit_check = HabitCheck.new(habit: habit_with_rule, account: account, checked: true)
        expect(habit_check).to be_valid
      end

      it 'is valid with checked as false when habit has valid recurrence rule' do
        habit_with_rule = create(:habit, account: account, recurrence_details: { rule: 'FREQ=DAILY' })
        habit_check = HabitCheck.new(habit: habit_with_rule, account: account, checked: false)
        expect(habit_check).to be_valid
      end
    end
  end

  describe 'validate_time' do
    let(:habit_with_rule) do
      create(:habit, 
        account: account,
        recurrence_details: { rule: 'FREQ=DAILY' }
      )
    end

    context 'when habit has no recurrence rule' do
      let(:habit_no_rule) do
        create(:habit, 
          account: account,
          recurrence_details: {}
        )
      end

      it 'adds error when recurrence_details rule is missing' do
        habit_check = HabitCheck.new(
          habit: habit_no_rule,
          account: account,
          checked: true
        )
        
        expect(habit_check).not_to be_valid
        expect(habit_check.errors[:habit_rule]).to include("Habit has no recurrence rule")
      end
    end

    context 'when habit check is out of date range' do
      let(:habit_with_until) do
        create(:habit,
          account: account,
          recurrence_details: { rule: 'FREQ=DAILY;UNTIL=20200101T000000Z' }
        )
      end

      it 'adds error when date is after UNTIL date' do
        habit_check = HabitCheck.new(
          habit: habit_with_until,
          account: account,
          checked: true
        )

        expect(habit_check).not_to be_valid
        expect(habit_check.errors[:out_of_date_range]).to include("Habit check is out of date range")
      end
    end

    context 'when habit check is within date range' do
      it 'is valid when date is within range' do
        habit_check = HabitCheck.new(
          habit: habit_with_rule,
          account: account,
          checked: true
        )

        expect(habit_check).to be_valid
      end
    end

    context 'when checked is true' do
      it 'sets finished_at to current time' do
        current_time = Time.current
        allow(Time).to receive(:now).and_return(current_time)

        habit_check = HabitCheck.new(
          habit: habit_with_rule,
          account: account,
          checked: true
        )
        habit_check.valid?

        # finished_at should be set even if validation fails
        # Mongoid converts Time to DateTime, so we check for DateTime
        expect(habit_check.finished_at).not_to be_nil
        expect(habit_check.finished_at).to be_a(DateTime)
        expect(habit_check.finished_at.to_i).to be_within(1).of(current_time.to_i)
      end
    end

    context 'when checked is false' do
      it 'sets finished_at to nil' do
        habit_check = HabitCheck.new(
          habit: habit_with_rule,
          account: account,
          checked: false
        )
        habit_check.valid?

        expect(habit_check.finished_at).to be_nil
      end
    end
  end

  describe 'rule_engine_validation' do
    context 'when rule_engine is disabled' do
      let(:habit_no_engine) do
        create(:habit,
          account: account,
          rule_engine_enabled: false,
          recurrence_details: { rule: 'FREQ=DAILY' }
        )
      end

      it 'does not validate rule engine' do
        habit_check = HabitCheck.new(
          habit: habit_no_engine,
          account: account,
          checked: true
        )

        expect(habit_check).to be_valid
      end
    end

    context 'when rule_engine is enabled with AND logic' do
      let(:child_habit1) { create(:habit, account: account, recurrence_details: { rule: 'FREQ=DAILY' }) }
      let(:child_habit2) { create(:habit, account: account, recurrence_details: { rule: 'FREQ=DAILY' }) }
      
      let(:parent_habit) do
        create(:habit,
          account: account,
          rule_engine_enabled: true,
          rule_engine_details: {
            logic: {
              type: 'and',
              and: [child_habit1.id.to_s, child_habit2.id.to_s]
            }
          },
          recurrence_details: { rule: 'FREQ=DAILY' }
        )
      end

      context 'when not all habit checks are present' do
        it 'adds error when some habit checks are missing' do
          # Create only one habit check for child_habit1
          create(:habit_check, habit: child_habit1, account: account, checked: true)

          habit_check = HabitCheck.new(
            habit: parent_habit,
            account: account,
            checked: true
          )

          expect(habit_check).not_to be_valid
          expect(habit_check.errors[:rule_engine]).to include("Not all habit checks are present")
        end
      end

      context 'when all habit checks are present but not all are checked' do
        it 'adds error when not all children are checked' do
          # Create habit checks but one is not checked
          create(:habit_check, habit: child_habit1, account: account, checked: true)
          create(:habit_check, habit: child_habit2, account: account, checked: false)

          habit_check = HabitCheck.new(
            habit: parent_habit,
            account: account,
            checked: true
          )

          # Should be invalid because not all children are checked
          expect(habit_check).not_to be_valid
          expect(habit_check.errors[:rule_engine]).to include("Not all habit checks children are checked")
        end
      end

      context 'when all habit checks are present and all are checked' do
        it 'is valid when all children are checked' do
          # Create habit checks and both are checked
          create(:habit_check, habit: child_habit1, account: account, checked: true)
          create(:habit_check, habit: child_habit2, account: account, checked: true)

          habit_check = HabitCheck.new(
            habit: parent_habit,
            account: account,
            checked: true
          )

          expect(habit_check).to be_valid
          expect(habit_check.errors[:rule_engine]).not_to include("Not all habit checks children are checked")
        end
      end
    end

    context 'when rule_engine is enabled with OR logic' do
      let(:child_habit1) { create(:habit, account: account, recurrence_details: { rule: 'FREQ=DAILY' }) }
      let(:child_habit2) { create(:habit, account: account, recurrence_details: { rule: 'FREQ=DAILY' }) }

      let(:parent_habit) do
        create(:habit,
          account: account,
          rule_engine_enabled: true,
          rule_engine_details: {
            logic: {
              type: 'or',
              or: [child_habit1.id.to_s, child_habit2.id.to_s]
            }
          },
          recurrence_details: { rule: 'FREQ=DAILY' }
        )
      end

      context 'when only one child habit check is present and checked' do
        it 'is valid because OR only requires at least one child to be checked' do
          # Create only one habit check for child_habit1 with checked=true
          create(:habit_check, habit: child_habit1, account: account, checked: true)

          habit_check = HabitCheck.new(
            habit: parent_habit,
            account: account,
            checked: true
          )

          expect(habit_check).to be_valid
        end
      end

      context 'when no children are checked' do
        it 'adds error when no children are checked' do
          # No habit checks at all
          habit_check = HabitCheck.new(
            habit: parent_habit,
            account: account,
            checked: true
          )

          expect(habit_check).not_to be_valid
          expect(habit_check.errors[:rule_engine]).to include("At least one habit check child must be checked")
        end

        it 'adds error when children have checks but none are checked=true' do
          # Create habit checks but none are checked
          create(:habit_check, habit: child_habit1, account: account, checked: false)
          create(:habit_check, habit: child_habit2, account: account, checked: false)

          habit_check = HabitCheck.new(
            habit: parent_habit,
            account: account,
            checked: true
          )

          expect(habit_check).not_to be_valid
          expect(habit_check.errors[:rule_engine]).to include("At least one habit check child must be checked")
        end
      end

      context 'when at least one child is checked' do
        it 'is valid when one child is checked' do
          # Create habit checks, one is checked
          create(:habit_check, habit: child_habit1, account: account, checked: true)
          create(:habit_check, habit: child_habit2, account: account, checked: false)

          habit_check = HabitCheck.new(
            habit: parent_habit,
            account: account,
            checked: true
          )

          expect(habit_check).to be_valid
        end

        it 'is valid when all children are checked' do
          # Create habit checks and both are checked
          create(:habit_check, habit: child_habit1, account: account, checked: true)
          create(:habit_check, habit: child_habit2, account: account, checked: true)

          habit_check = HabitCheck.new(
            habit: parent_habit,
            account: account,
            checked: true
          )

          expect(habit_check).to be_valid
        end
      end
    end
  end

  describe 'default values' do
    it 'has checked default to false' do
      habit_check = HabitCheck.new(habit: habit, account: account)
      expect(habit_check.checked).to eq(false)
    end

    it 'has finished_at default to nil' do
      habit_check = HabitCheck.new(habit: habit, account: account)
      expect(habit_check.finished_at).to be_nil
    end
  end

  describe 'Mongoid features' do
    it 'includes Mongoid::Document' do
      expect(HabitCheck.included_modules).to include(Mongoid::Document)
    end

    it 'includes Mongoid::Timestamps' do
      expect(HabitCheck.included_modules).to include(Mongoid::Timestamps)
    end

    it 'includes Mongoid::Paranoia' do
      expect(HabitCheck.included_modules).to include(Mongoid::Paranoia)
    end
  end
end

