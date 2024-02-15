'use client'

import { Alert, AlertDescription, AlertIcon, AlertTitle, Box, Button, Stack, Step, StepDescription, StepIcon, StepIndicator, StepNumber, StepSeparator, StepStatus, StepTitle, Stepper, Text } from "@chakra-ui/react"
import { createBrowserClient } from "@supabase/ssr"
import Link from "next/link"
import { useEffect, useState } from "react"

const steps = [
    { title: "Update", description: "Address", link: "/dashboard/account/profile" },
    { title: "Upload", description: "Direct Deposit Form", link: "/dashboard/account/billing" },
    // { title: "Upload", description: "W-9 Tax Form", link: "/dashboard/account/profile" }
]

export default function CompleteProfile() {
    const [profile, setProfile] = useState({});
    const [currentStep, setCurrentStep] = useState();

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )

    useEffect(() => {

        const getProfile = async () => {
            const { data: { user }, userError } = await supabase.auth.getUser();

            if (userError) throw new Error(userError.message);

            const { data: agents, error } = await supabase
                .from('agents')
                .select('address, direct_deposit_info: direct_deposit_info (*)')
                .eq('id', user.id);

            if (error) throw new Error(error.message);


            if (!agents[0].address) {
                setCurrentStep(0);
            } else if (!agents[0].direct_deposit_info) {
                setCurrentStep(1);
            } else {
                setCurrentStep(2);
            }

            return setProfile(agents[0])
        }

        getProfile();
    }, [])

    return (
        <>
            <Alert status="warning" size="sm" mb="10">
                <AlertIcon /> 

                <AlertTitle fontWeight="semibold">
                    Add an address to go active
                </AlertTitle>
            
                <AlertDescription ml="auto">
                    <Button as={Link} href="/dashboard/account/profile" size="sm" variant="ghost">Add Address</Button>
                </AlertDescription>
            </Alert>
        </>
        // <Box w="full" mt="5" bg="blackAlpha.50" p="5" mb="5">
        //     {/* <Text fontSize="sm" fontWeight="semibold" color="blackAlpha.800">Complete Your Profile</Text> */}

        //     <Stack direction="row" justify="space-between" alignItems="center" mt="5">
        //         <Text fontSize="lg">Add an address to go active.</Text>
        //         <Button variant="ghost" size="sm">Add Address</Button>
        //     </Stack>
            
            // {/* <Stepper index={currentStep} mt="4">
            //     {steps.map((step, index) => (
            //         <Step key={index}>
            //             <Link href={step.link}>
            //                 <StepIndicator>
            //                     <StepStatus
            //                         complete={<StepIcon />}
            //                         incomplete={<StepNumber />}
            //                         active={<StepNumber />}
            //                     />
            //                 </StepIndicator>

            //                 <Box flexShrink='0'>
                                
            //                     <StepTitle>{step.title}</StepTitle>
            //                     <StepDescription>{step.description}</StepDescription>
                                
            //                 </Box>
            //             </Link>

            //             <StepSeparator />
            //         </Step>
            //     ))}
            // </Stepper> */}
        // </Box>
    )
}