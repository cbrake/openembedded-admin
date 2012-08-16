
var dateutil = require('./dateutil');

exports.last_week = function() {
  // we go from Sun-Sun
  var day = 1000*60*60*24;
  var d = new Date()
  d.setUTCHours(0)
  d.setUTCMinutes(0)
  d.setUTCSeconds(0)
  var today_weekday = d.getDay();
  var ret = {};
  ret['end'] = new Date(d.getTime() - (today_weekday + 1)*day);
  ret['start'] = new Date(ret['end'].getTime() - 7*day);
  return ret;
}

exports.last_week_text = function() {
  // we go from Mon-Mon
  var lastwk = dateutil.last_week();
  var end_day = lastwk.end;
  var start_day = lastwk.start;
  return 'since ' + dateutil.isoDate(start_day) + ' until ' + dateutil.isoDate(end_day);
}

exports.isoDate = function(d) {
//  var m = d.getMonth() + 1;
//  return d.getFullYear() + '-' + (m < 10 ? '0' : '') +  m + '-' + d.getDate();
  var e = /(.*)T/.exec(d.toISOString())
  return e[1]
}



