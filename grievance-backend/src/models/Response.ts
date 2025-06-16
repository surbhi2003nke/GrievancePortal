export interface Response {
    id: string;
    issuse_id: string; // Reference to the grievance this response is associated with
    status: 'PENDING' | 'RESOLVED' | 'REJECTED'; // Status of the response
    stage: 'INITIAL' | 'FOLLOW_UP' | 'FINAL'; // Stage of the response
    date_time: Date;
    response_text: string; // The text of the response
    response_by: string; // User ID of the person who provided the response
    response_at: Date; // Timestamp when the response was made
    attachments?: string[]; // Array of attachment IDs related to this response
    redirect?: string; 
}