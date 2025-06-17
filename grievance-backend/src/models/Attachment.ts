export interface Attachment {
  id: string;
  issuse_id: string;
  uploaded_by: string;
  file_path: string;
  file_name: string;
  mime_type: string; // e.g., 'image/png', 'application/pdf'
  file_size: number; // in bytes
  uploaded_at: Date;
}
