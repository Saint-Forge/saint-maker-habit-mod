import { configureStore } from '@reduxjs/toolkit'

import { slices } from './slice'

export const store = configureStore({
    reducer: slices,
})

type RootState = ReturnType<typeof store.getState>

export const selectHabits = (state: RootState) => state.habits

export type AppDispatch = typeof store.dispatch
