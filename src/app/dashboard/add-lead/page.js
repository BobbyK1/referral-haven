import { Box, Button, Center, Container, Heading, Input, Select, Stack, Text, Textarea } from "@chakra-ui/react";
import AddLeadForm from "./add-lead-form";


export default async function Page() {

    return (
        <Container maxW="container.md">
            <Text color="blackAlpha.800" fontSize="xl" fontWeight="semibold" textAlign="center">Add Lead</Text>

            <Text fontSize="md" color="blackAlpha.600" textAlign="center" mt="5" mb="7">Please enter the lead details in the fields below</Text>

            <Center>
                <AddLeadForm />
            </Center>
        </Container>
    )
}