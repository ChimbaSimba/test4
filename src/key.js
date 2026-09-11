'use strict';
function cacheKey(id) {
  return `fixture:${String(id)}`;
}
module.exports = { cacheKey };
