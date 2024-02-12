<template>
    <el-tabs tab-position="right" class="floor-bar" @tab-click="handleTabClick">
        <el-tab-pane v-for="floor in floors" 
        :key="floor.id" 
        :name="floor.id" 
        :label="floor.name"></el-tab-pane>
    </el-tabs>
</template>
<script setup>
const emit = defineEmits(['handleFloorClick'])

const props = defineProps({
    floors: {
        type: Array,
        default: () => [{ id: 1, name: 'F1' },
            { id: 2, name: 'F2' },
            { id: 3, name: 'F3' },
            { id: 4, name: 'F4' },
            { id: 5, name: 'F5' },
            { id: 6, name: 'F6' },
            { id: 7, name: 'F7' }]
    }
})
const handleTabClick = (pane) => {
    emit('handleFloorClick', pane.props.name)
}
</script>

<style scoped>
.floor-bar {
    width: 40px;
    line-height: 1.3em;
    border-radius: 20px;
    box-shadow: 0 0 3px 3px rgba(0, 0, 0, .1);
    background-color: #fff;
    height: 250px;
}

.floor-bar /deep/.el-tabs__item {
    padding: 0 14px;
}

.floor-bar /deep/.el-tabs__nav-prev {
    top: 9px !important;
    left: 2px !important;
}

.floor-bar /deep/.el-tabs__nav-next {
    left: 2px !important;
}
</style>