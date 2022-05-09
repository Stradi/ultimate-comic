import rehypeStringify from 'rehype-stringify';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';
import { BaseError } from './error';
import { handle } from './promise';

const fetchCMS = async (path: string) => {
  const [error, data] = await handle(
    fetch(`${process.env.STRAPI_URL}/api/${path}`, {
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_AUTH_TOKEN}`,
      },
    })
  );

  if (error) {
    return Promise.reject(
      new BaseError('strapi', error.message, error.stack as string, 'Wait')
    );
  }

  const jsonData = await data.json();

  if (jsonData.error) {
    return Promise.reject(
      new BaseError(
        'strapi',
        'An error occured in Strapi side.',
        jsonData.error,
        'Wait'
      )
    );
  }

  return jsonData.data;
};

const getAllPosts = async () => {
  const [error, data] = await handle(
    fetchCMS(`blog-posts?populate=seo&sort=publishedAt:desc`)
  );
  if (error) return Promise.reject(error);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data.map((post: any) => ({
    title: post.attributes.title,
    slug: post.attributes.slug,
    coverImage: post.attributes.coverImage || null,
    content: post.attributes.content,
    seo: {
      description: post.attributes.seo.description,
    },
    publishedAt: new Date(post.attributes.publishedAt),
    updatedAt: new Date(post.attributes.updatedAt),
  })) as BlogPost[];
};

const getBlogPostBySlug = async (slug: string) => {
  const [error, data] = await handle(
    fetchCMS(`blog-posts?filters[slug][$eq]=${slug}&populate=seo`)
  );
  if (error) return Promise.reject(error);

  const postData = data[0].attributes;

  const [conversionError, htmlContent] = await handle(
    convertMarkdownToHtml(postData.content)
  );
  if (conversionError) return Promise.reject(conversionError);

  const returnData: BlogPost = {
    title: postData.title,
    slug: postData.slug,
    content: htmlContent,
    coverImage: postData.coverImage || null,
    seo: {
      description: postData.seo.description,
    },
    publishedAt: new Date(postData.publishedAt),
    updatedAt: new Date(postData.updatedAt),
  };

  return returnData;
};

const getStaticPageBySlug = async (slug: string) => {
  const [error, data] = await handle(
    fetchCMS(`static-pages?filters[slug][$eq]=${slug}&populate=seo`)
  );

  if (error) return Promise.reject(error);

  const staticPageData = data[0].attributes;

  const [conversionError, htmlContent] = await handle(
    convertMarkdownToHtml(staticPageData.content)
  );
  if (conversionError) return Promise.reject(conversionError);

  const returnData: StaticPage = {
    title: staticPageData.title,
    slug: staticPageData.slug,
    content: htmlContent,
    publishedAt: new Date(staticPageData.publishedAt),
    updatedAt: new Date(staticPageData.updatedAt),
  };

  return returnData;
};

const convertMarkdownToHtml = async (content: string) => {
  const [error, html] = await handle(
    unified()
      .use(remarkParse)
      .use(remarkRehype)
      .use(rehypeStringify)
      .process(content)
  );

  if (error) {
    return Promise.reject(
      new BaseError(
        'Remark',
        'Error converting Markdown content to HTML.',
        error.message,
        'Wait'
      )
    );
  }

  return String(html);
};

export {
  getBlogPostBySlug,
  getAllPosts,
  getStaticPageBySlug,
  convertMarkdownToHtml,
};
