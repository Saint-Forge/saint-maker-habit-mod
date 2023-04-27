import { describe, expect, it, vi } from 'vitest'

import * as getDateDifferenceModule from '../../../utils/habits/getDateDifference'
import { shouldUpdateHabits } from '../../../utils/habits/shouldUpdateHabits'

describe('shouldUpdateHabits', () => {
    it('If date difference is less then 6 return false', () => {
        const spy = vi.spyOn(getDateDifferenceModule, 'getDateDifference')
        spy.mockImplementationOnce(() => 5)

        const result = shouldUpdateHabits()
        expect(result).toStrictEqual(false)
    })

    it('If date difference is greater then 6 return true', () => {
        const spy = vi.spyOn(getDateDifferenceModule, 'getDateDifference')
        spy.mockImplementationOnce(() => 7)

        const result = shouldUpdateHabits()
        expect(result).toStrictEqual(true)
    })
})
