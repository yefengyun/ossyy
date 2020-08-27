function get_speed_day(elem, full_time,title_tag) {
    var options = {
        chart: {
            type: 'line',
            events: {
                drilldown: function (e) {
                    if (!e.seriesOptions) {
                        var chart = this,
                            drilldowns = (function () {
                                var drilldowns_data = new Object();
                                layui.use(['form', 'table'], function () {
                                    var $ = layui.$,
                                        layer = layui.layer,
                                        laytpl = layui.laytpl,
                                        admin = layui.admin,
                                        form = layui.form;
                                    admin.req({
                                        type: "POST",
                                        dataType: "json",
                                        async: false,
                                        url: "/home/get_speed/",
                                        timeout: 200000,
                                        data: {
                                            "full_time": 'interval',
                                            "index_time": full_time,
                                            "start_time": e.point.name
                                        },
                                        success: function (response) {
                                            var full_data = []
                                            for (var i = 0; i < response.x_data.length; i++) {
                                                full_data.push('["' + response.x_data[i] + '"', response.y_data[i] + "]")
                                            }
                                            drilldowns_data = '{"' + e.point.name + '":{"name":"发送量","data":[' + full_data + ']}}'
                                        },
                                        error: function () {}
                                    });
                                })
                                return JSON.parse(drilldowns_data);
                            })(),
                            series = drilldowns[e.point.name];
                        // Show the loading label
                        chart.showLoading('数据加载中 ...');
                        setTimeout(function () {
                            chart.hideLoading();
                            chart.addSeriesAsDrilldown(e.point, series);
                        }, 1000);
                    }
                }
            }
        },
        legend: {
            enabled: false,
            verticalAlign: 'top',
            x: -500,
            y: -30
        },
        lang: {
            drillUpText: '返回上一级'
        },
        title: {
            text: title_tag + '流量趋势'
        },
        xAxis: {
            type: 'category'
        },
        yAxis: {
            title: {
                text: '发送量'
            }
        },
        credits: {
            enabled: false
        },
        plotOptions: {
            line: {
                dataLabels: {
                    // 开启数据标签
                    enabled: true
                },
                // 关闭鼠标跟踪，对应的提示框、点击事件会失效
                enableMouseTracking: true
            }
        },
        tooltip: {
            shared: true,
            useHTML: true,
            headerFormat: '<small>{point.key}</small><table>',
            pointFormat: '<tr><td style="color: {series.color}">{series.name}: </td>' +
                '<td style="text-align: right"><b>{point.y} </b></td></tr>',
            footerFormat: '</table>',
            valueDecimals: 0
        },
        series: [{
            name: '发送量'
        }],
        drilldown: {
            series: []
        }
    };
    layui.use(['form', 'table'], function () {
        var $ = layui.$,
            layer = layui.layer,
            laytpl = layui.laytpl,
            admin = layui.admin,
            form = layui.form;
        admin.req({
            type: "POST",
            dataType: "json",
            url: "/home/get_speed/",
            timeout: 200000,
            data: {
                "full_time": full_time
            },
            success: function (response) {
                var full_data = []
                for (var i = 0; i < response.x_data.length; i++) {
                    full_data.push({
                        "name": response.x_data[i],
                        "y": response.y_data[i],
                        "drilldown": true
                    })
                }
                options.series[0].data = full_data
                var chart = Highcharts.chart(elem, options);
            },
            error: function () {

            }
        })
    })

}

function get_nstat_day(elem) {
    layui.use(['form', 'table'], function () {
        var $ = layui.$,
            layer = layui.layer,
            laytpl = layui.laytpl,
            admin = layui.admin,
            form = layui.form;
        var chart = Highcharts.chart(elem, {
            legend: {
                enabled: true,
                verticalAlign: 'bottom'
            },
            title: {
                text: '今日状态分析'
            },
            credits: {
                enabled: false // 禁用版权信息
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        formatter: function () {
                            //this 为当前的点（扇区）对象，可以通过  console.log(this) 来查看详细信息
                            return '<span style="color: ' + this.point.color + '">' + this.point.name + ':' + this.y + '条，占比' + Math.round(this.point.percentage * 100) / 100 + '%</span>';
                        }
                    },
                    showInLegend: true // 显示在图例中
                }
            },
            colors: ['#64E572', '#f80626', '#1b1b1b', '#FF9655'],
            tooltip: {
                shared: true,
                useHTML: true,
                headerFormat: '<small>状态占比</small><table>',
                pointFormat: '<tr><td style="color: {point.color}"><b>{point.name}:{point.y}条，占比：{point.percentage:.2f}%</td></tr>',
                footerFormat: '</table>',
                valueDecimals: 0
            },
            series: [{
                type: 'pie',
                name: '发送状态占比',
                data: (function () {
                    var drilldowns_data = new Object();
                    admin.req({
                        type: "POST",
                        dataType: "json",
                        async: false,
                        url: "/home/get_nstat/",
                        timeout: 200000,
                        data: {
                        },
                        success: function (response) {
                            drilldowns_data = response.data
                        },
                        error: function () {}
                    })
                    return drilldowns_data;
                })()
            }]
        });
    })
}