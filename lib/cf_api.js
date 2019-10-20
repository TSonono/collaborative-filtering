const math = require('mathjs');

// Local functions
/**
 * Normalizes a co-occurrence matrix based on popularity.
 * TODO: Error check (size)
 * @param {array} coMatrix A co-occurrence matrix
 * @param {array} normalizerMatrix A matrix with division factors for the
 * coMatrix. Should be the same size as coMatrix
 * @returns {array} A normalized co-occurrence matrix
 */
function normalizeCoMatrix(coMatrix, normalizerMatrix) {
  return math.dotDivide(coMatrix, normalizerMatrix);
}

/**
 * Extract which items have a rating for a given user.
 * @param {array} ratings The ratings of all the users
 * @param {number} userIndex The index of the user you want to know which items
 * he or she has rated.
 * @param {number} numItems The number of items which have been rated.
 * @returns {array} An array of indices noting what games which have been rated.
 */
function getRatedItemsForUser(ratings, userIndex, numItems) {
  const ratedItems = [];
  for (let index = 0; index < numItems; index += 1) {
    if (ratings[userIndex][index] !== 0) {
      ratedItems.push(index);
    }
  }
  return ratedItems;
}

// Global API functions

/**
 * Generate recommendations for a user.
 * @param {array} ratings Same definition as in the collaborativeFilter function.
 * @param {array} coMatrix A co-occurrence matrix
 * @param {number} userIndex The index of the user you want to know which items
 * he or she has rated.
 * @returns {array} An array of item indices sorted in how much well recommended
 * the item is.
 */
function getRecommendations(ratings, coMatrix, userIndex) {
  if (!Array.isArray(ratings)) return false;
  const numItems = ratings[0].length;

  const ratedItemsForUser = getRatedItemsForUser(ratings, userIndex, numItems);
  const numRatedItems = ratedItemsForUser.length;
  const similarities = math.zeros(numRatedItems, numItems);
  for (let rated = 0; rated < numRatedItems; rated += 1) {
    for (let item = 0; item < numItems; item += 1) {
      similarities.set([rated, item], coMatrix.get([rated, item])
                                     + similarities.get([rated, item]));
    }
  }

  let recommendations = math.zeros(1, numItems);
  for (let y = 0; y < numRatedItems; y += 1) {
    for (let x = 0; x < numItems; x += 1) {
      recommendations.set([0, x], recommendations.get([0, x]) + similarities.get([y, x]));
    }
  }

  recommendations = math.dotDivide(recommendations, numRatedItems);
  const rec = recommendations.toArray()[0];
  const recSorted = recommendations.toArray()[0];
  recSorted.sort((a, b) => b - a);

  let recOrder = recSorted.map((element) => {
    const index = rec.indexOf(element);
    rec[index] = null; // To ensure no duplicate indices in the future iterations.

    return index;
  });

  recOrder = recOrder.filter((index) => !(index in ratedItemsForUser));

  return recOrder;
}

/**
 * Generates a co-occurrence matrix based on the input from the ratings param.
 * @param {array} ratings Same definition as in the collaborativeFilter function.
 * @returns {array} A two-dimensional co-occurrence matrix with size X x X (X
 * being the number of items that have received at least one rating. The
 * diagonal from left to right should consist of only zeroes.
 */
function createCoMatrix(ratings, nUsers, nItems) {
  const coMatrix = math.zeros(nItems, nItems);
  // const normalizerMatrix = math.zeros(nItems, nItems)
  const normalizerMatrix = math.identity(nItems);

  for (let y = 0; y < nUsers; y += 1) {
    // User
    for (let x = 0; x < (nItems - 1); x += 1) {
      // Items in the user
      for (let index = x + 1; index < nItems; index += 1) {
      // Co-occurrence
        if (ratings[y][x] === 1 && ratings[y][index] === 1) {
          coMatrix.set([x, index], coMatrix.get([x, index]) + 1);
          coMatrix.set([index, x], coMatrix.get([index, x]) + 1); // mirror
        }
        if (ratings[y][x] === 1 || ratings[y][index] === 1) {
          normalizerMatrix.set([x, index], normalizerMatrix.get([x, index]) + 1);
          normalizerMatrix.set([index, x], normalizerMatrix.get([index, x]) + 1);
        }
      }
    }
  }
  return normalizeCoMatrix(coMatrix, normalizerMatrix);
}

/**
 * This function starts the collaborative filtering process.
 * @param {array} ratings - A two-dimensional array of consisting of the user
 * ratings. The array should be of the following format:
 *           I0 I1 I2 . . .
 *          [
 *      U0  [1  1  1  .  .  .],
 *      U1  [1  0  1  .  .  .],
 *      U2  [1  0  0  .  .  .],
 *      .   [.  .  .  .  .  .],
 *      .   [.  .  .  .  .  .],
 *      .   [.  .  .  .  .  .],
 *          ]
 * where IX is an item and UY is a user. Therefor, the size of the matrix
 * be X x Y. The values in the matrix should be the rating for a given user.
 * If the user has not rated that item, the value should be 0. If the user
 * liked the item, it should be a 1. If disliked, a -1. Dislikes should be
 * implemented last.
 * @returns {array} A two-dimensional array for the normalized co occurrence
 * matrix
 */
function collaborativeFilter(ratings, userIndex) {
  if (!Array.isArray(ratings)) return false;
  const numUsers = ratings.length;
  const numItems = ratings[0].length;

  const coMatrix = createCoMatrix(ratings, numUsers, numItems);
  const recommendations = getRecommendations(ratings, coMatrix, userIndex);
  return recommendations;
}

// Export API functions
module.exports = {
  filter: collaborativeFilter,
  getRecommendations,
  coMatrix: createCoMatrix,
};
