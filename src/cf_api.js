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
 * @returns {array} A one-dimensional array of recommendations in descending order
 */
function collaborative_filter(ratings) {
    if (!Array.isArray(ratings)) return false;
    numUsers = ratings.length
    numItems = ratings[0].length

    var co_occurrence_matrix = create_co_occurrence_matrix(ratings, numUsers, numItems)


    return true
}


// Local functions

/**
 * Generates a co-occurrence matrix based on the input from the ratings param.
 * 
 * TODO: Consider removal of mathJS if we can generate zeroes without it
 * 
 * @param {array} ratings Same definition as in the collaborative_filter function.
 * @returns {array} A two-dimensional co-occurrence matrix with size X x X (X
 * being the number of items that have received at least one rating. The
 * diagonal from left to right should consist of only zeroes.
 */
function create_co_occurrence_matrix(ratings, nUsers, nItems) {
    
    const matrix = math.zeros(nItems, nItems)
    for (let index_y = 0; index_y < nUsers; index_y++) {
        // User
        for (let index_x = 0; index_x < (nItems - 1); index_x++) {
            // Items in the user
            for (let index = index_x + 1; index < nItems; index++) {
                // Co-occurrence
                if (ratings[index_y][index_x] === 1 && ratings[index_y][index] === 1) {
                    matrix.set([index_x, index], matrix.get([index_x, index]) + 1)
                    matrix.set([index, index_x], matrix.get([index, index_x]) + 1)
                }
            }
        }
    }
    return matrix.toArray()
}

// Export API functions
module.exports = {
    filter: collaborative_filter
};