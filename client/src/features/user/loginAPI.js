let baseUrl = 'http://localhost:3001/api/login'

if (process.env.NODE_ENV === 'production') {
  baseUrl = 'https://aqueous-retreat-28973.herokuapp.com/api/login'
}

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
