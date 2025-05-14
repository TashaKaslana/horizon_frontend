import React from "react";
import UserOverviewHeader from "@/app/(home)/users/[userId]/components/UserOverviewHeader";

const Layout = async ({
                          children,
                          params
                      }: {
    children: React.ReactNode;
    params: Promise<{ userId: string }>;
}) => {
    const {userId} = await params

    return (
        <div className={'h-screen'}>
            <UserOverviewHeader userId={userId}/>
            {children}
        </div>
    );
};

export default Layout;
