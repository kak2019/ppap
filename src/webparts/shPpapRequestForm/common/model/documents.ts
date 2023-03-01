import { IFileInfo } from '@pnp/sp/files'
export enum DocumentsStatus {
    Idle,
    Loading,
    Failed,
  }
export interface IUploadDocumentSectionInfo{
    Files:IFileInfo[];
    UploadFilePath:string;
    statue: DocumentsStatus,
    message: string,
}