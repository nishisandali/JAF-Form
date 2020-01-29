export interface PdfSettings {
  is36dealer?: boolean;
  notes?: string[];
  smallNotes?: string[];
  logo?: string;
  headerInfo?: PdfHeaderInfo;
  attachment?: string;
  generateAttachment?: boolean;
  generatePdf?: any;
  isQuotePdf38?: boolean;
  isQuotePdf29?: boolean;
}

export interface PdfHeaderInfo {
  title: string;
  regNumber: {
    title: string;
    number: string;
  };
  taxRegNumber: {
    title: string;
    number: string;
  };
  comRegNumber?: {
    title: string;
    number: string;
  };
  address: string[];
  phone: string;
  fax: string;
  website: string;
}
