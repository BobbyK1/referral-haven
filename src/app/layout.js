
import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"
import { ChakraProviders } from "./providers/chakra-provider"

export const metadata = {
  title: 'Referral Haven',
  description: '',
}

export default async function RootLayout({ children }) {

	const cookieStore = cookies()

	const supabase = createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
		{
		cookies: {
			get(name) {
			return cookieStore.get(name)?.value
			},
		},
		}
	)

	const { data: { user }, error } = await supabase.auth.getUser();

	return (
		<html lang="en">
			<body>
				<ChakraProviders>
						{children}
				</ChakraProviders>
			</body>
		</html>
	)
}
