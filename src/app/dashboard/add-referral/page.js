import { Center, Container,Text} from "@chakra-ui/react";
import AddReferralForm from "./add-lead-form";


export default async function Page() {

    return (
        <Container maxW="container.md">
            <Text color="blackAlpha.800" fontSize="xl" fontWeight="semibold" textAlign="center">Add Referral</Text>

            <Text fontSize="md" color="blackAlpha.600" textAlign="center" mt="5" mb="7">Please enter the lead details in the fields below</Text>

            <Center>
                <AddReferralForm />
            </Center>
        </Container>
    )
}