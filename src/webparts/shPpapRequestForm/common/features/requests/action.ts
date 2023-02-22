import { spfi } from "@pnp/sp";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { FeatureKey } from "../../featureKey";
import { IRequestListItem } from "../../model";
import { getSP } from "../../pnpjsConfig";
import { REQUESTSCONST } from "./requestsSlice";

// Thunk function
export const fetchByIdAction = createAsyncThunk(
  `${FeatureKey.REQUESTS}/fetchById`,
  async (arg: { Id: number }) => {
    const sp = spfi(getSP());
    const item = await sp.web.lists
      .getByTitle(REQUESTSCONST.LIST_NAME)
      .items.getById(arg.Id)
      .select("ID", "RequestID", "Status")()
      .catch((e) => e.message);
    return {
      ID: item.ID,
      RequestID: item.RequestID,
      Status: item.Status,
    } as IRequestListItem;
  }
);

export const fetchRequestListIdAction = createAsyncThunk(
  `${FeatureKey.REQUESTS}/fetchListId`,
  async () => {
    const sp = spfi(getSP());
    const list = sp.web.lists.getByTitle(REQUESTSCONST.LIST_NAME);

    const r = await list.select("Id")();
    return r.Id;
  }
);

export const addRequestAction = createAsyncThunk(
  `${FeatureKey.REQUESTS}/add`,
  async (arg: { request: IRequestListItem }) => {
    const { request } = arg;
    const sp = spfi(getSP());
    const list = sp.web.lists.getByTitle(REQUESTSCONST.LIST_NAME);
    const result = await list.items
      .add({
        requestPartJSON: request.requestPartJSON,
        itemNumber: request.itemNumber,
        Status: request.Status,
      })
      .then((b) => b.data)
      .catch(
        (e) => e.message
        //"Error when add request"
      );
    return { request: result };
  }
);
