import {
  createEntityAdapter,
  EntityState,
} from "@reduxjs/toolkit";
import { IOrdersListItem, ISelectedOrdersListItem } from "../../model";



export enum ItemsFilters {
  All,
  Keyword,
  Mine,
}

export enum OrdersStatus {
  Idle,
  Loading,
  Failed,
}

export const ORDERSCONST = Object.freeze({
  LIST_NAME: "GPS Orders",
});



export interface IOrderState extends EntityState<IOrdersListItem> {
  itemsfilter: ItemsFilters;
  selectedItems:ISelectedOrdersListItem[];
  statue: OrdersStatus;
  message: string;
}

export const ordersAdapter = createEntityAdapter<IOrdersListItem>({
  selectId: (order: IOrdersListItem) => order.ID,
});

export const initialState: IOrderState = ordersAdapter.getInitialState({
  itemsfilter: ItemsFilters.All,
  selectedItems:[],
  statue: OrdersStatus.Idle,
  message: "",
});
