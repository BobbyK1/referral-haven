import { Box, Button, Container, Grid, GridItem, Input, Select, SimpleGrid, Stack, Tab, TabList, TabPanel, TabPanels, Tabs, Tag, Text } from "@chakra-ui/react";


export default async function Page() {

    return (
        <Container maxW="container.md">
            <Box>
                <Stack direction="row" alignItems="center">
                        <Text fontSize="2xl" fontWeight="semibold">Bobby Karamacoski</Text>
                        <Tag colorScheme="green" variant="subtle">Active</Tag>
                </Stack>
                <Text fontSize="md" color="blackAlpha.600">bobby@havenrealtyhomes.com</Text>
            </Box>

            <Tabs mt="5" colorScheme="black">
                <TabList>
                    <Tab>Profile</Tab>
                    <Tab>Billing</Tab>
                    <Tab>Settings</Tab>
                </TabList>

                <TabPanels>
                    <TabPanel px="0">
                        <Box w="full" bgColor="blackAlpha.50" p="5" mt="5">
                            <Stack direction="row" alignItems="center" justify="space-between">
                                <Text fontSize="sm" fontWeight="semibold" color="blackAlpha.800">Personal Information</Text>

                                <Button variant="ghost" size="sm">Edit</Button>
                            </Stack>

                            <SimpleGrid columns="2" mt="8" alignItems="center">
                                <Text fontSize="md">Email</Text>
                                <Input value="bobby@havenrealtyhomes.com" borderColor="blackAlpha.400" readOnly />
                            </SimpleGrid>

                            <SimpleGrid columns="2" mt="5" alignItems="center">
                                <Text fontSize="md">Phone Number</Text>
                                <Input value="2197795752" borderColor="blackAlpha.400" readOnly />
                            </SimpleGrid>

                            <SimpleGrid columns="2" mt="5" >
                                <Text fontSize="md">Address</Text>
                                <Box>
                                    <Input value="11866 Mount St" borderColor="blackAlpha.400" readOnly />
                                    <Grid mt="2" gap="2" templateColumns="repeat(7, 1fr)">
                                        <GridItem colSpan="3">
                                            <Input value="Crown Point" borderColor="blackAlpha.400"></Input>
                                        </GridItem>
                                        <GridItem colSpan="2">
                                            <Select value="IN" borderColor="blackAlpha.400">
                                                <option value="IN">IN</option>
                                            </Select>
                                        </GridItem>
                                        <GridItem colSpan="2">
                                            <Input value="46307" borderColor="blackAlpha.400" />
                                        </GridItem>
                                    </Grid>
                                </Box>
                            </SimpleGrid>
                        </Box>
                    </TabPanel>
                    <TabPanel px="0">
                        <Box mt="5" p="5" w="full" bg="blackAlpha.50">
                            <Text fontSize="sm" fontWeight="semibold" color="blackAlpha.800">Billing</Text>
                        </Box>
                    </TabPanel>

                    <TabPanel px="0">
                        <Box mt="5" p="5" w="full" bg="blackAlpha.50">
                            <Text fontSize="sm" fontWeight="semibold" color="blackAlpha.800">Settings</Text>
                        </Box>
                    </TabPanel>
                </TabPanels>
            </Tabs>


            
        </Container>
    )
}