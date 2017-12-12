var trainScheduleFull=[];
var count=0;
var HH; //Hours 
var MM; //Minutes
var editDeleteItem; // this will store the name of the item that is being deleted or edited 
var validKeys=[48,49,50,51,52,53,54,55,56,57];
var y;
// Initialize Firebase
var config = {
apiKey: "AIzaSyAJ5VZIm-AJdQprYcJ_umBRJShXJlsgYyg",
authDomain: "trainscheduler-bf637.firebaseapp.com",
databaseURL: "https://trainscheduler-bf637.firebaseio.com",
projectId: "trainscheduler-bf637",
storageBucket: "",
messagingSenderId: "539309675661"
};
firebase.initializeApp(config);

// Create a variable to reference the database.
var database = firebase.database();

database.ref().on("value", function(snapshot) {

	console.log("im here waiting to be fixed");
	y = Object.values(snapshot.val());
	console.log("console.log this: " +y);
	y= Object.values(y[0]);
	minutesLeftUpdater(y); // IMPORTANT when updating the database values inside "value" callback, use a function to update the values to prevent a Callback Hell
	var yLength = y.length;
	$("#trains").html("");
	for (var i=0; i< yLength;i++)
	{
		console.log(y[i]); // accessing properties in object
		console.log(yLength); // accessing length of object
		//$("#trains").append('<tr class="table-light" id=item'+ i +' >');
		//$("#item" + i).append('<th scope="row">'+ i +'</th>');
		console.log("building 1" + i)
		for (var j=0; j< 5; j++) // -3 BECAUSE ARRAY HAS 7 INDEXED ITEMS AND WE WANT TO READ ONLY 4
		{
			console.log("here" + Object.values(y[i])[j]);// access values in deeper array

		//		$("#item" + i).append('<td>'+Object.values(y[i])[j]+ '</td>');
		}

	}
updateHtmlTimeLeft(y);
setInterval(function(){minutesLeftUpdater(y);}, 60000);

});
//=========================================Minutes Left Update ==========================//
function minutesLeftUpdater(x){
	console.log("UPDATING....");
	var xLength = x.length;
	$("#trains").html("");
	for (var i=0; i< xLength;i++)
	{
		console.log(x[i]); // accessing properties in object
		console.log(xLength); // accessing length of object
		console.log("building 3" + i)
		for (var j=0; j< 5; j++) // -3 BECAUSE ARRAY HAS 7 INDEXED ITEMS AND WE WANT TO READ ONLY 4
		{
			console.log("here" + Object.values(x[i])[j]);// access values in deeper array
			if (j === 4)
			{
				var [nextArrival,minutesLeft] = timeLeft(Object.values(x[i])[5], Object.values(x[i])[6], Object.values(x[i])[2]);
				console.log(nextArrival);
				database.ref("trainSchedule/" + Object.values(x[i])[0]).update({dArrival:nextArrival,eMinutesLeft:minutesLeft, });
			}else
			{
			}
		}

	}
	updateHtmlTimeLeft(x);
}

function updateHtmlTimeLeft(x)
{
	console.log("UPDATING..HTML");
	var xLength = x.length;
	$("#trains").html("");
	for (var i=0; i< xLength;i++)
	{
		console.log(x[i]); // accessing properties in object
		console.log(xLength); // accessing length of object
		console.log("building 2" + i)
		$("#trains").append('<tr class="table-light" id=item'+ i +' >');
		$("#item" + i).append('<th scope="row"><a href="#" id="deletes' + i + '"><img src="assets/img/glyphicons-17-bin.png" alt=""></a><a href="#" id="edits' + i + '"><img src="assets/img/glyphicons-31-pencil.png" alt=""></a>' +'</th>');
		for (var j=0; j< 5; j++) // -3 BECAUSE ARRAY HAS 7 INDEXED ITEMS AND WE WANT TO READ ONLY 4
		{
			console.log("here" + Object.values(x[i])[j]);// access values in deeper array
				$("#item" + i).append('<td>'+Object.values(x[i])[j]+ '</td>');
		}

	}
}

//=========================================Dynamically create the dropdown menu items for the time ==========================//
function createDropDownMenu()
{
	// create the hours dropdown menu and assign classes hours0 hours1 etc..
	for (var i=0; i< 24 ; i++)
	{
		if (i < 10)
		{
		$("#hours").append('<a class="dropdown-item" href="#" id="' + "hours" + i +  '">0' + i + '</a>');
		} else
		{
		$("#hours").append('<a class="dropdown-item" href="#" id="' + "hours" + i +  '">' + i + '</a>');
		}
	}
	// create the hours dropdown menu and assign classes minutes0 minutes1 etc..
	for (var i=0; i<60 ; i++)
	{
		if (i < 10)
		{
		$("#minutes").append('<a class="dropdown-item" href="#" id="' + "minutes" + i +  '">0' + i + '</a>');
		} else
		{
		$("#minutes").append('<a class="dropdown-item" href="#" id="' + "minutes" + i +  '">' + i + '</a>');
		}
	}
	// COMMENTED THIS OUT, IN THE FUTURE MIGHT NEED THIS FUNCTION TO USE AM AND PM
	// $("#ampm").append('<a class="dropdown-item" href="#" id="am">am</a>');

	// $("#ampm").append('<a class="dropdown-item" href="#" id="pm">pm</a>');
}


