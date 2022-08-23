import { emptyDir, ensureDir, ensureFile, outputFile } from 'fs-extra';
import inquirer from 'inquirer';
import path from 'path';
import slugify from 'slugify';
import { format } from 'util';

const STATICPAGE_CONTENT = `---
title: '%s'
slug: '%s'
publishedAt: %s
updatedAt: %s
---
`;

const GUIDE_CONTENT = `---
title: '%s'
slug: '%s'
coverImage: ''
seoDescription: ''
publishedAt: %s
updatedAt: %s
excerpt: ''
metadata:
  sample: 'sample'
---
`;

inquirer
  .prompt([
    {
      type: 'list',
      name: 'type',
      message: 'What do you want to create?',
      loop: true,
      choices: [
        {
          value: 'staticpage',
          name: 'Static page',
        },
        {
          value: 'guide',
          name: 'Guide',
        },
      ],
    },
    {
      type: 'input',
      name: 'name',
      message: 'Enter name of static page:',
      when: (answers) => {
        return answers.type === 'staticpage';
      },
      validate: (answer) => {
        return answer !== '';
      },
    },
    {
      type: 'input',
      name: 'name',
      message: 'Enter name of guide:',
      when: (answers) => {
        return answers.type === 'guide';
      },
      validate: (answer) => {
        return answer !== '';
      },
    },
    {
      type: 'input',
      name: 'slug',
      message: 'Enter the slug:',
      default: (answers) => {
        return slugify(answers.name, {
          lower: true,
        });
      },
      validate: (answer) => {
        return answer !== '';
      },
    },
    {
      type: 'input',
      name: 'path',
      message: 'Enter path of the base directory:',
      default: (answers) => {
        if (answers.type === 'staticpage') {
          return './_blog/staticPages';
        } else if (answers.type === 'guide') {
          return './_blog/guides';
        }
      },
      validate: (answer) => {
        return answer !== '';
      },
    },
  ])
  .then((answers) => {
    switch (answers.type) {
      case 'staticpage':
        createStaticPage(answers.name, answers.slug, answers.path);
        break;
      case 'guide':
        createGuide(answers.name, answers.slug, answers.path);
        break;
    }
  });

const createStaticPage = async (name, slug, folderPath) => {
  const folder = path.join(process.cwd(), folderPath, slug);
  await prepareDirectory(folder);

  const date = new Date().toISOString();

  await outputFile(
    path.join(folder, 'index.mdx'),
    format(STATICPAGE_CONTENT, name, slug, date, date)
  );

  console.log('Static page created successfully.');
  console.log(`Check ${path.join(folder, 'index.mdx')}.`);
};

const createGuide = async (name, slug, folderPath) => {
  const folder = path.join(process.cwd(), folderPath, slug);
  await prepareDirectory(folder);

  const date = new Date().toISOString();

  await outputFile(
    path.join(folder, 'index.mdx'),
    format(GUIDE_CONTENT, name, slug, date, date)
  );

  console.log('Guide created successfully.');
  console.log(`Check ${path.join(folder, 'index.mdx')}.`);
};

const prepareDirectory = async (dir) => {
  await ensureDir(dir);
  await emptyDir(dir);
  await ensureFile(path.join(dir, 'index.mdx'));
};
