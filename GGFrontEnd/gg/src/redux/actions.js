import {SETLOG, SET_DISPLAY} from './actionTypes';

export const setLogState = isLogIn => ({
    type: SETLOG,
    payload: {
        isLogIn
    }
});

export const setDisplay = display => ({
    type: SET_DISPLAY,
    payload: {
        display
    }
});
