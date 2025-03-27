"use client";

import {Button} from "@/components/ui/button";
import Link from "next/link";
import {useUser} from "@auth0/nextjs-auth0";
import {UserAssistance} from "@/components/common/user_dialog/UserAssistance";

export default function LoginButton() {
    const {user} = useUser()

    return (
        <div>
            {user ? (
                    <UserAssistance/>
            ) : (
                <Button className="p-2 bg-blue-500 text-white rounded">
                    <Link href={'/auth/login'}>
                        Login with Auth0
                    </Link>
                </Button>
            )}
        </div>
    );
}
