import { configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';
import logger from 'redux-logger';
import { combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';
import rootSaga from './saga';
import profileReducer from './profileSlice';

const reducers = combineReducers({
  profile: profileReducer,
});

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, reducers);

const sagaMiddleware = createSagaMiddleware();
const additionalMiddlewares = process.env.NODE_ENV === 'development' ? [sagaMiddleware, logger] : [sagaMiddleware];

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false, thunk: false }).concat(additionalMiddlewares),
});

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
