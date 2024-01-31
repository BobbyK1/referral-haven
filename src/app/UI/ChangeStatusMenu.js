'use client'

import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react"
import { createBrowserClient } from "@supabase/ssr"
import { DownChevron } from "./Icons"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function ChangeStatusMenu({ id, status }) { 
    const [currentStatus, setCurrentStatus] = useState(status);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )

    const handleStatusChange = async (newStatus) => {
        setLoading(true)

        if (newStatus) {
            setCurrentStatus(newStatus);
            
            const { data, error } = await supabase
                .from('leads')
                .update({ status: newStatus })
                .eq('id', id)
                .select();

            if (error) throw new Error(error.message);

            const { data: status, error: statusError } = await supabase
                .from('updates')
                .insert({
                    lead_id: id,
                    type: "statusChange",
                    message: `Lead status changed from "${currentStatus.toUpperCase()}" to "${newStatus.toUpperCase()}"`
                })

            if (statusError) throw new Error(error.message);
        }

        router.refresh();
        setLoading(false);
    }

    return (
        <Menu>
            <MenuButton as={Button} isLoading={loading} rounded="full" size="xs" colorScheme="blue" bgColor="blue.400" rightIcon={<DownChevron />} textTransform="capitalize">{currentStatus}</MenuButton>
            <MenuList>
                <MenuItem onClick={() => handleStatusChange('just starting')} isDisabled={currentStatus === "just starting"}>Just Starting</MenuItem>
                <MenuItem onClick={() => handleStatusChange('looking')} isDisabled={currentStatus === "looking"}>Looking</MenuItem>
                <MenuItem onClick={() => handleStatusChange('under contract')} isDisabled={currentStatus === "under contract"}>Under Contract</MenuItem>
                <MenuItem onClick={() => handleStatusChange('closed')} isDisabled={currentStatus === "closed"}>Closed</MenuItem>
            </MenuList>
        </Menu>
    )
}