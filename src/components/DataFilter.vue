<template>
  <div id="data-filter-container" class="demo-collapse">
    <el-collapse v-model="activeNames">
      <el-collapse-item title="数据筛选" name="1">
        <div id="options-container">
          <span>状态</span>
          <div>
            <el-radio-group v-model="status">
              <el-radio value="1" size="large">状态1</el-radio>
              <el-radio value="2" size="large">状态2</el-radio>
            </el-radio-group>
          </div>
          <span>种类</span>
          <div>
            <el-checkbox
              v-model="isShow1"
              label="类型1"
              size="large"
            /><br />
            <el-checkbox
              v-model="isShow2"
              label="类型2"
              size="large"
            /><br />
            <el-checkbox
              v-model="isShow3"
              label="类型3"
              size="large"
            /><br />
            <el-checkbox
              v-model="isShow4"
              label="类型4"
              size="large"
            /><br />
          </div>
        </div>
        <div id="footer-container">
          <el-button type="primary" plain @click="handleRefresh"
            >刷新</el-button
          >
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const emit = defineEmits(['emitFilter'])

const status = ref('1')
const isShow1 = ref(true)
const isShow2 = ref(true)
const isShow3 = ref(true)
const isShow4 = ref(true)
const activeNames = ref(['1'])
const handleRefresh = () => {
  emit('emitFilter', {
    status: status.value,
    isShow1: isShow1.value,
    isShow2: isShow2.value,
    isShow3: isShow3.value,
    isShow4: isShow4.value
  })
}
</script>
<style scoped>
  #data-filter-container {
    position: absolute;
    right: 20px;
    top: 20px;
    width: 230px;
    overflow: hidden;
    border-radius: 10px;
    z-index: 1;
  }
  #options-container {
    padding-left: 30px;
  }
  .el-checkbox.el-checkbox--large {
    height: 25px;
  }
  #footer-container {
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }
  :deep(.el-collapse-item__header) {
    padding-left: 13px;
    font-weight: bold;
  }
</style>
