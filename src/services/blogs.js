import axios from 'axios'
const baseUrl = 'http://localhost:3001/api/blogs'

let token = null
let baseConfig = null
const setToken = newToken => {
  token = `${newToken}`
  baseConfig = {
    headers: { Authorization: token }
  }
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async newObject => {
  try {
    const response = await axios.post(baseUrl, newObject, baseConfig)
    return response.data
  } catch (exception) {
    return exception.response.data
  }
}

const update = async (id, newObject) => {
  try {
    const response = await axios.put(`${baseUrl}/${id}`, newObject)
    return response.data
  } catch (exception) {
    return exception.response.data
  }
}

const remove = async (id) => {
  try {
    const response = await axios.delete(`${baseUrl}/${id}`, baseConfig)
    return response.data
  } catch (exception) {
    console.log(exception.response.data)
    return exception.response.data
  }
}

export default { getAll, create, update, remove, setToken }