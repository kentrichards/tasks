const baseUrl = 'https://boiling-sierra-54801.herokuapp.com/api/tasks'

const addTask = async (text, listId) => {
  const userJSON = window.localStorage.getItem('savedUserJSON')
  const { token } = JSON.parse(userJSON)

  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ text, list: listId })
  })

  return response.json()
}

export default { addTask }
