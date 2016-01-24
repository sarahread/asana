var asanamvc = angular.module('asanamvc', ['firebase']);

asanamvc.controller('EntryCtrl', function EntryCtrl($scope, $firebase) {
    var fireRef = new Firebase('https://asana-tracker.firebaseio.com/');
    $scope.entries = $firebase(fireRef).$asArray();
    $scope.newEntry = '';
    $scope.newDate = new Date();

    $scope.categories =
    [
        "Yoga With Adriene",
        "Cody Workout",
        "Freestyle"
    ];  

    $scope.addEntry = function(){
        var newEntryTitle = $scope.newEntry.trim();
        if (!newEntryTitle.length) {
            return;
        }
        var newEntryDate = $scope.newDate.toString();
        var newEntryCategory = $scope.newCategory;

        // push to firebase
        $scope.entries.$add({
            title: newEntryTitle,
            date: newEntryDate,
            category: newEntryCategory,
            completed: false
        });
        $scope.newEntry = '';
    };

    $scope.removeEntry = function(entry){
        $scope.entries.$remove(entry);
    };

});
