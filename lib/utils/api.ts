import { NextApiRequest, NextApiResponse } from 'next';

type HandlerObject = {
  [key: string]: (req: NextApiRequest, res: NextApiResponse) => Promise<void>;
};

const apiHandler = (handler: HandlerObject) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const method = req.method as string;
    if (!handler[method]) {
      return res.status(405).end(`Method ${req.method} not allowed`);
    }

    try {
      await handler[method](req, res);
    } catch (e: unknown) {
      // Run error handler middleware here
      return res.status(500).end(`oopsie woopsie`);
    }
  };
};

const parseQuery = <T, U extends keyof T>(query: T, keys: U[]): Pick<T, U> => {
  const ret: Pick<T, U> = {} as Pick<T, U>;
  keys.forEach((key) => {
    ret[key] = query[key];
  });

  return ret;
};

export { apiHandler, parseQuery };
