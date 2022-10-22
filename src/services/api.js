import axios from 'axios'

const api = axios.create({
    baseURL : 'https://whande1developerbackend.herokuapp.com/api/v1/'
})

export default api
