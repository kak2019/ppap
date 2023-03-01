import { createSelector } from "@reduxjs/toolkit";
import { documentsAdapter } from "./documentsSlice";
import { RootState } from "../../store";

const { selectAll } = documentsAdapter.getSelectors();

const featureStateSelector = (state: RootState): object => state.documents;


/**
 * all orders selector
 */
export const allDocumentsSelector = createSelector(
  featureStateSelector,
  selectAll
);
