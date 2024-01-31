'use client'

import ClientSupabase from "@/app/util/clientSupabase";
import { Box, Button, Center, Checkbox, Container, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Radio, RadioGroup, Stack, Text, useDisclosure, useToast } from "@chakra-ui/react"
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DirectDepositModal({ children, directDepositId }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();
    const router = useRouter();

    const [formData, setFormData] = useState({
        bank_name: '',
        account_number: '',
        nine_digit_routing_number: '',
        account_type: '',
        consent: false,
    });

    const [loading, setLoading] = useState(false);

    const [isDisabled, setIsDisabled] = useState(true);

    useEffect(() => {
        const { bank_name, account_number, nine_digit_routing_number, account_type, consent } = formData;
        const isFormComplete = bank_name && account_number && nine_digit_routing_number && account_type && consent;
        setIsDisabled(!isFormComplete);
    }, [formData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const submit = async () => {
        setLoading(true);

        const supabase = ClientSupabase();

        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (directDepositId) {
            // Update if direct deposit info exists
            var { data, error } = await supabase
                .from('direct_deposit_info')
                .update({
                    bank_name: formData.bank_name,
                    account_number: formData.account_number,
                    nine_digit_routing_number: formData.nine_digit_routing_number,
                    account_type: formData.account_type,
                    consent: formData.consent
                })
                .eq('agent', user.id)
                .select('id');

            if (error) {
                setLoading(false);
                throw new Error(error.message)
            }
        } else {
            var { data, error } = await supabase
                .from('direct_deposit_info')
                .insert({
                    bank_name: formData.bank_name,
                    account_number: formData.account_number,
                    nine_digit_routing_number: formData.nine_digit_routing_number,
                    account_type: formData.account_type,
                    consent: formData.consent
                })
                .select('id');

            if (error) {
                setLoading(false);
                throw new Error(error.message)
            }
        }

        const { data: agentData, error: agentError } = await supabase
            .from('agents')
            .update({
                'direct_deposit_info': data[0].id
            })
            .eq('id', user.id);

        if (agentError) throw new Error(agentError.message);

        setLoading(false);

        router.refresh();

        onClose();
        
        return toast({
            title: "Successfully added direct deposit information!",
            duration: 5000,
            status: "success",
            variant: "subtle"
        })
    }

    return (
        <>
            <Center my="5">
                <Button onClick={onOpen} size="sm" variant="ghost">{children}</Button>
            </Center>

            <Modal isOpen={isOpen} onClose={onClose} size="full">
                <ModalOverlay />
                
                <ModalContent>
                    <ModalHeader>Direct Deposit Information</ModalHeader>
                    <ModalCloseButton />

                    <ModalBody>
                        <Container maxW="container.sm">
                            <Center>
                                <Image src="/check-example.png" height="100" width="500" />
                            </Center>

                            <Box mt="10">
                                <Text fontSize="md">Name of Bank</Text>
                                <Input borderColor="blackAlpha.400" onChange={handleInputChange} name="bank_name" />
                            </Box>

                            <Stack direction={[ "column", "column", "row" ]} mt="5" w="full" spacing="5">
                                <Box w="full">
                                    <Text fontSize="md">Account Number</Text>
                                    <Input borderColor="blackAlpha.400" maxLength={17} onChange={handleInputChange} name="account_number" />
                                </Box>

                                <Box w="full">
                                    <Text fontSize="md">9 Digit Routing Number</Text>
                                    <Input borderColor="blackAlpha.400" maxLength={9} onChange={handleInputChange} name="nine_digit_routing_number" />
                                </Box>
                            </Stack>

                            <Text fontSize="md" mt="5">Account Type</Text>
                            <RadioGroup mt="2" onChange={(value) => setFormData({ ...formData, account_type: value })} value={formData.account_type}>
                                <Stack direction="row" spacing="5">
                                    <Radio value="checking">Checking</Radio>
                                    <Radio value="savings">Savings</Radio>
                                </Stack>
                            </RadioGroup>

                            <Checkbox onChange={e => setFormData({ ...formData, consent: !formData.consent })} mt="5">I agree to securely store my direct deposit information.</Checkbox>

                            <Stack justifyContent="flex-end" direction="row" spacing="2" mt="10">
                                <Button size="sm" onClick={onClose}>Cancel</Button>
                                <Button size="sm" colorScheme="blue" bgColor="blue.500" onClick={submit} isLoading={loading} isDisabled={isDisabled || loading}>Submit</Button>
                            </Stack>
                        </Container>
                    </ModalBody>

                    <ModalFooter></ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}