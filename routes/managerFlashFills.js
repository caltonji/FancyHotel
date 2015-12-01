var exampleReservationReport = {August :
          [{Location : 'Charlotte', total_reservations : 12},
          {Location : 'Orlando' , total_reservations : 54},
          {Location : 'Atlanta', total_reservations : 96},
          {Location : 'Miami', total_reservations : 29},
          {Location : 'Savannah', total_reservations : 41}],
          September:
          [{Location : 'Charlotte', total_reservations : 19},
          {Location : 'Orlando' , total_reservations : 25},
          {Location : 'Atlanta', total_reservations : 63},
          {Location : 'Miami', total_reservations : 46},
          {Location : 'Savannah', total_reservations : 12}]};

var exampleRoomCategoryReport = {August :
          [{roomcat: 'family', Location : 'Charlotte', total_reservations : 19},
          {roomcat: 'suite',Location : 'Orlando' , total_reservations : 89},
          {roomcat: 'family',Location : 'Atlanta', total_reservations : 27},
          {roomcat: 'standard',Location : 'Miami', total_reservations : 29},
          {roomcat: 'suite',Location : 'Savannah', total_reservations : 41}],
          September:
          [{roomcat: 'family',Location : 'Charlotte', total_reservations : 26},
          {roomcat: 'suite',Location : 'Orlando' , total_reservations : 29},
          {roomcat: 'standard',Location : 'Atlanta', total_reservations : 61},
          {roomcat: 'standard',Location : 'Miami', total_reservations : 51},
          {roomcat: 'family',Location : 'Savannah', total_reservations : 17}]};

var exampleRevenueReport = {August :
          [{Location : 'Charlotte', total_revenue : 10000},
          {Location : 'Orlando' , total_revenue : 23000},
          {Location : 'Atlanta', total_revenue : 12000},
          {Location : 'Miami', total_revenue : 54000},
          {Location : 'Savannah', total_revenue : 21000}],
          September:
          [{Location : 'Charlotte', total_revenue : 1700},
          {Location : 'Orlando' , total_revenue : 2500},
          {Location : 'Atlanta', total_revenue : 600},
          {Location : 'Miami', total_revenue : 4600},
          {Location : 'Savannah', total_revenue : 2100}]};

exports.fillReservationreport = function(req, res) {
  req.flash('reservationreports', exampleReservationReport);
}

exports.fillPopularRoomReport = function(req, res) {
  req.flash('roomcatreports', exampleRoomCategoryReport);
}

exports.fillRevenueReport = function(req,res){
    req.flash('revenuereports', exampleRevenueReport);
}
