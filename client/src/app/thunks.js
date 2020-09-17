import { createAsyncThunk } from '@reduxjs/toolkit'

import listAPI from '../features/lists/listsAPI'

const addList = createAsyncThunk('ADD_LIST', async listName => {
  return listAPI.addList(listName)
})

export { addList }
