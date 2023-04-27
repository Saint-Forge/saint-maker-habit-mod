import { DAYS_IN_WEEK } from '~constants/habits'

export const populateMissingWeeksForHabit = (dateDiff: number, habit: Habit) => {
    if (dateDiff < DAYS_IN_WEEK) return habit
    const newHabit: Habit = { ...habit }
    const weeksToAdd = Math.floor(dateDiff / DAYS_IN_WEEK)
    // We only store 4 weeks per habit, so if the user hasn't checked their habits for
    // more than 3 weeks then we can just populate the habit with 4 empty weeks
    if (weeksToAdd > 3) return { ...newHabit, days: Array(28).fill(false) }

    const updatedDays = [...habit.days]
    updatedDays.push(...Array(weeksToAdd * DAYS_IN_WEEK).fill(false))

    const daysToRemove = updatedDays.length - 28
    updatedDays.splice(0, daysToRemove)

    return { ...newHabit, days: updatedDays }
}
