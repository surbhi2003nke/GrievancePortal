import { Pool } from 'pg';

// Initialize PostgreSQL connection pool
export const db = new Pool();

// Grievance CRUD Queries
export const GrievanceCrudQueries = {
  GET_ALL: `SELECT * FROM grievance ORDER BY date_time DESC`,
  GET_BY_ID: `SELECT * FROM grievance WHERE id = $1`,
  CREATE: `
    INSERT INTO grievance (
      campus, issue_id, subject, description,
      issue_type, attachment, date_time, status
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8
    ) RETURNING *
  `,
  UPDATE: (fields: string[]) => `
    UPDATE grievance SET
      ${fields.map((f, i) => `${f} = $${i + 2}`).join(",\n      ")},
      date_time = $${fields.length + 2}
    WHERE id = $1 RETURNING *
  `,
  DELETE: `DELETE FROM grievance WHERE id = $1 RETURNING *`,
  
  // Additional Grievance Queries
  GET_BY_STATUS: `SELECT * FROM grievance WHERE status = $1 ORDER BY date_time DESC`,
  GET_BY_CAMPUS: `SELECT * FROM grievance WHERE campus = $1 ORDER BY date_time DESC`,
  GET_BY_ISSUE_TYPE: `SELECT * FROM grievance WHERE issue_type = $1 ORDER BY date_time DESC`
};

// Response CRUD Queries
export const ResponseCrudQueries = {
  GET_ALL: `SELECT * FROM response ORDER BY date_time DESC`,
  GET_BY_GRIEVANCE_ID: `SELECT * FROM response WHERE grievance_id = $1 ORDER BY date_time DESC`,
  CREATE: `
    INSERT INTO response (
      grievance_id, note, status, stage,
      date_time, current_status, redirect
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7
    ) RETURNING *
  `,
  UPDATE: (fields: string[]) => `
    UPDATE response SET
      ${fields.map((f, i) => `${f} = $${i + 2}`).join(",\n      ")},
      date_time = $${fields.length + 2}
    WHERE id = $1 RETURNING *
  `,
  DELETE: `DELETE FROM response WHERE id = $1 RETURNING *`
};

// Advanced Queries
export const AdvancedQueries = {
  // Get grievance with all its responses
  GET_GRIEVANCE_WITH_RESPONSES: `
    SELECT 
      g.*,
      json_agg(r.* ORDER BY r.date_time DESC) as responses
    FROM grievance g
    LEFT JOIN response r ON g.id = r.grievance_id
    WHERE g.id = $1
    GROUP BY g.id
  `,

  // Get grievance statistics
  GET_GRIEVANCE_STATS: `
    SELECT 
      COUNT(*) as total_grievances,
      COUNT(CASE WHEN status = 'PENDING' THEN 1 END) as pending_grievances,
      COUNT(CASE WHEN status = 'RESOLVED' THEN 1 END) as resolved_grievances,
      COUNT(CASE WHEN status = 'IN_PROGRESS' THEN 1 END) as in_progress_grievances
    FROM grievance
  `,

  // Get campus-wise statistics
  GET_CAMPUS_STATS: `
    SELECT 
      campus,
      COUNT(*) as total_grievances,
      COUNT(CASE WHEN status = 'RESOLVED' THEN 1 END) as resolved_count,
      AVG(CASE WHEN status = 'RESOLVED' 
          THEN (SELECT MAX(date_time) FROM response WHERE grievance_id = grievance.id) - grievance.date_time 
          END)::integer as avg_resolution_time
    FROM grievance
    GROUP BY campus
  `
};

// Validation Queries
export const ValidationQueries = {
  // Check if grievance exists
  GRIEVANCE_EXISTS: `
    SELECT EXISTS(SELECT 1 FROM grievance WHERE id = $1) as exists
  `,

  // Check if response exists
  RESPONSE_EXISTS: `
    SELECT EXISTS(SELECT 1 FROM response WHERE id = $1) as exists
  `,

  // Validate status transitions
  VALIDATE_STATUS_TRANSITION: `
    SELECT 
      g.status as current_status,
      EXISTS(
        SELECT 1 FROM response 
        WHERE grievance_id = g.id 
        AND date_time > $2
      ) as has_newer_responses
    FROM grievance g
    WHERE g.id = $1
  `
};

// History Tracking Queries
export const HistoryQueries = {
  // Insert history record
  CREATE_HISTORY: `
    INSERT INTO grievance_history (
      grievance_id, from_status, to_status,
      action_by, action_type, note, date_time
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7
    ) RETURNING *
  `,

  // Get history for a grievance
  GET_GRIEVANCE_HISTORY: `
    SELECT * FROM grievance_history
    WHERE grievance_id = $1
    ORDER BY date_time DESC
  `,

  // Get recent actions
  GET_RECENT_ACTIONS: `
    SELECT 
      gh.*,
      g.subject as grievance_subject
    FROM grievance_history gh
    JOIN grievance g ON gh.grievance_id = g.id
    ORDER BY gh.date_time DESC
    LIMIT $1
  `
};

// Attachment Queries
export const AttachmentQueries = {
  ADD_ATTACHMENT: `
    UPDATE grievance
    SET attachment = true
    WHERE id = $1
    RETURNING *
  `,

  REMOVE_ATTACHMENT: `
    UPDATE grievance
    SET attachment = false
    WHERE id = $1
    RETURNING *
  `
};

// Analytics Queries
export const AnalyticsQueries = {
  // Get resolution time statistics
  GET_RESOLUTION_STATS: `
    SELECT 
      issue_type,
      COUNT(*) as total_count,
      AVG(CASE WHEN status = 'RESOLVED' 
          THEN (SELECT MAX(date_time) FROM response WHERE grievance_id = grievance.id) - date_time 
          END)::integer as avg_resolution_time
    FROM grievance
    GROUP BY issue_type
  `,

  // Get monthly trends
  GET_MONTHLY_TRENDS: `
    SELECT 
      DATE_TRUNC('month', to_timestamp(date_time)) as month,
      COUNT(*) as grievance_count,
      COUNT(CASE WHEN status = 'RESOLVED' THEN 1 END) as resolved_count
    FROM grievance
    GROUP BY month
    ORDER BY month DESC
  `
};