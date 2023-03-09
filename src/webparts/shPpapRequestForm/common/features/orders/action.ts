import { spfi } from "@pnp/sp";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { FeatureKey } from "../../featureKey";
import { IOrdersListItem } from "../../model";
import { getSP } from "../../pnpjsConfig";
import { ORDERSCONST } from "./ordersSlice";
import "@pnp/sp/items/get-all";

// Thunk function
export const fetchAllOrdersAction = createAsyncThunk(
  `${FeatureKey.ORDERS}/fetchAll`,
  async () => {
    try{
      const sp = spfi(getSP());
    const result = await sp.web.lists
      .getByTitle(ORDERSCONST.LIST_NAME)
      .items.select(
        "ID",
        "ItemNm",
        "ItemNbr",
        "PARMANm",
        "SQANm",
        "PPAPOrderNumber",
        "PPAPplannedweek",
        "PPAPPartWeight",
        "PPAPPartWeightCode",
        "RevisionCode",
        "DrawingVersion",
        "ItemValidIssue",
        "GPSDrawingNumber",    
        "SQASection", 
        "SQACd", 
        "PPAPorderdate", 
        "PPAPOrderarrweek", 
        "PPAPapprovalweek", 
        "PPAP_x002d_Plan_x002d_Y",
        "SupplierEmail"
        ).getAll
      ()
      .then((response) =>
        response.map(
          (item: IOrdersListItem) =>
            ({
              ID: item.ID,
              PPAPOrderNumber: item.PPAPOrderNumber,
              ItemNbr: item.ItemNbr,
              SQANm: item.SQANm,
              PARMANm: item.PARMANm,
              ItemNm: item.ItemNm,
              PPAPPartWeightCode: item.PPAPPartWeightCode,
              PPAPPartWeight: item.PPAPPartWeight,
              PPAPplannedweek: item.PPAPplannedweek,
              DrawingVersion: item.DrawingVersion,
              RevisionCode: item.RevisionCode,
              ItemValidIssue: item.ItemValidIssue,
              GPSDrawingNumber: item.GPSDrawingNumber,
              SupplierEmail: item.SupplierEmail
            } as IOrdersListItem)
        )
      );
    return result;
    }
    catch{
      return Promise.reject("Error when fetch all orders.")
    }
    
  }
);

export const editOrderPartInfoAction = createAsyncThunk(
  `${FeatureKey.ORDERS}/edit`,
  async (arg: { order: IOrdersListItem }) => {
    try{
      const { order } = arg;
    const sp = spfi(getSP());
    const list = sp.web.lists.getByTitle(ORDERSCONST.LIST_NAME);
    const result = await list.items
      .getById(+order.ID)
      .update({
        PPAPplannedweek: order.PPAPplannedweek,
        PPAPPartWeight: order.PPAPPartWeight,
        PPAPPartWeightCode: order.PPAPPartWeightCode,
        DrawingVersion: order.DrawingVersion,
        RevisionCode: order.RevisionCode
      })
      .then(async () => await list.items.getById(+order.ID)());
      return { order: result };
    }
    catch{
      return Promise.reject("Error when edit order part info.")
    }
  }
);
