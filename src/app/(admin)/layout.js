'use client' 

import { Avatar, Box, Button, Center, Container, Flex, IconButton, Input, Menu, MenuButton, MenuItem, MenuList, Stack, Text } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from 'next/navigation'
import { Bell, DownChevron, Settings } from "../UI/Icons";


export default function Layout({ children }) {
    const pathname = usePathname();

    return (
        <>
            <Flex flexDir="column" w="full">
            <Box w="full" h="14" bg="white" borderBottomWidth="thin" borderColor="blackAlpha.300">
                <Stack px="3" h="14" direction="row" alignItems="center" justify="space-between">
                    <Image src="/referral-haven-logo.png" height="1" width="150" alt="Referral Haven Logo" />

                    <Stack direction="row" spacing="2" alignItems="center">
                    <IconButton
                        icon={<Bell />}
                        rounded="full"
                        size="sm"
                        position="relative"
                        _after={{
                            content: '""',
                            position: 'absolute',
                            bottom: '0',
                            right: '-0.5',
                            width: '10px',
                            height: '10px',
                            backgroundColor: 'red', // Replace with your desired color
                            borderRadius: '50%',
                        }}
                        />
                        <Menu>
                            <MenuButton variant="ghost" p="1" as={Button}>
                                <Stack direction="row" alignItems="center" spacing="2">
                                    <Avatar name="B K" bgColor="blackAlpha.200" size="sm" />
                                    <Text fontSize="sm" fontWeight="bold">Bobby Karamacoski</Text>
                                    <DownChevron fontSize="xs" />
                                </Stack>
                            </MenuButton>

                            <MenuList>
                                <MenuItem>Sign Out</MenuItem>
                            </MenuList>

                        </Menu>
                    </Stack>
                    

                    {/* <Stack direction="row" spacing="2">
                        <IconButton icon={<Bell />} size="sm" variant="solid" bgColor="white" />
                        <IconButton icon={<Settings />} size="sm" variant="solid" bgColor="white" />
                    </Stack> */}
                </Stack>
            </Box>
            <Flex flexDir="row"> 
                <Flex flexDir="column" w="18vw" h="100vh" bgColor="rgb(252, 252, 252)" borderRightWidth="thin" borderColor="blackAlpha.200">

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

                    <Box w="full" bgColor="rgb(252, 252, 252)" maxW="full">
                        {children}
                    </Box>
                </Flex>
                
                
            </Flex>
        </>
    )
}