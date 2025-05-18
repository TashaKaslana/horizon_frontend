import {SiteHeader} from "@/app/admin/components/site-header";
import {PostCardList} from "@/app/admin/posts/post-card-list";
import {PostChart} from "@/app/admin/posts/post-attending-chart";
import {PostTable} from "@/app/admin/posts/post-table";

const PostAdminContainer = () => {
    return (
        <div className={'space-y-4'}>
            <SiteHeader text={'Posts'}/>
            <PostCardList/>
            <PostChart/>
            <PostTable/>
        </div>
    )
}

export default PostAdminContainer