app.controller('appCtrl', ['$http', '$window', '$scope', '$mdDialog', '$mdMedia', 'modeService', 'tokenService','$location', function($http, $window, $scope, $mdDialog, $mdMedia, modeService, tokenService, $location) {
  $scope.mode = modeService.getMode();

  $scope.parameterPollId = $location.search().poll // THIS THE THE POLL!

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

  if(!$scope.parameterPollId) {                                                           //User did not reach this webpage from a #?poll= adress
    var anon = $window.localStorage['userAnon'];
    if (localStorage.getItem("userAnon") !== null) { //There is a token
      tokenService.testToken()                                                            //Try to use the token to see if it's still valid
      .then(function(response) {
        console.log('You are now logged in as ' + $window.localStorage['userName']);      //Token is valid
      }).catch(function(response) {
        tokenService.getAnonymousToken();                                                 //The token was not valid, get a new one
      });
    } else {                                                                              //There is no token, get one
      console.log('You are not logged in, getting a token for you....');
      tokenService.getAnonymousToken();
    }
  } else if (localStorage.getItem("userAnon") === null) {                                 //User reached this webpage from a #?poll= adress without having a token
    $scope.dialogs.showAdvanced(null, 'continueAs');
  } else  {                                                                               //User reached this webpage from a #?poll= adress and has a token
    tokenService
      .testToken()                                                                        //Try to use the token to see if it's still valid
      .then(function() {                                                                  //Token is valid
        $http({                                                                           //Add this user to the poll
          method: 'POST',
          url: 'http://128.199.48.244:7000/polls/' + $scope.parameterPollId + '/users'
        }).then(function(){
          $window.location.reload();
        }).catch(function(response) {
          $scope.dialogs.showAdvanced(null, 'continueAs');
        });
      });
  }
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
