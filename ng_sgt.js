var app = angular.module('sgtApp', []);

//Manages $HTTP calls - Set multiple urls to be used by different functions, but with the same api_key
app.provider('sgtData', function () {
    var selfHTTP = this;

    //Configurable properties
    selfHTTP.apiKey = "";
    selfHTTP.apiGetUrl = "";
    selfHTTP.apiCreateUrl = "";
    selfHTTP.apiDeleteUrl = "";

    //All database calls
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
            },

            addStudentData: function (student) {
                var dataObj = $.param({
                    api_key: "amZ9Q5UEUU",
                    name: student.name,
                    course: student.course,
                    grade: student.grade
                });

                return $http({
                    url: selfHTTP.apiCreateUrl,
                    method: 'POST',
                    data: dataObj,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                });
            },

            deleteStudentData: function (id) {
                var dataObj = $.param({
                    api_key: "amZ9Q5UEUU",
                    student_id: id
                });

                return $http({
                    url: selfHTTP.apiDeleteUrl,
                    method: 'POST',
                    data: dataObj,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                });
            }
        }
    };
});

//Config provider here to set the apiKey and the api urls
app.config(function (sgtDataProvider) {
    sgtDataProvider.apiKey = "api_key=amZ9Q5UEUU";
    sgtDataProvider.apiGetUrl = "http://s-apis.learningfuze.com/sgt/get";
    sgtDataProvider.apiCreateUrl = "http://s-apis.learningfuze.com/sgt/create";
    sgtDataProvider.apiDeleteUrl = "http://s-apis.learningfuze.com/sgt/delete";
});

//Manages adding and deleting of students from array and makes provider requests
app.service("studentService", function (sgtData) {
    var selfSS = this;

    selfSS.studentArray = [];

    selfSS.returnArray = function () {
        return selfSS.studentArray;
    };

    selfSS.addStudentToArray = function (student) {
        selfSS.studentArray.push(student);
        console.log('studentArray: ', selfSS.studentArray);
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

    selfSS.addStudentDB = function (student) {
        var tempStudent = student;
        sgtData.addStudentData(student)
            .then(function (response) {
                console.log(".then: ", response);
                tempStudent['id'] = response.data.new_id;
                selfSS.addStudentToArray(tempStudent);
            }, function () {
                console.log('Error');
            });
    };

    selfSS.removeStudentDB = function (index) {
        var tempID = selfSS.studentArray[index].id;

        sgtData.deleteStudentData(tempID)
            .then(function (response) {
                console.log(".then: ", response);
                selfSS.deleteStudentInArray(index);
            }, function () {
                console.log('Error');
            });
    }
});

//Handles grade average and general database request
app.controller('appController', function (studentService) {
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
});

//Handles from inputs and requests adding of students to array and database
app.controller('formController', function (studentService) {
    var selfForm = this;

    selfForm.addStudentToDB = function () {
        studentService.addStudentDB(selfForm.newStudent);
        selfForm.newStudent = {};
    };
});

//Handles outputting student table info and requests student removal from array and database
app.controller('studentListController', function (studentService) {
    var selfSL = this;

    selfSL.slcArray = studentService.returnArray;

    selfSL.requestRemove = function (index) {
        studentService.removeStudentDB(index);
    };
});