const baseUrl = 'https://boiling-sierra-54801.herokuapp.com/api/lists'

const { token } = JSON.parse(window.localStorage.getItem('savedUserJSON'))

const addList = async name => {
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
