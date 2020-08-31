const baseUrl = 'https://boiling-sierra-54801.herokuapp.com/api/users'

const register = async (username, password) => {
  if (username.length < 4) {
    return { error: 'Username must be at least 4 characters' }
  }

  if (password.length < 8) {
    return { error: 'Password must be at least 8 characters' }
  }

  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  })

  return response.json()
}

const fetchData = async ({ id, token }) => {
  const response = await fetch(`${baseUrl}/${id}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  })

  return response.json()
}

export default { register, fetchData }
