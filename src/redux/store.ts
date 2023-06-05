import { configureStore } from '@reduxjs/toolkit';
import { usersReducer } from './usersSlice';

const store = configureStore({
  reducer: {
    users: usersReducer,
    // Add other reducers here if needed
  },
});

export default store;
