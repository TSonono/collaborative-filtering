const recommendations = require('./cf_api.js');

const ratings = [
  [1, 1, 1],
  [1, 0, 1],
  [1, 0, 0],
];

const a = recommendations.cfFilter(ratings);

recommendations.getRecommendations(ratings, a, 2, 3);
