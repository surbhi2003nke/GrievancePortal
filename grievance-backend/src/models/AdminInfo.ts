export interface AdminInfo{
    id?: number;
    Adminid?: number;
    name: string;
    email: string;
    phone?: string;
    password?: string;
    isverified?: boolean;
    IsActive: boolean;
    LastLogin?: Date;
    createdat?: Date;
    updatedat?: Date;
    role?: 'ADMIN' | 'SUPER_ADMIN';
    permissions?: string[]; // Array of permission strings
}
