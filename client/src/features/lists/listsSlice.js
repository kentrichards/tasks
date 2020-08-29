/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'

const initialState = []

const listsSlice = createSlice({
  name: 'lists',
  initialState,
  reducers: {
    storeLists: (state, action) => {
      state.push(...action.payload)
    }
  }
})

export const { storeLists } = listsSlice.actions

export default listsSlice.reducer
