import {Button} from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

const LandingMain = () => {
    return (
        <div className={'flex flex-col items-center gap-4'}>
            <LandingMainTitle/>
            <LandingMainDescription/>
            <LandingMainButton/>
            <LandingMainImage/>
        </div>
    )
}

const LandingMainTitle = () => {
    return (
        <h1 className={'font-extrabold text-6xl bg-linear-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent'}>Welcome to Horizon</h1>
    )
}

const LandingMainDescription = () => {
    return (
        <p className={'font-light text-gray-600'}>Horizon is a powerful and flexible blockchain development
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

export default LandingMain;