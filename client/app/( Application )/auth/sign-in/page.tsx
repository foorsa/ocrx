import React from "react";
import LoginPage from "./Base/LoginPage";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import LoadingPage from "@/app/loading";

export default async function Login() {
	const status = await getServerSession(authOptions);

	if (status) {
		redirect("/app");

		return <LoadingPage />;
	}

	return <LoginPage />;
}
