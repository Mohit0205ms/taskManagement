import {configureStore} from '@reduxjs/toolkit';
import tasksSlice from '../features/task/tasksSlice';

export const store = configureStore({
  reducer: {
    task: tasksSlice
  }
})