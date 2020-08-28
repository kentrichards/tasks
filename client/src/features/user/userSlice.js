/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'

const initialState = {}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    storeData: (state, action) => {
      const { id, username, lists, dateCreated } = action.payload

      state.id = id
      state.name = username
      state.lists = lists
      state.dateCreated = dateCreated
    }
  }
})

export const { storeData } = userSlice.actions

export default userSlice.reducer
