import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/userSlice";
import gameReducer from './features/gameSlice';
import { useSelector, TypedUseSelectorHook } from "react-redux";

export const store = configureStore({
    reducer: {
        userReducer,
        gameReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;