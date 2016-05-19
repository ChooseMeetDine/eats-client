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
    // clearActivePollOnCancel: boolean, that determines if the active poll should be cleared when
    // this popup is cancelled or not. Clearing activePoll is done to remove the poll-URL-parameter,
    // for example when closing an active poll popup, to make sure it wont be opened automaticly when the page is reloaded.
    $scope.dialogs.showPopup = function(ev, id, clickOutsideToClose, clearActivePollOnCancel) {
      $mdDialog.show({
          controller: DialogController,
          templateUrl: 'html/popups/' + id + '.tmpl.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: clickOutsideToClose,
        })
        .then(function(){
          console.log('Dialog was hidden');
        })
        .catch(function(){
        // This code will run if the dialog is "cancelled", i.e. user clicked on Cancel/X or outside the dialog
        if(clearActivePollOnCancel) {
            pollService.clearActivePoll();
          }
        console.log('Dialog was cancelled');
      });
    };

    var userFollowedPollLink = ($scope.parameterPollId); //votelänk användes

    var showPollPopupFromLink = function() {
      if (userFollowedPollLink) {
        pollService
          .getPollIdAndSetAsActive($scope.parameterPollId)
          .then(function() {
            $scope.dialogs.showPopup(null, 'showActivePoll', true, true);
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
    $scope.show = function(id, clickOutsideToClose, clearActivePollOnCancel) {
      $mdDialog.show({
        controller: DialogController,
        templateUrl: 'html/popups/' + id + '.tmpl.html',
        parent: angular.element(document.body),
        clickOutsideToClose: clickOutsideToClose,
      })
      .then(function(){
        console.log('Dialog was hidden');
      })
      .catch(function(){
        // This code will run if the dialog is "cancelled", i.e. user clicked on Cancel/X or outside the dialog
        if(clearActivePollOnCancel) {
            pollService.clearActivePoll();
          }
        console.log('Dialog was cancelled');
      });
    };
    $scope.cancel = function() {
      $mdDialog.cancel();
    };
    $scope.answer = function(answer) {
      $mdDialog.hide(answer);
    };
    $scope.swap = function(id, clickOutsideToClose, clearActivePollOnCancel) {
      $scope.hide();
      $scope.show(id, clickOutsideToClose, clearActivePollOnCancel);
    };
  }
