import { configureStore } from '@reduxjs/toolkit'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import localforage from 'localforage'

import { App } from '~pages/App'
import { slices } from '~slices/index'

const createHabit = async (habitTitle: string) => {
    expect(screen.getByText('Habits')).toBeInTheDocument()
    fireEvent.change(screen.getByTestId('new-habit-title-input'), { target: { value: habitTitle } })
    expect(screen.getByTestId('new-habit-title-input')).toHaveValue(habitTitle)
    fireEvent.click(screen.getByLabelText('Add Habit'))
}

describe('Habit App tests', () => {
    const storeRef = setupTestStore()

    function setupTestStore() {
        const refObj: any = {}

        beforeEach(() => {
            localforage.clear()
            const store = configureStore({
                reducer: slices,
            })
            refObj.store = store
            refObj.wrapper = function Wrapper({ children }: any) {
                return (
                    <BrowserRouter>
                        <Provider store={store}>{children}</Provider>
                    </BrowserRouter>
                )
            }
        })

        return refObj
    }

    const arrangeComponent = () => {
        render(<App />, { wrapper: storeRef.wrapper })
    }

    it('Renders Habit App?', () => {
        arrangeComponent()

        expect(screen.getByText('Habits')).toBeInTheDocument()
    })

    it('Can create Habit?', async () => {
        arrangeComponent()

        const habitTitle = 'exercise'
        createHabit(habitTitle)
        await waitFor(() => expect(screen.getByText(habitTitle)).toBeInTheDocument())
    })

    it('Can edit habit title?', async () => {
        arrangeComponent()

        const habitTitle = 'exercise'
        createHabit(habitTitle)
        await waitFor(() => expect(screen.getByText(habitTitle)).toBeInTheDocument())

        fireEvent.click(screen.getAllByLabelText('Edit Habit')[0])
        await waitFor(() => expect(screen.getByText('Delete')).toBeInTheDocument())
        const newHabitTitle = 'weightlifting'
        fireEvent.change(screen.getByTestId('habit-title-input'), { target: { value: newHabitTitle } })
        await waitFor(() => expect(screen.getByTestId('habit-title-input')).toHaveValue(newHabitTitle))
        fireEvent.click(screen.getByText('Update'))
        await waitFor(() => expect(screen.getByText(newHabitTitle)).toBeInTheDocument())
    })

    it('Can delete habit?', async () => {
        arrangeComponent()

        const habitTitle = 'exercise'
        createHabit(habitTitle)
        await waitFor(() => expect(screen.getByText(habitTitle)).toBeInTheDocument())

        fireEvent.click(screen.getAllByLabelText('Edit Habit')[0])
        await waitFor(() => expect(screen.getByText('Delete')).toBeInTheDocument())
        fireEvent.click(screen.getByText('Delete'))
        await waitFor(() => expect(screen.queryByText('exercise')).not.toBeInTheDocument())
    })
})
