import {Button} from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import {Separator} from "@/components/ui/separator";
import { useTranslations } from "next-intl";

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
    const t = useTranslations('LandingPage.main');

    return (
        <h1 className={'font-extrabold text-6xl bg-linear-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent'}>
            {t('title')}
        </h1>
    )
}

const LandingMainDescription = () => {
    const t = useTranslations('LandingPage.main');

    return (
        <p className={'font-light text-gray-600'}>
            {t('description')}
        </p>
    )
}

const LandingMainButton = () => {
    const t = useTranslations('LandingPage.main');

    return (
        <div className={'flex justify-center'}>
            <Button className={'w-40'}>
                <Link href={'/foryou'}>
                    {t('button')}
                </Link>
            </Button>
        </div>
    )
}

const LandingMainImage = () => {
    const t = useTranslations('LandingPage.main');

    return (
        <Image src={'/images/landing_page/landing-main.png'}
               alt={t('imageAlt')}
               height={400}
               width={800}
               className={'rounded-lg'}
        />
    )
}

type AboutSectionItem = {
    title: string;
    content: string;
}

const LandingAbout = () => {
    const t = useTranslations('LandingPage.main');
    const aboutSections = t.raw('aboutSections');

    return (
        <div className={'w-full flex flex-col items-center'}>
            <h2 className={'text-center text-2xl font-semibold'}>{t('aboutTitle')}</h2>
            <Accordion type="single" collapsible className={'w-1/2'}>
                {aboutSections.map((section: AboutSectionItem, index: number) => (
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