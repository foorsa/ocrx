import React from "react";
import AppPage from "./content";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import LoadingPage from "@/app/loading";

export default async function Page() {
	const session = await getServerSession(authOptions);

	if (!session) {
		redirect("/auth/sign-in");

		return <LoadingPage />;
	}

	return <AppPage />;
}
