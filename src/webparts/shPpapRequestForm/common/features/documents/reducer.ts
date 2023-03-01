import { createSlice } from "@reduxjs/toolkit";
import { FeatureKey } from "../../featureKey";
import { IUploadDocumentSectionInfo } from "../../model";
import {
  fetchAllDocumentSectionsAction,
} from "./action";
import { documentsAdapter, initialState } from "./documentsSlice";

const documentSlice = createSlice({
  name: FeatureKey.DOCUMENTS,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllDocumentSectionsAction.fulfilled,(state,action)=>{
        documentsAdapter.setAll(state, action.payload as readonly IUploadDocumentSectionInfo[]);
      });
  },
});

export const documentReducer = documentSlice.reducer;
