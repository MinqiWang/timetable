import {SET_SLOTS, DETAIL_EVENT} from '../actionTypes';

const initialState = {
    slotsInAWeek: [],
    eventDetail: []
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
        default:
            return state;
    }
}