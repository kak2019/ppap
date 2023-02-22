import { useCallback } from "react";

import {
  RequestStatus,
  isFetchingSelector,
  itemSelector,
  fetchRequestByIdAction,
  addRequestAction,
} from "../features/requests";
import { useAppSelector, useAppDispatch } from "./useApp";
import { IRequestListItem } from "../model";


type RequestOperators = [
  isFetching: RequestStatus,
  request: IRequestListItem,
  fetchRequestById: (Id:number) => void,
  addRequest: (arg: {request: IRequestListItem} ) => void,
];
export const useRequest = (): Readonly<RequestOperators> => {
  const dispatch = useAppDispatch();
  const request = useAppSelector(itemSelector);
  const isFetching = useAppSelector(isFetchingSelector);
  


  const fetchRequestById = useCallback((Id:number) => {
    return dispatch(fetchRequestByIdAction({Id:Id}));
  }, [dispatch]);

  const addRequest = useCallback(
     (arg: {request: IRequestListItem}) => {
      return dispatch(addRequestAction(arg));
    },
    [dispatch]
  );

  return [
    isFetching,
    request,
    fetchRequestById,
    addRequest,
  ] as const;
};
