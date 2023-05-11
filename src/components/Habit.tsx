import { Box, Flex, Input, IconButton, Wrap, ButtonGroup, Button, Text } from '@chakra-ui/react'
import { differenceInDays } from 'date-fns'
import { useState, ChangeEventHandler, useRef, useEffect } from 'react'
import { BsPencil, BsArrowLeftCircle, BsArrowRightCircle } from 'react-icons/bs'
import { useDispatch } from 'react-redux'

import { DAYS_IN_WEEK } from '~constants/habits'
import { deleteHabit, editHabit } from '~slices/habitSlice'
import { AppDispatch } from '~store'
import { getTodaysMostRecentSunday } from '~utils/habits/getTodaysMostRecentSunday'

interface HabitProps {
    habit: Habit
    weekSelectedOverride: number
}

const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

export const Habit = ({ habit, weekSelectedOverride }: HabitProps) => {
    const [updatedName, setUpdatedName] = useState('')
    const [weekSelected, setWeekSelected] = useState(3)
    const handleNameUpdate: ChangeEventHandler<HTMLInputElement> = ({ currentTarget: { value } }) =>
        setUpdatedName(value)
    const editNameInputRef = useRef<HTMLInputElement | null>(null)
    const dispatch = useDispatch<AppDispatch>()
    const [isEditing, setIsEditing] = useState(false)
    const daysSinceStartDate = differenceInDays(new Date(new Date().setHours(0, 0, 0)), new Date(habit.startDate))

    const deleteHabitHandler = (id: string) => {
        dispatch(deleteHabit(id))
    }
    const updateHabitName = (habit: Habit, newHabitName: string) => {
        if (newHabitName.length === 0) return
        dispatch(editHabit({ ...habit, name: newHabitName }))
    }
    const toggleHabitForDay = (habit: Habit, dayIndex: number) => {
        const updatedDays = [...habit.days]
        updatedDays[dayIndex] = !updatedDays[dayIndex]
        dispatch(editHabit({ ...habit, days: updatedDays }))
    }
    const toggleEditing = () => {
        setUpdatedName(habit.name)
        setIsEditing(!isEditing)
    }
    const getWeekdayHighlightColor = (habit: Habit, dayIndex: number, currentDay: number) => {
        if (habit.days[dayIndex]) return 'green'
        const dayHabitWasCreated = currentDay - daysSinceStartDate
        if (dayIndex < dayHabitWasCreated) return 'gray'
        if (!habit.days[dayIndex] && currentDay <= dayIndex) return 'gray'
        return 'red'
    }

    useEffect(() => {
        setWeekSelected(weekSelectedOverride)
    }, [weekSelectedOverride])

    return (
        <Box pt="2">
            <Box borderWidth="1px" borderRadius="lg" overflow="hidden" py="2">
                <Flex direction="column" alignItems="center">
                    <Box>
                        <Flex direction="row" justifyContent="space-between" pb="2" maxW="328px">
                            <Flex justifyContent="start">
                                {isEditing ? (
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
                            </Flex>
                            <Flex justifyContent="end">
                                {!isEditing && (
                                    <IconButton
                                        colorScheme={isEditing ? 'green' : 'gray'}
                                        onClick={() => toggleEditing()}
                                        aria-label="Edit Habit"
                                        icon={<BsPencil />}
                                    />
                                )}
                                <IconButton
                                    ml="2"
                                    onClick={() => weekSelected > 0 && setWeekSelected(weekSelected - 1)}
                                    aria-label={`${habit.name}-prev-week`}
                                    icon={<BsArrowLeftCircle />}
                                    isDisabled={weekSelected === 0}
                                />
                                <IconButton
                                    ml="2"
                                    onClick={() => weekSelected < 3 && setWeekSelected(weekSelected + 1)}
                                    aria-label={`${habit.name}-next-week`}
                                    icon={<BsArrowRightCircle />}
                                    isDisabled={weekSelected === 3}
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
                                        aria-label={`${value}-${dayIndex}-${
                                            habit.days[dayIndex] ? 'selected' : 'unselected'
                                        }-${habit.name}-${colorScheme}`}
                                        icon={<p>{value}</p>}
                                    />
                                )
                            })}
                        </Wrap>
                        {isEditing && (
                            <ButtonGroup pt="2">
                                <Button onClick={() => setIsEditing(false)} variant="outline">
                                    Cancel
                                </Button>
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
