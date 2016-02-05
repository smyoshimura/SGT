/**
 * Created by Stefanie on 11/8/2015.
 */
var firstSchool = new School();
var errorChecker = new Errors();

//School - holds most functions for managing students - adding/removing from dom and database
function School() {
    var self = this;

    self.student_array = [];
    self.inputIds = [];

    self.generateStudentId = function () {
        var student_id = 0;

        return function () {
            return student_id++;
        };
    };

    var id_counter = self.generateStudentId();

    self.addStudent = function () {
        //errorChecker.removeErrorMessagesFromDom();

        var newStudent = new Student(self);

        newStudent.getFormInputs();

        //if (errorChecker.checkForErrorsInForm(newStudent) == true)
        //    return false;

        newStudent.student_id = id_counter();

        self.addStudentToDB(newStudent);

        self.student_array.push(newStudent);

        self.updateStudentList();

        updateData(self);

        console.log('Array after form add:', self.student_array);

        return true;
    };

    self.getStudentDB = function () {
        $.ajax({
            dataType: 'json',
            method: 'POST',
            url: 'http://s-apis.learningfuze.com/sgt/get',
            data: {api_key: 'amZ9Q5UEUU'},

            success: function (result) {

                console.log('Ajax call result:', result);

                //Converts each student from database into an instance of the Student class
                for (var x in result.data) {
                    var dbStudent = new Student(self);
                    dbStudent.student_id = id_counter();
                    dbStudent.name = result.data[x].name;
                    dbStudent.course = result.data[x].course;
                    dbStudent.grade = result.data[x].grade;
                    dbStudent.db_id = result.data[x].id;
                    self.student_array.push(dbStudent);
                    self.updateStudentList();
                }

                updateData(self);

                console.log('Array after call:', self.student_array);
            }
        })
    };

    self.addStudentToDB = function (studentObject) {
        $.ajax({
            dataType: 'json',
            method: 'POST',
            url: 'http://s-apis.learningfuze.com/sgt/create',
            data: {
                api_key: 'amZ9Q5UEUU',
                name: studentObject.name,
                course: studentObject.course,
                grade: studentObject.grade
            },

            success: function (result) {

                console.log(result);

                //Grabs the new database id and add into the Student object
                studentObject.db_id = result.new_id;
            }
        })
    };

    self.calculateAverage = function () {
        var total_grades = 0;
        var total_students = 0;

        for (var i in self.student_array) {
            if (self.student_array[i] === null) {
                continue
            }
            total_grades = total_grades + parseInt(self.student_array[i].grade);
            ++total_students;
        }

        var average = Math.round(total_grades / total_students);

        if (isNaN(average)) {
            average = 0;
        }

        return average;
    };

    self.updateStudentList = function () {

        self.addStudentToDom(self.student_array[self.student_array.length - 1]);

    };

    self.addStudentToDom = function (studentObj) {
        // This is the place where we will append the new student DOM object to
        var $student_table = $('.student-list>tbody');

        // This is the grandaddy container for all the student object data
        var $new_student = $('<tr>',
            {
                class: 'student-row'
            });

        if (studentObj === null) {
            return
        }

        studentObj.dom_elem = $($new_student);

        for (var i in self.inputIds) {
            $new_student.append($('<td>').text(studentObj[self.inputIds[i]]));
        }

        // Event delegation for any future delete buttons being added
        $new_student.on('click', 'button.delete-student', function () {
            self.deleteStudent(studentObj.dom_elem, studentObj.db_id);
        });

        var delete_button = $('<button>',
            {
                type: 'button',
                class: 'btn btn-danger btn-xs delete-student'
            }).text('Delete');

        $new_student.append($('<td>').append(delete_button));

        //adds unique id for deleting specific student object from array
        var temp_obj_id = studentObj.student_id;
        $new_student.attr("student_id", temp_obj_id);

        $student_table.append($new_student);
        clearAddStudentForm(self);
        errorChecker.removeUnavailableLabelFromDom();
    };

    self.deleteStudent = function (student_elem, student_id) {
        self.removeStudentFromDom(student_elem);
        self.removeStudentFromArray(student_elem);
        self.removeStudentFromDB(student_id);

        updateLocalStorage(self);

        $('.avgGrade').text(self.calculateAverage());
    };

    self.removeStudentFromDom = function (student_elem) {
        student_elem.remove();

        var remaining_student_rows = $('.student-row');
        if (remaining_student_rows.length == 0)
            errorChecker.addUnavailableLabelToDom();
    };

    self.removeStudentFromDB = function (student_id) {
        $.ajax({
            dataType: 'json',
            method: 'POST',
            url: 'http://s-apis.learningfuze.com/sgt/delete',
            data: {api_key: 'amZ9Q5UEUU', student_id: student_id},

            success: function (result) {
                console.log(result);
            }
        })
    };

    self.removeStudentFromArray = function (student_elem) {
        var removal_id = $(student_elem).attr("student_id");

        delete self.student_array[removal_id];
    };

    self.checkForMaxGrade = function () {
        var maxGrade = null;

        //Find highest possible grade among students
        for (var i in self.student_array) {
            if (self.student_array[i] === null) {
                continue
            }
            if (maxGrade == null || maxGrade < self.student_array[i].grade) {
                maxGrade = self.student_array[i].grade;
            }
        }

        //Highlights all students with matching maximum grade
        for (i in self.student_array) {
            if (self.student_array[i] === null) {
                continue
            }
            if (maxGrade == self.student_array[i].grade) {
                $(self.student_array[i].dom_elem).addClass('success');
            }
        }
    };

    self.checkForMinGrade = function () {
        var minGrade = null;

        //Find lowest possible grade among students
        for (var i in self.student_array) {
            if (self.student_array[i] === null) {
                continue
            }
            if (minGrade == null || minGrade > self.student_array[i].grade) {
                minGrade = self.student_array[i].grade;
            }
        }

        //Highlights all students with matching minimum grade
        for (i in self.student_array) {
            if (self.student_array[i] === null) {
                continue
        }
            if (minGrade == self.student_array[i].grade) {
                $(self.student_array[i].dom_elem).addClass('danger');
            }
        }
    };
};

