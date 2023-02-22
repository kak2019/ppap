import { spfi } from "@pnp/sp";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { FeatureKey } from "../../featureKey";
import { IRequestListItem } from "../../model";
import { getSP } from "../../pnpjsConfig";
import { REQUESTSCONST } from "./requestsSlice";

// Thunk function
export const fetchRequestByIdAction = createAsyncThunk(
  `${FeatureKey.REQUESTS}/fetchById`,
  async (arg: {Id:number}) => {
    
      const sp = spfi(getSP());
      const item = await sp.web.lists
        .getByTitle(REQUESTSCONST.LIST_NAME)
        .items.getById(arg.Id).select(
          "ID",
          "Title",
          "RequestID",
          "Status",
          "requestPartJSON",          
        ) as IRequestListItem;

      return {
        ID: item.ID,
        Title: item.Title,
        RequestID: item.RequestID,
        Status: item.Status,
        requestPartJSON: item.requestPartJSON,
      } as IRequestListItem;

  }
);

export const addRequestAction = createAsyncThunk(
    `${FeatureKey.REQUESTS}/add`,
    async (arg: {request:IRequestListItem} ) => {
      const {request} = arg;
      const sp = spfi(getSP());
      const list = sp.web.lists.getByTitle(REQUESTSCONST.LIST_NAME);
      const result = await list.items.add({
        requestPartJSON: request.requestPartJSON,
        itemNumber: request.itemNumber,
        Status: request.Status,
        })
        .then((b) => b.data)
        .catch((e) => e.message
          //"Error when add request"
        );
      return { request: result };
    }
  );


