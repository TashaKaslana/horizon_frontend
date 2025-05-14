import UserInfoContainer from "@/app/(home)/users/[userId]/info/UserInfoContainer";

const Page = async ({params} : {params: Promise<{ userId: string }>}) => {
    const {userId} = await params

    return (
        <>
            <UserInfoContainer userId={userId}/>
        </>
    )
}

export default Page