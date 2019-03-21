import {SET_DISPLAY, LOGOUT} from '../actionTypes';

const initialState = {
    display: "SignInUp"
}

export default function(state = initialState, action) {
    switch (action.type) {
        case SET_DISPLAY: {
            const {display} = action.payload;
            return {
                ...state,
                display
            }
        }
        case LOGOUT: {
            return initialState
        }
        default:
            return state;
    }
}