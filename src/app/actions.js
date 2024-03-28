'use server'

import { redirect } from "next/navigation"
import { NextResponse } from "next/server"
import serverClientSupabase from "./util/serverClientSupabase"
import fetchUser from "./util/fetchUser"
import { z } from "zod"
import algoliasearch from "algoliasearch"

export async function AddLicenseToAgent(prevState, formData) {
    const supabase = serverClientSupabase();
    const id = await formData.get('id');

    const licenseData = {
        licenseType: formData.get('licenseType'),
        licenseNumber: formData.get('licenseNumber')
    }

    const schema = z.object({
        licenseType: z.string(),
        licenseNumber: z.string().min(1)
    })

    const response = schema.safeParse(licenseData);

    if (response.error) return { message: "No data provided" };

    const GetPrevLicense = async () => {
        const { data: agents, error } = await supabase
            .from('agents')
            .select('license')
            .eq('id', id);

        if (error) throw new Error(error.message);

        return agents[0].license
    }

    const License = await GetPrevLicense();
    
    const { data, error } = await supabase
        .from('agents')
        .update({
            license: [
                ...License,
                {
                    licenseType: licenseData.licenseType,
                    licenseNumber: licenseData.licenseNumber
                }
            ]
        })
        .eq('id', id)

    if (error) return { message: "Unable to update licenses. Please try again later."}
    
    return { message: "success" }
}

export async function AddPropertyToReferralLead(prevState, formData) {
    const supabase = serverClientSupabase();
    const id = await formData.get('id');

    const propertyData = {
        property_address: await formData.get('property_address'),
        property_price: await formData.get('property_price'),
        property_goal: await formData.get('property_goal')
    }

    const schema = z.object({
        property_address: z.string().min(1),
        property_price: z.string().min(1),
        property_goal: z.string().min(1)
    })

    const response = schema.safeParse(propertyData);

    if (response.error) {
        return { message: "No data provided" }
    } 

    // Read current properties stored on lead
    const { data: leads, error } = await supabase
        .from('leads')
        .select('properties')
        .eq('id', id)
        .single();


    if (error) {
        console.error(error);
        throw new Error(error.message);
    }

    // Check if data is not null before trying to destructure
    if (leads) {
        const existingProperties = leads.properties || [];

        // Add the new property to the existing properties array
        const updatedProperties = [...existingProperties, propertyData];

        // Update the lead with the modified properties array
        const { data: updateData, error: updateError } = await supabase
            .from('leads')
            .update({ properties: updatedProperties })
            .eq('id', id);

        if (updateError) {
            console.error(updateError);
            throw new Error(updateError.message);
        }

        console.log('Lead updated successfully', updateData);
    } else {
        console.log('No lead found for the specified ID');
    }

    if (error) throw new Error(error.message);

    return { message: "success" }
}

export async function CreateReferralAgentLead(prevState, formData) {
    const supabase = serverClientSupabase();
    const profile = await fetchUser();

    const leadData = {
        first_name: await formData.get('first_name'),
        last_name: await formData.get('last_name'),
        email: await formData.get('email'),
        phone_number: await formData.get('phone_number'),
        goal: await formData.get('goal'),
        notes: await formData.get('notes'),
        referral_type: await formData.get('referral_type'),
        receiving_agent_name: await formData.get('receiving_agent_name'),
        receiving_agent_phone_number: await formData.get('receiving_agent_phone_number'),
        receiving_agent_email: await formData.get('receiving_agent_email'),
        receiving_agent_aware: (await formData.get('receiving_agent_aware')) === 'on' ? true : false,
        status: "just starting"
    }

    const schema = z.object({
        first_name: z.string().min(1),
    })

    const { data, error } = await supabase
        .from('leads')
        .insert([
            {
                first_name: leadData.first_name,
                last_name: leadData.last_name,
                email: leadData.email,
                phone_number: leadData.phone_number,
                goal: leadData.goal,
                notes: leadData.notes,
                referring_agent: profile.user.id,
                referral_type: leadData.referral_type,
                receiving_agent_name: leadData.receiving_agent_name,
                receiving_agent_phone_number: leadData.receiving_agent_phone_number,
                receiving_agent_email: leadData.receiving_agent_email,
                receiving_agent_aware: leadData.receiving_agent_aware,
                status: "just starting"
            }
        ])
        .select('id');

    if (error) NextResponse.error(error.message);

    const client = algoliasearch(process.env.NEXT_PUBLIC_ALGOLIA_APP_ID, process.env.NEXT_PUBLIC_ALOGLIA_LEAD_INDEX_API_KEY);

    const index = client.initIndex(process.env.NEXT_PUBLIC_ALGOLIA_LEAD_INDEX);

    const record = {
        objectID: data[0].id,
        firstName: leadData.first_name,
        lastName: leadData.last_name,
        email: leadData.email,
        phoneNumber: leadData.phone_number,
        referringAgent: profile.user.id
    }

    try {
        await index.saveObject(record);
    } catch (error) {
        console.log(error);
        return { message: "Unable to save object to Algolia.", }
    }

    return redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/referrals/${data[0].id}`);
}

export async function UpdatePersonalInfo(prevState, formData) {
    if (!formData) {
        return NextResponse.error('No form data submitted.');
    }

    const supabase = await serverClientSupabase();
    const profile = await fetchUser();

    const profileData = {
        first_name: await formData.get('first_name'),
        last_name: await formData.get('last_name'),
        phone_number: await formData.get('phone_number'),
        address: {
            address: await formData.get('address'),
            city: await formData.get('city'),
            state: await formData.get('state'),
            zip: await formData.get('zip')
        }
    }

    const { data, error } = await supabase
        .from('agents')
        .update(profileData)
        .eq('id', profile.user.id);

    if (error) throw new Error(error.message);

    return { message: "success" }
}