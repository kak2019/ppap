import { createSlice } from "@reduxjs/toolkit";
import { FeatureKey } from "../../featureKey";
import { fetchRequestByIdAction, addRequestAction } from "./action";
import { initialState, RequestStatus } from "./requestsSlice";
import { IRequestListItem } from '../../model';

const requestSlice = createSlice({
  name: FeatureKey.REQUESTS,
  initialState,
  reducers: {
    RequestStatusChanged(state, action) {
      state.statue = action.payload;
    },
    RequestItemChanged(state, action) {
      state.item = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRequestByIdAction.pending, (state, action) => {
        state.statue = RequestStatus.Loading;
      })
      .addCase(fetchRequestByIdAction.fulfilled, (state, action) => {
        state.statue = RequestStatus.Idle;
        state.item = action.payload as IRequestListItem;
      })
      .addCase(fetchRequestByIdAction.rejected, (state, action) => {
        state.statue = RequestStatus.Failed;
        state.message = action.payload as string;
      })
      .addCase(addRequestAction.pending, (state, action) => {
        state.statue = RequestStatus.Loading;
      })
      .addCase(addRequestAction.fulfilled, (state, action) => {
        const {request}  = action.meta.arg;
        state.statue = RequestStatus.Idle;
        state.item= request;
      })
      .addCase(addRequestAction.rejected, (state, action) => {
        state.statue = RequestStatus.Failed;
        state.message = action.payload as string;
      });
  },
});

export const {
  RequestStatusChanged,
  RequestItemChanged,
} = requestSlice.actions;
export const requestReducer = requestSlice.reducer;
