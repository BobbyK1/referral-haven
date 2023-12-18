'use client' 

import { Box, Button, Center, Container, Flex, IconButton, Input, Stack, Text } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from 'next/navigation'
import { Bell, Settings } from "../UI/Icons";


export default function Layout({ children }) {
    const pathname = usePathname();

    return (
        <Flex flexDir="row"> 
            <Flex flexDir="column" w="15vw" h="100vh" bg="blackAlpha.50" borderRightWidth="thin" borderColor="blackAlpha.200">
                <Box mt="5" ml="5">
                    <Link href="/admin/home">
                        <Image src="/referral-haven-logo.png" height="75" width="175" alt="Referral Haven Logo" />
                    </Link>
                </Box>

                <Box mt="10" px="5">
                    <Box w="full" p="1" _hover={{ bgColor: "blackAlpha.200" }} transition="0.2s ease" borderRadius="5">
                        <Link href="/admin/home">
                            <Text fontSize="md" color={pathname.includes('home') && "blue.500"} fontWeight="semibold">Home</Text>
                        </Link>
                    </Box>

                    <Box w="full" p="1" mt="2" _hover={{ bgColor: "blackAlpha.200" }} transition="0.2s ease" borderRadius="5">
                        <Link href="/admin/agents">
                            <Text fontSize="md" color={pathname.includes('agents') && "blue.500"} fontWeight="semibold">Agents</Text>
                        </Link>
                    </Box>

                    <Box w="full" p="1" mt="2" _hover={{ bgColor: "blackAlpha.200" }} transition="0.2s ease" borderRadius="5">
                        <Link href="/admin/referrals">
                            <Text fontSize="md" color={pathname.includes('referrals') && "blue.500"} fontWeight="semibold">Referrals</Text>
                        </Link>
                    </Box>
                </Box>
            </Flex> 

            <Flex flexDir="column" w="full">
                <Box w="full" h="14" bg="blackAlpha.100">
                    <Stack px="3" h="14" direction="row" alignItems="center" justify="space-between">
                        <Input size="sm" w="96" borderColor="blackAlpha.300" bgColor="white" borderRadius="5" />

                        <Stack direction="row" spacing="2">
                            <IconButton icon={<Bell />} size="sm" variant="solid" bgColor="white" />
                            <IconButton icon={<Settings />} size="sm" variant="solid" bgColor="white" />
                        </Stack>
                    </Stack>
                </Box>

                <Container maxW="full">
                    {children}
                </Container>
            </Flex>
            
            
        </Flex>
    )
}