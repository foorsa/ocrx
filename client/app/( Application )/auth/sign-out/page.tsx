import React from "react";
import LogoutInterface from "./interface/LogoutInterface";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/authOptions";
import LoadingPage from "@/app/loading";

export default async function LogoutPage() {
	const session = await getServerSession(authOptions);

	if (!session) {
		redirect("/auth/sign-in");

		return <LoadingPage />;
	}

	return <LogoutInterface />;
}
