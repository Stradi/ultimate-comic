import fs from 'fs';
import path from 'path';

import matter from 'gray-matter';
import rehypeStringify from 'rehype-stringify';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';

import { BaseError } from './error';
import { handle } from './promise';

const BLOG_DIRECTORY = path.join(process.cwd(), '_blog');
const POSTS_DIRECTORY = path.join(BLOG_DIRECTORY, 'posts');
const STATIC_PAGES_DIRECTORY = path.join(BLOG_DIRECTORY, 'staticPages');

const getAllPosts = async () => {
  const allPostsDirectory = fs.readdirSync(POSTS_DIRECTORY);
  const mdContents = allPostsDirectory.flatMap((slug) =>
    matter(fs.readFileSync(path.join(POSTS_DIRECTORY, slug, 'index.md')))
  );

  return mdContents.map((content) => ({
    title: content.data.title,
    slug: content.data.slug,
    coverImage: content.data.coverImage || null,
    content: content.content,
    seo: {
      description: content.data.seoDescription,
    },
    publishedAt: new Date(content.data.publishedAt),
    updatedAt: new Date(content.data.updatedAt),
  })) as BlogPost[];
};

const getBlogPostBySlug = async (slug: string) => {
  const mdContent = matter(
    fs.readFileSync(path.join(POSTS_DIRECTORY, slug, 'index.md'))
  );

  const [conversionError, htmlContent] = await handle(
    convertMarkdownToHtml(mdContent.content)
  );
  if (conversionError) return Promise.reject(conversionError);

  return {
    title: mdContent.data.title,
    slug: mdContent.data.slug,
    coverImage: mdContent.data.coverImage || null,
    content: htmlContent,
    seo: {
      description: mdContent.data.seoDescription,
    },
    publishedAt: new Date(mdContent.data.publishedAt),
    updatedAt: new Date(mdContent.data.updatedAt),
  } as BlogPost;
};

const getAllStaticPages = async () => {
  const allStaticPagesDirectory = fs.readdirSync(STATIC_PAGES_DIRECTORY);
  const mdContents = allStaticPagesDirectory.flatMap((slug) =>
    matter(fs.readFileSync(path.join(STATIC_PAGES_DIRECTORY, slug, 'index.md')))
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
  const mdContent = matter(
    fs.readFileSync(path.join(STATIC_PAGES_DIRECTORY, slug, 'index.md'))
  );

  const [conversionError, htmlContent] = await handle(
    convertMarkdownToHtml(mdContent.content)
  );
  if (conversionError) return Promise.reject(conversionError);

  return {
    title: mdContent.data.title,
    slug: mdContent.data.slug,
    content: htmlContent,
    publishedAt: new Date(mdContent.data.publishedAt),
    updatedAt: new Date(mdContent.data.updatedAt),
  } as StaticPage;
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
  getAllStaticPages,
  convertMarkdownToHtml,
};
