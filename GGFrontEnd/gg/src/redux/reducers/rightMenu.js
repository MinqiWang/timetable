import {LOGOUT, SET_RIGHT_MENU} from '../actionTypes';

const initialState = {
    rightMenu: "Close",
}

export default function(state = initialState, action) {
    switch (action.type) {
        case SET_RIGHT_MENU: {
            const {rightMenu} = action.payload;
            return {
                ...state,
                rightMenu
            }
        }
        case LOGOUT: {
            return initialState
        }
        default:
            return state;
    }
}