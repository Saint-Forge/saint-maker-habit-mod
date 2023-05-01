import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import { App } from '~pages/App'
import { store } from '~store'

describe('Habit App tests', () => {
    it('Renders Habit App?', () => {
        render(
            <Provider store={store}>
                <App />
            </Provider>,
            { wrapper: BrowserRouter },
        )

        expect(screen.getByText('Habits')).toBeInTheDocument()
    })
})
