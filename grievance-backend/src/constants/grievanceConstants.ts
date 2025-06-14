export const STATUS = ['PENDING', 'IN_PROGRESS', 'RESOLVED', 'REJECTED', 'CLOSED'] as const;
export type Status = typeof STATUS[number];

export const PRIORITY = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as const;
export type Priority = typeof PRIORITY[number];