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
    SET_SHOW_MESSAGE,
    SET_UPDATE_LIST, SET_DELETE_LIST, SET_CREATE_LIST, RESET_TODO_LIST,
    SET_SEARCH_FRIEND,
    SET_PENDING_REQUESTS,
    SET_MY_GROUPS,
    SET_OTHER_GROUPS,
    WATCHING_INFO,
    SET_FOCUS_EVENT_INVITEE,
    SET_FOCUS_EVENT_TOINVITE,
    SET_ADDING_INVITEES
    } from './actionTypes';

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

export const setWatching = (Watching=null) => ({
    type: WATCHING_INFO,
    payload: {
        Watching
    }
});

export const setFriends = (Friends = []) => ({
    type: FRIEND_LIST,
    payload: {
        Friends
    }
});

export const setMyGroupEvents = (myGroupEvents = {}) => ({
    type: SET_MY_GROUPS,
    payload: {
        myGroupEvents
    }
});

export const setOthersGroupEvents = (otherGroupEvents = {}) => ({
    type: SET_OTHER_GROUPS,
    payload: {
        otherGroupEvents
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

export const setWeekOf = (weekOf = weekOf(new Date())) => ({
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


export const setUpdateList = (toUpdateList = null) => ({
    type: SET_UPDATE_LIST,
    payload: {
        toUpdateList
    }
});

export const setDeleteList = (toDeleteList = null) => ({
    type: SET_DELETE_LIST,
    payload: {
        toDeleteList
    }
});

export const setCreateList = (toCreateList = null) => ({
    type: SET_CREATE_LIST,
    payload: {
        toCreateList
    }
});

export const resetToDoList = () => ({
    type: RESET_TODO_LIST,
    payload: {
    }
});

export const setSearchFriend = (searchFriend=null) => ({
    type: SET_SEARCH_FRIEND,
    payload: {
        searchFriend
    }
});

export const setPendingRequests = (pendingRequests={}) => ({
    type: SET_PENDING_REQUESTS,
    payload: {
        pendingRequests
    }
});

export const setFocusEventInvitees = (focusEventInvitees=[]) => ({
    type: SET_FOCUS_EVENT_INVITEE,
    payload: {
        focusEventInvitees
    }
});

export const setFocusEventToInvites = (focusEventToInvites=[]) => ({
    type: SET_FOCUS_EVENT_TOINVITE,
    payload: {
        focusEventToInvites
    }
});

export const setAddingInvitees = (addingInvitees=null) => ({
    type: SET_ADDING_INVITEES,
    payload: {
        addingInvitees
    }
});





















/***************************************************************************** */
// given the dateString, time of an timeslot, returns an date object.
export const toDate = (dateString = null, hour = 0, min = 0) => {
    let date = new Date();
    if (dateString) {
        let date_array = dateString.split("-");
        date.setFullYear(date_array[0], +date_array[1]-1, date_array[2]);
        date.setHours(hour);
        date.setMinutes(min);
    }
    return date;
}

// given the date object, returns the day of week
export const dayOfWeek = (date) => {
    return date.getDay();
}

//given the date object, or the week_num 
export const weekOf = (date, week_num = 0) => {
    let day_of_week = dayOfWeek(date);
    date.setDate(date.getDate() - day_of_week + week_num*7);
    
    let month = (date.getMonth()+1);
    let day = date.getDate();
    if (month < 10) month = '0' + month;
    if (day < 10) day = '0' + day;
    
    let week_of = +date.getFullYear() + '-' + month + '-' + day;
    return week_of;
}

export const dateString = (week_of, hour, min, dayOfWeek) => {
    let date = toDate(week_of, hour, min);
    date.setDate(date.getDate() + dayOfWeek);

    let month = (date.getMonth()+1);
    let day = date.getDate();
    if (month < 10) month = '0' + month;
    if (day < 10) day = '0' + day;
    
    let dateString = +date.getFullYear() + '-' + month + '-' + day;
    return dateString;
}

// export const dateStringToWeekOf = (dateString) => {
//     let date = dateString.split("-");
//     let d = new Date();
//     d.setFullYear(date[0], parseInt(date[1]), parseInt(date[2]));
    
//     d.setDate(d.getDate() - d.getDay());

//     let month = (d.getMonth()+1);
//     if (month < 10) {
//         month = '0'+month;
//     }
//     let week_of = +d.getFullYear() + '-' + month + '-' + d.getDate();
    
//     return week_of;
// }

// export const dateStringToDayofWeek = (dateString) => {
//     let date = dateString.split("-");
//     let d = new Date();
//     d.setFullYear(date[0], parseInt(date[1]), parseInt(date[2]));
//     return d.getDay();
// }
