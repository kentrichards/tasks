const baseUrl = 'https://boiling-sierra-54801.herokuapp.com/api/lists'

const addList = async name => {
  const userJSON = window.localStorage.getItem('savedUserJSON')
  const { token } = JSON.parse(userJSON)

  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ name })
  })

  return response.json()
}

export default { addList }
