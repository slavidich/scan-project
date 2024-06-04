import { combineReducers } from "redux";
import authReduce from "./authReduce";

export default combineReducers({
    auth: authReduce
})
