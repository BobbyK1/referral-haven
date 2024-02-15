'use client'

import ClientSupabase from "@/app/util/clientSupabase"
import { Box, Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from "@chakra-ui/react"
import { useRouter } from "next/navigation"
import { useState } from "react";

export default function LicenseCard({ license }) {
    const router = useRouter();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [loading, setLoading] = useState(false);

    const deleteLicense = async (licenseId) => {
        setLoading(true);

        const supabase = ClientSupabase();
        const { data: user } = await supabase.auth.getUser();

        const GetLicenseArr = async () => {
            const { data: agents, error } = await supabase
                .from('agents')
                .select('license')
                .eq('id', user.user.id);

            if (error) throw new Error(error.message)

            return agents[0].license;
        }

        const licArr = await GetLicenseArr();
        
        const indexToDelete = licArr.findIndex(obj => obj.licenseNumber === licenseId);

        if (indexToDelete !== -1) {
            licArr.splice(indexToDelete, 1);
        }

        const { data, error } = await supabase
            .from('agents')
            .update({
                license: licArr
            })
            .eq('id', user.user.id);

        if (error) throw new Error(error.message);

        router.refresh();
        setLoading(false);
        return onClose();
    }



    return (
        <>
            <Box onClick={onOpen} key={license.licenseNumber} _hover={{ bg: "blackAlpha.100", cursor: "pointer"}} transition="0.2s ease" p="5" borderColor="blackAlpha.400" borderWidth="thin" borderRadius="5">
                <Text textAlign="center">{license.licenseType}: {license.licenseNumber}</Text>
            </Box>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Are you sure you'd like to delete this license?</ModalHeader>

                    <ModalBody>
                        <Text>Licensed State: {license.licenseType}</Text>
                        <Text>License Number: {license.licenseNumber}</Text>
                    </ModalBody>

                    <ModalFooter>
                        <Button size="sm" mr="2" onClick={onClose} isDisabled={loading}>Cancel</Button>
                        <Button size="sm" colorScheme="red" isLoading={loading} isDisabled={loading} onClick={() => deleteLicense(license.licenseNumber)}>Delete</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}