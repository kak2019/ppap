import { spfi } from "@pnp/sp";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { FeatureKey } from "../../featureKey";
import { IRequestListItem } from "../../model";
import { getSP } from "../../pnpjsConfig";
import { REQUESTSCONST } from "./requestsSlice";

const fetchById = async (arg: { Id: number }):Promise<IRequestListItem | string> => {
  const sp = spfi(getSP());
  const item = await sp.web.lists
    .getByTitle(REQUESTSCONST.LIST_NAME)
    .items.getById(arg.Id)()
    .catch((e) => e.message);
  return item;
}
const fetchListId = async ():Promise<string> => {
  const sp = spfi(getSP());
  const list = sp.web.lists.getByTitle(REQUESTSCONST.LIST_NAME);

  const r = await list.select("Id")();
  return r.Id;
}
const editRequest = async (arg: { request: IRequestListItem }) :Promise<IRequestListItem | string>=> {
  const { request } = arg;
  const sp = spfi(getSP());
  const list = sp.web.lists.getByTitle(REQUESTSCONST.LIST_NAME);
  await list.items
    .getById(+request.ID)
    .update(request)
    .catch((err) => err.message);
  const result = await fetchById({Id: +request.ID});
  return result;
}
const addRequest = async (arg: { request: IRequestListItem }): Promise<IRequestListItem | string> => {
  const { request } = arg;
  const sp = spfi(getSP());
  const list = sp.web.lists.getByTitle(REQUESTSCONST.LIST_NAME);
  const result = await list.items
    .add(request)
    .catch((err) => err.message);
  const requestNew = (result.data as IRequestListItem);
  const titleStr =
    "PPAP Request - " +
    ("000000" + requestNew.ID).slice(-6);
  const result2 = await editRequest({request:{ ID:requestNew.ID, Title: titleStr }});
  
  return result2;
}

// Thunk function
export const fetchByIdAction = createAsyncThunk(
  `${FeatureKey.REQUESTS}/fetchById`,
  fetchById
);

export const fetchRequestListIdAction = createAsyncThunk(
  `${FeatureKey.REQUESTS}/fetchListId`,
  fetchListId
);

export const addRequestAction = createAsyncThunk(
  `${FeatureKey.REQUESTS}/add`,
  addRequest
);

export const editRequestAction = createAsyncThunk(
  `${FeatureKey.REQUESTS}/edit`,
  editRequest
);
