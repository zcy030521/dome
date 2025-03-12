import axios from "axios";
import {baseURL_dev} from "../config/baseURL"

//初始化一个axios对象
const  instance = axios.create({
    baseURL: baseURL_dev,
    timeout: 30000,
});

//GET请求
export const $get =async (url: string, params:object = {}) => {
    let {data} = await instance.get(url, {params});
    return data;
}

//POST请求
export const $post = async (url: string, params:object = {}) => {
    let {data} = await instance.post(url, params);
    return data;
}