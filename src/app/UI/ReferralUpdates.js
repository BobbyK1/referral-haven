import { Box, Stack, Text } from "@chakra-ui/react";
import serverClientSupabase from "../util/serverClientSupabase";
import { Suspense } from "react";
import { Email, Exclamation, Note, Phone } from "./Icons";

export default function ReferralUpdates({ id }) {
    const supabase = serverClientSupabase();

    async function getUpdates() {
        const { data: updates, error } = await supabase
            .from('updates')
            .select('*')
            .eq('lead_id', id)
            .order('created_at', { ascending: false });

        if (error) throw new Error(error.message);

        return updates;
    }

    return (
        <>
            <Suspense fallback="Loading...">
                <Box>
                    {getUpdates().then(updates =>
                        updates.length === 0 ? <Text mt="5" color="blackAlpha.500" textAlign="center" fontSize="md">No updates yet...</Text> :
                        updates.map(update => {
                            var timestamp = "2024-01-04T20:48:43.064419+00:00";
                            var date = new Date(timestamp);

                            // Extracting components of the date
                            var year = date.getFullYear();
                            var month = date.getMonth() + 1; // Months are zero-based, so we add 1
                            var day = date.getDate();
                            var hours = date.getHours();
                            var minutes = date.getMinutes();
                            var seconds = date.getSeconds();

                            var period = hours >= 12 ? 'PM' : 'AM';
                            hours = hours % 12 || 12; // Convert 0 to 12

                            // Formatting the date
                            var formattedDate = `${month.toString()}/${day.toString()}/${year} at ${hours.toString()}:${minutes.toString()} ${period}`;
                            return (
                            <Box mt="2" key={update.id} w="full" bgColor="blackAlpha.50" p="5">
                                <Stack direction="row" justify="space-between" alignItems="center">
                                    <Stack direction="row" spacing="2" alignItems="center">
                                        {update.type === "statusChange" && <Exclamation fontSize="2xl" color="blue.400" />}
                                        {update.type === "calledOrTextedLead" && <Phone fontSize="2xl" color="blue.400" />}
                                        {update.type === "emailedLead" && <Email fontSize="2xl" color="blue.400" />}
                                        {update.type === "noteAdded" && <Note fontSize="2xl" color="blue.400" />}
                                        <Text fontSize="sm">{update.message}</Text>
                                    </Stack>
                                    <Text fontSize="sm" color="blackAlpha.600">{formattedDate}</Text>
                                </Stack>
                            </Box>
                        )})
                    )}
                </Box>
            </Suspense>
        </>
    );
}
