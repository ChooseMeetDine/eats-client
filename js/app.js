var app = angular.module('app', ['ui.bootstrap', 'ngMaterial', 'ngMessages', 'leaflet-directive', 'ngclipboard']);
app.config(function($logProvider){
  $logProvider.debugEnabled(false);
});
