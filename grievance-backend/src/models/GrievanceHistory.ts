export interface GrievanceHistory {
  id: string;
  grievance_id: string;
  from_status: string;
  to_status: string;
  action_by: string;
  action_type: 'RAISED' | 'FORWARDED' | 'STATUS_UPDATED' | 'CLOSED';
  note?: string;
  date_time: number;
}
