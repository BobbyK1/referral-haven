'use client'

import ClientSupabase from "@/app/util/clientSupabase";
import { Box, Button, Center, Input, Menu, MenuButton, MenuItem, MenuList, Spinner, Text } from "@chakra-ui/react"
import algoliasearch from "algoliasearch";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AssignAgent({ id, assignedAgent }) {
    const [hits, setHits] = useState([]);
    const [loading, setLoading] = useState(false);
    const [resultsLoading, setResultsLoading] = useState(false);

    const router = useRouter();

    const client = algoliasearch(process.env.NEXT_PUBLIC_ALGOLIA_APP_ID, process.env.NEXT_PUBLIC_ALGOLIA_API_KEY);
    const index = client.initIndex(process.env.NEXT_PUBLIC_ALGOLIA_AGENT_INDEX);

    const leadClient = algoliasearch(process.env.NEXT_PUBLIC_ALGOLIA_APP_ID, process.env.NEXT_PUBLIC_ALOGLIA_LEAD_INDEX_API_KEY);
    const leadIndex = leadClient.initIndex(process.env.NEXT_PUBLIC_ALGOLIA_LEAD_INDEX)

    const handleSearch = (e) => {
        setResultsLoading(true);
        
        if (e.length > 2) {
            index.search(e)
                .then(({hits}) => {
                    const a = [];

                    hits.forEach(hit => {
                        a.push(hit);
                    })

                    setHits(a);
                })
        } else if (e.length < 2) {
            setHits([]);
        }

        setResultsLoading(false);
    }

    const handleAssignedAgent = async (agentId) => {
        setLoading(true);

        const supabase = ClientSupabase();
        
        const { data, error } = await supabase
            .from('leads')
            .update({
                'assigned_agent': agentId
            })
            .eq("id", id);

        if (error) throw new Error(error.message);

        try {
            await leadIndex.partialUpdateObject({
                objectID: id,
                assignedAgent: agentId
            })
        } catch (error) {
            console.log(error)
        }

        async function AddUpdateToLead() {
            const { data, error } = await supabase
                .from('updates')
                .insert({
                    lead_id: id,
                    type: "agentAssigned",
                    message: "Lead has been assigned to agent."
                });

            if (error) throw new Error(error.message)
        }

        await AddUpdateToLead();

        router.refresh();
        setHits([]);
        setLoading(false);

        return;
    }

    return (
        <>
            <Menu key="searchMenu" autoSelect={false}>
                <MenuButton isLoading={loading} as={Button} size="sm" variant="ghost">{assignedAgent ? `${assignedAgent.first_name} ${assignedAgent.last_name}` : "Assign Agent"}</MenuButton>

                <MenuList autoFocus={false}>
                    <Box px="2">
                        <Input autoFocus={true} key="searchBar" onChange={e => handleSearch(e.target.value)} borderColor="blackAlpha.300" placeholder="Search agents..." type="text" size="md" w="full" mb="3" />
                    </Box>

                    {resultsLoading ? <Center autoFocus={false} my="2"><Spinner /></Center> :
                        <>
                            {hits.length > 0 ? 
                                <>
                                    {hits.map(hit => {
                                        
                                        return (
                                            <MenuItem autoFocus={false} key={hit.objectID} fontSize="sm" onClick={() => handleAssignedAgent(hit.objectID)}>{hit.firstName} {hit.lastName} ({hit.email})</MenuItem>
                                        )
                                    })}
                                </>
                                :
                                <Text fontSize="sm" mt="2" mb="2" textAlign="center">No results...</Text>
                            }
                        </>
                    }

                    
                    
                </MenuList>
            </Menu>
        </>
    )
}