#!/usr/bin/env node
// https://asciinema.org/api/asciicasts/ejzz2ou99x7svorkwq1xh1zun
const colors = require('colors');
const github = require('github-request');
const util = require('util')

const args = process.argv.slice(2);
const username = args[0];
const target = args[1];

if (!username) {
  console.log("Write github username..".white.bold);
  process.exit(1);
} else if (!target) {
  console.log("Write target like as ".white.bold, "repos".red.bold, "starred".red.bold);
  process.exit(1);
} else {
  start().then(console.log)
}

function genSettings(path ) {
  let settings = { path }

  if (process.env.GHTOK)
    settings.headers = { 'Authorization': `token ${process.env.GHTOK}` }

  return settings
}

async function start() {
  const asyncRequest = util.promisify(github.request);

  // request pages async
  const reqs = []
  for (let i = 0; i < 20; i++) {
    const settings = genSettings(`/users/${username}/${target}?page=${i + 1}&per_page=100`);
    reqs.push(asyncRequest(settings));
  }

  // get results
  const repos = []
  for (let i = 0; i < reqs.length; i++) {
    console.log(`Page:${i + 1}`.green,`User: ${username}`.bold);
    const page = await reqs[i];
    if (!page || page.length === 0)
      break;
    repos.push(...page)
  }
  console.log('Api ended..'.underline.red)

  let map = new Map()
  for (let repo of repos) {
    if (map.has(repo.language)) {
      let count = map.get(repo.language)
      count++
      map.set(repo.language, count);
    } else if (repo.language) {
      map.set(repo.language, 1);
    }
  }

  const sortedMap = new Map([...map.entries()].sort((a, b) => b[1] - a[1]))
  return sortedMap
};
