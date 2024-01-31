import { Options } from "@/app/(admin)/UI/icons";
import { DownChevron } from "@/app/UI/Icons";
import fetchAdminUser from "@/app/util/fetchAdminUser"
import serverClientSupabase from "@/app/util/serverClientSupabase";
import { Button, Container, Heading, IconButton, Input, Menu, MenuButton, MenuItem, MenuList, Stack, Tab, TabList, TabPanel, TabPanels, Table, TableContainer, Tabs, Tag, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react";
import Link from "next/link";
import { redirect } from "next/navigation";


export default async function Page() {
    const { user, role } = await fetchAdminUser();

    if (!role.includes('admin')) {
        redirect('/')
    }

    const supabase = serverClientSupabase();

    async function GetAgents() {
        const { data: agents, error } = await supabase
            .from('agents')
            .select('*')
            .contains('role', ['referral_agent'])

        if (error) throw new Error(error.message);

        return agents;
    }

    const agents = await GetAgents();

    return (
        <Container maxW="8xl" mt="8">

            <Stack direction="row" alignItems="center" justify="space-between">
                <Heading fontSize="3xl" as="h2">Agents</Heading>
                <Button colorScheme="blue">+ Create</Button>
            </Stack>
        
            <Stack mt="10" direction="row" justify="space-between" alignItems="center">
                <Input bgColor="white" shadow="sm" borderColor="blackAlpha.300" placeholder="Search agents..." type="text" w="96" />

                <Menu>
                    <MenuButton variant="outline" borderColor="blackAlpha.300" as={Button} bgColor="white" rightIcon={<DownChevron fontSize="sm" />}>Sort: <Text as="span" ml="2">Newest</Text></MenuButton>

                    <MenuList>
                        <MenuItem>Oldest</MenuItem>
                    </MenuList>
                </Menu>
            </Stack>

            <Tabs variant="unstyled" mt="10">
                <TabList>
                    <Tab fontWeight="semibold" color="blackAlpha.600" _selected={{ color: "blue.500", borderBottomWidth: "thin", borderColor: "blue.500" }}>Referral Agents</Tab>
                    <Tab fontWeight="semibold" color="blackAlpha.600" _selected={{ color: "blue.500", borderBottomWidth: "thin", borderColor: "blue.500" }}>Guest Agents</Tab>
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
                                    <>
                                        {agents.map(agent => {
                                            return (
                                                <Tr href={`/admin/agents/${agent.id}`} _hover={{ bg: "blackAlpha.50", cursor: "pointer" }} transition="0.2s ease">
                                                    
                                                        <Td>{agent.first_name} {agent.last_name}</Td>
                                                        <Td>{agent.email}</Td>
                                                        <Td>{agent.phone_number}</Td>
                                                        <Td><Tag variant="subtle" colorScheme={agent.address && agent.uploaded_direct_deposit_form ? "green" : "red" }>{agent.address && agent.uploaded_direct_deposit_form ? "Active" : "Inactive"}</Tag></Td>
                                                        <Td><IconButton size="sm" rounded="full" bgColor="blackAlpha.300"  icon={<Options fontSize="xl" />} /></Td>
                                                    
                                                </Tr>
                                            )
                                        })}
                                    </>
                                </Tbody>
                            </Table>
                        </TableContainer>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Container>
    )
}