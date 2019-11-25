import { array, object, string } from 'joi';

export const pdfSchema = object().keys({
  assignedOn: string()
    .optional()
    .trim()
    .allow(null),
  assignedTo: string()
    .optional()
    .email()
    .trim()
    .allow(null),
  category: string()
    .optional()
    .trim()
    .allow(null),
  data: array()
    .required(),
  description: string()
    .optional()
    .trim()
    .allow(null),
  formId: string()
    .trim()
    .required(),
  formName: string()
    .trim()
    .required(),
  roles: array()
    .required()
    .items(string()),
  status: string()
    .optional()
    .trim()
    .allow(null),
});
