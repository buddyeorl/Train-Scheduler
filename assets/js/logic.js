var trainScheduleFull=[];
var count=0;
var HH; //Hours 
var MM; //Minutes

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
	y = Object.values(snapshot.val());
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
		console.log("building " + i)
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
		console.log("building " + i)
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
		console.log("building " + i)
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
function deleteEdit(action, id)
{
	console.log(action);
	if (action.search("delete"))
	{
		console.log("should edit " + action);
	} else
	{
		var firstValue = $("#item" + id).find("td:first").html();  // this line will get the first  child in the table which is the name of train.
		console.log(firstValue);
		var deleteItem = firebase.database().ref("trainSchedule/"+firstValue);
		deleteItem.remove();
		console.log("should delete" + action);
	}
}

//======================================================//


//=========================================Get Time Left for next train ==========================//
function timeLeft(HH,MM, freq)
{
	var trainFirstTime = new Date('0 00:50:00'); // I used this to work on the Date Format
	trainFirstTime.setHours(HH);
	trainFirstTime.setMinutes(MM);
	nthoursToMinutes = (trainFirstTime.getHours()*60) + trainFirstTime.getMinutes();
	ntminutes =trainFirstTime.getMinutes();
	var today = new Date();
	localTimeToMinutes=today.getHours()*60 + today.getMinutes();
	frequency = freq;
	do{
		nthoursToMinutes = nthoursToMinutes - freq
	} while (localTimeToMinutes < nthoursToMinutes)
	minutesLeft = frequency - (Math.abs(nthoursToMinutes - localTimeToMinutes)%frequency);


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

//======================================================//

//======================================================//

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
	event.preventDefault();
	var trainName = $("#trainNameInput").val().trim();
	var destination = $("#destination").val().trim();
	var frequency = parseInt($("#frequency").val().trim());
	console.log(frequency);
	console.log(HH);
	console.log(MM);
	if (trainName !== "" && destination !== "" && HH !== undefined && MM !== undefined && frequency !== NaN)
	{
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
		alert("Incomplete information, please complete the form before clicking SUBMIT");
	}

});

$("#trains").on("click",'a' ,function(){
 var i = parseInt($(this).attr("id").split("s").pop())
// setTime("#hoursButton", HH);
console.log($(this).attr("id"), i);
deleteEdit($(this).attr("id"), i);
});

// ----------------------------------------------------------------
// At the page load and subsequent value changes, get a snapshot of the local data.
// This function allows you to update your page in real-time when the values within the firebase node bidderData changes


