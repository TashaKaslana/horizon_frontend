import Logo from "../../../../../public/images/share/Logo";
import Link from "next/link";
import { useTranslations } from "next-intl";

type TextAndLink ={
    text: string;
    href: string;
};

type NavigationSection = {
    title: string;
    links: TextAndLink[];
};


const LandingFooter = () => {
    const t = useTranslations('LandingPage.footer');

    const menuItems = t.raw('menuItems');
    const tagline = t('tagline');
    const copyright = t('copyright');
    const bottomLinks = t.raw('bottomLinks');

    return (
        <section className="py-16 flex w-full justify-center">
            <div className="container">
                <footer>
                    <div className="grid grid-cols-2 gap-8 lg:grid-cols-6">
                        <div className="col-span-2 mb-8 lg:mb-0">
                            <div className="flex items-center gap-2 lg:justify-start">
                                <Link href={'/'}>
                                    <Logo className={'size-10'}/>
                                </Link>
                                <p className="text-xl font-semibold">Horizon</p>
                            </div>
                            <p className="mt-4 font-bold">{tagline}</p>
                        </div>
                        {menuItems.map((section: NavigationSection, sectionIdx: number) => (
                            <div key={sectionIdx}>
                                <h3 className="mb-4 font-bold">{section.title}</h3>
                                <ul className="space-y-4 text-muted-foreground">
                                    {section.links.map((link, linkIdx) => (
                                        <li
                                            key={linkIdx}
                                            className="font-medium hover:text-primary"
                                        >
                                            <a href={link.href}>{link.text}</a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                    <div
                        className="mt-24 flex flex-col justify-between gap-4 border-t pt-8 text-sm font-medium text-muted-foreground md:flex-row md:items-center">
                        <p>{copyright}</p>
                        <ul className="flex gap-4">
                            {bottomLinks.map((link: TextAndLink, linkIdx: number) => (
                                <li key={linkIdx} className="underline hover:text-primary">
                                    <a href={link.href}>{link.text}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </footer>
            </div>
        </section>
    );
};

export default LandingFooter;
