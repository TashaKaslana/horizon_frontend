import {redirect} from "next/navigation";

const Page = () => {
    redirect("/admin/comments/all");
}

export default Page;