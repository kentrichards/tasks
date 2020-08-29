import React from 'react'
import { useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import MenuItem from './MenuItem'
import { setCurrentListId } from '../user/userSlice'
import { ListIcon, CreateIcon, ExitIcon } from '../../common/Icons'

const ListMenu = () => {
  const history = useHistory()
  const dispatch = useDispatch()
  const lists = useSelector(state => state.lists)

  const signOutUser = () => {
    window.localStorage.removeItem('savedUserJSON')
    history.push('/login')
  }

  return (
    <div className="flex-auto flex-grow-0 flex-shrink-0 overflow-auto w-56 mx-4 py-4">
      <ul className="flex flex-col w-full mt-24 mb-2 pt-4">
        {lists.map(list => (
          <MenuItem
            key={list.id}
            text={list.name}
            icon={<ListIcon />}
            count={list.tasks.length}
            handleClick={() => dispatch(setCurrentListId(list.id))}
          />
        ))}

        <MenuItem
          text="Create new list"
          icon={<CreateIcon />}
          colour="text-green-400"
        />

        <hr className="mx-4 my-2 border-gray-300" />

        <MenuItem
          text="Sign out"
          icon={<ExitIcon />}
          colour="text-red-400"
          handleClick={() => signOutUser()}
        />
      </ul>
    </div>
  )
}

export default ListMenu
