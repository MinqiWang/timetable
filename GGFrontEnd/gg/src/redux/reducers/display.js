import {SET_DISPLAY} from '../actionTypes';

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
        default:
            return state;
    }
}