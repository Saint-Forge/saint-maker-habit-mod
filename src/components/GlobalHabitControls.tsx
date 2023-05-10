import { Text, Box, Flex, IconButton } from '@chakra-ui/react'
import { BsArrowLeftCircle, BsArrowRightCircle } from 'react-icons/bs'

interface GlobalHabitControlsProps {
    weekSelectedOverride: number
    setWeekSelectedOverride: (value: number) => void
}

export const GlobalHabitControls = ({ weekSelectedOverride, setWeekSelectedOverride }: GlobalHabitControlsProps) => {
    return (
        <Box borderWidth="1px" borderRadius="lg" overflow="hidden" py="2">
            <Flex direction="column" alignItems="center">
                <Flex direction="row" justifyContent="space-between" pb="2" minW="328px">
                    <Flex justifyContent="start">
                        <Text display="flex" alignItems="center" fontSize="xl" as="b">
                            {weekSelectedOverride === 3
                                ? 'Current Week'
                                : `${3 - weekSelectedOverride} Week${weekSelectedOverride === 2 ? '' : 's'} ago`}
                        </Text>
                    </Flex>
                    <Flex justifyContent="end">
                        <IconButton
                            onClick={() =>
                                weekSelectedOverride > 0 && setWeekSelectedOverride(weekSelectedOverride - 1)
                            }
                            aria-label={`habits-prev-week`}
                            icon={<BsArrowLeftCircle />}
                            isDisabled={weekSelectedOverride === 0}
                        />
                        <IconButton
                            ml="2"
                            onClick={() =>
                                weekSelectedOverride < 3 && setWeekSelectedOverride(weekSelectedOverride + 1)
                            }
                            aria-label={`habits-next-week`}
                            icon={<BsArrowRightCircle />}
                            isDisabled={weekSelectedOverride === 3}
                        />
                    </Flex>
                </Flex>
            </Flex>
        </Box>
    )
}
