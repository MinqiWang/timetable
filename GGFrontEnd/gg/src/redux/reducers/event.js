import {SET_SLOTS, 
    DETAIL_EVENT, 
    WEEK_OF, 
    SET_FOCUS_EVENT, 
    IS_NOTDEFAULT, 
    IS_DEFAULT,
    SET_TARGET_SLOT, 
    LOGOUT} from '../actionTypes';
import {weekOfFromMilliSec} from '../actions'

let EVENT_NAME = "default_event";
let EVENT_ID = "default_event_ID";

/*
{"detail":{"id":2,"text_content":"Hello world!","media_content_urls":"","place":"UTSC","event_name":"event1"},"timetable_slots":{"Sun":[],"Mon":[{"id":3,"event_id":2,"event_name":"event1","event_has_detail":1,"start_time":"8:45:00","length":15,"week_of":"2019-03-17","day_of_the_week":1,"is_repeating":0,"slot_id":null,"obscured_week":null},
*/
const default_focused = {
    detail: {id: EVENT_ID, event_name: EVENT_NAME, text_content: "", media_content_urls: "", 
    place: ""},
    timetable_slots: {"Sun": [], "Mon": [], 
"Tue": [], "Wed": [], "Thu": [], "Fri":[], "Sat":[]}};

const default_targetSlot = {    
    isDragging: false,
    isResizing: false,
    id: "default_targetSlot",
    original_height: 0,
    original_y: 0,
    original_mouse_y: 0,
    difference_y: 0,
    minimum_bound: 0,
    maximum_bound: 0
};

const initialState = {
    slotsInAWeek: {"Sun": [], "Mon": [], 
    "Tue": [], "Wed": [], "Thu": [], "Fri":[], "Sat":[]},
    eventDetail: [],
    weekOf: weekOfFromMilliSec(),
    focusedEvent: default_focused,
    isDefault: false,
    targetSlot: default_targetSlot
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
        case SET_TARGET_SLOT: {
            const {targetSlot} = action.payload;
            return targetSlot? {
                ...state,
                targetSlot
            } : {
                ...state,
                targetSlot: default_targetSlot
            }
        }
        case LOGOUT: {
            return initialState;
        }
        default:
            return state;
    }
}