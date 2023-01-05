<template>
  <el-dropdown>
    <span class="el-dropdown-link">
      <el-avatar shape="square" :size="40" :src="squareUrl" />
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="logout">退出</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup>
import { ref } from 'vue'
import { useStore } from 'vuex'
const store = useStore()

const squareUrl = ref(
  'https://img2.baidu.com/it/u=1032562995,2698587857&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500'
)

const logout = () => {
    store.dispatch('app/logout')
}
</script>

<style lang="scss" scoped>
::v-deep .el-dropdown-item{
    white-space: nowrap;
}
</style>
