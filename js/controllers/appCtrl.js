app.controller('appCtrl', ['$http', '$window', '$scope', '$mdDialog', '$mdMedia', 'modeService', 'tokenService', function($http, $window, $scope, $mdDialog, $mdMedia, modeService, tokenService) {
  $scope.mode = modeService.getMode();

  var anon = $window.localStorage['userAnon'];
  if (localStorage.getItem("userAnon") !== null) { //There is a token
    $http.defaults.headers.common['x-access-token'] = $window.localStorage['jwtToken']; //use the token

    tokenService.testToken()  //Try to use the token to see if it's still valid
    .then(function(response) {
      console.log('You are now logged in as ' + $window.localStorage['userName']);
    }).catch(function(response) {
      tokenService.getAnonymousToken(); //The token was not valid, get a new one
    });

  } else { //There is no token, get one
    console.log('You are not logged in, getting a token for you....');
    tokenService.getAnonymousToken(); //The token was not valid, get a new one
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
