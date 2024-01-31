'use client'

import { Alert, AlertIcon, Box, Button, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Select, Text, useDisclosure } from "@chakra-ui/react"
import { useFormStatus, useFormState } from 'react-dom';
import { AddPropertyToReferralLead } from "../actions";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const initialState = {
    message: null
}

function SubmitButton() {
    const { pending, data } = useFormStatus();

    return <Button type="submit" isLoading={pending} isDisabled={pending} colorScheme="blue" bg="blue.500" size="sm">Add</Button>
}

export default function AddPropertyButton({ id }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const router = useRouter();
    const [state, formAction] = useFormState(AddPropertyToReferralLead, initialState);
    const [error, setError] = useState('');

    useEffect(() => {
        if (state.message === "success") {
            router.refresh();
            return onClose();
        } else if (state.message === "No data provided") {
            setError("Please fill out all fields.");
        }
    }, [state])
    return (
        <>
            <Button onClick={onOpen}  title="Add Property" size="sm" variant="ghost">Add Property</Button>
            
            
                <Modal isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />

                    <ModalContent>
                        <ModalHeader>Add Property</ModalHeader>

                        <ModalCloseButton />

                        <ModalBody>
                            {error && <Alert variant="left-accent" borderRadius="5" mb="5" status="error"><AlertIcon /> {error}</Alert>}
                            <form action={formAction}>
                                <Input type="hidden" value={id} name="id" /> 

                                <Text fontSize="md">Address</Text>
                                <Input type="text" mt="2" name="property_address" borderColor="blackAlpha.400" />

                                <Text fontSize="md" mt="4">Price</Text>
                                <Input type="text" name="property_price" mt="2" borderColor="blackAlpha.400" />

                                <Text fontSize="md" mt="4">Buy or Sell</Text>
                                <Select name="property_goal" mt="2">
                                    <option value="buy">Buy</option>
                                    <option value="sell">Sell</option>
                                </Select>

                                <Box mt="5" w="fit-content" ml="auto">
                                    <SubmitButton />
                                </Box>
                            </form>
                        </ModalBody>
                    </ModalContent>
                </Modal>
        </>
    )
}