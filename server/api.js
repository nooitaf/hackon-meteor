// Global API configuration
//https://github.com/kahmali/meteor-restivus#response-data
var md = require('markdown-it')();
// full options list (defaults)
var md = require('markdown-it')({
  html: true, // Enable HTML tags in source
  xhtmlOut: false, // Use '/' to close single tags (<br />).
  // This is only for full CommonMark compatibility.
  breaks: false, // Convert '\n' in paragraphs into <br>
  langPrefix: 'language-', // CSS language prefix for fenced blocks. Can be
  // useful for external highlighters.
  linkify: false, // Autoconvert URL-like text to links

  // Enable some language-neutral replacement + quotes beautification
  typographer: false,

  // Double + single quotes replacement pairs, when typographer enabled,
  // and smartquotes on. Could be either a String or an Array.
  //
  // For example, you can use '«»„“' for Russian, '„“‚‘' for German,
  // and ['«\xA0', '\xA0»', '‹\xA0', '\xA0›'] for French (including nbsp).
  quotes: '“”‘’',

  // Highlighter function. Should return escaped HTML,
  // or '' if the source string is not changed and should be escaped externaly.
  // If result starts with <pre... internal wrapper is skipped.
  // highlight: function (/*str, lang*/) { return ''; }
});

// NOJS
var Api_NoJS = new Restivus({
  useDefaultAuth: true,
  prettyJson: true,
  apiPath: 'noscript'
});
var HTMLHEAD = '<!doctype html><html><head><meta charset="utf-8"/><link rel="stylesheet" type="text/css" href="/noscript.css"><title>HackOn-noscript</title></head><body><div class="main">'
Api_NoJS.addRoute('/', {
  authRequired: false,
  defaultHeaders: ''
}, {
  get: function() {
    var out = ""
    out += HTMLHEAD
    out += md.render('---')
    out += md.render('/')
    out += md.render('---')
    out += md.render(Meta.findOne().text_home) || ""
    out += md.render('---')
    out += md.render('/faq')
    out += md.render('---')
    out += md.render(Meta.findOne().text_faq) || ""
    out += "</div></body></html>"
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/html'
      },
      body: out
    }
  }
});


// API
var Api = new Restivus({
  useDefaultAuth: true,
  prettyJson: true
});
Api.addRoute('fahrplan.txt', {
  authRequired: false,
  defaultHeaders: ''
}, {
  get: function() {
    var out = "<pre>";
    var out = "<pre>" + Meteor.call('createFahrplan')
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/html'
      },
      body: out
    }
  }
});

var DOC_WIDTH = 75
var DOC_LEVELSPACES = 3

var addLine = function(txt, level) {
  var out = ""
  var intendWidth = level * DOC_LEVELSPACES
  var colWidth = DOC_WIDTH - intendWidth
  var wrappedText = s.wrap(txt, {
    width: colWidth
  })
  var lines = s.lines(wrappedText)
  for (var i in lines) {
    var t = lines[i]
    t = s.rpad(t, colWidth, " ")
    out = out + s.lpad(t, DOC_WIDTH, " ") + "\n"
  }
  return out
}
var addHeader = function(txt, marginTop, marginBottom) {
  console.log(typeof marginTop)
  if (typeof marginTop != 'number') marginTop = 1
  if (typeof marginBottom != 'number') marginBottom = 2
  var mt = ""
  _.times(marginTop, function(){
    mt += "\n"
  })
  var mb = ""
  _.times(marginBottom, function(){
    mb += "\n"
  })
  return mt + s.lrpad(txt, DOC_WIDTH, " ") + mb + "\n"
}

var D = '20170714'
var DAY1 = {name:"Day 1",date:moment(D)}
var DAY2 = {name:"Day 2",date:moment(D).add(1,'day')}
var DAY3 = {name:"Day 3",date:moment(D).add(2,'days')}
var DAYS = [DAY1,DAY2,DAY3]

Meteor.methods({
  createFahrplan: function() {
    var out = "";
    out += addHeader(".O.", 0, 0)
    out += addHeader("..O", 0, 0)
    out += addHeader("OOO", 0, 0)
    for (const day of DAYS){
      out += addHeader(day.name)
      out += addHeader('...')
      Tracks.find({},{sort:{order:1}}).forEach(function(track){
        Submissions.find({
          $and: [
            { track: { $ne: [null, false, '0'] } },
            { track: track._id },
            // { date_start: { $gte: day.date } },
            // { date_start: { $lt: moment(day.date).add(1,'day') } },
          ]
        }, {
          sort: {
            date_start: 1,
            minutes: 1
          }
        }).forEach(function(sub) {
          out += addHeader(sub.date_start)
          out += addHeader(sub.title)
          out += addLine(sub.text, 1)
          out += addLine('---')
        })
      })
    }
    return out
  }
})

Api.addRoute('fahrplan.days.json', {
  authRequired: false,
  defaultHeaders: '',
  prettyJson: true
}, {
  get: function() {
    var out = {}
    for (const day of DAYS){
      out[day.name] = []
      Tracks.find({},{sort:{order:1}}).forEach(function(track){
        var p = out[day.name]
        p[track.name] = []
        Submissions.find({
          $and: [
            { track: { $ne: [null, false, '0'] } },
            { track: track._id },
            // { date_start: { $gte: day.date } },
            // { date_start: { $lt: moment(day.date).add(1,'day') } },
          ]
        },{
          sort: {
            date_start: 1,
            minutes: 1
          }
        },{
          fields: {
            _id: -1,
            // owner: -1,
            // date_created: -1,
            // date_edited: -1,
            // track: -1,
            // day1:-1,
            // day2:-1,
            // day3:-1
          }
        }).forEach(function(sub) {
          p[track.name].push(sub)
        })
        p.push(p[track.name])

      })
    }
    return out
  }
});
