export interface Grievance {
  id: string;
  issue_id: string;
  rollno: string;
  campus: string;
  subject: string;
  description: string;
  issue_type: string;
  attachment: boolean;
  date_time: Date;
  status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
}
// rn