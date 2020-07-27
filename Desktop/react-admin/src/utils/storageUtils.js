/*
* store info in localstorage
*/
import store from 'store';

const USER_KEY = 'user_key';
export default {
    // save user info
    saveUser(user){
        store.set(USER_KEY,user);
    },
    // get user info
    getUser(){
        return store.get(USER_KEY) || {};
    },
    // remove user info
    removeUser(){
        store.remove(USER_KEY);
    }
}