//======================================================//


//=========================================Dynamically change the time button ==========================//
function setTime(whichButton, XX)
{
	console.log(XX);
	if (XX < 10)
	{
		$(whichButton).html("0" + XX); // to display format as 00 01 02 03etc
	} else
	{
		$(whichButton).html(XX);
	}
}

//======================================================//
//=========================================Dynamically Delete or Edit a button when right icon is clicked ==========================//
function textBox()
{
$("#editName").html();
$("#editName").html('<input type="trainName" class="form-control" id="editName1" aria-describedby="nameHelp" placeholder="Edit Name">');
$("#editDestination").html();
$("#editDestination").html('<input type="destination" class="form-control" id="editDestination1" aria-describedby="destinationHelp" placeholder="Edit Destination">');
$("#editFreq").html();
$("#editFreq").html('<input type="frequency" class="form-control" id="editFrequency" aria-describedby="frequencyHelp" placeholder="Frequency">');
$("#editButton").html();
$("#editButton").html('<button type="submit" class="btn btn-primary" id="editTrain">Edit</button>');
}

//=========================================Dynamically Delete or Edit a button when right icon is clicked ==========================//
function deleteEdit(action, id)
{
	// global Variable editDeleteItem is the name of the variable that will store the name of the selected item (once user click on edit or delete icon) has in the database for edit or delete purposes.
	editDeleteItem = $("#item" + id).find("td:first").html();  // this line will get the first  child in the table which is the name of train.
	console.log("editing : " + editDeleteItem);
	console.log(action);
	if (action.search("delete"))
	{
		console.log("should edit " + action);
		textBox(); // create input box when "edit icon has been selected"

	} else
	{
		var deleteItem = firebase.database().ref("trainSchedule/"+editDeleteItem);
		deleteItem.remove();
		console.log("should delete" + action);
	}
}

//======================================================//


//=========================================Get Time Left for next train ==========================//
function timeLeft(HH,MM, freq)
{
	var trainFirstTime = new Date(); // I used this to work on the Date Format
	trainFirstTime.setHours(HH);
	console.log(trainFirstTime);
	trainFirstTime.setMinutes(MM);
	var nthoursToMinutes = (trainFirstTime.getHours()*60) + trainFirstTime.getMinutes();
	var ntminutes =trainFirstTime.getMinutes();
	var today = new Date();
	var localTimeToMinutes=today.getHours()*60 + today.getMinutes();
	var frequency = freq;
	do{
		nthoursToMinutes = nthoursToMinutes - freq;
	} while (localTimeToMinutes < nthoursToMinutes)
	var minutesLeft = frequency - (Math.abs(nthoursToMinutes - localTimeToMinutes))%frequency;
	console.log("just added this " + frequency);
	console.log("just added this " + minutesLeft);

	if ((today.getMinutes() + minutesLeft) > 59)
	{
		if (today.getHours === 23)
		{
		trainFirstTime.setHours('00');
		//StrainFirstTime.setYear(today.getYear());
		trainFirstTime.setMinutes(today.getMinutes() + minutesLeft);
		} else
		{
		trainFirstTime.setHours(today.getHours());
		//StrainFirstTime.setYear(today.getYear());
		trainFirstTime.setMinutes(today.getMinutes() + minutesLeft);
		}
	} else
	{
		trainFirstTime.setHours(today.getHours());
		//StrainFirstTime.setYear(today.getYear());
		trainFirstTime.setMinutes(today.getMinutes() + minutesLeft);
	}

	console.log("Minutes Left " + minutesLeft);
	console.log("NextTrain " + trainFirstTime.getHours() + ":" + trainFirstTime.getMinutes() + ":00" );

	var displayHours = trainFirstTime.getHours();
	var displayMinutes = trainFirstTime.getMinutes();
	for (var i=0; i<10;i++)
	{
		if (parseInt(trainFirstTime.getHours()) === i)
		{
			displayHours = "0" + trainFirstTime.getHours();
		}
		if (parseInt(trainFirstTime.getMinutes()) === i)
		{
			displayMinutes = "0" + trainFirstTime.getMinutes();
		}
	}

	var result = displayHours + ":" + displayMinutes + ":00";


return [result , minutesLeft];
}

