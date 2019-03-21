import {SET_SLOTS, DETAIL_EVENT, WEEK_OF} from '../actionTypes';
import {weekOfFromMilliSec} from '../actions'


const initialState = {
    slotsInAWeek: {"Sun": [], "Mon": [], 
    "Tue": [], "Wed": [], "Thu": [], "Fri":[], "Sat":[]},
    eventDetail: [],
    weekOf: weekOfFromMilliSec()
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
        default:
            return state;
    }
}