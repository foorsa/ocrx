import React from "react";
import LoginPage from "./Base/LoginPage";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export default async function Login() {
	const session = await getServerSession(authOptions);

	if (session) {
		return redirect("/app");
	}

	return <LoginPage />;
}
