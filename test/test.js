/* eslint-disable */

const assert = require('assert');
const recommend = require('../lib/cf_api.js');
const math = require('mathjs');
const databases = require('./databases')

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

    const coOccurrenceMatrix = recommend.coMatrix(databases.simple)

    describe('Get recommendations', function() {
        it('Recommendations for U1 should be [I1]', function() {
            recommendations = recommend.getRecommendations(databases.simple, coOccurrenceMatrix, 1);
            assert.deepEqual(recommendations, [1]);
        });
        it('Recommendations for U2 should be [I2, I1]', function() {
        recommendations = recommend.getRecommendations(databases.simple, coOccurrenceMatrix, 2);
        assert.deepEqual(recommendations, [2, 1]);
        });
        it('Recommendations for U0 should be []', function() {
            recommendations = recommend.getRecommendations(databases.simple, coOccurrenceMatrix, 0);
            assert.deepEqual(recommendations, []);
        });
  });
    describe('Bad arguments when trying to get recommendations', function() {
        it('Recommendations for U4.7 should throw a TypeError', function() {
            assert.throws(() => recommend.getRecommendations(databases.simple, coOccurrenceMatrix, 4.7), TypeError);
        });
        it('Recommendations for U47 should throw a RangeError', function() {
            assert.throws(() => recommend.getRecommendations(databases.simple, coOccurrenceMatrix, 47), RangeError);
        });
        it('A co occurrence matric which does not match the dimensions for the ratings', function() {
            assert.throws(() => recommend.getRecommendations(databases.simple, math.ones(4, 7), 1), RangeError);
        });
        it('Creating an invalid co-occurrence matrix (three dimensional matrix)', function() {
            assert.throws(() => recommend.getRecommendations(databases.simple, math.matrix([[[1, 1, 0], [1, 1, 1]], [[1, 0, 1], [0, 0, 1]]]), 1), RangeError);
        });
        it('Passing an array instead of a mathjs matrix as a co occurrence matrix', function() {
            assert.throws(() => recommend.getRecommendations(databases.simple, [4, 7], 1), TypeError);
        });
        it('Passing a ratings array which is invalid', function() {
            assert.throws(() => recommend.getRecommendations([[1, 1, 1], [1, 0, 1], [1, 0]], coOccurrenceMatrix, 1), RangeError);
        });
    });

    describe('Test using the cFilter function which runs the whole process and generates recommendations for a user', function() {
        it('Run the process and generate recommendations for user 2', function() {
            recommendations = recommend.cFilter(databases.simple, 2);
            assert.deepEqual(recommendations, [2, 1]);
        });
    });
});


describe('D2 tests', function() {
    console.log('\n\n"Complex" rating database (D2):')
    console.log("\n        I0  I1  I2  I3  I4  I5  I6  I7  I8  I9 I10 I11 I12 I13 I14 I15 I16 I17 I18\n");
    console.log("   U0  [1   1   1   1   1   1   1   1   1   1   1   0   0   0   0   0   0   0   1]");
    console.log("   U1  [0   1   0   0   0   0   0   0   1   1   1   1   0   0   0   0   0   0   0]");
    console.log("   U2  [0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0]");
    console.log("   U3  [0   0   0   0   0   0   0   0   0   0   0   0   1   1   0   0   0   0   0]");
    console.log("   U4  [0   0   0   0   0   0   0   0   0   0   0   1   0   0   0   0   0   0   0]");
    console.log("   U5  [0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0]");
    console.log("   U6  [0   0   0   0   0   0   0   0   1   1   1   0   0   0   1   1   1   1   1]");
    console.log("   U7  [0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0]");
    console.log("   U8  [0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0]");
    console.log("   U9  [0   0   0   0   0   0   0   0   0   0   0   0   0   1   0   0   0   0   0]");

    describe('Getting recommendations from the more "complicated" database', function() {
        const coOccurrenceMatrix = recommend.coMatrix(databases.notSimple)
        describe('Recommendations for U6', function() {
            const recommendations = recommend.getRecommendations(databases.notSimple, coOccurrenceMatrix, 6);
            it('The highest ranked recommendation for U6 should be I1', function() {
                assert.equal(recommendations[0], 1);
            });
            it('The lowest ranked recommendation for U6 should be I11', function() {
                assert.equal(recommendations[recommendations.length - 1], 11);
            });
        })
        describe('Recommendations for U0', function() {
            const recommendations = recommend.getRecommendations(databases.notSimple, coOccurrenceMatrix, 0);
            it('The recommendations with rank 1-4 for U0 should be I14-I17 (in no specific order)', function() {
                assert.ok([14, 15, 16, 17].includes(recommendations[0]));
                assert.ok([14, 15, 16, 17].includes(recommendations[1]));
                assert.ok([14, 15, 16, 17].includes(recommendations[2]));
                assert.ok([14, 15, 16, 17].includes(recommendations[3]));
            });
            it('The recommendations with rank 5 for U0 should be I11', function() {
                assert.equal(recommendations[4], 11);
            });
            it('The number of recommendations for U0 should be 5', function() {
                assert.equal(recommendations.length, 5);
            });
        });
        describe('Recommendations for U9', function() {
            const recommendations = recommend.getRecommendations(databases.notSimple, coOccurrenceMatrix, 9);
            it('The only recommendation for U9 should be I12', function() {
                assert.equal(recommendations[0], 12);
                assert.equal(recommendations.length, 1);
            });
        });
        describe('Recommendations for U1', function() {
            const recommendations = recommend.getRecommendations(databases.notSimple, coOccurrenceMatrix, 1);
            it('The number of recommendations for U1 should be 12', function() {
                assert.equal(recommendations.length, 12);
            });
            it('The recommendations with rank 1 for U1 should be I18', function() {
                assert.equal(recommendations[0], 18);
            });
            it('The recommendations with rank 2-8 should be (I0, I2-I10) in no specific order', function() {
                assert.ok([0, 2, 3, 4, 5, 6, 7, 8, 9, 10].includes(recommendations[1]));
                assert.ok([0, 2, 3, 4, 5, 6, 7, 8, 9, 10].includes(recommendations[2]));
                assert.ok([0, 2, 3, 4, 5, 6, 7, 8, 9, 10].includes(recommendations[3]));
                assert.ok([0, 2, 3, 4, 5, 6, 7, 8, 9, 10].includes(recommendations[4]));
                assert.ok([0, 2, 3, 4, 5, 6, 7, 8, 9, 10].includes(recommendations[5]));
                assert.ok([0, 2, 3, 4, 5, 6, 7, 8, 9, 10].includes(recommendations[6]));
                assert.ok([0, 2, 3, 4, 5, 6, 7, 8, 9, 10].includes(recommendations[7]));
            });
            it('The recommendations with rank 9-12 should be (I14-I17) in no specific order', function() {
                assert.ok([14, 15, 16, 17].includes(recommendations[8]));
                assert.ok([14, 15, 16, 17].includes(recommendations[9]));
                assert.ok([14, 15, 16, 17].includes(recommendations[10]));
                assert.ok([14, 15, 16, 17].includes(recommendations[11]));

            });
            it('The number of recommendations for U1 should be 12', function() {
                assert.equal(recommendations.length, 12);
            });

        });
    });
});

