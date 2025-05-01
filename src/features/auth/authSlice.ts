import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api'; // Adjust path if needed

export interface User {
  id:number
  username: string;
  email:string;
  role:string
  profilePic?:string
}

export interface AuthState {
  user: User | null;
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  isAuthenticated:boolean
  message: string;
}

interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}
interface LoginPayload {
  username: string;
  password: string;
}
//register
export const register = createAsyncThunk<User ,RegisterPayload,{ rejectValue: string }
>
('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const response = await api.post('/auth/signup', userData);
    return response.data; 
  } catch (error: any) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return rejectWithValue(message);
  }
});
//login
export const login = createAsyncThunk<User,LoginPayload,{rejectValue:string}
>
('/auth/login',async(credentials,{rejectWithValue})=>{
  try {
    console.log("geting the crede: ",credentials)
    const response = await api.post('/auth/signin',credentials)
    console.log(response.data);
    return response.data.user
  } catch (error:any) {   
    const message = error.response?.data?.message || 'Login failed';
    return rejectWithValue(message);
  }
})
//logout
export const logout = createAsyncThunk('auth/logout',async(_,{rejectWithValue})=>{
  try {
    await api.post('/auth/logout',{},{withCredentials:true})
    return
  } catch (error:any) {
    return rejectWithValue(error.message || 'Logout failed');
  }
})

// Check Auth
export const checkAuth = createAsyncThunk<User, void, { rejectValue: string }>(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/auth/me', { withCredentials: true });
      return response.data.user; // Expect user object
    } catch (error: any) {
      const message = error.response?.data?.message || 'Authentication failed';
      return rejectWithValue(message);
    }
  }
);
const initialState: AuthState = {
  user: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
  isAuthenticated:false
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
    updateProfile:(state,action)=>{
      state.user = {...state.user,...action.payload}
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload
        state.isAuthenticated = true
        })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
        state.user = null;

      })
      .addCase(logout.fulfilled,(state)=>{
        state.user = null
      })
      .addCase(login.fulfilled,(state,action)=>{
        state.isLoading = false
        state.isAuthenticated=true
        state.isSuccess = true
        state.user = action.payload
      })
      .addCase(login.rejected,(state,action)=>{
        state.isError = true
        state.message = action.payload as string
      })
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.message = action.payload as string;
      })
  },
});

export const { reset,updateProfile } = authSlice.actions;
export default authSlice.reducer;