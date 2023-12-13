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

export const HomePageSkeleton = () => {

    return (
        <Container maxW="container.md">
            <Skeleton w="96" h="10" />
            <Skeleton w="20" h="5" mt="1" />

            <Skeleton w="full" h="52" mt="5" />

            <Stack direction="row" justify="space-between" mt="5">
                <Skeleton w="32" h="5" />
                <Skeleton w="6" h="5" />
            </Stack>

            <Skeleton w="full" h="20" mt="5" />
            <Skeleton w="full" h="20" mt="3" />
            <Skeleton w="full" h="20" mt="3" />
        </Container>
    )
}