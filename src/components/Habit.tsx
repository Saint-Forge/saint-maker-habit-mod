import { Box, Flex, Input, IconButton, Wrap, ButtonGroup, Button, Text } from '@chakra-ui/react'
import { useState, ChangeEventHandler, useRef } from 'react'
import { BsPencil, BsArrowLeftCircle, BsArrowRightCircle } from 'react-icons/bs'
import { useDispatch, useSelector } from 'react-redux'

import { DAYS_IN_WEEK } from '~constants/habits'
import { deleteHabit, editHabit, setHabits } from '~slices/habitSlice'
import { AppDispatch, selectHabits } from '~store'

interface HabitProps {
    habit: Habit
}

const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

export const Habit = ({ habit }: HabitProps) => {
    const [updatedName, setUpdatedName] = useState('')
    const [weekSelected, setWeekSelected] = useState(3)
    const handleNameUpdate: ChangeEventHandler<HTMLInputElement> = ({ currentTarget: { value } }) =>
        setUpdatedName(value)
    const editNameInputRef = useRef<HTMLInputElement | null>(null)
    const dispatch = useDispatch<AppDispatch>()
    const habits = useSelector(selectHabits)

    const deleteHabitHandler = (id: string) => {
        dispatch(deleteHabit(id))
    }
    const updateHabitName = (habit: Habit, newHabitName: string) => {
        if (newHabitName.length === 0) {
            toggleEditing(habit.id, habit.name)
            return
        }
        dispatch(editHabit({ ...habit, name: newHabitName, editing: false }))
    }
    const toggleHabitForDay = (habit: Habit, dayIndex: number) => {
        const updatedDays = [...habit.days]
        updatedDays[dayIndex] = !updatedDays[dayIndex]
        dispatch(editHabit({ ...habit, days: updatedDays }))
    }
    const toggleEditing = (id: string, name: string) => {
        setUpdatedName(name)
        const updatedHabits = [...habits.data].map((habit: Habit) => {
            const updatedHabit = { ...habit }
            updatedHabit.editing = id === habit.id ? !habit.editing : false
            return updatedHabit
        })
        dispatch(setHabits(updatedHabits))
    }

    const getWeekdayHighlightColor = (habit: Habit, dayIndex: number, currentDay: number) => {
        return habit.days[dayIndex] ? 'green' : !habit.days[dayIndex] && currentDay <= dayIndex ? 'gray' : 'red'
    }

    return (
        <Box pt="2">
            <Box borderWidth="1px" borderRadius="lg" overflow="hidden" py="2">
                <Flex direction="column" alignItems="center">
                    <Box>
                        <Flex direction="row" justifyContent="space-between" pb="2">
                            <Flex justifyContent="start">
                                {habit.editing ? (
                                    <Input
                                        type="text"
                                        data-testid="habit-title-input"
                                        placeholder="Edit habits current name"
                                        value={updatedName}
                                        onChange={handleNameUpdate}
                                        ref={editNameInputRef}
                                    />
                                ) : (
                                    <Text display="flex" alignItems="center" fontSize="xl" as="b">
                                        {habit.name}
                                    </Text>
                                )}
                                <IconButton
                                    ml="2"
                                    colorScheme={habit.editing ? 'green' : 'gray'}
                                    onClick={() => toggleEditing(habit.id, habit.name)}
                                    aria-label="Edit Habit"
                                    icon={<BsPencil />}
                                />
                            </Flex>
                            <Flex justifyContent="end">
                                <IconButton
                                    onClick={() => weekSelected > 0 && setWeekSelected(weekSelected - 1)}
                                    aria-label="Add prayer"
                                    icon={<BsArrowLeftCircle />}
                                    disabled={weekSelected === 0}
                                />
                                <IconButton
                                    ml="2"
                                    onClick={() => weekSelected < 3 && setWeekSelected(weekSelected + 1)}
                                    aria-label="Add prayer"
                                    icon={<BsArrowRightCircle />}
                                    disabled={weekSelected === 3}
                                />
                            </Flex>
                        </Flex>
                        <Wrap spacing={2}>
                            {weekdays.map((value, index) => {
                                const dayIndex = index + weekSelected * DAYS_IN_WEEK
                                const currentDay = new Date().getDay() + 21
                                const colorScheme = getWeekdayHighlightColor(habit, dayIndex, currentDay)
                                return (
                                    <IconButton
                                        colorScheme={colorScheme}
                                        key={`${habit.name}-days-${dayIndex}`}
                                        onClick={() => toggleHabitForDay(habit, dayIndex)}
                                        variant={habit.days[dayIndex] ? 'solid' : 'outline'}
                                        aria-label="Add to friends"
                                        icon={<p>{value}</p>}
                                    />
                                )
                            })}
                        </Wrap>
                        {habit.editing && (
                            <ButtonGroup pt="2">
                                <Button
                                    onClick={() =>
                                        updateHabitName(
                                            habit,
                                            editNameInputRef.current !== null
                                                ? editNameInputRef.current.value
                                                : habit.name,
                                        )
                                    }
                                    colorScheme="green"
                                    variant="outline"
                                >
                                    Update
                                </Button>
                                <Button
                                    onClick={() => deleteHabitHandler(habit.id)}
                                    colorScheme="red"
                                    variant="outline"
                                >
                                    Delete
                                </Button>
                            </ButtonGroup>
                        )}
                    </Box>
                </Flex>
            </Box>
        </Box>
    )
}
