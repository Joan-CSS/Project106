var isItImportant = false;
var serverUrl = "http://fsdi.azurewebsites.net/api";

function toggleImportant() {
  console.log("icon clicked!");
  if (isItImportant) {
    //change to non important
    isItImportant = false;
    $("#iImportant").removeClass("fas").addClass("far");
  } else {
    //change to important
    isItImportant = true;
    $("#iImportant").removeClass("far").addClass("fas");
  }
}

function saveTask() {
  console.log("saving!!");

  //get the values from the controls 
  let title =$("#txtTitle").val();
  let desc =$("#txtDesc").val();
  let location =$("#txtLocation").val();
  let dueDate =$("#txtDuedate").val();
  let alert =$("#selAlert").val();


  // create an objet
  let theTask = new Task(title,desc,isItImportant,dueDate,alert,location);

  //console log the objet 
  console.log(theTask);
  


// send task to server
$.ajax({
  url: serverUrl + '/tasks',
  type: 'POST',
  data: JSON.stringify(theTask),
  contentType: "application/json",
  success:function(res){
    console.log("server says",res );
    
    displayTask(res);
  },
  error: function(error){
    console.error("Error saving", error);
  }
 });

}

function displayTask(task) {
let alert = "";
  switch(task.alertText) {
    case "1": 
      alert = "Don't Forget to:";
      break;    
    case "2":
      alert = "Stop:";
      break;    
    case "3":
      alert = "Start:";
      break;    
    case "4":
      alert = "Get more coffee:";
      break;
  }

  let syntax = `<div class="task">  
    <div class="sec-1">${alert}</div>
    <i id="iDelete" onclick="deleteTask(${task.id})" class="far fa-trash-alt"></i>
    <div class="sec-2">
      
      <div class="sec-title">
        <h5>${task.title}</h5>  
        <p>${task.description}</p>
      </div>

      <div class="sec-date">
        <label>${task.dueDate}</label>
      </div>

      <div class="sec-location">
        <label>${task.location}</label>
      </div>

    </div>
  </div>` ;

 $("#tasksContainer").append(syntax);
}

function deleteTask(id){
  console.log("deleting the task: " + id);

  $.ajax({
    url: serverUrl + '/tasks/' + id,
    type:"DELETE",
    success: function() {
      console.log("Task removed from server"); 
    },
    error: function(details) {
      console.log(" Error Removing", details);
    }
  });
}

function retrieveTask() {
  $.ajax({
    url: serverUrl + '/tasks',
    type:"GET",
    success:function(list){
      console.log("Retrieved", list);
    
      for(let i=0; i< list.length; i++){
        let task = list [i];
        if(task.user === "AntonioEnciso"){
          displayTask(task);
        }
      }
    },
    error: function(err){
      console.error("Error reading", err);
    }
  });
}

function init(){
  console.log(" Task Manager ");

  // load data
  retrieveTask();
  
  // hook events
  $("#iTimportant").click(toggleImportant);
  $("#btnSave").click(saveTask);
  $("#btnDetails").click(function(){
     $("#details").toggle();
  });
}

window.onload = init;

function testRequest(){
  $.ajax({
    url:"https://restclass.azurewebsites.net/api/test",
    type:'GET',
    success: function(res){
      console.log("Server Says ",res);
    },
    error:function(errorDet){
      console.error("Error on req", errorDet);
    }
  });
}