import {SET_OTHER_GROUPS, SET_MY_GROUPS, LOGOUT} from '../actionTypes';

const initialState = {
    myGroupEvents: {},
    otherGroupEvents: {}
}

export default function(state = initialState, action) {
    switch (action.type) {
        case SET_MY_GROUPS: {
            const {myGroupEvents} = action.payload;
            return {
                ...state,
                myGroupEvents
            }
        }
        case SET_OTHER_GROUPS: {
            const {otherGroupEvents} = action.payload;
            return {
                ...state,
                otherGroupEvents
            }
        }
        default:
            return state;
    }
}