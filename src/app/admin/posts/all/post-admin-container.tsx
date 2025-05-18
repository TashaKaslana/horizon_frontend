import {SiteHeader} from "@/app/admin/components/site-header";
import {PostCardList} from "@/app/admin/posts/all/post-card-list";
import {PostChart} from "@/app/admin/posts/all/post-attending-chart";
import {PostTable} from "@/app/admin/posts/all/post-table";

const PostAdminContainer = () => {
    return (
        <div className={'space-y-4 size-full'}>
            <SiteHeader text={'Posts'}/>
            <PostCardList/>
            <PostChart/>
            <PostTable/>
        </div>
    )
}

export default PostAdminContainer