import { combineReducers } from 'redux';
import authSlice from './slices/auth';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { configureStore } from '@reduxjs/toolkit';

const reducer = combineReducers({
  auth: authSlice.reducer,
});

const persistedReducer = persistReducer(
  {
    key: 'root',
    version: 1,
    storage: storage,
  },
  reducer
);

const store = configureStore({ reducer: persistedReducer });

export const persistor = persistStore(store);

export default store;
