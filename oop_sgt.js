/**
 * Created by Stefanie on 11/8/2015.
 */
var firstSchool = new School();
var errorChecker = new Errors();

//School
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
        errorChecker.removeErrorMessagesFromDom();

        var studentObject = {};

        for (var x in inputIds) {
            var id_temp = inputIds[x];
            var value = $('#' + id_temp).val();
            studentObject[id_temp] = value;
            console.log(studentObject);
        }

        if (errorChecker.checkForErrorsInForm(studentObject) == true)
            return false;

        studentObject.student_id = id_counter();

        student_array.push(studentObject);

        return true;
    };

    this.getStudentDB = function () {
        $.ajax({
            dataType: 'json',
            method: 'POST',
            url: 'http://s-apis.learningfuze.com/sgt/get',
            data: {api_key: 'amZ9Q5UEUU'},
            success: function (result) {
                console.log(result);
                for (var x in result.data) {
                    result.data[x].student_id = id_counter();
                    student_array.push(result.data[x]);
                    updateData();
                }
                console.log(student_array);
            }
        })
    };

    this.calculateAverage = function () {
        var total_grades = 0;
        var total_students = 0;
        for (i in student_array) {
            total_grades = total_grades + parseInt(student_array[i].grade);
            ++total_students;
        }
        var average = Math.round(total_grades / total_students);

        if (isNaN(average)) {
            average = 0;
        }

        return average;
    };

    this.updateStudentList = function () {
        this.addStudentToDom(student_array[student_array.length - 1]);
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

        for (var i in inputIds) {
            $new_student.append($('<td>').text(studentObj[inputIds[i]]));
        }

        // Event delegation for any future delete buttons being added
        $new_student.on('click', 'button.delete-student', function () {
            firstSchool.deleteStudent(studentObj.dom_elem);
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

    this.deleteStudent = function (student_elem) {
        this.removeStudentFromDom(student_elem);
        this.removeStudentFromArray(student_elem);
        $('.avgGrade').text(this.calculateAverage());
    };

    this.removeStudentFromDom= function (student_elem) {
        student_elem.remove(0);

        var remaining_student_rows = $('.student-row');
        if (remaining_student_rows.length == 0)
            errorChecker.addUnavailableLabelToDom();
    };

    this.removeStudentFromArray = function (student_elem) {
        var removal_id = $(student_elem).attr("student_id");

        delete student_array[removal_id];
    };
}

//Student
function Student() {

}

//Errors
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

//Misc Functions
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
    for (var i in inputIds) {
        $('#' + inputIds[i]).val('');
    }
}

/**
 * updateData - centralized function to update the average and call student list update
 *///Ryan
function updateData() {
    $('.avgGrade').text(firstSchool.calculateAverage());
    firstSchool.updateStudentList();
}

/**
 * reset - resets the application to initial state. Global variables reset, DOM get reset to initial load state
 *///Ryan
function reset() {
    // Empty out the table elements in the DOM
    errorChecker.addUnavailableLabelToDom();
    var $delete_buttons = $('.delete-student');
    for (var i = 0; i < $delete_buttons.length; i++)
        removeStudentFromDom($delete_buttons[i]);

    // Reset all global variables
    student_array = [];
    inputIds = [];

    // Set the inputIds array elements
    var $input_elems = $('.input-group>input[type=\"text\"], .input-group>input[type=\"number\"]');
    for (var i = 0; i < $input_elems.length; i++)
        inputIds.push($input_elems[i].getAttribute('id'));
}

/**
 * Listen for the document to load and reset the data to the initial state
 */
document.addEventListener("DOMContentLoaded", function (event) {
    reset();
});