'use server'

import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { NextResponse } from "next/server"

export async function AddPropertyToReferralLead(prevState, formData) {
    const cookieStore = cookies();
    const id = await formData.get('id');

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
            cookies: {
                get(name) {
                    return cookieStore.get(name)?.value
                },
                set(name, value, options) {
                    cookieStore.set({ name, value, ...options })
                },
                remove(name, options) {
                    cookieStore.set({ name, value: '', ...options })
                },
            },
        }
    )

    async function GetUser() {
        const { data: { user }, error } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.error('Action requires authentication.');
        }

        if (error) NextResponse.error(error.message);

        return user;
    }

    const user = await GetUser();

    const propertyData = {
        property_address: await formData.get('property_address'),
        property_price: await formData.get('property_price'),
        property_goal: await formData.get('property_goal')
    }

    // Read current properties stored on lead
    const { data: leads, error } = await supabase
        .from('leads')
        .select('properties')
        .eq('id', id)
        .single();

    console.log

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
    const cookieStore = cookies()

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
            cookies: {
                get(name) {
                    return cookieStore.get(name)?.value
                },
                set(name, value, options) {
                    cookieStore.set({ name, value, ...options })
                },
                remove(name, options) {
                    cookieStore.set({ name, value: '', ...options })
                },
            },
        }
    )
    
    async function GetUser() {
        const { data: { user }, error } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.error('Action requires authentication.');
        }

        if (error) NextResponse.error(error.message);

        return user;
    }

    const user = await GetUser();

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
        receiving_agent_aware: (await formData.get('receiving_agent_aware')) === 'on' ? true : false
    }

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
                referring_agent: user.id,
                referral_type: leadData.referral_type,
                receiving_agent_name: leadData.receiving_agent_name,
                receiving_agent_phone_number: leadData.receiving_agent_phone_number,
                receiving_agent_email: leadData.receiving_agent_email,
                receiving_agent_aware: leadData.receiving_agent_aware
            }
        ])
        .select();

    if (error) NextResponse.error(error.message);

    return redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/referrals/${data[0].id}`);
}