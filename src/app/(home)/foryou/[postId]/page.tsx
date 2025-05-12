import ForyouContainer from "../ForyouContainer"
import {UUID} from "node:crypto";

const Page = async ({params}: { params: Promise<{ postId: UUID }> }) => {
    const {postId} = await params;

    return (
        <ForyouContainer postId={postId}/>
    )
}

export default Page