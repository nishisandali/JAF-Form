import * as handlebars from 'handlebars';
import * as Puppeteer from 'puppeteer';
import { Response, NextFunction } from 'express';

import * as path from 'path';
import { encodeBase64 } from '../../helpers/express-helper';

import { readTemplate, registerHelpers, registerPartials } from '../../helpers/handlebars.helper';

import { PdfRequest } from '../../interfaces/request.interface';

registerHelpers();

export async function generatePdf(req: PdfRequest, res: Response, next: NextFunction): Promise<Response | void> {
  if (req.processedBody.logo) {
    req.processedBody.logo = `data:image/png;base64,${await encodeBase64(req.processedBody.logo)}`;
  }

  const serviceData = req.serviceData;
  const pdfData = { ...req.processedBody, attachment: serviceData.attachment};

  const globalPartialsPath = path.resolve(__dirname, '..', '..', 'templates', 'pdf', 'globalPartials');
  const templatePath = path.resolve(serviceData.workDir, 'index.hbs');

  await registerPartials(globalPartialsPath);
  await registerPartials(serviceData.workDir);
  const templateFile = await readTemplate(templatePath);
  const template = handlebars.compile(templateFile);
  const html = template(pdfData);

  try {
    const browser = await Puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.setContent(html);
    const pdf = await page.pdf({ format: 'A4' });
    await browser.close();

    return res.status(200)
      .attachment(`form-${pdfData.formName}.pdf`)
      .send(pdf);
  } catch (err) {
    // tslint:disable-next-line: no-void-expression
    return next(err);
  }
}
