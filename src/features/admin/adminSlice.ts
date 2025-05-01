import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

interface AdminState {
  users: User[];
  loading: boolean;
  error: string | null;
}

const initialState: AdminState = {
  users: [],
  loading: false,
  error: null,
};

// 🔁 Thunks

export const getAllUsers = createAsyncThunk('admin/getUsers', async (search: string = '') => {
  const res = await api.get(`/admin/get-users?search=${search}`,)
  return res.data;
});

export const createNewUser = createAsyncThunk('admin/createUser', async (data: Partial<User>) => {
  const res = await api.post('/admin/create-user',data)
  return res.data;
});

export const editUser = createAsyncThunk('admin/editUser', async ({ id, data }: { id: number; data: Partial<User> }) => {
  const res = await api.put(`/admin/update-user/${id}`,data)
  return res.data;
});

export const removeUser = createAsyncThunk('admin/deleteUser', async (id: number) => {
  await api.delete(`'/admin/delete/${id}`)
  return id;
});

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch users
      .addCase(getAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch users';
      })

      // Create user
      .addCase(createNewUser.fulfilled, (state, action) => {
        state.users.push(action.payload);
      })

      // Edit user
      .addCase(editUser.fulfilled, (state, action) => {
        const index = state.users.findIndex((u) => u.id === action.payload.id);
        if (index !== -1) state.users[index] = action.payload;
      })

      // Delete user
      .addCase(removeUser.fulfilled, (state, action) => {
        state.users = state.users.filter((u) => u.id !== action.payload);
      });
  },
});

export default adminSlice.reducer;
