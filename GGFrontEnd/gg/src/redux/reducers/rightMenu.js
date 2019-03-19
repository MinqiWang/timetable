import {SET_RIGHT_MENU, SET_CURR_EVENT} from '../actionTypes';

const initialState = {
    rightMenu: "Close",
    currentEvent: null
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
        case SET_CURR_EVENT: {
            const {currentEvent} = action.payload;
            return {
                ...state,
                currentEvent
            }
        }
        default:
            return state;
    }
}