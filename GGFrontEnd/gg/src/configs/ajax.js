
import axios from 'axios'
import baseURL from './config'

export const loginIn = (callback) => {
    axios.get(baseURL + "/auth/facebook/")
    .then(res => callback(res))
    .catch(err => console.log(err))
}
