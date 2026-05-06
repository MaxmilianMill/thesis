import { ObjectId } from 'mongodb';
import { saveAcitivtyLog } from '../../repository/logger/logger-repository.js';

export interface ActivityLog {
  _id?: ObjectId;
  uid: string;
  action: string;
  status: 'success' | 'error' | 'warning'; 
  message?: string;
  relatedIds?: Record<string, string>;
  createdAt: Date;                
}

/**
 * Logs a user activity to the db.
 * @param data 
 */
export async function log(data: Omit<ActivityLog, '_id' | 'createdAt'>): Promise<void> {
  try {
    const logEntry: ActivityLog = {
      ...data,
      createdAt: new Date(),
    };

    saveAcitivtyLog(logEntry);

  } catch (error) {
    console.error('Failed to format log entry:', error);
  }
}