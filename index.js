#!/usr/bin/env node
// https://asciinema.org/api/asciicasts/ejzz2ou99x7svorkwq1xh1zun
var github = require("github-request");
var colors = require('colors');

let arg = process.argv.slice(2);

var username = arg[0];
var target = arg[1];

if (!username) {
  console.log("Write github username..".white.bold);
  process.exit(1);
} else if (!target) {
  console.log("Write target like as ".white.bold, "repos".red.bold, "starred".red.bold);
  process.exit(1);
} else {
  start(username, target);
}

let map = new Map();
let lang = [];

function req(user, type ,page) {
  return new Promise((resolve, reject) => {
    github.request({
        path: `/users/${user}/${type}?page=${page}&per_page=100`
    }, function(err, repos) {
        if (err) {
          reject(err)
        } else {
          resolve(repos)
        }
    });
  });
}


async function start(username, type) {
  for (var i = 1; i <= 20; i++) {
    var user = await req(username, type, i)
    if (user.length === 0) {
      console.log('Api ended..'.underline.red);
      break;
    } else {
      console.log(`Page:${i}`.green,`User: ${username}`.bold);
    }

    for (let repo of user) {
      if (map.has(repo.language)) {
        let count = map.get(repo.language)
        count++
        map.set(repo.language, count);
      } else {
        map.set(repo.language, 1);
      }
    }
  }

  console.log(map);
};
