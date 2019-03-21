import {USER_INFO, FRIEND_LIST, LOGOUT} from '../actionTypes';

const initialState = {
    User: null,
    Friends: [],
}

export default function(state = initialState, action) {
    switch (action.type) {
        case USER_INFO: {
            const {User} = action.payload;
            console.log(action.payload);
            return {
                ...state,
                User
            }
        }
        case FRIEND_LIST: {
            const {Friends} = action.payload;
            return {
                ...state,
                Friends
            }
        }
        case LOGOUT: {
            console.log("why logout?");
            return initialState
        }
        default:
            return state;
    }
}