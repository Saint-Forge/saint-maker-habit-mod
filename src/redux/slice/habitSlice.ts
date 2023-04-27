import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import { idb } from '~utils/idb'
import { getUpdatedHabits } from '~utils/habits/getUpdatedHabits'
import { shouldUpdateHabits } from '~utils/habits/shouldUpdateHabits'
import { sliceGet, sliceAdd, sliceEdit, sliceSet, sliceDeleteSingle } from '~slices/utils/sliceTools'

export const getHabits = createAsyncThunk('habit/getHabits', async () => {
    let data = (await sliceGet('habits')) as Habit[]
    if (shouldUpdateHabits()) {
        data = getUpdatedHabits([...data])
        idb.writeData('habits', data)
    }
    return data
})
export const addHabit = createAsyncThunk('habit/addHabit', async (habit: Habit) => {
    return await sliceAdd(habit, 'habits')
})
export const editHabit = createAsyncThunk('habit/editHabit', async (editedHabit: Habit) => {
    return await sliceEdit(editedHabit, 'habits')
})
export const setHabits = createAsyncThunk('habit/setHabits', async (updatedHabits: Habit[]) => {
    return sliceSet(updatedHabits, 'habits')
})
export const deleteHabit = createAsyncThunk('habit/deleteHabit', async (id: string) => {
    return await sliceDeleteSingle(id, 'habits')
})

const initialState = {
    data: [] as Habit[],
    loading: true,
}

const habitSlice = createSlice({
    name: 'habit',
    initialState,
    reducers: {},
    extraReducers: {
        [getHabits.pending.type]: (state) => {
            state.loading = true
        },
        [getHabits.fulfilled.type]: (state, action) => {
            state.data = action.payload || ([] as Habit[])
            state.loading = false
        },
        [addHabit.fulfilled.type]: (state, action) => {
            state.data = action.payload as Habit[]
        },
        [editHabit.fulfilled.type]: (state, action) => {
            state.data = action.payload as Habit[]
        },
        [setHabits.fulfilled.type]: (state, action) => {
            state.data = action.payload as Habit[]
        },
        [deleteHabit.fulfilled.type]: (state, action) => {
            state.data = action.payload as Habit[]
        },
    },
})

export const { reducer } = habitSlice
