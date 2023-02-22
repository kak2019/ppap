import { configureStore } from "@reduxjs/toolkit";
import { ordersReducer } from "./features/orders";
import { requestReducer } from './features/requests';


const store = configureStore({
  reducer: {
    orders: ordersReducer,
    request: requestReducer,
  },
});

export type AppDispatch = typeof store.dispatch;

export type RootState = ReturnType<typeof store.getState>;
export default store;
