import { combineReducers } from "redux";
import common from "./common";
import display from "./display";
import rightMenu from "./rightMenu";

export default combineReducers({ common, display, rightMenu });