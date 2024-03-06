'use client'

import { AddLicenseToAgent } from "@/app/actions";
import { Alert, AlertIcon, Box, Button, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Stack, Text, useDisclosure } from "@chakra-ui/react"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFormStatus, useFormState } from 'react-dom';

const initialState = {
    message: null
}

function SubmitButton() {
    const { pending } = useFormStatus();

    return <Button mt="5" ml="auto" type="submit" size="sm" variant="ghost" isDisabled={pending} isLoading={pending}>Add</Button>
} 

export default function AddLicenseModal({ id }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const router = useRouter();

    const [state, formAction] = useFormState(AddLicenseToAgent, initialState);
    const [error, setError] = useState('');

    useEffect(() => {
        if (state.message === "success") {
            router.refresh();
            return onClose();
        } else if (state.message === "No data provided") {
            setError("Please fill out all fields")
        } else {
            setError(state.message);
        }
    }, [state])

    return (
        <>
            <Box onClick={onOpen} _hover={{ bg: "blackAlpha.100", cursor: "pointer"}} transition="0.2s ease" p="5" borderColor="blackAlpha.400" borderWidth="thin" borderRadius="5">
                <Text textAlign="center" fontWeight="semibold">Add License</Text>
            </Box>

            <Modal isCentered isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />

                <ModalContent>
                    <ModalHeader>
                        <Text>Add License</Text>
                    </ModalHeader>

                    <ModalCloseButton />

                    <ModalBody>
                        {error && <Alert status="error" mb="5"><AlertIcon /> {error}</Alert>}
                        <form action={formAction}>
                            <Stack direction="row" alignitems="center">
                                <Input type="hidden" name="id" value={id} />
                                
                                <Select placeholder="State" name="licenseType">
                                    <option value="IL">Illinois</option>
                                    <option value="IN">Indiana</option>
                                </Select>

                                <Input type="text" placeholder="License Number" name="licenseNumber" />
                            </Stack>
                            <Box w="fit-content" ml="auto">
                                <SubmitButton />
                            </Box>
                        </form>
                    </ModalBody>

                    <ModalFooter>
                        
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}