import { NextApiRequest, NextApiResponse } from 'next';
import { apiHandler, parseQuery } from '~/lib/utils/api';
import { getSitemap } from '~/lib/utils/sitemap';

const handleGET = async (req: NextApiRequest, res: NextApiResponse) => {
  const query = parseQuery(req.query, ['index']);
  if (!query.index) {
    // sitemap.xml
    const content = await getSitemap();
    return res.setHeader('Content-Type', 'text/xml').send(content);
  } else {
    // sitemap-[index].xml
    const content = await getSitemap(Number.parseInt(query.index as string));
    return res.setHeader('Content-Type', 'text/xml').send(content);
  }
};

const handler = apiHandler({
  GET: handleGET,
});

export default handler;
