const baseUrl = 'https://boiling-sierra-54801.herokuapp.com/api/login'

const login = async (username, password) => {
  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  })

  return response.json()
}

export default { login }
