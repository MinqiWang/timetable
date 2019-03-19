import {SETLOG, SET_DISPLAY, SET_CURR_EVENT, SET_RIGHT_MENU} from './actionTypes';
import rightMenu from './reducers/rightMenu';

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

export const setCurrEvent = currentEvent => ({
    type: SET_CURR_EVENT,
    payload: {
        currentEvent
    }
});

export const setRightMenu = rightMenu => ({
    type: SET_RIGHT_MENU,
    payload: {
        rightMenu
    }
});
