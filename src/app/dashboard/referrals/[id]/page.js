import AddUpdateButton from "@/app/UI/AddUpdateButton";
import { Account, Check, Email, Phone } from "@/app/UI/Icons";
import { Alert, AlertIcon, Box, Button, Center, Container, Divider, IconButton, SimpleGrid, Stack, Tab, TabList, TabPanel, TabPanels, Table, TableContainer, Tabs, Tag, Tbody, Td, Text, Th, Thead, Tooltip, Tr } from "@chakra-ui/react";
import Link from "next/link";
import { redirect } from "next/navigation";
import AddPropertyButton from "@/app/UI/AddPropertyButton";
import ChangeStatusMenu from "@/app/UI/ChangeStatusMenu";
import fetchUser from "@/app/util/fetchUser";
import serverClientSupabase from "@/app/util/serverClientSupabase";
import ReferralUpdates from "@/app/UI/ReferralUpdates";
import AssignAgent from "./AssignAgent";
import PdfSignautureEmbed from "./PdfSignatureEmbed";
import EditReferralProfile from "./EditReferralProfile";
import dynamic from "next/dynamic";

const FileUpload = dynamic(() => import('./FileUpload'), { ssr: false });

export default async function Page({ params }) {
    const id = await params.id;
    const months = ["Jan.", "Feb.", "Mar.", "Apr.", "May", "June", "July", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."];

    const { user, role } = await fetchUser(true);

    if (!user) {
        redirect('/');
    }

    const supabase = serverClientSupabase();

    async function GetLead() {
        const { data: leads, error } = await supabase
            .from('leads')
            .select('*, referring_agent: referring_agent (*), assigned_agent: assigned_agent (*)')
            .eq('id', id);

        if (error) throw new Error(error.message);

        return leads[0]
    }

    async function GetUploads() {
        if (role.includes('admin')) {
            const { data: uploads, error } = await supabase
                .from('referral_uploads')
                .select('*')
                .eq('assigned_to', id)
                .order('created_at', { ascending: false });

            return uploads;
        } else {
            const { data: uploads, error } = await supabase
                .from('referral_uploads')
                .select('*')
                .eq('assigned_to', id)
                .not('private', 'eq', true)
                .order('created_at', { ascending: false });

            return uploads;
        }
    }

    const lead = await GetLead();
    const uploads = await GetUploads();

    if (!lead) {
        
        return (
            <Center mt="10" flexDirection="column">
                <Text fontSize="3xl" fontWeight="semibold" color="blackAlpha.700">Referral not found...</Text>
                <Link href="/">
                    <Button variant="ghost" size="sm" mt="3">Return Home</Button>
                </Link>
            </Center>
        )
    }

    return (
        <Container maxW="container.md">
            {user.id === lead.assigned_agent && <Alert variant="left-accent" status="error" borderRadius="5" mb="5"><AlertIcon /> You must sign the referral agreement before receiving this client's details. Please navigate to the Documents tab to complete the paperwork.</Alert>}
            <Stack direction={["column", "row"]} alignItems={["flex-start", "center"]} justify="space-between">
                <Box>
                    <Stack direction="row" alignItems="center">
                        <Text fontSize="xl" fontWeight="semibold">{lead.first_name} {lead.last_name}</Text>
                        {lead.referral_type === "havenPreferred" && <Tooltip label="Haven Preferred®"><Box><Check p="1" rounded="full" bgColor="blue.400" fontSize="xl" color="white" /></Box></Tooltip>}
                        {lead.status && 
                            <>
                                {
                                    role.includes('preferred_agent') || role.includes('admin') ? <ChangeStatusMenu id={id} status={lead.status} /> : <Tag variant="solid" colorScheme="blue" rounded="full" textTransform="capitalize">{lead.status}</Tag>
                                }
                                
                               
                            </>
                        }
                    </Stack>
                    <Text fontSize="sm" mt="-1" textTransform="capitalize">{lead.goal === "Both" ? "Buying & Selling" : lead.goal}</Text>
                </Box>
                
                <Stack direction="row" alignItems="center">
                    <Link href={`tel:${lead.phone_number}`}>
                        <IconButton icon={<Phone fontSize="xl" color="white" />} title="Call" size="sm" bg="blue.400" colorScheme="blue" rounded="full" />
                    </Link>

                    <Link href={`mailto:${lead.email}`} target="_blank" referrerPolicy="no-referrer">
                        <IconButton icon={<Email fontSize="xl" color="white" />} title="Email" size="sm" bg="blue.400" colorScheme="blue" rounded="full" />
                    </Link>

                    {role.includes('admin') || lead.referring_agent === user.id ? <EditReferralProfile lead={lead} /> : null}
                </Stack>
            </Stack>

            <Box mt="5">
                {role.includes('admin') &&
                    <Stack direction="row" alignItems="center">
                        <Account />
                        {
                            role.includes('admin') ? <AssignAgent id={id} assignedAgent={lead.assigned_agent} />
                            : lead.assigned_agent ? <Text fontSize="sm">{lead.assigned_agent.first_name} {lead.assigned_agent.last_name}</Text> : <Text fontSize="sm">Not Assigned</Text>
                        }
                        
                    </Stack>
                }
            </Box>

            <Tabs mt="5" colorScheme="black">
                <TabList>
                    <Tab>Details</Tab>
                    <Tab>Documents</Tab>
                    {role.includes('admin') && <Tab>Agent Info</Tab>}
                </TabList>

                <TabPanels>
                    <TabPanel px="0">
                        <Box mt="5" bg="blackAlpha.50" p="5" borderRadius="5" minH="fit-content">
                            <Text fontSize="sm" fontWeight="semibold" color="blackAlpha.800">Notes</Text>

                            {lead.notes && <Text mt="5" fontSize="sm" color="blackAlpha.800">{lead.notes}</Text>}
                        </Box>

                        <Box mt="5">
                            <Stack direction="row" w="full" justify="space-between" alignItems="center">
                                <Text fontSize="md">Transaction(s)</Text>
                                <AddPropertyButton id={id} />
                            </Stack>
                            <Divider mt="4" borderColor="blackAlpha.400" />
                            {!lead.properties ? <Text mt="5" color="blackAlpha.500" textAlign="center" fontSize="md">No properties yet...</Text> : 
                                <>
                                    {lead.properties.map(property => {

                                        return (
                                            <Box w="full" bg="blackAlpha.50" mt="2" p="5">
                                                <Stack direction="row" justify="space-between" alignItems="center">
                                                    <Box>
                                                        <Text fontSize="xs" textTransform="uppercase">{property.property_goal} - ${property.property_price}</Text>
                                                        <Text fontSize="sm">{property.property_address}</Text>
                                                    </Box>

                                                    <Button variant="ghost" size="sm">Edit</Button>
                                                </Stack>
                                            </Box>
                                        )
                                    })}
                                </>
                            }
                            
                        </Box>

                        <Box mt="10">
                            <Stack direction="row" alignItems="center" justify="space-between">
                                <Text fontSize="md">Updates</Text>

                                {user.id === lead.assigned_agent || role.includes("admin") && <AddUpdateButton id={id} />}
                            </Stack>
                        </Box>

                        <Divider mt="4" borderColor="blackAlpha.400" />

                        <Box mt="5">
                            <ReferralUpdates id={id} />
                        </Box>
                    </TabPanel>
                    <TabPanel px="0">
                        {/* <Stack direction="row" mt="5" alignItems="center">
                            <Box w="full" />
                            {role.includes('admin') && <FileUpload referralId={id} />}
                        </Stack> */}

                        {role.includes('admin') && <FileUpload referralId={id} />}
                        
                        <TableContainer px="0">
                            <Table variant="simple" size="sm">
                                <Thead>
                                    <Tr>
                                        <Th px="0">File Name</Th>
                                        <Th></Th>
                                        <Th>Date</Th>
                                    </Tr>
                                </Thead>

                                <Tbody>
                                    {uploads.map(upload => {
                                        const date = new Date(upload.created_at);

                                        const month = months[date.getMonth()];

                                        return (
                                            <Tr key={upload.id} _hover={{ bg: "blackAlpha.50" }} transition="0.1s ease">
                                                <Td px="0" color="blue.500" _hover={{ textDecor: "underline" }}>{upload.file_name}</Td>
                                                <Td />
                                                <Td>{month} {date.getDate()}, {date.getFullYear()}</Td>
                                            </Tr>
                                        )
                                    })}
                                </Tbody>
                            </Table>
                        </TableContainer>

                        {uploads.length === 0 && <Text fontSize="md" mt="5" color="blackAlpha.500" textAlign="center">No files uploaded...</Text>}
                    </TabPanel>
                    {role.includes('admin') &&
                        <TabPanel px="0">
                            <Box mt="5">
                                <Text fontSize="md" fontWeight="semibold">Referring Agent</Text>
                                <Divider />

                                <Box mt="4">
                                    <SimpleGrid columns="2">
                                        <Box>
                                            <Text fontSize="sm" color="blackAlpha.600">Name</Text>
                                            <Text fontSize="md">{lead.referring_agent.first_name} {lead.referring_agent.last_name}</Text>
                                        </Box>
                                        <Box>
                                            <Text fontSize="sm" color="blackAlpha.600">Email</Text>
                                            <Text fontSize="md">{lead.referring_agent.email}</Text>
                                        </Box>
                                        <Box mt="5">
                                            <Text fontSize="sm" color="blackAlpha.600">Phone Number</Text>
                                            <Text fontSize="md">{lead.referring_agent.phone_number}</Text>
                                        </Box>
                                        <Box mt="5">
                                            <Text fontSize="sm" color="blackAlpha.600">Role</Text>
                                            <Text fontSize="md" textTransform="capitalize">{lead.referring_agent.role.toString().replace("_", " ")}</Text>
                                        </Box>
                                    </SimpleGrid>
                                </Box>
                            </Box>
                            
                            <Box mt="10">
                                <Text fontSize="md" fontWeight="semibold">Receiving Agent</Text>
                                <Divider />

                                {lead.assigned_agent ? 
                                    <Box mt="4">
                                        <SimpleGrid columns="2">
                                            <Box>
                                                <Text fontSize="sm" color="blackAlpha.600">Name</Text>
                                                <Text fontSize="md">{lead.assigned_agent.first_name} {lead.assigned_agent.last_name}</Text>
                                            </Box>
                                            <Box>
                                                <Text fontSize="sm" color="blackAlpha.600">Email</Text>
                                                <Text fontSize="md">{lead.assigned_agent.email}</Text>
                                            </Box>
                                            <Box mt="5">
                                                <Text fontSize="sm" color="blackAlpha.600">Phone Number</Text>
                                                <Text fontSize="md">{lead.assigned_agent.phone_number}</Text>
                                            </Box>
                                            <Box mt="5">
                                                <Text fontSize="sm" color="blackAlpha.600">Role</Text>
                                                <Text fontSize="md" textTransform="capitalize">{lead.assigned_agent.role.toString().replace("_", " ")}</Text>
                                            </Box>
                                        </SimpleGrid>
                                    </Box>
                                : <Text mt="8" fontSize="md" color="blackAlpha.600" textAlign="center">No agent assigned...</Text>}
                            </Box>
                        </TabPanel>
                    }
                </TabPanels>
            </Tabs>

            
        </Container>
    )
}