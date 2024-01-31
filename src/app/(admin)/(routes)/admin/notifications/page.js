import fetchAdminUser from "@/app/util/fetchAdminUser";
import serverClientSupabase from "@/app/util/serverClientSupabase";
import { Box, Button, Container, Divider, Heading, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import Link from "next/link";
import { redirect } from "next/navigation";


export default async function Page() {
    const { user  } = await fetchAdminUser();
    
    if (!user) redirect('/');

    const supabase = await serverClientSupabase();

    async function GetNotifications() {
        const { data: notifications, error } = await supabase
            .from('notifications')
            .select('*')
            .contains('user_id', [user.id])

        if (error) throw new Error(error.message);

        return notifications;
    }

    const notifications = await GetNotifications();

    console.log(notifications)

    return (
        <>
            <Container mt="10" maxW="8xl">
                <Heading as="h1" fontSize="3xl">Notifications</Heading>

                <Divider mt="2" mb="5" borderColor="blackAlpha.300" />

                <>
                    {notifications.map(notification => {

                        return (
                            <Box w="full" bg="blackAlpha.50" p="5" borderRadius="5" shadow="sm" mb="5">
                                <SimpleGrid columns="3" alignItems="center">
                                    <Text>{notification.message.title}</Text>
                                    <Text>{notification.message.details}</Text>
                                    <Button as={Link} w="fit-content" href={`/admin/agents/${notification.message.metadata.id}`}>
                                        View
                                    </Button>
                                </SimpleGrid>
                            </Box>
                        )
                    })}
                </>
            </Container>
        </>
    )
}