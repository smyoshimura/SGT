/**
 * Created by Stefanie on 11/8/2015.
 */

//School object

function School() {
    this.student_array = [];
    this.inputIds = [];

    this.addStudent = function () {
        removeErrorMessagesFromDom();
        var studentObject = {};

        for (var x in inputIds) {
            var id_temp = inputIds[x];
            var value = $('#' + id_temp).val();
            studentObject[id_temp] = value;
            console.log(studentObject);
        }
        if (checkForErrorsInForm(studentObject) == true)
            return false;

        studentObject.student_id = id_counter();

        student_array.push(studentObject);
        return true;
    }
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
        var to_remove = $('.' + error_messages[ERROR_MESSAGE_CLASS_NAME]);
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

}

//Misc Functions

/**
 * Listen for the document to load and reset the data to the initial state
 */

document.addEventListener("DOMContentLoaded", function (event) {
    reset();
    var firstSchool = new School();
    var errorChecker = new Errors();

    /**
     * addClicked - Event Handler when user clicks the add button
     */
    function addClicked() {
        if (firstSchool.addStudent())
            updateData();
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
});