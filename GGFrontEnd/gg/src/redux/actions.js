import {SETLOG, 
    SET_DISPLAY,
    SET_RIGHT_MENU,
    USER_INFO, 
    FRIEND_LIST,
    WEEK_OF,
    LOGOUT,
    SET_SLOTS,
    SET_FOCUS_EVENT,
    IS_NOTDEFAULT,
    IS_DEFAULT} from './actionTypes';
import rightMenu from './reducers/rightMenu';

// {console.log(err); return 
export const logOut = (err) => ({
    type: LOGOUT,
    payload: {
        err
    }
});
// }};

export const setDisplay = display => ({
    type: SET_DISPLAY,
    payload: {
        display
    }
});

export const setRightMenu = rightMenu => ({
    type: SET_RIGHT_MENU,
    payload: {
        rightMenu
    }
});

export const setFocusEvent = (focusedEvent=null) => ({
    type: SET_FOCUS_EVENT,
    payload: {
        focusedEvent
    }
});

export const isDefault = () => ({
    type: IS_DEFAULT,
    payload: {}
});

export const isNotDefault = () => ({
    type: IS_NOTDEFAULT,
    payload: {}
});


export const setUser = (User=null) => ({
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

export const setSlots = (slotsInAWeek = []) => {
    return {
    type: SET_SLOTS,
    payload: {
        slotsInAWeek
    }
}};

export const setEventDetail = (eventDetail = []) => ({
    type: FRIEND_LIST,
    payload: {
        eventDetail
    }
});

export const setWeekOf = (weekOf = weekOfFromMilliSec()) => ({
    type: WEEK_OF,
    payload: {
        weekOf
    }
});


export const weekOfFromMilliSec = (week_num = 0, milisec = Date.now()) => {
    let date = new Date(milisec);
    let dayOfWeek = date.getDay();
    console.log(date.toISOString());
    console.log(dayOfWeek);
    
    let weekOfDate = new Date(milisec - 86400000*dayOfWeek + 86400000*7*week_num);
    let week_of = weekOfDate.toISOString().split('T')[0];
    return week_of;
}
