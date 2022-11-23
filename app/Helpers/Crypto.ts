

export default class Crypto {
    public encrypt(text: String) {
        var sha1 = require('js-sha1');
        var md5 = require('js-md5');
        return md5(sha1(text));
    }
}