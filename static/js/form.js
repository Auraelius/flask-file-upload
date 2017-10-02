 // When the page loads, attach the event listener to the file input element
 let inputElement = document.getElementById("theFileInputField");
 inputElement.addEventListener("change", handleFiles, false);


 // define some helper functions
 function reportMsg(place, msg, error = false){
   if (error) {
     place.classList.add("error"); // style the feedback as an error
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
   if (aFileList.size > MAXFILESIZE) {
     feedbackMsg = "Please make your file less than " + MAXFILESIZE + " bytes";
     reportMsg(feedbackArea, feedbackMsg, asAnError);
     return true;
   }

   return false; // if we get here, it's all good
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

 // the event handler
 function handleFiles() {

   let feedbackMsg = "";
   let feedbackArea = document.getElementById("feedbackArea");
   let previewImage = document.getElementById("previewImage");   

   // Get the file field's value
   let fileList = this.files; // The "this" variable contains the element context in an event handler

   // Validate it (side-effects: updates DOM)
   if (isNotValid(fileList))  return false;

   // At this point, we have a single, small image. Let's put up a thumbnail &  display some feedback
   displayThumbnail(fileList[0]); // side-effects: updates DOM

   // enable the submit button
   document.getElementById("submitButton").disabled = false;
 }
