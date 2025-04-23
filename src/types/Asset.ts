import {UUID} from "node:crypto";

export interface AssetSummary {
    id: UUID
    publicId: string;
    resourceType: string;
    format: string;
    secureUrl: string;
    bytes: number;
    width: number;
    height: number;
    originalFilename: string;
    createdAt: Date;
    createdBy: UUID;
}

export type CreateAsset = Omit<AssetSummary, 'id' | 'createdBy' | 'createdAt'>;