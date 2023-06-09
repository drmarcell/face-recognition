// DUCKS pattern
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: {
    id: null,
    name: null,
    email: null,
    entries: null
  }
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    getUserFromLocalStorage: (state) => {
      const localUser = JSON.parse(localStorage.getItem('user'));
      if (localUser) {
        console.log('localuser found');
        return state = localUser;
      }
    },
    loginUser: (state, action) => {
      localStorage.setItem('user', JSON.stringify(action.payload));
      return state = action.payload
    },
    setUserEntries: (state, action) => {
      state.user.entries = action.payload
      localStorage.setItem('user', JSON.stringify(state))
    },
    logoutUser: (state) => {
      state.user.id = null;
      state.user.name = null;
      state.user.email = null;
      state.user.entries = null;
      localStorage.removeItem('user');
    }
  }
});

// createSlice has built-in action creator
export const { getUserFromLocalStorage, loginUser, setUserEntries, logoutUser } = userSlice.actions;
export default userSlice.reducer;
