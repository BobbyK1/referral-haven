import { Box, Button, Container, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import { Status } from "./UI/Icons";
import Link from "next/link";

export default function Home() {
	return (
		<>
			<Container maxW="container.md">
				<Text fontSize="2xl" fontWeight="semibold" color="blackAlpha.800">Welcome, Bobby!</Text>

				<Stack direction="row" alignItems="center" spacing="0.5">
					<Status color="green.300" fontSize="xl" />
					<Text fontSize="sm" color="green.300">Active</Text>
				</Stack>

				<Box mt="5" bg="blackAlpha.50" p="5" borderRadius="5">
					<Text fontSize="sm" fontWeight="semibold" color="blackAlpha.800">Stay Up To Date</Text>

					<SimpleGrid columns={[1, 3]} mt="5" gap={[5, 0]}>
						<Stack direction={["row", "column"]} alignItems="center" justify={["space-between", "none"]}>
							<Text fontSize="sm">Active Referrals</Text>
							<Text fontSize="xl" color="green.300">12</Text>
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
				</Box>

				<Text mt="10" mb="5" color="blackAlpha.800" fontSize="md" fontWeight="semibold">Your Recent Referrals</Text>

				<SimpleGrid columns="3" alignItems="center" w="full" bg="blackAlpha.50" borderRadius="5" mb="2" minH="16" p="5">
					<Stack direction="column">
						<Text fontWeight="semibold">Joe Schmo</Text>
						<Text mt="-2" fontSize="xs">Selling</Text>
					</Stack>
					<Text fontSize="xs">Last Updated: 1 day(s) ago</Text>
					<Box w="fit-content" ml="auto">
						<Link href="/referrals">
							<Button variant="ghost" size="sm">View</Button>
						</Link>
					</Box>
				</SimpleGrid>

				<SimpleGrid columns="3" alignItems="center" w="full" bg="blackAlpha.50" borderRadius="5" mb="2" minH="16" p="5">
					<Stack direction="column">
						<Text fontWeight="semibold">Jane Doe</Text>
						<Text mt="-2" fontSize="xs">Selling</Text>
					</Stack>
					<Text fontSize="xs">Last Updated: 10 day(s) ago</Text>
					<Box w="fit-content" ml="auto">
						<Link href="/referrals">
							<Button variant="ghost" size="sm">View</Button>
						</Link>
					</Box>
				</SimpleGrid>

				<SimpleGrid columns="3" alignItems="center" w="full" bg="blackAlpha.50" borderRadius="5" mb="2" minH="16" p="5">
					<Stack direction="column">
						<Text fontWeight="semibold">Micho Floutsis</Text>
						<Text mt="-2" fontSize="xs">Selling</Text>
					</Stack>
					<Text fontSize="xs">Last Updated: 12 hour(s) ago</Text>
					<Box w="fit-content" ml="auto">
						<Link href="/referrals">
							<Button variant="ghost" size="sm">View</Button>
						</Link>
					</Box>
				</SimpleGrid>

				<SimpleGrid columns="3" alignItems="center" w="full" bg="blackAlpha.50" borderRadius="5" mb="2" minH="16" p="5">
					<Stack direction="column">
						<Text fontWeight="semibold">Albert Dunphy</Text>
						<Text mt="-2" fontSize="xs">Selling</Text>
					</Stack>
					<Text fontSize="xs">Last Updated: 14 minute(s) ago</Text>
					<Box w="fit-content" ml="auto">
						<Link href="/referrals">
							<Button variant="ghost" size="sm">View</Button>
						</Link>
					</Box>
				</SimpleGrid>

				<Box w="fit-content" mx="auto" mt="5">
					<Button size="sm" variant="ghost">View All</Button>
				</Box>
			</Container>
		</>
	)
}
