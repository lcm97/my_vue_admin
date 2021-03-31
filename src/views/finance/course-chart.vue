<template>
  <div class="chart-container">
    <div :id="id" :class="className" :style="{height:height,width:width}"></div>
  </div>
</template>

<script>
import echarts from 'echarts'
import resize from './mixins/resize'
import {courseChartData} from '@/api/finance'

export default {
    mixins: [resize],
    name: 'CourseChart',
    data(){
        return{
            chart:null,
            id:'chart',
            width:'100%',
            height:'100%',
            className: 'chart'
        }
    },
    mounted() {
        this.initChart()
    },
    beforeDestroy() {
        if (!this.chart) {
            return
        }
        this.chart.dispose()
        this.chart = null
    },
    methods: {
        initChart() {
            this.chart = echarts.init(document.getElementById(this.id))
            this.chart.showLoading();
            courseChartData().then(response=>{
                //console.log(response.data)
                const xData = response.data.xData
                const newyData = []
                const oldyData = []
                const totalyData = []
                response.data.xData.forEach(v=>{
                    newyData.push(response.data.newyNum[v])
                    oldyData.push(response.data.oldyNum[v])
                    totalyData.push(response.data.totalyNum[v].toFixed(2))
                })
                this.chart.hideLoading();

                this.chart.setOption({
                    backgroundColor: '#344b58',
                    title: { //组件标题
                        text: '按课程统计',
                        x: '20',
                        top: '20',
                        textStyle: {
                            color: '#fff',
                            fontSize: '22'
                        },
                        subtextStyle: {
                            color: '#90979c',
                            fontSize: '16'
                        }
                    },
                    tooltip: { //坐标轴触发提示框
                        trigger: 'axis',
                        axisPointer: {
                            textStyle: {
                            color: '#fff'
                            }
                        }
                    },
                    grid: { //网格
                        left: '5%',
                        right: '5%',
                        borderWidth: 0,
                        top: 150,
                        bottom: 95,
                        textStyle: {
                            color: '#fff'
                        }
                    },
                    legend: { //图例组件
                        x: '5%',
                        top: '10%',
                        textStyle: {
                            color: '#90979c'
                        },
                        data: ['新生人数', '老生人数', '总金额']
                    },
                    calculable: true,

                    xAxis: [{
                        type: 'category',
                        axisLine: {
                            lineStyle: {
                            color: '#90979c'
                            }
                        },
                        splitLine: {
                            show: false
                        },
                        axisTick: {
                            show: false
                        },
                        splitArea: {
                            show: false
                        },
                        axisLabel: {
                            interval: 0

                        },
                        data: xData  //在此处渲染x轴数据
                    }],
                    yAxis: [{
                        type: 'value',
                        splitLine: {
                            show: false
                        },
                        axisLine: {
                            lineStyle: {
                            color: '#90979c'
                            }
                        },
                        axisTick: {
                            show: false
                        },
                        axisLabel: {
                            interval: 0
                        },
                        splitArea: {
                            show: false
                        }
                    }],
                    dataZoom: [{ //图表缩放
                        show: true,
                        height: 30,
                        xAxisIndex: [
                            0
                        ],
                        bottom: 30,
                        start: 10,
                        end: 80,
                        handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
                        handleSize: '110%',
                        handleStyle: {
                            color: '#d3dee5'

                        },
                        textStyle: {
                            color: '#fff' },
                        borderColor: '#90979c'

                    }, {
                        type: 'inside',
                        show: true,
                        height: 15,
                        start: 1,
                        end: 35
                    }],
                    series: [{
                    name: '新生人数',
                    type: 'bar',
                    stack: 'total',
                    barMaxWidth: 35,
                    barGap: '10%',
                    itemStyle: {
                        normal: {
                        color: 'rgba(255,144,128,1)',
                        label: {
                            show: true,
                            textStyle: {
                            color: '#fff'
                            },
                            position: 'insideTop',
                            formatter(p) {
                            return p.value > 0 ? p.value : ''
                            }
                        }
                        }
                    },
                    data: newyData
                    },

                    {
                    name: '老生人数',
                    type: 'bar',
                    stack: 'total',
                    itemStyle: {
                        normal: {
                        color: 'rgba(0,191,183,1)',
                        barBorderRadius: 0,
                        label: {
                            show: true,
                            position: 'top',
                            formatter(p) {
                            return p.value > 0 ? p.value : ''
                            }
                        }
                        }
                    },
                    data: oldyData
                    }, {
                    name: '总金额',
                    type: 'line',
                    stack: 'total',
                    symbolSize: 10,
                    symbol: 'circle',
                    itemStyle: {
                        normal: {
                        color: 'rgba(252,230,48,1)',
                        barBorderRadius: 0,
                        label: {
                            show: true,
                            position: 'top',
                            formatter(p) {
                            return p.value > 0 ? p.value : ''
                            }
                        }
                        }
                    },
                    data: totalyData
                    }
                    ]
                })

            })


        }
  }

}
</script>

<style scoped>
.chart-container{
  position: relative;
  width: 100%;
  height: calc(100vh - 84px);
}
</style>

