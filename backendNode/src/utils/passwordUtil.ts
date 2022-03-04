var md5 = require('md5');

export default class PasswordUtil {
    static instance = new PasswordUtil()

    encryptPassword = (password: string): string => {
        return md5(password)
    }

    comparePassword = (passwordAComparar: string, hashUsuario: string): boolean => {
        let passwordACompararHasheada = md5(passwordAComparar)
        if (passwordACompararHasheada == hashUsuario) return true
        return false
    }
}