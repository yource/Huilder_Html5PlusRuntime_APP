// 新闻详情页面窗口对象
var newsDetailWebview = null;
// 新闻详情页原生标题
var titleNView = {
    backgroundColor: '#f7f7f7',
    titleText: '',
    titleColor: '#000000',
    type: 'transparent',
    autoBackButton: true,
    splitLine: {
        color: '#cccccc'
    }
};
// echarts图表;
var chart1 = chart2 = chart3 = null;
// 选择器
var picker2 = new mui.PopPicker();
var picker3 = new mui.PopPicker({
    layer: 2
});
var picker4 = new mui.DtPicker({
    type: 'date'
});
// 定时器-调节屏幕亮度
var interval = null;
// 音频文件目录对象
var gentry = null;
// 音频播放对象
var playingAudio = null;
// 录音对象
var recordPlus = null;
var recordInterval = null;
/**
 * tab1页面初始化方法
 */
function init1() {
    if ($main.tab1.initFlag) {
        return;
    }
    $main.tab1.initFlag = true;
    mui.ajax("https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg", {
        data: {
            platform: "h5",
            needNewCode: 1
        },
        crossDomain: true,
        success: function (response) {
            $main.tab1.banner = JSON.parse(response).data.slider;
        }
    });
    mui.ajax("http://spider.dcloud.net.cn/api/news", {
        data: {
            column: "id,post_id,title,author_name,cover,published_at",
            pageSize: 10
        },
        success: function (response) {
            $main.tab1.loading = false;
            $main.tab1.news = response.map(function (item) {
                return {
                    guid: item.post_id,
                    title: item.title,
                    author: item.author_name,
                    cover: item.cover,
                    time: dateUtils.format(item.published_at)
                }
            });
            $main.tab1.minId = response[response.length - 1].id;
        }
    })
}

/**
 * tab1图文列表底部刷新
 */
function loadBottom() {
    var ref = $main.$refs.loadmore;
    var data = {
        column: "id,post_id,title,author_name,cover,published_at"
    };

    if ($main.tab1.minId) {
        data.minId = $main.tab1.minId;
        data.time = new Date().getTime() + "";
        data.pageSize = 10;
    }
    mui.getJSON("http://spider.dcloud.net.cn/api/news", data, function (rsp) {
        // 结束“加载中”状态
        ref.onBottomLoaded();
        if (rsp && rsp.length > 0) {
            $main.tab1.minId = rsp[rsp.length - 1].id;
            var addNews = rsp.map(function (item) {
                return {
                    guid: item.post_id,
                    title: item.title,
                    author: item.author_name,
                    cover: item.cover,
                    time: dateUtils.format(item.published_at)
                }
            });
            $main.tab1.news = $main.tab1.news.concat(addNews);
        }
    });
}

/**
 * tab2页面初始化方法
 */
function init2() {
    // 选择器
    picker2.setData([{
            value: 'one',
            text: '选项一'
        },
        {
            value: 'two',
            text: '选项二'
        },
        {
            value: 'three',
            text: '选项三'
        },
        {
            value: 'four',
            text: '选相四'
        },
    ]);
    picker3.setData(cityData);

    // 图表
    chart1 = echarts.init(document.getElementById('chart1'));
    showChart1();
    chart2 = echarts.init(document.getElementById('chart2'));
    chart3 = echarts.init(document.getElementById('chart3'));

    // 滑动标签控制
    setTimeout(function () {
        document.querySelector("#sliderProgressBar").style.width = '33.3%';
        var myslider = mui('#slider').slider();
        myslider.refresh();
    }, 200)
    document.getElementById('slider').addEventListener('slide', function (e) {
        if (e.detail.slideNumber === 1 && !$main.tab2.chart2init) {
            showChart2();
            $main.tab2.chart2init = true;
        } else if (e.detail.slideNumber === 2 && !$main.tab2.chart3init) {
            showChart3();
            $main.tab2.chart3init = true;
        }
    });
}

function showChart1() {
    var option1 = {
        title: {
            text: '用户访问来源',
            subtext: '数据来自YOURCE',
            x: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: "访问量 : {c}<br/>百分比：{d}% "
        },
        series: [{
            name: '访问来源',
            type: 'pie',
            radius: '60%',
            center: ['50%', '60%'],
            data: [{
                    value: 335,
                    name: '直接访问'
                },
                {
                    value: 310,
                    name: '邮件营销'
                },
                {
                    value: 234,
                    name: '联盟广告'
                },
                {
                    value: 135,
                    name: '视频广告'
                },
                {
                    value: 1548,
                    name: '搜索引擎'
                }
            ]
        }]
    };
    chart1.setOption(option1);
}

