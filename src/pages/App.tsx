import { Box, Button, Flex, IconButton, Input, useDisclosure } from '@chakra-ui/react'
import { nanoid } from 'nanoid'
import { useEffect, useRef, useState } from 'react'
import { AiOutlinePlusCircle } from 'react-icons/ai'
import { useDispatch, useSelector } from 'react-redux'
import { BsUpload, BsDownload } from 'react-icons/bs'

import { addHabit, getHabits, setHabits } from '~slices/habitSlice'
import { AppDispatch, selectHabits } from '~store'
import { Header } from '~components/Header'
import { downloadData } from '~utils/downloadData'
import { uploadData } from '~utils/uploadData'
import { AlertModal } from '~components/AlertModal'
import { Habit } from '~components/Habit'
import { GlobalHabitControls } from '~components/GlobalHabitControls'

export const App = () => {
    const { isOpen: isUploadAlertOpen, onOpen: onUploadAlertOpen, onClose: onUploadAlertClose } = useDisclosure()
    const {
        isOpen: isInvalidFileAlertOpen,
        onOpen: onInvalidFileAlertOpen,
        onClose: onInvalidFileAlertClose,
    } = useDisclosure()
    const dispatch = useDispatch<AppDispatch>()
    const habits = useSelector(selectHabits)
    const addInputRef = useRef<HTMLInputElement | null>(null)
    const fileInputRef = useRef<HTMLInputElement | null>(null)
    const [weekSelectedOverride, setWeekSelectedOverride] = useState(3)

    useEffect(() => {
        dispatch(getHabits())
    }, [])

    const addHabitHandler = () => {
        if (addInputRef?.current == undefined || addInputRef.current.value.length === 0) return
        dispatch(
            addHabit({
                id: nanoid(16),
                name: addInputRef.current.value,
                days: Array(28).fill(false) as boolean[],
            }),
        )
        addInputRef.current.value = ''
    }

    const downloadHabits = () => {
        downloadData(habits.data, 'habitbook')
    }

    const triggerUpload = () => {
        fileInputRef?.current?.click()
    }

    const uploadHabits = (event: any) => {
        uploadData(event, (result: any) => dispatch(setHabits(result)), onInvalidFileAlertOpen)
    }

    return (
        <>
            <Box p="2">
                <Header
                    title="Habits"
                    drawerBtns={
                        <>
                            <Button
                                onClick={downloadHabits}
                                w="full"
                                leftIcon={<BsUpload />}
                                justifyContent="flex-start"
                            >
                                Download Habits
                            </Button>
                            <div>
                                <Input type="file" ref={fileInputRef} onChange={uploadHabits} display="none" />
                                <Button
                                    w="full"
                                    onClick={
                                        habits.data.length === 0 ? () => triggerUpload() : () => onUploadAlertOpen()
                                    }
                                    leftIcon={<BsDownload />}
                                    justifyContent="flex-start"
                                >
                                    Upload Habits
                                </Button>
                            </div>
                        </>
                    }
                >
                    <Flex direction="row" pt="2">
                        <Input data-testid="new-habit-title-input" placeholder="Add a new habit" ref={addInputRef} />
                        <IconButton
                            ml="2"
                            onClick={addHabitHandler}
                            aria-label="Add Habit"
                            icon={<AiOutlinePlusCircle />}
                        />
                    </Flex>
                    <GlobalHabitControls
                        weekSelectedOverride={weekSelectedOverride}
                        setWeekSelectedOverride={setWeekSelectedOverride}
                    />
                    {habits.data.map((habit: Habit, index: number) => (
                        <Habit
                            key={`${habit.name}-${index}`}
                            habit={habit}
                            weekSelectedOverride={weekSelectedOverride}
                        />
                    ))}
                </Header>
            </Box>
            <AlertModal
                isOpen={isUploadAlertOpen}
                onClose={onUploadAlertClose}
                onConfirm={triggerUpload}
                header="Confirm Habits Upload"
                body="WARNING: make sure this habitbook file is from a trusted source. This will delete your current habits; make sure to download your current habits first if you need to."
            />
            <AlertModal
                isOpen={isInvalidFileAlertOpen}
                onClose={onInvalidFileAlertClose}
                header="Invalid File Uploaded"
                body="Make sure you are uploading the correct file type (.json). If you are, then please post a question on our github issues along with the file: https://github.com/Saint-Maker/prayer-book-template-a/issues"
            />
        </>
    )
}
