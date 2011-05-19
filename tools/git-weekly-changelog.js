// script to collect the weekly changelog in a git repo

var path = require('path'),
    child_process = require('child_process'),
    fs = require('fs'),
    nodemailer = require('nodemailer');


String.prototype.format = function() {
    var formatted = this;
    for (var i = 0; i < arguments.length; i++) {
        var regexp = new RegExp('\\{'+i+'\\}', 'gi');
        formatted = formatted.replace(regexp, arguments[i]);
    }
    return formatted;
};

var projects = ['meta-angstrom', 'meta-openembedded', 'meta-smartphone', 'meta-texasinstruments', 'openembedded-core', 'openembedded'];

var date_range = function() {
  var day = 1000*60*60*24;
  var d = new Date();
  var today_weekday = d.getDay();
  var end_day = new Date(d.getTime() - today_weekday*day);
  var start_day = new Date(end_day.getTime() - 7*day);
  return "{0}-{1}-{2} to {3}-{4}-{5}".format(start_day.getFullYear(), start_day.getMonth(), start_day.getDate(),
    end_day.getFullYear(), end_day.getMonth(), end_day.getDate());
}

var format_report = function(weekly_data) {
    var ret = ''
    for (var i=0; i < projects.length; i++) {
      //console.log(project);
      ret += "====================================================\n";
      ret += "Changelog for " + projects[i] + ":\n\n";
      ret += weekly_data[projects[i]];
    }
    return ret;
}

var email_report = function(report) {
  nodemailer.send_mail(
    {
      sender: "cliff.brake@gmail.com",
      to: "openembedded-core@lists.openembedded.org, openembedded-devel@lists.openembedded.org, angstrom-distro-devel@linuxtogo.org",
      bcc: "cbrake@bec-systems.com",
      subject: "OE Changelog for " + date_range(),
      body: report
    },
    function(error, success) {
      console.log("Message " + (success?"sent":"failed"));
    }
  );
}

var output = {};

for (var i=0; i < projects.length; i++) {
  var count = projects.length;
  // FIXME: might be a better way to create closure for i than creating run_exec
  var run_exec = function(i) {
    console.log('processing: ' + path.join(__dirname, '../', projects[i]));
    process.chdir(path.join(__dirname, '../', projects[i]));
    child_process.exec('../tools/weekly-changelog-report.py', function(error, stdout, stderr) {
      console.log('stderr: ' + stderr);
      if (error !== null) {
        console.log('exec error: ' + error);
      } else {
        output[projects[i]] = stdout;
      }
      count--;
      if (count === 0) {
        var r = format_report(output);
        process.chdir(path.join(__dirname, '../'));
        var f = fs.openSync('weekly-changelog', 'w');
        fs.writeSync(f, r);
        fs.closeSync(f);
        email_report(r);
      }
    });
  }(i);
}

