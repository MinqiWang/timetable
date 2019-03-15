
import axios from 'axios'
import baseURL from './config'

export const loginIn = (callback) => {
    axios.get("https://jsonplaceholder.typicode.com/posts")
    .then(res => callback(res))
    .catch(err => console.log(err))
}
