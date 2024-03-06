'use client'

import { Edit, Question } from "@/app/UI/Icons"
import { Box, Button, Divider, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Stack, Switch, Text, Textarea, Tooltip, useDisclosure } from "@chakra-ui/react"
import { AiOutlineQuestionCircle } from "react-icons/ai";
import React from 'react';

export default function EditReferralProfile({ lead }) {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const ref = React.createRef();

    const IconTooltip = React.forwardRef((props, ref) => {
        return (
        <Tooltip label="Please contact your account admin to request to change the receiving agent.">
            <Box w="fit-content" display="inline" ref={ref}>{props.children}</Box>
        </Tooltip>
    )})

    return (
        <>
            <IconButton onClick={onOpen} icon={<Edit fontSize="xl" color="white" />} title="Edit" size="sm" bg="blue.400" colorScheme="blue" rounded="full" />

            <Modal size="xl" isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />

                <ModalContent>
                    <ModalHeader>Edit Profile</ModalHeader>
                    <ModalCloseButton />

                    <ModalBody>
                        <form>
                            <Box p="4" borderWidth="thin" borderRadius="5" borderColor="blackAlpha.300">
                                <Box mt="-8" mb="4" bg="white" w="fit-content" px="2" py="1">
                                    <Text fontSize="sm">Contact Information</Text>
                                </Box>

                                <Stack direction="row" alignItems="center">
                                    <Box w="full">
                                        <Text fontSize="md" mb="2">First Name</Text>
                                        <Input name="first_name" type="text" borderColor="blackAlpha.300" defaultValue={lead.first_name} />
                                    </Box>

                                    <Box w="full">
                                        <Text fontSize="md" mb="2">Last Name</Text>
                                        <Input name="last_name" type="text" borderColor="blackAlpha.300" defaultValue={lead.last_name} />
                                    </Box>
                                </Stack>

                                <Text fontSize="md" mt="4" mb="2">Phone Number</Text>
                                <Input type="text" defaultValue={lead.phone_number}/>
                                
                                <Text fontSize="md" mt="4" mb="2">Email</Text>
                                <Input type="email" defaultValue={lead.email} />
                            </Box>

                            <Box mt="5" p="4" borderWidth="thin" borderRadius="5" borderColor="blackAlpha.300">
                                <Box mt="-8" mb="4" bg="white" w="fit-content" px="2" py="1">
                                    <Text fontSize="sm">Referral Information <IconTooltip ref={ref}><Question /></IconTooltip></Text>
                                </Box>

                                <Select name="referral_type" mt="2" isDisabled defaultValue={lead.referral_type} borderColor="blackAlpha.400">
                                    <option>Pick an option...</option>
                                    <option value="hasAgent">I have an agent</option>
                                    <option value="havenPreferred">Haven Preferred®</option>
                                </Select>

                                {lead.referral_type === "hasAgent" && 
                                <Box>
                                    <Text fontSize="sm" mt="4">Agent Details</Text>

                                    <Divider borderColor="blackAlpha.400" my="4" />

                                    <Text fontSize="md">Agent name</Text>
                                    <Input type="text" defaultValue={lead.receiving_agent_name} mt="2" name="receiving_agent_name" placeholder="John Doe" isDisabled />

                                    <Text fontSize="md" mt="4">Phone number</Text>
                                    <Input defaultValue={lead.receiving_agent_phone_number} type="text" mt="2" name="receiving_agent_phone_number" placeholder="123-456-7890" isDisabled />

                                    <Text fontSize="md" mt="4">Email</Text>
                                    <Input type="text" mt="2" defaultValue={lead.receiving_agent_email} name="receiving_agent_email" placeholder="johndoe@example.com" isDisabled />

                                    <Text fontSize="md" mt="4">Is the other agent aware of this referral?</Text>

                                    <Stack direction="row" mt="2" spacing="3" alignItems="center">
                                        <Text fontSize="sm">No</Text>
                                        <Switch isChecked={lead.receiving_agent_aware === true} name="receiving_agent_aware" isDisabled />
                                        <Text fontSize="sm">Yes</Text>
                                    </Stack>
                                </Box>}
                            </Box>

                            <Box mt="5" p="4" borderWidth="thin" borderRadius="5" borderColor="blackAlpha.300">
                                <Box mt="-8" mb="4" bg="white" w="fit-content" px="2" py="1">
                                    <Text fontSize="sm">Other Information</Text>
                                </Box>

                                <Text fontSize="md" mt="4" mb="2">Goal</Text>
                                <Select borderColor="blackAlpha.300" defaultValue={lead.goal}>
                                    <option value="buying">Buying</option>
                                    <option value="selling">Selling</option>
                                    <option value="both">Both</option>
                                </Select>

                                <Text fontSize="md" mt="4" mb="2">Notes</Text>
                                <Textarea name="notes" resize="none" mt="2" borderColor="blackAlpha.300" placeholder="Enter notes here..." defaultValue={lead.notes} />
                            </Box>
                            
                        </form>
                    </ModalBody>

                    <ModalFooter>
                        <Button variant="ghost" size="sm" onClick={onClose} mr="2">Cancel</Button>
                        <Button variant="solid" size="sm" colorScheme="gray" isDisabled>Update</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}