function showChart2() {
    var option2 = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#6a7985'
                }
            }
        },
        legend: {
            data: ['视频广告', '直接访问', '搜索引擎']
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [{
            type: 'category',
            boundaryGap: false,
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        }],
        yAxis: [{
            type: 'value'
        }],
        series: [{
                name: '视频广告',
                type: 'line',
                stack: '总量',
                data: [120, 132, 101, 134, 90, 230, 210]
            },
            {
                name: '直接访问',
                type: 'line',
                stack: '总量',
                data: [320, 332, 301, 334, 390, 330, 320]
            },
            {
                name: '搜索引擎',
                type: 'line',
                stack: '总量',
                data: [480, 560, 580, 620, 680, 520, 600]
            }
        ]
    };
    chart2.setOption(option2);
}

function showChart3() {
    var option3 = {
        legend: {
            data: ['百度', '谷歌', '必应', '其他']
        },
        grid: {
            left: '1%',
            right: '1%',
            bottom: '1%',
            containLabel: true
        },
        xAxis: [{
            type: 'category',
            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        }],
        yAxis: [{
            type: 'value'
        }],
        series: [{
                name: '百度',
                type: 'bar',
                barWidth: 5,
                markLine: {
                    lineStyle: {
                        normal: {
                            type: 'dashed'
                        }
                    },
                    data: [
                        [{
                            type: 'min'
                        }, {
                            type: 'max'
                        }]
                    ]
                },
                data: [620, 732, 701, 734, 1090, 1130, 1120]
            },
            {
                name: '谷歌',
                type: 'bar',
                data: [120, 132, 101, 134, 290, 230, 220]
            },
            {
                name: '必应',
                type: 'bar',
                data: [60, 72, 71, 74, 190, 130, 110]
            },
            {
                name: '其他',
                type: 'bar',
                data: [62, 82, 91, 84, 109, 110, 120]
            }
        ]
    };
    chart3.setOption(option3);
}

// 读取录音历史列表
function updateHistory() {
    var reader = gentry.createReader();
    reader.readEntries(function (entries) {
        for (var i in entries) {
            if (entries[i].isFile) {
                var entry = entries[i];
                entry.getMetadata(function(metadata) {
                	entry.time = dateToStr(metadata.modificationTime);
                    entry.percent = 0;
                    entry.index = $main.tab2.audioList.length;
                	$main.tab2.audioList.push(entry);
                }, function(e) {});
            }
        }
    }, function (e) {
        mui.toast('读取录音列表失败：' + e.message);
    });
}
// 开始播放
function startPlay(url) {

}
// 停止播放
function stopPlay() {

}

function plusReady() {
    // 监听fire自定义事件
    document.addEventListener('init', function (event) {
        var userId = event.detail.userId;
        var userName = event.detail.userName;
        init1();
    })

    // 预加载新闻详情页
    router.newsDetail.styles.titleNView = titleNView;
    newsDetailWebview = router.create(router.newsDetail);

    // 获取音频目录对象
    plus.io.resolveLocalFileSystemURL('_doc/', function (entry) {
        entry.getDirectory('audio', {
            create: true
        }, function (dir) {
            gentry = dir;
            updateHistory();
        }, function (e) {
            outSet('Get directory "audio" failed: ' + e.message);
        });
    }, function (e) {
        outSet('Resolve "_doc/" failed: ' + e.message);
    });
    // 获取录音对象
    recordPlus = plus.audio.getRecorder();

    // 监听安卓返回键
    var backButtonPress = 0;
    var main = plus.android.runtimeMainActivity();
    mui.back = function (event) {
        if ($main.tab2.showPicker1) {
            $main.tab2.showPicker1 = false;
            return false;
        } else if ($main.tab != "tab1") {
            $main.tab = "tab1";
            return false;
        } else {
            main.moveTaskToBack(false);
        }
    };
}


