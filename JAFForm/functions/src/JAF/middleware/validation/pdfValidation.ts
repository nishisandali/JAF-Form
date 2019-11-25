import { Request, Response, NextFunction } from 'express';
import { validate } from 'joi';

import { pdfSchema } from './schemas/pdf.schema';
import { MappedData, PdfField } from '@digitaldealers/typings';

import { PdfRequest } from '../../interfaces/request.interface';

export function validatePDFData(req: Request, res: Response, next: NextFunction) {
  const data: MappedData<PdfField> = req.body;

  const { error, value } = validate<MappedData<PdfField>>(data, pdfSchema, { allowUnknown: true });

  if (error) { next(error); }

  (req as PdfRequest).processedBody = value;

  next();
}
