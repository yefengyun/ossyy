function get_channel_speed(channelid, chname,speed) {
    layer.open({
        type: 2,
        content: '/operate/show_speed/?channelid=' + channelid + '&chname=' + chname + '&type=channel&speed='+speed,
        title: false,
        area: ['1140px', '530px'],
        success: function (layero, index) {
            var ideal_speed = speed * 60;
            var options = {
                chart: {
                    type: 'line'
                },
                legend: {
                    enabled: false,
                    verticalAlign: 'top',
                    x: -500,
                    y: -30
                },
                title: {
                    text: chname + '-速度统计'
                },
                subtitle: {
                    text: '数据来源: rainbow'
                },
                xAxis: {
                    type: 'datetime',
                    labels: {
                        formatter: function () {
                            return Highcharts.dateFormat('%H:%M', this.value)
                        }
                    }
                },
                yAxis: {
                    title: {
                        text: '发送量'
                    },
                    plotLines: [{
                        color: 'red', //线的颜色，定义为红色
                        dashStyle: 'dash', //默认值，这里定义为实线
                        value: ideal_speed,//定义在那个值上显示标示线，这里是在x轴上刻度为3的值处垂直化一条线
                        width: 2 //标示线的宽度，2px
                    }]
                },
                credits: {
                    enabled: false
                },
                rangeSelector: {
                    buttons: [{
                        type: 'minute',
                        count: 5,
                        text: '5m'
                    }, {
                        type: 'minute',
                        count: 10,
                        text: '10m'
                    }, {
                        type: 'minute',
                        count: 15,
                        text: '15m'
                    }, {
                        type: 'minute',
                        count: 30,
                        text: '30m'
                    }, {
                        type: 'hour',
                        count: 1,
                        text: '1hour'
                    }, {
                        type: 'hour',
                        count: 2,
                        text: '2hour'
                    }],
                    selected: 2, // 默认选中的范围，值为上面 buttons 数组的下标（从 0 开始）
                    inputEnabled: false
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
                        '<td style="text-align: right"><b>{point.y} </b></td></tr>' +
                        '<tr><td style="color: {series.color}">速度: </td>' +
                        '<td style="text-align: right"><b>' + speed + '</b></td></tr>' +
                        '<tr><td style="color: #ff0000">理想发送量: </td>' +
                        '<td style="text-align: right;color: #ff0000"><b>' + ideal_speed + '</b></td></tr>',
                    footerFormat: '</table>',
                    valueDecimals: 0
                },
                series: [{
                    name: '发送量'
                }]
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
                    url: "/operate/get_channel_speed/",
                    timeout: 200000,
                    data: {
                        "channelid": channelid,
                        "full_time": 'hour'
                    },
                    success: function (response) {
                        var full_data = []
                        for (var i = 0; i < response.x_data.length; i++) {
                            full_data.push([response.x_data[i], response.y_data[i]])
                        }
                        options.series[0].data = full_data
                        var iframeWin = window[layero.find('iframe')[0]['name']];
                        var chart = Highcharts.stockChart(iframeWin.document.getElementById('container'), options);
                    }
                })
            });

        }
    });
}

function get_channel_speed_day(channelid, chname,speed) {
    var full_speed = speed * 60 * 60
    var minute_speed = speed * 60
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
                                        url: "/operate/get_channel_speed/",
                                        timeout: 200000,
                                        data: {
                                            "channelid": channelid,
                                            "full_time": 'interval',
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
            text: chname + '-速度统计(全天)'
        },
        subtitle: {
            text: '数据来源: rainbow'
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
            '<td style="text-align: right"><b>{point.y} </b></td></tr>' +
            '<tr><td style="color: {series.color}">速度: </td>' +
            '<td style="text-align: right"><b>' + speed + '</b></td></tr>' +
            '<tr><td style="color: #ff0000">理想发送量(分钟): </td>' +
            '<td style="text-align: right;color: #ff0000"><b>' + minute_speed + '</b></td></tr>' +
            '<tr><td style="color: #ff0000">理想发送量(小时): </td>' +
            '<td style="text-align: right;color: #ff0000"><b>' + full_speed + '</b></td></tr>',
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
            url: "/operate/get_channel_speed/",
            timeout: 200000,
            data: {
                "channelid": channelid,
                "full_time": 'day'
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
                var chart = Highcharts.chart('container_day', options);
            },
            error: function () {

            }
        })
    })

}

