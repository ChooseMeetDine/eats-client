app.controller('appCtrl', ['$http', '$window', '$scope', '$mdDialog', '$mdMedia', 'modeService', 'tokenService', '$location', 'pollService', function($http, $window, $scope, $mdDialog, $mdMedia, modeService, tokenService, $location, pollService) {
  $scope.mode = modeService.getMode();

  $scope.parameterPollId = $location.search().poll // THIS THE THE POLL!
  $scope.tokenData = tokenService.getTokenData();

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

  var userFollowedPollLink = ($scope.parameterPollId); //votelänk användes

  var showPollPopupFromLink = function() {
    if (userFollowedPollLink) {
      pollService
        .getPollIdAndSetAsActive($scope.parameterPollId)
        .then(function() {
          $scope.dialogs.showAdvanced(null, 'showActivePoll');
        });
    }
  }

  // -------------------------------- //
  //  TOKEN VALIDATION AND 'ROUTING'  //
  // -------------------------------- //

  if (tokenService.getJwt() === undefined)  { // no token at all = first time on the site
    tokenService.getAnonymousToken()
      .then(function() {
        if (userFollowedPollLink) {
          showPollPopupFromLink();
        }
      });
  } else {
    tokenService.validateToken() // token exists = has visited site before
      .then(function(tokenIsValid) {
        if(!tokenIsValid && tokenService.getUserType() === 'anonymous'){ //User has invalid anonymous-token, get a new one
          tokenService
            .getAnonymousToken()
            .then(function() {
              if (userFollowedPollLink) {
                showPollPopupFromLink();
              }
            });
        } else if (userFollowedPollLink) {
          showPollPopupFromLink();
        }
        // TODO: HÄR KAN GÖRAS EN pollService.fetchAllPollsForUser ISTÄLLET FÖR ATT HA DET I showPoll-controllern..
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
