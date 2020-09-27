"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var socketio = __importStar(require("socket.io"));
var cors_1 = __importDefault(require("cors"));
var realTimeStats_1 = require("./realTimeStats");
var productionStats_1 = require("./productionStats");
var reportProxy_1 = require("./reportProxy");
var reportProxy = new reportProxy_1.ReportProxy(10000);
console.log(reportProxy);
console.log('Entered');
var app = express_1.default();
app.set('origins', 'http://localhost:8080');
app.use(cors_1.default());
app.get('/report', function (req, res) {
    var _a, _b, _c;
    var quality = (_a = req.query.quality) === null || _a === void 0 ? void 0 : _a.toString();
    var ini = undefined;
    if (typeof req.query.ini === 'string') {
        ini = req.query.ini;
    }
    var end = undefined;
    if (typeof req.query.end === 'string') {
        end = req.query.end;
    }
    var page = (_b = req.query.page) === null || _b === void 0 ? void 0 : _b.toString();
    var rows = (_c = req.query.rows) === null || _c === void 0 ? void 0 : _c.toString();
    var iniDate = ini ? new Date(ini) : undefined;
    var endDate = end ? new Date(end) : undefined;
    var pageInt = page ? parseInt(page) : 0;
    var rowsInt = rows ? parseInt(rows) : 10;
    var result = reportProxy.find(quality, iniDate, endDate, pageInt, rowsInt);
    res.send(result);
});
var server = app.listen(3000, function () {
    console.log('listening port 3000');
});
var io = socketio.listen(server);
var realTimeMonitor = new realTimeStats_1.RealTimeMonitor(50, 100);
var productionMonitor = new productionStats_1.ProductionMonitor();
realTimeMonitor.initRealtimeGeneration();
productionMonitor.initProductionGeneration();
io.on("connection", function (socket) {
    console.log("a user connected");
    socket.on('disconnect', function () {
        console.log('Disconnected');
    });
    socket.emit("metrics", realTimeMonitor.metrics);
    socket.emit("production", productionMonitor.production);
    realTimeMonitor.eventHandler = function () {
        socket.emit("metrics", realTimeMonitor.metrics);
    };
    productionMonitor.eventHandler = function () {
        socket.emit("production", productionMonitor.production);
    };
});
//# sourceMappingURL=index.js.map