//Student - holds student info and grabs values from the form for filling properties
function Student(school) {
    var self = this;

    self.name = name;
    self.course = course;
    self.grade = grade;
    self.student_id = student_id;
    self.db_id = db_id;

    self.getFormInputs = function () {
        for (var x in school.inputIds) {
            var id_temp = school.inputIds[x];
            var value = $('#' + id_temp).val();
            self[id_temp] = value;
        }
    };
}

//Errors - holds error checking and tracking if info is listed in the dom
function Errors() {
    var self = this;

    this.error_messages = [
        "Please enter a name for your new student.",
        "Please enter a course for your new student.",
        "Please enter a value between 0 and 100.",
        "error-message"
    ];

    self.INVALID_NAME = 0;
    self.INVALID_COURSE = 1;
    self.INVALID_GRADE = 2;
    self.ERROR_MESSAGE_CLASS_NAME = 3;

    self.removeErrorMessagesFromDom = function () {
        var to_remove = $('.' + self.error_messages[self.ERROR_MESSAGE_CLASS_NAME]);
        for (var i = 0; i < to_remove.length; i++)
            $(to_remove[i]).remove();
    };

    self.addUnavailableLabelToDom = function () {
        // Only add if it's not already in the DOM
        var label = document.getElementById('unavailable');
        if (label == null)
            $('div.student-list-container').append($('<h3>', {id: 'unavailable'}).append($('<b>').text('User Info Unavailable')));
    };

    self.removeUnavailableLabelFromDom = function () {
        var label = document.getElementById('unavailable');
        if (label != null)
            label.remove();
    };

    self.checkForErrorsInForm = function (studentObject) {
        var do_errors_exist = false;
        for (var data in studentObject) {
            // Check for bad student name
            if (data == inputIds[0]) {
                if (studentObject[data].length == 0) {
                    addErrorMessageToDom(INVALID_NAME);
                    do_errors_exist = true;
                }
            }

            // Check for bad course
            if (data == inputIds[1]) {
                if (studentObject[data].length == 0) {
                    addErrorMessageToDom(INVALID_COURSE);
                    do_errors_exist = true;
                }
            }

            // Check for bad grade
            if (data == inputIds[2]) {
                if (studentObject[data] < 0 || studentObject[data] > 100) {
                    addErrorMessageToDom(INVALID_GRADE);
                    do_errors_exist = true;
                }
            }
        }
        return do_errors_exist;
    }
}

//Misc Functions - functions that don't currently fit into either the School or Student classes
/**
 * updateLocalStorage - copies student_array to localStorage
 */
function updateLocalStorage(school) {
    localStorage.setItem('student_arry', '');

    localStorage.setItem('student_array', JSON.stringify(school.student_array));
}

/**
 * retrieveLocalStorage - retrieves data from localStorage and copies to student_array
 */
function retrieveLocalStorage(school) {
    var tempStorage = localStorage.getItem('student_array');

    school.student_array = JSON.parse(tempStorage);

    for (var i in school.student_array) {
        school.addStudentToDom(school.student_array[i]);
    }
}

/**
 * addClicked - Event Handler when user clicks the add button
 */
function addClicked(school) {
    if (school.addStudent())
        updateData(school);
}

/**
 * dbClicked - Event Handler when user clicks the populate from DB button
 */
function dbClicked(school) {
    school.getStudentDB();
}

/**
 * cancelClicked - Event Handler when user clicks the cancel button, should clear out student form
 */
function cancelClicked(school) {
    clearAddStudentForm(school);
}

/**
 * clearAddStudentForm - clears out the form values based on inputIds variable
 *///Ryan
function clearAddStudentForm(school) {
    // Loop through the text inputs in the form,
    // and set their values to a blank string.
    for (var i in school.inputIds) {
        $('#' + school.inputIds[i]).val('');
    }
}

/**
 * updateData - centralized function to update the average and call student list update
 *///Ryan
function updateData(school) {
    $('.avgGrade').text(school.calculateAverage());

    school.checkForMaxGrade();
    school.checkForMinGrade();

    updateLocalStorage(school);
}

/**
 * reset - resets the application to initial state. Global variables reset, DOM get reset to initial load state
 *///Ryan
function reset(school) {
    // Empty out the table elements in the DOM
    errorChecker.addUnavailableLabelToDom();
    var $delete_buttons = $('.delete-student');
    for (var i = 0; i < $delete_buttons.length; i++)
        school.removeStudentFromDom($delete_buttons[i]);

    // Set the inputIds array elements
    var $input_elems = $('.input-group>input[type=\"text\"], .input-group>input[type=\"number\"]');
    for (var i = 0; i < $input_elems.length; i++)
        school.inputIds.push($input_elems[i].getAttribute('id'));
}
/**
 * Bring up loading spinner when waiting for AJAX calls
 */
var $body;

$(document).on({
    ajaxStart: function () {
        console.log('ajaxstart');
        $body.addClass("loading");
    },

    ajaxStop: function () {
        console.log('ajaxstop');
        $body.removeClass("loading");
    }
});

/**
 * Listen for the document to load and reset the data to the initial state
 */
document.addEventListener("DOMContentLoaded", function (event) {
    $body = $('body');

    reset(firstSchool);

    retrieveLocalStorage(firstSchool);

    updateData(firstSchool);
});