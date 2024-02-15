import { Box, Button, Container, IconButton, Input, Select, SimpleGrid, Spinner, Stack, Text } from "@chakra-ui/react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Add } from "@/app/UI/Icons";
import fetchUser from "@/app/util/fetchUser";
import serverClientSupabase from "@/app/util/serverClientSupabase";

export default async function Page() {

	const { user, role } = await fetchUser(true);

	if (!user) {
		redirect('/');
	}

	const supabase = serverClientSupabase();

	async function GetRecentReferrals() {
		const { data: leads, error } = await supabase.from('leads').select("*").eq("referring_agent", user.id);

		if (error) throw new Error(error.message)

		return leads
	}

	async function GetAgent() {
		const { data: agents, error } = await supabase
			.from('agents')
			.select('address,direct_deposit_info')
			.eq('id', user.id);

		if (error) throw new Error(error.message);

		return agents[0]
	}

	const agent = await GetAgent();

	async function CheckStatus() {
		return agent.address
	}

	const checkStatus = await CheckStatus();
	
	const referrals = await GetRecentReferrals();

    return (
        <Container maxW="container.md">
			<Stack direction="row" justify="space-between">
            	<Input w="96" placeholder="Search..." mb="10" bg="blackAlpha.50" borderColor="blackAlpha.100" />
				{!role.includes('preferred_agent') &&
				<Box h="fit-content">
					<Link href="/dashboard/add-referral">
						<IconButton isDisabled={!checkStatus} title="Add Lead" icon={<Add />} size="sm" rounded="full" colorScheme="blue" bg="blue.400" />
					</Link>
				</Box>
				}
			</Stack>
			<Suspense fallback={<Spinner />}>
				{referrals.length === 0 ? <Text my="20" textAlign="center" fontSize="lg" color="blackAlpha.700">No referrals yet...</Text> :
				referrals
				.map(referral => {
					// const getDays = async () => {
					// 	const date = await getDaysAgoOrToday(lead.updated);

					// 	return date
					// }

					// const days = await getDays();

						return (
							<SimpleGrid columns="3" alignItems="center" w="full" bg="blackAlpha.50" borderRadius="5" mb="2" minH="16" p="5">
								<Stack direction="column">
									<Text fontWeight="semibold">{referral.first_name} {referral.last_name}</Text>
									<Text fontSize="sm" mt="-3" textTransform="capitalize">{referral.goal === "Both" ? "Buying & Selling" : referral.goal}</Text>
								</Stack>
								<Text fontSize="xs">Last Updated: 0 days</Text>
								<Box w="fit-content" ml="auto">
									<Link href={`/dashboard/referrals/${referral.id}`}>
										<Button variant="ghost" size="sm">View</Button>
									</Link>
								</Box>
							</SimpleGrid>
						)
					})
				}
			</Suspense>

                <Stack w="fit-content" ml="auto" direction="row" mt="5" alignItems="center" spacing="1">
                    <Select w="fit-content" size="sm">
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                    </Select>
                    <Button w="fit-content" size="sm" isDisabled>Previous</Button>
                    <Button w="fit-content" size="sm">Next</Button>
                </Stack>
        </Container>
    )
}