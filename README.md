[![Build Status](https://travis-ci.com/TSonono/collaborative-filtering.svg?branch=master)](https://travis-ci.com/TSonono/collaborative-filtering)
[![Coverage](https://codecov.io/gh/TSonono/collaborative-filtering/branch/master/graph/badge.svg)](https://codecov.io/gh/TSonono/collaborative-filtering)
[![Dependencies](https://david-dm.org/TSonono/collaborative-filtering.svg)](https://david-dm.org/TSonono/collaborative-filtering)
[![npm version](https://badge.fury.io/js/collaborative-filter.svg)](https://www.npmjs.com/package/collaborative-filter)
[![Downloads](https://img.shields.io/npm/dt/collaborative-filter)](https://npm-stat.com/charts.html?package=collaborative-filter&from=2019-08-01)

# Collaborative filtering for Node.js

> This API is a lightweight implementation of collaborative filtering for Node.js. The only dependency is [Math.js](https://www.npmjs.com/package/mathjs). Currently it supports generating recommendations with Jaccard similarity.

## Features

- Generate recommendations for a user based on users with a similar taste.
- No popularity bias (normalization based on popularity).
- Currently only supports likes (no dislikes).
- Database agnostic. As long as you are running Node.js, you can use this API.

## Requirements

- [Node.js](https://nodejs.org/en/)

## Install

```
npm i collaborative-filter
```

## Usage

In your project, simply include the module.

```javascript
const recommend = require('collaborative-filter')
```


## Example
To run the provided example.

```bash
node examples/demo.js
```

### How-to
The input for the engine is an array matrix which defines the ratings of the users in the database. It should be a matrix containing of 0:s (not rated) and 1:s (liked the item) and follow this format.

```
     I0 I1 I2 . . .
    [
U0  [1  1  1  .  .  .],
U1  [1  0  1  .  .  .],
U2  [1  0  0  .  .  .],
.   [.  .  .  .  .  .],
.   [.  .  .  .  .  .],
.   [.  .  .  .  .  .],
    ]
 ```
 In javascript, this could look something like this
 ```javascript
 const ratings = [
  [1, 1, 1],
  [1, 0, 1],
  [1, 0, 0],
];
 ```
 If you want to run the whole collaborative filter, you would do this:
 ```javascript
 const recommend = require('../lib/cf_api.js');

 const result = recommend.cFilter(ratings, 2);
 ```
where 2 is the user index. The output of this with ratings matrix as above, would be an array `[2, 1]`. This tells us that item 2 is the most appropriate recommendation followed by item 1.

You could also run the filtering process by calling the global API functions individually.

```javascript
const recommend = require('collaborative-filter');

const coMatrix = recommend.createCoMatrix(ratings, numUsers, numItems);
const result = recommend.getRecommendations(ratings, coMatrix, userIndex);
```
which results in the same array as before. This could be useful when you do not need to generate the co-occurrence matrix multiple times. For instance, if you want recommendations for multiple users, you do not need to generate the co-occurrence matrix multiple times, saving you processing time.

## Cold Start Problem

The [Cold start problem](https://en.wikipedia.org/wiki/Cold_start_(computing)) is something that can make or break a recommendation application. If you don't have enough data, it's hard to draw any conclusions, especially if the number of items is large.

In the file `cf_api.js` in the `lib` directory, there is a flag `ONLY_RECOMMEND_FROM_SIMILAR_TASTE`. If you put this to 0, you will get recommendations from users which don't necessarily have similar taste as you (these will however be lower ranked than recommendations from people with similar taste). This option is available if you consider a cold start something that will make your service seem poor. With this flag enabled, you will never receive a recommendation from someone who has no similarity with you.

You can also disable the `NORMALIZE_ON_POPULARITY` flag, which in turn ensures that the co-occurrence matrix is not normalized.

## Contributing

Submit a pull request if you want to contribute. We follow the Airbnb JavaScript Style Guide.

# Todo
- Rating scale options and implementations
- Performance benchmarks
- Convert to typescript?

## License

MIT
