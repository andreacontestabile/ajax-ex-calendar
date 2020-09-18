$(document).ready(function() {
  console.log(moment("1January2018").format("YYYY-MM-DD"));
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
        renderMonth();
      },
      "error": function (error) {
        alert("Error!");
      }
    }
  );

  function renderMonth() {
    var daysInMonth = momentDate.daysInMonth();
    for (var i = 1; i <= daysInMonth; i++) {
      var context = {
        "day": i,
        "month": momentDate.format("MMMM")
      };
      var html = template(context);
      $("ul.month-display").append(html);
    }
  }

});
