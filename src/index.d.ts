interface LegacyHabitV1 {
  id: string
  name: string
  days: boolean[]
  editing: boolean
}

interface Habit {
  id: string
  name: string
  days: boolean[]
  startDate: string
}