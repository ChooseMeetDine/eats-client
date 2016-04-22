app.controller('appCtrl', ['$http', '$window', '$scope', '$mdDialog', '$mdMedia', 'modeService', function($http, $window, $scope, $mdDialog, $mdMedia, modeService) {
  $scope.mode = modeService.getMode();

  var anon = $window.localStorage['userAnon'];
  if (localStorage.getItem("userAnon") === null) {
    $http({
      method: 'GET',
      url: 'http://128.199.48.244:7000/auth/anonymous'
    }).then(function successCallback(response) {
      var token = response.data.token;
      $window.localStorage['userAnon'] = response.data.anon;
      $window.localStorage['userName'] = response.data.name;
      $window.localStorage['jwtToken'] = token;
      $http.defaults.headers.common['x-access-token'] = $window.localStorage['jwtToken'];
      $window.location.reload();
      console.log(token);
    }, function errorCallback(response) {
      console.log("Error, cannot load Anonynous User!");
    });
  } else {
    $http.defaults.headers.common['x-access-token'] = $window.localStorage['jwtToken'];
  }

  // Holds all functions for mdDialog to be able to change popups from other controllers
  $scope.dialogs = {};

  $scope.dialogs.showAdvanced = function(ev, id) {
    dialogOptions = {
      controller: DialogController,
      templateUrl: 'html/popups/' + id + '.tmpl.html',
      parent: angular.element(document.body),
      clickOutsideToClose: false,
      fullscreen: useFullScreen
    }
    if (ev) {
      dialogOptions.targetEvent = ev;
    }

    var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
    $mdDialog.show(dialogOptions)
      .then(function(answer) {
        $scope.status = 'You said the information was "' + answer + '".';
      }, function() {
        $scope.status = 'You cancelled the dialog.';
      });
    $scope.$watch(function() {
      return $mdMedia('xs') || $mdMedia('sm');
    }, function(wantsFullScreen) {
      $scope.customFullscreen = (wantsFullScreen === true);
    });
  };

  $scope.dialogs.showTabDialog = function(ev, id) {
    console.log('showTabDialog');
    console.log(ev);
    $mdDialog.show({
        controller: DialogController,
        templateUrl: 'html/popups/' + id + '.tmpl.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: true
      })
      .then(function(answer) {

        $scope.status = 'You said the information was "' + answer + '".';
      }, function() {
        $scope.status = 'You cancelled the dialog.';
      });
  };
}]);

function DialogController($scope, $mdDialog) {
  $scope.hide = function() {
    $mdDialog.hide();
  };
  $scope.cancel = function() {
    $mdDialog.cancel();
  };
  $scope.answer = function(answer) {
    $mdDialog.hide(answer);
  };
  $scope.swap = function(id) {
    $mdDialog.hide()
    $mdDialog.show({
        controller: DialogController,
        templateUrl: 'html/popups/' + id + '.tmpl.html',
        parent: angular.element(document.body),
        clickOutsideToClose: true
      })
      .then(function(answer) {
        $scope.status = 'You said the information was "' + answer + '".';
      }, function() {
        $scope.status = 'You cancelled the dialog.';
      });
  };
  $scope.show = function(id) {
    $mdDialog.show({
      controller: DialogController,
      templateUrl: 'html/popups/' + id + '.tmpl.html',
      parent: angular.element(document.body),
      clickOutsideToClose: true
    });
  };
}
