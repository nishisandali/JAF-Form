import * as cors from 'cors';
import * as express from 'express';
import * as jwt from 'express-jwt';
import * as fs from 'fs';
import * as jwksRsa from 'jwks-rsa';
import * as util from 'util';

import { PdfRequest } from '../interfaces/request.interface';
import { validatePDFData } from '../middleware/validation/pdfValidation';
import { BadRequestError, ForbiddenError } from './error.helper';

const readFile = util.promisify(fs.readFile);

type PdfRequestHandler = (req: PdfRequest, res: express.Response, next: express.NextFunction) => any;

const jwtOptions: jwt.Options = {
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://digital-dealers.au.auth0.com/.well-known/jwks.json`,
  }),
};

const headersMiddleware = (req, res, next) => {
  // Add content-disposition header to the response for CORS
  res.set('access-control-expose-headers', 'content-disposition');
  // Clear x-powered-by header
  res.set('x-powered-by', '');
  next();
};

export const getApp = (useJWT = false): express.Express => {
  const app = express();
  app.use(cors({ origin: true }))
    .use(headersMiddleware);

  if (useJWT) {
    app.use(jwt(jwtOptions));
  }

  return app;
};

export const errorHandler: express.ErrorRequestHandler = (err, req, res, next) => {
  console.error('errorHandler', err);

  if (err.name === 'UnauthorizedError') {
    res.status(401)
      .json({
        success: false,
        message: err.message,
      });
    return;
  }

  res.status(500)
    .json({
      success: false,
      message: err.message,
    });
};

export const sendError = (res: express.Response, error: Error): any => {
  console.error(error);

  if (error instanceof BadRequestError) {
    res.status(400);
  } else if (error instanceof ForbiddenError) {
    res.status(403);
  } else {
    res.status(500);
  }

  return res.send({
    success: false,
    message: error.message,
  });
};

export async function encodeBase64(filename: string): Promise<string> {
  const bitmap = await readFile(filename);
  return Buffer.from(bitmap).toString('base64');
}

export function createPDFApp(...middleware: PdfRequestHandler[]): express.Application {
  return getApp()
    .post('/', [validatePDFData, ...middleware] as express.RequestHandler[])
    .use(errorHandler);
}
