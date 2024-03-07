'use client'

import { Button, useToast } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useState } from "react"

export default function RequestSignature({ firstName, lastName, email, address, id }) {
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const router = useRouter();

    const handleRequest = async () => {
        setLoading(true);

        await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/docuseal/sendRequestPacket`, {
            method: "POST",
            body: JSON.stringify({
                id: id,
                submitters: [{
                    email: email,
                    fields: [
                        {
                            name: "Contractor Full Name",
                            default_value: `${firstName} ${lastName}`,
                            readonly: true
                        },
                        {
                            name: "Contractor Address",
                            default_value: `${address.address}, ${address.city}, ${address.state} ${address.zip}`,
                            readonly: true
                        },

                    ]
                }]
            })
        }).then(response => response.json())
        .then(response => {
            
        })
        .catch(error => {
            setLoading(false);
        })

        toast({
            title: `Signature packet sent to ${email}`,
            description: "Please check your spam folder if email is not in your inbox.",
            status: "success", 
            duration: "7000"
        })

        return router.refresh();
    }

    return (
        <>
            <Button size="sm" variant="ghost" onClick={handleRequest} isLoading={loading}>Request Signature Packet</Button>
        </>
    )
}