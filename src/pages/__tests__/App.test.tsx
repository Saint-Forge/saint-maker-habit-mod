/* eslint-disable etc/no-commented-out-code */
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import { App } from '~pages/App'
import { store } from '~store'

const createHabit = async (habitTitle: string) => {
    expect(screen.getByText('Habits')).toBeInTheDocument()
    fireEvent.change(screen.getByTestId('new-habit-title-input'), { target: { value: habitTitle } })
    expect(screen.getByTestId('new-habit-title-input')).toHaveValue(habitTitle)
    fireEvent.click(screen.getByLabelText('Add Habit'))
}

describe('Habit App tests', () => {
    const arrangeComponent = () => {
        render(
            <Provider store={store}>
                <App />
            </Provider>,
            { wrapper: BrowserRouter },
        )
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

        fireEvent.click(screen.getAllByLabelText('Edit Habit')[0])
        await waitFor(() => expect(screen.getByText('Delete')).toBeInTheDocument())
        fireEvent.click(screen.getByText('Delete'))
        await waitFor(() => expect(screen.queryByText('weightlifting')).not.toBeInTheDocument())
    })
})
