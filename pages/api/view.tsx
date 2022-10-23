import { NextApiRequest, NextApiResponse } from 'next';
import { apiHandler, parseQuery } from '~/lib/utils/api';
import { ApiError } from '~/lib/utils/error';

const handlePost = async (req: NextApiRequest, res: NextApiResponse) => {
  if (process.env.NODE_ENV === 'development') {
    return res.status(200).json({ msg: 'done' });
  }

  const postData = parseQuery(req.body, ['issueId']);
  if (!postData.issueId)
    return Promise.reject(
      new ApiError(
        400,
        'Insufficent parameters.',
        "To use this route you need to send 'issueId'. The request you sent does not have a 'issueId' parameter.",
        "Include 'issueId' parameter while sending the request."
      )
    );

  // const issueId = postData.issueId as string;
  // TODO

  return res.status(200).json({ data: null });
};

const handler = apiHandler({
  POST: handlePost,
});

export default handler;
