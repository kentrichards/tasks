/* eslint-disable no-param-reassign */
import { createReducer } from '@reduxjs/toolkit'

import { addList, addTask } from './thunks'

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
  [addList.fulfilled]: (state, action) => {
    // Save the list and switch to it
    state.lists.push(action.payload)
    state.currentListId = action.payload.id
  },
  // Task reducers
  TOGGLE_COMPLETED: (state, action) => {
    const { lists, currentListId } = state

    const listToChange = lists.find(list => list.id === currentListId)
    const taskToChange = listToChange.tasks.find(
      task => task.id === action.payload
    )

    taskToChange.completed = !taskToChange.completed
  },
  [addTask.fulfilled]: (state, action) => {
    const { lists, currentListId } = state

    const listToChange = lists.find(list => list.id === currentListId)
    listToChange.tasks.push(action.payload)
  },
  EDIT_TASK: (state, action) => {
    const { lists, currentListId } = state
    const { id, text } = action.payload

    const listToChange = lists.find(list => list.id === currentListId)
    const taskToChange = listToChange.tasks.find(task => task.id === id)

    taskToChange.text = text
  },
  MOVE_TASK: (state, action) => {
    const { lists, currentListId } = state
    const { taskToMove, newListId } = action.payload

    // Add task to the new list
    const newList = lists.find(list => list.id === newListId)
    newList.tasks.push(taskToMove)

    // Remove task from old list
    const oldList = lists.find(list => list.id === currentListId)
    oldList.tasks = oldList.tasks.filter(task => task.id !== taskToMove.id)
  },
  DELETE_TASK: (state, action) => {
    const { lists, currentListId } = state

    const listToChange = lists.find(list => list.id === currentListId)
    listToChange.tasks = listToChange.tasks.filter(
      task => task.id !== action.payload
    )
  }
})

export default reducer
