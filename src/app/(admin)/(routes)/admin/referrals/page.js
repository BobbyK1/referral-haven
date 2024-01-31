import { DownChevron } from "@/app/UI/Icons";
import fetchAdminUser from "@/app/util/fetchAdminUser"
import serverClientSupabase from "@/app/util/serverClientSupabase";
import { Button, Container, Heading, Input, Menu, MenuButton, MenuItem, MenuList, Stack, Tab, TabList, TabPanel, TabPanels, Table, TableContainer, Tabs, Tag, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react";
import Link from "next/link";
import { redirect } from "next/navigation";


export default async function Page() {
    const { role } = await fetchAdminUser();

    if (!role.includes('admin')) {
        redirect('/')
    }

    const supabase = serverClientSupabase();

    async function GetReferrals() {
        const { data: leads, error } = await supabase
            .from('leads')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw new Error(error.message);

        return leads;
    }

    const referrals = await GetReferrals();

    return (
        <Container maxW="8xl" mt="8">

            <Stack direction="row" alignItems="center" justify="space-between">
                <Heading fontSize="3xl" as="h2">Referrals</Heading>
                <Button colorScheme="blue">+ Create</Button>
            </Stack>
        
            <Stack mt="10" direction="row" justify="space-between" alignItems="center">
                <Input bgColor="white" shadow="sm" borderColor="blackAlpha.300" placeholder="Search referrals..." type="text" w="96" />

                <Menu>
                    <MenuButton variant="outline" borderColor="blackAlpha.300" as={Button} bgColor="white" rightIcon={<DownChevron fontSize="sm" />}>Sort: <Text as="span" ml="2">Newest</Text></MenuButton>

                    <MenuList>
                        <MenuItem>Oldest</MenuItem>
                    </MenuList>
                </Menu>
            </Stack>

            <Tabs variant="unstyled" mt="10">
                <TabList>
                    <Tab _selected={{ color: "blue.500", borderBottomWidth: "thin", borderColor: "blue.500" }}>Referrals</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel px="0">
                        <TableContainer borderRadius="5" mt="5" borderWidth="thin" borderColor="blackAlpha.300">
                            <Table>
                                <Thead bgColor="gray.50">
                                    <Tr>
                                        <Th fontWeight="normal" fontSize="sm">Name</Th>
                                        <Th fontWeight="normal" fontSize="sm">Email</Th>
                                        <Th fontWeight="normal" fontSize="sm">Phone</Th>
                                        <Th fontWeight="normal" fontSize="sm">Status</Th>
                                        <Th />
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {referrals.length === 0 ? <Text fontSize="md" textAlign="center" color="blackAlpha.500">No referrals...</Text> :
                                        <>
                                            {referrals.map(referral => {

                                                return (
                                                    <Tr key={referral.id}>
                                                        <Td>{referral.first_name} {referral.last_name}</Td>
                                                        <Td>{referral.email}</Td>
                                                        <Td>{referral.phone_number}</Td>
                                                        <Td textTransform="capitalize"><Tag size="sm" rounded="full" bgColor="blue.400" color="white" variant="subtle">{referral.status}</Tag></Td>
                                                        <Td><Button as={Link} href={`/dashboard/referrals/${referral.id}`} target="_blank" variant="ghost" size="sm">View</Button></Td>
                                                    </Tr>
                                                )
                                            })}
                                        </>
                                    }
                                    <Tr>
                                        <Td></Td>
                                    </Tr>
                                </Tbody>
                            </Table>
                        </TableContainer>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Container>
    )
}

// import { Box, Center, Spinner, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react"
// import { createServerClient } from "@supabase/ssr"
// import { cookies } from "next/headers"
// import { redirect } from "next/navigation"
// import { Suspense } from "react"


// export default async function Page() {
//     const cookieStore = cookies()

//     const supabase = createServerClient(
//         process.env.NEXT_PUBLIC_SUPABASE_URL,
//         process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
//         {
//         cookies: {
//             get(name) {
//             	return cookieStore.get(name)?.value
//             },
//         },
//     })

//     const { data: { user }, error } = await supabase.auth.getUser();

//     if (!user) {
//         redirect('/')
//     }

//     async function GetRole() {
//         const { data: agents, error } = await supabase
//             .from('agents')
//             .select('role')
//             .eq('id', user.id);

//         return agents[0].role;
//     }

//     const role = await GetRole();

//     if (!role.includes('admin')) {
//         redirect('/');
//     }

//     async function Referrals() {
//         // const { data: leads, error } = await supabase
//         //     .from('leads')
//         //     .select('*, referring_agent: referring_agent (*)')

//         return (
//             <Center>
//                 {/* <TableContainer w="full">
//                     <Table w="full">
//                         <Thead>
//                             <Tr>
//                                 <Th>Name</Th>
//                                 <Th>Phone</Th>
//                                 <Th>Email</Th>
//                                 <Th>Goal</Th>
//                                 <Th>Status</Th>
//                                 <Th>Referring Agent</Th>
//                                 <Th>Assigned Agent</Th>
//                                 <Th>Referral Type</Th>
//                             </Tr>
//                         </Thead>

//                         <Tbody>
//                             <>
//                                 {leads.map(lead => {
//                                     return (
//                                         <Tr>
//                                             <Td>{lead.first_name} {lead.last_name}</Td>
//                                             <Td>{lead.phone_number}</Td>
//                                             <Td>{lead.email}</Td>
//                                             <Td>{lead.goal}</Td>
//                                             <Td textTransform="capitalize">{lead?.status}</Td>
//                                             <Td>{lead.referring_agent.first_name} {lead.referring_agent.last_name}</Td>
//                                             <Td>{lead.assigned_agent ? lead.assigned_agent : "No assigned agent"}</Td>
//                                             <Td>{lead.referral_type === "hasAgent" ? "Normal" : "Haven Preferred"}</Td>
//                                         </Tr>
//                                     )
//                                 })}
//                             </>
//                         </Tbody>
//                     </Table>
//                 </TableContainer> */}
//             </Center>
//         )
//     }

//     return (
//         <Box w="full">
//             <Suspense fallback={<Spinner />}>
//                 <Referrals />
//             </Suspense>
//         </Box>
//     )
// }