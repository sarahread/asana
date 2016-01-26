var todosanamvc = angular.module('todosanamvc', ['firebase']);

todosanamvc.controller('EntryCtrl', function EntryCtrl($scope, $firebase) {
    var fireRef = new Firebase('https://todosana.firebaseio.com/');
    $scope.entries = $firebase(fireRef).$asArray();
    $scope.newEntry = '';
    $scope.newDate = new Date();

    $scope.categories =
    [
        "Yoga With Adriene",
        "Cody App Video",
        "PIYO",
        "Free practice"
    ];

    $scope.addEntry = function(){
      var newEntryTitle = $scope.newEntry.trim();
      if (!newEntryTitle.length) {
          return;
      }
      var newEntryDate = $scope.newDate.toString();
      var newEntryCategory = $scope.newCategory;

      var item = {
          title: newEntryTitle,
          date: newEntryDate,
          category: newEntryCategory,
          completed: false
      }

      // set priority (days from today)
      item.$priority = new Date().getTime() - $scope.newDate.getTime();
      $scope.entries.$add(item);

      $scope.newEntry = '';
    };

    $scope.removeEntry = function(entry){
      $scope.entries.$remove(entry);
    };

    $scope.completeEntry = function(entry){
      entry.completed = true;
      $scope.entries.$save(entry);
    };

});