function checkIfNumber(pressedKey, inputBox) // pressed key is the key pressed inside a given input box, inputBox is the focused input box you are checking
{
	console.log("pressing" + pressedKey);
	if (validKeys.indexOf(pressedKey) === -1){
  	console.log(validKeys.indexOf(pressedKey));
  	$(inputBox).val("");
  	console.log("pressing" + pressedKey);
  }
}




//======================================================//
// APP BEGINS HERE
//======================================================//
$( document ).ready(function() {
$("#alert1").hide();
$("#alert2").hide();
createDropDownMenu();

$("#hoursMain").on("click",'a' ,function(){
HH = parseInt($(this).attr("id").split("s").pop())
setTime("#hoursButton", HH);
});


$("#minutesMain").on("click",'a' ,function(){
MM =parseInt($(this).attr("id").split("s").pop());
setTime("#minutesButton", MM);
});


$("#addTrain").on("click", function(){
	var trainName = $("#trainNameInput").val().trim();
	var destination = $("#destination").val().trim();
	var frequency = parseInt($("#frequency").val().trim());
	console.log(frequency);
	console.log(HH);
	console.log(MM);
	if (trainName !== "" && destination !== "" && HH !== undefined && MM !== undefined && isNaN(frequency) === false && frequency !== "")
	{
		$("#alert2").hide();
		if (isNaN(frequency) || frequency === 0)
		{
			frequency = 10;	
		} 
		console.log("inside");
		var firstTime = HH + ":" + MM;
		var [nextArrival,minutesLeft] = timeLeft(HH, MM, frequency);
		var newTrain = [trainName,destination,frequency, nextArrival,minutesLeft,HH,MM,firstTime];
	    // Save the new price in Firebase
	    database.ref("trainSchedule/" +trainName).set({
	      aName:trainName,bDestination:destination,cFrequency:frequency, dArrival:nextArrival,eMinutesLeft:minutesLeft,fHours:HH,gMinutes:MM,hFirstTime:firstTime,
	    });
	    $("#trainNameInput").val("");
	    $("#destination").val("");
	    $("#frequency").val("");
	    $("#minutesButton").html("Hours");
		$("#hoursButton").html("Minutes");
	} else
	{
		$("#alert2").show();//alert("Incomplete information!, please complete the form before clicking SUBMIT");
	}

});

// the event below will call the deleteEdit function when the edit or delete icon is clicked.
$("#trains").on("click",'a' ,function(){
var positionToEditDelete = parseInt($(this).attr("id").split("s").pop()) // store the position of the item in the database e.g. deletes0 is the first item in the database, edit20 is the 20th in the database
// setTime("#hoursButton", HH);
console.log($(this).attr("id"), positionToEditDelete);
deleteEdit($(this).attr("id"), positionToEditDelete);
});

//the event below will edit some information in the selected train once the edit button has been clicked
$("#editButton").on("click", 'button', function(){
var name = $("#editName1").val().trim();
var destination = $("#editDestination1").val().trim();
var frequency = parseInt($("#editFrequency").val().trim());
var valueToEdit;
var arrival;
var minutesLeft;
var hours;
var minutes;
var firstTrain;

if (name !== "" && destination !== "" && !(isNaN(frequency)) && frequency !== "")
{
	$("#alert1").hide();
	if (isNaN(frequency) || frequency === 0)
	{
		frequency = 10;	
	} 
	database.ref("trainSchedule/" + editDeleteItem).once('value').then(function(snapshot) {
		valueToEdit = snapshot.val();
		arrival =valueToEdit.dArrival;
		minutesLeft =valueToEdit.eMinutesLeft;
		hours = valueToEdit.fHours;
		minutes = valueToEdit.gMinutes
		firstTrain = valueToEdit.hFirstTime
		console.log(snapshot.val());
		console.log("name :" + name);
		console.log("destination: " +destination);
		console.log("frequency: " + frequency);
		console.log(valueToEdit);
		var deleteItem = firebase.database().ref("trainSchedule/"+editDeleteItem);
		deleteItem.remove();
		$("#editName").html("Train Name");
		$("#editDestination").html("Destination");
		$("#editFreq").html("Frequency");
		$("#editButton").html("Delete/Edit");
	    database.ref("trainSchedule/" + name).set({
	    aName:name,bDestination:destination,cFrequency:frequency,dArrival:arrival,eMinutesLeft:minutesLeft,fHours:hours,gMinutes:minutes,hFirstTime:firstTrain,
	    });
	});
} else
{
	console.log(isNaN(frequency) , frequency);
	$("#alert1").show();

}

});


$("#frequency").on("keyup",function() {
checkIfNumber(event.which, "#frequency");//check if numbers have been added, if string is added, input box content will be deleted
});

$("#editFreq").on("keyup","input",function() {
checkIfNumber(event.which, "#editFrequency");//check if numbers have been added, if string is added, input box content will be deleted
});
});
// ----------------------------------------------------------------



