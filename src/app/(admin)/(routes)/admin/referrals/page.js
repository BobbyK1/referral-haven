import { Box, Center, Spinner, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { Suspense } from "react"


export default async function Page() {
    const cookieStore = cookies()

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
        cookies: {
            get(name) {
            	return cookieStore.get(name)?.value
            },
        },
    })

    const { data: { user }, error } = await supabase.auth.getUser();

    if (!user) {
        redirect('/')
    }

    async function GetRole() {
        const { data: agents, error } = await supabase
            .from('agents')
            .select('role')
            .eq('id', user.id);

        return agents[0].role;
    }

    const role = await GetRole();

    if (!role.includes('admin')) {
        redirect('/');
    }

    async function Referrals() {
        // const { data: leads, error } = await supabase
        //     .from('leads')
        //     .select('*, referring_agent: referring_agent (*)')

        return (
            <Center>
                {/* <TableContainer w="full">
                    <Table w="full">
                        <Thead>
                            <Tr>
                                <Th>Name</Th>
                                <Th>Phone</Th>
                                <Th>Email</Th>
                                <Th>Goal</Th>
                                <Th>Status</Th>
                                <Th>Referring Agent</Th>
                                <Th>Assigned Agent</Th>
                                <Th>Referral Type</Th>
                            </Tr>
                        </Thead>

                        <Tbody>
                            <>
                                {leads.map(lead => {
                                    return (
                                        <Tr>
                                            <Td>{lead.first_name} {lead.last_name}</Td>
                                            <Td>{lead.phone_number}</Td>
                                            <Td>{lead.email}</Td>
                                            <Td>{lead.goal}</Td>
                                            <Td textTransform="capitalize">{lead?.status}</Td>
                                            <Td>{lead.referring_agent.first_name} {lead.referring_agent.last_name}</Td>
                                            <Td>{lead.assigned_agent ? lead.assigned_agent : "No assigned agent"}</Td>
                                            <Td>{lead.referral_type === "hasAgent" ? "Normal" : "Haven Preferred"}</Td>
                                        </Tr>
                                    )
                                })}
                            </>
                        </Tbody>
                    </Table>
                </TableContainer> */}
            </Center>
        )
    }

    return (
        <Box w="full">
            <Suspense fallback={<Spinner />}>
                <Referrals />
            </Suspense>
        </Box>
    )
}