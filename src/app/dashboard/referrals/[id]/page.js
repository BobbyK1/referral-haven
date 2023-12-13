import AddUpdateButton from "@/app/UI/AddUpdateButton";
import { Edit, Email, Phone } from "@/app/UI/Icons";
import { Box, Button, Center, Container, Divider, IconButton, Stack, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from "@chakra-ui/react";
import Link from "next/link";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { redirect } from "next/navigation";
import AddPropertyButton from "@/app/UI/AddPropertyButton";
import ChangeStatusMenu from "@/app/UI/ChangeStatusMenu";

export default async function Page({ params }) {
    const id = await params.id;

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
        }
    )

    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) throw new Error(error.message);

    if (!user) {
        redirect('/');
    }

    async function GetAgentProfile() {
        const { data: agents, error } = await supabase.from('agents').select('role').eq('id', user.id);;

        if (error) throw new Error(error.message);

        return agents[0].role
    }

    let agent = [];

    agent = await GetAgentProfile();

    async function GetLead() {
        const { data: leads, error } = await supabase
            .from('leads')
            .select('*')
            .eq('id', id);

        if (error) throw new Error(error.message);

        return leads[0]
    }

    const lead = await GetLead();

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

    async function GetProperties() {
        const { data: leads, error } = await supabase
            .from('leads')
            .select('properties')
            .eq('id', id);

        if (error) throw new Error(error.message);

        return leads[0].properties;
    }

    const properties = await GetProperties();

    return (
        <Container maxW="container.md">
            <Stack direction="row" alignItems="center" justify="space-between">
                <Box>
                    <Stack direction="row" alignItems="center">
                        <Text fontSize="xl" fontWeight="semibold">{lead.first_name} {lead.last_name}</Text>
                        {lead.status && 
                            <ChangeStatusMenu id={id} status={lead.status} />
                            // <Tag variant="subtle" colorScheme="blue" size="sm" rounded="full" textTransform="capitalize">{lead.status}</Tag>
                        }
                    </Stack>
                    <Text fontSize="sm" mt="-1" textTransform="capitalize">{lead.goal === "Both" ? "Buying & Selling" : lead.goal}</Text>
                </Box>
                
                <Stack direction="row" alignItems="center">
                    <Link href={`tel:${lead.phone_number}`}>
                        <IconButton icon={<Phone fontSize="xl" color="white" />} title="Call" size="sm" bg="blue.500" colorScheme="blue" rounded="full" />
                    </Link>

                    <Link href={`mailto:${lead.email}`} target="_blank" referrerPolicy="no-referrer">
                        <IconButton icon={<Email fontSize="xl" color="white" />} title="Email" size="sm" bg="blue.500" colorScheme="blue" rounded="full" />
                    </Link>

                    <IconButton icon={<Edit fontSize="xl" color="white" />} title="Edit" size="sm" bg="blue.500" colorScheme="blue" rounded="full" />
                </Stack>
            </Stack>

            <Tabs mt="5" colorScheme="black">
                <TabList>
                    <Tab>Details</Tab>
                    <Tab>Documents</Tab>
                </TabList>

                <TabPanels>
                    <TabPanel px="0">
                        <Box mt="5" bg="blackAlpha.50" p="5" borderRadius="5" minH="44">
                            <Text fontSize="sm" fontWeight="semibold" color="blackAlpha.800">Notes</Text>

                            {lead.notes && <Text mt="5" fontSize="sm" color="blackAlpha.800">{lead.notes}</Text>}
                        </Box>

                        <Box mt="5">
                            <Stack direction="row" w="full" justify="space-between" alignItems="center">
                                <Text fontSize="md">Property</Text>
                                <AddPropertyButton id={id} />
                            </Stack>
                            <Divider mt="4" borderColor="blackAlpha.400" />
                            {!properties ? <Text mt="5" color="blackAlpha.500" textAlign="center" fontSize="md">No properties yet...</Text> : 
                                <>
                                    {properties.map(property => {

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

                                {agent[0] !== 'referral_agent' && <AddUpdateButton />}
                            </Stack>
                        </Box>

                        <Divider mt="4" borderColor="blackAlpha.400" />

                        <Text mt="5" color="blackAlpha.500" textAlign="center" fontSize="md">No updates yet...</Text>
                    </TabPanel>
                </TabPanels>
            </Tabs>

            
        </Container>
    )
}