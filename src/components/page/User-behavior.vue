<template>
    <div>
        <div id="echartContainer" style="width:800px; height:500px"></div>
    </div>
</template>

<script>
    const echarts = require('echarts');
    export default {
        name: 'line-chart',
        data () {
            return {
                list:['']
            }
        },
        mounted() {
            //基于准备好的dom, 初始化echarts实例
            let myChart = echarts.init(document.getElementById('echartContainer'));
            myChart.setOption({
                title : {
                    text : '用户行为分析',
                    subtext : '抽奖时间分析'
                },
                tooltip : {
                    trigger: 'axis',
                    axisPointer:{
                        show: true,
                        type : 'cross',
                        lineStyle: {
                            type : 'dashed',
                            width : 1
                        }
                    }
                },
                toolbox: {
                    show : true,
                    feature : {
                        mark : {show: true},
                        dataView : {show: true, readOnly: false},
                        restore : {show: true},
                        saveAsImage : {show: true}
                    }
                },
                dataZoom: {
                    show: true,
                    start : 30,
                    end : 70
                },
                legend : {
                    data : ['series1']
                },
                dataRange: {
                    min: 0,
                    max: 100,
                    orient: 'horizontal',
                    y: 30,
                    x: 'center',
                    //text:['高','低'],           // 文本，默认为数值文本
                    color:['lightgreen','orange'],
                    splitNumber: 5
                },
                grid: {
                    y2: 80
                },
                xAxis : [
                    {
                        type : 'time',
                        splitNumber:10
                    }
                ],
                yAxis : [
                    {
                        type : 'value'
                    }
                ],
                animation: false,
                series : [
                    {
                        name:'series1',
                        type:'scatter',
                        tooltip : {
                            trigger: 'axis',
                            formatter : function (params) {
                                var date = new Date(params.value[0]);
                                return params.seriesName
                                    + ' （'
                                    + date.getFullYear() + '-'
                                    + (date.getMonth() + 1) + '-'
                                    + date.getDate() + ' '
                                    + date.getHours() + ':'
                                    + date.getMinutes()
                                    +  '）<br/>'
                                    + params.value[1] + ', '
                                    + params.value[2];
                            },
                            axisPointer:{
                                type : 'cross',
                                lineStyle: {
                                    type : 'dashed',
                                    width : 1
                                }
                            }
                        },
                        symbolSize: function (value){
                            return Math.round(value[2]/10);
                        },
                        data: (function () {
                            var d = [];
                            var len = 0;
//                            var now = new Date();
//                            var value;
                            const self=this;
                            self.$axios({
                                url:'/analysis/vote-result-edit',
                                method:'post',
                                params:{
                                    id:parseInt(self.voteForm.id),
                                    itemId:self.voteForm.itemId,
                                    voteNum:self.voteForm.votenum,
                                }
                            })
                                .then((res) => {
                                    if (res != null && res.data.result){
                                        self.$message('修改成功!');
                                        self.getData();
                                    }
                                    else
                                        self.$message.error("修改失败！");
                                    self.$modal.hide('vote-modal');
                                })
                            while (len++ < 1000) {
                                d.push([
                                    new Date(2017, 12, 1, 0, Math.round(Math.random()*10000)),
                                    (Math.random()*30).toFixed(2) - 0,
                                    (Math.random()*100).toFixed(2) - 0
                                ]);
                            }
                            return d;
                        })()
                    }
                ]
            })
        },

    }
</script>

<style type="text/css">
</style>
