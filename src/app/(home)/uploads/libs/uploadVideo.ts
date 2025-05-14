import {getAccessToken} from "@auth0/nextjs-auth0";
import {apiRequest} from "@/lib/apiRequest";
import {PostUpload} from "@/app/(home)/uploads/types/postUpload";
import {CreateAsset} from "@/types/Asset";
import {uploadToCloudinary} from "@/api/uploadApi";

export const uploadPostWithVideo = async ({
                                              postData,
                                              setUploadProgress,
                                          }: {
    postData: PostUpload;
    setUploadProgress: (progress: number) => void;
}) => {
    const asset = await uploadToCloudinary({
        file: postData.file,
        setProgress: setUploadProgress,
    });

    setUploadProgress(90);
    await createPost(postData, asset);
    setUploadProgress(100);

    return asset;
};


const createPost = async (postData: PostUpload, videoAsset: CreateAsset) => {
    const accessToken = await getAccessToken();

    return apiRequest({
        url: '/posts',
        method: "POST",
        data: {
            caption: postData.title,
            description: postData.description,
            visibility: postData.visibility,
            duration: postData.duration,
            categoryName: postData.category,
            allowComments: postData.allowComments,
            ageRestricted: postData.ageRestricted,
            videoAsset: videoAsset,
        },
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
}

export default uploadPostWithVideo;
