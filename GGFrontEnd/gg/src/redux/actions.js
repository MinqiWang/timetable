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
    IS_DEFAULT,
    SET_TARGET_SLOT,
    SET_SHOW_MESSAGE} from './actionTypes';
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

export const setTargetSlot = (targetSlot = null) => ({
    type: SET_TARGET_SLOT,
    payload: {
        targetSlot
    }
});

export const setShowMessage = (showMessage = null) => ({
    type: SET_SHOW_MESSAGE,
    payload: {
        showMessage
    }
});

export const weekOfFromMilliSec = (week_num = 0) => {
    let date = new Date();
    let dayOfWeek = date.getDay();
    date.setDate(date.getDate() - dayOfWeek + week_num*7);
    let month = (date.getMonth()+1);
    if (month < 10) {
        month = '0'+month;
    }
    let week_of = +date.getFullYear() + '-' + month + '-' + date.getDate();
    return week_of;
}

export const dateString = (week_of, hour, min, dayOfWeek) => {
    let date = week_of.split("-");
    let d = new Date();
    d.setFullYear(date[0], parseInt(date[1])-1, parseInt(date[2]));
    d.setHours(hour);
    d.setMinutes(min);
    d.setDate(d.getDate() + dayOfWeek);

    let month = (d.getMonth()+1);
    if (month < 10) {
        month = '0'+month;
    }
    let dateString = +d.getFullYear() + '-' + month + '-' + d.getDate();
    return dateString;
}

export const dateStringToWeekOf = (dateString) => {
    let date = dateString.split("-");
    let d = new Date();
    d.setFullYear(date[0], parseInt(date[1]), parseInt(date[2]));
    
    d.setDate(d.getDate() - d.getDay());

    let month = (d.getMonth()+1);
    if (month < 10) {
        month = '0'+month;
    }
    let week_of = +d.getFullYear() + '-' + month + '-' + d.getDate();
    
    return week_of;
}

export const dateStringToDayofWeek = (dateString) => {
    let date = dateString.split("-");
    let d = new Date();
    d.setFullYear(date[0], parseInt(date[1]), parseInt(date[2]));
    return d.getDay();
}
