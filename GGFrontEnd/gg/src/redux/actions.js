import {SETLOG, SET_DISPLAY, SET_CURR_EVENT, SET_RIGHT_MENU, SET_DEFAULT_EVENT, USER_INFO, FRIEND_LIST} from './actionTypes';
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

export const setCurrEvent = (currentEvent=null) => ({
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

export const setDefaultEvent = defaultEvent => ({
    type: SET_DEFAULT_EVENT,
    payload: {
        defaultEvent
    }
});

export const setUser = (User = null) => ({
    type: USER_INFO,
    payload: {
        User
    }
});

export const setFriends = (Friends = []) => ({
    type: FRIEND_LIST,
    payload: {
        Friends
    }
});

export const setSlots = (slotsInAWeek = []) => ({
    type: USER_INFO,
    payload: {
        slotsInAWeek
    }
});

export const setEventDetail = (eventDetail = []) => ({
    type: FRIEND_LIST,
    payload: {
        eventDetail
    }
});

