var app = angular.module('sgtApp', []);

//Manages $HTTP calls - Set multiple urls to be used by different functions, but with the same api_key
app.provider('sgtData', function () {
    var selfHTTP = this;

    var firebaseRef = new Firebase("https://dazzling-torch-4855.firebaseio.com/data/students");

    //All database calls
    selfHTTP.$get = function ($http, $q) {
        return {
            returnStudentData: function () {
                var defer = $q.defer();

                var promises = [];

                firebaseRef.on("child_added", function (snapshot) {
                    var studentObj = snapshot.val();
                    studentObj.id = snapshot.key();

                    console.log('child_added snapshot: ', studentObj);

                    promises.push(studentObj);

                    defer.resolve(promises);

                }, function (errorObject) {

                    console.log("The read failed: " + errorObject.code);

                    defer.reject();
                });

                return defer.promise
            },

            addStudentData: function (student) {
                firebaseRef.push(student);
            },

            deleteStudentData: function (id) {
                var removalStudent = firebaseRef.child(id);

                var defer = $q.defer();

                firebaseRef.on('child_removed', function (snapshot) {

                    console.log('child_removed snapshot: ', snapshot.val());

                    defer.resolve("Success!");

                }, function (errorObject) {
                    console.log("The delete failed: " + errorObject.code);

                    defer.reject();
                });

                removalStudent.remove();

                return defer.promise;
            }
        }
    };
});

//Manages adding and deleting of students from array and makes provider requests
app.service("studentService", function (sgtData, $q) {
    var selfSS = this;

    var firebaseRef = new Firebase("https://dazzling-torch-4855.firebaseio.com/data/students");

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
     console.log("Current studentArray: ", selfSS.studentArray);
     };

    selfSS.getStudentDB = function () {
        sgtData.returnStudentData()
            .then(function (snapshot) {
                selfSS.studentArray = snapshot;

                console.log('Current studentArray: ', selfSS.studentArray);

            }, function () {
                console.log('Error');
            })
    };

    selfSS.addStudentDB = function (student) {
        var tempStudent = student;

        sgtData.addStudentData(student);

        selfSS.addStudentToArray(tempStudent);
    };

    selfSS.removeStudentDB = function (index) {
        var tempID = selfSS.studentArray[index].id;

        console.log('tempID: ', tempID);

        sgtData.deleteStudentData(tempID)
            .then(function (response) {
                console.log(response);

                selfSS.deleteStudentInArray(index);

                console.log('Current studentArray: ', selfSS.studentArray);
            }, function () {
                console.log('Error')
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