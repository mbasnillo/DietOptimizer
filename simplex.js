"use strict";

$(document).ready(function (){

	$("#add_const").click(function(){
		console.log("clicked");
		$('#const_row').add("<input type='text' class='const' placeholder='Insert here'>").appendTo("#const_row");
	});

	/*
	$("#rem_const").click(function(){
		$("#const_row").last().remove();
	});
	*/

	$("#btn_min").click(function(){
		minimize();
	});
	$("#btn_max").click(function(){

	});
});


function minimize(){
	var obj_func = $("#obj_fxn").val();

	if(!obj_func){
		alert("No objective function!");
	}
}
