var app = angular.module('sgtApp', []);

app.controller('appController', function ($scope) {
    $scope.newStudent = {};
    $scope.studentArray = [];
    $scope.averageGrade = 0;

    this.calculateAverage = function () {
        var total_grades = 0;
        var total_students = 0;

        for (var i in $scope.studentArray) {
            if ($scope.studentArray[i] === null) {
                continue
            }
            total_grades = total_grades + parseInt($scope.studentArray[i].grade);
            ++total_students;
        }

        var average = Math.round(total_grades / total_students);

        if (isNaN(average)) {
            average = 0;
        }

        return average;
    };

    this.getStudentDB = function () {
        $.ajax({
            dataType: 'json',
            method: 'POST',
            url: 'http://s-apis.learningfuze.com/sgt/get',
            data: {api_key: 'amZ9Q5UEUU'},

            success: function (result) {
                console.log('Ajax call result:', result);

                for (var x in result.data) {
                    $scope.newStudent.name = result.data[x].name;
                    $scope.newStudent.course = result.data[x].course;
                    $scope.newStudent.grade = result.data[x].grade;
                    $scope.newStudent.id = result.data[x].id;
                    $scope.studentArray.push($scope.newStudent);
                    $scope.newStudent = {};
                    $scope.$digest();
                }
            }
        })
    };
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