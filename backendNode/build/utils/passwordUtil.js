"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var md5 = require('md5');
class PasswordUtil {
    constructor() {
        this.encryptPassword = (password) => {
            return md5(password);
        };
        this.comparePassword = (passwordAComparar, hashUsuario) => {
            let passwordACompararHasheada = md5(passwordAComparar);
            if (passwordACompararHasheada == hashUsuario)
                return true;
            return false;
        };
    }
}
exports.default = PasswordUtil;
PasswordUtil.instance = new PasswordUtil();
