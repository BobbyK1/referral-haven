import { Box, Button, Container, Input, Select, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import Link from "next/link";


async function Wait() {
    const myPromise = new Promise((resolve, reject) => {
        // Simulating an asynchronous operation, such as fetching data
        setTimeout(() => {
          // Resolve the promise with the desired HTML
          resolve('test');
        }, 5000); // Simulating a delay of 1 second
      });

      return myPromise;
}

export default async function Page() {


    return (
        <Container maxW="container.md">
            <Input w="96" placeholder="Search..." mb="10" bg="blackAlpha.50" borderColor="blackAlpha.100" />
            <SimpleGrid columns="3" alignItems="center" w="full" bg="blackAlpha.50" borderRadius="5" mb="2" minH="16" p="5">
					<Stack direction="column">
						<Text fontWeight="semibold">Joe Schmo</Text>
						<Text mt="-2" fontSize="xs">Selling</Text>
					</Stack>
					<Text fontSize="xs">Last Updated: 1 day(s) ago</Text>
					<Box w="fit-content" ml="auto">
						<Link href="/referrals/675  ">
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
						<Link href="/referrals/125">
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
						<Link href="/referrals/145">
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
						<Link href="/referrals/12512">
							<Button variant="ghost" size="sm">View</Button>
						</Link>
					</Box>
				</SimpleGrid>

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