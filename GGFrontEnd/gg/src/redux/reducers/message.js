import {LOGOUT, SET_SHOW_MESSAGE} from '../actionTypes';

const defaultMessage = {
    show: false,
    canUserClose: true,
    header: "header",
    body: "body"
}

export const onEditMessage = {
    show: true,
    canUserClose: true,
    header: "On Editing",
    body: "You have unsaved event opened on the right side menu. Please save/cancel before performing other actions."
}

export const onWatchMessage = {
    show: true,
    canUserClose: true,
    header: "On Watching",
    body: "You can not perform this action when watching friend's timetable. Please go back to MyTimetable"
}

export const onReadOnlyMessage = {
    show: true,
    canUserClose: true,
    header: "On ReadOnly",
    body: "You can not perform this action. You are not the owner of this."
}

export const ErrorMessage = {
    show: true,
    canUserClose: true,
    header: "Error",
    body: "Please try again later"
}

export const onSaveMessage = {
    show: true,
    canUserClose: false,
    header: "On Saving",
    body: "This dialog will close once saving is done."
}

const initialState = {
    showMessage: defaultMessage
}

export default function(state = initialState, action) {
    switch (action.type) {
        case SET_SHOW_MESSAGE: {
            const {showMessage} = action.payload;
            return showMessage? {
                ...state,
                showMessage
            } : {
                ...state,
                showMessage: defaultMessage
            }
        }
        case LOGOUT: {
            return initialState
        }
        default:
            return state;
    }
}