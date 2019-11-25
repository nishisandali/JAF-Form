export interface CreatePdfOptions {
  generateAttachment?: boolean;
  showPagesOnFooter?: boolean;
  showLogs?: boolean;
  leftFooter?: {
    title: string;
    value: string;
  };
}
