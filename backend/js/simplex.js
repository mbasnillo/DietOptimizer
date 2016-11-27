"use strict";

$(document).ready(function (){

	$("#tabdiv").hide();

	$("#add_const").click(function(){
		console.log("clicked");
		$('#const_row').add("<input type='text' class='constraint' placeholder='Insert here'>").appendTo("#const_row");
	});

	
	$("#rem_const").click(function(){
		$(".constraint").last().remove();
	});
	

	$("#btn_min").click(function(){

	});
	$("#btn_max").click(function(){
		maximize();
	});
});


function maximize(){
	var obj_func = $("#obj_fxn").val();		// takes the objective function
	var run = true;

	var columns = [];
	var values = [];
	var objval = [];
	var tableau = [];

	$("#tableau2").remove();

	// Checks whether objective function is blank or not
	if(!obj_func){
		alert("No objective function!");
		$("#tabdiv").hide();
		return;
	}
	//Checks whether there are missing constraint fields
	$(".constraint").each(function(){
		if(!$(this).val()){
			alert("One or more missing constraints!");
			$("#tabdiv").hide();
			run = false;
		}
	});
	if(!run) return;

	//Splits by + and * then pushes to proper array
	var split1 = obj_func.split("+");
	$.each(split1, function(key, value){
		var split2 = value.split("*");
		if($.isNumeric(split2[0])){
			columns.push(split2[1].trim());
			objval.push(-1 * parseFloat(split2[0]));
		}else{
			columns.push(split2[0].trim());
			objval.push(-1 * parseFloat(split2[1]));
		}
	})

	var i = 0;
	$(".constraint").each(function(){
		i++;
		columns.push("S"+i);
		objval.push(parseFloat(0));
	});

	columns.push("Z");
	objval.push(parseFloat(1));
	columns.push("RHS");
	objval.push(parseFloat(0));
	createTableau(columns);

	var j = 0;
	$(".constraint").each(function(){
		j++;
		var con = $(this).val();
		var slack = "S"+j;

		if(con.includes("<=")){
			var left = con.split("<=");
			var left2 = left[0].split("+");
			$.each(columns, function(key, value){
				var found = false;
				$.each(left2, function(key2, value2){
					var left3 = value2.split("*");
					if(left3[0].trim() == value){
						values.push(parseFloat(left3[1].trim()));
						found = true;
					}else if(left3[1].trim() == value){
						values.push(parseFloat(left3[0].trim()));
						found = true;
					}
				});

				if(!found){
					if(slack == value){
						values.push(parseFloat(1));
					}else if(value == "RHS"){
						values.push(parseFloat(left[1].trim()))
					}else{
						values.push(parseFloat(0));
					}
				}
			});
			
		}else if(con.includes(">=")){
			var left = con.split(">=");
			var left2 = left[0].split("+");
			$.each(columns, function(key, value){
				var found = false;
				$.each(left2, function(key2, value2){
					var left3 = value2.split("*");
					if(left3[0].trim() == value){
						values.push(parseFloat(left3[1].trim()));
						found = true;
					}else if(left3[1].trim() == value){
						values.push(parseFloat(left3[0].trim()));
						found = true;
					}
				});

				if(!found){
					if(slack == value){
						values.push(parseFloat(-1));
					}else if(value == "RHS"){
						values.push(parseFloat(left[1].trim()))
					}else{
						values.push(parseFloat(0));
					}
				}
			});
		}
		addToTableau(values);
		tableau.push(values);
		values = [];
	});
	
	addToTableau(objval);
	tableau.push(objval);
	//console.log(tableau);
	finishTableau();
	$("#tabdiv").show();	//shows final tableau after updating all variables
}

function createTableau(columns){
	// FOR CREATING THE TABLE HEADER
	var colhead = "<table id='tableau2'> <thead> <tr>";
	$.each(columns, function(key, value){
		colhead += "<td>" + value + "</td>";
	});
	colhead += "</tr> </thead> <tbody>";

	/*/ FOR CREATING THE TABLE BODY
	var colbody = "<tbody> <tr>";
	$.each(values, function(key, value){
		colbody += "<td>" + value + "</td>";
	});
	colbody += "</tr> </tbody> </table>"

	colhead+=colbody
	*/
	$("#tableau").append(colhead);
}

function addToTableau(values){
	var newrow = "<tr>"
	$.each(values, function(key, value){
		newrow += "<td>" + value + "</td>";
	});
	newrow += "</tr>";
	$("#tableau2").append(newrow);
}

function finishTableau(){
	var end = "</tbody> </table>"
	$("#tableau2").append(end);
}