'use client'

import ClientSupabase from "@/app/util/clientSupabase";
import { Box, Button, Input, Menu, MenuButton, MenuItem, MenuList, Text } from "@chakra-ui/react"
import algoliasearch from "algoliasearch";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AssignAgent({ id, assignedAgent }) {
    const [hits, setHits] = useState([]);
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const client = algoliasearch(process.env.NEXT_PUBLIC_ALGOLIA_APP_ID, process.env.NEXT_PUBLIC_ALGOLIA_API_KEY);
    const index = client.initIndex(process.env.NEXT_PUBLIC_ALGOLIA_AGENT_INDEX);

    const handleSearch = (e) => {
        
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

        router.refresh();
        setHits([]);
        setLoading(false);

        return;
    }

    return (
        <>
            <Menu>
                <MenuButton isLoading={loading} as={Button} size="sm" variant="ghost">{assignedAgent ? `${assignedAgent.first_name} ${assignedAgent.last_name}` : "Assign Agent"}</MenuButton>

                <MenuList>
                    <Box px="2">
                        <Input onChange={e => handleSearch(e.target.value)} borderColor="blackAlpha.300" placeholder="Search agents..." type="text" size="md" w="full" mb="3" />
                    </Box>

                    {hits.length > 0 ? 
                        <>
                            {hits.map(hit => {
                                console.log(hit)
                                
                                return (
                                    <MenuItem key={hit.objectID} fontSize="sm" onClick={() => handleAssignedAgent(hit.objectID)}>{hit.firstName} {hit.lastName} ({hit.email})</MenuItem>
                                )
                            })}
                        </>
                        :
                        <Text fontSize="sm" mt="2" mb="2" textAlign="center">No results...</Text>
                    }
                    
                </MenuList>
            </Menu>
        </>
    )
}