'use client'

import { Button, IconButton, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react";
import { Add } from "./Icons";

const AddUpdateButton = () => {
    const { onOpen, isOpen, onClose } = useDisclosure();

    return (
        <>
            <IconButton onClick={onOpen} icon={<Add fontSize="xl" color="white" />} title="Add Update" size="sm" bg="blue.500" colorScheme="blue" rounded="full" />

            <Modal size="xl" isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />

                <ModalContent>
                    <ModalHeader>Add Update</ModalHeader>

                    <ModalCloseButton />

                    <ModalBody>
                        
                    </ModalBody>

                    <ModalFooter>
                        <Button size="sm" colorScheme="blue">Add</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default AddUpdateButton;