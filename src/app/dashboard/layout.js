import { Container, Flex, IconButton, Menu, MenuButton, MenuItem, MenuList, Stack, Text } from "@chakra-ui/react"
import Image from "next/image"
import Link from "next/link"
import { Question, Settings } from "../UI/Icons"
import { LogoutMenuButton } from "../UI/Logout"
import { SubscriptionProvider } from "../providers/subscription-provider"
import { redirect } from "next/navigation"
import fetchUser from "../util/fetchUser"

export const metadata = {
  title: 'Referral Haven',
  description: '',
}

export default async function Layout({ children }) {

	const { user, role } = await fetchUser(true)

    if (!user) {
        redirect('/')
    }

	return (
        <>
            <Flex mb="10" w="full" alignItems="center" h="14" borderBottomWidth="thin" borderColor="blackAlpha.100" shadow="sm">
                <Container maxW="container.xl">
                    <Flex justifyContent="space-between" alignItems="center">
                        <Link href={user ? "/dashboard" : "/"}>
                            <Image priority src="/referral-haven-logo.png" height="50" width="200" alt="Referral Haven Logo" />
                        </Link>

                        <Stack direction="row" spacing="3" alignItems="center">
                            {role.includes('admin') && 
                                <Link href="/admin">
                                    <Text _hover={{ color: "blackAlpha.800" }} transition="0.1s ease" fontSize="sm" fontWeight="semibold" color="blackAlpha.700">Admin</Text>
                                </Link>
                            }

                            <Link href="/dashboard">
                                <Text _hover={{ color: "blackAlpha.800" }}  transition="0.1s ease" fontSize="sm" fontWeight="semibold" color="blackAlpha.700">Home</Text>
                            </Link>

                            <Link href="/dashboard/referrals">
                                <Text _hover={{ color: "blackAlpha.800" }}  transition="0.1s ease" fontSize="sm" fontWeight="semibold" color="blackAlpha.700">Referrals</Text>
                            </Link>

                            <Link href="/dashboard">
                                <IconButton mr="-4" ml="-1" variant="ghost" rounded="full" icon={<Question fontSize="xl" />} />
                            </Link>

                            <Menu>
                                <MenuButton rounded="full" variant="ghost" as={IconButton} icon={<Settings fontSize="xl" />} />

                                <MenuList>
                                    <Link href="/dashboard/account/profile">
                                        <MenuItem>Profile</MenuItem>
                                    </Link>
                                    {role.includes('referral_agent') &&
                                        <Link href="/dashboard/account/billing">
                                            <MenuItem>Billing</MenuItem>
                                        </Link>}
                                    {/* <Link href="/dashboard/account/settings">
                                        <MenuItem>Settings</MenuItem>
                                    </Link> */}
                                    <LogoutMenuButton />
                                </MenuList>
                            </Menu>
                        </Stack>
                    </Flex>
                </Container>
            </Flex>
            <SubscriptionProvider>
                {children}
            </SubscriptionProvider>
        </>
	)
}
