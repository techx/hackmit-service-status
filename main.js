$(document).ready(function () {
  var OSCAR_QUERY_URL = 'http://107.170.32.26:8123/status';
  var table = $('#table').DataTable({
    ajax: {
      url: OSCAR_QUERY_URL,
      dataSrc: function(data) {
        for (var i = 0; i < data.length; i++) {
          data[i].date = relative_time(data[i].date);
        }
        return data;
      },
    },
    columns: [
      { data: 'name', title: "Name" },
      { data: 'status', title: "Status" },
      { data: 'date', title: "Time" },
      { data: 'summary', title: "Summary" },
      { data: 'description', title: "Description" },
    ],
    // sorting by ascending on column 1 results in failures, notes, successes
    order: [[1, 'asc'], [0, 'asc']],
    fnRowCallback: function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
      if (aData.status === 'failure') {
        $('td', nRow).css('background-color', '#fbf7db');
      } else if (aData.status === 'note') {
        $('td', nRow).css('background-color', '#d0e8f6');
      }
    },
    paging: false,
    bInfo: false,
    sDom: '<"top"i>rt<"bottom"flp><"clear">',
    responsive: true,
  });
  setInterval(function() {
    table.ajax.reload(null, false); // user paging is not reset on reload
  }, 30000);

  function relative_time(date_str) {
    if (!date_str) {return;}
    date_str = $.trim(date_str);
    date_str = date_str.replace(/\.\d\d\d+/,""); // remove the milliseconds
    date_str = date_str.replace(/-/,"/").replace(/-/,"/"); //substitute - with /
    date_str = date_str.replace(/T/," ").replace(/Z/," UTC"); //remove T and substitute Z with UTC
    date_str = date_str.replace(/([\+\-]\d\d)\:?(\d\d)/," $1$2"); // +08:00 -> +0800
    var parsed_date = new Date(date_str);
    var relative_to = (arguments.length > 1) ? arguments[1] : new Date(); //defines relative to what ..default is now
    var delta = parseInt((relative_to.getTime()-parsed_date)/1000);
    delta=(delta<2)?2:delta;
    var r = '';
    if (delta < 60) {
      r = delta + ' seconds ago';
    } else if(delta < 120) {
      r = 'a minute ago';
    } else if(delta < (45*60)) {
      r = (parseInt(delta / 60, 10)).toString() + ' minutes ago';
    } else if(delta < (2*60*60)) {
      r = 'an hour ago';
    } else if(delta < (24*60*60)) {
      r = '' + (parseInt(delta / 3600, 10)).toString() + ' hours ago';
    } else if(delta < (48*60*60)) {
      r = 'a day ago';
    } else {
      r = (parseInt(delta / 86400, 10)).toString() + ' days ago';
    }
    return 'about ' + r;
  }
});
