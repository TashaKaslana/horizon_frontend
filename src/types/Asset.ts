export interface AssetSummary {
    id: string
    publicId: string;
    resourceType: string;
    format: string;
    bytes: number;
    width: number;
    height: number;
    originalFilename: string;
    createdAt: string;
    createdBy: string;
}

export type CreateAsset = Omit<AssetSummary, 'id' | 'createdBy' | 'createdAt'>;