import { createAction } from '@reduxjs/toolkit'

const storeData = createAction('STORE_DATA')
const setCurrentListId = createAction('SET_CURRENT_LIST_ID')
const toggleCompleted = createAction('TOGGLE_COMPLETED')
const addTask = createAction('ADD_TASK')
const deleteTask = createAction('DELETE_TASK')

export { storeData, setCurrentListId, toggleCompleted, addTask, deleteTask }
