import { configureStore } from "@reduxjs/toolkit";
import { ordersReducer } from "./features/orders";
import { requestReducer } from './features/requests';
import { documentReducer } from './features/documents';


const store = configureStore({
  reducer: {
    orders: ordersReducer,
    request: requestReducer,
    documents: documentReducer,
  },
});

export type AppDispatch = typeof store.dispatch;

export type RootState = ReturnType<typeof store.getState>;
export default store;
