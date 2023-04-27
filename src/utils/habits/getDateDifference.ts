import { differenceInDays } from 'date-fns'

import { getLastRecordedSunday } from '~utils/habits/getLastRecordedSunday'

export const getDateDifference = () => {
    const todaysDate = new Date()
    const dateDifference = differenceInDays(todaysDate, getLastRecordedSunday())
    return dateDifference
}
