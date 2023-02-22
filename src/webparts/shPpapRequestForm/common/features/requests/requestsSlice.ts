import { IRequestListItem } from "../../model";

export enum RequestStatus {
  Idle,
  Loading,
  Failed,
}

export const REQUESTSCONST = Object.freeze({
  LIST_NAME: "PPAP Requests",
});

export interface IRequestState {
  item: IRequestListItem;
  listId: string;
  statue: RequestStatus;
  message: string;
}

export const initialState: IRequestState = {
  item: {},
  listId: "",
  statue: RequestStatus.Idle,
  message: "",
};
