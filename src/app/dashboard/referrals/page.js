import { Box, Button, Container, Input, Select, SimpleGrid, Spinner, Stack, Text } from "@chakra-ui/react";
import Link from "next/link";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function Page() {

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

	async function GetRecentReferrals() {
		const { data: leads, error } = await supabase.from('leads').select("*").eq("referring_agent", user.id);

		if (error) throw new Error(error.message)

		return leads
	}
	
	const referrals = await GetRecentReferrals();

    return (
        <Container maxW="container.md">
            <Input w="96" placeholder="Search..." mb="10" bg="blackAlpha.50" borderColor="blackAlpha.100" />
			<Suspense fallback={<Spinner />}>
				{referrals
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