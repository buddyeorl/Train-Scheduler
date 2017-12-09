var train=[];
var count=0;
var HH; //Hours 
var MM; //Minutes
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
		$(whichButton).html("0" + XX); // to display format as 00 01 etc
	} else
	{
		$(whichButton).html(XX);
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
	$("tbody").html("");
	var trainName = $("#trainNameInput").val().trim();
	var destination = $("#destination").val().trim();
	var firstTime = HH + ":" + MM;
	var frequency = parseInt($("#frequency").val().trim());
	var [nextArrival,minutesLeft] = timeLeft(HH, MM, frequency)
	var newTrain = [trainName,destination,frequency, nextArrival,minutesLeft,firstTime];

	train.push(newTrain);
	for (var i = 0; (i<train.length);i++)
	{
		$("tbody").append('<tr class="table-light" id=item'+ i +' >');
		$("#item" + i).append('<th scope="row">'+ i +'</th>');
		for (var j= 0; j<(train[i].length -1);j++)
		{
			$("#item" + i).append('<td>'+train[i][j]+ '</td>');
		}
	}
	console.log(new Date(2017,12,05).valueOf());

});

