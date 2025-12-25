import { createSlice } from '@reduxjs/toolkit';
import userService from '../services/users';

const userSlice = createSlice({
  name: 'user',
  initialState: { currentUser: null, allUsers: [] },
  reducers: {
    setUser(state, action) {
      state.currentUser = action.payload;
    },
    clearUser(state) {
      state.currentUser = null;
    },
    setUsers(state, action) {
      state.allUsers = action.payload;
    },
  },
});

export const { setUser, clearUser, setUsers } = userSlice.actions;

export const initializeUsers = () => {
  return async (dispatch) => {
    const users = await userService.getAll();
    dispatch(setUsers(users));
  };
};

export default userSlice.reducer;
