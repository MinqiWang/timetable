export const getLogState = state => state.common.isLogIn;
export const getDisplay = state => state.display.display;
export const getRightMenu = state => state.rightMenu.rightMenu;
export const getIsDefault = state => state.event.isDefault;
export const getFocusEvent = state => state.event.focusedEvent;
export const getDefaultEvent_Slots = state => state.rightMenu.defaultEvent.timetable_slots;
export const getDefaultEvent_Slots_byDay = (state, day) => getDefaultEvent_Slots(state)[day];
export const getUser = state => state.user.User;
export const getFriends = state => state.user.Friends;


export const getMyGroupEvents = state => state.group.myGroupEvents;
export const getOthersGroupEvents = state => state.group.otherGroupEvents;


export const getWeekOf = state => state.event.weekOf;
export const getSlots = state => state.event.slotsInAWeek;
export const getAcceptSlots = state => state.event.acceptSlotsInAWeek;

export const getTargetSlot = state => state.event.targetSlot;
export const getShowMessage = state => state.message.showMessage;
export const getUpdateList = state => state.toDoLists.toUpdateList;
export const getDeleteList = state => state.toDoLists.toDeleteList;
export const getCreateList = state => state.toDoLists.toCreateList;

export const getSearchFriend = state => state.user.searchFriend;
export const getPendingRequests = state => state.user.pendingRequests;

export const getWatching = state => state.user.Watching;
export const getFocusEventInvitees = state => state.group.focusEventInvitees;
export const getFocusEventToInvites = state => state.group.focusEventToInvites;
export const getAddingInvitees = state => state.group.addingInvitees;

export const accessType = state => state.event.accessType;

export const getPage1 = state => state.group.page_num1;
export const getPage2 = state => state.group.page_num2;



