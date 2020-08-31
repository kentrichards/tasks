/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'

const initialState = []

const listsSlice = createSlice({
  name: 'lists',
  initialState,
  reducers: {
    storeLists: (_state, action) => {
      return [...action.payload]
    },
    toggleCompleted: (state, action) => {
      const { taskId, listId } = action.payload

      const currentList = state.find(list => list.id === listId)
      const taskToChange = currentList.tasks.find(task => task.id === taskId)
      taskToChange.completed = !taskToChange.completed
    }
  }
})

export const { storeLists, toggleCompleted } = listsSlice.actions

export default listsSlice.reducer
