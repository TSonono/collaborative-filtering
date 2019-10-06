var recommendations = require('./cf_api.js')

const a = recommendations.filter([
    [1, 1, 1],
    [1, 0, 1],
    [1, 0 , 0]
])

console.log(a)