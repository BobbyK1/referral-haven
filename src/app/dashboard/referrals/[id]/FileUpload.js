'use client'

import ClientSupabase from "@/app/util/clientSupabase";
import { Button, Center, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Spinner, Switch, Text, useDisclosure } from "@chakra-ui/react"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function FileUpload({ referralId }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const router = useRouter();

    const [file, setFile] = useState();
    const [documentTitle, setDocumentTitle] = useState('');
    const [isPrivate, setPrivate] = useState(false);
    const [loading, setLoading] = useState(false);

    const supabase = ClientSupabase();

    const uploadFile = async () => {
        setLoading(true);

        if (!file) return;

        try {
            const { data: upload, error: uploadError } = await supabase
                .storage
                .from('referral_documents')
                .upload(`${referralId}/${documentTitle}`, file, {
                    cacheControl: 3600,
                    upsert: true
                })

            if (uploadError) throw new Error(uploadError.message)

            const { data: data, error } = await supabase
                .from('referral_uploads')
                .insert({
                    assigned_to: referralId,
                    file_name: documentTitle,
                    link: `${referralId}/${documentTitle}`,
                    private: isPrivate
                });

            if (error) throw new Error(error.message);

            router.refresh();
            setLoading(false);
            return onClose();
        } catch (error) {
            setLoading(false);
            console.log(error)
        }
    }

    return (
        <>
            <Button onClick={onOpen} variant="solid" size="sm" w="full" mb="10" colorScheme="blue">+ Upload File</Button>

            <Modal size="xl" isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />

                <ModalContent>
                    <ModalHeader>Upload a file</ModalHeader>

                    <ModalBody>
                        <Input onChange={e => setFile(e.target.files?.[0])} pt="1" type="file" accept=".pdf" />

                        {file && 
                            <>
                                <Input mt="5" type="text" onChange={e => setDocumentTitle(e.target.value)} placeholder="Enter document title..." />

                                <Text mt="5" fontSize="md">Make File Private</Text>
                                <Switch onChange={e => setPrivate(!isPrivate)} isChecked={isPrivate} size='md' />
                            </>
                        }
                    </ModalBody>

                    <ModalFooter>
                        <Button onClick={onClose} size="xs" mr="3">Close</Button>
                        <Button onClick={uploadFile} size="xs" colorScheme="blue" isLoading={loading} isDisabled={documentTitle.length === 0 || loading}>Upload</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}