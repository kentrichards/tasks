import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'

import Spinner from '../common/Spinner'
import userAPI from '../features/user/userAPI'
import { storeData, setCurrentListId } from './actions'
import ListMenu from '../features/lists/ListMenu'
import TaskView from '../features/tasks/TaskView'

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [dataLoaded, setDataLoaded] = useState(false)
  const dispatch = useDispatch()

  const fetchUserData = async ({ id, token }) => {
    const result = await userAPI.fetchData({ id, token })

    dispatch(storeData({ ...result }))

    if (result.lists.length > 0) {
      dispatch(setCurrentListId(result.lists[0].id))
      // Else dispatch non-ideal state SVG
    }

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
        <div className="flex justify-center h-full">
          <ListMenu isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
          <TaskView openSidebar={() => setSidebarOpen(true)} />
        </div>
      )}
    </div>
  )
}

export default MainLayout
