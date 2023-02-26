import { createSelector } from "@reduxjs/toolkit";
import { ordersAdapter, IOrderState } from "./ordersSlice";
import { RootState } from "../../store";

const { selectAll } = ordersAdapter.getSelectors();

const featureStateSelector = (state: RootState): object => state.orders;

/**
 * isFetching selector
 */
export const isFetchingSelector = createSelector(
  featureStateSelector,
  (state: IOrderState) => state?.statue
);

/**
 * all orders selector
 */
export const allOrdersSelector = createSelector(
  featureStateSelector,
  selectAll
);

/**
 * selectedItems selector
 */
export const selectedItemsSelector = createSelector(
  featureStateSelector,
  (state: IOrderState) => state?.selectedItems
);




