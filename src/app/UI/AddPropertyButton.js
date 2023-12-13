'use client'

import { Box, Button, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Select, Text, useDisclosure } from "@chakra-ui/react"
import { Add } from "./Icons";
import { useFormStatus, useFormState } from 'react-dom';
import { AddPropertyToReferralLead } from "../actions";
import { useEffect } from "react";
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

    useEffect(() => {
        if (state.message === "success") {
            router.refresh();
            return onClose();
        }
    }, [state])
    return (
        <>
            <IconButton onClick={onOpen} icon={<Add fontSize="xl" color="white" />} title="Add Property" size="sm" bg="blue.500" colorScheme="blue" rounded="full" />
            
            
                <Modal isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />

                    <ModalContent>
                        <ModalHeader>Add Property</ModalHeader>

                        <ModalCloseButton />

                        <ModalBody>
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