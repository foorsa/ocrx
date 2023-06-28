import React from "react";
import PageWrapper from "@/components/PageWrapper";
import AppHeader from "@/app/( Application )/app/translate/Layout/A. App Header";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <AppHeader />
            {children}
        </>
    );
}
