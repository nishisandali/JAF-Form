import { Request } from 'express';
import { MappedData, WorkflowField } from '@digitaldealers/typings';
import { MappedDataPdf } from './mapped-data-pdf.interface';

export interface WorkflowRequest extends Request {
  processedBody: MappedData<WorkflowField>;
}

export interface PdfRequest extends Request {
  processedBody: MappedDataPdf;
  serviceData: {
    workDir: string;
    attachment?: any;
  };
}
