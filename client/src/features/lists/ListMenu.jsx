import React from 'react'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import MenuItem from './MenuItem'
import { setCurrentListId } from '../user/userSlice'
import { CloseIcon, ListIcon, CreateIcon, ExitIcon } from '../../common/Icons'

const ListMenu = ({ isOpen, setIsOpen }) => {
  const history = useHistory()
  const dispatch = useDispatch()
  const lists = useSelector(state => state.lists)

  const signOutUser = () => {
    window.localStorage.removeItem('savedUserJSON')
    history.push('/login')
  }

  return (
    <div className={isOpen ? 'sidebar block' : 'sidebar'}>
      <button
        type="button"
        className="p-1 rounded hover:bg-white focus:bg-white focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <CloseIcon styles="sm:hidden" />
      </button>
      <ul className="flex flex-col w-full sm:mt-24 mb-2 sm:pt-4">
        {lists.map(list => (
          <MenuItem
            key={list.id}
            text={list.name}
            icon={<ListIcon />}
            count={list.tasks.length}
            handleClick={() => dispatch(setCurrentListId(list.id))}
          />
        ))}

        <MenuItem text="Create new list" icon={<CreateIcon />} />

        <hr className="mx-4 my-2 border-gray-300" />

        <MenuItem
          text="Sign out"
          icon={<ExitIcon />}
          handleClick={() => signOutUser()}
        />
      </ul>
    </div>
  )
}

ListMenu.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired
}

export default ListMenu
