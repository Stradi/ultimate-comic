import * as mysql from 'mysql2/promise';
import path from 'path';
import { getFileContent } from '../utils/fs';

interface MySQLGlobal {
  connection: mysql.Connection;
}

declare const global: MySQLGlobal;

const isConnected = async (connection: mysql.Connection) => {
  try {
    await connection.ping();
    return true;
  } catch (e: unknown) {
    return false;
  }
};

const getConnection = async () => {
  if (global.connection && (await isConnected(global.connection))) {
    return global.connection;
  }

  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  const certificateContent = await getFileContent(
    path.join(process.cwd(), 'certs', 'cacert.pem')
  );

  connection.config.ssl = {
    ca: certificateContent.toString(),
  };

  await connection.connect();

  global.connection = connection;

  return connection;
};

export { getConnection };
