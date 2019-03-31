import {SET_OTHER_GROUPS, SET_MY_GROUPS, LOGOUT, SET_FOCUS_EVENT_INVITEE, SET_FOCUS_EVENT_TOINVITE, SET_ADDING_INVITEES} from '../actionTypes';

const defaultAddingInvitees = {invitees: []};
const initialState = {
    myGroupEvents: {},
    otherGroupEvents: {},
    focusEventInvitees: [],
    focusEventToInvites: [],
    addingInvitees: defaultAddingInvitees,
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
        case SET_FOCUS_EVENT_INVITEE: {
            const {focusEventInvitees} = action.payload;
            return {
                ...state,
                focusEventInvitees
            }
        }
        case SET_FOCUS_EVENT_TOINVITE: {
            const {focusEventToInvites} = action.payload;
            return {
                ...state,
                focusEventToInvites
            }
        }
        case SET_ADDING_INVITEES: {
            const {addingInvitees} = action.payload;
            return addingInvitees? {
                ...state,
                addingInvitees
            } : {...state,
                addingInvitees: defaultAddingInvitees
            }
        }
        case LOGOUT: {
            return initialState;
        }
        default:
            return state;
    }
}