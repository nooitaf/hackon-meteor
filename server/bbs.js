var blessed = require('blessed');
var telnet = require('telnet2');

telnet({
  tty: true
}, Meteor.bindEnvironment(function(client) {
  // console.log(err)
  client.on('term', function(terminal) {
    screen.terminal = terminal;
    screen.render();
  });

  client.on('size', function(width, height) {
    client.columns = width;
    client.rows = height;
    client.emit('resize');
    console.log('resize')
  });

  var screen = blessed.screen({
    smartCSR: true,
    input: client,
    output: client,
    terminal: 'xterm-256color',
    fullUnicode: true
  });

  client.on('close', function() {
    if (!screen.destroyed) {
      screen.destroy();
    }
  });

  var mainView = blessed.box({
    parent: screen,
    mouse: true,
    top: 'center',
    left: 'center',
    width: '100%-2',
    height: '100%-2',
    content: '{bold}HackOn BBS{/bold} ~ {bold}H{/bold}ome {bold}F{/bold}aq Day{bold}1{/bold} Day{bold}2{/bold} Day{bold}3{/bold}',
    tags: true,
    fg: '#00cc00'
  });


  mainView.key(['H','h'], function(ch, key) {
    day1View.hidden = true;
    day2View.hidden = true;
    day3View.hidden = true;
    homeView.hidden = false;
    faqView.hidden = true;
    screen.render()
    homeView.focus()
  })
  mainView.key(['F','f'], function(ch, key) {
    day1View.hidden = true;
    day2View.hidden = true;
    day3View.hidden = true;
    homeView.hidden = true;
    faqView.hidden = false;
    screen.render()
  })

  mainView.key('1', function(ch, key) {
    day1View.hidden = false;
    day2View.hidden = true;
    day3View.hidden = true;
    homeView.hidden = true;
    faqView.hidden = true;
    screen.render()
  })
  mainView.key('2', function(ch, key) {
    day1View.hidden = true;
    day2View.hidden = false;
    day3View.hidden = true;
    homeView.hidden = true;
    faqView.hidden = true;
    screen.render()
  })
  mainView.key('3', function(ch, key) {
    day1View.hidden = true;
    day2View.hidden = true;
    day3View.hidden = false;
    homeView.hidden = true;
    faqView.hidden = true;
    screen.render()
  })

  var contentView = blessed.box({
    parent: mainView,
    mouse: true,
    // hidden: true,
    top: 4,
    scrollable: true,
    left: 'center',
    width: '100%',
    height: '100%-4',
    content:  '',
    tags: true,
    fg: '#00cc00',
  });
  var homeView = blessed.box({
    parent: contentView,
    hidden: false,
    scrollable: true,
    top: 0,
    left: 0,
    width: '100%',
    height: '200%',
    content:  Meta.findOne().text_home,
    tags: true,
    fg: '#99cc00',
    keys: true,
    alwaysScroll: true

  });
  var faqView = blessed.box({
    parent: contentView,
    mouse: true,
    hidden: true,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    content: Meta.findOne().text_faq,
    tags: true,
    fg: '#99cc00',
  });
  var day1View = blessed.box({
    parent: contentView,
    mouse: true,
    hidden: true,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    content: 'day1View',
    tags: true,
    fg: '#99cc00',
  });
  var day2View = blessed.box({
    parent: contentView,
    mouse: true,
    hidden: true,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    content: 'day2View',
    tags: true,
    fg: '#99cc00',
  });
  var day3View = blessed.box({
    parent: contentView,
    mouse: true,
    hidden: true,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    content: 'day3View',
    tags: true,
    fg: '#99cc00',
  });




  mainView.key('up', function(ch, key) {
    // mainView.up(1)
    screen.render()
  })
  mainView.key('down', function(ch, key) {
    // mainView.down(1)
    screen.render()
  })
  // box.addItem("bla_"+Math.random())
  // box.addItem("bla_"+Math.random())
  // box.addItem("bla_"+Math.random())
  // box.addItem("bla_"+Math.random())
  // box.addItem("bla_"+Math.random())
  // box.addItem("bla_"+Math.random())


  var progress = blessed.progressbar({
    orientation: 'vertical',
    filled: 0,
    value: 0,
    width: '100%',
    style: {
      bar: {
        bg: '#222222'
      }
    },
    parent: screen
  })
  var progressInterval = setInterval(function() {
    progress.setProgress(progress.value + 2)
    screen.render()
  }, 10)

  progress.on('complete', function() {
    clearInterval(progressInterval)
    screen.remove(progress)
  })


  mainView.focus();

  var trackTableBox = blessed.box({
    parent: mainView,
    hidden: true,
    top: 6,
    width: '100%-2',
    height: '100%-8'
  })
  // box.append(trackTableBox)

  var Tracks = [
    {trackname:"track1",type:"lecture",title:"blabla",text:"soso so so so sosooo sos o soos os os os os osssoso so so so sosooo sos o soos os os os os osssoso so so so sosooo sos o soos os os os os oss\nsoso so so so sosooo sos o soos os os os os osssoso so so so sosooo sos o soos os os os os osssoso so so so sosooo sos o soos os os os os osssoso so so so sosooo sos o soos os os os os osssoso so so so sosooo sos o soos os os os os osssoso so so so sosooo sos o soos os os os os osssoso so so so sosooo sos o soos os os os os osssoso so so so sosooo sos o soos os os os os oss\n\nsoso so so so sosooo sos o soos os os os os osssoso so so so sosooo sos o soos os os os os oss"},
    {trackname:"track2",type:"lecture",title:"blabla",text:"soso so so so sosooo sos o soos os os os os osssoso so so so sosooo sos o soos os os os os osssoso so so so sosooo sos o soos os os os os oss\nsoso so so so sosooo sos o soos os os os os osssoso so so so sosooo sos o soos os os os os osssoso so so so sosooo sos o soos os os os os osssoso so so so sosooo sos o soos os os os os osssoso so so so sosooo sos o soos os os os os osssoso so so so sosooo sos o soos os os os os osssoso so so so sosooo sos o soos os os os os osssoso so so so sosooo sos o soos os os os os oss\nsoso so so so sosooo sos o soos os os os os osssoso so so so sosooo sos o soos os os os os oss"},
    {trackname:"track3",type:"lecture",title:"blabla",text:"soso so so so sosooo sos o soos os os os os osssoso so so so sosooo sos o soos os os os os osssoso so so so sosooo sos o soos os os os os oss\nsoso so so so sosooo sos o soos os os os os osssoso so so so sosooo sos o soos os os os os osssoso so so so sosooo sos o soos os os os os osssoso so so so sosooo sos o soos os os os os osssoso so so so sosooo sos o soos os os os os osssoso so so so sosooo sos o soos os os os os osssoso so so so sosooo sos o soos os os os os osssoso so so so sosooo sos o soos os os os os oss\nsoso so so so sosooo sos o soos os os os os osssoso so so so sosooo sos o soos os os os os oss"},
    {trackname:"track4",type:"lecture",title:"blabla",text:"soso so so so sosooo sos o soos os os os os osssoso so so so sosooo sos o soos os os os os osssoso so so so sosooo sos o soos os os os os oss\nsoso so so so sosooo sos o soos os os os os osssoso so so so sosooo sos o soos os os os os osssoso so so so sosooo sos o soos os os os os osssoso so so so sosooo sos o soos os os os os osssoso so so so sosooo sos o soos os os os os osssoso so so so sosooo sos o soos os os os os osssoso so so so sosooo sos o soos os os os os osssoso so so so sosooo sos o soos os os os os oss\nsoso so so so sosooo sos o soos os os os os osssoso so so so sosooo sos o soos os os os os oss"},
    {trackname:"track5",type:"lecture",title:"blabla",text:"soso so so so sosooo sos o soos os os os os osssoso so so so sosooo sos o soos os os os os osssoso so so so sosooo sos o soos os os os os oss\nsoso so so so sosooo sos o soos os os os os osssoso so so so sosooo sos o soos os os os os osssoso so so so sosooo sos o soos os os os os osssoso so so so sosooo sos o soos os os os os osssoso so so so sosooo sos o soos os os os os osssoso so so so sosooo sos o soos os os os os osssoso so so so sosooo sos o soos os os os os osssoso so so so sosooo sos o soos os os os os oss\nsoso so so so sosooo sos o soos os os os os osssoso so so so sosooo sos o soos os os os os oss"}
  ]

  for (var i in Tracks){
    var options = {
      parent: trackTableBox,
      left: ''+(i*20)+'%',
      height: '100%',
      width: '20%',
      tags: true,
      border: {
        type: 'bg'
      },
      content: "\n{bold}" + Tracks[i].trackname + "{/bold}\n{red-fg}"+Tracks[i].title + "{/red-fg}\n{bold}" + Tracks[i].type + "{/bold}\n" + Tracks[i].text
    }
    var col = blessed.box(options)
    trackTableBox.append(col)
  }
  // box.append(tracktable2)
  //
  // var trackContent = blessed.list({
  //   parent: tracktable,
  //   tags: true,
  //   items: ["Strated: 0022", "{bold}Ttitle here{/bold}"]
  // })

  // screen.on('mouse',function(x,y){
  //   box.setContent(JSON.stringify(y,2,false))
  //   console.log(x,y)
  //   screen.render()
  // })
  // screen.on('keypress',function(x,y){
  //   box.setContent("key: " + x + " " + y + " " + Math.random())
  //   console.log(x,y)
  //   screen.render()
  // })
  screen.key(['r'], function(ch, key) {
    mainView.setContent("bla " + Math.random())
    screen.render(true)
  });

  screen.key(['C-c', 'q'], function(ch, key) {
    screen.destroy();
  });

  screen.on('destroy', function() {
    if (client.writable) {
      client.destroy();
    }
  });


  // setInterval(function(){
  //   screen.render()
  // },1000)
})).listen(2300);
