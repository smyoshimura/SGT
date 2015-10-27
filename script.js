/**
 * Define all global variables here
 */
var id_counter = generateStudentId();
/**
 * student_array - global array to hold student objects
 * @type {Array}
 */
var student_array = [];
/**
 * inputIds - id's of the elements that are used to add students
 * @type {string[]}
 */
// The Ids will be defined in the reset() function.
var inputIds = [];
/**
 * error_message - global object to hold error messages to be added to
 *  the DOM in case invalid data is entered when trying to add a new
 *  student
 * @type {{studentName: string, course: string, studentGrade: string}}
 */
var error_messages = [
    "Please enter a name for your new student.",
    "Please enter a course for your new student.",
    "Please enter a value between 0 and 100.",
    "error-message"
];
var INVALID_NAME = 0;
var INVALID_COURSE = 1;
var INVALID_GRADE = 2;
var ERROR_MESSAGE_CLASS_NAME = 3;

/**
 * addClicked - Event Handler when user clicks the add button
 */
function addClicked() {
    if (addStudent())
        updateData();
}
/**
 * cancelClicked - Event Handler when user clicks the cancel button, should clear out student form
 */
function cancelClicked() {
    clearAddStudentForm();
}
/**
 * addStudent - creates a student objects based on input fields in the form and adds the object to global student array
 *
 * @return boolean
 */
