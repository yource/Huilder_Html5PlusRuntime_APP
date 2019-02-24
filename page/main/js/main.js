var newsDetailWebview = titleNView = myChart = null;
var picker2 = new mui.PopPicker();
picker2.setData([{
        value: 'one',
        text: '周杰伦'
    },
    {
        value: 'two',
        text: '丢火车'
    },
    {
        value: 'three',
        text: '大白菜'
    },
    {
        value: 'four',
        text: '太阳系'
    },
]);
var picker3 = new mui.PopPicker({
    layer: 2
});
picker3.setData(cityData);
var picker4 = new mui.DtPicker({
    type: 'datetime'
});

// tab1页面初始化方法
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

function init2() {
    var myChart = echarts.init(document.getElementById('chart'));
    var option = {
        title: {
            text: '用户访问来源',
            subtext: '数据来自YOURCE',
            x: 'center'
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
            ],
            itemStyle: {
                emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }]
    };
    myChart.setOption(option);
}

function plusReady() {
    // 监听自定义事件
    document.addEventListener('init', function (event) {
        var userId = event.detail.userId;
        var userName = event.detail.userName;
        init1();
    })

    // 预加载详情页
    titleNView = {
        backgroundColor: '#f7f7f7',
        titleText: '',
        titleColor: '#000000',
        type: 'transparent',
        autoBackButton: true,
        splitLine: {
            color: '#cccccc'
        }
    }
    router.newsDetail.styles.titleNView = titleNView;
    newsDetailWebview = router.create(router.newsDetail);

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
                width: document.documentElement.clientWidth-20+"px",
                height: "300px"
            }
        }
    },
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
        });
    },
    methods: {
        bannerClick: function (url) {
            router.openURL(url, "最热音乐圈")
        },
        loadBottom: function () {
            var ref = this.$refs.loadmore;

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
        }
    },
    watch: {
        tab: function (tab) {
            if (tab == "tab2" && !$main.tab2.initFlag) {
                init2()
            }
        }
    }
})
