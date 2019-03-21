import {SETLOG, 
    SET_DISPLAY, 
    SET_CURR_EVENT, 
    SET_RIGHT_MENU, 
    SET_DEFAULT_EVENT, 
    USER_INFO, 
    FRIEND_LIST,
    WEEK_OF,
    LOGOUT,
    SET_SLOTS} from './actionTypes';
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

export const setSlots = (slotsInAWeek = []) => ({
    type: SET_SLOTS,
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
