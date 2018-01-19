<style type="text/css" scoped>
    .textindent{
        margin-left: 2rem;
    }
</style>
<template>
    <div>
        <div id="echartContainer" style="width:800px; height:500px"></div>
        <div id="twoechartContainer" style="width:800px; height:500px"></div>
        <div>图表结论：<br><span class="textindent">根据用户抽奖时间可发现：每天8:00-10:00， 下午5点左右为参与时间高峰期。活动开始后初期第二天为高峰期，
            最后一天为高峰期，中间几天为疲软期。根据活动报名时间可发现：10:30-12:30 ，14:30-15:30 为活动参与高峰期，针对活动报名夜间几乎无人参与。
            <br><span class="textindent">由此给出建议：活动可以白天开启，凌晨结束。</span>

</span></div>
    </div>
</template>

<script>
    import $ from 'jquery'
    const echarts = require('echarts');
    export default {
        mounted() {
            //基于准备好的dom, 初始化echarts实例
            var d = [];
            var collect=[];
            $.ajax({
                url:"http://localhost:8083/analysis/user-prize",
                crossDomain: true,
                async:false,
                xhrFields: {
                    'Access-Control-Allow-Origin': 'localhost:8083'
                },
                success:function (data) {
                    var res=data.data;
//                    console.log(new Date(parseInt(res[0].addtime*1000)).getHours()+":"+new Date(parseInt(res[0].addtime*1000)).getMinutes()+":"+new Date(parseInt(res[0].addtime*1000)).getSeconds());
                    for(var i=0;i<res.length;i++){

                        d.push([
                            new Date(parseInt((res[i].addtime)*1000)),
//                            new Date().setTime(res[i].addtime*1000),
                            res[i].num
                        ])
                    }

                }
            });
            $.ajax({
                url:"http://localhost:8083/analysis/user-collect",
                crossDomain: true,
                async:false,
                xhrFields: {
                    'Access-Control-Allow-Origin': 'localhost:8083'
                },
                success:function (data) {
                    var res=data.data;
                    for(var i=0;i<res.length;i++){
                        collect.push([
                            new Date(parseInt((res[i].addtime)*1000)),
                            res[i].num
                        ])
                    }
                }
            });
            let myChart = echarts.init(document.getElementById('echartContainer'));
            let twomyChart = echarts.init(document.getElementById('twoechartContainer'));
            myChart.setOption({
                title : {
                    text : '用户行为分析',
                    subtext : '抽奖时间分析'
                },
                //坐标指示轴
                tooltip : {
                    trigger: 'axis',
                    axisPointer:{
                        show: true,
                        type : 'cross',
                        lineStyle: {
                            type : 'dashed',
                            width : 1
                        }
                    },
                    //格式化坐标指示轴显示的文字
                    formatter: function (params) {
                        var date=params[0].value[0];
                        var time = date.getFullYear() + '-'
                            + (date.getMonth() + 1) + '-'
                                    + date.getDate() + ' '
                                    + date.getHours() + ':'
                                    + date.getMinutes();
                        return '('+
                            time+
                            ')<br/>'
                            + '数量: '+params[0].value[1]
                    }
                },
                //工具栏
                toolbox: {
                    show : true,
                    feature : {
                        mark : {show: true},
                        dataView : {show: true, readOnly: false},
//                        restore : {show: true},
                        saveAsImage : {show: true}
                    }
                },
                //start end 数据窗口范围的起始结束百分比
                dataZoom: {
                    show: true,
//                    showDetail:true,
//                    start : 30.68,
//                    end : 31.101,
                    start : 25.32,
                    end : 37.775,
                    zoomLock:true
                },
                //顶部图例
                legend : {
                    data : ['series1']
                },
                //x y水平与垂直安放位置 图例
                dataRange: {
//                    min: 0,
//                    max: 15,
                    orient: 'horizontal',
                    y: 5,
                    x: 'center',
//                    text:['高','低'],           // 文本，默认为数值文本
                    color:['lightgreen','orange'],
//                    splitNumber: 15
                },
                //直角坐标系内绘图网格右下角纵坐标
                grid: {
                    y2: 100
                },
                //splitNum分割段数
                xAxis : [
                    {
                        type : 'time',
                        splitNumber:5
                    }
                ],
                yAxis : {
                    min: 0,
                    max: 15,
                    type : 'value'
                },
                animation: false,
                //散点图
                series : [
                    {
                        name: '数量',
                        type: 'scatter',
                        tooltip : {
                            trigger: 'axis',
//                            axisPointer: {
//                                type: 'cross',
//                                lineStyle: {
//                                    type: 'dashed',
//                                    width: 1
//                                }
//                            }
                        },
//                        symbolSize: function (value){
//                            return Math.round(value[2]/10);
//                        },

                            data: (function () {
//                                var m = [];
//                                var len = 0;
//                                while (len++ < 1500) {
//                                    m.push([
//                                        new Date(2014, 9, 1, 0, Math.round(Math.random() * 10000)),
//                                        (Math.random() * 30).toFixed(2) - 0,
////                                        (Math.random() * 100).toFixed(2) - 0
//                                    ]);
//                                }
//                                return m;
//                                console.log(d);
                                return d;
                            })()

                    }

                ]
            })
            twomyChart.setOption({
                title : {
                    subtext : '活动报名时间分析'
                },
                //坐标指示轴
                tooltip : {
                    trigger: 'axis',
                    axisPointer:{
                        show: true,
                        type : 'cross',
                        lineStyle: {
                            type : 'dashed',
                            width : 1
                        }
                    },
                    //格式化坐标指示轴显示的文字
                    formatter: function (params) {
                        var date=params[0].value[0];
                        var time = date.getFullYear() + '-'
                            + (date.getMonth() + 1) + '-'
                            + date.getDate() + ' '
                            + date.getHours() + ':'
                            + date.getMinutes();
                        return '('+
                            time+
                            ')<br/>'
                            + '数量: '+params[0].value[1]
                    }
                },
                //工具栏
                toolbox: {
                    show : true,
                    feature : {
                        mark : {show: true},
                        dataView : {show: true, readOnly: false},
//                        restore : {show: true},
                        saveAsImage : {show: true}
                    }
                },
                //start end 数据窗口范围的起始结束百分比
                dataZoom: {
                    show: true,
//                    showDetail:true,
//                    start : 30.68,
//                    end : 31.101,
                    start : 25.223,
                    end : 29.81,
                    zoomLock:true
                },
                //顶部图例
                legend : {
                    data : ['series1']
                },
                //x y水平与垂直安放位置 图例
                dataRange: {
//                    min: 0,
//                    max: 15,
                    orient: 'horizontal',
                    y: 5,
                    x: 'center',
//                    text:['高','低'],           // 文本，默认为数值文本
                    color:['lightgreen','orange'],
//                    splitNumber: 15
                },
                //直角坐标系内绘图网格右下角纵坐标
                grid: {
                    y2: 100
                },
                //splitNum分割段数
                xAxis : [
                    {
                        type : 'time',
                        splitNumber:5
                    }
                ],
                yAxis : {
                    min: 0,
                    max: 3,
                    type : 'value'
                },
                animation: false,
                //散点图
                series : [
                    {
                        name: '数量',
                        type: 'scatter',
                        tooltip : {
                            trigger: 'axis',
                        },

                        data: (function () {
                            return collect;
                        })()

                    }

                ]
            })
        },

    }
</script>


