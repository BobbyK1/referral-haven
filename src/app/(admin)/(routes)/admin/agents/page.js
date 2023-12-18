import fetchAdminUser from "@/app/util/fetchAdminUser"
import { redirect } from "next/navigation";


export default async function Page() {
    const role = await fetchAdminUser();

    if (!role.includes('admin')) {
        redirect('/')
    }

    return (
        <>

        </>
    )
}