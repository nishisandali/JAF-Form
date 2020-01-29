import { Response, NextFunction } from 'express';
import * as path from 'path';

import { PdfRequest } from '../../interfaces/request.interface';

const workDir = path.resolve(__dirname, '..', '..', 'templates', 'pdf', 'JAF');

export function prepareJAF(req: PdfRequest, res: Response, next: NextFunction): void {
  req.serviceData = { workDir };

  next();
}
