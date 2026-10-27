// @/constants/account-status.constant.ts

export const ACCOUNT_STATUS_VALUES = [
    'ACTIVE',
    'BANNED',
    'DELETED',
] as const;

export type AccountStatus = (typeof ACCOUNT_STATUS_VALUES)[number];

// Map hiển thị tiếng Việt
export const ACCOUNT_STATUS_LABEL: Record<AccountStatus, string> = {
    ACTIVE: 'Đang hoạt động',
    BANNED: 'Bị khóa',
    DELETED: 'Đã xóa',
};

// Options cho Form Select
export const ACCOUNT_STATUS_OPTIONS = ACCOUNT_STATUS_VALUES.map((value) => ({
    value,
    label: ACCOUNT_STATUS_LABEL[value],
}));

// Màu hiển thị trạng thái
export const ACCOUNT_STATUS_COLOR: Record<AccountStatus, string> = {
    ACTIVE: '#52c41a',
    BANNED: '#f5222d',
    DELETED: '#8c8c8c',
};

export const ACCOUNT_STATUS = {
    ACTIVE: 'ACTIVE',
    BANNED: 'BANNED',
    DELETED: 'DELETED',
} as const;