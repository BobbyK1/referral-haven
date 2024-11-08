import { Box, Button, Flex, Heading, Text } from '@chakra-ui/react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import fetchUser from './util/fetchUser'
import Image from 'next/image';

export default async function NotFound() {
    const { user } = await fetchUser();
    return (
        <>
            <Flex p="1" flexDirection="column" h="100vh" w="100vw" justifyContent="center" alignItems="center">
                <Image src="/referral-haven-logo.png" width="250" height="60" />
                <Heading as="h1" fontSize="6xl" mt="10">404</Heading>
                <Text fontSize="22" textAlign="center">The page your looking for has either been removed or does not exist.</Text>

                <Button mt="20" variant="ghost" borderRadius="0" as={Link} href={user ? "/dashboard" : "/"}>Return To {user ? "Dashboard" : "Login"}</Button>
            </Flex>
        </>
    )
}