const baseUrl = 'https://boiling-sierra-54801.herokuapp.com/api/tasks'

const { token } = JSON.parse(window.localStorage.getItem('savedUserJSON'))

const addTask = async (text, listId) => {
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
