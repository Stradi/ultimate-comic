import fs from 'fs-extra';
import path from 'path';

import matter from 'gray-matter';
import inquirer from 'inquirer';

const comicSlugRegex = new RegExp(/(?<=comic\/)(.+)(?=\/issue)/, 'gm');

const extractRelatedComics = async (fileContents) => {
  const results = fileContents.match(comicSlugRegex);

  console.log('Trying to find unique comics');
  const uniqueResults = results.filter(
    (item, index) => results.indexOf(item) === index
  );

  console.log('Found unique comics: ' + uniqueResults.length);
  return uniqueResults;
};

const appendRelatedComicsToFile = async (fileContents, related) => {
  const parsedFile = matter(fileContents);
  const frontmatter = parsedFile.data;

  if (frontmatter.metadata.related) {
    console.log('This guide already has related comics');
    return;
  }

  frontmatter.metadata.related = related;
  console.log('Successfully added related comics to guide');

  const updatedFile = matter.stringify(parsedFile.content, frontmatter);
  return updatedFile;
};

const updateGuideFile = async (name) => {
  const file = path.join(process.cwd(), '_blog', 'guides', name, 'index.mdx');
  const isFileExists = await fs.pathExists(file);
  if (!isFileExists) {
    console.log("File doesn't exist");
    return;
  }

  const fileContents = await fs.readFile(file, 'utf8');
  if (fileContents === '') {
    console.log('File is empty');
    return;
  }

  const related = await extractRelatedComics(fileContents);
  if (!related) {
    console.log('No related comics found');
  }

  const updatedContent = await appendRelatedComicsToFile(fileContents, related);
  await fs.outputFile(file, updatedContent);
  console.log('Done');
};

inquirer
  .prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Enter name of the guide:',
      validate: (answer) => {
        return answer !== '';
      },
    },
  ])
  .then((answers) => {
    updateGuideFile(answers.name);
  })
  .catch((e) => {
    console.log('Whoops, something went wrong');
    console.log(e);
  });
