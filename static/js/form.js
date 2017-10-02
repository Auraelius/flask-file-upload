// define some helper functions
function reportMsg(place, msg, error = false){
  if (error) {
    place.classList.add("errorMsg"); // style the feedback as an error
  } else {
    place.classList.remove("errorMsg");
  }
  place.innerHTML = msg;
  console.log(msg);
}

function isNotValid(aFileList){

  const asAnError = true; // syntax suger to make reportMsg() calls read a little better

  // validation standards
  let imageType = /^image\//; // regex for checking type
  const MAXFILESIZE=1000000; 

  // Clear feedback areas in case we are trying again
  feedbackArea.innerHTML = "";
  previewImage.innerHTML = "";
  feedbackArea.classList.remove("error"); // remove any error styling

  // The input element only allows one file, but this catches problems if the input element is changed.
  if(aFileList.length > 1){ 
    reportMsg(feedbackArea, "Please provide only one file.", asAnError);
    return true;
  }

  // next, validate the file type as one of our allowed types
  if (!imageType.test(aFileList[0].type)) {
    reportMsg(feedbackArea, "Please provide an image file.", asAnError);
    return true;
  }

  // validate as small enough to upload
  if (aFileList[0].size > MAXFILESIZE) {
    feedbackMsg = "Please make your file less than " + MAXFILESIZE + " bytes";
    reportMsg(feedbackArea, feedbackMsg, asAnError);
    return true;
  }

  return false; // if we get here, it's all good
}

function isValidEmail(str){
  let emailRegex = /\S+\@\S+\.\S+/;
  return emailRegex.test(str);
}

function displayValidFieldIcon(id){

  // TODO it would be better to be given the field and to traverse to the icon
  // rather than have to know the id of the icon

  let e = document.getElementById(id);
  
  // clear any previous image
  if (e.childNodes[0]) {
    e.removeChild(e.childNodes[0])
  }
  
  // create image element and add it 
  let img = document.createElement("img"); // make a new img element
  img.src = "/static/img/np_check-mark_30092_00B100.png";
  e.appendChild(img)
}

function displayInValidFieldIcon(id){
  let e = document.getElementById(id);
  if (e.childNodes[0]) {
    e.removeChild(e.childNodes[0])
  }
  let img = document.createElement("img"); // make a new img element
  img.src = "/static/img/np_warning_920565_FF0000.png";
  e.appendChild(img)

}

function displayThumbnail (theFile){
  // file size feedback
  feedbackMsg = " (" + theFile.type + ") " + theFile.size + " bytes";
  reportMsg(feedbackArea,feedbackMsg);
  
  // create thumbnail image element   
  let img = document.createElement("img"); // make a new img element
  img.classList.add("obj"); // set attributes appropriately
  img.file = theFile;
  previewImage.appendChild(img); // put the image element in the correct place

  // have the browser pull in the file and display the thumbnail image element
  // Note: this might require the browser to resize the image 
  var reader = new FileReader();
  reader.onload = (function(aImg) { return function(e) { aImg.src = e.target.result; }; })(img);
  reader.readAsDataURL(theFile);
}

function checkSubmitButton(){
  // enable the submit button only if the form is ready
  // TODO just iterate over the whole object and, if all are true, enable
  // this will remove maintenance dependency
  if ( theForm.firstNameIsValid &&  theForm.emailIsValid && theForm.imageIsValid  ){
    document.getElementById("submitButton").disabled = false;
  } else {
    document.getElementById("submitButton").disabled = true;
  }
}

// the event handlers

function handleFirstName() {
  // the first name must be present. If the field is cleared, invalidate
  let value = this.value;
  // let debugString = "firstName field changed to: " + value;
  // alert(debugString);
  if (value != "") {
    displayValidFieldIcon("firstNameFieldFeedback");
    theForm.firstNameIsValid = true; // this part of the form is OK
  } else {
    displayInValidFieldIcon("firstNameFieldFeedback");
    theForm.firstNameIsValid = false; // this part of the form is NOT ok
  }
  checkSubmitButton(); // if the whole form is ready, enable the submit button
}

function handleLastName() {
  // alert("Last Name Field Changed");
}

function handleEmail() {
  let value = this.value;
  // let debugString = "Email Name Field Changed to: " + value;
  // alert(debugString); 
  if (isValidEmail(value)) {
    displayValidFieldIcon("emailFieldFeedback");
    theForm.emailIsValid = true;
  } else {
    displayInValidFieldIcon("emailFieldFeedback");
    theForm.emailIsValid = false;
  }
  checkSubmitButton();
}
 
function handleFiles() {

  let feedbackMsg = "";
  let feedbackArea = document.getElementById("feedbackArea");
  let previewImage = document.getElementById("previewImage");   

  // Get the file field's value
  let fileList = this.files; // The "this" variable contains the element context in an event handler

  // Validate it (side-effects: updates DOM)
  if (isNotValid(fileList)) {
    displayInValidFieldIcon("fileFieldFeedback");
    return false;
  }  

  // At this point, we have a single, small image. Let's put up a thumbnail &  display some feedback
  displayThumbnail(fileList[0]); // side-effects: updates DOM

  // looks like we're ok
  // enable the submit button if the whole form is ready
  displayValidFieldIcon("fileFieldFeedback");
  theForm.imageIsValid = true;
  checkSubmitButton();
}

// Now that all our functions are defined
// Wait until the document is loaded before running our setup steps. 
// Use an immediate function to encapsulate our scope

(function() {
  // Setup is defining any objects this page needs and then
  // (since JS is enabled) disabling  the submit button until local validation completes
  // attaching event listener functions to key elements
  // All the work happens in the event listeners
  // Use an immediate function to limit out scope in case there are other scripts on this page

  // keep track of the form's validity.
  // used by checkSubmitButton()
  let theForm = {
    firstNameIsValid: false,
    emailIsValid: false,
    imageIsValid: false
  }

  // Since Js is enabled, let's disable to submit button until the
  // event handlers decide it's ok.
  document.getElementById("submitButton").disabled = true

  // Form validation event handlers

  // first name
  let e = document.getElementById("firstNameField");
  e.addEventListener("change", handleFirstName, false);

  // last name 
  // TODO Remove this if we don't use it
  e = document.getElementById("lastNameField");
  e.addEventListener("change", handleLastName, false);

  // email
  e = document.getElementById("emailField");
  e.addEventListener("change", handleEmail, false);

  // File input element
  e = document.getElementById("theFileInputField");
  e.addEventListener("change", handleFiles, false);

})();