/**
 * Created by Stefanie on 11/8/2015.
 */
var firstSchool = new School();
var errorChecker = new Errors();

//School - holds most functions for managing students - adding/removing from dom and database
function School() {
    this.student_array = [];
    this.inputIds = [];

    this.generateStudentId = function () {
        var student_id = 0;

        return function () {
            return student_id++;
        };
    };

    var id_counter = this.generateStudentId();

    this.addStudent = function () {
        //errorChecker.removeErrorMessagesFromDom();

        var newStudent = new Student();

        newStudent.getFormInputs();

        //if (errorChecker.checkForErrorsInForm(newStudent) == true)
        //    return false;

        newStudent.student_id = id_counter();

        this.addStudentToDB(newStudent);

        this.student_array.push(newStudent);

        this.updateStudentList();

        updateData();

        console.log('Array after form add:', this.student_array);

        return true;
    };

    this.getStudentDB = function () {
        $.ajax({
            dataType: 'json',
            method: 'POST',
            url: 'http://s-apis.learningfuze.com/sgt/get',
            data: {api_key: 'amZ9Q5UEUU'},

            success: function (result) {

                console.log('Ajax call result:', result);

                //Converts each student from database into an instance of the Student class
                for (var x in result.data) {
                    var dbStudent = new Student();
                    dbStudent.student_id = id_counter();
                    dbStudent.name = result.data[x].name;
                    dbStudent.course = result.data[x].course;
                    dbStudent.grade = result.data[x].grade;
                    dbStudent.db_id = result.data[x].id;
                    firstSchool.student_array.push(dbStudent);
                    firstSchool.updateStudentList();
                }

                updateData();

                console.log('Array after call:', firstSchool.student_array);
            }
        })
    };

    this.addStudentToDB = function (studentObject) {
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

    this.calculateAverage = function () {
        var total_grades = 0;
        var total_students = 0;

        for (var i in firstSchool.student_array) {
            total_grades = total_grades + parseInt(firstSchool.student_array[i].grade);
            ++total_students;
        }

        var average = Math.round(total_grades / total_students);

        if (isNaN(average)) {
            average = 0;
        }

        return average;
    };

    this.updateStudentList = function () {

        this.addStudentToDom(firstSchool.student_array[firstSchool.student_array.length - 1]);

    };

    this.addStudentToDom = function (studentObj) {
        // This is the place where we will append the new student DOM object to
        var $student_table = $('.student-list>tbody');

        // This is the grandaddy container for all the student object data
        var $new_student = $('<tr>',
            {
                class: 'student-row'
            });
        studentObj.dom_elem = $($new_student);

        for (var i in firstSchool.inputIds) {
            $new_student.append($('<td>').text(studentObj[firstSchool.inputIds[i]]));
        }

        // Event delegation for any future delete buttons being added
        $new_student.on('click', 'button.delete-student', function () {
            firstSchool.deleteStudent(studentObj.dom_elem, studentObj.db_id);
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
        clearAddStudentForm();
        errorChecker.removeUnavailableLabelFromDom();
    };

    this.deleteStudent = function (student_elem, student_id) {
        this.removeStudentFromDom(student_elem);
        this.removeStudentFromArray(student_elem);
        this.removeStudentFromDB(student_id);

        $('.avgGrade').text(this.calculateAverage());
    };

    this.removeStudentFromDom = function (student_elem) {
        student_elem.remove();

        var remaining_student_rows = $('.student-row');
        if (remaining_student_rows.length == 0)
            errorChecker.addUnavailableLabelToDom();
    };

    this.removeStudentFromDB = function (student_id) {
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

    this.removeStudentFromArray = function (student_elem) {
        var removal_id = $(student_elem).attr("student_id");

        delete this.student_array[removal_id];
    };

    this.checkForMaxGrade = function () {
        var maxGrade = null;

        //Find highest possible grade among students
        for (var i in this.student_array) {
            if (maxGrade == null || maxGrade < this.student_array[i].grade) {
                maxGrade = this.student_array[i].grade;
            }
        }

        //Highlights all students with matching maximum grade
        for (i in this.student_array) {
            if (maxGrade == this.student_array[i].grade) {
                $(this.student_array[i].dom_elem).addClass('success');
            }
        }
    };

    this.checkForMinGrade = function () {
        var minGrade = null;

        //Find lowest possible grade among students
        for (var i in this.student_array) {
            if (minGrade == null || minGrade > this.student_array[i].grade) {
                minGrade = this.student_array[i].grade;
            }
        }

        //Highlights all students with matching minimum grade
        for (i in this.student_array) {
            if (minGrade == this.student_array[i].grade) {
                $(this.student_array[i].dom_elem).addClass('danger');
            }
        }
    };
}

//Student - holds student info and grabs values from the form for filling properties
function Student(name, course, grade, student_id, db_id) {
    this.name = name;
    this.course = course;
    this.grade = grade;
    this.student_id = student_id;
    this.db_id = db_id;

    this.getFormInputs = function () {
        for (var x in firstSchool.inputIds) {
            var id_temp = firstSchool.inputIds[x];
            var value = $('#' + id_temp).val();
            this[id_temp] = value;
        }
    };
}

//Errors - holds error checking and tracking if info is listed in the dom
function Errors() {
    this.error_messages = [
        "Please enter a name for your new student.",
        "Please enter a course for your new student.",
        "Please enter a value between 0 and 100.",
        "error-message"
    ];

    this.INVALID_NAME = 0;
    this.INVALID_COURSE = 1;
    this.INVALID_GRADE = 2;
    this.ERROR_MESSAGE_CLASS_NAME = 3;

    this.removeErrorMessagesFromDom = function () {
        var to_remove = $('.' + this.error_messages[this.ERROR_MESSAGE_CLASS_NAME]);
        for (var i = 0; i < to_remove.length; i++)
            $(to_remove[i]).remove();
    };

    this.addUnavailableLabelToDom = function () {
        // Only add if it's not already in the DOM
        var label = document.getElementById('unavailable');
        if (label == null)
            $('div.student-list-container').append($('<h3>', {id: 'unavailable'}).append($('<b>').text('User Info Unavailable')));
    };

    this.removeUnavailableLabelFromDom = function () {
        var label = document.getElementById('unavailable');
        if (label != null)
            label.remove();
    };

    this.checkForErrorsInForm = function (studentObject) {
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
 * addClicked - Event Handler when user clicks the add button
 */
function addClicked() {
    if (firstSchool.addStudent())
        updateData();
}

/**
 * dbClicked - Event Handler when user clicks the populate from DB button
 */
function dbClicked() {
    firstSchool.getStudentDB();
}

/**
 * cancelClicked - Event Handler when user clicks the cancel button, should clear out student form
 */
function cancelClicked() {
    clearAddStudentForm();
}

/**
 * clearAddStudentForm - clears out the form values based on inputIds variable
 *///Ryan
function clearAddStudentForm() {
    // Loop through the text inputs in the form,
    // and set their values to a blank string.
    for (var i in firstSchool.inputIds) {
        $('#' + firstSchool.inputIds[i]).val('');
    }
}

/**
 * updateData - centralized function to update the average and call student list update
 *///Ryan
function updateData() {
    $('.avgGrade').text(firstSchool.calculateAverage());

    firstSchool.checkForMaxGrade();
    firstSchool.checkForMinGrade();
}

/**
 * reset - resets the application to initial state. Global variables reset, DOM get reset to initial load state
 *///Ryan
function reset() {
    // Empty out the table elements in the DOM
    errorChecker.addUnavailableLabelToDom();
    var $delete_buttons = $('.delete-student');
    for (var i = 0; i < $delete_buttons.length; i++)
        firstSchool.removeStudentFromDom($delete_buttons[i]);

    // Set the inputIds array elements
    var $input_elems = $('.input-group>input[type=\"text\"], .input-group>input[type=\"number\"]');
    for (var i = 0; i < $input_elems.length; i++)
        firstSchool.inputIds.push($input_elems[i].getAttribute('id'));
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

    reset();

    dbClicked();
});