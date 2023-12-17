import { Box, Button, Container, Flex, Grid, GridItem, Input, Select, SimpleGrid, Stack, Tab, TabList, TabPanel, TabPanels, Tabs, Tag, Text } from "@chakra-ui/react";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";


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
    })

    const { data: { user }, error } = await supabase.auth.getUser();

    if (!user) {
        redirect('/');
    }

    async function GetProfile() {
        const { data: agents, error } = await supabase
            .from('agents')
            .select('first_name, last_name, email, phone_number, address, license')
            .eq('id', user.id);

        if (error) throw new Error(error.message);

        return agents[0]
    }

    const profile = await GetProfile();
    const licenses = profile.license;

    return (
        <Container maxW="container.md">
            <Box>
                <Stack direction="row" alignItems="center">
                        <Text fontSize="2xl" fontWeight="semibold">{profile.first_name} {profile.last_name}</Text>
                        <Tag colorScheme="green" variant="subtle">Active</Tag>
                </Stack>
                <Text fontSize="md" color="blackAlpha.600">{profile.email}</Text>
            </Box>

            <Tabs defaultIndex={id === "profile" ? 0 : id === "billing" ? 1 : 2} mt="5" colorScheme="black">
                <TabList>
                    <Link href="/dashboard/profile">
                        <Tab>Profile</Tab>
                    </Link>
                    <Link href="/dashboard/billing">
                        <Tab>Billing</Tab>
                    </Link>
                    <Link href="/dashboard/settings">
                        <Tab>Settings</Tab>
                    </Link>
                </TabList>

                <TabPanels>
                    <TabPanel px="0">
                        <Box w="full" bgColor="blackAlpha.50" p="5" mt="5">
                            <Stack direction="row" alignItems="center" justify="space-between">
                                <Text fontSize="sm" fontWeight="semibold" color="blackAlpha.800">Personal Information</Text>

                                <Button variant="ghost" size="sm">Edit</Button>
                            </Stack>

                            <SimpleGrid columns="2" mt="8" alignItems="center">
                                <Text fontSize="md">Email</Text>
                                <Input defaultValue={profile.email} borderColor="blackAlpha.400" readOnly />
                            </SimpleGrid>

                            <SimpleGrid columns="2" mt="5" alignItems="center">
                                <Text fontSize="md">Phone Number</Text>
                                <Input defaultValue={profile.phone_number} borderColor="blackAlpha.400" readOnly />
                            </SimpleGrid>

                            <SimpleGrid columns="2" mt="5" >
                                <Text fontSize="md">Address</Text>
                                <Box>
                                    <Input defaultValue={profile.address?.address} borderColor="blackAlpha.400" readOnly />
                                    <Grid mt="2" gap="2" templateColumns="repeat(7, 1fr)">
                                        <GridItem colSpan="3">
                                            <Input defaultValue={profile.address?.city} borderColor="blackAlpha.400"></Input>
                                        </GridItem>
                                        <GridItem colSpan="2">
                                            <Select defaultValue={profile.address?.state} borderColor="blackAlpha.400">
                                                <option></option>
                                                <option value="IN">IN</option>
                                            </Select>
                                        </GridItem>
                                        <GridItem colSpan="2">
                                            <Input defaultValue={profile.address?.zip} borderColor="blackAlpha.400" />
                                        </GridItem>
                                    </Grid>
                                </Box>
                            </SimpleGrid>
                        </Box>

                        <Box w="full" bgColor="blackAlpha.50" p="5" mt="5">
                            <Text fontSize="sm" fontWeight="semibold" color="blackAlpha.800">License Information</Text>

                            <SimpleGrid mt="5" columns="3" gap="3">
                                <>
                                    {licenses.map(license => (
                                        <Box key={license.licenseNumber} _hover={{ bg: "blackAlpha.100", cursor: "pointer"}} transition="0.2s ease" p="5" borderColor="blackAlpha.400" borderWidth="thin" borderRadius="5">
                                            <Text textAlign="center">{license.licenseType}: {license.licenseNumber}</Text>
                                        </Box>
                                    ))}
                                    <Box _hover={{ bg: "blackAlpha.100", cursor: "pointer"}} transition="0.2s ease" p="5" borderColor="blackAlpha.400" borderWidth="thin" borderRadius="5">
                                        <Text textAlign="center" fontWeight="semibold">Add License</Text>
                                    </Box>
                                </>
                            </SimpleGrid>
                        </Box>
                    </TabPanel>
                    <TabPanel px="0">
                        <Box mt="5" p="5" w="full" bg="blackAlpha.50">
                            <Text fontSize="sm" fontWeight="semibold" color="blackAlpha.800">Billing</Text>
                        </Box>
                    </TabPanel>

                    <TabPanel px="0">
                        <Box mt="5" p="5" w="full" bg="blackAlpha.50">
                            <Text fontSize="sm" fontWeight="semibold" color="blackAlpha.800">Settings</Text>
                        </Box>
                    </TabPanel>
                </TabPanels>
            </Tabs>


            
        </Container>
    )
}