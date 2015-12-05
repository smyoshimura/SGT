var app = angular.module('sgtApp', []);

//Manages $HTTP calls - Set multiple urls to be used by different functions, but with the same api_key
app.provider('sgtData', function () {
    var selfHTTP = this;

    selfHTTP.apiKey = "";
    selfHTTP.apiGetUrl = "";
    selfHTTP.apiCreateUrl = "";
    selfHTTP.apiDeleteUrl = "";

    selfHTTP.data = {};

    selfHTTP.$get = function ($http) {
        return {
            returnStudentData: function () {
                console.log('Running http request');

                return $http({
                    url: selfHTTP.apiGetUrl,
                    method: 'POST',
                    data: selfHTTP.apiKey,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                });
            }
        }
    };
});

//Config your provider here to set the apiKey and the api urls
app.config(function (sgtDataProvider) {
    sgtDataProvider.apiKey = "api_key=amZ9Q5UEUU";
    sgtDataProvider.apiGetUrl = "http://s-apis.learningfuze.com/sgt/get";
    sgtDataProvider.apiCreateUrl = "http://s-apis.learningfuze.com/sgt/create";
    sgtDataProvider.apiDeleteUrl = "http://s-apis.learningfuze.com/sgt/delete";
});

//Managed adding and deleting of students
app.service("studentService", function (sgtData) {
    var selfSS = this;

    selfSS.studentArray = [];

    selfSS.returnArray = function () {
        return selfSS.studentArray;
    };

    selfSS.addStudentToArray = function (student) {
        selfSS.studentArray.push(student);
    };

    selfSS.deleteStudentInArray = function (index) {
        selfSS.studentArray.splice(index, 1);
        console.log(selfSS.studentArray);
    };

    selfSS.getStudentDB = function () {
        sgtData.returnStudentData()
            .then(function (response) {
                console.log(".then: ", response);
                selfSS.studentArray = response.data.data;
                console.log("selfSS.studentArray: ", selfSS.studentArray)
            }, function () {
                console.log('Error');
            });
    };
});

app.controller('appController', function ($scope, studentService, sgtData) {
    var selfApp = this;

    selfApp.averageGrade = 0;

    selfApp.calculateAverage = function () {
        var totalGrades = 0;
        var totalStudents = 0;
        var tempArray = studentService.returnArray();

        for (var i in tempArray) {
            if (tempArray[i] === null) {
                continue
            }
            totalGrades = totalGrades + parseInt(tempArray[i].grade);
            ++totalStudents;
        }

        var average = Math.round(totalGrades / totalStudents);

        if (isNaN(average)) {
            average = 0;
        }

        return average;
    };

    selfApp.requestDB = function () {
        studentService.getStudentDB();
    };

    /*this.getStudentDB = function () {
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
     };*/
});

app.controller('formController', function ($scope, studentService, sgtData) {
    var selfForm = this;

    selfForm.addStudentFromForm = function () {
        studentService.addStudentToArray(selfForm.newStudent);
        selfForm.newStudent = {};
    };

    /*self.addStudentToDB = function () {
     /!*error checking for empty fields
     if ($scope.student.name ) {

     };*!/

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
     };*/
});

app.controller('studentListController', function ($scope, studentService, sgtData) {
    var selfSL = this;

    selfSL.slcArray = studentService.returnArray;

    selfSL.removeStudent = function (index) {
        studentService.deleteStudentInArray(index);
    };

    /*selfSL.removeStudentFromDB = function ($index) {
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
     }*/
});