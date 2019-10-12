//TODO: Decide where to normalize based on popularity
var math = require('mathjs')

// Global API functions

/**
 * This function starts the collaborative filtering process.
 * 
 * @param {array} ratings - A two-dimensional array of consisting of the user
 * ratings. The array should be of the following format:
 * 
 *          I1 I2 I3 . . .
 *          [
 *      U1  [1  1  1  .  .  .],
 *      U2  [1  0  1  .  .  .],
 *      U3  [1  0  0  .  .  .],
 *      .   [.  .  .  .  .  .],
 *      .   [.  .  .  .  .  .],
 *      .   [.  .  .  .  .  .],
 *          ]
 * 
 * where IX is an item and UY is a user. Therefor, the size of the matrix
 * be X x Y. The values in the matrix should be the rating for a given user.
 * If the user has not rated that item, the value should be 0. If the user 
 * liked the item, it should be a 1. If disliked, a -1. Dislikes should be 
 * implemented last.
 * @returns {array} A two-dimensional array for the normalized co occurrence 
 * matrix
 */
function collaborativeFilter(ratings) {
    if (!Array.isArray(ratings)) return false;
    numUsers = ratings.length
    numItems = ratings[0].length

    let coMatrix = createCoMatrix(ratings, numUsers, numItems)
    console.log(coMatrix)

    return coMatrix
}

/**
 * Generate recommendations for a user.
 * TODO: Finish implementation...
 *         //Algorithm: 
 *        Retrieve rated items for a given user.
 *        For each rated item:
 *            In the (normalized) co-occurrence matrix, sum each column to a new array
 *        Sort the array in descending order (keep track of the initial indices)
 * 
 * @param {array} ratings Same definition as in the collaborativeFilter function.
 * @param {array} coMatrix A co-occurrence matrix
 * @param {number} userIndex The index of the user you want to know which items
 * he or she has rated.
 * @param {number} numItems The number of items which have been rated.
 * @returns {array} An array 
 */
function getRecommendations(ratings, coMatrix, userIndex, numItems) {
    if (!Array.isArray(ratings)) return false;

    let ratedItemsForUser = getRatedItemsForUser(ratings, userIndex, numItems)
    for (let index = 0; index < ratedItemsForUser.length; index++) {
        const element = ratedItemsForUser[index];
        
    }
}

// Local functions

/**
 * Generates a co-occurrence matrix based on the input from the ratings param.
 * 
 * 
 * @param {array} ratings Same definition as in the collaborativeFilter function.
 * @returns {array} A two-dimensional co-occurrence matrix with size X x X (X
 * being the number of items that have received at least one rating. The
 * diagonal from left to right should consist of only zeroes.
 */
function createCoMatrix(ratings, nUsers, nItems) {
    
    const coMatrix = math.zeros(nItems, nItems)
    //const normalizerMatrix = math.zeros(nItems, nItems)
    const normalizerMatrix = math.identity(nItems)

    for (let index_y = 0; index_y < nUsers; index_y++) {
        // User
        for (let index_x = 0; index_x < (nItems - 1); index_x++) {
            // Items in the user
            for (let index = index_x + 1; index < nItems; index++) {
                // Co-occurrence
                if (ratings[index_y][index_x] === 1 && ratings[index_y][index] === 1) {
                    coMatrix.set([index_x, index], coMatrix.get([index_x, index]) + 1)
                    coMatrix.set([index, index_x], coMatrix.get([index, index_x]) + 1)  // mirror
                }
                if (ratings[index_y][index_x] === 1 || ratings[index_y][index] === 1) {
                    normalizerMatrix.set([index_x, index], normalizerMatrix.get([index_x, index]) + 1)
                    normalizerMatrix.set([index, index_x], normalizerMatrix.get([index, index_x]) + 1)  // mirror
                }
            }
        }
    }
    return normalizeCoMatrix(coMatrix, normalizerMatrix)
}

/**
 * Normalizes a co-occurrence matrix based on popularity.
 * TODO: Error check (size)
 * 
 * @param {array} coMatrix A co-occurrence matrix
 * @param {array} normalizerMatrix A matrix with division factors for the
 * coMatrix. Should be the same size as coMatrix
 * @returns {array} A normalized co-occurrence matrix
 */
function normalizeCoMatrix(coMatrix, normalizerMatrix) {
    return math.dotDivide(coMatrix, normalizerMatrix)
}

/**
 * Extract which items have a rating for a given user.
 * 
 * @param {array} ratings The ratings of all the users
 * @param {number} userIndex The index of the user you want to know which items
 * he or she has rated.
 * @param {number} numItems The number of items which have been rated.
 * @returns {array} An array of indices noting what games which have been rated.
 */
function getRatedItemsForUser(ratings, userIndex, numItems) {

    let ratedItems = []
    for (let index = 0; index < numItems; index++) {
        if (ratings[userIndex][index] !== 0) {
            ratedItems.push(index)
        }
    }
    return ratedItems
}

// Export API functions
module.exports = {
    cfFilter: collaborativeFilter,
    getRecommendations: getRecommendations
};