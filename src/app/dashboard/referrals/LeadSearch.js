'use client'

import { Button, Input, Menu, MenuButton, MenuItem, MenuList, Popover, PopoverAnchor, PopoverBody, PopoverContent } from "@chakra-ui/react"
import algoliasearch from "algoliasearch";
import Link from "next/link";
import { useState } from "react";

export default function LeadSearch({ id }) {
    const [results, setResults] = useState([]);

    const leadClient = algoliasearch(process.env.NEXT_PUBLIC_ALGOLIA_APP_ID, process.env.NEXT_PUBLIC_ALOGLIA_LEAD_INDEX_API_KEY);
    const leadIndex = leadClient.initIndex(process.env.NEXT_PUBLIC_ALGOLIA_LEAD_INDEX)

    const search = async (value) => {
        if (value.length > 2) {
            await leadIndex.search(value, {
                filters: `referringAgent:${id}`
            }).then(({ hits }) => {
                setResults(hits)
            })
        } else if (value.length < 2) {
            setResults([]);
        }
    }

    return (
        <>
            <Popover isOpen={results.length > 0} autoFocus={false} placement="bottom-start" w="full">
                <PopoverAnchor>
                    <Input w="96" onChange={e => search(e.target.value)} placeholder="Search..." mb="10" bg="blackAlpha.50" borderColor="blackAlpha.100" />
                </PopoverAnchor>
                
                <PopoverContent>
                    <PopoverBody>
                        {results.map(result => {
                            
                            return (
                                <Button as={Link} variant="ghost" w="full" size="sm" key={result.objectID} href={`/dashboard/referrals/${result.objectID}`}>{result.firstName} {result.lastName}</Button>
                            )
                        })}
                    </PopoverBody>
                </PopoverContent>
            </Popover>
        </>
    )
}