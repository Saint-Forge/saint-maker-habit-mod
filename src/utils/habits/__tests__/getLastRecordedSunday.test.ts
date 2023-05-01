import { describe, expect, it, vi } from 'vitest'
import { getLastRecordedSunday } from '~utils/habits/getLastRecordedSunday'
import * as getTodaysMostRecentSundayModule from '~utils/habits/getTodaysMostRecentSunday'

import { ls } from '../../../utils/localStorage'

describe('getLastRecordedSunday', () => {
    it('lastRecordedSunday is retrieved and converted into a date', () => {
        const lastWeekStartDate = new Date()
        const spy = vi.spyOn(ls, 'get')
        spy.mockImplementationOnce(() => lastWeekStartDate.toString())

        const result = getLastRecordedSunday()
        expect(result).toStrictEqual(new Date(lastWeekStartDate.toString()))
    })

    it('if lastRecordedSunday is null, its fetched, set, and returned', () => {
        const lastWeekStartDate = new Date()
        const spyGet = vi.spyOn(ls, 'get')
        spyGet.mockImplementationOnce(() => null)

        const spySet = vi.spyOn(ls, 'set')
        spySet.mockImplementationOnce(() => undefined)

        const spyGetTodaysMostRecentSunday = vi.spyOn(getTodaysMostRecentSundayModule, 'getTodaysMostRecentSunday')
        spyGetTodaysMostRecentSunday.mockImplementationOnce(() => lastWeekStartDate)

        const result = getLastRecordedSunday()
        expect(result).toStrictEqual(new Date(lastWeekStartDate.toString()))
    })
})
