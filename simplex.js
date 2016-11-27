"use strict";

$(document).ready(function (){
	var i = 0;
	$.each(food, function(key, value){
		console.log(value.name);
		i++;
	});
	alert("There are "+i+" foods");
});