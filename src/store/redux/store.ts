import {
  applyMiddleware,
  combineReducers,
  configureStore,
  createStore,
} from '@reduxjs/toolkit';
import sheetReducer from './slices/actionSheetSlice';
import languageReducer from './slices/langSlice';
import thunk from 'redux-thunk';

const rootReducer = combineReducers({
  toggle: sheetReducer,
  languageToggle: languageReducer,
});

export const store = createStore(rootReducer, applyMiddleware(thunk));
