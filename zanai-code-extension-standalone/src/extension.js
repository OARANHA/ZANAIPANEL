"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const zanaiCodeIntegration_1 = require("./zanaiCodeIntegration");
function activate(context) {
    console.log('ZanaiCode está ativo!');
    const zanaiCodeIntegration = new zanaiCodeIntegration_1.ZanaiCodeIntegration(context);
    context.subscriptions.push(zanaiCodeIntegration);
}
function deactivate() {
    console.log('ZanaiCode desativado');
}
//# sourceMappingURL=extension.js.map