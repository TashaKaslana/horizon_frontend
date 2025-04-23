import axios, {AxiosProgressEvent} from "axios";
import {getAccessToken} from "@auth0/nextjs-auth0";
import {apiRequest} from "@/lib/apiRequest";
import {PostUpload} from "@/app/(home)/uploads/types/postUpload";

type UploadSignature = {
    signature: string;
    timestamp: string;
    api_key: string;
    folder: string;
};

type AssetStore = {
    publicId: string;
    resourceType: string;
    format: string;
    secureUrl: string;
    bytes: number;
    width: number;
    height: number;
    originalFilename: string;
}

const uploadVideo = async ({
                               postData,
                               setUploadProgress
                           }: {
    postData: PostUpload;
    setUploadProgress: (progress: number) => void;
}) => {
    const formData = new FormData();
    const signatureRes = await getSignature();

    formData.append("file", postData.file);
    formData.append("api_key", signatureRes.api_key);
    formData.append("timestamp", signatureRes.timestamp);
    formData.append("signature", signatureRes.signature);
    formData.append("folder", signatureRes.folder);

    const cloudinaryProgress = (progressEvent : AxiosProgressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 80) / (progressEvent.total ?? 100));
        setUploadProgress(percentCompleted);
    };

    const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload`,
        formData,
        {
            onUploadProgress: cloudinaryProgress,
        }
    );

    if (response.status !== 200) {
        throw new Error("Failed to upload video");
    }

    const asset: AssetStore = {
        publicId: response.data.public_id,
        resourceType: response.data.resource_type,
        format: response.data.format,
        secureUrl: response.data.secure_url,
        bytes: response.data.bytes,
        width: response.data.width,
        height: response.data.height,
        originalFilename: response.data.original_filename,
    };

    setUploadProgress(90)
    await createPost(postData, asset);

    return response.data;
};

const getSignature = async (): Promise<UploadSignature> => {
    const accessToken = await getAccessToken();

    const res = await apiRequest<UploadSignature>({
            url: `${process.env.NEXT_PUBLIC_API_URL}/api/storage/signature`,
            method: "POST",
            data: {},
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );

    return res.data;
};


const createPost = async (postData: PostUpload, videoAsset: AssetStore) => {
    const accessToken = await getAccessToken();

    return apiRequest({
        url: '/posts',
        method: "POST",
        data: {
            caption: postData.title,
            description: postData.description,
            visibility: postData.visibility,
            duration: postData.duration,
            category: postData.category,
            allowComments: postData.allowComments,
            ageRestricted: postData.ageRestricted,
            videoAsset: videoAsset,
        },
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
}

export default uploadVideo;
