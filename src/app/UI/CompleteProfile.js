import { Alert, AlertDescription, AlertIcon, AlertTitle, Box, Button, Stack, Step, StepDescription, StepIcon, StepIndicator, StepNumber, StepSeparator, StepStatus, StepTitle, Stepper, Text } from "@chakra-ui/react"
import { createBrowserClient } from "@supabase/ssr"
import Link from "next/link"
import serverClientSupabase from "../util/serverClientSupabase"
import fetchUser from "../util/fetchUser"
import RequestSignature from "./RequestSignature"
// import { useEffect, useState } from "react"

const steps = [
    { title: "Update", description: "Address", link: "/dashboard/account/profile" },
    { title: "Upload", description: "Direct Deposit Form", link: "/dashboard/account/billing" },
    // { title: "Upload", description: "W-9 Tax Form", link: "/dashboard/account/profile" }
]

export default async function CompleteProfile() {
    const supabase = serverClientSupabase();
    
    const { user, role } = await fetchUser(true);

    async function GetProfile() {
        const { data: agents, error } = await supabase
            .from('agents')
            .select('address, signed_independent_contractor_agreement, transferred_license, first_name, last_name, email')
            .eq('id', user.id);

        if (error) throw new Error(error.message)

        return agents[0];
    }

    async function GetSubmissions() {
        const { data: submissions, error } = await supabase
            .from('agent_agreements')
            .select('*')
            .eq('user_id', user.id)

        if (error) throw new Error(error.message);

        return submissions[0];
    }

    const profile = await GetProfile();
    const submission = await GetSubmissions();

    return (
        <>
            {!profile.address &&
                <Alert status="warning" size="sm" mb="5">
                    <AlertIcon /> 

                    <AlertTitle fontWeight="semibold">
                        Please add a personal address
                    </AlertTitle>
                
                    <AlertDescription ml="auto">
                        <Button as={Link} href="/dashboard/account/profile?focus=address" size="sm" variant="ghost">Add Address</Button>
                    </AlertDescription>
                </Alert>
            }

            {!profile.signed_independent_contractor_agreement &&
                <Alert status="warning" size="sm" mb="10">
                    <AlertIcon />

                    <AlertTitle fontWeight="semibold">Please sign our Independent Contractor Agreement</AlertTitle>

                    <AlertDescription ml="auto">
                        {submission ? <Text fontSize="sm">Sent to {profile.email}</Text> : <RequestSignature firstName={profile.first_name} lastName={profile.last_name} email={profile.email} address={profile.address} id={user.id} />}
                    </AlertDescription>
                </Alert>
            }
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