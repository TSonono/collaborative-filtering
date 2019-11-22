const recommendations = require('../lib/cf_api.js');

const ratings = [
  [1, 1, 1],
  [1, 0, 1],
  [1, 0, 0],
];

const a = recommendations.cFilter(ratings, 2);

console.log(a);
