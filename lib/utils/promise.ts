import * as Sentry from '@sentry/nextjs';

const handle = <T, U = Error>(
  promise: Promise<T>
): Promise<[U, undefined] | [null, T]> => {
  return promise
    .then<[null, T]>((data: T) => [null, data])
    .catch<[U, undefined]>(async (err: U) => {
      await Sentry.captureException(err);
      return [err, undefined];
    });
};

export { handle };
