import { useCallback } from "react";

import {
  RequestStatus,
  isFetchingSelector,
  itemSelector,
  itemIdSelector,
  listIdSelector,
  RequestItemIdChanged,
  RequestListIdChange,
  fetchByIdAction,
  addRequestAction,
  fetchRequestListIdAction,
  editRequestAction,
} from "../features/requests";
import { useAppSelector, useAppDispatch } from "./useApp";
import { IRequestListItem } from "../model";

type RequestOperators = [
  isFetching: RequestStatus,
  request: IRequestListItem,
  requestItemId: string,
  fetchRequestById: (Id: number) => void,
  addRequest: (arg: { request: IRequestListItem }) => Promise<number>,
  requestListId: string,
  fetchRequestListId: () => void,
  changeRequestId:(Id:string) => void,
  changeRequestListId: (Id: string) => void,
  editRequest: (arg: { request: IRequestListItem }) => Promise<number>,
];
export const useRequest = (): Readonly<RequestOperators> => {
  const dispatch = useAppDispatch();
  const request = useAppSelector(itemSelector);
  const requestItemId = useAppSelector(itemIdSelector);
  const requestListId = useAppSelector(listIdSelector);
  const isFetching = useAppSelector(isFetchingSelector);

  const fetchRequestById = useCallback(
    (Id: number) => {
      return dispatch(fetchByIdAction({ Id: Id }));
    },
    [dispatch]
  );

  const addRequest = useCallback(
    async (arg: { request: IRequestListItem }) => {
      try {
        await dispatch(addRequestAction(arg));
        return Promise.resolve(0);
      } catch {
        return Promise.reject(1);
      }
    },
    [dispatch]
  );

  const editRequest = useCallback(
    async (arg: { request: IRequestListItem }) => {
      try {
        await dispatch(editRequestAction(arg));
        return Promise.resolve(0);
      } catch {
        return Promise.reject(1);
      }
    },
    [dispatch]
  );

  const fetchRequestListId = useCallback(async () => {
    return dispatch(fetchRequestListIdAction());
  }, [dispatch]);

  const chnageRequestId = useCallback((Id:string)=>{
    return dispatch(RequestItemIdChanged(Id));
  },[dispatch])

  const changeRequestListId = useCallback(
    async (Id: string) => {
      return dispatch(RequestListIdChange(Id));
    },
    [dispatch]
  );

  return [
    isFetching,
    request,
    requestItemId,
    fetchRequestById,
    addRequest,
    requestListId,
    fetchRequestListId,
    chnageRequestId,
    changeRequestListId,
    editRequest,
  ] as const;
};
