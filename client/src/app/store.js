import { configureStore } from '@reduxjs/toolkit'

import userReducer from '../features/user/userSlice'
import listsReducer from '../features/lists/listsSlice'

const reducer = {
  user: userReducer,
  lists: listsReducer
}

const store = configureStore({
  reducer,
  devTools: process.env.NODE_ENV !== 'production'
})

export default store
