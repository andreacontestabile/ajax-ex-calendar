$(document).ready(function() {
  // Definisco due variabili relative all'anno e al mese da cui iniziare il rendering
  var startYear = 2018;
  var startMonth = 0;

  // Inizializzo il template Handlebars
  var source = $("#day-template").html();
  var template = Handlebars.compile(source);

  // Al caricamento della pagina, faccio il render del mese e delle festività
  renderPage();

  // Definisco l'evento click sul pulsante PREV
  $("#prev").click(function() {
    // che funziona solo se startMonth è maggiore di 0
    if (startMonth > 0) {
      // Seleziono il mese precedente
      startMonth -= 1;
      // Svuoto la pagina
      $(".month-display").empty();
      // Effettuo nuovamente il render
      renderPage();
    } else {
      // Definisco un alert nel caso l'utente prema il pulsante PREV su Gennaio 2018
      alert("Nessun dato precedente a questa data!");
    }
  });

  // Definisco l'evento click sul pulsante NEXT
  $("#next").click(function() {
    // che funziona solo se startMonth è minore di 11
    if (startMonth < 11) {
      // Seleziono il mese successivo
      startMonth += 1;
      // Svuoto la pagina
      $(".month-display").empty();
      // Effettuo nuovamente il render
      renderPage();
    } else {
      // Definisco un alert nel caso l'utente prema il pulsante NEXT su Dicembre 2018
      alert("Nessun dato successivo a questa data!");
    }
  });

  function renderPage() {
    // Effettuo la chiamata Ajax verso l'api contenente le festività dell'anno 2018
    $.ajax(
      {
        "url": "https://flynn.boolean.careers/exercises/api/holidays",
        // Come "data", passo l'anno e il mese inizializzati in principio
        "data": {
          "year": startYear,
          "month": startMonth
        },
        "method": "GET",
        "success": function(data, status) {
          // A chiamata avvenuta, eseguo la funzione renderMonth e stampo il mese scelto
          renderMonth(data);
        },
        "error": function (error) {
          alert("Error!");
        }
      }
    );
  }

  // Definisco la funzione renderMonth, per renderizzare il mese scelto
  function renderMonth(data) {

    var momentObject = {
      "year": startYear,
      "month": startMonth
    };

    var momentDate = moment(momentObject);
    $("h1").text(momentDate.format("MMMM YYYY"));
    // Definisco una variabile che contiene il numero di giorni presenti nel mese scelto
    var daysInMonth = momentDate.daysInMonth();
    // Effettuo un ciclo per ognuno dei giorni
    for (var i = 1; i <= daysInMonth; i++) {
      // Modifico le chiavi del contesto per il template
      var context = {
        "day": i,
        "month": momentDate.format("MMMM")
      };
      // Compilo il template con il context
      var html = $(template(context));
      // Converto la data corrente nel formato base
      var currentMomentDate = moment(context.day + context.month + momentObject.year);
      var currentMomentDateFormat = currentMomentDate.format("YYYY-MM-DD");
      // Se l'array delle festività non è vuoto:
      if (data.response.length > 0) {
        // Per ognuna delle festività trovate, controllo se la data corrisponde con quella corrente nel ciclo
        for (var j = 0; j < data.response.length; j++) {
          if (data.response[j].date == currentMomentDateFormat ) {
            // Se corrisponde, aggiungo la classe ".holiday"
            $(html).addClass("holiday");
            // e aggiungo uno <span> contenente il nome della festività
            var holidayName = data.response[j].name;
            $(html).append(" &mdash; <span>" + holidayName + "</span>");
          }
        }
      }
      // Infine faccio l'append del template compilato e stilizzato all'interno della lista ul
      $("ul.month-display").append(html);
    }
  }

});
