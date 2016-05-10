  app.controller('appCtrl', ['$http', '$window', '$scope', '$mdDialog', '$mdMedia', 'modeService', 'tokenService', '$location', 'pollService', function($http, $window, $scope, $mdDialog, $mdMedia, modeService, tokenService, $location, pollService) {
    $scope.mode = modeService.getMode();

    $scope.parameterPollId = $location.search().poll // THIS THE THE POLL!
    $scope.tokenData = tokenService.getTokenData();

    // Holds all functions for mdDialog to be able to change popups from other controllers
    $scope.dialogs = {};

    // Shows a popup (mdDialog) on the screen
    // 
    // ev: $event-object, to make the popup animations move from where the user clicked
    // id: string, the name of one of the popup templates in html/popups
    // clickOutSideToClose: boolean, to control if popup should be allowed to close when clicking out side it
    // clearActivePollOnRemove: boolean, that determines if the active poll should be cleared when
    // this popup is closed or not. Clearing activePoll is done to remove the poll-URL-parameter,
    // for example when closing an active poll popup, to make sure it wont be opened automaticly when the page is reloaded.
    $scope.dialogs.showPopup = function(ev, id, clickOutsideToClose, clearActivePollOnRemove) {
      var clearActivePoll = null;
      if (clearActivePollOnRemove) {
        clearActivePoll = pollService.clearActivePoll;
      }

      $mdDialog.show({
          controller: DialogController,
          templateUrl: 'html/popups/' + id + '.tmpl.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: clickOutsideToClose,
          onRemoving: clearActivePoll
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
            $scope.dialogs.showPopup(null, 'showActivePoll', true, false);
          });
      }
    }

    // -------------------------------- //
    //  TOKEN VALIDATION AND 'ROUTING'  //
    // -------------------------------- //
    if (tokenService.getJwt() === undefined) { // no token at all = first time on the site
      tokenService.getAnonymousToken()
        .then(function() {
          if (userFollowedPollLink) {
            showPollPopupFromLink();
          }
        });
    } else {
      tokenService.validateToken() // token exists = has visited site before
        .then(function(tokenIsValid) {
          if (!tokenIsValid && tokenService.getUserType() === 'anonymous') { //User has invalid anonymous-token, get a new one
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

  function DialogController($scope, $mdDialog, pollService) {
    $scope.hide = function() {
      $mdDialog.hide();
    };
    $scope.show = function(id, clickOutsideToClose, clearActivePollOnRemove) {
      var clearActivePoll = null;
      if (clearActivePollOnRemove) {
        clearActivePoll = pollService.clearActivePoll;
      }

      $mdDialog.show({
        controller: DialogController,
        templateUrl: 'html/popups/' + id + '.tmpl.html',
        parent: angular.element(document.body),
        clickOutsideToClose: clickOutsideToClose,
        onRemoving: clearActivePoll
      });
    };
    $scope.cancel = function() {
      $mdDialog.cancel();
    };
    $scope.answer = function(answer) {
      $mdDialog.hide(answer);
    };
    $scope.swap = function(id, clickOutsideToClose, clearActivePollOnRemove) {
      $scope.hide();
      $scope.show(id, clickOutsideToClose, clearActivePollOnRemove);
    };
  }
