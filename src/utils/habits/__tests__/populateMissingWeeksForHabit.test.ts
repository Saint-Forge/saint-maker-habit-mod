import { test, describe, expect, it } from 'vitest'

import { DAYS_IN_WEEK } from '~constants/habits'
import { populateMissingWeeksForHabit } from '~utils/habits/populateMissingWeeksForHabit'

const defaultData = [
    true,
    true,
    true,
    false,
    true,
    false,
    true,
    true,
    false,
    false,
    false,
    true,
    true,
    false,
    false,
    true,
    false,
    false,
    false,
    true,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    true,
]

const emptyWeek = Array(28).fill(false)

const expectedData = [
    [
        true,
        false,
        false,
        false,
        true,
        true,
        false,
        false,
        true,
        false,
        false,
        false,
        true,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        true,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
    ],
    [
        false,
        true,
        false,
        false,
        false,
        true,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        true,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
    ],
    [
        false,
        false,
        false,
        false,
        false,
        false,
        true,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
    ],
    emptyWeek,
    emptyWeek,
]

const inputData: Habit = {
    id: '0',
    name: 'exercise',
    days: defaultData,
    editing: false,
}

const getExpectedResult = (expectedData: boolean[]) => {
    const expectedResult: Habit = {
        id: '0',
        name: 'exercise',
        days: expectedData,
        editing: false,
    }
    return expectedResult
}

const cases = [1, 2, 3, 4, 5]

describe('populateMissingWeeksForHabit', () => {
    it('User checks 4 week of random habit data within the same week the habit was created', () => {
        const daysLater = 1
        const result = populateMissingWeeksForHabit(daysLater, inputData)
        expect(result).toStrictEqual(getExpectedResult(defaultData))
    })
    test.each(cases)('User checks 4 week of random habit data %i week(s) later', (weeksLater) => {
        const daysLater = DAYS_IN_WEEK * weeksLater
        const result = populateMissingWeeksForHabit(daysLater, inputData)
        expect(result).toStrictEqual(getExpectedResult(expectedData[weeksLater - 1]))
    })
})
