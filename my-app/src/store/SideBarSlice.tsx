

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface SideBarItem {
  key: string;
  label: string;
  tooltip: string;
  icon: string;
  subItem: { label: string; suburl: string }[];
}

interface SideBarState {
  sideBarData: SideBarItem[];
  loading: boolean;
  error: string | null;
}

const initialState: SideBarState = {
  sideBarData: [],
  loading: false,
  error: null,
};


export const fetchSideBarData = createAsyncThunk<SideBarItem[]>(
  "sidebar/fetchSideBarData",
  async () => {
    const response = await fetch(
      "https://cclm-poc.fermion.in/api/v1/masters/navigation"
    );
    if (!response.ok) {
      throw new Error("Failed to fetch customer data");
    }
    const {data} = await response.json();
    return data as SideBarItem[];
  }
);

const sideBarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSideBarData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSideBarData.fulfilled, (state, action) => {
        state.loading = false;
        state.sideBarData = action.payload; 
      })
      .addCase(fetchSideBarData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong";
      });
  },
});

export default sideBarSlice.reducer;