var $main = new Vue({
    el: "#main",
    data: {
        tab: "tab1",
        tab1: {
            initFlag: false,
            bannerHeight: 150,
            listHeight: 450,
            banner: [],
            news: [],
            loading: true,
            allLoaded: false,
            minId: ""
        },
        tab2: {
            initFlag: false,
            showPicker1: false,
            actionsheet: [{
                name: "选项1",
                method: function () {
                    mui.toast("选项1")
                }
            }, {
                name: "选项2",
                method: function () {
                    mui.toast("选项2")
                }
            }],
            chartStyle: {
                width: document.documentElement.clientWidth - 20 + "px",
                height: "300px"
            },
            chart2init: false,
            chart3init: false,
            device: {
                language: "中文",
                name: "",
                version: "",
                model: "",
                vendor: "",
                resolution: ""
            },
            audioList: [],
            svgPoints: "70,50 150,100 70,150",
            playing: false,
            showModel: false,
            recordTime: "00:00:00"
        },
        bright: 0.5,
    },
    computed: {},
    created: function () {
        this.tab1.bannerHeight = (document.documentElement.clientWidth) / (720 / 288);
    },
    mounted: function () {
        mui.init();
        mui.plusReady(function () {
            plusReady();
            if (!$main.tab1.initFlag) {
                init1();
            }
            $main.tab2.device.language = plus.os.language;
            $main.tab2.device.name = plus.os.name;
            $main.tab2.device.version = plus.os.version;
            $main.tab2.device.model = plus.device.model;
            $main.tab2.device.vendor = plus.device.vendor;
            $main.tab2.device.resolution = parseInt(plus.screen.resolutionWidth * plus.screen.scale) +
                " x " + parseInt(plus.screen.resolutionHeight * plus.screen.scale);
            $main.bright = parseInt(plus.screen.getBrightness() * 100);
        });
    },
    methods: {
        bannerClick: function (url) {
            router.openURL(url, "最热音乐圈")
        },
        toNewsDetail: function (item) {
            //触发子窗口变更新闻详情
            mui.fire(newsDetailWebview, 'get_detail', {
                guid: item.guid,
                title: item.title,
                author: item.author,
                time: item.time,
                cover: item.cover
            });

            //更改详情页原生导航条信息
            titleNView.titleText = item.title;
            newsDetailWebview.setStyle({
                "titleNView": titleNView
            });
            setTimeout(function () {
                plus.webview.show("newsDetail", "slide-in-right", 200)
            }, 100)
        },
        showPicker2: function () {
            picker2.show(function (items) {
                mui.toast(items[0].text);
            })
        },
        showPicker3: function () {
            picker3.show(function (items) {
                mui.toast(items[0].text + " " + items[1].text)
            })
        },
        showPicker4: function () {
            picker4.show(function (selectItems) {
                mui.toast(selectItems);
            })
        },
        loadBottom: loadBottom,
        playAudio: function (index) {
            console.log(index)
            var audioOnPlay = document.getElementById("audio"+index);
            console.log(audioOnPlay);
            audioOnPlay.play();
        },
        playAudio2: function () {
            if ($main.tab2.playing) {
                $main.tab2.svgPoints = "70,50 150,100 70,150";
                $main.tab2.percent = 40;
                $main.tab2.playing = false;
            } else {
                $main.tab2.svgPoints = "60,60 140,60 140,140 60,140";
                $main.tab2.playing = true;
                $main.tab2.percent = 80;
            }

        },
        startRecord: function () {
            $main.tab2.showModel = true;
            recordPlus.record({
                filename: '_doc/audio/'
            }, function (p) {
                plus.io.resolveLocalFileSystemURL(p, function (entry) {
                    entry.getMetadata(function(metadata) {
                        entry.time = dateToStr(metadata.modificationTime);
                        entry.percent = 0;
                        entry.index = $main.tab2.audioList.length;
                        $main.tab2.audioList.push(entry);
                    }, function(e) {mui.toast('录制完成');});
                }, function (e) {mui.toast('获取录音信息失败');});
            }, function (e) {mui.toast('录制失败');});
            var t = 0;
            recordInterval = setInterval(function () {
                t++;
                $main.tab2.recordTime = timeToStr(t);
            }, 1000);
        },
        stopRecord: function () {
            $main.tab2.showModel = false;
            $main.tab2.recordTime = '00:00:00';
            clearInterval(recordInterval);
            recordInterval = null;
            recordPlus.stop();
        },
        cleanRecord:function(){
            gentry.removeRecursively(function() {
                $main.tab2.audioList = [];
            }, function(e) {});
        }
    },
    watch: {
        tab: function (tab) {
            if (tab == "tab2" && !$main.tab2.initFlag) {
                init2()
            }
        },
        bright: function (bright) {
            if (!interval) {
                interval = setTimeout(function () {
                    plus.screen.setBrightness(bright * 0.01);
                    interval = null;
                }, 100)
            }
        }
    }
})


function timeToStr(ts){
	if(isNaN(ts)){
		return "--:--:--";
	}
	var h=parseInt(ts/3600);
	var m=parseInt((ts%3600)/60);
	var s=parseInt(ts%60);
	return (ultZeroize(h)+":"+ultZeroize(m)+":"+ultZeroize(s));
};
function dateToStr(d){
	return (d.getFullYear()+"-"+ultZeroize(d.getMonth()+1)+"-"+ultZeroize(d.getDate())+" "+ultZeroize(d.getHours())+":"+ultZeroize(d.getMinutes())+":"+ultZeroize(d.getSeconds()));
};
function ultZeroize(v,l){
	var z="";
	l=l||2;
	v=String(v);
	for(var i=0;i<l-v.length;i++){
		z+="0";
	}
	return z+v;
};