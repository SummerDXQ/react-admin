/*
* API request functions
* return promise object
*/
import ajax from "./ajax";
import jsonp from 'jsonp';
import {message} from 'antd';

const BASE = '';
// login
export const reqLogin = (username,password) => ajax(BASE + '/login',{username,password},'POST');

// add user
export const reqAddUser = (user) => ajax(BASE + '/manage/user/add',user,'POST');

// jsonp request
export const reqWeather = (city) => {
    const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`;
    return new Promise((resolve,reject)=>{
        jsonp(url,{},(err,data)=>{
                if(!err && data.status==='success'){
                    const {dayPictureUrl,weather}= data.results[0].weather_data[0];
                    return resolve({dayPictureUrl:dayPictureUrl,weather:weather});
                }else {
                    message.error('Request weather data failed!')
                }
            })
        }
    )
}

// get category list
export const reqCategory = (parentId) => ajax(BASE + '/manage/category/list', {parentId});

// add category
export const reqAddCategory = (categoryName,parentId) => ajax(BASE + '/manage/category/add', {categoryName,parentId},'POST');

// update category
export const reqUpdateCategory = (categoryId,categoryName) => ajax(BASE + '/manage/category/update', {categoryId,categoryName},'POST');

// product list
export const reqProducts = (pageNum,pageSize) => ajax(BASE + `/manage/product/list`,{pageNum,pageSize});

// search product by name or description
export const reqSearchProducts = ({pageNum,pageSize, searchName, searchType}) => ajax(BASE + `/manage/product/search`,{
    pageNum,
    pageSize,
    [searchType] : searchName
});

// get category base on category ID
export const reqCategoryInfo = (categoryId) => ajax(BASE + `/manage/category/info`,{categoryId});

// update product status
export const reqUpdateStatus = (productId,status) => ajax(BASE + `/manage/product/updateStatus`,{productId,status},'POST');

// delete Image
export const reqDeleteImg = (name) => ajax(BASE+'/manage/img/delete',{name},'POST');