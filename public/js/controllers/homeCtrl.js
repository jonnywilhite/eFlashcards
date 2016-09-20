"use strict";

angular.module('app').controller('homeCtrl', function($http, $location, $cookies, AuthService) {
  var homeCtrlData = this;

  homeCtrlData.flashcards = [];
  homeCtrlData.quizViewShown = true;
  homeCtrlData.editViewShown = false;
  homeCtrlData.username = (AuthService.currentUser() && AuthService.currentUser().username) || $cookies.get('username');

  $http.get('/api/flashcards')
    .success(function(data) {
      homeCtrlData.flashcards = data;
    })
    .error(function(data) {
      console.log('Error getting flashcards: ' + data);
    });

  homeCtrlData.showQuestion = function () {
    if (homeCtrlData.fcIndex == homeCtrlData.flashcards.length) {
      homeCtrlData.reset();
    } else {
      homeCtrlData.flashcardDisplayed = true;
      homeCtrlData.answerDisplayed = false;
      homeCtrlData.questionDisplayed = true;
      homeCtrlData.currentQuestion = homeCtrlData.flashcards[homeCtrlData.fcIndex].question;
    }
  };

  homeCtrlData.showAnswer = function () {
    homeCtrlData.questionDisplayed = false;
    homeCtrlData.answerDisplayed = true;
    homeCtrlData.currentAnswer = homeCtrlData.flashcards[homeCtrlData.fcIndex].answer;
    homeCtrlData.fcIndex++;
  };

  homeCtrlData.logout = function () {
    $http.get('/logout')
      .success(function (data) {
        $cookies.remove('username');
        $location.path('/logout');
      })
      .error(function (data) {
        $cookies.remove('username');
        $location.path('/logout');
      });
  };

  homeCtrlData.showNewView = function (divId) {
    document.getElementById('quiz-div').style.display = 'none';
    document.getElementById('edit-div').style.display = 'none';
    document.getElementById(divId).style.display = 'inline';

    if (divId === 'quiz-div') {
      homeCtrlData.quizViewShown = true;
      homeCtrlData.editViewShown = false;
    } else {
      homeCtrlData.quizViewShown = false;
      homeCtrlData.editViewShown = true;
    }
    homeCtrlData.reset();
  };

  homeCtrlData.reset = function () {
    homeCtrlData.fcIndex = 0;
    homeCtrlData.flashcardDisplayed = false;
    homeCtrlData.questionDisplayed = false;
    homeCtrlData.answerDisplayed = false;
    homeCtrlData.currentQuestion = "";
    homeCtrlData.currentAnswer = "";
    homeCtrlData.selectedCount = 0;
    homeCtrlData.selected = "";
    homeCtrlData.dirtyCards = [];
    document.getElementById('check-all').checked = false;
    var checkboxes = document.getElementsByClassName('my-checkbox');
    for (var i = 0; i < checkboxes.length; i++) {
      checkboxes[i].checked = false;
    }
  };
  homeCtrlData.reset();

  homeCtrlData.checkUncheck = function () {
    var checkboxes = document.getElementsByClassName('my-checkbox');
    var checkAllButton = document.getElementById('check-all');
    var anyChecked = false;
    var allChecked = true;
    homeCtrlData.selectedCount = 0;
    for (var i = 0; i < checkboxes.length; i++) {
      if (checkboxes[i].checked) {
        homeCtrlData.selectedCount++;
        anyChecked = true;
      } else {
        allChecked = false;
      }
    }

    if (allChecked) {
      checkAllButton.checked = true;
    } else {
      checkAllButton.checked = false;
    }
  };

  homeCtrlData.checkUncheckAll = function () {
    var checkboxes = document.getElementsByClassName('my-checkbox');
    if (document.getElementById('check-all').checked) {
      homeCtrlData.selectedCount = homeCtrlData.flashcards.length;
      for (var i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = true;
      }
    } else {
      homeCtrlData.selectedCount = 0;
      for (var i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = false;
      }
    }
  };

  homeCtrlData.getTemplate = function (flashcard) {
    if (flashcard._id === homeCtrlData.selected._id) {
      return 'edit';
    } else {
      return 'display';
    }
  };

  homeCtrlData.editCard = function (flashcard) {
    if (homeCtrlData.selected) {
      for (var i = 0; i < homeCtrlData.flashcards.length; i++) {
        if (homeCtrlData.flashcards[i]._id === homeCtrlData.selected._id) {
          homeCtrlData.flashcards[i] = homeCtrlData.selected;
        }
      }
      for (var i = 0; i < homeCtrlData.dirtyCards.length; i++) {
        if (homeCtrlData.dirtyCards[i]._id === homeCtrlData.selected._id) {
          homeCtrlData.dirtyCards.push(homeCtrlData.selected);
        }
      }

    }
    homeCtrlData.selected = angular.copy(flashcard);
  };

  homeCtrlData.saveCards = function () {
    console.log(homeCtrlData.dirtyCards);
  };

});
