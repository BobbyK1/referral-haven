'use client'

import { CreateReferralAgentLead } from "@/app/actions";
import { Box, Button, Collapse, Divider, Input, Select, Stack, Switch, Text, Textarea } from "@chakra-ui/react"
import { useState } from "react";
import { useFormStatus, useFormState } from 'react-dom';

const initialState = {
    message: null
}

function SubmitButton() {
    const { pending } = useFormStatus()

    return <Button type="submit" isDisabled={pending} isLoading={pending} my="5" w="full" colorScheme="gray">Add Referral</Button>
}

export default function AddReferralForm() {
    const [state, formAction] = useFormState(CreateReferralAgentLead, initialState)
    const [select, setSelect] = useState();

    return (
        <form action={formAction}>
            <Box borderColor="blackAlpha.300"  borderWidth="thin" borderRadius="5" p="5">
                <Box mt="-9" mb="4" bg="white" w="fit-content" px="2" py="1">
                    <Text fontSize="sm">Contact Information</Text>
                </Box>
                <Stack direction="row" spacing="4">
                    <Box>
                        <Text fontSize="md">First name</Text>
                        <Input type="text" name="first_name" mt="2" borderColor="blackAlpha.400" placeholder="John" />
                    </Box>
                    <Box>
                        <Text fontSize="md">Last name</Text>
                        <Input type="text" name="last_name" mt="2" borderColor="blackAlpha.400" placeholder="Doe" />
                    </Box>
                </Stack>

                <Text fontSize="md" mt="4">Phone number</Text>
                <Input type="tel" name="phone_number" mt="2" borderColor="blackAlpha.400" placeholder="123-456-7890" />

                <Text fontSize="md" mt="4">Email</Text>
                <Input type="email" name="email" mt="2" borderColor="blackAlpha.400" placeholder="johndoe@example.com" />
            </Box>

            <Box mt="5" borderColor="blackAlpha.300" borderWidth="thin" borderRadius="5" p="5">
                <Box mt="-9" mb="4" bg="white" w="fit-content" px="2" py="1">
                    <Text fontSize="sm">Referral Information</Text>
                </Box>

                <Text fontSize="md" mt="4">Where is this referral going?</Text>

                <Select name="referral_type" mt="2" onChange={e => setSelect(e.currentTarget.value)} borderColor="blackAlpha.400">
                    <option>Pick an option...</option>
                    <option value="hasAgent">I have an agent</option>
                    <option value="havenPreferred">Haven Preferred®</option>
                </Select>

                <Collapse in={select === "hasAgent"} animateOpacity unmountOnExit>
                    <Text fontSize="sm" mt="4">Agent Details</Text>

                    <Divider borderColor="blackAlpha.400" my="4" />

                    <Text fontSize="md">Agent name</Text>
                    <Input type="text" mt="2" name="receiving_agent_name" placeholder="John Doe" />

                    <Text fontSize="md" mt="4">Phone number</Text>
                    <Input type="text" mt="2" name="receiving_agent_phone_number" placeholder="123-456-7890" />

                    <Text fontSize="md" mt="4">Email</Text>
                    <Input type="text" mt="2" name="receiving_agent_email" placeholder="johndoe@example.com" />

                    <Text fontSize="md" mt="4">Is the other agent aware of this referral?</Text>

                    <Stack direction="row" mt="2" spacing="3" alignItems="center">
                        <Text fontSize="sm">No</Text>
                        <Switch name="receiving_agent_aware" />
                        <Text fontSize="sm">Yes</Text>
                    </Stack>
                    {/* <RadioGroup name="receiving_agent_aware" mt="2">
                        <Stack direction="row" spacing="6">
                            <Radio value={true}>Yes</Radio>
                            <Radio value={false}>No</Radio>
                        </Stack>
                    </RadioGroup> */}
                </Collapse>
            </Box>

            <Box mt="5" borderColor="blackAlpha.300" borderWidth="thin" borderRadius="5" p="5">
                <Box mt="-9" mb="4" bg="white" w="fit-content" px="2" py="1">
                    <Text fontSize="sm">Other Information</Text>
                </Box>

                <Text fontSize="md" mt="4">Goal</Text>
                <Select name="goal" mt="2" borderColor="blackAlpha.400">
                    <option>Buying</option>
                    <option>Selling</option>
                    <option>Both</option>
                </Select>

                <Text fontSize="md" mt="4">Notes <Text as="span" color="blackAlpha.600" fontSize="sm">(optional)</Text></Text>
                <Textarea name="notes" resize="none" mt="2" borderColor="blackAlpha.400" placeholder="Enter notes here..." />
            </Box>

            <SubmitButton />
        </form>
    )
}