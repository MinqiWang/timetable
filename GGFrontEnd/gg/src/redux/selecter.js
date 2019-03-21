export const getLogState = state => state.common.isLogIn;
export const getDisplay = state => state.display.display;
export const getRightMenu = state => state.rightMenu.rightMenu;
export const getCurrentEvent = state => state.rightMenu.currentEvent;
export const getDefaultEvent = state => state.rightMenu.defaultEvent;
export const getDefaultEvent_Slots = state => state.rightMenu.defaultEvent.timetable_slots;
export const getDefaultEvent_Slots_byDay = (state, day) => getDefaultEvent_Slots(state)[day];
export const getUser = state => state.user.User;
export const getFriends = state => state.user.Friends;
export const getWeekOf = state => state.event.weekOf;
export const getSlots = state => state.event.slotsInAWeek;





