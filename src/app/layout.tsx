import type {Metadata} from "next";
// import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import {Toaster} from "@/components/ui/sonner";
import React from "react";
import {ThemeProvider} from "@/components/theme-provider";
import {Auth0Provider} from "@auth0/nextjs-auth0";
import QueryProvider from "@/components/query-provider";
import {UserProvider} from "@/components/user-provider";
import ClientSetupProvider from "@/components/client-setup-provider";
import {MaintenanceWrapper} from "@/components/maintenance-wrapper";
import {ClientInitProvider} from "@/components/client-init-provider";
import {getLocale} from "next-intl/server";
import {NextIntlClientProvider} from "next-intl";
import {AblyProviderComponent} from "@/components/ably-provider";

// const geistSans = Geist({
//     variable: "--font-geist-sans",
//     subsets: ["latin"],
// });
//
// const geistMono = Geist_Mono({
//     variable: "--font-geist-mono",
//     subsets: ["latin"],
// });

export const metadata: Metadata = {
    title: "Horizon",
    description: "Horizon social platform",
    icons: "/images/share/Logo.tsx",
};

export default async function RootLayout({
                                             children,
                                         }: Readonly<{
    children: React.ReactNode;
}>) {
    const locale = await getLocale();

    return (
        <html lang={locale} suppressHydrationWarning>
        <body
            // className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
        <Auth0Provider>
            <ClientSetupProvider>
                <AblyProviderComponent>
                    <QueryProvider>
                        <NextIntlClientProvider>
                            <ClientInitProvider>
                                <UserProvider>
                                    <ThemeProvider
                                        attribute="class"
                                        defaultTheme="system"
                                        enableSystem
                                        disableTransitionOnChange
                                    >
                                        <MaintenanceWrapper>
                                            {children}
                                        </MaintenanceWrapper>
                                        <Toaster richColors/>
                                    </ThemeProvider>
                                </UserProvider>
                            </ClientInitProvider>
                        </NextIntlClientProvider>
                    </QueryProvider>
                </AblyProviderComponent>
            </ClientSetupProvider>
        </Auth0Provider>
        </body>
        </html>
    );
}
