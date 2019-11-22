/* eslint-disable */

const assert = require('assert');
const recommend = require('../lib/cf_api.js');
const math = require('mathjs');

describe('D1 tests"', function() {
    console.log("Simple rating database (D1):")
    console.log("\n        I0 I1 I2\n");
    console.log("   U0  [1  1  1]");
    console.log("   U1  [1  0  1]");
    console.log("   U2  [1  0  0]");

    describe('Create the co-occurrence matrix', function() {
        it('The ratings matrix is a number 5 instead of an array', function() {
            assert.throws(() => recommend.coMatrix(5), TypeError)
        });
        it('The ratings matrix has incorrect dimensions', function() {
            assert.throws(() => recommend.coMatrix([[1, 1, 1], [1, 0, 1], [1, 0]]), RangeError)
        });
        it('The ratings matrix consists of erroneous elements', function() {
            assert.throws(() => recommend.coMatrix([[1, 1, 1], [1, 0, 'hello'], [1 ,'world', 0]]), TypeError)
        });
    });

    const ratings = [
        [1, 1, 1],
        [1, 0, 1],
        [1, 0, 0],
      ];
    const coOccurrenceMatrix = recommend.coMatrix(ratings)

    describe('Get recommendations', function() {
        it('Recommendations for U1 should be [I1]', function() {
            recommendations = recommend.getRecommendations(ratings, coOccurrenceMatrix, 1);
            assert.deepEqual(recommendations, [1]);
        });
        it('Recommendations for U2 should be [I2, I1]', function() {
        recommendations = recommend.getRecommendations(ratings, coOccurrenceMatrix, 2);
        assert.deepEqual(recommendations, [2, 1]);
        });
        it('Recommendations for U0 should be []', function() {
            recommendations = recommend.getRecommendations(ratings, coOccurrenceMatrix, 0);
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
        it('A co occurrence matric which does not match the dimensions for the ratings', function() {
            assert.throws(() => recommend.getRecommendations(ratings, math.ones(4, 7), 1), RangeError);
        });
        it('Creating an invalid co-occurrence matrix (three dimensional matrix)', function() {
            assert.throws(() => recommend.getRecommendations(ratings, math.matrix([[[1, 1, 0], [1, 1, 1]], [[1, 0, 1], [0, 0, 1]]]), 1), RangeError);
        });
        it('Passing an array instead of a mathjs matrix as a co occurrence matrix', function() {
            assert.throws(() => recommend.getRecommendations(ratings, [4, 7], 1), TypeError);
        });
        it('Passing a ratings array which is invalid', function() {
            assert.throws(() => recommend.getRecommendations([[1, 1, 1], [1, 0, 1], [1, 0]], coOccurrenceMatrix, 1), RangeError);
        });
    });

    describe('Tests using the cFilter function which runs the whole process and generates recommendations for a user', function() {
        it('Run the process and generate recommendations for user 2', function() {
            recommendations = recommend.cFilter(ratings, 2);
            assert.deepEqual(recommendations, [2, 1]);
        });
    });
});

