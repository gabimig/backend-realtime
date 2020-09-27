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
console.log('Entered');
var app = express_1.default();
app.set('origins', 'http://localhost:8080');
app.use(cors_1.default());
app.get('/', function (_, res) {
    res.send("hello internet.");
});
var server = app.listen(3000, function () {
    console.log('listening port 3000');
});
var io = socketio.listen(server);
var realTimeMonitor = new realTimeStats_1.RealTimeMonitor(50, 100);
realTimeMonitor.initRealtimeGeneration();
// whenever a user connects on port 3000 via
// a websocket, log that a user has connected
io.on("connection", function (socket) {
    console.log("a user connected");
    socket.on('disconnect', function () {
        console.log('Disconnected');
    });
    realTimeMonitor.eventHandler = function () {
        socket.emit("metrics", realTimeMonitor.metrics);
    };
});
//# sourceMappingURL=index.js.map