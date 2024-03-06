import fetchUser from "@/app/util/fetchUser";
import serverClientSupabase from "@/app/util/serverClientSupabase";
import { Box, Button, Container, SimpleGrid, Stack, Tab, TabList, TabPanel, TabPanels, Tabs, Tag, Text } from "@chakra-ui/react";
import Link from "next/link";
import { redirect } from "next/navigation";
import PersonalInfoForm from "./personal-info-form";
import AddLicenseModal from "./add-license-modal";
import LicenseCard from "../LicenseCard";
import Stripe from "stripe";

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY)

export default async function Page({ params }) {
    const id = await params.id;

    const { user, role } = await fetchUser(true);

    if (!user) {
        redirect('/');
    }

    const supabase = serverClientSupabase();

    async function GetProfile() {
        const { data: agents, error } = await supabase
            .from('agents')
            .select('first_name, last_name, email, phone_number, address, license, status, direct_deposit_info: direct_deposit_info (*), subscription: subscription_id (*)')
            .eq('id', user.id);

        if (error) throw new Error(error.message);

        return agents[0]
    }

    const GetSubscription = async () => {
        const subscription = await stripe.subscriptions.retrieve(
            profile.subscription.subscription_id
        )

        return subscription.plan
    }

    const profile = await GetProfile();
    if (role.includes('referral_agent')) {
        const sub = await GetSubscription();
    }

    // if (profile.direct_deposit_info) {
    //     const accountNumber = profile.direct_deposit_info.account_number;
    //     var maskedAccountNumber = accountNumber && accountNumber.length >= 4
    //             ? '*'.repeat(accountNumber.length - 4) + accountNumber.slice(-4)
    //             : '';
    
    //     const nineDigitRoutingNumber = profile.direct_deposit_info.nine_digit_routing_number;
    //     var maskedRoutingNumber = nineDigitRoutingNumber && nineDigitRoutingNumber.length > 0
    //               ? '*'.repeat(nineDigitRoutingNumber.length)
    //               : '';
    // }
    
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
                        <Tag colorScheme={profile.status ? "green" : "red"} variant="subtle">{profile.status ? "Active" : "Inactive"}</Tag>
                </Stack>
                <Text fontSize="md" color="blackAlpha.600">{profile.email}</Text>
            </Box>

            <Tabs defaultIndex={id === "profile" ? 0 : id === "billing" ? 1 : 2} mt="5" colorScheme="black">
                <TabList>
                    <Link href="/dashboard/account/profile">
                        <Tab>Profile</Tab>
                    </Link>
                    {
                        role.includes("referral_agent") ? 
                        <Link href="/dashboard/account/billing">
                            <Tab>Billing</Tab>
                        </Link> : null
                    }
                    
                    {/* <Link href="/dashboard/account/settings">
                        <Tab>Settings</Tab>
                    </Link> */}
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
                                        <LicenseCard license={license} />
                                    ))}
                                    <AddLicenseModal id={user.id} />
                                </>
                            </SimpleGrid>
                        </Box>
                    </TabPanel>
                    { role.includes('referral_agent') ? 
                        <TabPanel px="0">
                            <Box mt="5" p="5" w="full" bg="blackAlpha.50">
                                <Stack direction="row" justify="space-between" alignItems="center">
                                    <Text fontSize="sm" fontWeight="semibold" color="blackAlpha.800">Billing Information</Text>
                                    <Link target="_blank" href={process.env.NEXT_PUBLIC_STRIPE_CUSTOMER_PORTAL}>
                                        <Button variant="ghost" size="sm">Edit</Button>
                                    </Link>
                                </Stack>
                                <Box mt="5">
                                    <Box>
                                        <Text fontSize="md" fontWeight="semibold">Plan</Text>
                                        <Text fontSize="lg" mt="2" color="blackAlpha.700">{sub.interval === "month" ? `${sub.interval_count} Month Membership for ${sub.amount / 100}.00 /${sub.interval_count === 6 ? "6 mo" : "mo"}` : "1 Year Membership for $120.00 /year"}</Text>
                                    </Box>
                                    <Box mt="5">
                                        <Text fontSize="md" fontWeight="semibold">Current Billing Period</Text>
                                        <Text fontSize="lg" mt="2" color="blackAlpha.700">{profile.subscription ? `${startDate} - ${endDate}` : "No subscription"}</Text>
                                    </Box>                                  
                                </Box>
                            </Box>

                            {/* <Box mt="5" p="5" w="full" bg="blackAlpha.50">
                                <Stack direction="row" justify="space-between" alignItems="center">
                                    <Text fontSize="sm" fontWeight="semibold" color="blackAlpha.800">Direct Deposit Information</Text>

                                    {profile.direct_deposit_info ? <DirectDepositModal directDepositId={profile.direct_deposit_info.id}>Edit</DirectDepositModal> : <DirectDepositModal>Add Direct Deposit Information</DirectDepositModal>}
                                </Stack>
                                

                                {profile.direct_deposit_info && 
                                    <>
                                        <Text fontSize="md" fontWeight="semibold">Bank Name</Text>
                                        <Input mt="2" bg="transparent" value={profile.direct_deposit_info.bank_name} />

                                        <Stack direction={[ "column", "column", "row" ]} spacing="5" mt="5">
                                            <Box w="full">
                                                <Text fontSize="md" fontWeight="semibold">Account Number</Text>
                                                <Input mt="2" value={maskedAccountNumber} />
                                            </Box>
                                            <Box w="full">
                                                <Text fontSize="md" fontWeight="semibold">9 Digit Routing Number</Text>
                                                <Input mt="2" value={maskedRoutingNumber} />
                                            </Box>
                                        </Stack>
                                    </> 
                                }
                            </Box> */}
                        </TabPanel>
                        : null }
                            

                    {/* <TabPanel px="0">
                        <Box mt="5" p="5" w="full" bg="blackAlpha.50">
                            <Text fontSize="sm" fontWeight="semibold" color="blackAlpha.800">Settings</Text>
                        </Box>
                    </TabPanel> */}
                </TabPanels>
            </Tabs>


            
        </Container>
    )
}