import { useCallback } from "react";

import {
  RequestStatus,
  isFetchingSelector,
  itemSelector,
  listIdSelector,
  RequestListIdChange,
  fetchByIdAction,
  addRequestAction,
  fetchRequestListIdAction,
} from "../features/requests";
import { useAppSelector, useAppDispatch } from "./useApp";
import { IRequestListItem } from "../model";

type RequestOperators = [
  isFetching: RequestStatus,
  request: IRequestListItem,
  fetchRequestById: (Id: number) => void,
  addRequest: (arg: { request: IRequestListItem }) => void,
  requestListId: string,
  fetchRequestListId: () => void,
  changeRequestListId: (Id: string) => void
];
export const useRequest = (): Readonly<RequestOperators> => {
  const dispatch = useAppDispatch();
  const request = useAppSelector(itemSelector);
  const requestListId = useAppSelector(listIdSelector);
  const isFetching = useAppSelector(isFetchingSelector);

  const fetchRequestById = useCallback(
    (Id: number) => {
      return dispatch(fetchByIdAction({ Id: Id }));
    },
    [dispatch]
  );

  const addRequest = useCallback(
    (arg: { request: IRequestListItem }) => {
      return dispatch(addRequestAction(arg));
    },
    [dispatch]
  );

  const fetchRequestListId = useCallback(async () => {
    return dispatch(fetchRequestListIdAction());
  }, [dispatch]);

  const changeRequestListId = useCallback(
    async (Id: string) => {
      return dispatch(RequestListIdChange(Id));
    },
    [dispatch]
  );

  return [
    isFetching,
    request,
    fetchRequestById,
    addRequest,
    requestListId,
    fetchRequestListId,
    changeRequestListId,
  ] as const;
};
