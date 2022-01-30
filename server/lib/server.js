'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.port = exports.app = void 0;
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = __importDefault(require("express"));
const todos_1 = __importDefault(require("./todos"));
exports.app = (0, express_1.default)();
const api = express_1.default.Router();
exports.port = process.env.PORT || 8080;
exports.app.use(body_parser_1.default.json());
// API Routes.
api.get('/', function (req, res) {
    res.status(200)
        .set('Content-Type', 'text/plain')
        .send('ok');
    console.log("hoge");
});
api.get('/todos', function (req, res) {
    todos_1.default.getAll(_handleApiResponse(res));
});
api.get('/todos/:id', function (req, res) {
    const id = parseInt(req.params.id, 10);
    todos_1.default.get(id, _handleApiResponse(res));
});
api.post('/todos', function (req, res) {
    todos_1.default.insert(req.body, _handleApiResponse(res, 201));
});
api.put('/todos/:id', function (req, res) {
    const id = parseInt(req.params.id, 10);
    todos_1.default.update(id, req.body, _handleApiResponse(res));
});
api.delete('/todos', function (req, res) {
    todos_1.default.deleteCompleted(_handleApiResponse(res, 204));
});
api.delete('/todos/:id', function (req, res) {
    const id = parseInt(req.params.id, 10);
    todos_1.default.delete(id, _handleApiResponse(res, 204));
});
const _handleApiResponse = (res, successStatus) => {
    return ((err, payload) => {
        if (err) {
            console.error(err);
            res.status(err.code).send(err.message);
            return;
        }
        if (successStatus) {
            res.status(successStatus);
        }
        res.json(payload);
    });
};
// docker-compose開発環境用
if (process.env.DATASTORE_EMULATOR_HOST) {
    exports.app.use('/api/v1', api);
}
// 本番環境
else {
    exports.app.use('/', express_1.default.static(__dirname + '/staticDir'));
    exports.app.use('/api/v1', api);
}
