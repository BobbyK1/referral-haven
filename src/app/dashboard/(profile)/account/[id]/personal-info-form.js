'use client'

'use client'

import { UpdatePersonalInfo } from "@/app/actions";
import { Box, Button, Grid, GridItem, Input, Select, SimpleGrid, Stack, Text, } from "@chakra-ui/react"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFormStatus, useFormState } from 'react-dom';

const initialState = {
    message: null
}

function SubmitButton() {
    const { pending } = useFormStatus()

    return <Button type="submit" isDisabled={pending} isLoading={pending} my="5" size="sm" w="full" colorScheme="gray" bgColor="blackAlpha.300">Save</Button>
}

export default function PersonalInfoForm({ initialInfo }) {
    const [state, formAction] = useFormState(UpdatePersonalInfo, initialState)
    const [hasChanges, setHasChanges] = useState(false);
    const router = useRouter();

    const profile = initialInfo;

    useEffect(() => {
        if (state.message === "success") {
            setHasChanges(null)
            return router.refresh();
        }
    }, [state])

    const handleInputChange = (e) => {
        const { name, value } = e.target;
    
        setHasChanges((prevChanges) => prevChanges || value !== profile[name]);
      };

    return (
        <form action={formAction}>
            <Stack direction="row" alignItems="center" justify="space-between">
                <Text fontSize="sm" fontWeight="semibold" color="blackAlpha.800">Personal Information</Text>

                <Button variant="ghost" size="sm">Edit</Button>
            </Stack>

            <SimpleGrid columns="2" mt="8" alignItems="center">
                <Text fontSize="md">First name</Text>
                <Input defaultValue={profile.first_name} borderColor="blackAlpha.400" name="first_name" onChange={handleInputChange}/>
            </SimpleGrid>

            <SimpleGrid columns="2" mt="5" alignItems="center">
                <Text fontSize="md">Last name</Text>
                <Input defaultValue={profile.last_name} borderColor="blackAlpha.400" name="last_name" onChange={handleInputChange}/>
            </SimpleGrid>

            <SimpleGrid columns="2" mt="5" alignItems="center">
                <Text fontSize="md">Email</Text>
                <Input defaultValue={profile.email} borderColor="blackAlpha.400" name="email" onChange={handleInputChange}/>
            </SimpleGrid>

            <SimpleGrid columns="2" mt="5" alignItems="center">
                <Text fontSize="md">Phone number</Text>
                <Input defaultValue={profile.phone_number} borderColor="blackAlpha.400" name="phone_number" />
            </SimpleGrid>

            <SimpleGrid columns="2" mt="5" >
                <Text fontSize="md">Address</Text>
                <Box>
                    <Input defaultValue={profile.address?.address} borderColor="blackAlpha.400" name="address" />
                    <Grid mt="2" gap="2" templateColumns="repeat(7, 1fr)">
                        <GridItem colSpan="3">
                            <Input defaultValue={profile.address?.city} borderColor="blackAlpha.400" name="city" />
                        </GridItem>
                        <GridItem colSpan="2">
                            <Select defaultValue={profile.address?.state} borderColor="blackAlpha.400" name="state">
                                <option></option>
                                <option value="IN">IN</option>
                            </Select>
                        </GridItem>
                        <GridItem colSpan="2">
                            <Input defaultValue={profile.address?.zip} borderColor="blackAlpha.400" name="zip" />
                        </GridItem>
                    </Grid>
                </Box>
            </SimpleGrid>

            <SimpleGrid columns="2" mt="5" alignItems="center">
                <Box/>
                {hasChanges && <SubmitButton />}
            </SimpleGrid>
        </form>
    )
}