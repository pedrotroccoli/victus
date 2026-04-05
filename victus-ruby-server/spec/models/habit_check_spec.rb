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

  describe '#sync_deltas' do
    let(:habit_with_deltas) do
      h = create(:habit, account: account)
      h.habit_deltas.create(type: 'number', name: 'Delta 1')
      h.habit_deltas.create(type: 'number', name: 'Delta 2')
      h
    end
    let(:habit_check) { create(:habit_check, habit: habit_with_deltas, account: account, checked: true) }
    let(:delta_ids) { habit_with_deltas.habit_deltas.map(&:id).map(&:to_s) }

    context 'when deltas_attributes is nil' do
      it 'does nothing' do
        expect { habit_check.sync_deltas(nil) }.not_to change { habit_check.habit_check_deltas.count }
      end
    end

    context 'when deltas_attributes is empty' do
      it 'does nothing' do
        expect { habit_check.sync_deltas([]) }.not_to change { habit_check.habit_check_deltas.count }
      end
    end

    context 'when creating new deltas' do
      it 'creates deltas that do not yet exist' do
        attrs = [{ habit_delta_id: delta_ids.first, value: '10' }]

        expect { habit_check.sync_deltas(attrs) }.to change { habit_check.habit_check_deltas.count }.by(1)
        expect(habit_check.habit_check_deltas.last.value).to eq('10')
      end
    end

    context 'when updating existing deltas' do
      it 'updates the value of an existing delta' do
        habit_check.habit_check_deltas.create(habit_delta_id: delta_ids.first, value: '5')

        attrs = [{ habit_delta_id: delta_ids.first, value: '20' }]
        habit_check.sync_deltas(attrs)

        habit_check.reload
        expect(habit_check.habit_check_deltas.find_by(habit_delta_id: delta_ids.first).value).to eq('20')
      end
    end

    context 'when destroying deltas' do
      it 'destroys a delta when _destroy is true' do
        habit_check.habit_check_deltas.create(habit_delta_id: delta_ids.first, value: '5')

        attrs = [{ habit_delta_id: delta_ids.first, _destroy: true }]

        expect { habit_check.sync_deltas(attrs) }.to change { habit_check.habit_check_deltas.count }.by(-1)
      end
    end

    context 'with mixed operations' do
      it 'creates, updates, and destroys in a single call' do
        habit_check.habit_check_deltas.create(habit_delta_id: delta_ids[0], value: '5')
        habit_check.habit_check_deltas.create(habit_delta_id: delta_ids[1], value: '10')

        attrs = [
          { habit_delta_id: delta_ids[0], value: '99' },
          { habit_delta_id: delta_ids[1], _destroy: true }
        ]

        habit_check.sync_deltas(attrs)
        habit_check.reload

        expect(habit_check.habit_check_deltas.count).to eq(1)
        expect(habit_check.habit_check_deltas.first.value).to eq('99')
      end
    end

    context 'when destroying a non-existent delta' do
      it 'no-ops instead of creating' do
        attrs = [{ habit_delta_id: delta_ids.first, _destroy: true }]

        expect { habit_check.sync_deltas(attrs) }.not_to change { habit_check.habit_check_deltas.count }
      end
    end

    context 'when creating with invalid attributes' do
      it 'raises on missing value' do
        attrs = [{ habit_delta_id: delta_ids.first, value: nil }]

        expect { habit_check.sync_deltas(attrs) }.to raise_error(Mongoid::Errors::Validations)
      end

      it 'raises on invalid habit_delta_id' do
        attrs = [{ habit_delta_id: 'nonexistent', value: '10' }]

        expect { habit_check.sync_deltas(attrs) }.to raise_error(Mongoid::Errors::Validations)
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

  end
end

