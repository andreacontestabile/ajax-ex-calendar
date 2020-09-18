$(document).ready(function() {
  var startYear = 2018;
  var startMonth = 0;

  var momentDate = moment("2018-01-01");

  var source = $("#day-template").html();
  var template = Handlebars.compile(source);

  $.ajax(
    {
      "url": "https://flynn.boolean.careers/exercises/api/holidays",
      "data": {
        "year": startYear,
        "month": startMonth
      },
      "method": "GET",
      "success": function(data, status) {
        renderMonth(data);
      },
      "error": function (error) {
        alert("Error!");
      }
    }
  );

  function renderMonth(data) {
    var daysInMonth = momentDate.daysInMonth();
    for (var i = 1; i <= daysInMonth; i++) {
      var context = {
        "day": i,
        "month": momentDate.format("MMMM")
      };
      var html = $(template(context));
      var currentMomentDate = moment(context.day + context.month + startYear);
      var currentMomentDateFormat = currentMomentDate.format("YYYY-MM-DD");
      if (data.response.length > 0) {
        for (var j = 0; j < data.response.length; j++) {
          if (data.response[j].date == currentMomentDateFormat ) {
            $(html).addClass("holiday");
            console.log($(html));
          }
        }
      }
      $("ul.month-display").append(html);
    }
  }

});
