import UserOverviewContainer from "@/app/(home)/users/[userId]/overview/UserOverviewContainer";

const Page = async ({params} : {params: Promise<{ userId: string }>}) => {
    const {userId} = await params

    return (
        <>
            <UserOverviewContainer userId={userId}/>
        </>
    )
}

export default Page