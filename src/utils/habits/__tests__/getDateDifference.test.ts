import { test, describe, expect, it, vi } from 'vitest'

import { getDateDifference } from '~utils/habits/getDateDifference'
import * as getLastRecordedSundayModule from '~utils/habits/getLastRecordedSunday'

const cases = [0, 1, 2, 3, 4, 5, 6, 7, 8]

describe('getDateDifference', () => {
    test.each(cases)('When todays date is %i day after lastRecordSunday and the day difference', (additionalDays) => {
        const lastRecordedSunday = new Date()
        const spy = vi.spyOn(getLastRecordedSundayModule, 'getLastRecordedSunday')
        spy.mockImplementationOnce(() => lastRecordedSunday)

        const todaysDate = new Date()
        todaysDate.setDate(todaysDate.getDate() + additionalDays)
        vi.setSystemTime(todaysDate)

        const result = getDateDifference()
        expect(result).toStrictEqual(additionalDays)
    })
})
