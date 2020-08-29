import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import Spinner from '../common/Spinner'
import userAPI from '../features/user/userAPI'
import { storeAccountInfo } from '../features/user/userSlice'
import { storeLists } from '../features/lists/listsSlice'

const MainLayout = () => {
  const [dataLoaded, setDataLoaded] = useState(false)

  const dispatch = useDispatch()
  const user = useSelector(state => state.user)
  const lists = useSelector(state => state.lists)

  const fetchUserData = async ({ id, token }) => {
    const result = await userAPI.fetchData({ id, token })

    dispatch(storeAccountInfo({ ...result }))
    dispatch(storeLists(result.lists))

    setDataLoaded(true)
  }

  useEffect(() => {
    // Read the user credentials saved in localStorage
    const loggedInUser = window.localStorage.getItem('savedUserJSON')
    fetchUserData(JSON.parse(loggedInUser))
  }, []) // Will only run on the first render

  return (
    <div className="h-screen w-screen">
      {!dataLoaded ? (
        <div className="h-screen w-screen flex justify-center items-center">
          <Spinner styles="text-blue-500 h-10 w-10" />
        </div>
      ) : (
        <div className="flex flex-col items-center h-full">{user.name}</div>
      )}
    </div>
  )
}

export default MainLayout
