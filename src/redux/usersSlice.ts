import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the UserBioMap type
type UserBioMap = Record<string, string>;

interface UsersState {
  users: UserBioMap;
}

const initialState: UsersState = {
  users: {
    test_user_two: 'N/A',
    test_user_one: 'new test_user_one bio',
    testowo: 'N/A',
    ben: 'N/A',
    cheese: 'N/A',
    test_user_three: 'N/A',
    lemoinade: 'N/A',
    been: 'N/A',
    beeeen: 'N/A',
    beeeeen: 'N/A',
    cheeseweezus: 'N/A',
  },
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<UserBioMap>) => {
      state.users = action.payload;
    },
  },
});

console.log(usersSlice);
console.log(initialState);
export const { setUsers } = usersSlice.actions;
export const usersReducer = usersSlice.reducer;
