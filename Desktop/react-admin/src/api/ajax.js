/*
* encapsulate axios, return promise object
* deal with request error
*/

import axios from 'axios';
import {message} from 'antd'

export default function ajax(url, data={},type='GET') {
    return new Promise((resolve,reject)=>{
        let promise;
        if (type === 'GET'){
            promise = axios.get(url,{
                params:data
            })
        }else {
            promise = axios.post(url,data)
        }
        promise.then(res=>{
            resolve(res.data);
        }).catch(error=>{
            message.error('Request fail, please try again!');
        })
    })

}