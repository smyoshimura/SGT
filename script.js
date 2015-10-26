/**
 * Define all global variables here
 */

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
 * addClicked - Event Handler when user clicks the add button
 */
function addClicked() {
    console.log('test');
    addStudent();
    console.log('test');
    updateData();
    //calculateAverage();
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
 * @return undefined
 */
function addStudent() {
    console.log('test');
    var studentObject = {
        //entry_id: ""
        //name: "",
        //course: "",
        //grade: ""
    };

    for (var x in inputIds) {
        var id_temp = inputIds[x];
        var value = $('#' + id_temp).val();
        studentObject[id_temp] = value;
        console.log(studentObject);
    }
    student_array.push(studentObject);
    return
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
    /*loop through global student array
     * append each object's data */
    //loop through and for each run addStudentToDom according to index
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
    studentObj.dom_elem = $new_student;

    for (var i in inputIds)
    {
        $new_student.append($('<td>').text(studentObj[inputIds[i]]));
    }
    $new_student.append($('<td>').append($('<button>',
        {
            type: 'button',
            class: 'btn btn-danger btn-xs delete-student',
            onclick: 'removeStudentFromDom(this.parentElement.parentElement)'
        }).text('Delete')));

    $student_table.append($new_student);

    removeUnavailableLabelFromDom();
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