'use client'

import { Alert, AlertIcon, Button, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react"
import { useState } from "react";

export default function ForgotPasswordModal() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        setLoading(true);
        setSuccess('');
        setError('');

        await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/email/sendForgotPasswordLink`, {
            method: "POST",
            body: JSON.stringify({
                email: email
            })
        })
        .then(data => {
            setSuccess(`If the your email is associated with an account, it will be in your inbox.`);
        })
        .catch(err => {
            console.log(err);
            setError('Unable to send your reset link. Please try again.')
            setLoading(false);
        })

        setLoading(false);
    }

    return (
        <>
            <Button onClick={onOpen} variant="link" size="sm" color="blue.500" mt="4">Forgot Password</Button>

            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />

                <ModalContent>
                    <ModalHeader>
                        Forgot Password
                    </ModalHeader>
                    <ModalCloseButton />

                    <ModalBody>
                        <Input onChange={e => setEmail(e.target.value)} type="email" name="email" borderColor="blackAlpha.300" placeholder="Enter your email..." />
                        {success && <Alert status="success" size="sm" mt="4"><AlertIcon /> {success}</Alert>}
                        {error && <Alert status="error" size="sm" mt="4"><AlertIcon /> {error}</Alert>}
                    </ModalBody>

                    <ModalFooter>
                        <Button size="sm" colorScheme="gray" onClick={onClose} mr="2">Close</Button>
                        <Button size="sm" colorScheme="blue" onClick={handleSubmit} isLoading={loading} isDisabled={email.length === 0 || loading}>Send Link</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}