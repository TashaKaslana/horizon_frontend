import {Button} from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import {Separator} from "@/components/ui/separator";

const LandingMain = () => {
    return (
        <div className={'flex flex-col items-center gap-4'}>
            <LandingMainTitle/>
            <LandingMainDescription/>
            <LandingMainButton/>
            <LandingMainImage/>
            <LandingAbout/>
            <Separator/>
        </div>
    )
}

const LandingMainTitle = () => {
    return (
        <h1 className={'font-extrabold text-6xl bg-linear-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent'}>Welcome
            to Horizon</h1>
    )
}

const LandingMainDescription = () => {
    return (
        <p className={'font-light text-gray-600'}>Horizon is a powerful and flexible development by
            framework.</p>
    )
}

const LandingMainButton = () => {
    return (
        <div className={'flex justify-center'}>
            <Button className={'w-40'}>
                <Link href={'/foryou'}>
                    Enter
                </Link>
            </Button>
        </div>
    )
}

const LandingMainImage = () => {
    return (
        <Image src={'/images/landing_page/landing-main.png'}
               alt={'Landing main image'}
               height={400}
               width={800}
               className={'rounded-lg'}
        />
    )
}

const LandingAbout = () => {
    const ABOUT_SECTIONS = [
        {
            title: "What is this project?",
            content:
                "It's a TikTok-inspired short video sharing platform where users can create, browse, like, and comment on videos.",
        },
        {
            title: "What technologies are used?",
            content:
                "Built with Spring Boot, Next.js, PostgreSQL, Abby. It follows clean architecture with a modular design.",
        },
        {
            title: "What are the main features?",
            content:
                "Features include short video uploads, a For You feed, real-time notifications, commenting, following users, and reporting posts.",
        },
        {
            title: "How is it different from TikTok?",
            content:
                "It’s lightweight, educational, open-source, and designed for learning fullstack and modular architecture rather than commercial deployment.",
        },
        {
            title: "Who built this project?",
            content:
                "Our team consists of dedicated university students who collaborated to simulate real-world development workflows and apply system analysis and design concepts.",
        },
        {
            title: "Who are members of our team?",
            content: "Nguyen Tan Phong - Dang Binh Dai - Huynh Nguyen Hoang Vinh"
        }
    ];

    return (
        <div className={'w-full flex flex-col items-center'}>
            <h2 className={'text-center text-2xl font-semibold'}>Questions And Answers</h2>
            <Accordion type="single" collapsible className={'w-1/2'}>
                {ABOUT_SECTIONS.map((section, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger className={'text-sky-700'}>{section.title}</AccordionTrigger>
                        <AccordionContent className={'text-orange-400'}>{section.content}</AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
}

export default LandingMain;