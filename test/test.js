/* eslint-disable */

const assert = require('assert');
const recommend = require('../lib/cf_api.js');

describe('D1 tests"', function() {
    console.log("Simple rating database (D1):")
    console.log("\n        I0 I1 I2\n");
    console.log("   U0  [1  1  1]");
    console.log("   U1  [1  0  1]");
    console.log("   U2  [1  0  0]");

    const ratings = [
        [1, 1, 1],
        [1, 0, 1],
        [1, 0, 0],
      ];
    const coOccurrenceMatrix = recommend.coMatrix(ratings)
    describe('#Recommendations', function() {
        it('Recommendations for U1 should be [I1]', function() {
            recommendations =recommend.getRecommendations(ratings, coOccurrenceMatrix, 1);
            assert.deepEqual(recommendations, [1]);
        });
        it('Recommendations for U2 should be [I2, I1]', function() {
        recommendations =recommend.getRecommendations(ratings, coOccurrenceMatrix, 2);
        assert.deepEqual(recommendations, [2, 1]);
        });
        it('Recommendations for U0 should be []', function() {
            recommendations =recommend.getRecommendations(ratings, coOccurrenceMatrix, 0);
            assert.deepEqual(recommendations, []);
        });
  });
    describe('#Bad arguments when trying to get recommendations', function() {
        it('Recommendations for U4.7 should throw a TypeError', function() {
            assert.throws(() => recommend.getRecommendations(ratings, coOccurrenceMatrix, 4.7), TypeError);
        });
        it('Recommendations for U47 should throw a RangeError', function() {
            assert.throws(() => recommend.getRecommendations(ratings, coOccurrenceMatrix, 47), RangeError);
        });
    });
});

