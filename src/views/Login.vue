<template>
    <div class="login">
        <header class="header">
            <h2>登录</h2>
            <div class="box">
                <div>
                    <img src="" alt="">
                </div>

                <div class="login-box">
                    <el-form ref="formRef" style="max-width: 600px" :model="formDate" status-icon :rules="rules"
                        label-width="auto">

                        <el-form-item label="用户名" prop="loginId">
                            <el-input v-model="formDate.loginId" />
                        </el-form-item>

                        <el-form-item label="密码" prop="loginPwd">
                            <el-input v-model="formDate.loginPwd" type="password" />
                        </el-form-item>


                        <el-form-item>
                            <el-button type="primary" @click="submitForm(formRef)">
                                登录
                            </el-button>
                            <el-button @click="resetForm(formRef)">重置</el-button>
                            <el-button @click="router.push('/register')">注册</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </div>


        </header>
    </div>
</template>

<script setup lang="ts">
//导入组合式api
import { reactive, ref } from 'vue'
//导入element-plus的类型
import type { FormInstance, FormRules } from 'element-plus'
import {$Login} from '../api/admin'
//导入路由器
import { useRouter } from 'vue-router'
//返回路由器对象
const router = useRouter()
//定义一个ref对象绑定表单
const formRef = ref<FormInstance>()

//表单数据
const formDate = reactive({
    loginId: '',
    loginPwd: ''
})

//验证用户名
const validateLoginId = (rule: any, value: any, callback: any) => {
    if (value === '') {
        callback(new Error('请输入账号'))
    } else {      
        callback()
    }
}

//验证密码
const validateLoginPwd = (rule: any, value: any, callback: any) => {
    if (value === '') {
        callback(new Error('请输入密码'))
    } else {      
        callback()
    }
}

//验证对象
const rules = reactive<FormRules<typeof formDate>>({
    loginId: [{ validator: validateLoginId, trigger: 'blur' }],
    loginPwd: [{ validator: validateLoginPwd, trigger: 'blur' }],
})

//登录
const submitForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.validate((valid) => {
        if (valid) {
            $Login(formDate)
        } else {
            console.log('error submit!')
        }
    })
}

//重置
const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
}
</script>

<style scoped lang="scss">
.login {
    //渐变背景色
    // background: linear-gradient(to bottom ,#142334,#98b9df);
    width: 100vw;
    height: 100vh
}

.header {
    line-height: 70px;
    text-align: center;
}

.box {
    margin-top: 150px;
    width: 100%;
    background-color: pink;
}

.login-box {
    padding:20px
}
</style>