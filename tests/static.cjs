const fs=require('node:fs');
const assert=require('node:assert/strict');
const html=fs.readFileSync('index.html','utf8');
assert.match(html,/src="\.\/lifecycle.js"/,'lifecycle manager must be loaded');
assert.match(html,/id="status"/,'honest status required');
assert.match(fs.readFileSync('lifecycle.js','utf8'),/confirm\(/,'restart must require confirmation');
console.log('Static integration checks passed');
