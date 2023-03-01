import { createEntityAdapter, EntityState } from "@reduxjs/toolkit";
import { IUploadDocumentSectionInfo } from "../../model";

export const DOCUMENTSCONST = Object.freeze({
  LIST_NAME: "Upload file",
});

export enum DocumentsStatus {
  Idle,
  Loading,
  Failed,
}

export interface IDocumentsState
  extends EntityState<IUploadDocumentSectionInfo> {
  jiraNumber: string;
  statue: DocumentsStatus;
  message: string;
}

export const documentsAdapter = createEntityAdapter<IUploadDocumentSectionInfo>(
  {
    selectId: (section: IUploadDocumentSectionInfo) => section.UploadFilePath,
  }
);

export const initialState: IDocumentsState = documentsAdapter.getInitialState({
  jiraNumber: "",
  statue: DocumentsStatus.Idle,
  message: "",
});
