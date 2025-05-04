import {UUID} from "node:crypto";

export interface User {
    id: UUID;
    displayName: string;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    gender: 'MALE' | 'FEMALE' | 'OTHER';
    phoneNumber: string;
    dateOfBirth: Date;
    profileImage: string;
    coverImage: string;
    bio: string;
    country: string;
    city: string;
    createdAt: string;
    updatedAt: string;
}

export type UserSummary = Pick<User, 'id' | 'displayName' | 'username' | 'profileImage' | 'coverImage' | 'createdAt'>;

export type UserIntroduction = Pick<User, 'displayName' | 'firstName' | 'lastName' | 'username' | 'profileImage' | 'coverImage' | 'bio' | 'email' | 'createdAt'>;

export type UserProfileInformationUpdate = Partial<Omit<User, 'id' | 'username' | 'email' | 'coverImage' | 'profileImage'>>

export type UserProfileIdentification = Partial<Pick<User, 'email' | 'username'> & { password: string }>