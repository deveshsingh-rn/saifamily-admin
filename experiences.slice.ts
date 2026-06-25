import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Experience } from '@/experience';

export interface ExperiencesState {
  experiences: Experience[];
  loading: boolean;
  error: string | null;
}

const initialState: ExperiencesState = {
  experiences: [],
  loading: false,
  error: null,
};

const experiencesSlice = createSlice({
  name: 'experiences',
  initialState,
  reducers: {
    fetchExperiencesStart(state, action: PayloadAction<string | undefined>) {
      state.loading = true;
      state.error = null;
    },
    fetchExperiencesSuccess(state, action: PayloadAction<Experience[]>) {
      state.experiences = action.payload;
      state.loading = false;
    },
    fetchExperiencesFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    deleteExperienceStart(state, action: PayloadAction<string>) {
      state.loading = true; // Or a specific deleting state
      state.error = null;
    },
    deleteExperienceSuccess(state, action: PayloadAction<string>) {
      state.experiences = state.experiences.filter(
        (exp) => exp._id !== action.payload
      );
      state.loading = false;
    },
    deleteExperienceFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchExperiencesStart,
  fetchExperiencesSuccess,
  fetchExperiencesFailure,
  deleteExperienceStart,
  deleteExperienceSuccess,
  deleteExperienceFailure,
} = experiencesSlice.actions;

export default experiencesSlice.reducer;