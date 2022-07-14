import { PathLike } from 'fs';
import { mkdir, readdir, readFile, unlink, writeFile } from 'fs/promises';
import path from 'path';
import { BaseError } from './error';
import { handle } from './promise';

const createDirectoryIfNotExits = async (dir: PathLike) => {
  const [dirError] = await handle(mkdir(dir, { recursive: true }));
  if (dirError) {
    return Promise.reject(
      new BaseError('fs', dirError.name, dirError.message, 'Wait')
    );
  }
};

const deleteAllFilesFromDirectory = async (dir: PathLike) => {
  const [readDirError, files] = await handle(readdir(dir));
  if (readDirError) {
    return Promise.reject(
      new BaseError('fs', readDirError.name, readDirError.message, 'Wait')
    );
  }

  for (const file of files) {
    const [unlinkError] = await handle(unlink(path.join(dir as string, file)));
    if (unlinkError) {
      return Promise.reject(
        new BaseError('fs', unlinkError.name, unlinkError.message, 'Wait')
      );
    }
  }
};

const writeToFile = async (path: PathLike, content: string) => {
  const [error] = await handle(writeFile(path, content));
  if (error) {
    return Promise.reject(
      new BaseError('fs', error.name, error.message, 'Wait')
    );
  }

  return Promise.resolve();
};

const getFileContent = async (filePath: PathLike) => {
  const [error, content] = await handle(readFile(filePath));
  if (error) {
    return Promise.reject(
      new BaseError('fs', error.name, error.message, 'Wait')
    );
  }

  return Promise.resolve(content);
};

const getAllFilesInDirectory = async (filePath: PathLike) => {
  const [error, files] = await handle(readdir(filePath));
  if (error) {
    return Promise.reject(
      new BaseError('fs', error.name, error.message, 'Wait')
    );
  }

  return Promise.resolve(files);
};

export {
  createDirectoryIfNotExits,
  deleteAllFilesFromDirectory,
  writeToFile,
  getFileContent,
  getAllFilesInDirectory,
};
