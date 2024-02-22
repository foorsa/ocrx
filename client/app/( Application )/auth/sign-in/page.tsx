import React from "react";
import LoginPage from "./Base/LoginPage";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

export default async function Login() {
	const session = await getServerSession();

	// If the user is already logged in, redirect.
	// Note: Make sure not to redirect to the same page
	// To avoid an infinite loop!
	if (session) {
		return redirect("/app");
	}

	return <LoginPage />;
}
