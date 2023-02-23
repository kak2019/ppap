import { createSlice } from "@reduxjs/toolkit";
import { FeatureKey } from "../../featureKey";
import {
  fetchByIdAction,
  addRequestAction,
  fetchRequestListIdAction,
} from "./action";
import { initialState, RequestStatus } from "./requestsSlice";
import { IRequestListItem } from "../../model";

const requestSlice = createSlice({
  name: FeatureKey.REQUESTS,
  initialState,
  reducers: {
    RequestStatusChanged(state, action) {
      state.statue = action.payload;
    },
    RequestItemChanged(state, action) {
      state.item = action.payload;
    },
    RequestListIdChange(state, action) {
      state.listId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRequestListIdAction.pending, (state, action) => {
        state.statue = RequestStatus.Loading;
      })
      .addCase(fetchRequestListIdAction.fulfilled, (state, action) => {
        state.statue = RequestStatus.Idle;
        state.listId = action.payload as string;
      })
      .addCase(fetchRequestListIdAction.rejected, (state, action) => {
        state.statue = RequestStatus.Failed;
        state.message = action.payload as string;
      })
      .addCase(fetchByIdAction.pending, (state, action) => {
        state.statue = RequestStatus.Loading;
      })
      .addCase(fetchByIdAction.fulfilled, (state, action) => {
        state.statue = RequestStatus.Idle;
        state.item = action.payload as IRequestListItem;
      })
      .addCase(fetchByIdAction.rejected, (state, action) => {
        state.statue = RequestStatus.Failed;
        state.message = action.payload as string;
      })
      .addCase(addRequestAction.pending, (state, action) => {
        state.statue = RequestStatus.Loading;
      })
      .addCase(addRequestAction.fulfilled, (state, action) => {
        const { request } = action.meta.arg;
        state.statue = RequestStatus.Idle;
        state.item = request;
      })
      .addCase(addRequestAction.rejected, (state, action) => {
        state.statue = RequestStatus.Failed;
        state.message = action.payload as string;
      });
  },
});

export const { RequestStatusChanged, RequestItemChanged, RequestListIdChange } =
  requestSlice.actions;
export const requestReducer = requestSlice.reducer;
