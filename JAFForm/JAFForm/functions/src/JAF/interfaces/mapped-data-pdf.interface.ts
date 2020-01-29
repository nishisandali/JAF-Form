import { MappedData, PdfField } from '@digitaldealers/typings';
export interface CircleImg {
  isBorder: boolean;
  image: string;
}

export interface Img {
  name: string;
  image: string;
  options?: {
    onFistPage?: boolean;
  };
}

export interface MappedDataPdf extends MappedData<PdfField> {
  logo?: string;
  circlesImg?: CircleImg[];
  categoryImg?: string;
  logoCiCard?: string;
  images?: Img[];
}
