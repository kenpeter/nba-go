#!/usr/bin/env node

// Set node env with dev
if (process.env.NODE_ENV === 'development') {
  // Can use es6 on the fly
  require('babel-register');
  require('../src/cli');
} else {
  require('../lib/cli');
}
