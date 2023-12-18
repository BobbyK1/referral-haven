'use client'

import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react";

const AddUpdateButton = () => {
    const { onOpen, isOpen, onClose } = useDisclosure();

    return (
        <>
            <Button onClick={onOpen} title="Add Update" size="sm" variant="ghost">Add Update</Button>

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