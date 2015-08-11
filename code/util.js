// Util functions for dealing with paths and images.

var path = require('path');

var util = {};

// TODO: migrate to llab.
/* Retun the path to a topic file.

 */
util.topicPath = function (baseURL, topicURL) {
    return baseURL + 'topic/' + topicURL;
}

/*
 *
 */
util.edXPath = function (url) {
    url = url[0] == '/' ? url.slice(1) : url;
    return '/static/' + url.replace(/\//g, '_');
}

/* This does the bulk of the work to tranform a path into an edX URL
 * @param {string}
 * FIXME -- this breaks if passed in a full URL! http:// gahhhhhh
 */
util.transformURL = function (baseURL, filePath, url) {
    if (url.indexOf('/static') == 0 || url.indexOf('http') == 0 ||
        url.indexOf('//') == 0) {
        return url;
    }

    var fileDir = path.dirname(filePath);
    url = path.normalize(url);

    if (url.indexOf(baseURL) != -1) {
        url = url.replace(baseURL, '');
    } else { // Hopefully a ../ thing
        url = path.resolve(fileDir, url);
        // Node's resolve returns an absolute URL, so fix that.
        // if for some reason we have '/cur/...' then the relative path will be
        // "absolute" by default.
        if (fileDir[0] !== '/') {
            url = path.relative('./', url);
        }
    }

    return util.edXPath(url);
}

/** Normalize spaces and other special chars in filenames.
 *  Warning: Don't pass this a full path as it removes /
 *  @param {string} the filename to be normalized
 *  @return {string} a normalized filename.
 */
util.edXFileName =  function fileName (name) {
    // Windows rules / ? < > \ : * | "
    return name.replace(/[\s+/:|*\\<>?"!,';&^]/g, '_');
}

function BasicLogger (level) {
    this.level = level;
}

BasicLogger.prototype.log = function (level, args) {
    if (level >= this.level) {
        console.log(Function.arguments.slice(1));
    }
}

BasicLogger.prototype.setLevel = function (level) {
    this.level = level;
    return level;
}

BasicLogger.prototype.getLevel = function () {
    return this.level;
}

util.BasicLogger = BasicLogger;

module.exports = util;