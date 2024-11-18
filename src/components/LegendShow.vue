<template>
  <div id="legend-container">
    <el-row>
      <el-col :span="4">
        <div id="legend-title">
          <div class="text-item">图例</div>
        </div>
      </el-col>
      <el-col :span="20">
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="image-container">
              <el-image
                style="width: 25px; height: 25px"
                :src="png4"
                :fit="fit"
              />
            </div>
            <div class="image-desc">
              <span>类型1</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="image-container">
              <el-image
                style="width: 25px; height: 25px"
                :src="png1"
                :fit="fit"
              />
            </div>
            <div class="image-desc">
              <span>类型2</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="image-container">
              <el-image
                style="width: 25px; height: 25px"
                :src="png5"
                :fit="fit"
              />
            </div>
            <div class="image-desc">
              <span>类型3</span>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="image-container">
              <el-image
                style="width: 25px; height: 25px"
                :src="png3"
                :fit="fit"
              />
            </div>
            <div class="image-desc">
              <span>类型4</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="image-container">
              <el-image
                style="width: 25px; height: 25px"
                :src="png2"
                :fit="fit"
              />
            </div>
            <div class="image-desc">
              <span>类型5</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="image-container">
              <el-image
                style="width: 25px; height: 25px"
                :src="png6"
                :fit="fit"
              />
            </div>
            <div class="image-desc">
              <span>类型6</span>
            </div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>
<script setup>
import png1 from '@/assets/image/location-green.png'
import png2 from '@/assets/image/location-green.png'
import png3 from '@/assets/image/location-green.png'
import png4 from '@/assets/image/location-red.png'
import png5 from '@/assets/image/location-red.png'
import png6 from '@/assets/image/location-red.png'

</script>
<style scoped>
  #legend-container {
    background-color: #fff;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    position: absolute;
    bottom: 20px;
    right: 40px;
    width: 280px;
    overflow: hidden;
    border-radius: 10px;
    z-index: 1;
    padding: 2px;
  }
  #legend-title {
    display: flex;
  }
  .image-desc {
    display: flex;
    justify-content: center;
    margin-bottom: 8px;
  }
  .image-container {
    display: flex;
    justify-content: center;
    margin-top: 8px;
  }
  .text-item {
    writing-mode: vertical-rl; /* 设置文字竖写，从右往左 */
    /* 或者 writing-mode: vertical-lr; 从左往右竖写 */
    height: 120px; /* 根据需要设置高度 */
    line-height: 20px; /* 调整行间距 */
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
  }
</style>
