import path from 'path';

import fs from 'fs-extra';
import matter from 'gray-matter';
import { remarkNextImage } from '../remark/remark-next-image';

import { serialize } from 'next-mdx-remote/serialize';

import rehypeSlug from 'rehype-slug';
import remarkToc from 'remark-toc';
import { BaseError } from './error';
import { getAllFilesInDirectory, getFileContent } from './fs';
import { handle } from './promise';

const BLOG_DIRECTORY = path.join(process.cwd(), '_blog');
const STATIC_PAGES_DIRECTORY = path.join(BLOG_DIRECTORY, 'staticPages');
const GUIDE_PAGES_DIRECTORY = path.join(BLOG_DIRECTORY, 'guides');

const PUBLIC_IMAGES_PATH = path.join(process.cwd(), 'public', 'images');

const getAllStaticPages = async () => {
  const [error, allStaticPagesDirectory] = await handle(
    getAllFilesInDirectory(STATIC_PAGES_DIRECTORY)
  );
  if (error) return Promise.reject(error);

  const mdContents = allStaticPagesDirectory.flatMap((slug) =>
    matter(
      fs.readFileSync(path.join(STATIC_PAGES_DIRECTORY, slug, 'index.mdx'))
    )
  );

  return mdContents.map((content) => ({
    title: content.data.title,
    slug: content.data.slug,
    content: content.data.content,
    publishedAt: new Date(content.data.publishedAt),
    updatedAt: new Date(content.data.updatedAt),
  })) as StaticPage[];
};

const getStaticPageBySlug = async (slug: string) => {
  const [error, fileContents] = await handle(
    getFileContent(path.join(STATIC_PAGES_DIRECTORY, slug, 'index.mdx'))
  );
  if (error) return Promise.reject(error);

  moveImagesToPublicFolder(slug, 'staticpage');

  const mdContent = matter(fileContents);

  const [conversionError, mdx] = await handle(
    convertMdxToHtml(mdContent.content, 'staticpage', mdContent.data.slug)
  );
  if (conversionError) return Promise.reject(conversionError);

  return {
    title: mdContent.data.title,
    slug: mdContent.data.slug,
    content: mdx,
    publishedAt: new Date(mdContent.data.publishedAt),
    updatedAt: new Date(mdContent.data.updatedAt),
  } as StaticPage;
};

const getAllGuides = async () => {
  const [error, guidePagesDirectory] = await handle(
    getAllFilesInDirectory(GUIDE_PAGES_DIRECTORY)
  );
  if (error) return Promise.reject(error);

  const mdContents = guidePagesDirectory.flatMap((slug) =>
    matter(fs.readFileSync(path.join(GUIDE_PAGES_DIRECTORY, slug, 'index.mdx')))
  );

  return mdContents.map((content) => ({
    title: content.data.title,
    slug: content.data.slug,
    content: content.data.content,
    coverImage: content.data.coverImage,
    seo: {
      description: content.data.seoDescription,
    },
    excerpt: content.data.excerpt,
    publishedAt: new Date(content.data.publishedAt),
    updatedAt: new Date(content.data.updatedAt),
    metadata: content.data.metadata,
  })) as GuidePage[];
};

const getGuideBySlug = async (slug: string) => {
  const [error, fileContents] = await handle(
    getFileContent(path.join(GUIDE_PAGES_DIRECTORY, slug, 'index.mdx'))
  );
  if (error) return Promise.reject(error);

  moveImagesToPublicFolder(slug, 'guide');

  const mdContent = matter(fileContents);

  const [conversionError, mdx] = await handle(
    convertMdxToHtml(mdContent.content, 'guide', mdContent.data.slug)
  );
  if (conversionError) return Promise.reject(conversionError);

  return {
    title: mdContent.data.title,
    slug: mdContent.data.slug,
    content: mdx,
    coverImage: mdContent.data.coverImage,
    seo: {
      description: mdContent.data.seoDescription,
    },
    excerpt: mdContent.data.excerpt,
    publishedAt: new Date(mdContent.data.publishedAt),
    updatedAt: new Date(mdContent.data.updatedAt),
    metadata: mdContent.data.metadata,
  } as GuidePage;
};

const convertMdxToHtml = async (
  content: string,
  type: 'staticpage' | 'guide',
  slug: string
) => {
  const [error, html] = await handle(
    serialize(content, {
      mdxOptions: {
        remarkPlugins: [
          [
            remarkNextImage,
            {
              publicPath: `/images/${type}/${slug}`,
            },
          ],
          remarkToc,
        ],
        rehypePlugins: [rehypeSlug],
      },
      parseFrontmatter: false,
    })
  );

  if (error) {
    return Promise.reject(
      new BaseError(
        'MDX',
        'Error converting MDX content to HTML',
        error.message,
        'Wait'
      )
    );
  }

  return html;
};

const moveImagesToPublicFolder = (
  slug: string,
  type: 'staticpage' | 'guide'
) => {
  const directory = path.join(
    type === 'staticpage' ? STATIC_PAGES_DIRECTORY : GUIDE_PAGES_DIRECTORY,
    slug,
    'images'
  );

  fs.ensureDirSync(directory);

  const images = fs.readdirSync(directory);
  images.forEach((name) => {
    fs.copySync(
      path.join(directory, name),
      path.join(PUBLIC_IMAGES_PATH, type, slug, name),
      {
        overwrite: true,
        recursive: true,
      }
    );
  });
};

export {
  getStaticPageBySlug,
  getAllStaticPages,
  getGuideBySlug,
  getAllGuides,
  convertMdxToHtml,
  moveImagesToPublicFolder,
};
