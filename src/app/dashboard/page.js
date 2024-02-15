import { Box, Button, Container, IconButton, SimpleGrid, Skeleton, Spinner, Stack, Text } from "@chakra-ui/react";
import Link from "next/link";
import { Add, Status } from "../UI/Icons";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import CompleteProfile from "../UI/CompleteProfile";
import serverClientSupabase from "../util/serverClientSupabase";
import fetchUser from "../util/fetchUser";

async function GetAgent(supabase, id) {
	const { data: agents, error } = await supabase.from('agents').select('*').eq('id', id);

	if (error) throw new Error(error.message);

	return agents[0];
}

async function GetRecentReferrals(supabase, id) {
	const { data: leads, error } = await supabase.from('leads').select("*").eq("referring_agent", id).order('created_at', { ascending: false }).limit(5);

	if (error) throw new Error(error.message)

	return leads
}

export default async function Home({ params, searchParams }) {
	const search = await searchParams;
	
	const supabase = serverClientSupabase();

	const { user, role } = await fetchUser(true);

	if (!user) {
		redirect('/');
	}

	const agent = await GetAgent(supabase, user.id);
	const referrals = await GetRecentReferrals(supabase, user.id);

	async function CheckStatus() {
		return agent.address
	}

	const checkStatus = await CheckStatus();

	return (
		<Container maxW="container.md">

			{!checkStatus && <CompleteProfile />}
			
			<Stack direction="row" justify="space-between" alignItems="center">
				<Box>
					<Text fontSize="2xl" fontWeight="semibold" color="blackAlpha.800">Welcome, {agent.first_name}!</Text>
					
					<Stack direction="row" alignItems="center" spacing="0.5">
						<Status color={checkStatus ? "green.300" : "red.300"} fontSize="xl" />
						<Text fontSize="sm" color={checkStatus ? "green.300" : "red.300"}>{checkStatus ? "Active" : "Inactive"}</Text>
					</Stack>
				</Box>
				{!role.includes('preferred_agent') && 
					<Link href="/dashboard/add-referral">
						<IconButton isDisabled={!checkStatus} title="Add Lead" icon={<Add />} size="sm" rounded="full" colorScheme="blue" bgColor="blue.400" />
					</Link>
				}
			</Stack>

			{/* <Box mt="5" bg="blackAlpha.50" p="5" borderRadius="5">
				<Text fontSize="sm" fontWeight="semibold" color="blackAlpha.800">Stay Up To Date</Text>

				<SimpleGrid columns={[1, 3]} mt="5" gap={[5, 0]}>
					<Stack direction={["row", "column"]} alignItems="center" justify={["space-between", "none"]}>
						<Text fontSize="sm">Active Referrals</Text>

						<Suspense fallback={<Skeleton w="10" h="7" />}>
							<Text fontSize="xl" color="green.300">{activeReferrals}</Text>
						</Suspense>
					</Stack>

					<Stack direction={["row", "column"]} alignItems="center" justify={["space-between", "none"]}>
						<Text fontSize="sm">Revenue (30 days)</Text>

						<Text fontSize="xl" color="green.300">$2,905,000</Text>
					</Stack>

					<Stack direction={["row", "column"]} alignItems="center" justify={["space-between", "none"]}>
						<Text fontSize="sm">Revenue (lifetime)</Text>

						<Text fontSize="xl" color="green.300">$9,155,000</Text>
					</Stack>
				</SimpleGrid>
			</Box> */}

			<Text mt="10" mb="5" color="blackAlpha.800" fontSize="md" fontWeight="semibold">Your Recent Referrals</Text>
			{/* .sort((a, b) => {
				// Rearrange dates for proper comparison
				const dateA = new Date(a.updated_at.split('-').reverse().join('-'));
				const dateB = new Date(b.updated_at.split('-').reverse().join('-'));

				// Compare dates for sorting
				return dateB - dateA;
			}) */}

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
								<SimpleGrid key={referral.id} columns="3" alignItems="center" w="full" bg="blackAlpha.50" borderRadius="5" mb="2" minH="16" p="5">
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

			

			<Box w="fit-content" mx="auto" mt="5">
				<Link href="/dashboard/referrals">
					<Button size="sm" variant="ghost">View All</Button>
				</Link>
			</Box>

		</Container>
	)
}
