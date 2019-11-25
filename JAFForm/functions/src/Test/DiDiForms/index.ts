import * as functions from 'firebase-functions';

import { createPDFApp } from '../../JAF/helpers/express-helper';
import { generatePdf } from '../../JAF/middleware/pdf/generatePdf';
import { prepareJAF } from '../../JAF/middleware/pdf/prepareJAF';

// DEV purposes, do not remove
// import { sendDataEmail } from '../../common/middleware/sendDataEmail';

export const JAF = functions
  .runWith({ memory: '512MB' })
  .https.onRequest(createPDFApp(prepareJAF, generatePdf));

