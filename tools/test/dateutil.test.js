var dateutil = require('../dateutil'),
    util = require('util'),
    assert = require('assert')

exports.test_last_week = function() {
  var lastwk = dateutil.last_week()
  console.log(util.inspect(lastwk))

  assert(/Sun.*00:00:00/.exec(lastwk.start.toUTCString()), "lastwk start is not correct " + lastwk.start.toUTCString())

  assert(/Sun.*00:00:00/.exec(lastwk.end.toUTCString()), "lastwk end is not correct " + lastwk.start.toUTCString())

}

exports.test_last_week_text = function() {
  console.log(dateutil.last_week_text())
}

