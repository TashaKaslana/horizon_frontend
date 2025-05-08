
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import Link from "next/link";

export function UserOverviewNav({ userId }: { userId: string }) {
    const pathname = usePathname();

    const links = [
        { label: 'Overview', href: `/users/${userId}/overview` },
        { label: 'Posts', href: `/users/${userId}/posts` },
    ];

    return (
        <nav className={'mt-1'}>
            <ul className="flex gap-4">
                {links.map((link) => (
                    <li key={link.href}>
                        <Link
                            href={link.href}
                            className={clsx(
                                'hover:text-blue-700',
                                pathname === link.href
                                    ? 'text-blue-700 font-semibold border-b-3 '
                                    : 'text-blue-500 hover:border-b-2 hover:border-zinc-200'
                            )}
                        >
                            {link.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
