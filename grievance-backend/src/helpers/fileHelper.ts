import path from 'path';
import fs from 'fs';

export function sanitizeFilename(originalName: string): string {
  return originalName.replace(/[^a-z0-9.\-_]/gi, '_');
}

export function generateFilePath(originalName: string): string {
  const safeName = sanitizeFilename(originalName);
  const dateFolder = new Date().toISOString().split('T')[0]; // e.g., 2025-06-14
  const dir = path.join('uploads', 'attachments', dateFolder);
  fs.mkdirSync(dir, { recursive: true });
  const finalPath = path.join(dir, `${Date.now()}-${safeName}`);
  return finalPath;
}
