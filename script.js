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
var inputIds = ['studentName', 'course', 'studentGrade'];
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
    var temp = studentName;

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
 */
function clearAddStudentForm() {

}
/**
 * calculateAverage - loop through the global student array and calculate average grade and return that value
 * @returns {number}
 */
function calculateAverage() {

    return
}
/**
 * updateData - centralized function to update the average and call student list update
 */
function updateData() {
    updateStudentList();
    calculateAverage();
}
/**
 * updateStudentList - loops through global student array and appends each objects data into the student-list-container > list-body
 */
function updateStudentList() {
    /*loop through global student array
     * append each object's data */
    addStudentToDom(student_array[0]);
}
/**
 * addStudentToDom - take in a student object, create html elements from the values and then append the elements
 * into the .student_list body
 * @param studentObj
 */
function addStudentToDom(studentObj) {

    // This is the place where we will append the new student DOM object to
    var $student_table = $('.student-list>tbody');

    // This is the grandaddy container for all the student object data
    var $new_student = $('<tr>');
    studentObj.dom_elem = $new_student;

    for (var i in inputIds)
    {
        $new_student.append($('<td>').text(studentObj[inputIds[i]]));
    }
    $new_student.append($('<td>').append($('<button>',
        {
            type: 'button',
            class: 'btn btn-danger btn-xs',
            onclick: 'deleteEntry(this)'
        }).text('Delete')));

    $student_table.append($new_student);
}
function deleteEntry(button)
{
    button.parentElement.parentElement.remove(0);
}
/**
 * reset - resets the application to initial state. Global variables reset, DOM get reset to initial load state
 */
function reset() {
    student_array = [];
    $('div.student-list-container').append($('<h3>', {id: 'unavailable'}).append($('<b>').text('User Info Unavailable')));
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