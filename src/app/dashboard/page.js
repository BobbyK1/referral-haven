import { Box, Button, Container, IconButton, SimpleGrid, Spinner, Stack, Tag, TagLeftIcon, Text } from "@chakra-ui/react";
import Link from "next/link";
import { Account, Add, Status } from "../UI/Icons";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import CompleteProfile from "../UI/CompleteProfile";
import serverClientSupabase from "../util/serverClientSupabase";
import fetchUser from "../util/fetchUser";

export default async function Page() {
	
	const supabase = serverClientSupabase();

	const { user, role } = await fetchUser(true);

	if (!user) {
		redirect('/');
	}

	async function GetAgent() {
		const { data: agents, error } = await supabase
			.from('agents')
			.select('first_name, address, status')
			.eq('id', user.id);
	
		if (error) throw new Error(error.message);
	
		return agents[0];
	}
	
	async function GetRecentReferrals() {
		const { data: leads, error } = await supabase
			.from('leads')
			.select('*, agents!leads_assigned_agent_fkey (first_name, last_name)')
			.eq('referring_agent', user.id)
			.order('created_at', { ascending: false })
			.limit(5);
	
		if (error) throw new Error(error.message)
	
		return leads
	}

	async function GetAssignedReferrals() {
		const { data: leads, error } = await supabase
			.from('leads')
			.select('*, agents!leads_referring_agent_fkey (first_name, last_name)')
			.eq('assigned_agent', user.id)
			.order('created_at', { ascending: false })
			.limit(5);

		if (error) throw new Error(error.hint);

		return leads
	}

	const agent = await GetAgent(user.id);
	const referrals = role.includes("preferred_agent") ? await GetAssignedReferrals() : await GetRecentReferrals();


	return (
		<Container maxW="container.md">

			{!agent.status && <CompleteProfile />}
			
			<Stack direction="row" justify="space-between" alignItems="center">
				<Box>
					<Text fontSize="2xl" fontWeight="semibold" color="blackAlpha.800">Welcome, {agent.first_name}!</Text>
					
					<Stack direction="row" alignItems="center" spacing="0.5">
						<Status color={agent.status ? "green.300" : "red.300"} fontSize="xl" />
						<Text fontSize="sm" color={agent.status ? "green.300" : "red.300"}>{agent.status ? "Active" : "Inactive"}</Text>
					</Stack>
				</Box>
				{!role.includes('preferred_agent') && 
					<Link href="/dashboard/add-referral">
						<IconButton isDisabled={!agent.status} title="Add Lead" icon={<Add />} size="sm" rounded="full" colorScheme="blue" bgColor="blue.400" />
					</Link>
				}
			</Stack>


			
			<Text mt="10" mb="5" color="blackAlpha.800" fontSize="md" fontWeight="semibold">Your {role.includes('preferred_agent') ? "Assigned" : "Recent"} Referrals</Text>

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
										<Text fontWeight="semibold">{referral.first_name} {referral.last_name} </Text>
										<Text fontSize="sm" mt="-3" textTransform="capitalize">{referral.goal === "Both" ? "Buying & Selling" : referral.goal}</Text>
									</Stack>

									{referral.agents && !role.includes('preferred_agent') ? <Tag title="Assigned To" w="fit-content" colorScheme="blue" variant="subtle" size="sm" alignItems="center"><TagLeftIcon size="md" as={Account} /> {referral.agents.first_name} {referral.agents.last_name}</Tag> : <Box />}
									
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
