<template>
    <div>
        <div class="map_top_div">
            <i>初始的商铺点:</i>
            <input id="p_unit_id" v-model="p_unitId" class="m_input" disabled="true">
        </div>
        <div class="map_top_div">
            <i>选中的商铺点:</i>
            <input id="unit_id" v-model="unitId" @focus="focusUnitId" ref="unitId" class="m_input" disabled="true" />
            <el-switch on-text="关闭地图" off-text="开启地图" v-model="mapSwitch" off-color="#13ce66" on-color="#ff4949" @change="mapSwitchHandle" :width="90"></el-switch>
        </div>
        <iframe :src="mapUrl" frameborder="0" height="700" width="100%" :class="mapClass"></iframe>
    </div>
</template>
<style scoped>
.map_top_div {
    margin-bottom: 10px;
}

.m_input {
    width: 300px;
}

.map_show {
    display: block;
}

.map_hide {
    display: none;
}

</style>
<script type="text/javascript">
export default {
    data() {
            return {
                unitId: "",
                p_unitId: '{"unit_id":"59EDAC05-01E1-4898-84AB-61F3F84AD0F9","unit_name":"317教室/318教室","place":"E9F6A2DE-EADC-45AF-A42E-C7458A401339"}',
                mapUrl: '',
                mapSwitch: true,
                mapClass: 'map_show'
            }
        },
        mounted() {
            //vue数据准备好后，请求map信息
            this.mapUrl = './static/map/map_demo.html';
        },
        methods: {
            focusUnitId() {
                this.unitId = this.$refs.unitId.value;
            },
            mapSwitchHandle() {
                this.mapSwitch ? false : true;
                if (this.mapSwitch)
                    this.mapClass = 'map_show';
                else
                    this.mapClass = 'map_hide';

            }
        }
}
</script>
