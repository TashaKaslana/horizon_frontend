import {usePathname} from 'next/navigation';
import clsx from 'clsx';
import Link from "next/link";
import {useTranslations} from 'next-intl';

export function UserOverviewNav({userId}: { userId: string }) {
    const pathname = usePathname();
    const t = useTranslations('Home.user_profile.navigation');

    const links = [
        {label: t('overview'), href: `/users/${userId}/overview`},
        {label: t('posts'), href: `/users/${userId}/posts`},
        {label: t('info'), href: `/users/${userId}/info`},
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
