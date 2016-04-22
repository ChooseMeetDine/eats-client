var app = angular.module('app', ['ui.bootstrap', 'ngMaterial', 'ngMessages', 'leaflet-directive']);
app.config(function($logProvider){
  $logProvider.debugEnabled(false);
});
