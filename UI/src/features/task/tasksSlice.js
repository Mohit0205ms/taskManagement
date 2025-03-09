import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tasks: []
}

export const tasksSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    fetchTaskList: (state, action) => {
      console.log(action);
      if(action?.payload?.tasks){
        state.tasks = action.payload.tasks;
      }
    },
    addTaskInList: (state, action) => {
      state.tasks = [...state.tasks, action.payload.task];
    },
    editTaskInList: (state, action) => {
      const list = state.tasks;
      const {id, title, desc} = action.payload.task;
      const updatedList = list.map((item)=>
        item.id === id ? {...item, title: title, desc: desc } : item
      )
      state.tasks = updatedList;
    }
  }
})

export const { fetchTaskList, addTaskInList, editTaskInList } = tasksSlice.actions;
export default tasksSlice.reducer;