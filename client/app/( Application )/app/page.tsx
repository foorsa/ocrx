import React from "react";
import AppPage from "./content";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";

export default function Page() {
	const session = getServerSession(authOptions);

	if (!session) {
		return redirect("/auth/sign-in");
	}

	return <AppPage />;
}
