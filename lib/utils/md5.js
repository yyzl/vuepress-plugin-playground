module.exports = function md5(str) {
  return require('crypto')
    .createHash('md5')
    .update(Buffer.from(String(str)))
    .digest('hex')
    .slice(0, 8)
}
