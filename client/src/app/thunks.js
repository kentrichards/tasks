import { createAsyncThunk } from '@reduxjs/toolkit'

import listsAPI from '../features/lists/listsAPI'
import tasksAPI from '../features/tasks/tasksAPI'

// List thunks
const addList = createAsyncThunk('ADD_LIST', async listName => {
  return listsAPI.addList(listName)
})

// Task thunks
const addTask = createAsyncThunk('ADD_TASK', async task => {
  return tasksAPI.addTask(task.text, task.listId)
})

export { addList, addTask }
