// @/types/models.types.ts

import { Gender, Role } from "@/constants";
import { AccountStatus } from "@/constants/account-status.constant";

export interface User {
    id: number;
    name: string;
    email: string;
    role: Role;
    gender: Gender;
    balance: number;
    phone: string;
    address?: string;
    avatar?: string;
    createdAt: string;
    createdBy: string;
    updatedAt?: string;
    updatedBy?: string;
    isVerified: boolean;

    status: AccountStatus;
}