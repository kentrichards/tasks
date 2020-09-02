/* eslint-disable no-param-reassign */
import { createReducer } from '@reduxjs/toolkit'

const initialState = {
  id: '',
  username: '',
  dateCreated: '',
  currentListId: '',
  lists: []
}

const reducer = createReducer(initialState, {
  // Common reducers
  STORE_DATA: (_state, action) => action.payload,
  // List reducers
  SET_CURRENT_LIST_ID: (state, action) => {
    state.currentListId = action.payload
  },
  // Task reducers
  TOGGLE_COMPLETED: (state, action) => {
    const { taskId } = action.payload
    const { lists, currentListId } = state

    const currentList = lists.find(list => list.id === currentListId)
    const taskToChange = currentList.tasks.find(task => task.id === taskId)

    taskToChange.completed = !taskToChange.completed
  }
})

export default reducer
