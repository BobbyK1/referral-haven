import { Box, Center, Flex, Stack, Text } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";


export default function Layout({ children }) {

    return (
        <Flex flexDirection={["column", "column", "column", "row"]} minH="100vh">
            <Flex display={["none", "none", "none", "flex"]} flexDirection="column" justifyContent="center" alignItems="center" w="65vw" minH="100vh" bg="blackAlpha.100">
                <Center>
                    <Image src="/referral-haven-logo.png" alt="Referral Haven Logo" height="300" width="450" />
                </Center>

                <Box position="absolute" bottom="5">
                    <Stack direction="row">
                        <Link href="https://referralhaven.com/terms-of-service" target="_blank" referrerPolicy="no-referrer">
                            <Text fontSize="sm" fontWeight="semibold" color="blue.500" _hover={{ textDecoration: "underline" }}>Terms of Service</Text>
                        </Link>

                        <Text fontSize="sm">•</Text>

                        <Link href="https://referralhaven.com/privacy-policy" target="_blank" referrerPolicy="no-referrer">
                            <Text  fontSize="sm" fontWeight="semibold" color="blue.500" _hover={{ textDecoration: "underline" }}>Privacy Policy</Text>
                        </Link>
                    </Stack>
                </Box>
            </Flex>

            <Center display={["flex", "flex", "flex", "none"]} mt="10">
                <Image src="/referral-haven-logo.png" alt="Referral Haven Logo" height="100" width="250" />
            </Center>

            <Flex w={["full", "full", "full", "35vw"]} justifyContent="center" alignItems="center" mt={["5", "5", "5", "0"]}>
                {children}
            </Flex>

            <Center display={["flex", "flex", "flex", "none"]}>
                <Box position="absolute" bottom="5">
                    <Stack direction="row">
                        <Link href="https://referralhaven.com/terms-of-service" target="_blank" referrerPolicy="no-referrer">
                            <Text fontSize="sm" fontWeight="semibold" color="blue.500" _hover={{ textDecoration: "underline" }}>Terms of Service</Text>
                        </Link>

                        <Text fontSize="sm">•</Text>

                        <Link href="https://referralhaven.com/privacy-policy" target="_blank" referrerPolicy="no-referrer">
                            <Text  fontSize="sm" fontWeight="semibold" color="blue.500" _hover={{ textDecoration: "underline" }}>Privacy Policy</Text>
                        </Link>
                    </Stack>
                </Box>
            </Center>
        </Flex>
    )
}