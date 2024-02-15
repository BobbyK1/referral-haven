'use client'

import { Document } from "@/app/UI/Icons"
import { Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, SimpleGrid, Text, useDisclosure } from "@chakra-ui/react"
import React from "react"
import { DocusealForm } from '@docuseal/react'

export default function PdfSignautureEmbed({ email }) {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
            <SimpleGrid columns="3">
                <Flex onClick={onOpen} _hover={{ bgColor: "blackAlpha.50", cursor: "pointer" }} transition="0.2s ease" flexDir="column" alignItems="center" justifyContent="center" w="full" p="5" borderWidth="thin" borderRadius="5">
                    <Text fontSize="md" mb="5">Referral Agreement</Text>
                    <Document fontSize="5xl" color="blue.500" />
                    <Text fontSize="sm" fontWeight="semibold" mt="5">Click To Sign</Text>
                </Flex>
            </SimpleGrid>

            <Modal isOpen={isOpen} onClose={onClose} size="full">
                <ModalOverlay />

                <ModalContent>
                    <ModalHeader>
                        Referral Agreement
                    </ModalHeader>

                    <ModalCloseButton />

                    <ModalBody>
                    
                    <DocusealForm
                        src="https://docuseal.co/d/Kf1q5pJKJZpmf4"
                        email={email}
                        values={{
                            'Referring Broker Name': "Test 123"
                        }}
                        readonlyFields={[
                          'Referring Broker Name'  
                        ]}
                        />

                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}