import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase, getIssueById } from '~/lib/database';
import { IComicDocument, IIssueDocument } from '~/lib/database/models';
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
    getIssueById(issueId, 'comic viewCount', [
      {
        fieldName: 'comic',
        fields: 'totalViews',
      },
    ])
  );
  if (getIssueError) return Promise.reject(getIssueError);

  if (isNaN(issueData.viewCount)) {
    issueData.viewCount = 1;
  } else {
    issueData.viewCount++;
  }

  const comic = issueData.comic as IComicDocument;

  if (isNaN(comic.totalViews)) {
    comic.totalViews = 1;
  } else {
    comic.totalViews++;
  }

  const [issueSaveError] = await handle<IIssueDocument>(issueData.save());
  if (issueSaveError) return Promise.reject(issueSaveError);

  const [comicSaveError] = await handle<IComicDocument>(comic.save());
  if (comicSaveError) return Promise.reject(comicSaveError);

  return res.status(200).json({ data: issueData });
};

const handler = apiHandler({
  POST: handlePost,
});

export default handler;
