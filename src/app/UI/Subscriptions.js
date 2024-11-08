'use client'

import { Box, Button, Container, SimpleGrid, Stack, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import Stripe from 'stripe'
import { RightArrow } from './Icons';
import { createBrowserClient } from '@supabase/ssr';
const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY)

export default function Subscriptions() {
    const [userId, setUserId] = useState();
    const [customerId, setCustomerId] = useState();
    const [loading, setLoading] = useState(false);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )

    useEffect(() => {
        const getCustomerId = async () => {
            setLoading(true);

            const { data: { user }, error: userError } = await supabase.auth.getUser();

            if (userError) throw new Error(userError.message);

            const { data: agents, error } = await supabase
                .from('agents')
                .select('stripe_customer_id')
                .eq('id', user.id);

            if (error) throw new Error(error.message);

            setLoading(false);

            return setCustomerId(agents[0].stripe_customer_id);
        }

        getCustomerId();        
    }, [])

    const handleCheckout = async (priceId) => {
        const session = await stripe.checkout.sessions.create({
            mode: "subscription",
            customer: customerId,
            phone_number_collection: {
                enabled: true,  
            },
            allow_promotion_codes: true,
            billing_address_collection: "required",
            consent_collection: {
                terms_of_service: "required" 
            },
            line_items: [
                {
                    price: priceId,
                    quantity: 1
                }
            ],
            success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`,
            cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`
        })

        return window.location.replace(session.url);
    }

    return (
        <Container maxW="container.xl">
            <Text fontSize="xl" fontWeight="semibold">Thanks for registering!</Text>
            <Text fontSize="lg" mb="10">Please select a plan to continue.</Text>
            <SimpleGrid columns={[ 1, 2, 2, 3]} gap="2">
                <Box>
                    <Box w="full" bgColor="blue.500" borderRadius="2" color="white" p="1">
                        <Text textAlign="center" fontWeight="semibold">Most Popular</Text>
                    </Box> 
                    <Box w="full" borderWidth="thin" my="2" shadow="sm" borderRadius="5" p="5">
                        <Stack direction="column" justify="space-between" alignItems="center">
                            <Text fontSize="xl" fontWeight="semibold">1 Year Membership</Text>
                            
                            <Text fontSize="3xl" fontWeight="semibold">$120</Text>

                            {/* <Text borderRadius="5" bgColor="blue.500" color="white" px="10" py="1">$30 off with code 'SAVEFRIDAY30'</Text> */}

                            <Text fontSize="md" color="blackAlpha.700">$10/mo</Text>                        

                            <Button isLoading={loading} onClick={() => handleCheckout("price_1NqVoWIeNNlnMJG9yVu2pXhY")} size="sm" variant="ghost" rightIcon={<RightArrow size="xs" />}>Select</Button>
                        </Stack>
                    </Box>
                </Box>

                
                <Box>
                    <Box w="full" bgColor="transparent" color="transparent" p="1">
                        <Text textAlign="center" fontWeight="semibold">.</Text>
                    </Box>

                    <Box w="full" borderWidth="thin" my="2" shadow="sm" borderRadius="5" p="5">
                        <Stack direction="column" justify="space-between" alignItems="center">
                            <Text fontSize="xl" fontWeight="semibold">6 Month Membership</Text>

                            <Text fontSize="3xl" fontWeight="semibold">$90</Text>
                            
                            <Text fontSize="md" color="blackAlpha.700">$15/mo</Text> 

                            <Button isLoading={loading} onClick={() => handleCheckout("price_1NqVobIeNNlnMJG9xu2roELI")} size="sm" variant="ghost" rightIcon={<RightArrow size="xs" />}>Select</Button>
                        </Stack>
                    </Box>
                </Box>

                <Box>
                    <Box w="full" bgColor="transparent" color="white" p="1">
                        <Text textAlign="transparent" fontWeight="transparent">.</Text>
                    </Box>

                    <Box w="full" borderWidth="thin" my="2" shadow="sm" borderRadius="5" p="5">
                        <Stack direction="column" justify="space-between" alignItems="center">
                            <Text fontSize="xl" fontWeight="semibold">Monthly Membership</Text>

                            <Text fontSize="3xl" fontWeight="semibold">$20</Text>
                            
                            <Text fontSize="md" color="blackAlpha.700">$20/mo</Text>                            

                            <Button isLoading={loading} onClick={() => handleCheckout("price_1NqVogIeNNlnMJG9t5yj0pKd")} size="sm" variant="ghost" rightIcon={<RightArrow size="xs" />}>Select</Button>
                        </Stack>
                    </Box>
                </Box>

                
            </SimpleGrid>
            {/* {subscriptions.map(({ product, price }) => (
                <>
                    <Text>{price.id}</Text>
                    <Box key={product.id} w="full" borderWidth="thin" my="2" shadow="sm" borderRadius="5" p="5">
                        <Stack direction="row" justify="space-between" alignItems="center">
                            <Box>
                                <Text fontSize="md" color="blackAlpha.700">${(price.unit_amount / 12) / 100}</Text>
                                <Text fontSize="lg" fontWeight="semibold">{product.name}</Text>
                                
                            </Box>
                            <Box>
                                <Text fontSize="lg" color="blackAlpha.800">${price.unit_amount / 100}</Text>
                            </Box>

                            <Button size="sm" variant="ghost" rightIcon={<RightArrow size="xs" />}>Select</Button>
                        </Stack>
                    </Box>
                </>
                // <div key={product.id}>
                // <h3>{product.name}</h3>
                // <p>Actual Price: {price.unit_amount / 100} {price.currency}</p>
                // </div>
            ))} */}
        </Container>
    )
}