function addStudent() {
    console.log('test');
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

/**
 * generateStudentId - Closure function for generating student ID
 * @returns {generate}
 */
function generateStudentId()
{
    var student_id = 0;

    return function()
    {
        return student_id++;
    };
}

/**
 * checkForErrorsInForm - checks for any bad entries before adding a student,
 *  and adds any possible error messages to the DOM
 * @param studentObject
 * @returns {boolean}
 */
function checkForErrorsInForm(studentObject)
{
    var do_errors_exist = false;
    for (var data in studentObject)
    {
        // Check for bad student name
        if (data == inputIds[0])
        {
            if (studentObject[data].length == 0)
            {
                addErrorMessageToDom(INVALID_NAME);
                do_errors_exist = true;
            }
        }

        // Check for bad course
        if (data == inputIds[1])
        {
            if (studentObject[data].length == 0)
            {
                addErrorMessageToDom(INVALID_COURSE);
                do_errors_exist = true;
            }
        }

        // Check for bad grade
        if (data == inputIds[2])
        {
            if (studentObject[data] < 0 || studentObject[data] > 100)
            {
                addErrorMessageToDom(INVALID_GRADE);
                do_errors_exist = true;
            }
        }
    }
    return do_errors_exist;
}

/**
 * addErrorMessageToDom - adds an error message just below the text
 *  input that has the bad data
 * @param errorIndex
 */
function addErrorMessageToDom(errorIndex)
{
    var $target_div = $('#' + inputIds[errorIndex]).parent();
    var $error_message = $('<p>').text(error_messages[errorIndex]);
    $error_message.addClass(error_messages[ERROR_MESSAGE_CLASS_NAME]);
    $error_message.css(
        {
            color: 'red',
            margin: 'auto auto 0 1vw'
        });
    $target_div.append($error_message);
}
/**
 * removeErrorMessagesFromDom - removes any possibly existing error
 *  messages on the page
 */
function removeErrorMessagesFromDom()
{
    var to_remove = $('.' + error_messages[ERROR_MESSAGE_CLASS_NAME]);
    for (var i = 0; i < to_remove.length; i++)
        $(to_remove[i]).remove();
}


/**
 * clearAddStudentForm - clears out the form values based on inputIds variable
 *///Ryan
function clearAddStudentForm() {
    // Loop through the text inputs in the form,
    // and set their values to a blank string.
    for (var i in inputIds)
    {
        $('#' + inputIds[i]).val('');
    }
}
/**
 * calculateAverage - loop through the global student array and calculate average grade and return that value
 * @returns {number}
 *///Stefanie
function calculateAverage() {
    var total_grades = 0;
    var total_students = 0;
    for (i in student_array) {
        total_grades = total_grades + parseInt(student_array[i].studentGrade);
        ++total_students;
    }
    var average = Math.round(total_grades/total_students);

    if (isNaN(average)) {
        average = 0;
    }

    return average;
}
/**
 * updateData - centralized function to update the average and call student list update
 *///Ryan
function updateData() {
    $('.avgGrade').text(calculateAverage());
    updateStudentList();
}
/**
 * updateStudentList - loops through global student array and appends each objects data into the student-list-container > list-body
 *///Stefanie
function updateStudentList() {

    addStudentToDom(student_array[student_array.length - 1]);
}
/**
 * addStudentToDom - take in a student object, create html elements from the values and then append the elements
 * into the .student_list body
 * @param studentObj
 *///Ryan
function addStudentToDom(studentObj) {
    // This is the place where we will append the new student DOM object to
    var $student_table = $('.student-list>tbody');

    // This is the grandaddy container for all the student object data
    var $new_student = $('<tr>',
        {
            class: 'student-row'
        });
    studentObj.dom_elem = $($new_student);

    for (var i in inputIds)
    {
        $new_student.append($('<td>').text(studentObj[inputIds[i]]));
    }
    $new_student.append($('<td>').append($('<button>',
        {
            type: 'button',
            class: 'btn btn-danger btn-xs delete-student',
            onclick: 'deleteStudent(this.parentElement.parentElement)'
        }).text('Delete')));
    //adds unique id for deleting specific student object from array
    var temp_obj_id = studentObj.student_id;
    $new_student.attr("student_id", temp_obj_id);

    $student_table.append($new_student);
    clearAddStudentForm();
    removeUnavailableLabelFromDom();
}

/**
 * STUDENT-MADE FUNCTION
 * deleteStudent - calls functions for removing student from DOM and student_array
 */
//Stefanie
function deleteStudent(student_elem){
    removeStudentFromDom(student_elem);
    removeStudentFromArray(student_elem);
    updateData();
}

/**
 * STUDENT-MADE FUNCTION
 * TO BE AN EVENT-HANDLER ONLY!!!
 * removeStudentFromDom - Removes a student row from the page
 * @param student_elem - The top DOM container for the student to be removed.
 */
//Ryan
function removeStudentFromDom(student_elem)
{
    student_elem.remove(0);

    remaining_student_rows = $('.student-row');
    if (remaining_student_rows.length == 0)
        addUnavailableLabelToDom();
}

/**
* STUDENT-MADE FUNCTION
* removeStudentFromArray - removes relevant student object from array according to student_id
*/
//Stefanie
function removeStudentFromArray(student_elem) {
    var removal_id = $(student_elem).attr("student_id");

    delete student_array[removal_id];
}

/**
 * STUDENT-MADE FUNCTION
 * addUnavailableLabelToDom - Adds the "User Info Unavailable" label to the DOM.
 */
function addUnavailableLabelToDom()
{
    // Only add if it's not already in the DOM
    var label = document.getElementById('unavailable');
    if (label == null)
        $('div.student-list-container').append($('<h3>', {id: 'unavailable'}).append($('<b>').text('User Info Unavailable')));
}

/**
 * STUDENT-MADE FUNCTION
 * removeUnavailableLabelFromDom - Removes the "User Info Unavailable" label from the DOM
 */
function removeUnavailableLabelFromDom()
{
    var label = document.getElementById('unavailable');
    if (label != null)
        label.remove();
}
/**
 * reset - resets the application to initial state. Global variables reset, DOM get reset to initial load state
 *///Ryan
function reset() {
    // Empty out the table elements in the DOM
    addUnavailableLabelToDom();
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

document.addEventListener("DOMContentLoaded", function(event)
{
    reset();

    /*TEST CODE
     var student =
     {
     studentName: 'Amanda Huggenkis',
     course: 'pranking',
     studentGrade: '97'
     };
     addStudentToDom(student);
     TEST CODE*/
});