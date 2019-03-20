import {SET_RIGHT_MENU, SET_CURR_EVENT, SET_DEFAULT_EVENT} from '../actionTypes';

const initialState = {
    rightMenu: "Close",
    currentEvent: null,
    defaultEvent: {detail:[],
        timetable_slots: {"Sun": [], "Mon": [], 
    "Tue": [], "Wed": [], "Thu": [], "Fri":[], "Sat":[]}}
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
        case SET_DEFAULT_EVENT: {
            const {defaultEvent} = action.payload;
            return {
                ...state,
                defaultEvent
            }
        }
        default:
            return state;
    }
}