import { MappedData, PdfField } from '@digitaldealers/typings';

export function getAllPdfFields(pdfData: MappedData<PdfField>): PdfField[] {
  return pdfData.fields.reduce(getFieldsRecursive, []);
}

export function findPdfFieldByName(fields: PdfField[], fieldName: string): PdfField {
  const foundedField = fields.find(field => field.mappingName === fieldName);

  if (!foundedField) {
    throw new Error(`Field ${fieldName} is not found in the workflow data`);
  }

  return foundedField;
}

function getFieldsRecursive(fields: PdfField[], field: PdfField): PdfField[] {
  fields.push(field);

  if (field.sections && field.sections.length) {
    field.sections
      .reduce((acc, section) => [...acc, ...section.items], [] as PdfField[])
      .reduce(getFieldsRecursive, fields);
  }

  if (field.children && field.children.length) {
    field.children
      .reduce(getFieldsRecursive, fields);
  }

  return fields;
}
