import { useCallback } from "react";

import {
  allDocumentsSelector,
  fetchAllDocumentSectionsAction,
} from "../features/documents";
import { useAppSelector, useAppDispatch } from "./useApp";
import { IUploadDocumentSectionInfo } from "../model";


type DocumentsOperators = [
  documents: IUploadDocumentSectionInfo[],
  fetchAllDocuments: (Id:string) => void,
];
export const useDocuments = (): Readonly<DocumentsOperators> => {
  const dispatch = useAppDispatch();
  const documents = useAppSelector(allDocumentsSelector);

  const fetchAllDocuments = useCallback((Id: string) => {
    return dispatch(fetchAllDocumentSectionsAction({ Id: Id }));
  }, [dispatch]);

  return [
    documents,
    fetchAllDocuments,
  ] as const;
};
