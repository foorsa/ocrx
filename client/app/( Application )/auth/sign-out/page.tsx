import React from "react";
import LogoutInterface from "./interface/LogoutInterface";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/authOptions";

export default async function LogoutPage() {
	const session = await getServerSession(authOptions);

	if (!session) {
		return redirect("/auth/sign-in");
	}

	return (
		<React.Fragment>
			<LogoutInterface />
		</React.Fragment>
	);
}
