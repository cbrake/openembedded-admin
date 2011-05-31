
var dateutil = require('./dateutil');

exports.last_week = function() {
  // we go from Mon-Mon
  var day = 1000*60*60*24;
  var d = new Date();
  var today_weekday = d.getDay();
  var ret = {};
  ret['end'] = new Date(d.getTime() - (today_weekday-1)*day);
  ret['start'] = new Date(ret['end'].getTime() - 7*day);
  return ret;
}

exports.last_week_text = function() {
  // we go from Mon-Mon
  var lastwk = dateutil.last_week();
  var end_day = lastwk.end;
  var start_day = lastwk.start;
  return dateutil.isoformat(start_day) + ' to ' + dateutil.isoformat(end_day);
}

exports.isoformat = function(d) {
  var m = d.getMonth() + 1;
  return d.getFullYear() + '-' + (m < 10 ? '0' : '') +  m + '-' + d.getDate();
}



