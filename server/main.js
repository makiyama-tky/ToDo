"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const createApp_1 = __importDefault(require("./createApp"));
const connectDb_1 = __importDefault(require("./connectDb"));
const main = async () => {
    const db = (await connectDb_1.default()).db('todo');
    const app = createApp_1.default(db);
    const httpd = app.listen(3000);
    console.log('Server running on port 3000');
};
main();
