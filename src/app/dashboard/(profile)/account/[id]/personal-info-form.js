'use client'

import { UpdatePersonalInfo } from "@/app/actions";
import { Box, Button, Grid, GridItem, Input, Select, SimpleGrid, Text, } from "@chakra-ui/react"
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useFormStatus, useFormState } from 'react-dom';
import { PatternFormat } from "react-number-format";

const initialState = {
    message: null
}

function SubmitButton() {
    const { pending } = useFormStatus()

    return <Button type="submit" isDisabled={pending} isLoading={pending} my="5" size="sm" w="full" colorScheme="blue" bgColor="blue.500">Save</Button>
}

export default function PersonalInfoForm({ initialInfo }) {
    const searchParams = useSearchParams();
    const [state, formAction] = useFormState(UpdatePersonalInfo, initialState)
    const [hasChanges, setHasChanges] = useState(false);
    const router = useRouter();

    const profile = initialInfo;

    useEffect(() => {
        if (state.message === "success") {
            setHasChanges(null)
            router.refresh();
            router.push('/dashboard/account/profile')
        }
    }, [state])

    const handleInputChange = (e) => {
        const { name, value } = e.target;
    
        setHasChanges((prevChanges) => prevChanges || value !== profile[name]);
      };

    return (
        <form action={formAction}>
            <Text fontSize="sm" fontWeight="semibold" color="blackAlpha.800">Personal Information</Text>

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
                <Input isDisabled defaultValue={profile.email} borderColor="blackAlpha.400" name="email" onChange={handleInputChange}/>
            </SimpleGrid>

            <SimpleGrid columns="2" mt="5" alignItems="center">
                <Text fontSize="md">Phone number</Text>
                <Input as={PatternFormat} format="(###) ###-####" defaultValue={profile.phone_number} borderColor="blackAlpha.400" name="phone_number" onChange={handleInputChange} />
            </SimpleGrid>

            
            <SimpleGrid columns="2" mt="5" >
                <Text fontSize="md">Home Address</Text>
                <Box>
                    <Input placeholder="Street Address" borderColor={!profile.address?.address ? "red.500" : "blackAlpha.400"} autoFocus={searchParams.get('focus') === "address"} defaultValue={profile.address?.address} name="address" onChange={handleInputChange} />
                    <Grid mt="2" gap="2" templateColumns="repeat(7, 1fr)">
                        <GridItem colSpan={["7", "", "", "3"]}>
                            <Input placeholder="City" defaultValue={profile.address?.city} borderColor={!profile.address?.address ? "red.500" : "blackAlpha.400"} name="city" onChange={handleInputChange} />
                        </GridItem>
                        <GridItem colSpan={["7", "", "", "2"]}>
                            <Select placeholder="State" defaultValue={profile.address?.state} borderColor={!profile.address?.address ? "red.500" : "blackAlpha.400"} name="state" onChange={handleInputChange}>
                                <option>State</option>
                                <option value="AL">AL</option>
                                <option value="AK">AK</option>
                                <option value="AZ">AZ</option>
                                <option value="AR">AR</option>
                                <option value="CA">CA</option>
                                <option value="CO">CO</option>
                                <option value="CT">CT</option>
                                <option value="DE">DE</option>
                                <option value="FL">FL</option>
                                <option value="GA">GA</option>
                                <option value="HI">HI</option>
                                <option value="ID">ID</option>
                                <option value="IL">IL</option>
                                <option value="IN">IN</option>
                                <option value="IA">IA</option>
                                <option value="KS">KS</option>
                                <option value="KY">KY</option>
                                <option value="LA">LA</option>
                                <option value="ME">ME</option>
                                <option value="MD">MD</option>
                                <option value="MA">MA</option>
                                <option value="MI">MI</option>
                                <option value="MN">MN</option>
                                <option value="MS">MS</option>
                                <option value="MO">MO</option>
                                <option value="MT">MT</option>
                                <option value="NE">NE</option>
                                <option value="NV">NV</option>
                                <option value="NH">NH</option>
                                <option value="NJ">NJ</option>
                                <option value="NM">NM</option>
                                <option value="NY">NY</option>
                                <option value="NC">NC</option>
                                <option value="ND">ND</option>
                                <option value="OH">OH</option>
                                <option value="OK">OK</option>
                                <option value="OR">OR</option>
                                <option value="PA">PA</option>
                                <option value="RI">RI</option>
                                <option value="SC">SC</option>
                                <option value="SD">SD</option>
                                <option value="TN">TN</option>
                                <option value="TX">TX</option>
                                <option value="UT">UT</option>
                                <option value="VT">VT</option>
                                <option value="VA">VA</option>
                                <option value="WA">WA</option>
                                <option value="WV">WV</option>
                                <option value="WI">WI</option>
                                <option value="WY">WY</option>
                            </Select>
                        </GridItem>
                        <GridItem colSpan={["7", "", "", "2"]}>
                            <Input placeholder="Zip" defaultValue={profile.address?.zip} borderColor={!profile.address?.address ? "red.500" : "blackAlpha.400"} name="zip" onChange={handleInputChange} />
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