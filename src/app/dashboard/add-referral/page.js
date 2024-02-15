import { Center, Container,Text} from "@chakra-ui/react";
import AddReferralForm from "./add-lead-form";
import fetchUser from "@/app/util/fetchUser";
import { redirect } from "next/navigation";
import serverClientSupabase from "@/app/util/serverClientSupabase";

export default async function Page() {

    const { user, role } = await fetchUser(true);

    if (!user || role.includes('preferred_agent')) {
        redirect('/');
    }

    const supabase = serverClientSupabase();

    const { data: agents, error } = await supabase
        .from('agents')
        .select('address')
        .eq('id', user.id);

    if (!agents[0].address) {
        redirect('/dashboard')
    }

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