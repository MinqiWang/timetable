import {LOGOUT, SET_UPDATE_LIST, SET_DELETE_LIST, SET_CREATE_LIST} from '../actionTypes';

const initialState = {
    toUpdateList: {},
    toDeleteList: [],
    toCreateList: {},
}

export default function(state = initialState, action) {
    switch (action.type) {
        case SET_UPDATE_LIST: {
            const {toUpdateList} = action.payload;
            return {
                ...state,
                toUpdateList
            }
        }
        case SET_DELETE_LIST: {
            const {toDeleteList} = action.payload;
            return {
                ...state,
                toDeleteList
            }
        }
        case SET_CREATE_LIST: {
            const {toCreateList} = action.payload;
            return {
                ...state,
                toCreateList
            }
        }
        case LOGOUT: {
            return initialState
        }
        default:
            return state;
    }
}