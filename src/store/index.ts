import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import areaReducer from './slice/masterSlice';
import authReducer from './slice/authSlice';
import masterReducer from './slice/masterSlice';


import cartReducer from './slice/bookingSlice';
import langReducer from './slice/langSlice';


import persistStore from 'redux-persist/es/persistStore';


const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: [ 'auth', 'lang'] // only counter will be persisted
};

const reducers = combineReducers({
  area: areaReducer,
  auth: authReducer,
  cart: cartReducer,
  lang: langReducer,
  master: masterReducer,
});

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const presistore = persistStore(store);
export default store;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
