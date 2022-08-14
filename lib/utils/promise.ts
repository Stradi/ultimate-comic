const handle = <T, U = Error>(
  promise: Promise<T>
): Promise<[U, undefined] | [null, T]> => {
  return promise
    .then<[null, T]>((data: T) => [null, data])
    .catch<[U, undefined]>(async (err: U) => {
      //TODO: Add more lightweight error reporting
      return [err, undefined];
    });
};

export { handle };
