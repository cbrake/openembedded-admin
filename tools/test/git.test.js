var git = require('../git'),
  assert = require('assert'),
  path = require('path'),
  child_process = require('child_process'),
  dateutil = require('../dateutil');

exports.test_parse_gitmodules = function() {
  var expected = {
    "openembedded":"git://git.openembedded.org/openembedded",
    "openembedded-core":"git://git.openembedded.org/openembedded-core"
  }
  git.parse_gitmodules(path.join(__dirname, 'fixture/.gitmodules'), function(err, data) {
    assert.equal(null, err);
    assert.eql(expected, data);
  });
}

exports.test_changelog = function() {
  var repo_dir = path.join(__dirname, 'fixture/openembedded-admin');
  var expected = "Cliff Brake (2):\n  initial commit of admin repos and tools\n  add .gitignore\n\n"
  child_process.exec('git clone git://git.openembedded.org/openembedded-admin ' + repo_dir, function(error, stdout, stderr) {
    var start = new Date('2011-05-19');
    var end = new Date('2011-05-20');
    git.changelog(repo_dir, start, end, function(err, changelog) {
      assert.equal(err, null);
      assert.equal(changelog, expected);
      child_process.exec('rm -rf ' + repo_dir);
    });
  });
}


