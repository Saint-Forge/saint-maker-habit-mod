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

const populateHabitData = async (habitATitle: string, habitBTitle: string) => {
    await waitFor(() => fireEvent.click(screen.getByLabelText(`S-21-unselected-${habitATitle}`)))
    fireEvent.click(screen.getByLabelText(`${habitATitle}-prev-week`))
    await waitFor(() => fireEvent.click(screen.getByLabelText(`M-15-unselected-${habitATitle}`)))
    fireEvent.click(screen.getByLabelText(`${habitATitle}-prev-week`))
    await waitFor(() => fireEvent.click(screen.getByLabelText(`T-9-unselected-${habitATitle}`)))
    fireEvent.click(screen.getByLabelText(`${habitATitle}-prev-week`))
    await waitFor(() => fireEvent.click(screen.getByLabelText(`W-3-unselected-${habitATitle}`)))

    await waitFor(() => fireEvent.click(screen.getByLabelText(`S-27-unselected-${habitBTitle}`)))
    fireEvent.click(screen.getByLabelText(`${habitBTitle}-prev-week`))
    await waitFor(() => fireEvent.click(screen.getByLabelText(`F-19-unselected-${habitBTitle}`)))
    fireEvent.click(screen.getByLabelText(`${habitBTitle}-prev-week`))
    await waitFor(() => fireEvent.click(screen.getByLabelText(`T-11-unselected-${habitBTitle}`)))
    fireEvent.click(screen.getByLabelText(`${habitBTitle}-prev-week`))
    await waitFor(() => fireEvent.click(screen.getByLabelText(`W-3-unselected-${habitBTitle}`)))
    fireEvent.click(screen.getByLabelText(`${habitBTitle}-prev-week`))
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

    it.only('Global nav changes all habit displayed weeks?', async () => {
        arrangeComponent()

        // create test habits
        const habitATitle = 'exercise'
        createHabit(habitATitle)
        await waitFor(() => expect(screen.getByText(habitATitle)).toBeInTheDocument())

        const habitBTitle = 'weightlifting'
        createHabit(habitBTitle)
        await waitFor(() => expect(screen.getByText(habitBTitle)).toBeInTheDocument())

        // populate habits with unique data
        await populateHabitData(habitATitle, habitBTitle)

        // confirm going back onces moves all habits 1 week back
        await waitFor(() => expect(screen.getByText('Current Week')).toBeInTheDocument())
        fireEvent.click(screen.getByLabelText(`habits-prev-week`))
        await waitFor(() => expect(screen.getByText('1 Week ago')).toBeInTheDocument())
        await waitFor(() => expect(screen.getByLabelText(`M-15-selected-${habitATitle}`)).toBeInTheDocument())
        await waitFor(() => expect(screen.getByLabelText(`F-19-selected-${habitBTitle}`)).toBeInTheDocument())

        // confirm going back again moves all habits to 2 weeks ago
        fireEvent.click(screen.getByLabelText(`habits-prev-week`))
        await waitFor(() => expect(screen.getByText('2 Weeks ago')).toBeInTheDocument())
        await waitFor(() => expect(screen.getByLabelText(`T-9-selected-${habitATitle}`)).toBeInTheDocument())
        await waitFor(() => expect(screen.getByLabelText(`T-11-selected-${habitBTitle}`)).toBeInTheDocument())

        // confirm going back again moves all habits to 3 weeks ago
        fireEvent.click(screen.getByLabelText(`habits-prev-week`))
        await waitFor(() => expect(screen.getByText('3 Weeks ago')).toBeInTheDocument())
        await waitFor(() => expect(screen.getByLabelText(`W-3-selected-${habitATitle}`)).toBeInTheDocument())
        await waitFor(() => expect(screen.getByLabelText(`W-3-selected-${habitBTitle}`)).toBeInTheDocument())

        // confirm going forward 3 times moves all habits to the current week
        fireEvent.click(screen.getByLabelText(`habits-next-week`))
        fireEvent.click(screen.getByLabelText(`habits-next-week`))
        fireEvent.click(screen.getByLabelText(`habits-next-week`))
        await waitFor(() => expect(screen.getByText('Current Week')).toBeInTheDocument())
        await waitFor(() => expect(screen.getByLabelText(`S-21-selected-${habitATitle}`)).toBeInTheDocument())
        await waitFor(() => expect(screen.getByLabelText(`S-27-selected-${habitBTitle}`)).toBeInTheDocument())
    })
})
