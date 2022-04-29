import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase, getIssueById } from '~/lib/database';
import { IIssueDocument } from '~/lib/database/models';
import { apiHandler, parseQuery } from '~/lib/utils/api';
import { isValidObjectID } from '~/lib/utils/database';
import { ApiError } from '~/lib/utils/error';
import { handle } from '~/lib/utils/promise';

const handlePost = async (req: NextApiRequest, res: NextApiResponse) => {
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

  const issueId = postData.issueId as string;
  const isObjectId = isValidObjectID(issueId);
  if (!isObjectId) {
    return Promise.reject(
      new ApiError(
        400,
        'Not a valid ID.',
        `${issueId} is not a valid ID.`,
        'Enter a valid ID parameter while sending the request.'
      )
    );
  }

  await connectToDatabase();
  const [getIssueError, issueData] = await handle<IIssueDocument>(
    getIssueById(issueId)
  );
  if (getIssueError) return Promise.reject(getIssueError);

  if (isNaN(issueData.viewCount)) {
    issueData.viewCount = 1;
  } else {
    issueData.viewCount++;
  }

  const [saveError, saveData] = await handle<IIssueDocument>(issueData.save());
  if (saveError) return Promise.reject(saveError);

  return res.status(200).json({ data: saveData });
};

const handler = apiHandler({
  POST: handlePost,
});

export default handler;
