"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RealTimeMonitor = void 0;
var RealTimeMonitor = /** @class */ (function () {
    function RealTimeMonitor(initpoints, maxpoints) {
        this.metrics = [];
        this.maxpoints = maxpoints;
        this.timeout = null;
        this.eventHandler = null;
        var points = initpoints <= maxpoints ? initpoints : maxpoints;
        var date = new Date();
        date.setSeconds(date.getSeconds() - points);
        for (var i = 0; i < points; i++) {
            var seconds = date.getSeconds();
            console.log(seconds);
            date.setSeconds(date.getSeconds() + 1);
            var timeStamp = date.getTime();
            var value = Math.floor(Math.random() * 80) + 100;
            this.metrics.push({ value: value, date: timeStamp });
        }
        console.log('init finish');
    }
    RealTimeMonitor.prototype.initRealtimeGeneration = function () {
        var _this = this;
        var timelapse = Math.floor(Math.random() * 1000) + 1000;
        this.timeout = setTimeout(function () {
            var value = Math.floor(Math.random() * 80) + 100;
            var date = new Date();
            var timeStamp = date.getTime();
            if (_this.metrics.length == _this.maxpoints) {
                _this.metrics = _this.metrics.slice(1, _this.metrics.length);
            }
            _this.metrics.push({ value: value, date: timeStamp });
            if (_this.eventHandler) {
                _this.eventHandler();
            }
            _this.initRealtimeGeneration();
        }, timelapse);
    };
    RealTimeMonitor.prototype.stopRealtimeGeneration = function () {
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }
    };
    return RealTimeMonitor;
}());
exports.RealTimeMonitor = RealTimeMonitor;
//# sourceMappingURL=realTimeStats.js.map