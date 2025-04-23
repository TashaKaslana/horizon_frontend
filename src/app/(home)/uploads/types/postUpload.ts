export type PostUpload = {
    title: string;
    description?: string;
    visibility: string;
    category: string;
    duration: number;
    allowComments: boolean;
    ageRestricted: boolean;
    file: File;
}