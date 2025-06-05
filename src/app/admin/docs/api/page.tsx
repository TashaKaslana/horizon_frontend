import {redirect} from "next/navigation";



const Page = () => {
    redirect(`${process.env.NEXT_PUBLIC_API_URL}/swagger-ui/index.html`)
}

export default Page