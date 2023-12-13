'use client'

import { Box, Button, Input, Text } from "@chakra-ui/react";
import { createBrowserClient } from "@supabase/ssr";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";


export default function SignInForm() {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);
    const [uiLoading, setUiLoading] = useState(true);
    const [user, setUser] = useState(null);

    const router = useRouter();

    const handleSubmit = async () => {
        setLoading(true);

        const supabase = createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        )

        const { data, error } = await supabase.auth.signInWithPassword({
            email: formData.email,
            password: formData.password
        })

        await supabase.auth.setSession({
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token
        })

        if (error) console.log(error);

        if (data.session) {
            router.push('/dashboard');
        }

        router.refresh();

        setLoading(false);
    }

    const handleInputChange = (field, value) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            [field]: value,
        }));
        
    };

    return (
        <>
            <Box w="full" px="14">
                <form>
                    <Text fontSize="md" mt="5">Email</Text>
                    <Input type="email" borderColor="blackAlpha.200" onChange={e => handleInputChange("email", e.target.value)} />

                    <Text fontSize="md" mt="5">Password</Text>
                    <Input type="password" borderColor="blackAlpha.200" onChange={e => handleInputChange("password", e.target.value)} />

                    <Box w="fit-content" ml="auto">
                        <Link href="/">
                            <Text _hover={{ textDecoration: "underline" }} color="blue.500" fontSize="md" mt="3">Forgot password</Text>
                        </Link>
                    </Box>

                    <Button w="full" mt="5" onClick={handleSubmit} size="sm" variant="outline" isLoading={loading} isDisabled={loading || formData.email.length === 0 || formData.password.length === 0} colorScheme="blue">Log In</Button>
                </form>
            </Box>

            <Text textAlign="center" fontSize="md" mt="5">Don't have an account? <Text as="span" color="blue.500" _hover={{ textDecoration: "underline" }}><Link href="/sign-up">Sign Up</Link></Text></Text>
        </>
    )
}