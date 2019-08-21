"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var weapp_1 = require("../../libs/wx/weapp");
weapp_1.HookPage({
    navTitle: 'Zeno\' Lib',
    data: {
        html: "<div class=\"article \" id=\"article\" data-islow-browser=\"0\"><div class=\"article-content\"><p><span class=\"bjh-p\">\u65E5\u672C\u6700\u5927\u79FB\u52A8\u901A\u4FE1\u8FD0\u8425\u5546\u90FD\u79D1\u6469\u516C\u53F820\u65E5\u5BA3\u5E03\uFF0C\u5C06\u4ECE21\u65E5\u5F00\u59CB\u63A5\u53D7\u534E\u4E3AP30 Pro\u667A\u80FD\u624B\u673A\u7684\u9884\u8BA2\u3002\u81F3\u6B64\uFF0C\u65E5\u672C\u4E09\u5927\u8FD0\u8425\u5546\u5747\u5DF2\u91CD\u542F\u9500\u552E\u534E\u4E3A\u624B\u673A\u3002</span></p><div class=\"img-container\"><img class=\"large\" data-loadfunc=\"0\" src=\"https://pics3.baidu.com/feed/1ad5ad6eddc451dabd55d152d57f0363d116326b.jpeg?token=86dd3ecd545ea90ecc06afeded589ee5&amp;s=5F1829C4252334B44811B5050300A041\" data-loaded=\"0\"></div><p><span class=\"bjh-p\">\u65E5\u672C\u4E1C\u4EAC\uFF0C\u534E\u4E3A\u63A8\u51FA\u65B0\u6B3EP30\u7CFB\u5217\u624B\u673A\u3002</span></p><p><span class=\"bjh-p\"><span class=\"bjh-br\"></span>\u90FD\u79D1\u6469\u516C\u53F8\u5F53\u5929\u5BA3\u5E03\uFF0C\u6B64\u524D\u505C\u6B62\u63A5\u53D7\u9884\u8BA2\u7684\u534E\u4E3A\u65B0\u6B3E\u667A\u80FD\u624B\u673AP30 Pro HW-02L\u5C06\u4ECE21\u65E5\u8D77\u6062\u590D\u9884\u8BA2\uFF0C\u9884\u8BA19\u6708\u6B63\u5F0F\u9500\u552E\u3002</span></p><p><span class=\"bjh-p\"><span class=\"bjh-br\"></span>\u90FD\u79D1\u6469\u516C\u53F8\u539F\u8BA1\u5212\u5728\u4ECA\u5E74\u590F\u5929\u6B63\u5F0F\u5F00\u59CB\u9500\u552E\u534E\u4E3AP30 Pro\u667A\u80FD\u624B\u673A\uFF0C\u4F46\u5728\u7F8E\u56FD\u5546\u52A1\u90E8\u5BA3\u5E03\u5BF9\u534E\u4E3A\u516C\u53F8\u5B9E\u65BD\u51FA\u53E3\u7BA1\u5236\u63AA\u65BD\u4E4B\u540E\uFF0C\u90FD\u79D1\u6469\u516C\u53F8\u4ECA\u5E745\u6708\u5BA3\u5E03\u5EF6\u671F\u53D1\u552E\u3002</span></p><p><span class=\"bjh-p\"><span class=\"bjh-br\"></span>\u65E5\u672C\u79FB\u52A8\u901A\u4FE1\u8FD0\u8425\u5546KDDI\u516C\u53F8\u672C\u67088\u65E5\u5DF2\u5F00\u59CB\u9762\u5411\u65E5\u672C\u5168\u56FD\u53D1\u552E\u534E\u4E3A\u751F\u4EA7\u7684\u65B0\u6B3E\u667A\u80FD\u624B\u673AP30 lite Premium\u3002\u9488\u5BF9\u6B64\u524D\u7528\u6237\u5BF9\u534E\u4E3A\u624B\u673A\u65E0\u6CD5\u66F4\u65B0\u5B89\u5353\u64CD\u4F5C\u7CFB\u7EDF\u7684\u62C5\u5FE7\uFF0CKDDI\u8868\u793A\uFF0C\u5B89\u5353\u7CFB\u7EDF\u53EF\u4EE5\u6B63\u5E38\u66F4\u65B0\u4F7F\u7528\u3002</span></p><p><span class=\"bjh-p\"><span class=\"bjh-br\"></span>\u636E\u6B64\u95F4\u5A92\u4F53\u62A5\u9053\uFF0C\u53E6\u4E00\u8FD0\u8425\u5546\u8F6F\u94F6\u516C\u53F88\u65E5\u4E5F\u91CD\u542F\u4E86\u534E\u4E3A\u624B\u673A\u7684\u9500\u552E\u3002</span></p></div><audio height=\"0\" width=\"0\" id=\"musicAudio\" data-play-index=\"\"><source></audio></div>"
    },
    onRefresh: function () {
        var _this = this;
        console.log("WTF");
        setTimeout(function () {
            console.log("stop");
            _this.setData({ alreadyLoadData: true });
        }, 500);
    }
});
//# sourceMappingURL=index.js.map