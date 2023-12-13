'use client'

import { Box, Step, StepDescription, StepIcon, StepIndicator, StepNumber, StepSeparator, StepStatus, StepTitle, Stepper, Text } from "@chakra-ui/react"
import { createBrowserClient } from "@supabase/ssr"
import { useEffect, useState } from "react"

const steps = [
    { title: "Update", description: "Address" },
    { title: "Upload", description: "Direct Deposit Form" },
    { title: "Upload", description: "W-9 Tax Form" }
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
                .select('uploaded_tax_document,uploaded_direct_deposit_form,address')
                .eq('id', user.id);

            if (error) throw new Error(error.message);

            if (!agents[0].address) {
                setCurrentStep(0);
            } else if (!agents[0].uploaded_direct_deposit_form) {
                setCurrentStep(1);
            } else {
                setCurrentStep(2);
            }

            return setProfile(agents[0])
        }

        getProfile();
    }, [])

    return (
        <Box w="full" mt="5" bg="blackAlpha.50" p="5" mb="5">
            <Text fontSize="sm" fontWeight="semibold" color="blackAlpha.800">Complete Your Profile</Text>
            
            <Stepper index={currentStep} mt="4">
                {steps.map((step, index) => (
                    <Step key={index}>
                    <StepIndicator>
                        <StepStatus
                            complete={<StepIcon />}
                            incomplete={<StepNumber />}
                            active={<StepNumber />}
                        />
                    </StepIndicator>

                    <Box flexShrink='0'>
                        <StepTitle>{step.title}</StepTitle>
                        <StepDescription>{step.description}</StepDescription>
                    </Box>

                    <StepSeparator />
                    </Step>
                ))}
            </Stepper>
        </Box>
    )
}