import { useRef } from 'react'
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Button,
} from '@chakra-ui/react'

interface Props {
    header: string
    body: string | React.ReactNode
    cancelBtnText?: string
    confirmBtnText?: string
    isOpen: boolean
    onClose: () => void
    onCancel?: () => void
    onConfirm?: () => void
    confirmBtnColor?: string
}

export const AlertModal = ({
    header,
    body,
    cancelBtnText = 'Cancel',
    confirmBtnText = 'Confirm',
    isOpen,
    onClose,
    onCancel = onClose,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onConfirm = () => {},
    confirmBtnColor = 'gray',
}: Props) => {
    const cancelRef = useRef<HTMLButtonElement>(null)

    return (
        <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
            <AlertDialogOverlay>
                <AlertDialogContent>
                    <AlertDialogHeader>{header}</AlertDialogHeader>
                    <AlertDialogBody>{body}</AlertDialogBody>
                    <AlertDialogFooter>
                        <Button ref={cancelRef} onClick={onCancel} variant="outline">
                            {cancelBtnText}
                        </Button>
                        <Button
                            colorScheme={confirmBtnColor}
                            onClick={() => {
                                onConfirm()
                                onClose()
                            }}
                            ml={3}
                        >
                            {confirmBtnText}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>
    )
}
