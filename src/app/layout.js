import { Box, Container, Flex, IconButton, Menu, MenuButton, MenuItem, MenuList, Stack, Text } from "@chakra-ui/react"
import { Providers } from "./providers"
import Image from "next/image"
import Link from "next/link"
import { Settings } from "./UI/Icons"

export const metadata = {
  title: 'Referral Haven',
  description: '',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
    	<body>
			<Providers>
				<Flex mb="10" w="full" alignItems="center" h="14" borderBottomWidth="thin" borderColor="blackAlpha.100" shadow="sm">
					<Container maxW="container.xl">
						<Flex justifyContent="space-between" alignItems="center">
							<Link href="/">
								<Image priority src="/referral-haven-logo.png" height="150" width="200" alt="Referral Haven Logo" />
							</Link>

							<Stack direction="row" spacing="3" alignItems="center">
								<Link href="/referrals">
									<Text _hover={{ color: "blackAlpha.800" }}  transition="0.1s ease" fontSize="sm" fontWeight="semibold" color="blackAlpha.700">Home</Text>
								</Link>

								<Link href="/referrals">
									<Text _hover={{ color: "blackAlpha.800" }}  transition="0.1s ease" fontSize="sm" fontWeight="semibold" color="blackAlpha.700">Referrals</Text>
								</Link>
								<Menu>
									<MenuButton rounded="full" variant="ghost" as={IconButton} icon={<Settings />} />

									<MenuList>
										<MenuItem>Profile</MenuItem>
										<MenuItem>Settings</MenuItem>
										<MenuItem>Logout</MenuItem>
									</MenuList>
								</Menu>
							</Stack>
						</Flex>
					</Container>
				</Flex>
    			{children}
			</Providers>
		</body>
    </html>
  )
}
