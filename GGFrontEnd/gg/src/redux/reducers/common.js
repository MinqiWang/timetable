import {SETLOG, LOGIN, LOGOUT} from '../actionTypes';

const initialState = {
    isLogIn: false
}

export default function(state = initialState, action) {
    switch (action.type) {
        case LOGIN: {
            const {isLogIn} = action.payload;
            return {
                ...state,
                isLogIn
            }
        }
        default:
            return state;
    }
}