function get_channel_nstat(channelid, chname) {
    layer.open({
        type: 2,
        content: '/operate/show_nstat/?channelid=' + channelid + '&chname=' + chname + '&type=channel',
        title: false,
        area: ['600px', '530px'],
        success: function (layero, index) {}
    });
}

function get_channel_nstat_show(channelid, chname, start_time, end_time) {
    layui.use(['form', 'table'], function () {
        var $ = layui.$,
            layer = layui.layer,
            laytpl = layui.laytpl,
            admin = layui.admin,
            form = layui.form;
        var chart = Highcharts.chart('container', {
            legend: {
                enabled: true,
                verticalAlign: 'bottom'
            },
            title: {
                text: chname + '-状态分析'
            },
            subtitle: {
                text: '数据来源: rainbow'
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
                        url: "/operate/get_channel_nstat/",
                        timeout: 200000,
                        data: {
                            "channelid": channelid,
                            "full_time": 'cus_custom_time',
                            "start_time": start_time,
                            "end_time": end_time
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

function get_channel_nstat_section(channelid, chname) {
    var index = layui.layer.open({
        title: "分段统计",
        type: 2,
        content: "/operate/show_full",
        maxmin: true,
        area: ['100%', '100%'],
        success: function (layero, index) {
            setTimeout(function () {
                layui.layer.tips('点击此处返回客户列表', '.layui-layer-setwin .layui-layer-close', {
                    tips: 3
                });
            }, 500)
            var iframeWin = window[layero.find('iframe')[0]['name']];
            var chart = Highcharts.chart(iframeWin.document.getElementById('container_full'), {
                legend: {
                    enabled: true,
                    verticalAlign: 'bottom'
                },
                title: {
                    text: chname + '-状态分析'
                },
                subtitle: {
                    text: '数据来源: rainbow'
                },
                credits: {
                    enabled: false // 禁用版权信息
                },
                labels: {
                    style: {
                        color: "#ff0000"
                    },
                    items: [{
                        html: '<a>2分钟</a>',
                        style: {
                            left: '330%',
                            top: '110%',
                            color: '#006cee',
                            fontSize: '15px',
                            fontWeight: 'bold',
                            fontFamily: '微软雅黑'
                        }
                    }, {
                        html: '<a>5分钟</a>',
                        style: {
                            left: '820%',
                            top: '110%',
                            color: '#006cee',
                            fontSize: '15px',
                            fontWeight: 'bold',
                            fontFamily: '微软雅黑'
                        }
                    }, {
                        html: '<a>15分钟</a>',
                        style: {
                            left: '1310%',
                            top: '110%',
                            color: '#006cee',
                            fontSize: '15px',
                            fontWeight: 'bold',
                            fontFamily: '微软雅黑'
                        }
                    }, {
                        html: '<a>30分钟</a>',
                        style: {
                            left: '320%',
                            top: '365%',
                            color: '#006cee',
                            fontSize: '15px',
                            fontWeight: 'bold',
                            fontFamily: '微软雅黑'
                        }
                    }, {
                        html: '<a>1小时</a>',
                        style: {
                            left: '820%',
                            top: '365%',
                            color: '#006cee',
                            fontSize: '15px',
                            fontWeight: 'bold',
                            fontFamily: '微软雅黑'
                        }
                    }, {
                        html: '<a>当天</a>',
                        style: {
                            left: '1320%',
                            top: '365%',
                            color: '#006cee',
                            fontSize: '15px',
                            fontWeight: 'bold',
                            fontFamily: '微软雅黑'
                        }
                    }, {
                        html: '<a>昨天</a>',
                        style: {
                            left: '660%',
                            top: '620%',
                            color: '#006cee',
                            fontSize: '15px',
                            fontWeight: 'bold',
                            fontFamily: '微软雅黑'
                        }
                    }, {
                        html: '<a>前天</a>',
                        style: {
                            left: '1150%',
                            top: '620%',
                            color: '#006cee',
                            fontSize: '15px',
                            fontWeight: 'bold',
                            fontFamily: '微软雅黑'
                        }
                    }]
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
                    headerFormat: '<small>{series.name}</small><table>',
                    pointFormat: '<table><tr><td style="color: {point.color}"><b>{point.name}:{point.y}条，占比：{point.percentage:.2f}%</td></tr>',
                    footerFormat: '</table>',
                    valueDecimals: 0
                },
                series: [{
                    type: 'pie',
                    name: '2分钟状态占比',
                    innerSize: '80%',
                    center: ['20%', '15%'],
                    size: 100,
                    showInLegend: false,
                    data: (function () {
                        var drilldowns_data = new Object();
                        layui.use(['form', 'table'], function () {
                            var $ = layui.$,
                                layer = layui.layer,
                                laytpl = layui.laytpl,
                                admin = layui.admin,
                                form = layui.form;
                            $.ajax({
                                type: "POST",
                                dataType: "json",
                                async: false,
                                url: "/operate/get_channel_nstat/",
                                timeout: 200000,
                                data: {
                                    "channelid": channelid,
                                    "full_time": 'interval',
                                    "start_time": 'now-2m+8h',
                                    "end_time": 'now+8h'
                                },
                                success: function (response) {
                                    replace_str = JSON.stringify(response.data).replace(/,\"sliced\":\"true\"/, "")
                                    drilldowns_data = JSON.parse(replace_str)
                                },
                                error: function () {}
                            })
                        })
                        return drilldowns_data;
                    })()
                }, {
                    type: 'pie',
                    name: '5分钟状态占比',
                    innerSize: '80%',
                    center: ['50%', '15%'],
                    size: 100,
                    showInLegend: false,
                    data: (function () {
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
                                url: "/operate/get_channel_nstat/",
                                timeout: 200000,
                                data: {
                                    "channelid": channelid,
                                    "full_time": 'interval',
                                    "start_time": 'now-5m+8h',
                                    "end_time": 'now+8h'
                                },
                                success: function (response) {
                                    replace_str = JSON.stringify(response.data).replace(/,\"sliced\":\"true\"/, "")
                                    drilldowns_data = JSON.parse(replace_str)
                                },
                                error: function () {}
                            })
                        })
                        return drilldowns_data;
                    })()
                }, {
                    type: 'pie',
                    name: '15分钟状态占比',
                    innerSize: '80%',
                    size: 100,
                    center: ['80%', '15%'],
                    showInLegend: false,
                    data: (function () {
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
                                url: "/operate/get_channel_nstat/",
                                timeout: 200000,
                                data: {
                                    "channelid": channelid,
                                    "full_time": 'interval',
                                    "start_time": 'now-15m+8h',
                                    "end_time": 'now+8h'
                                },
                                success: function (response) {
                                    replace_str = JSON.stringify(response.data).replace(/,\"sliced\":\"true\"/, "")
                                    drilldowns_data = JSON.parse(replace_str)
                                },
                                error: function () {}
                            })
                        })
                        return drilldowns_data;
                    })()
                }, {
                    type: 'pie',
                    name: '30分钟状态占比',
                    innerSize: '80%',
                    size: 100,
                    center: ['20%', '55%'],
                    showInLegend: false,
                    data: (function () {
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
                                url: "/operate/get_channel_nstat/",
                                timeout: 200000,
                                data: {
                                    "channelid": channelid,
                                    "full_time": 'interval',
                                    "start_time": 'now-30m+8h',
                                    "end_time": 'now+8h'
                                },
                                success: function (response) {
                                    replace_str = JSON.stringify(response.data).replace(/,\"sliced\":\"true\"/, "")
                                    drilldowns_data = JSON.parse(replace_str)
                                },
                                error: function () {}
                            })
                        })
                        return drilldowns_data;
                    })()
                }, {
                    type: 'pie',
                    name: '一小时状态占比',
                    showInLegend: false,
                    innerSize: '80%',
                    size: 100,
                    center: ['50%', '55%'],
                    data: (function () {
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
                                url: "/operate/get_channel_nstat/",
                                timeout: 200000,
                                data: {
                                    "channelid": channelid,
                                    "full_time": 'interval',
                                    "start_time": 'now-60m+8h',
                                    "end_time": 'now+8h'
                                },
                                success: function (response) {
                                    replace_str = JSON.stringify(response.data).replace(/,\"sliced\":\"true\"/, "")
                                    drilldowns_data = JSON.parse(replace_str)
                                },
                                error: function () {}
                            })
                        })
                        return drilldowns_data;
                    })()
                }, {
                    type: 'pie',
                    name: '当天状态占比',
                    innerSize: '80%',
                    size: 100,
                    center: ['80%', '55%'],
                    data: (function () {
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
                                url: "/operate/get_channel_nstat/",
                                timeout: 200000,
                                data: {
                                    "channelid": channelid,
                                    "full_time": 'day'
                                },
                                success: function (response) {
                                    replace_str = JSON.stringify(response.data).replace(/,\"sliced\":\"true\"/, "")
                                    drilldowns_data = JSON.parse(replace_str)
                                },
                                error: function () {}
                            })
                        })
                        return drilldowns_data;
                    })()
                }, {
                    type: 'pie',
                    name: '昨天状态占比',
                    innerSize: '80%',
                    size: 100,
                    center: ['40%', '95%'],
                    showInLegend: false,
                    data: (function () {
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
                                url: "/operate/get_channel_nstat/",
                                timeout: 200000,
                                data: {
                                    "channelid": channelid,
                                    "full_time": '2day'
                                },
                                success: function (response) {
                                    replace_str = JSON.stringify(response.data).replace(/,\"sliced\":\"true\"/, "")
                                    drilldowns_data = JSON.parse(replace_str)
                                },
                                error: function () {}
                            })
                        })
                        return drilldowns_data;
                    })()
                }, {
                    type: 'pie',
                    name: '前天状态占比',
                    showInLegend: false,
                    innerSize: '80%',
                    size: 100,
                    center: ['70%', '95%'],
                    data: (function () {
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
                                url: "/operate/get_channel_nstat/",
                                timeout: 200000,
                                data: {
                                    "channelid": channelid,
                                    "full_time": '3day'
                                },
                                success: function (response) {
                                    replace_str = JSON.stringify(response.data).replace(/,\"sliced\":\"true\"/, "")
                                    drilldowns_data = JSON.parse(replace_str)
                                },
                                error: function () {}
                            })
                        })
                        return drilldowns_data;
                    })()
                }]
            }, function (c) { // 图表初始化完毕后的会掉函数
                // 环形图圆心
                var centerY = c.series[0].center[1],
                    titleHeight = parseInt(c.title.styles.fontSize);
                chart = c;
            });
        }
    })
    layui.layer.full(index);
    //改变窗口大小时，重置弹窗的宽高，防止超出可视区域（如F12调出debug的操作）
    $(window).on("resize", function () {
        layui.layer.full(index);
    })
}

