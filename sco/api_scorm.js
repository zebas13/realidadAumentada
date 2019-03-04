// JavaScript Document

var scormAPI = null;
var debug = false;
var isInitialized = false;
var lmsConnected = false;
var minValue=80;

//
// findAPI
//
function findAPI(win)
{
   var findAPITries = 0;

   while ((win.API == null) && (win.parent != null) && (win.parent != win))
   {
      findAPITries++;
     
      if (findAPITries > 500) 
      {
         alert("Busqueda finalizada.");
         return null;
      }
      
      win = win.parent;

   }
   
   APIWnd = win;
   return win.API;
}
//
// getAPI
//
function getAPI()
{
   scormAPI = findAPI(window);
   if ((scormAPI == null) && (window.opener != null) && (typeof(window.opener) != "undefined"))
   {
      if(!window.opener.closed)
	  {
		  scormAPI = findAPI(window.opener);
	  }
	  
	  if ((scormAPI == null) && (window.opener.opener != null) && (typeof(window.opener.opener) != "undefined"))
	  {
		  if(!window.opener.opener.closed)
		  {
			  scormAPI = findAPI(window.opener.opener);
		  }
	   }
     
   }

   if (scormAPI == null)
   {
		return false;
   }
   return true;
}
//
// lmsCall
//




function lmsCall(fname, datamodel, value){
	var respond = "";
	var info = "";
	if(debug)info += "lmsCall(" + fname + "," + datamodel + "," + value + ");";
	if(scormAPI){
		switch(fname){
			case "Initialize":
			 respond = scormAPI.LMSInitialize("");
			 if(respond)isInitialized = true;
			 break;
			 case "Finish":
			 respond = scormAPI.LMSFinish("");
			 if(respond)isInitialized = false;
			 break;
			 case "GetValue":
			 respond = scormAPI.LMSGetValue(datamodel);
			 break;
			 case "SetValue":
			 respond = scormAPI.LMSSetValue(datamodel, value);
			 break;
			 case "Commit":
			 respond = scormAPI.LMSCommit("");
			 break;
			 case "GetLastError":
			 respond = scormAPI.LMSGetLastError();
			 break;
			 case "GetErrorString":
			 respond = scormAPI.LMSGetErrorString(value);
			 break;
			 case "GetDiagnostic":
			 respond = scormAPI.LMSGetDiagnostic(value);
			 break;
		}
	}
	if(debug)alert(info + "\nResult: " + respond);
	return respond;
}
//
//
// unloadHandler
//
function unloadHandler(){
	if(isInitialized){
		lmsCall("Finish");
	}
}



function initCourse()
{
    if(getAPI()){
        lmsConnected = lmsCall("Initialize");
    }
    
   if(lmsConnected)
   {
      var completionstatus = lmsCall("GetValue","cmi.core.lesson_status");
      if(completionstatus === "not attempted" || completionstatus === "unknown")
	  {
            setSuspend(" ");
            setLocation(" ");
            setIncomplete();
            lmsCall("Commit");             
            setExit();
		  
	  	  
      }
	else if (completionstatus === "incomplete")
	{
		var locationTemp=getLocation();
        var suspendTemp=getSuspend();
	}
   
    return true;
    } else {
    }
   
}



function redirectFunction(element){  
	gotoPage(element);
}


function setQuit()
{
    lmsCall("Commit");  
    lmsCall("Finish");  	
}

function setSuspend(value){
   if(lmsConnected){
      var success =  lmsCall("SetValue","cmi.suspend_data", ""+value+"");
      if(!success){

      }

   } else 
   {
         //alert("Error: El curso perdio comunicacion con el LMS");
   
   }

}

function setExit(){};

function setComplete(){
   if(lmsConnected){
      var success = lmsCall("SetValue","cmi.core.lesson_status", "completed");
	  lmsCall("Commit"); 
      if(!success){
   
      }

   } else 
   {
        // alert("Error: El curso perdio comunicacion con el LMS");
   
   }

}

function setTimeSession(element)
{
   if(lmsConnected)
   {
      var success = lmsCall("SetValue","cmi.core.session_time", ""+element+"");
      if(!success){
         //alert("Error: Course could not be set to time!");
   
      }

   } else 
   {
         //alert("Error: El curso perdio comunicacion con el LMS");
   
   }

}


function setLocation(element)
{
   if(lmsConnected)
   {
      var success = lmsCall("SetValue","cmi.core.lesson_location", ""+element+"");
	 lmsCall("Commit"); 
      if(!success){
    
      }

   } else 
   {
       //alert("Error: El curso perdio comunicacion con el LMS");
   
   }

}

function setScore(element)
{
   if(lmsConnected)
   {
      var success = lmsCall("SetValue","cmi.core.score.raw", ""+element+"");
	 				//scorm.set("cmi.score.scaled",""+Number(Number(element)/100)+"");
   if(element<minValue)
   {
	   lmsCall("SetValue","cmi.core.lesson_status","failed");
   }
   else
   {
	   lmsCall("SetValue","cmi.core.lesson_status","passed");
   }
	  lmsCall("Commit");
      if(!success){
   
      }

   } else 
   {
         //alert("Error: El curso perdio comunicacion con el LMS");
   
   }

}


function getLocation()
{
   if(lmsConnected)
   {
      var success = lmsCall("GetValue","cmi.core.lesson_location");
      if(!success){

      }

   } else 
   {
         //alert("Error: El curso perdio comunicacion con el LMS");
   
   }
	return success;

}


function getSuspend()
{

      var success = lmsCall("GetValue","cmi.suspend_data");
      if(!success){
   
      }

	return success;

}

function setIncomplete()
{
   if(lmsConnected)
   {
       
         var completionstatus = lmsCall("GetValue","cmi.core.lesson_status");
       //alert(completionstatus);
      var success = lmsCall("SetValue","cmi.core.lesson_status", "incomplete");
      if(!success){
   
      }

   } else 
   {
         alert("Error: El curso perdio comunicacion con el LMS");
   
   }

}