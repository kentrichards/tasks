import { createAction } from '@reduxjs/toolkit'

// Actions for synchronous reducers
const storeData = createAction('STORE_DATA')
const setCurrentListId = createAction('SET_CURRENT_LIST_ID')
const toggleCompleted = createAction('TOGGLE_COMPLETED')
const editTask = createAction('EDIT_TASK')
const moveTask = createAction('MOVE_TASK')
const deleteTask = createAction('DELETE_TASK')

export {
  storeData,
  setCurrentListId,
  toggleCompleted,
  editTask,
  moveTask,
  deleteTask
}
