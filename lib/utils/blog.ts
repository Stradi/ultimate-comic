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

const getBlogPostBySlug = async (slug: string) => {
  const [error, data] = await handle(
    fetchCMS(`blog-posts?filters[slug][$eq]=${slug}&populate=seo`)
  );
  if (error) return Promise.reject(error);

  const postData = data[0].attributes;

  const returnData: BlogPost = {
    title: postData.title,
    slug: postData.slug,
    content: postData.content,
    coverImage: postData.coverImage || null,
    seo: {
      description: postData.seo.description,
    },
  };

  return returnData;
};

export { getBlogPostBySlug };
