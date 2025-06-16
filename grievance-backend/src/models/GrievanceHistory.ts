export interface GrievanceHistory {
  id: string;
  issue_id: string;
  from_status: string;
  to_status: string;
  action_by: string;
  stage_type: 'RAISED' | 'FORWARDED' | 'STATUS_UPDATED' | 'CLOSED';
  note?: string;
  date_time: Date;
}
