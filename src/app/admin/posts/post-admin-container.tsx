import {SiteHeader} from "@/app/admin/components/site-header";
import {PostCardList} from "@/app/admin/posts/post-card-list";
import {PostChart} from "@/app/admin/posts/post-attending-chart";

const PostAdminContainer = () => {
    return (
        <div className={'space-y-4'}>
            <SiteHeader text={'Posts'}/>
            <PostCardList/>
            <PostChart/>

        </div>
    )
}

export default PostAdminContainer