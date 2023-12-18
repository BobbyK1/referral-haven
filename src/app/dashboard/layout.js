import { Container, Flex, IconButton, Menu, MenuButton, MenuItem, MenuList, Stack, Text } from "@chakra-ui/react"
import Image from "next/image"
import Link from "next/link"
import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"
import { Settings } from "../UI/Icons"
import { LogoutMenuButton } from "../UI/Logout"
import { SubscriptionProvider } from "../providers/subscription-provider"
import { redirect } from "next/navigation"

export const metadata = {
  title: 'Referral Haven',
  description: '',
}

export default async function Layout({ children }) {

	const cookieStore = cookies()

	const supabase = createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
		{
		cookies: {
			get(name) {
			return cookieStore.get(name)?.value
			},
		},
		}
	)

	const { data: { user }, error } = await supabase.auth.getUser();

    if (!user) {
        redirect('/')
    }

    async function GetRole() {
        const { data: agents, error } = await supabase
            .from('agents')
            .select('role')
            .eq('id', user.id);

        return agents[0].role
    }

    const role = await GetRole();

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
                                <Link href="/dashboard/admin">
                                    <Text _hover={{ color: "blackAlpha.800" }} transition="0.1s ease" fontSize="sm" fontWeight="semibold" color="blackAlpha.700">Admin</Text>
                                </Link>
                            }

                            <Link href="/dashboard">
                                <Text _hover={{ color: "blackAlpha.800" }}  transition="0.1s ease" fontSize="sm" fontWeight="semibold" color="blackAlpha.700">Home</Text>
                            </Link>

                            <Link href="/dashboard/referrals">
                                <Text _hover={{ color: "blackAlpha.800" }}  transition="0.1s ease" fontSize="sm" fontWeight="semibold" color="blackAlpha.700">Referrals</Text>
                            </Link>
                            <Menu>
                                <MenuButton rounded="full" variant="ghost" as={IconButton} icon={<Settings />} />

                                <MenuList>
                                    <Link href="/dashboard/account/profile">
                                        <MenuItem>Profile</MenuItem>
                                    </Link>
                                    <Link href="/dashboard/account/settings">
                                        <MenuItem>Settings</MenuItem>
                                    </Link>
                                    <Link href="/dashboard/account/billing">
                                        <MenuItem>Billing</MenuItem>
                                    </Link>
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
