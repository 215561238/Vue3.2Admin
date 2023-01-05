<template>
  <el-card>
    <el-row :gutter="20" class="header">
      <el-col :span="7">
        <el-input
          :placeholder="$t('table.placeholder')"
          clearable
          v-model="queryForm.query"
        ></el-input>
      </el-col>
      <el-button type="primary" :icon="Search" @click="initGetUserList">{{
        $t('table.search')
      }}</el-button>
      <el-button type="primary" @click="handleDialogValue()">{{
        $t('table.adduser')
      }}</el-button>
    </el-row>
    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column
        :width="item.width"
        :prop="item.prop"
        :label="$t(`table.${item.label}`)"
        v-for="(item, index) in options"
        :key="index"
      >
        <template v-slot="{ row }" v-if="item.prop === 'mg_state'">
          <el-switch v-model="row.mg_state" @change="changeState(row)" />
        </template>
        <template v-slot="{ row }" v-else-if="item.prop === 'create_time'">
          <!-- <el-switch v-model="row.create_time" /> -->
          {{ $filters.filetrTimes(row.create_time) }}
        </template>
        <template #default="{ row }" v-else-if="item.prop === 'action'">
          <el-button
            type="primary"
            size="small"
            :icon="Edit"
            @click="handleDialogValue(row)"
          ></el-button>
          <el-button type="warning" size="small" :icon="Setting"></el-button>
          <el-button
            type="danger"
            size="small"
            :icon="Delete"
            @click="delUser(row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:current-page="queryForm.pagenum"
      v-model:page-size="pageSize3"
      :page-sizes="[2, 5, 10, 15]"
      :page-size="queryForm.pagesize"
      :small="small"
      :disabled="disabled"
      :background="background"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </el-card>
  <Dialog
    v-model="dialogVisible"
    :dialogTitle="dialogTitle"
    v-if="dialogVisible"
    @initUserList="initGetUserList"
    :dialogTableValue="dialogTableValue"
  ></Dialog>
</template>

<script setup>
import { Search, Edit, Setting, Delete } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { getUser, changUserState, deleteUser } from '@/api/users'
import { options } from './options'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useI18n } from 'vue-i18n'
import Dialog from './components/dialog.vue'
import { isNull } from '@/utils/filters'

const i18n = useI18n()

// 因为默认的显示多少行数据是10 所以手动加上默认的行数
const pageSize3 = ref(2)

const queryForm = ref({
  query: '',
  pagenum: 1,
  pagesize: 2
})

const total = ref(0)

const tableData = ref([])

const dialogVisible = ref(false)
const dialogTitle = ref('')
const dialogTableValue = ref({})

// 初始化请求数据
const initGetUserList = async () => {
  const res = await getUser(queryForm.value)
  console.log(res)
  // table数据是用于$t()来查询table中数据后用于列表中的数据
  total.value = res.total
  tableData.value = res.users
}

initGetUserList()

const handleSizeChange = (pageSize) => {
  queryForm.value.pagenum = 1
  queryForm.value.pagesize = pageSize
  initGetUserList()
}

const handleCurrentChange = (pageNum) => {
  queryForm.value.pagenum = pageNum
  initGetUserList()
}

const changeState = async (info) => {
  await changUserState(info.id, info.mg_state)
  ElMessage({
    message: i18n.t('message.updeteSuccess'),
    type: 'success'
  })
}

const handleDialogValue = (row) => {
  if (isNull(row)) {
    dialogTitle.value = '添加用户'
    dialogTableValue.value = {}
    console.log('点击标题', dialogTitle.value)
  } else {
    dialogTitle.value = '编辑用户'
    dialogTableValue.value = JSON.parse(JSON.stringify(row))
  }

  dialogVisible.value = true
}

const delUser = (row) => {
  ElMessageBox.confirm(i18n.t('dialog.deleteTitle'), 'Warning', {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
    type: 'warning'
  })
    .then(async () => {
      await deleteUser(row.id)
      ElMessage({
        type: 'success',
        message: 'Delete completed'
      })
      initGetUserList()
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: 'Delete canceled'
      })
    })
}
</script>

<style lang="scss" scoped>
.header {
  padding-bottom: 16px;
  box-sizing: border-box;
}

::v-deep .el-input__suffix {
  align-items: center;
}

::v-deep .el-pagination {
  padding-top: 16px;
  box-sizing: border-box;
  text-align: right;
}
</style>
