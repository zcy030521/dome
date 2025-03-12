import {$get,$post} from '../utils/request'
 
export const $Login = (params:object) => {
     let ret = $get('/login',params)
     console.log(ret);
}

export const $Register = (params:object) => {
     
}