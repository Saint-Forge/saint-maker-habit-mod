import { describe, expect, it, vi } from 'vitest'
import { getUpdatedHabits } from '~utils/habits/getUpdatedHabits'
import * as populateMissingWeeksForHabitModule from '~utils/habits/populateMissingWeeksForHabit'
import { ls } from '~utils/localStorage'

import * as getDateDifferenceModule from '../../../utils/habits/getDateDifference'

describe('getUpdatedHabits', () => {
    it('Returns habits provided by populateMissingWeeksForHabit function', () => {
        const spyGetDateDifference = vi.spyOn(getDateDifferenceModule, 'getDateDifference')
        spyGetDateDifference.mockImplementationOnce(() => 5)

        const spyPopulateMissingWeeksForHabit = vi.spyOn(
            populateMissingWeeksForHabitModule,
            'populateMissingWeeksForHabit',
        )
        const habit = {
            id: '123',
            name: 'exercise',
            days: Array(28).fill(false),
            startDate: new Date().toString(),
        }
        spyPopulateMissingWeeksForHabit.mockImplementationOnce(() => habit)

        const spySet = vi.spyOn(ls, 'set')
        spySet.mockImplementationOnce(() => undefined)

        const habits = [habit]

        const result = getUpdatedHabits(habits)
        expect(result).toStrictEqual(habits)
    })
})
