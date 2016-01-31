angular.module('todosanamvc', ['firebase'])

.controller('EntryCtrl', function EntryCtrl($scope, $firebase) {
    var fireRef = new Firebase('https://todosana.firebaseio.com/');

    fireRef.authWithOAuthPopup("google", function(error, authData) {
      if (error) {
        console.log("Login Failed!", error);
      } else {
        console.log("Authenticated successfully with payload:", authData);
      }
    });

    // watch login status
    fireRef.onAuth(authDataCallback);

    var isNewUser = true;

    fireRef.onAuth(function(authData) {
      if (authData && isNewUser) {
        // save the user's profile into the database so we can list users,
        // use them in Security and Firebase Rules, and show profiles
        fireRef.child("users").child(authData.uid).set({
          provider: authData.provider,
          name: authData.google.displayName
        });
      }
    });

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
    $scope.newCategory = $scope.categories[0];

    $scope.addEntry = function(markDone){
      var newEntryTitle = $scope.newEntry.trim();
      if (!newEntryTitle.length) {
          return;
      }

      var newEntryDuration = null;
      if($scope.newDuration)
        newEntryDuration = parseInt($scope.newDuration.trim());

      var newEntryDate = $scope.newDate.getTime();
      var newEntryCategory = $scope.newCategory;

      var entry = {
          title: newEntryTitle,
          date: newEntryDate,
          category: newEntryCategory,
          duration: newEntryDuration,
          completed: markDone
      }

      // set priority (days from today)
      entry.$priority = newEntryDate - new Date().getTime();

      console.log(entry.$priority);

      $scope.entries.$add(entry);

      $scope.newEntry = '';
    };

    $scope.removeEntry = function(entry){
      $scope.entries.$remove(entry);
    };

    $scope.completeEntry = function(entry){
      // If item priority is negative it is in the future so don't add it.. 
      // Need better solution
      entry.completed = true;
      $scope.entries.$save(entry);

    };

    // Create a callback which logs the current auth state
    function authDataCallback(authData) {
      if (authData) {
        console.log("User " + authData.uid + " is logged in with " + authData.provider);
      } else {
        console.log("User is logged out");
      }
    }

});
