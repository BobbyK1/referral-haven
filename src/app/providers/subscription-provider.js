'use client'

import { createBrowserClient } from "@supabase/ssr";
import { createContext, useEffect, useState } from "react";
import { HomePageSkeleton } from "../UI/LoadingSkeletons";
import Subscriptions from "../UI/Subscriptions";

const SubscriptionContext = createContext();

export function SubscriptionProvider({ children }) {
    const [user, setUser] = useState([]);
	const [loading, setLoading] = useState(true);
	const [active, setActive] = useState();
	
	const supabase = createBrowserClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
	)

	useEffect(() => {
		const getUser = async () => {
			setLoading(true);

			const { data: { user }, error } = await supabase.auth.getUser();

			if (user) {
				const { data: agents, error } = await supabase
					.from('agents')
					.select('role')
					.eq('id', user.id)

				if (error) throw new Error(error.message);

				setUser(agents[0].role)

				if (agents[0].role.includes('referral_agent')) {
					await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/stripe/checkSubscriptionStatus`, {
						method: "GET",
					})
						.then(res => res.json())
						.then(res => {
	
							if (res.active) {
								setActive(true);
							} else {
								setActive(false);
							}
						})
						.catch(error => console.log(error))
				}	
			}

			setLoading(false);
			return null;
		}

		getUser();
	}, [])
    return (
        <SubscriptionContext.Provider value={null}>
		    {loading ? <HomePageSkeleton /> : (user.includes('referral_agent') && active) || !user.includes('referral_agent') ? children : <Subscriptions /> }
        </SubscriptionContext.Provider>
    )
}