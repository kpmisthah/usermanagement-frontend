import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../features/auth/authSlice'
import { setupInterceptors } from "../services/setupInterceptors";
import adminReducer from '../features/admin/adminSlice'
export const store = configureStore({
    reducer:{
        auth:authReducer,
        admin:adminReducer
    },
})
setupInterceptors(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch