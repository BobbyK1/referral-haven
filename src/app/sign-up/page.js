'use client'

import { Box, Button, Center, Checkbox, Container, Heading, IconButton, Input, Select, Stack, Text } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";


export default function Page() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        phoneNumber: "",
        email: "",
        password: "",
        licenses: [], // Array to store license objects
    });

    const router = useRouter();

    const [termsChecked, setTermsChecked] = useState(false);

    const [loading, setLoading] = useState(false);
    
    const submitForm = async () => {
        setLoading(true);

        await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/createReferralAgent`, {
            method: "POST",
            body: JSON.stringify(formData)
        })
            .then(response => response.json())
            .then(response => {
                if (response.success) {
                    router.push('/dashboard')
                }
            })
        

        setLoading(false);
    }

    const isFormValid = () => {
        const {
            firstName,
            lastName,
            phoneNumber,
            email,
            password,
            licenses,
        } = formData;

        // Check if all required fields are filled
        const isPersonalInfoFilled = firstName && lastName && phoneNumber && email && password;

        // Check if at least one license is added
        const isAtLeastOneLicenseAdded = licenses.length > 0;

        // Check if each license has a license number
        const areAllLicensesValid = licenses.every(
            (license) => license.licenseNumber.trim() !== ""
        );

        // Check if terms checkbox is checked
        const areTermsChecked = termsChecked;

        return (
            isPersonalInfoFilled &&
            isAtLeastOneLicenseAdded &&
            areAllLicensesValid &&
            areTermsChecked
        );
    };

    const handleInputChange = (field, value) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            [field]: value,
        }));
        
    };

    const handleTermsChange = () => {
        setTermsChecked((prevTermsChecked) => !prevTermsChecked);
    };

    const handleAddLicense = () => {
        // Add a new license object to the licenses array
        setFormData((prevFormData) => ({
            ...prevFormData,
            licenses: [...prevFormData.licenses, { licenseType: "", licenseNumber: "" }],
        }));
    };

    const handleDeleteLicense = (index) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            licenses: prevFormData.licenses.filter((_, i) => i !== index),
        }));
    };

    const handleLicenseChange = (index, key, value) => {
        // Update the license object in the array
        setFormData((prevFormData) => {
            const newLicenses = [...prevFormData.licenses];
            newLicenses[index][key] = value;
            return { ...prevFormData, licenses: newLicenses };
        });
    };

    return (
        <Container maxW="lg" mt="20">
            <Heading as="h2" fontSize="3xl" textAlign="center">Create an account</Heading>
            <Text fontSize="lg" color="blue.500" textAlign="center" mt="4">Let's get you earning today!</Text>

            <Stack mt="10" w="full" direction={["column", "column", "row"]} spacing="2">
                <Box w="full">
                    <Text fontSize="md">First Name</Text>
                    <Input type="text" name="first_name" borderColor="blackAlpha.200" onChange={(e) => handleInputChange("firstName", e.target.value)} />
                </Box>

                <Box w="full">
                    <Text fontSize="md">Last Name</Text>
                    <Input type="text" name="last_name" borderColor="blackAlpha.200" onChange={e => handleInputChange("lastName", e.target.value)} />
                </Box>
            </Stack>
            
            <Text fontSize="md" mt="3">Phone Number</Text>
            <Input type="text" borderColor="blackAlpha.200" onChange={e => handleInputChange("phoneNumber", e.target.value)} />

            <Text fontSize="md" mt="3">Email</Text>
            <Input type="text" borderColor="blackAlpha.200" onChange={e => handleInputChange("email", e.target.value)} />

            <Text fontSize="md" mt="3">Password</Text>
            <Input type="password" borderColor="blackAlpha.200" onChange={e => handleInputChange("password", e.target.value)} />

            <Box mt="3">
                <Text fontSize="md">Add License(s)</Text>

                {formData.licenses.map((license, index) => (
                    <Stack mt="2" key={index} direction="row" spacing="2">
                        <Select
                            size="sm"
                            placeholder="State"
                            onChange={(e) => handleLicenseChange(index, "licenseType", e.target.value)}
                            >
                            {/* Add your options for license types here */}
                            <option value="IL">Illinois</option>
                            <option value="IN">Indiana</option>
                        {/* ... */}
                        </Select>
                        <Input
                            size="sm"
                            type="text"
                            value={license.licenseNumber}
                            onChange={(e) => handleLicenseChange(index, "licenseNumber", e.target.value)}
                            borderColor="blackAlpha.200"
                            />

                        <IconButton icon={<AiOutlineClose />} size="sm" variant="ghost" onClick={() => handleDeleteLicense(index)} />
                    </Stack>
                ))}

                <Center>
                    <Button onClick={handleAddLicense} mt="3" size="sm" variant="solid">Add License</Button>
                </Center>

                <Center my="10">
                    <Checkbox isChecked={termsChecked} onChange={handleTermsChange}>
                        I agree to the  
                        <Text mx="1" as="span" color="blue.500" _hover={{ textDecoration: "underline" }}>
                            <Link href="https://referralhaven.com/terms-of-service" target="_blank">
                                terms of service   
                            </Link> 
                        </Text>
                        and 
                        <Text mx="1" as="span" color="blue.500" _hover={{ textDecoration: "underline" }}>
                            <Link href="https://referralhaven.com/privacy-policy" target="_blank">
                                privacy policy   
                            </Link> 
                        </Text>
                    </Checkbox>
                </Center>

                <Button w="full" rounded="full" variant="outline" isLoading={loading} isDisabled={!isFormValid() || loading} colorScheme="blue" onClick={submitForm}>Create account</Button>

                <Text mt="5" textAlign="center" fontSize="md">Already have an account? <Text as="span" color="blue.500" _hover={{ textDecoration: "underline" }}><Link href="/">Log In</Link></Text></Text>

            </Box>
        </Container>
    )
}