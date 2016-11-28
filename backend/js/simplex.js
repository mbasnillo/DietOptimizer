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
		minimize();
	});
	$("#btn_max").click(function(){
		maximize();
	});
	$("#btn_clear").click(function() {
		clearFields();
		$(".tableau2").remove();
		$(".solution").remove();
		$("#tabdiv").hide();
	})
	$("#clear_tab").click(function(){
		$(".tableau2").remove();
		$(".solution").remove();
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

	$(".tableau2").remove();
	$(".solution").remove();

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

//gaussjordan?
function foo(tableau, pvr, pvc){
	var i=0, j=0;
	var div = 1 / tableau[pvr][pvc];
	for(i=0; i<tableau[pvr].length; i++){
		tableau[pvr][i] *= div;
	}
	for(i=0; i<tableau.length; i++){
		if(i == pvr){
			continue;
		}else{
			var mul = tableau[i][pvc] * -1;
			var divrow = [];
			for(j=0; j<tableau[i].length; j++){
				var num = mul * tableau[pvr][j];
				num += tableau[i][j];
				divrow.push(num);
			}
			tableau[i] = divrow;
		}
	}
	return tableau;
}

/* FUNCTION FROM PRINCE
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
*/

function newTableau(tableau, columns){
	// FOR CREATING THE TABLE HEADER
	var colhead = "<section class='solution'> <table class='tableau2'> <thead> <tr>";
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

// trying to minimize

function transpose(array){
	var newArray = array[0].map(function(col, i) { 
  		return array.map(function(row) { 
    		return row[i] 
  		})
	});

	return newArray;
}

function minimize(){
	var obj_func = $("#obj_fxn").val();		// takes the objective function
	var run = true;

	var columns = [];
	var values = [];
	var objval = [];
	var tableau = [];
	//var init_tab = [];

	$(".tableau2").remove();
	$(".solution").remove();

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

	//Splits objective function by + and * then pushes to proper array
	var split1 = obj_func.split("+");
	$.each(split1, function(key, value){
		var split2 = value.split("*");
		if($.isNumeric(split2[0])){
			columns.push(split2[1].trim());
			objval.push(parseFloat(split2[0]));
		}else{
			columns.push(split2[0].trim());
			objval.push(parseFloat(split2[1]));
		}
	})

	/*
	var i = 0;
	$(".constraint").each(function(){
		i++;
		columns.push("S"+i);
		//objval.push(parseFloat(0));
	});
	*/

	//columns.push("Z");
	//objval.push(parseFloat(1));
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
	tableau = transpose(tableau);
	//newTableau(tableau, columns);
	//finishTableau();
	//$("#tabdiv").show();	//shows final tableau after updating all variables
	//optimize(tableau, columns);

	var new_tab = [];
	var holder = [];

	var i=0, j=0, k=0;

	for(i=0; i<tableau.length; i++){

		for(j=0; j<tableau[i].length-1; j++){
			if(i == tableau.length-1){
				holder.push(-1 * tableau[i][j]);
			}else{
				holder.push(tableau[i][j]);
			}
		}
		for(k=0; k<tableau[i].length; k++){
			if(k == i){
				holder.push(1);
			}else{
				holder.push(0);
			}
		}
		holder.push(tableau[i][tableau[i].length-1]);
		new_tab.push(holder);
		holder = [];
	}

	var new_cols = [];
	for(i=0; i<columns.length-1; i++){
		new_cols.push(columns[i]);
	}
	var i=0;
	$(".constraint").each(function(){
		i++;
		new_cols.push("S"+i);
	});
	new_cols.push("Z");
	new_cols.push("RHS");

	console.log(new_tab);
	console.log(new_cols);
	newTableau(new_tab, new_cols);
	$("#tabdiv").show();
	optimize(new_tab, new_cols);
}