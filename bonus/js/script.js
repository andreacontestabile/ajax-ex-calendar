$(document).ready(function() {
  // Definisco due variabili relative all'anno e al mese da cui iniziare il rendering
  var startYear = 2018;
  var startMonth = 0;

  // Inizializzo il template Handlebars
  var source = $("#day-template").html();
  var template = Handlebars.compile(source);

  // Eseguo il rendering del mese selezionato
  renderMonth();
  // Effettuo la chiamata ajax per evidenziare le festività del mese
  getHolidays();

  // Definisco l'evento click sul pulsante NEXT:
  $("#next").click(function() {
    // che funziona solo se la variabile startMonth è minore di 11
    if (startMonth < 11) {
      // Seleziono il mese successivo
      startMonth += 1;
      // Svuoto la pagina
      $(".month-display").empty();
      // Eseguo le funzioni di render del mese selezionato ed evidenzio le nuove festività
      renderMonth();
      getHolidays();
    } else {
      // Se l'utente preme NEXT su Dicembre 2018, riceve un alert di errore
      alert("Nessun dato successivo a questa data!");
    }
  });

  // Definisco l'evento click sul pulsante PREV:
  $("#prev").click(function() {
    // che funziona solo se la variabile startMonth è maggiore di 0
    if (startMonth > 0) {
      // Seleziono il mese precedente
      startMonth -= 1;
      // Svuoto la pagina
      $(".month-display").empty();
      // Eseguo le funzioni di render del mese selezionato ed evidenzio le nuove festività
      renderMonth();
      getHolidays();
    } else {
      // Se l'utente preme PREV su Gennaio 2018, riceve un alert di errore
      alert("Nessun dato precedente a questa data!");
    }
  });

  // // Definisco la funzione renderMonth, per renderizzare il mese scelto
  function renderMonth() {
    // Creo un oggetto moment con anno e mese scelti
    var momentObject = {
      "year": startYear,
      "month": startMonth
    };

    // Creo una data moment.js passando l'oggetto creato
    var momentDate = moment(momentObject);
    // Ottengo il numero di giorni nel mese selezionato
    var daysInMonth = momentDate.daysInMonth();

    // Modifico il titolo in base al mese scelto
    $("h1").text(momentDate.format("MMMM YYYY"));

    // Per ognuno dei giorni nel mese, modifico il context e compilo il template
    for (var i = 1; i <= daysInMonth; i++) {
      var context = {
        "day": i,
        "month": momentDate.format("MMMM")
      }

      // Compilo il template e lo aggiungo alla lista sulla pagina
      var html = template(context);
      $("ul.month-display").append(html);
    }
  }

  // Funzione getHolidays per ottenere le festività del mese selezionato
  function getHolidays() {
    // Effettuo la chiamata ajax per ottenere le festività
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
            var response = data.response;
            // effettuo il ciclo solo se l'array non è vuoto
            if (response.length > 0) {
              for (var i = 0; i < response.length; i++) {
                // Salvo data e nome della festività
                var holidayDate = response[i].date;
                var holidayName = response[i].name;
                // Ottengo il numero relativo al giorno della festività
                var holidayDayNumber = moment(holidayDate).format("D");

                // Seleziono il giorno dalla lista in base al numero
                var holidaySelect = $("li.day:nth-child(" + holidayDayNumber + ")");
                // Aggiungo la classe "holiday"
                holidaySelect.addClass("holiday");
                // Aggiungo uno span contenente il nome della festività
                holidaySelect.append(" <span class='holiday-name'>" + holidayName + "</span>");
              }
            }
          },
          "error": function (error) {
            alert("Errore!");
          }
        }
    );
  }

});
