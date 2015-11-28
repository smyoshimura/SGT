var app = angular.module('sgtApp', []);

app.controller('appController', function ($scope) {
    $scope.newStudent = {};
    $scope.studentArray = [];
    $scope.averageGrade = 0;
});


app.controller('formController', function ($scope) {
    this.addStudent = function () {
        $scope.studentArray.push($scope.newStudent);
        $scope.newStudent = {};
    }
});


app.controller('studentListController', function ($scope) {
    this.deleteStudent = function ($index) {
        $scope.studentArray.splice($index, 1);
    }
});