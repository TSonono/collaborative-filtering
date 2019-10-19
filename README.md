# Collaborative filtering for Node.js

> This API is a lightweight implementation of collaborative filtering for Node.js. The only dependency is Math.js. Currently it supports generating recommendations with Jaccard similarity.

## Features

- Generate recommendations for a user based on user's with a similar taste.
- No popularity bias (normalization based on popularity).
- Currently only supports likes (no dislikes).
- Database agnostic. As long as you are running Node.js, you can use this API.

## Requirements

- Node.js

## Install

```
npm install collaborative-filter
```

## Usage

In your project, simply include the module.

```javascript
const rec = require('collaborative-filter')
```


## Example
To run the provided example.

```bash
node examples/demo.js
```

## Contributing

This API is far from done. It currently lacks support for dislikes and other rating scales. The plan is to improve it in the future! You can also submit a pull request if you want to contribute! We follow the Airbnb JavaScript Style Guide.

## License

Not decided...