isDay1 = function(d){
  if (d==='DAY1' || d==='ALL_DAYS') return true;
  if (!moment.isDate(d)) return true;
  var date_day_1_start = new Date('Fri Jul 14 2017 00:00:00 GMT+0200 (CEST)')
  var date_day_1_end   = new Date('Sat Jul 15 2017 06:00:00 GMT+0200 (CEST)')
  return moment(d).isBetween(date_day_1_start,date_day_1_end)
}
isDay2 = function(d){
  if (d==='ALL_DAYS'||d==='---') return true;
  var date_day_2_start = new Date('Sat Jul 15 2017 06:00:00 GMT+0200 (CEST)')
  var date_day_2_end   = new Date('Sun Jul 16 2017 06:00:00 GMT+0200 (CEST)')
  return moment(d).isBetween(date_day_2_start,date_day_2_end)
}
isDay3 = function(d){
  if (d==='ALL_DAYS'||d==='---') return true;
  var date_day_3_start = new Date('Sun Jul 16 2017 06:00:00 GMT+0200 (CEST)')
  var date_day_3_end   = new Date('Mon Jul 17 2017 06:00:00 GMT+0200 (CEST)')
  return moment(d).isBetween(date_day_3_start,date_day_3_end)
}
