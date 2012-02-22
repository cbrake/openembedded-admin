// script to collect the weekly changelog in a git repo

var testing = false;
var email_to = '';
var email_bcc = 'cbrake@bec-systems.com,';

if (!testing) {
  //email_bcc += 'beagleboard@googlegroups.com';
  email_to += 'openembedded-core@lists.openembedded.org, openembedded-devel@lists.openembedded.org, angstrom-distro-devel@linuxtogo.org, meta-ti@yoctoproject.org';
}

var path = require('path'),
    child_process = require('child_process'),
    fs = require('fs'),
    nodemailer = require('nodemailer'),
    git = require('./git'),
    dateutil = require('./dateutil');

String.prototype.format = function() {
    var formatted = this;
    for (var i = 0; i < arguments.length; i++) {
        var regexp = new RegExp('\\{'+i+'\\}', 'gi');
        formatted = formatted.replace(regexp, arguments[i]);
    }
    return formatted;
};

var format_report = function(projects, weekly_data) {
    var ret = ''
    // report header
    ret += "Changelog for " + dateutil.last_week_text() + ".  Projects included in this report:\n\n";
    var project;
    for (project in projects) {
      ret += project + ": " + projects[project] + "\n";
    }

    ret += "\n";

    for (project in projects) {
      ret += "====================================================\n";
      ret += "Changelog for " + project + ":\n\n";
      ret += weekly_data[project];
    }
    return ret;
}

var email_report = function(report) {
  nodemailer.send_mail(
    {
      sender: "cliff.brake@gmail.com",
      to: email_to,
      bcc: email_bcc,
      subject: "OE Changelog for " + dateutil.last_week_text(),
      body: report
    },
    function(error, success) {
      console.log("Message " + (success?"sent":"failed"));
    }
  );
}

var run_changelog = function(projects) {
  var output = {};
  var count = Object.keys(projects).length;
  var lastwk = dateutil.last_week();
  var project;
  for (project in projects) {
    // function required to preserve the value of project
    (function(project) {
      console.log('processing: ' + path.join(__dirname, '../', project));
      var repo_dir = path.join(__dirname, '../', project);
      child_process.exec('cd ' + repo_dir + '; git fetch', function(error, stdout, stderr) {
        git.changelog(repo_dir, lastwk.start, lastwk.end, function(err, changelog) {
          if (err !== null) {
            console.log('changelog error: ' + err);
          } else {
            output[project] = changelog;
          }
          count--;
          if (count === 0) {
            var r = format_report(projects, output);
            process.chdir(path.join(__dirname, '../'));
            var f = fs.openSync('weekly-changelog', 'w');
            fs.writeSync(f, r);
            fs.closeSync(f);
            email_report(r);
          }
        });
      });
    })(project);
  }
}

git.parse_gitmodules(path.join(__dirname, "../.gitmodules"), function(err, data) {
  if (err) {
    console.log("Error parsing .gitmodules");
  } else {
    run_changelog(data);
  }
});


