'use client'

import { Button, ButtonGroup, IconButton, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Textarea, useDisclosure } from "@chakra-ui/react";
import { Edit, Email, Phone } from "./Icons";
import { useState } from "react";
import ClientSupabase from "../util/clientSupabase";
import { useRouter } from "next/navigation";

const AddUpdateButton = ({ id }) => {
    const { onOpen, isOpen, onClose } = useDisclosure();
    const [loading, setLoading] = useState(false);
    const [active, setActive] = useState(null);
    const [note, setNote] = useState('');
    const router = useRouter();

    const supabase = ClientSupabase();

    const addUpdate = async () => {
        setLoading(true);

        const { data, error } = await supabase
            .from('updates')
            .insert({
                lead_id: id,
                type: active === "called/texted" ? "calledOrTextedLead" : active === "emailed" ? "emailedLead" : "noteAdded",
                message: active === "called/texted" ? `Lead called/texted. Note: ${note.length > 0 ? note : "N/A"}` : active === "emailed" ? `Lead emailed. Note: ${note.length > 0 ? note : "N/A"}` : active === "note" && note
            })

        if (error) throw new Error(error.message);

        router.refresh();
        setLoading(false);
        return onClose();
    }


    return (
        <>
            <Button onClick={onOpen} title="Add Update" size="sm" variant="ghost">Add Update</Button>

            <Modal size="xl" isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />

                <ModalContent>
                    <ModalHeader>Add Update</ModalHeader>

                    <ModalCloseButton />

                    <ModalBody>
                        <ButtonGroup size="lg" isAttached>
                            <IconButton onClick={() => setActive('called/texted')} isActive={active === 'called/texted'} title="Called/Texted" icon={<Phone />} />
                            <IconButton onClick={() => setActive('emailed')} isActive={active === 'emailed'} icon={<Email />} title="Emailed" />
                            <IconButton onClick={() => setActive('note')} isActive={active === 'note'} icon={<Edit />} title="Note" />
                        </ButtonGroup>

                        <Textarea mt="5" onChange={(e) => setNote(e.target.value)} resize="none" borderColor="blackAlpha.300" placeholder="Add notes..." h="32"/>
                    </ModalBody>

                    <ModalFooter>
                        <Button onClick={addUpdate} size="sm" isLoading={loading} colorScheme="blue" isDisabled={note.length === 0 || !active}>Add</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default AddUpdateButton;