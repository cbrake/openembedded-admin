var fs = require('fs'),
    child_process = require('child_process'),
    dateutil = require('./dateutil');

exports.parse_gitmodules = function(filepath, callback) {
  fs.readFile(filepath, 'utf8', function(err, data) {
    if (err) {
      throw err;
      callback(err, null);
    } else {
      var state = 'looking';
      lines = data.split('\n');
      var path = null;
      var url = null;
      var submodules = {}
      for (var i=0; i < lines.length; i++) {
        if (/submodule/(lines[i])) {
          path = null;
          url = null;
        }
        var re_path = /path = (\S.*)/(lines[i]);
        if (re_path)
          path = re_path[1];
        var re_url = /url = (\S.*)/(lines[i]);
        if (re_url) {
          url = re_url[1];
        }
        if (path && url) {
          submodules[path] = url
          path = null;
          url = null;
        }
      }
      callback(null, submodules);
    }
  });
}

exports.changelog = function(repo_dir, startdate, enddate, callback) {
  var start_iso = dateutil.isoformat(startdate);
  var end_iso = dateutil.isoformat(enddate);
  child_process.exec('cd ' + repo_dir + "; git shortlog --since=" + start_iso + " --until=" + end_iso + 
     " origin/master | grep -v 'Merge branch' | grep -v 'Merge commit'|sed -e 's/^    //g'|cut -b -78", function(error, stdout, stderr) {
    if (stderr)
        console.log('changelog stderr: ' + stderr);
    callback(error, stdout);
  });
}

