<template>
  <el-dialog
    :model-value="dialogVisible"
    :title="dialogTitle"
    width="40%"
    @close="handleClose"
  >
    <el-form ref="formRef" :model="form" label-width="70px" :rules="rules">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item
        label="密码"
        prop="password"
        v-if="dialogTitle === '添加用户'"
      >
        <el-input v-model="form.password" type="password"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email"></el-input>
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="form.mobile"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { defineEmits, ref, defineProps, reactive, watch } from 'vue'
import { addUser, editUser } from '@/api/users'
import i18n from '@/i18n'
import { ElMessage } from 'element-plus'

const props = defineProps({
  dialogTitle: {
    type: String,
    default: '',
    required: true
  },
  dialogTableValue: {
    type: Object,
    default: () => {}
  }
})

const formRef = ref(null)

const form = reactive({
  username: '',
  password: '',
  email: '',
  mobile: '',
  id: ''
})

const rules = ref({
  username: [
    {
      required: true,
      message: 'Please select Activity zone',
      trigger: 'blur'
    }
  ],
  password: [
    {
      required: true,
      message: 'Please select Activity zone',
      trigger: 'blur'
    }
  ],
  email: [
    {
      required: true,
      message: 'Please select Activity zone',
      trigger: 'blur'
    },
    {
      type: 'email',
      message: '输入正确邮箱',
      trigger: ['blur', 'change']
    }
  ],
  mobile: [
    {
      required: true,
      message: 'Please select Activity zone',
      trigger: 'blur'
    }
  ]
})

watch(
  () => props.dialogTableValue,
  () => {
    console.log('刚刚获取到的数据', props.dialogTableValue)
    form.username = props.dialogTableValue.username
    form.password = props.dialogTableValue.password
    form.email = props.dialogTableValue.email
    form.mobile = props.dialogTableValue.mobile
    form.id = props.dialogTableValue.id
    console.log('要看的数据', form)
  },
  { deep: true, immediate: true }
)

const emits = defineEmits(['update:modelValue', 'initUserList'])

const handleClose = () => {
  emits('update:modelValue', false)
}

const handleConfirm = () => {
    console.log('form表单的传值', form)
  formRef.value.validate(async (valid) => {
    if (valid) {
      props.dialogTitle === '添加用户'
        ? await addUser(form)
        : await editUser(form)
      ElMessage({
        message: i18n.global.t('message.updeteSuccess'),
        type: 'success'
      })
      emits('initUserList')
      handleClose()
    } else {
      console.log('error submit!!')
      return false
    }
  })
}
</script>

<style lang="scss" scoped></style>
