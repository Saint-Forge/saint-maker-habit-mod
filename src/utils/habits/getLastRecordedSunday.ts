import { HABITS_LATEST_WEEKS_START_DATE } from '~constants/lsKeys'
import { getTodaysMostRecentSunday } from '~utils/habits/getTodaysMostRecentSunday'
import { ls } from '~utils/localStorage'

export const getLastRecordedSunday = () => {
    let lastRecordedSunday = ls.get(HABITS_LATEST_WEEKS_START_DATE)
    if (lastRecordedSunday === null) {
        const mostRecentSunday = getTodaysMostRecentSunday().toString()
        ls.set(HABITS_LATEST_WEEKS_START_DATE, mostRecentSunday)
        lastRecordedSunday = mostRecentSunday
    }
    return new Date(lastRecordedSunday)
}
