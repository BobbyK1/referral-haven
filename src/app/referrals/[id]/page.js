import AddUpdateButton from "@/app/UI/AddUpdateButton";
import { Add, Email, Phone } from "@/app/UI/Icons";
import { Box, Container, Divider, IconButton, Stack, Tag, Text } from "@chakra-ui/react";


export default async function Page({ params }) {
    const id = await params.id;

    return (
        <Container maxW="container.md">
            <Stack direction="row" alignItems="center" justify="space-between">
                <Box>
                    <Stack direction="row">
                        <Text fontSize="xl" fontWeight="semibold">Joe Schmo</Text>
                        <Tag variant="subtle" colorScheme="blue" size="sm" rounded="full">Spoke</Tag>
                    </Stack>
                    <Text fontSize="md" mt="-1">Seller</Text>
                </Box>
                
                <Stack direction="row" alignItems="center">
                    <IconButton icon={<Phone fontSize="xl" color="white" />} title="Call" size="sm" bg="blue.500" colorScheme="blue" rounded="full" />

                    <IconButton icon={<Email fontSize="xl" color="white" />} title="Email" size="sm" bg="blue.500" colorScheme="blue" rounded="full" />
                </Stack>
            </Stack>

            <Box mt="5" bg="blackAlpha.50" p="5" borderRadius="5" h="44">
                <Text fontSize="sm" color="blackAlpha.800">Notes</Text>
            </Box>

            <Box mt="10">
                <Stack direction="row" alignItems="center" justify="space-between">
                    <Text fontSize="md">Updates</Text>

                    <AddUpdateButton />
                </Stack>
            </Box>

            <Divider mt="2" />

            <Text mt="5" color="blackAlpha.500" textAlign="center" fontSize="md">No updates yet...</Text>
        </Container>
    )
}