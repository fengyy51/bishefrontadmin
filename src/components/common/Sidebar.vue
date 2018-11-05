<template>
    <div class="sidebar">
        <el-menu :defaultActive="onRoutes" ref="navbar" class="el-menu-vertical-demo" theme="dark" unique-opened router @select="selectHandle">
            <el-menu-item index="/notice">
                <i class="fa fa-bullhorn" aria-hidden="true"></i>&nbsp;&nbsp;公告管理
            </el-menu-item>
            <el-menu-item index="/vote-data-list">
                <i class="fa fa-shopping-bag" aria-hidden="true"></i>&nbsp;&nbsp;信息采集
            </el-menu-item>
            <!--<el-menu-item index="/shop-list">-->
                <!--<i class="fa fa-shopping-bag" aria-hidden="true"></i>&nbsp;&nbsp;商铺管理-->
            <!--</el-menu-item>-->
            <el-submenu index="1" >
                <template  slot="title" ><i class="fa fa-calendar" aria-hidden="true" style="padding-left: 10px"></i>&nbsp;&nbsp;活动管理</template>
                <el-menu-item index="/act-list/detail/0">
                    <i class="fa fa-calendar" aria-hidden="true"></i>&nbsp;&nbsp;发起活动
                </el-menu-item>
                <el-menu-item index="/act-list">
                <i class="fa fa-calendar-check-o" aria-hidden="true"></i>&nbsp;&nbsp;我发起的活动
                </el-menu-item>
                <el-menu-item index="/act-addinfo/0">
                    <i class="fa fa-calendar-o" aria-hidden="true"></i>&nbsp;&nbsp;自定义报名项
                </el-menu-item>
                <el-menu-item index="/item-list"><i class="fa fa-file-image-o" aria-hidden="true"></i>&nbsp;&nbsp;发起投票</el-menu-item>
                <el-menu-item index="/vote-list"><i class="fa fa-list" aria-hidden="true"></i>&nbsp;&nbsp;投票活动列表</el-menu-item>
            </el-submenu>
            <el-submenu index="2" >
                <template  slot="title" ><i class="fa fa-gift" aria-hidden="true" style="padding-left: 10px"></i>&nbsp;&nbsp;抽奖管理</template>
                <el-menu-item index="/prize-launch/0"><i class="fa fa-calendar" aria-hidden="true"></i>&nbsp;&nbsp;发起抽奖</el-menu-item>
                <el-menu-item index="/prize"><i class="fa fa-database" aria-hidden="true"></i>&nbsp;&nbsp;抽奖数据管理</el-menu-item>
                <el-menu-item index="/prize-list"><i class="fa fa-calendar-check-o" aria-hidden="true"></i>&nbsp;&nbsp;抽奖活动列表</el-menu-item>
            </el-submenu>
            <el-submenu index="3" >
                <template  slot="title" ><i class="fa fa-database" aria-hidden="true" style="padding-left: 10px"></i>&nbsp;&nbsp;统计与分析</template>
                <el-menu-item index="/vote-brush"><i class="fa fa-ticket" aria-hidden="true"></i>&nbsp;&nbsp;刷票统计</el-menu-item>
                <el-menu-item index="/user-behavior"><i class="fa fa-bar-chart" aria-hidden="true"></i>&nbsp;&nbsp;用户行为习惯分析</el-menu-item>
            </el-submenu>
            <el-menu-item index="/gallery"><i class="fa fa-file-image-o" aria-hidden="true"></i>&nbsp;&nbsp;专题管理</el-menu-item>
            <!--<el-menu-item index="/coupon">-->
                <!--<i class="fa fa-credit-card" aria-hidden="true"></i>&nbsp;&nbsp;优惠管理-->
            <!--</el-menu-item>-->
            <!--<el-menu-item index="/map">-->
                <!--<i class="fa fa-map" aria-hidden="true"></i>&nbsp;&nbsp;地图 demo-->
            <!--</el-menu-item>-->

        </el-menu>
    </div>
</template>
<script>
export default {
    computed: {
        onRoutes() {
            const path = this.$route.path;
            if (path.indexOf("act-list") > -1)
                return "/act-list";
            else if (path.indexOf("shop-list") > -1)
                return "/shop-list";
            else
                return path;
        }
    },
    methods: {
        selectHandle(index, indexPath, item) {
            //TODO:侧边栏根据url active bug
            /**
             * 在选择父级菜单时自动关闭其下所有子菜单
             * 选择时获取点击菜单的父级index，并计算得到该index在已打开菜单中的索引值，
             * 关闭位于当前打开菜单中该索引值之后的全部菜单
             */
//                // 获取当前打开的所有菜单
//            let openMenu = this.$refs.navbar.openedMenus.concat([])
//            // 获取点击菜单的父级index，如果当前点击的是根节点，则直接关闭所有打开菜单
//            let nowMenuPath = indexPath.length > 1 ? indexPath[indexPath.length-2] : ""
//            if(nowMenuPath){
//                // 获取父级index在数组中索引，关闭其后所有的菜单
//                let menuIndex = openMenu.indexOf(nowMenuPath)
//                openMenu = openMenu.slice(menuIndex+1)
//            }
//            openMenu = openMenu.reverse()
//            openMenu.forEach((ele) => {
//                this.$refs.navbar.closeMenu(ele)
//            })
        }
    }
}
</script>
<style scoped>
.sidebar {
    display: block;
    position: absolute;
    width: 170px;
    left: 0;
    top: 70px;
    bottom: 0;
    background: #2E363F;
}

.sidebar > ul {
    height: 100%;
}

.el-menu-item {
    padding-left: 30px !important;
}

.el-submenu__title {
    padding-left: 30px !important;
}
</style>
