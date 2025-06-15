export interface Grievance {
  id: string;
  issue_id: string;
  campus: string;
  subject: string;
  description: string;
  issue_type: string;
  attachment: boolean;
  date_time: number;
  status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
}
