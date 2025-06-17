import { db } from '../db/queries';
import { HistoryQueries } from '../db/queries';

export async function createHistory(data: {
  grievance_id: string;
  from_status: string;
  to_status: string;
  action_by: string;
  action_type: string;
  note: string;
  date_time: number;
}) {
  const values = [
    data.grievance_id,
    data.from_status,
    data.to_status,
    data.action_by,
    data.action_type,
    data.note,
    data.date_time
  ];

  const result = await db.query(HistoryQueries.CREATE_HISTORY, values);
  return result.rows[0];
}

export async function getGrievanceHistory(grievance_id: string) {
  const result = await db.query(HistoryQueries.GET_GRIEVANCE_HISTORY, [grievance_id]);
  return result.rows;
}

export async function getRecentActions(limit = 10) {
  const result = await db.query(HistoryQueries.GET_RECENT_ACTIONS, [limit]);
  return result.rows;
}