function province_ratio(channelid, chname, chanid) {
    var index = layui.layer.open({
        title: "省份占比",
        type: 2,
        content: "/operate/province_ratio",
        maxmin: true,
        area: ['100%', '100%'],
        success: function (layero, index) {
            setTimeout(function () {
                layui.layer.tips('点击此处返回通道列表', '.layui-layer-setwin .layui-layer-close', {
                    tips: 3
                });
            }, 500);
            layui.use(['form','table'],function () {
                var $ = layui.$,
                        admin = layui.admin;
                admin.req({
                    type: 'POST',
                    dataType: 'json',
                    async: false,
                    url: '/operate/pratio_detail/',
                    timeout: 30000,
                    data:{
                        "channelid": channelid,
                        "chname": chname,
                        "chanid": chanid
                    },
                    success: function (response) {
                        date_list = response.date_list;
                        send_suc = response.send_suc;
                        send_total = response.send_total;
                        provinces_suc = response.provinces_suc;
                        pratio = response.pratio;
                        pratio_total = response.pratio_total;
                        pratio_other = response.pratio_other;
                    }
                })
            });
            var iframeWin = window[layero.find('iframe')[0]['name']];
            var chart = Highcharts.chart(iframeWin.document.getElementById('province_ratio'), {
                title: {
                    text: chname + '-省份占比分析'
                },
                subtitle: {
                    text: '数据来源: rainbow'
                },
                credits:{
                    enabled: false // 禁用版权信息
                },
                xAxis: {
                    categories: date_list,
                    crosshair: true
                },
                yAxis: [{ // Primary yAxis
                    labels: {
                        format: '{value} 条',
                        style: {
                            color: Highcharts.getOptions().colors[1]
                        }
                    },
                    title: {
                        text: '发送量',
                        style: {
                            color: Highcharts.getOptions().colors[1]
                        }
                    }
                }, { // Secondary yAxis
                    title: {
                        text: '省占比',
                        min: 0,
                        max: 100,
                        style: {
                            color: Highcharts.getOptions().colors[0]
                        }
                    },
                    labels: {
                        format: '{value} %',
                        style: {
                            color: Highcharts.getOptions().colors[0]
                        }
                    },
                    opposite: true
                }],
                tooltip: {
                    // head + 每个 point + footer 拼接成完整的 table
                    headerFormat: '<span style="font-size:10px"><b>{point.key}</b></span><table>',
                    pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}：</td>' +
                    '<td style="padding:0"><b>{point.y}</b></td></tr>',
                    footerFormat: '</table>',
                    shared: true,
                    useHTML: true
                },
                plotOptions: {
                    column: {
                        borderWidth: 0
                    }
                },
                labels: {
                    items: [{
                        html: '<b>总数：'+send_total+'</b><br>累计占比如下',
                        style: {
                            left: '100px',
                            top: '18px',
                            color: (Highcharts.theme && Highcharts.theme.textColor) || 'black'
                        }
                    }]
                },
                series: [{
                    name: '总量',
                    type: 'column',
                    yAxis: 0,
                    color : "#7CB5EC",
                    data: send_suc,
                    tooltip: {
                        valueSuffix: ' 条'
                    }
                },{
                    name: '省份',
                    type: 'column',
                    yAxis: 0,
                    color: "#F7A35C",
                    data: provinces_suc,
                    tooltip: {
                        valueSuffix: ' 条'
                    }
                },{
                    name: '占比',
                    type: 'spline',
                    yAxis: 1,
                    color: "#FF0000",
                    data: pratio,
                    tooltip: {
                        valueSuffix: ' %'
                    }
                }, {
                    type: 'pie',
                    name: '累计占比',
                    tooltip: {
                        // head + 每个 point + footer 拼接成完整的 table
                        headerFormat: '<span style="font-size:10px"><b>{point.key}</b></span><table>',
                        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}：</td>' +
                        '<td style="padding:0"><b>{point.y}</b> %</td></tr>',
                        footerFormat: '</table>',
                        shared: true,
                        useHTML: true
                    },
                    data: [{
                        name: '省份',
                        y: pratio_total,
                        color: "#F7A35C"
                    }, {
                        name: '其他',
                        y: pratio_other,
                        color: "#D0D0D0"
                    }],
                    center: [100, 80],
                    size: 100,
                    showInLegend: false,
                    dataLabels: {
                        enabled: false
                    }
                }]
            });
        }
    });
    layui.layer.full(index);
    $(window).on("resize", function () {
        layui.layer.full(index)
    })
}