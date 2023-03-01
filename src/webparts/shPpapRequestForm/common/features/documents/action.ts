import { spfi } from "@pnp/sp";
import { IFileInfo } from "@pnp/sp/files";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { FeatureKey } from "../../featureKey";
import { IUploadDocumentSectionInfo, DocumentsStatus } from "../../model";
import { getSP } from "../../pnpjsConfig";
import { DOCUMENTSCONST } from "./documentsSlice";

const fetchFolders = async (
  folderUrl: string
): Promise<IUploadDocumentSectionInfo[] | string> => {
  const sp = spfi(getSP());

  let result: IUploadDocumentSectionInfo[] = [];
  try {
    const files = await sp.web
      .getFolderByServerRelativePath(folderUrl)
      .files()
      .then((files) => files)
      .catch((err) => err.message);

    if (typeof files === "string") {
      result = [
        ...result,
        {
          Files: [],
          UploadFilePath: folderUrl,
          statue: DocumentsStatus.Idle,
          message: files,
        } as IUploadDocumentSectionInfo,
      ];
    } else {
      result = [
        ...result,
        {
          Files: files,
          UploadFilePath: folderUrl,
          statue: DocumentsStatus.Idle,
          message: "",
        } as IUploadDocumentSectionInfo,
      ];
    }

    const subFolders = await sp.web
      .getFolderByServerRelativePath(folderUrl)
      .folders();

    for (let i = 0; i < subFolders.length; i++) {
      const res = await fetchFolders(subFolders[i].ServerRelativeUrl);
      if (typeof res === "string") {
        result = [
          ...result,
          {
            message: res,
            Files: [],
            UploadFilePath: subFolders[0].ServerRelativeUrl,
            statue: DocumentsStatus.Failed,
          } as IUploadDocumentSectionInfo,
        ];
      } else {
        result = [...result, ...(res as IUploadDocumentSectionInfo[])];
      }
    }
  } catch (err) {
    return Promise.reject(err.message);
  }

  return Promise.resolve(result);
};
// Thunk function
export const fetchAllDocumentSectionsAction = createAsyncThunk(
  `${FeatureKey.DOCUMENTS}/fetchAll`,
  async (arg: { Id: string }): Promise<unknown> => {
    const sp = spfi(getSP());
    const rootFolder = await sp.web.lists
      .getByTitle(DOCUMENTSCONST.LIST_NAME)
      .rootFolder()
      .then((r) => r)
      .catch((err) => err.message);

    const result = await fetchFolders(
      `${rootFolder.ServerRelativeUrl}/${arg.Id}`
    );
    return result;
  }
);

export const fetchDocumentsAction = createAsyncThunk(
  `${FeatureKey.DOCUMENTS}/fetchDocuments`,
  async (arg: { folderUrl: string }): Promise<IFileInfo[] | string> => {
    const sp = spfi(getSP());
    const { folderUrl } = arg;
    return await sp.web
      .getFolderByServerRelativePath(folderUrl)
      .files()
      .then((files) => {
        return Promise.resolve(files);
      })
      .catch((err) => {
        return Promise.reject(err.message);
      });
  }
);

export const editJiraNumberAction = createAsyncThunk(
  `${FeatureKey.DOCUMENTS}/editJiraNumber`,
  async (arg: { folderUrl: string; jiraNbr: string }) => {
    const { folderUrl, jiraNbr } = arg;
    const sp = spfi(getSP());
    try {
      const fields = await sp.web
        .getFolderByServerRelativePath(folderUrl)
        .listItemAllFields();
      const { ID } = fields;
      const list = sp.web.lists.getByTitle(DOCUMENTSCONST.LIST_NAME);

      await list.items.getById(+ID).update({
        Title: jiraNbr,
      });

      return Promise.resolve(jiraNbr);
    } catch (err) {
      return Promise.reject(err.message);
    }
  }
);

export const fetchJiraNumberAction = createAsyncThunk(
  `${FeatureKey.DOCUMENTS}/fetchJiraNumber`,
  async (arg: { folderUrl: string }) => {
    const { folderUrl } = arg;
    const sp = spfi(getSP());
    try {
      const fields = await sp.web
        .getFolderByServerRelativePath(folderUrl)
        .listItemAllFields();
      const { Title } = fields;

      return Promise.resolve(Title);
    } catch (err) {
      return Promise.reject(err.message);
    }
  }
);

export const uploadDocumentAction = createAsyncThunk(
  `${FeatureKey.DOCUMENTS}/uploadDocument`,
  async (arg: {
    folderUrl: string;
    fileNamePath: string;
    file: string | ArrayBuffer | Blob;
  }) => {
    const sp = spfi(getSP());
    const { folderUrl, fileNamePath, file } = arg;
    try {
      await sp.web
        .getFolderByServerRelativePath(folderUrl)
        .files.addUsingPath(fileNamePath, file, { Overwrite: false });

      return Promise.resolve(arg);
    } catch (err) {
      return Promise.reject(err.message);
    }
  }
);

export const deleteDocumentAction = createAsyncThunk(
  `${FeatureKey.DOCUMENTS}/deleteDocument`,
  async (arg: { folderUrl: string; fileName: string }) => {
    const sp = spfi(getSP());
    const { folderUrl, fileName } = arg;

    try {
      await sp.web
        .getFolderByServerRelativePath(folderUrl + "/" + fileName)
        .recycle();

      return Promise.resolve(arg);
    } catch (err) {
      return Promise.reject(err.message);
    }
  }
);
