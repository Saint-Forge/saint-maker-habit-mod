import { HStack, IconButton, Heading, Box } from '@chakra-ui/react'
import { ReactElement } from 'react'
import { BsArrowLeft } from 'react-icons/bs'
import { useNavigate } from 'react-router-dom'

type Props = {
    title: string
    headerBtns?: ReactElement
}

export const Header = ({ title, headerBtns }: Props) => {
    const navigate = useNavigate()

    return (
        <HStack justifyContent="space-between">
            <>
                <Box flex="1">
                    <IconButton onClick={() => navigate(-1)} aria-label="Menu" icon={<BsArrowLeft />} />
                </Box>
                <Box flex="1" textAlign="center">
                    <Heading as="h1">{title}</Heading>
                </Box>
                <Box flex="1" textAlign="right">
                    {headerBtns}
                </Box>
            </>
        </HStack>
    )
}
