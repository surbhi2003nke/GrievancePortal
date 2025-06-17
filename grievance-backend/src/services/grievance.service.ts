import { db } from '../db/queries';
import { GrievanceCrudQueries, AdvancedQueries, ValidationQueries } from '../db/queries';
import { HistoryQueries } from '../db/queries';

export async function createGrievance(data: {
  campus: string;
  issue_id: string;
  subject: string;
  description: string;
  issue_type: string;
  attachment: boolean;
  date_time: number;
  status: string;
}) {
  const values = [
    data.campus,
    data.issue_id,
    data.subject,
    data.description,
    data.issue_type,
    data.attachment,
    data.date_time,
    data.status
  ];

  const result = await db.query(GrievanceCrudQueries.CREATE, values);
  return result.rows[0];
}

export async function getGrievanceById(id: string) {
  const result = await db.query(GrievanceCrudQueries.GET_BY_ID, [id]);
  return result.rows[0];
}

export async function getAllGrievances() {
  const result = await db.query(GrievanceCrudQueries.GET_ALL);
  return result.rows;
}

export async function updateGrievance(id: string, fieldsToUpdate: Record<string, any>) {
  const fields = Object.keys(fieldsToUpdate);
  const values = Object.values(fieldsToUpdate);

  const query = GrievanceCrudQueries.UPDATE(fields);
  const result = await db.query(query, [id, ...values, Date.now()]);
  return result.rows[0];
}

export async function deleteGrievance(id: string) {
  const result = await db.query(GrievanceCrudQueries.DELETE, [id]);
  return result.rows[0];
}

export async function getGrievanceWithResponses(id: string) {
  const result = await db.query(AdvancedQueries.GET_GRIEVANCE_WITH_RESPONSES, [id]);
  return result.rows[0];
}

export async function grievanceExists(id: string) {
  const result = await db.query(ValidationQueries.GRIEVANCE_EXISTS, [id]);
  return result.rows[0].exists;
}
