/* eslint-disable no-param-reassign */
import { createReducer, nanoid } from '@reduxjs/toolkit'

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
    const { lists, currentListId } = state

    const listToChange = lists.find(list => list.id === currentListId)
    const taskToChange = listToChange.tasks.find(
      task => task.id === action.payload
    )

    taskToChange.completed = !taskToChange.completed
  },
  ADD_TASK: (state, action) => {
    const { lists, currentListId } = state

    const newTask = {
      id: nanoid(),
      text: action.payload,
      date: new Date().toISOString(),
      completed: false
    }

    const listToChange = lists.find(list => list.id === currentListId)
    listToChange.tasks.push(newTask)
  },
  EDIT_TASK: (state, action) => {
    const { lists, currentListId } = state
    const { id, text } = action.payload

    const listToChange = lists.find(list => list.id === currentListId)
    const taskToChange = listToChange.tasks.find(task => task.id === id)

    taskToChange.text = text
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
