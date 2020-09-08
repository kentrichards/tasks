export const selectLists = state => state.lists

export const selectCurrentList = state =>
  state.lists.find(list => list.id === state.currentListId)

export const selectOtherLists = state =>
  state.lists.filter(list => list.id !== state.currentListId)
