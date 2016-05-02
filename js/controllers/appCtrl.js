app.controller('appCtrl', ['$http', '$window', '$scope', '$mdDialog', '$mdMedia', 'modeService', 'tokenService', '$location', 'pollService', function($http, $window, $scope, $mdDialog, $mdMedia, modeService, tokenService, $location, pollService) {
  $scope.mode = modeService.getMode();

  $scope.parameterPollId = $location.search().poll // THIS THE THE POLL!
  $scope.tokenStatus = tokenService.getTokenStatus();

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

  if (tokenService.getJwt() === undefined)  { // no token at all = first time on the site
    tokenService.getAnonymousToken()
      .then(function() {
        if (userFollowedPollLink) {
          showPollPopupFromLink();
        }
      });
  } else {
    tokenService.validateToken() // token exists = has visited site before
      .then(function() {
        if (userFollowedPollLink) {
          showPollPopupFromLink();
        }
        // TODO: HÄR KAN GÖRAS EN pollService.fetchAllPollsForUser ISTÄLLET FÖR ATT HA DET I showPoll-controllern..
      });
  }

  // tokenService.validateToken()
  //   .then(showPollPopupFromLink)
  //   .catch(showPollPopupFromLink);





  // tokenService
  // .validateToken()
  // .then(function() {
  //   if(userFollowedPollLink){ //User followed poll-link and has a valid token
  //     pollService
  //       .isUserParticipantInPoll($scope.parameterPollId, tokenService.getUserId())
  //       .then(function(userIsParticipant) { // userIsParticipant is true or false
  //         if(!userIsParticipant){
  //           console.log('You are logged in as ' + tokenService.getTokenUserName() + ' but you are not participating in this poll');
  //           $scope.dialogs.showAdvanced(null, 'continueToPollAs'); //User is not in this poll, ask what he/she would like to continue as
  //         } else {
  //           console.log('You are logged in as ' + tokenService.getTokenUserName() + ' and you are a participant in this poll');
  //         }
  //       });
  //   }
  // }).catch(function() {
  //   console.log('You do not have a valid token yet.')
  //   if(userFollowedPollLink){ //User followed poll-link and has an invalid token that belongs to a registered user
  //     $scope.dialogs.showAdvanced(null, 'continueAs');
  //   } else {
  //     tokenService.getAnonymousToken(); //User did not follow a poll-link and does not have a valid token
  //   }
  // });


  // localStorage.getItem("userAnon") === null //Token finns inte
  // var userFollowedPollLink = ($scope.parameterPollId); //votelänk användes
  //
  //
  // var userHasTokenFromLastSession = (localStorage.getItem("userAnon") === null); //Använd tokenService
  // var userFollowedPollLink = ($scope.parameterPollId);
  //
  // If(userHasTokenFromLastSession && userFollowedPollLink) {
  //   validera token
  //     om den är valid continueAs med alternativ att fortsätta som sig själv
  //     annars bara continueAs (vanliga)
  // }
  // If(!userHasTokenFromLastSession && userFollowedPollLink)
  //   continueAs (vill man logga in?) (samma som icke-valid token)
  // If(userHasTokenFromLastSession && !userFollowedPollLink)
  //   validera token
  //     om invalid : skaffa anontoken
  //
  // If(!userHasTokenFromLastSession && !userFollowedPollLink)
  //   skaffa anontoken
  //
  // hinta om att du inte är inloggad vid skapande av omröstning


  //   if(!$scope.parameterPollId) {                                                           //User did not reach this webpage from a #?poll= adress
  //     var anon = $window.localStorage['userAnon'];
  //     if (localStorage.getItem("userAnon") !== null) {                                      //There is a token
  //       tokenService.testToken()                                                            //Try to use the token to see if it's still valid
  //       .then(function(response) {
  //         tokenService.setTokenExists();
  //         console.log('You are now logged in as ' + $window.localStorage['userName']);      //Token is valid
  //       }).catch(function(response) {
  //         tokenService.getAnonymousToken();                                                 //The token was not valid, get a new one
  //       });
  //     } else {                                                                              //There is no token, get one
  //       console.log('You are not logged in, getting a token for you....');
  //       tokenService.getAnonymousToken();
  //     }
  //   } else if (localStorage.getItem("userAnon") === null) {                                 //User reached this webpage from a #?poll= adress without having a token
  //     $scope.dialogs.showAdvanced(null, 'continueAs');
  //   } else  {                                                                               //User reached this webpage from a #?poll= adress and has a token
  //     tokenService
  //       .testToken()                                                                        //Try to use the token to see if it's still valid
  //       .then(function() {
  //         tokenService.setTokenExists();                                                                 //Token is valid
  //         $http({                                                                           //Add this user to the poll
  //           method: 'POST',
  //           url: 'http://128.199.48.244:7000/polls/' + $scope.parameterPollId + '/users'
  //         }).then(function(){
  //           $window.location.reload();
  //         }).catch(function(response) {
  //           $scope.dialogs.showAdvanced(null, 'continueAs');
  //         });
  //       });
  //   }
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
