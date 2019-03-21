import { combineReducers } from "redux";
import common from "./common";
import display from "./display";
import rightMenu from "./rightMenu";
import user from "./user";
import event from "./event";

export default combineReducers({ display, rightMenu, user, event });