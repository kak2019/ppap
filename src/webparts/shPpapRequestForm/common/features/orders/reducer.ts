import { createSlice } from "@reduxjs/toolkit";
import { FeatureKey } from "../../featureKey";
import { fetchAllOrdersAction, editOrderPartInfoAction } from "./action";
import { initialState, OrdersStatus, ordersAdapter } from "./ordersSlice";
import { IOrdersListItem } from '../../model';

const ordersSlice = createSlice({
  name: FeatureKey.ORDERS,
  initialState,
  reducers: {
    ItemsFilterChanged(state, action) {
      state.itemsfilter = action.payload;
    },
    OrdersStatusChanged(state, action) {
      state.statue = action.payload;
    },
    UpdateSelectedItem(state, action) {
      const {order} =action.payload;
      state.selectedItems = state.selectedItems.map(item =>{
        if(item.ID === order.ID)
          return {...order}
        else
          return item
      })
    },
    AddSelectedItem(state, action) {
      state.selectedItems.push(action.payload);
    },
    RemoveSelectedItemById(state, action) {
      state.selectedItems = state.selectedItems.filter(
        (el) => el.ID !== action.payload
      );
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllOrdersAction.pending, (state, action) => {
        state.statue = OrdersStatus.Loading;
      })
      .addCase(fetchAllOrdersAction.fulfilled, (state, action) => {
        state.statue = OrdersStatus.Idle;
        ordersAdapter.setAll(state, action.payload as readonly IOrdersListItem[]);
      })
      .addCase(fetchAllOrdersAction.rejected, (state, action) => {
        state.statue = OrdersStatus.Failed;
        state.message = action.payload as string;
      })
      .addCase(editOrderPartInfoAction.pending, (state, action) => {
        state.statue = OrdersStatus.Loading;
      })
      .addCase(editOrderPartInfoAction.fulfilled, (state, action) => {
        const {order}  = action.meta.arg;
        state.statue = OrdersStatus.Idle;
        ordersAdapter.updateOne(state, { id: order.ID, changes: order });
      })
      .addCase(editOrderPartInfoAction.rejected, (state, action) => {
        state.statue = OrdersStatus.Failed;
        state.message = action.payload as string;
      });
  },
});

export const {
  ItemsFilterChanged,
  OrdersStatusChanged,
  UpdateSelectedItem,
  AddSelectedItem,
  RemoveSelectedItemById,
} = ordersSlice.actions;
export const ordersReducer = ordersSlice.reducer;
