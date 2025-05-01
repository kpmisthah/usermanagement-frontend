import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';


interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}
interface LoginPayload {
  username: string;
  password: string;
}

export const register = createAsyncThunk<
  { user: User; access_token: string },
  RegisterPayload,
  { rejectValue: string }
>('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const response = await api.post('/auth/signup', userData, { withCredentials: true });
    return response.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message || error.message || 'Registration failed';
    return rejectWithValue(message);
  }
});

export const login = createAsyncThunk<
  { user: User; access_token: string },
  LoginPayload,
  { rejectValue: string }
>('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const response = await api.post('/auth/signin', credentials, { withCredentials: true });
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || 'Login failed';
    return rejectWithValue(message);
  }
});

export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await api.post('/auth/logout', {}, { withCredentials: true });
    return;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Logout failed');
  }
});

export const refreshToken = createAsyncThunk<
  { user: User; access_token: string },
  void,
  { rejectValue: string }
>('auth/refreshToken', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/auth/refresh', { withCredentials: true });
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Refresh token failed');
  }
});

export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  profilePic?: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  isAuthenticated: boolean;
  message: string;
}

const initialState: AuthState = {
  user: null,
  accessToken: typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  isAuthenticated: typeof window !== 'undefined' ? !!localStorage.getItem('accessToken') : false,
  message: '',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = '';
    },
    updateProfile: (state, action) => {
      console.log(state,'state updaetd');
      
      state.user = { ...state.user, ...action.payload };
      console.log("updated state",state,action.payload,'payload');
      
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload.user;
        state.accessToken = action.payload.access_token;
        state.isAuthenticated = true;
        localStorage.setItem('accessToken', action.payload.access_token);
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
        localStorage.removeItem('accessToken');
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = '';
        state.user = action.payload.user;
        state.accessToken = action.payload.access_token;
        state.isAuthenticated = true;
        localStorage.setItem('accessToken', action.payload.access_token);
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
        localStorage.removeItem('accessToken');
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
        localStorage.removeItem('accessToken');
      })
      .addCase(logout.rejected, (state, action) => {
        state.isError = true;
        state.message = action.payload as string;
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
        localStorage.removeItem('accessToken');
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.access_token;
        state.isAuthenticated = true;
        localStorage.setItem('accessToken', action.payload.access_token);
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
        state.message = action.payload as string;
        localStorage.removeItem('accessToken');
      });
  },
});

export const { reset, updateProfile } = authSlice.actions;
export default authSlice.reducer;