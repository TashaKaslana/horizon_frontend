import Logo from "../../../../../public/images/share/Logo";
import Link from "next/link";

const LandingFooter = () => {
    const menuItems = [
        {
            title: "Platform",
            links: [
                {text: "Explore", url: "/explore"},
                {text: "Upload", url: "/upload"},
                {text: "Features", url: "/features"},
                {text: "Trending", url: "/trending"},
                {text: "Help Center", url: "/help"},
            ],
        },
        {
            title: "Developers",
            links: [
                {text: "Docs", url: "/docs"},
                {text: "API Reference", url: "/api"},
                {text: "GitHub", url: "https://github.com/your-org"},
                {text: "Open Source", url: "/open-source"},
            ],
        },
        {
            title: "Community",
            links: [
                {text: "Discord", url: "https://discord.gg/your-invite"},
                {text: "Contribute", url: "/contribute"},
                {text: "Report an Issue", url: "/support"},
            ],
        },
        {
            title: "Company",
            links: [
                {text: "About", url: "/about"},
                {text: "Team", url: "/team"},
                {text: "Contact", url: "/contact"},
                {text: "Blog", url: "/blog"},
            ],
        },
    ]

    const tagline = "A modern, open-source video sharing platform — created for learning and building in public."

    const copyright =
        "© 2025 TikTok Clone Project. Created by university students for learning purposes."

    const bottomLinks = [
        {text: "Terms", url: "/terms"},
        {text: "Privacy", url: "/privacy"},
    ]

    // const contactLink = [
    //     {text: "Discord", href: siteConfig.url},
    //     {text: "Twitter", href: siteConfig.url},
    //     {text: "Github", href: siteConfig.links.github}
    // ]


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
                        {menuItems.map((section, sectionIdx) => (
                            <div key={sectionIdx}>
                                <h3 className="mb-4 font-bold">{section.title}</h3>
                                <ul className="space-y-4 text-muted-foreground">
                                    {section.links.map((link, linkIdx) => (
                                        <li
                                            key={linkIdx}
                                            className="font-medium hover:text-primary"
                                        >
                                            <a href={link.url}>{link.text}</a>
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
                            {bottomLinks.map((link, linkIdx) => (
                                <li key={linkIdx} className="underline hover:text-primary">
                                    <a href={link.url}>{link.text}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </footer>
            </div>
        </section>
    );
};

export default LandingFooter
