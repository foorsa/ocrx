import React from "react";
import AppHeader from "@/app/( Application )/app/translate/Layout/A. App Header";
import TaskWidget from "@/app/( Application )/app/components/TaskWidget";

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div className="relative w-full h-auto min-h-screen flex flex-col justify-start items-start">
			<AppHeader />
			{children}
			<TaskWidget />
		</div>
	);
}
