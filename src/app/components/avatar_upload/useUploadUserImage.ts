import {useMutation, useQueryClient} from '@tanstack/react-query';
import {uploadToCloudinary} from "@/api/uploadApi";
import {updateUserImage} from "@/api/userApi";

type UploadType = 'profileImage' | 'coverPhoto';

interface UploadParams {
    file: File;
    type: UploadType;
    setProgress: (progress: number) => void;
}

export const useUploadUserImage = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({file, type, setProgress}: UploadParams) => {
            const uploadResult = await uploadToCloudinary({
                file,
                setProgress,
            });

            const imageUrl = uploadResult.secureUrl;

            if (type === 'profileImage') {
                return await updateUserImage({profileImage: imageUrl});
            } else {
                return await updateUserImage({coverImage: imageUrl});
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['currentUser']}).then();
        },
        onError: (error) => {
            console.error('Image upload or update failed:', error);
        },
    });
};
