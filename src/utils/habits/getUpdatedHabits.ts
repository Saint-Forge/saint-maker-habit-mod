import { HABITS_LATEST_WEEKS_START_DATE } from '~constants/lsKeys'
import { getDateDifference } from '~utils/habits/getDateDifference'
import { getTodaysMostRecentSunday } from '~utils/habits/getTodaysMostRecentSunday'
import { ls } from '~utils/localStorage'
import { populateMissingWeeksForHabit } from '~utils/habits/populateMissingWeeksForHabit'

export const getUpdatedHabits = (habits: Habit[]) => {
    const updatedHabits = habits.map((habit: Habit) => populateMissingWeeksForHabit(getDateDifference(), habit))
    // After the habits have been updated, update the latest weeks start date
    ls.set(HABITS_LATEST_WEEKS_START_DATE, getTodaysMostRecentSunday().toString())
    return updatedHabits
}
