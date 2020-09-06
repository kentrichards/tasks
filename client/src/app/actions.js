import { createAction } from '@reduxjs/toolkit'

const storeData = createAction('STORE_DATA')
const setCurrentListId = createAction('SET_CURRENT_LIST_ID')
const addList = createAction('ADD_LIST')
const toggleCompleted = createAction('TOGGLE_COMPLETED')
const addTask = createAction('ADD_TASK')
const editTask = createAction('EDIT_TASK')
const moveTask = createAction('MOVE_TASK')
const deleteTask = createAction('DELETE_TASK')

export {
  storeData,
  setCurrentListId,
  addList,
  toggleCompleted,
  addTask,
  editTask,
  moveTask,
  deleteTask
}
