import fetchUser from "@/app/util/fetchUser";
import serverClientSupabase from "@/app/util/serverClientSupabase";
import { Box, Button, Container, Flex, Grid, GridItem, Input, Select, SimpleGrid, Stack, Tab, TabList, TabPanel, TabPanels, Tabs, Tag, Text } from "@chakra-ui/react";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import PersonalInfoForm from "./personal-info-form";


export default async function Page({ params }) {
    const id = await params.id;

    const userProfile = await fetchUser();

    if (!userProfile.user) {
        redirect('/');
    }

    const supabase = await serverClientSupabase();

    async function GetProfile() {
        const { data: agents, error } = await supabase
            .from('agents')
            .select('first_name, last_name, email, phone_number, address, license, subscription: subscription_id (*)')
            .eq('id', userProfile.user.id);

        if (error) throw new Error(error.message);

        return agents[0]
    }

    const profile = await GetProfile();

    
    const options = { month: 'short', day: 'numeric', year: 'numeric' };

    const startDateInput = new Date(profile.subscription?.period_start);
    const startDate = startDateInput.toLocaleDateString('en-US', options);

    const endDateInput = new Date(profile.subscription?.period_end);
    const endDate = endDateInput.toLocaleDateString('en-US', options);

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
                    <Link href="/dashboard/account/profile">
                        <Tab>Profile</Tab>
                    </Link>
                    <Link href="/dashboard/account/billing">
                        <Tab>Billing</Tab>
                    </Link>
                    <Link href="/dashboard/account/settings">
                        <Tab>Settings</Tab>
                    </Link>
                </TabList>

                <TabPanels>
                    <TabPanel px="0">
                        <Box w="full" bgColor="blackAlpha.50" p="5" mt="5">
                            <PersonalInfoForm initialInfo={profile} />
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
                            <Stack direction="row" justify="space-between" alignItems="center">
                                <Text fontSize="sm" fontWeight="semibold" color="blackAlpha.800">Billing Information</Text>
                                <Link href="/">
                                    <Button variant="ghost" size="sm">Edit</Button>
                                </Link>
                            </Stack>
                            <Box mt="5">
                                <Box>
                                    <Text fontSize="md" fontWeight="semibold">Plan</Text>
                                    <Text fontSize="lg" mt="2" color="blackAlpha.700">{profile.subscription ? `1 Year Membership for $120.00 /year` : "No subscription"}</Text>
                                </Box>
                                <Box mt="5">
                                    <Text fontSize="md" fontWeight="semibold">Current Billing Period</Text>
                                    <Text fontSize="lg" mt="2" color="blackAlpha.700">{profile.subscription ? `${startDate} - ${endDate}` : "No subscription"}</Text>
                                </Box>                                  
                            </Box>
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