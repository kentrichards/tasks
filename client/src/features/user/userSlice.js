/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'

const initialState = {}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    storeAccountInfo: (state, action) => {
      const { id, username, dateCreated } = action.payload
      state.id = id
      state.name = username
      state.dateCreated = dateCreated
    }
  }
})

export const { storeAccountInfo } = userSlice.actions

export default userSlice.reducer
