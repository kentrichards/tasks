import { createAction } from '@reduxjs/toolkit'

const storeData = createAction('STORE_DATA')
const setCurrentListId = createAction('SET_CURRENT_LIST_ID')
const toggleCompleted = createAction('TOGGLE_COMPLETED')

export { storeData, setCurrentListId, toggleCompleted }
