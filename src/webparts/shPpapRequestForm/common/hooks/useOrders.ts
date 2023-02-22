import { useCallback } from "react";

import {
  OrdersStatus,
  isFetchingSelector,
  allOrdersSelector,
  selectedItemsSelector,
  fetchAllOrdersAction,
  editOrderPartInfoAction,
  UpdateSelectedItem,
  AddSelectedItem,
  RemoveSelectedItemById,
} from "../features/orders";
import { useAppSelector, useAppDispatch } from "./useApp";
import { IOrdersListItem } from "../model";


type OrdersOperators = [
  isFetching: OrdersStatus,
  orders: IOrdersListItem[],
  selectedItems: IOrdersListItem[],
  fetchAllOrders: () => void,
  editOrderPartInfo: (arg: {order: IOrdersListItem} ) => void,
  updateSelectedItem: (arg: {order: IOrdersListItem}) => void,
  addSelectedItem: (arg: {order: IOrdersListItem}) => void,
  removeSelectedItemById: (arg: string) => void
];
export const useOrders = (): Readonly<OrdersOperators> => {
  const dispatch = useAppDispatch();
  const orders = useAppSelector(allOrdersSelector);
  const isFetching = useAppSelector(isFetchingSelector);
  const selectedItems = useAppSelector(selectedItemsSelector);


  const fetchAllOrders = useCallback(() => {
    return dispatch(fetchAllOrdersAction());
  }, [dispatch]);

  const editOrderPartInfo = useCallback(
    (arg: {order: IOrdersListItem}) => {
      return dispatch(editOrderPartInfoAction(arg));
    },
    [dispatch]
  );

  const updateSelectedItem = useCallback(
    (arg: {order: IOrdersListItem}) => {
      return dispatch(UpdateSelectedItem(arg));
    },
    [dispatch]
  );


  const addSelectedItem = useCallback(
    (arg: {order: IOrdersListItem}) => {
      const selectedItemIds = selectedItems.map(item => item.ID)
      const {order}=arg;
      if (selectedItemIds.indexOf(order.ID) === -1)
        return dispatch(AddSelectedItem(order));
    },
    [dispatch,selectedItems]
  );

  const removeSelectedItemById = useCallback(
    (arg: string) => {
      const selectedItemIds = selectedItems.map(item => item.ID)
      if (selectedItemIds.indexOf(arg) !== -1)
        return dispatch(RemoveSelectedItemById(arg));
    },
    [dispatch,selectedItems]
  );

  return [
    isFetching,
    orders,
    selectedItems,
    fetchAllOrders,
    editOrderPartInfo,
    updateSelectedItem,
    addSelectedItem,
    removeSelectedItemById,
  ] as const;
};
