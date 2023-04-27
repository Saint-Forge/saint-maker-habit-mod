import {
    HStack,
    IconButton,
    Heading,
    useDisclosure,
    Button,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerHeader,
    DrawerOverlay,
    useColorMode,
    Box,
    Flex,
} from '@chakra-ui/react'
import { ReactElement, ReactNode, useRef } from 'react'
import { AiFillHome, AiOutlineMenu } from 'react-icons/ai'
import { BsMoonFill, BsSunFill } from 'react-icons/bs'
import { useNavigate } from 'react-router-dom'

type Props = {
    children: unknown
    title: string
    headerBtns?: ReactElement
    drawerBtns?: ReactNode
}

export const Header = ({ children, title, headerBtns, drawerBtns }: Props) => {
    const { isOpen, onOpen, onClose } = useDisclosure()

    const { colorMode, toggleColorMode } = useColorMode()
    const btnRef = useRef<HTMLButtonElement>(null)
    const navigate = useNavigate()

    return (
        <>
            <HStack justifyContent="space-between">
                <>
                    <Box flex="1">
                        <IconButton onClick={onOpen} ref={btnRef} aria-label="Menu" icon={<AiOutlineMenu />} />
                    </Box>
                    <Box flex="1" textAlign="center">
                        <Heading as="h1">{title}</Heading>
                    </Box>
                    <Box flex="1" textAlign="right">
                        {headerBtns}
                    </Box>
                </>
            </HStack>
            {children}
            <Drawer isOpen={isOpen} placement="left" onClose={onClose} finalFocusRef={btnRef}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>Menu</DrawerHeader>
                    <DrawerBody display="flex">
                        <Flex display="flex" direction="column" gap="2" width="100%">
                            <Button
                                onClick={() => navigate(-1)}
                                w="full"
                                leftIcon={<AiFillHome />}
                                justifyContent="flex-start"
                            >
                                Home
                            </Button>
                            <Button
                                onClick={toggleColorMode}
                                w="full"
                                leftIcon={colorMode === 'light' ? <BsMoonFill /> : <BsSunFill />}
                                justifyContent="flex-start"
                            >
                                Toggle {colorMode === 'light' ? 'Dark' : 'Light'}
                            </Button>
                            {drawerBtns}
                        </Flex>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    )
}
