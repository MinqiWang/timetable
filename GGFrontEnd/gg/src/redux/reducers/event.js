import {SET_SLOTS, DETAIL_EVENT, WEEK_OF, SET_FOCUS_EVENT, IS_NOTDEFAULT, IS_DEFAULT, LOGOUT} from '../actionTypes';
import {weekOfFromMilliSec} from '../actions'

let EVENT_NAME = "default_event";
let EVENT_ID = "default_event_ID";

const default_focused = {event_id: EVENT_ID, event_name: EVENT_NAME,
    detail:[],
    timetable_slots: {"Sun": [], "Mon": [], 
"Tue": [], "Wed": [], "Thu": [], "Fri":[], "Sat":[]}};

const initialState = {
    slotsInAWeek: {"Sun": [], "Mon": [], 
    "Tue": [], "Wed": [], "Thu": [], "Fri":[], "Sat":[]},
    eventDetail: [],
    weekOf: weekOfFromMilliSec(),
    focusedEvent: default_focused,
    isDefault: false,
}

export default function(state = initialState, action) {
    switch (action.type) {
        case SET_SLOTS: {
            const {slotsInAWeek} = action.payload;
            return {
                ...state,
                slotsInAWeek
            }
        }
        case DETAIL_EVENT: {
            const {eventDetail} = action.payload;
            return {
                ...state,
                eventDetail
            }
        }
        case WEEK_OF: {
            const {weekOf} = action.payload;
            return {
                ...state,
                weekOf
            }
        }
        case SET_FOCUS_EVENT: {
            const {focusedEvent} = action.payload;
            return focusedEvent? {
                ...state,
                focusedEvent
            } : {
                ...state,
                focusedEvent: default_focused
            }
        }
        case IS_DEFAULT: {
            return {
                ...state,
                isDefault: true
            }
        }
        case IS_NOTDEFAULT: {
            return {
                ...state,
                isDefault: false
            }
        }
        case LOGOUT: {
            return initialState;
        }
        default:
            return state;
    }
}