import {getAccessToken} from "@auth0/nextjs-auth0";
import {apiRequest} from "@/lib/apiRequest";
import axios, {AxiosProgressEvent} from "axios";

type UploadSignature = {
    signature: string;
    timestamp: string;
    api_key: string;
    folder: string;
};

export const getSignature = async (): Promise<UploadSignature> => {
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

export const uploadToCloudinary = async ({
                                             file,
                                             setProgress,
                                         }: {
    file: File;
    setProgress: (progress: number) => void;
}) => {
    const formData = new FormData();
    const signatureRes = await getSignature();

    formData.append("file", file);
    formData.append("api_key", signatureRes.api_key);
    formData.append("timestamp", signatureRes.timestamp);
    formData.append("signature", signatureRes.signature);
    formData.append("folder", signatureRes.folder);

    const cloudinaryProgress = (event: AxiosProgressEvent) => {
        const percentCompleted = Math.round((event.loaded * 80) / (event.total ?? 100));
        setProgress(percentCompleted);
    };

    const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload`,
        formData,
        { onUploadProgress: cloudinaryProgress }
    );

    if (response.status !== 200) {
        throw new Error("Failed to upload video");
    }

    return {
        publicId: response.data.public_id,
        resourceType: response.data.resource_type,
        format: response.data.format,
        secureUrl: response.data.secure_url,
        bytes: response.data.bytes,
        width: response.data.width,
        height: response.data.height,
        originalFilename: response.data.original_filename,
    };
};