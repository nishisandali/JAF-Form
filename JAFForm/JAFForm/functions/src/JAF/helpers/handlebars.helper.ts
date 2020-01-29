import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';
import * as handlebars from 'handlebars';

import { handlebarsHelpers } from '../static/handlebarsHelpers';

const readFile = util.promisify(fs.readFile);
const readDir = util.promisify(fs.readdir);

export const registerHelpers = () => handlebars.registerHelper(handlebarsHelpers);

export async function registerPartials(partialsDir: string): Promise<any> {
  try {
    const files = await readDir(partialsDir);

    if (!files) {
      return;
    }

    for (const file of files) {
      const template = await readFile(path.resolve(partialsDir, file), 'utf8');
      handlebars.registerPartial(path.basename(file, '.hbs'), template);
    }
  } catch (e) {
    throw new Error(`Can't register partials in dir ${partialsDir}, details: ${e}`);
  }
}

export async function readTemplate(templatePath: string): Promise<string> {
  try {
    return readFile(templatePath, 'utf8');
  } catch (e) {
    throw new Error(`Can't get template`);
  }
}

export async function getHtmlFromTemplate(templatePath: string, context: any): Promise<string> {
  handlebars.registerHelper(handlebarsHelpers);

  const templateFile = await readTemplate(templatePath);
  const template = handlebars.compile(templateFile);

  return template(context);
}
