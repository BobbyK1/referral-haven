import { Box, Container, Divider, Skeleton, Stack } from "@chakra-ui/react";


export default function Loading() {

    return (
        <Container maxW="container.md">
            <Stack direction="row" justify="space-between">
                <Box>
                    <Skeleton w="32" h="8" />
                    <Skeleton w="20" h="8" mt="2" />
                </Box>

                <Stack direction="row" spacing="2">
                    <Skeleton w="12" h="8" />
                    <Skeleton w="12" h="8" />
                    <Skeleton w="12" h="8" />
                </Stack>
            </Stack>

            <Skeleton mt="5" h="44" />

            <Skeleton mt="5" w="32" h="8" />

            <Divider my="2" borderColor="blackAlpha.400" />
        </Container>
    )
}