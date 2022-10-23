import { RowDataPacket } from 'mysql2/promise';
import { getConnection } from './mysql';

const runSQL = async <T extends RowDataPacket>(sql: string): Promise<T[]> => {
  const connection = await getConnection();
  const result = await connection.query<T[]>(sql);

  return result[0];
};

const getComicCount = async (): Promise<number> => {
  const connection = await getConnection();
  const result = await connection.query<RowDataPacket[]>(
    'SELECT COUNT(*) as count FROM comic'
  );

  return result[0][0].count;
};

const getIssueCount = async (): Promise<number> => {
  const connection = await getConnection();
  const result = await connection.query<RowDataPacket[]>(
    'SELECT COUNT(*) as count FROM issue'
  );

  return result[0][0].count;
};

export { runSQL, getComicCount, getIssueCount };
