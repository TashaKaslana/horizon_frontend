import { CommentCardList } from "./comment-admin-cards"
import {SiteHeader} from "@/app/admin/components/site-header";
import {CommentChart} from "@/app/admin/comments/all/comment-chart";
import {CommentAdminTable} from "@/app/admin/comments/all/comment-admin-table";

const CommentAdminContainer = () => {
  return (
      <div className={'space-y-4'}>
          <SiteHeader text={'Comments'}/>
          <CommentCardList/>
          <CommentChart/>
          <CommentAdminTable/>
      </div>
  )
}

export default CommentAdminContainer;