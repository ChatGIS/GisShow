<template>
  <div id="traffic-nav-container">
    <el-row>
      <el-col :span="10">
        <el-radio-group v-model="trafficType" @change="handleChange">
          <el-radio-button label="实时" value="1" />
          <el-radio-button label="预测" value="2" />
        </el-radio-group>
      </el-col>
      <el-col :span="14">
        <div class="traffic_tag">
          <span>畅通</span>
          <ul class="traffic_level">
            <li class="level_1"></li>
            <li class="level_2"></li>
            <li class="level_3"></li>
            <li class="level_4"></li>
          </ul>
          <span>拥堵</span>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="14">
        <div id="time-container">
          <span id="time-title" class="time-content">{{ timeTitle }}: </span>
          <span id="time-value" class="time-content">{{ nowTime }}</span>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
const emit = defineEmits(['emitTrafficType'])

let nowTime = ref('2024/11/22 11:11')
const trafficType = ref('1')
const timeTitle = ref('更新时间')

onMounted(() => {
  nowTime.value = getFormatDate(0)
})

// 定义时间格式化函数
const getFormatDate = (num) => {
  let date = new Date()
  if (num > 0) {
    date.setHours(date.getHours() + num)
  }
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const str = `${year}/${month}/${day} ${hours}:${minutes}`
  return str
}
const handleChange = (val) => {
  if (val == 1) {
    timeTitle.value = '更新时间'
    nowTime.value = getFormatDate(0)
  } else {
    timeTitle.value = '预测时间'
    nowTime.value = getFormatDate(2)
  }
  emit('emitTrafficType', val)
}
</script>
<style scoped>
  #traffic-nav-container {
    position: absolute;
    right: 150px;
    top: 20px;
    width: 310px;
    height: 60px;
    overflow: hidden;
    border-radius: 1px;
    z-index: 1;
    background-color: #fff;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    padding: 12px;
    color: #565656;
  }
  .traffic_tag {
    float: right;
    line-height: 30px;
  }
  .traffic_tag span {
    float: left;
    font-size: 14px;
  }
  .traffic_level {
    float: left;
    margin: 11px 6px 0;
  }

  .traffic_level li {
    float: left;
    width: 25px;
    margin: 0 1px;
    height: 6px;
  }
  .traffic_level li.level_1 {
    background: #34b000;
  }
  .traffic_level li.level_2 {
    background: #fecb00;
  }
  .traffic_level li.level_3 {
    background: #df0100;
  }
  .traffic_level li.level_4 {
    background: #8e0e0b;
  }
  #time-container {
    margin-top: 10px;
  }
  .time-content {
    font-size: 12px;
  }
  #time-title {
    color: #999;
  }
  #time-value {
    margin-left: 10px;
  }
</style>
