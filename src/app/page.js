import { Box, Button, Center, Flex, Heading, Stack, Text } from "@chakra-ui/react";
import { createServerClient } from "@supabase/ssr";
import Image from "next/image";
import Link from "next/link";
import SignInForm from "./UI/SignInForm";
import { cookies } from "next/headers";
import { LogoutSignInForm } from "./UI/Logout";

async function GetAgent(supabase, id) {
    var { data: agents, error } = await supabase.from('agents').select('first_name, last_name').eq('id', id);

    if (error) throw new Error(error.message)

    return agents[0];
}


export default async function Page() {
    
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

    if (user) {
       var agent = await GetAgent(supabase, user.id);
    }


    return (
        <Flex flexDirection="row" w="100" minH="100vh">
            <Flex flexDirection="column" justifyContent="center" alignItems="center" w="65vw" minH="100vh" bg="blackAlpha.100">
                <Center>
                    <Image src="/referral-haven-logo.png" height="300" width="450" />
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

            <Flex alignItems="center" justifyContent="center" flexDirection="column" w="35vw">
                <Heading as="h2" fontSize="3xl" textAlign="center">Log In</Heading>
                <Text fontSize="lg" color="blue.500" textAlign="center" mt="4">Glad you're back!</Text>
                    {user ? 
                        <Box w="full" px="14" mt="5">
                            <Text textAlign="center" fontSize="md"></Text>
                            <Link href="/dashboard">
                                <Button w="full" mt="2" size="sm" variant="outline" colorScheme="blue">Signed in as {agent.first_name} {agent.last_name}</Button>
                            </Link>

                            <Text fontSize="sm" textAlign="center" fontWeight="semibold" my="3">or</Text>

                            <LogoutSignInForm />
                        </Box>
                    :
                        <SignInForm />
                        
                    }
            </Flex>
        </Flex>
    )
}