"use strict";

$(document).ready(function (){

	var test = "<ul>"
	var i=0;
	$.each(food, function(key, value){
		test += "<li> <input type='checkbox'> " + value.name + "</li>";
	})
	test += "</ul>";

	$("#foodlist").append(test);

	$("#tabdiv").hide();

	$("#add_const").click(function(){
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
	$("#btn_clear").click(function() {
		clearFields();
	})
	$("#clear_tab").click(function(){
		$("#tabdiv").hide();
	});
});


function maximize(){
	var obj_func = $("#obj_fxn").val();		// takes the objective function
	var run = true;

	var columns = [];
	var values = [];
	var objval = [];
	var tableau = [];
	//var init_tab = [];

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
	//tableau.push(columns)
	//createTableau(columns);

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
		//addToTableau(values);
		tableau.push(values);
		values = [];
	});
	
	//addToTableau(objval);
	tableau.push(objval);
	newTableau(tableau, columns);
	//finishTableau();
	$("#tabdiv").show();	//shows final tableau after updating all variables
	optimize(tableau, columns);
}

function createTableau(columns){
	// FOR CREATING THE TABLE HEADER
	var colhead = "<table id='tableau2'> <thead> <tr>";
	$.each(columns, function(key, value){
		colhead += "<td>" + value + "</td>";
	});
	colhead += "</tr> </thead> <tbody>";
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

function optimize(tableau, columns){
	var pvc = findPivotCol(tableau[tableau.length-1]);
	while(pvc != -1){
		var pvr = findPivotRow(tableau, pvc);
		console.log(pvr);
		console.log(pvc);
		var new_tableau = foo(tableau, pvr, pvc);
		newTableau(new_tableau, columns);
		pvc = findPivotCol(tableau[tableau.length-1]);
	}
}

function findPivotCol(row){
	var value = 0;
	var pvc = -1;
	var i = 0;
	for(i=0; i<row.length; i++){
		if(row[i] < value){
			value = row[i];
			pvc = i;
		}
	}

	return pvc;
}

function findPivotRow(tableau, pvc){
	var check = Infinity;
	var i = 0;
	var pvr = -1;
	for(i=0; i<tableau.length; i++){
		if(tableau[i][pvc]>0){
			var num = tableau[i][tableau[i].length-1] / tableau[i][pvc]
			if(num < check){
				check = num;
				pvr = i;
			}
		}
	}

	return pvr;
}

function foo(tableau, pvr, pvc){
	var i=0;
	var j=0;
	for(i=0; i<tableau.length; i++){
		if(i != pvr){
			var mul = tableau[i][pvc] / tableau[pvr][pvc];
			var cur_row = new Array(tableau[i].length);
			for(j=0; j<tableau[i].length; j++){
				cur_row[j] = tableau[pvr][j] * mul;
				tableau[i][j] = tableau[i][j] - cur_row[j];
			}
		}
	}
	return tableau;
}

function newTableau(tableau, columns){
	// FOR CREATING THE TABLE HEADER
	var colhead = "<section> <table> <thead> <tr>";
	$.each(columns, function(key, value){
		colhead += "<td>" + value + "</td>";
	});
	colhead += "</tr> </thead> <tbody>";

	var i = 0, j = 0;
	for(i=0; i<tableau.length; i++){
		colhead += "<tr>"
		for(j=0; j<tableau[i].length; j++){
			colhead += "<td>" + tableau[i][j] + "</td>";
		}
		colhead += "</tr>";
	}

	colhead += "</tbody></table>";

	//FOR SHOWING THE BASIC SOLUTION
	var newhead = "<b> Basic Solution: </b>"
	var i = 0, j = 0;
	for(i=0; i<tableau[0].length; i++){
		var count=0;
		var row=-1;
		var value=0;
		for(j=0; j<tableau.length; j++){
			if(tableau[j][i] != 0){
				count++;
				if((tableau[j][i] == 1 || tableau[j][i] == -1) && count == 1){
					value = tableau[j][tableau[j].length-1] / tableau[j][i];
					row = j;
				}
			}
		}
		if(count != 1){
			value = 0;
		}
		newhead += columns[i] + "=" + value + " | ";
	}

	colhead += newhead;
	colhead += "</section>";
	$("#tableau").append(colhead);
}

function clearFields(){
	$("#obj_fxn").val("");
	$(".constraint").each(function() {
		$(this).val("");
	})
}