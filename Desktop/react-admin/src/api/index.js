/*
* API request functions
* return promise object
*/
import ajax from "./ajax";

const BASE = '';
// login
export const reqLogin = (username,password) => ajax(BASE + '/login',{username,password},'POST');

// add user
export const reqAddUser = (user) => ajax(BASE + '/manage/user/add',user,'POST');