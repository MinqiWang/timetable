import {USER_INFO, FRIEND_LIST, LOGOUT, SET_SEARCH_FRIEND, SET_PENDING_REQUESTS, WATCHING_INFO} from '../actionTypes';

const initialState = {
    User: null,
    Friends: [],
    Watching: null,
    searchFriend: null,
    pendingRequests: {},
}

export default function(state = initialState, action) {
    switch (action.type) {
        case USER_INFO: {
            const {User} = action.payload;
            return {
                ...state,
                User
            }
        }
        case FRIEND_LIST: {
            const {Friends} = action.payload;
            return {
                ...state,
                Friends
            }
        }
        case SET_SEARCH_FRIEND: {
            const {searchFriend} = action.payload;
            return {
                ...state,
                searchFriend
            }
        }
        case SET_PENDING_REQUESTS: {
            const {pendingRequests} = action.payload;
            return {
                ...state,
                pendingRequests
            }
        }
        case WATCHING_INFO: {
            const {Watching} = action.payload;
            return {
                ...state,
                Watching
            }
        }
        case LOGOUT: {
            return initialState
        }
        default:
            return state;
    }
}