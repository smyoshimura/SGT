var app = angular.module('sgtApp', []);

app.service("studentService", function (){
   var self = this;

    self.studentArray = [];

    self.addStudentToArray = function (student) {
        self.studentArray.push(student);
    };

    self.returnArray = function () {
        return self.studentArray;
    };

    self.deleteStudentInArray = function (index) {
        self.studentArray.splice(index, 1);
        console.log(self.studentArray);
    };
});

app.controller('appController', function ($scope, studentService) {
    var selfApp = this;

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
                    $scope.newStudent = result.data[x];

                    $scope.studentArray.push($scope.newStudent);

                    $scope.newStudent = {};
                }

                $scope.$digest();
            }
        })
    };
});

app.controller('formController', function ($scope, studentService) {
    var selfForm = this;

    selfForm.addStudentFromForm = function () {
        studentService.addStudentToArray(this.newStudent);
        this.newStudent = {};
    };

    self.addStudentToDB = function () {
        /*error checking for empty fields
        if ($scope.student.name ) {

        };*/

        $.ajax({
            dataType: 'json',
            method: 'POST',
            url: 'http://s-apis.learningfuze.com/sgt/create',
            data: {
                api_key: 'amZ9Q5UEUU',
                name: $scope.newStudent.name,
                course: $scope.newStudent.course,
                grade: $scope.newStudent.grade
            },

            success: function (result) {
                console.log(result);

                $scope.newStudent.id = result.new_id;

                self.addStudentFromForm();

                $scope.$digest()
            }
        })
    };
});

app.controller('studentListController', function ($scope, studentService) {
    var selfSL = this;

    selfSL.slcArray = studentService.returnArray();

    selfSL.removeStudent = function (index) {
        studentService.deleteStudentInArray(index);
    };

    selfSL.removeStudentFromDB = function ($index) {
        var student_id = $scope.studentArray[$index].id;

        $.ajax({
            dataType: 'json',
            method: 'POST',
            url: 'http://s-apis.learningfuze.com/sgt/delete',
            data: {api_key: 'amZ9Q5UEUU', student_id: student_id},

            success: function (result) {
                console.log(result);

                self.deleteStudent($index);

                $scope.$digest()
            }
        })
    }
});