/* eslint-disable etc/no-commented-out-code */
import { configureStore, nanoid } from '@reduxjs/toolkit'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import localforage from 'localforage'

import { App } from '~pages/App'
import { slices } from '~slices/index'
import { sliceAdd } from '~slices/utils/sliceTools'

const habitADays = [
    false,
    false,
    false,
    true,
    false,
    false,
    false,

    false,
    false,
    true,
    false,
    false,
    false,
    false,

    false,
    true,
    false,
    false,
    false,
    false,
    false,

    true,
    false,
    false,
    false,
    false,
    false,
    false,
]

const habitBDays = [
    false,
    false,
    false,
    true,
    false,
    false,
    false,

    false,
    false,
    false,
    false,
    true,
    false,
    false,

    false,
    false,
    false,
    false,
    false,
    true,
    false,

    false,
    false,
    false,
    false,
    false,
    false,
    true,
]

const createHabit = async (habitTitle: string, habitDays: boolean[], startDate = new Date().toString()) => {
    await sliceAdd(
        {
            id: nanoid(16),
            name: habitTitle,
            days: habitDays,
            startDate: startDate,
        },
        'habits',
    )
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
        expect(screen.getByText('Habits')).toBeInTheDocument()
        fireEvent.change(screen.getByTestId('new-habit-title-input'), { target: { value: habitTitle } })
        expect(screen.getByTestId('new-habit-title-input')).toHaveValue(habitTitle)
        fireEvent.click(screen.getByLabelText('Add Habit'))
        await waitFor(() => expect(screen.getByText(habitTitle)).toBeInTheDocument())
    })

    it('Can edit habit title?', async () => {
        await act(async () => await createHabit('exercise', habitBDays))
        arrangeComponent()

        await waitFor(() => fireEvent.click(screen.getAllByLabelText('Edit Habit')[0]))
        await waitFor(() => expect(screen.getByText('Delete')).toBeInTheDocument())
        const newHabitTitle = 'weightlifting'
        fireEvent.change(screen.getByTestId('habit-title-input'), { target: { value: newHabitTitle } })
        await waitFor(() => expect(screen.getByTestId('habit-title-input')).toHaveValue(newHabitTitle))
        fireEvent.click(screen.getByText('Update'))
        await waitFor(() => expect(screen.getByText(newHabitTitle)).toBeInTheDocument())
    })

    it('Can delete habit?', async () => {
        await act(async () => await createHabit('exercise', habitBDays))
        arrangeComponent()

        await waitFor(() => fireEvent.click(screen.getAllByLabelText('Edit Habit')[0]))
        await waitFor(() => expect(screen.getByText('Delete')).toBeInTheDocument())
        fireEvent.click(screen.getByText('Delete'))
        await waitFor(() => expect(screen.queryByText('exercise')).not.toBeInTheDocument())
    })

    it('Global nav changes all habit displayed weeks?', async () => {
        const habitATitle = 'exercise'
        const habitBTitle = 'weightlifting'
        await act(async () => await createHabit(habitATitle, habitADays))
        await act(async () => await createHabit(habitBTitle, habitBDays))
        arrangeComponent()

        // confirm going back onces moves all habits 1 week back
        await waitFor(() => expect(screen.getByText('Current Week')).toBeInTheDocument())
        fireEvent.click(screen.getByLabelText(`habits-prev-week`))
        await waitFor(() => expect(screen.getByText('1 Week ago')).toBeInTheDocument())
        await waitFor(() => expect(screen.getByLabelText(`M-15-selected-${habitATitle}-green`)).toBeInTheDocument())
        await waitFor(() => expect(screen.getByLabelText(`F-19-selected-${habitBTitle}-green`)).toBeInTheDocument())

        // confirm going back again moves all habits to 2 weeks ago
        fireEvent.click(screen.getByLabelText(`habits-prev-week`))
        await waitFor(() => expect(screen.getByText('2 Weeks ago')).toBeInTheDocument())
        await waitFor(() => expect(screen.getByLabelText(`T-9-selected-${habitATitle}-green`)).toBeInTheDocument())
        await waitFor(() => expect(screen.getByLabelText(`T-11-selected-${habitBTitle}-green`)).toBeInTheDocument())

        // confirm going back again moves all habits to 3 weeks ago
        fireEvent.click(screen.getByLabelText(`habits-prev-week`))
        await waitFor(() => expect(screen.getByText('3 Weeks ago')).toBeInTheDocument())
        await waitFor(() => expect(screen.getByLabelText(`W-3-selected-${habitATitle}-green`)).toBeInTheDocument())
        await waitFor(() => expect(screen.getByLabelText(`W-3-selected-${habitBTitle}-green`)).toBeInTheDocument())

        // confirm going forward 3 times moves all habits to the current week
        fireEvent.click(screen.getByLabelText(`habits-next-week`))
        fireEvent.click(screen.getByLabelText(`habits-next-week`))
        fireEvent.click(screen.getByLabelText(`habits-next-week`))
        await waitFor(() => expect(screen.getByText('Current Week')).toBeInTheDocument())
        await waitFor(() => expect(screen.getByLabelText(`S-21-selected-${habitATitle}-green`)).toBeInTheDocument())
        await waitFor(() => expect(screen.getByLabelText(`S-27-selected-${habitBTitle}-green`)).toBeInTheDocument())
    })

    it("New habits don't have past days marked red", async () => {
        vi.setSystemTime(new Date(Date.UTC(2023, 4, 1)))
        const habitTitle = 'exercise'
        await act(
            async () => await createHabit(habitTitle, Array(28).fill(false), new Date(Date.UTC(2023, 4, 1)).toString()),
        )
        arrangeComponent()

        await waitFor(() => expect(screen.getByLabelText(`S-27-unselected-${habitTitle}-gray`)).toBeInTheDocument())
        await waitFor(() => expect(screen.getByLabelText(`F-26-unselected-${habitTitle}-gray`)).toBeInTheDocument())
        await waitFor(() => expect(screen.getByLabelText(`T-25-unselected-${habitTitle}-gray`)).toBeInTheDocument())
        await waitFor(() => expect(screen.getByLabelText(`W-24-unselected-${habitTitle}-gray`)).toBeInTheDocument())
        await waitFor(() => expect(screen.getByLabelText(`T-23-unselected-${habitTitle}-gray`)).toBeInTheDocument())
        await waitFor(() => expect(screen.getByLabelText(`M-22-unselected-${habitTitle}-gray`)).toBeInTheDocument())
        await waitFor(() => expect(screen.getByLabelText(`S-21-unselected-${habitTitle}-gray`)).toBeInTheDocument())
        fireEvent.click(screen.getByLabelText(`habits-prev-week`))

        await waitFor(() => expect(screen.getByLabelText(`S-20-unselected-${habitTitle}-gray`)).toBeInTheDocument())
        await waitFor(() => expect(screen.getByLabelText(`F-19-unselected-${habitTitle}-gray`)).toBeInTheDocument())
        await waitFor(() => expect(screen.getByLabelText(`T-18-unselected-${habitTitle}-gray`)).toBeInTheDocument())
        await waitFor(() => expect(screen.getByLabelText(`W-17-unselected-${habitTitle}-gray`)).toBeInTheDocument())
        await waitFor(() => expect(screen.getByLabelText(`T-16-unselected-${habitTitle}-gray`)).toBeInTheDocument())
        await waitFor(() => expect(screen.getByLabelText(`M-15-unselected-${habitTitle}-gray`)).toBeInTheDocument())
        await waitFor(() => expect(screen.getByLabelText(`S-14-unselected-${habitTitle}-gray`)).toBeInTheDocument())
        fireEvent.click(screen.getByLabelText(`habits-prev-week`))

        await waitFor(() => expect(screen.getByLabelText(`S-13-unselected-${habitTitle}-gray`)).toBeInTheDocument())
        await waitFor(() => expect(screen.getByLabelText(`F-12-unselected-${habitTitle}-gray`)).toBeInTheDocument())
        await waitFor(() => expect(screen.getByLabelText(`T-11-unselected-${habitTitle}-gray`)).toBeInTheDocument())
        await waitFor(() => expect(screen.getByLabelText(`W-10-unselected-${habitTitle}-gray`)).toBeInTheDocument())
        await waitFor(() => expect(screen.getByLabelText(`T-9-unselected-${habitTitle}-gray`)).toBeInTheDocument())
        await waitFor(() => expect(screen.getByLabelText(`M-8-unselected-${habitTitle}-gray`)).toBeInTheDocument())
        await waitFor(() => expect(screen.getByLabelText(`S-7-unselected-${habitTitle}-gray`)).toBeInTheDocument())
        fireEvent.click(screen.getByLabelText(`habits-prev-week`))

        await waitFor(() => expect(screen.getByLabelText(`S-6-unselected-${habitTitle}-gray`)).toBeInTheDocument())
        await waitFor(() => expect(screen.getByLabelText(`F-5-unselected-${habitTitle}-gray`)).toBeInTheDocument())
        await waitFor(() => expect(screen.getByLabelText(`T-4-unselected-${habitTitle}-gray`)).toBeInTheDocument())
        await waitFor(() => expect(screen.getByLabelText(`W-3-unselected-${habitTitle}-gray`)).toBeInTheDocument())
        await waitFor(() => expect(screen.getByLabelText(`T-2-unselected-${habitTitle}-gray`)).toBeInTheDocument())
        await waitFor(() => expect(screen.getByLabelText(`M-1-unselected-${habitTitle}-gray`)).toBeInTheDocument())
        await waitFor(() => expect(screen.getByLabelText(`S-0-unselected-${habitTitle}-gray`)).toBeInTheDocument())
    })
})
