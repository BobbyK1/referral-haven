import { Container, Skeleton, Stack } from "@chakra-ui/react"


export const ReferralPageSkeleton = () => {
    return (
        <>
            <Container maxW="container.md">
                <Skeleton w="96" mb="5" h="10" />

                <Skeleton w="full" mb="2" h="20" />
                <Skeleton w="full" mb="2" h="20" />
                <Skeleton w="full" mb="2" h="20" />
                <Skeleton w="full" mb="2" h="20" />
                <Skeleton w="full" mb="2" h="20" />

                <Stack w="fit-content" ml="auto" direction="row" mt="5">
                    <Skeleton w="10" h="8" />
                    <Skeleton w="24" h="8" />
                    <Skeleton w="16" h="8" />
                </Stack>
            </Container>
        </>
    )
}