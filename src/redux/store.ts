// Example usage
import { configureStore } from '@reduxjs/toolkit';

interface User {
  id: string;
  name: string;
  email: string;
}

/*
These are examples that use a userSlice.reducer we do not have implemented.
We will need to implement our own reducers to put into our rootreducer to configure the redux store

const rootReducer = {
  user: userSlice.reducer,
  // ... add other reducers if needed
};

const store = configureStore({
  reducer: rootReducer,
  // ... add any additional configuration options here
});
*/
export const { addEntity, updateEntity, removeEntity } = userSlice.actions;
export default store;
