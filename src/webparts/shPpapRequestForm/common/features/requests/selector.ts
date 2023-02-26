import { createSelector } from "@reduxjs/toolkit";
import { IRequestState } from "./requestsSlice";
import { RootState } from "../../store";

const featureStateSelector = (state: RootState): object => state.request;

/**
 * isFetching selector
 */
export const isFetchingSelector = createSelector(
  featureStateSelector,
  (state: IRequestState) => state?.statue
);

/**
 * item selector
 */
export const itemSelector = createSelector(
  featureStateSelector,
  (state: IRequestState) => state?.item
);

/**
 * itemId selector
 */
export const itemIdSelector = createSelector(
  featureStateSelector,
  (state: IRequestState) => state?.itemId
);


/**
 * listId selector
 */
export const listIdSelector = createSelector(
  featureStateSelector,
  (state: IRequestState) => state?.listId
);
