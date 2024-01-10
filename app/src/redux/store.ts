import { configureStore } from '@reduxjs/toolkit'
import sokcetReducer from './socketSlice'

const store = configureStore({
    reducer: {
        socket: sokcetReducer
    }
})

export default store

export type TRootState = ReturnType<typeof store.getState>
export type TAppDispatch = typeof store.dispatch