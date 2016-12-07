"use strict";

$(document).ready(function (){
	var list = "";
	$("#tabfood").hide();

	$.each(food, function(key, value){
		list += "<li style='font-family: prociono; font-size: 20px;'> <input type='checkbox' class='food_item'><label>" + value.name + "</label></input></li>";
	});

	$("#foodlist").append(list);

	$("#btn_solve").click(function(){
		solveDiet();
	});	

	$("#btn_select").click(function(){
		$(".food_item").each(function(){
			if(!($(this).is(':checked'))){
				$('.food_item').prop('checked', true);
			}
		})
	});

	$("#btn_clear2").click(function(){
		$(".food_item").each(function(){
			if(($(this).is(':checked'))){
				$('.food_item').prop('checked', false);
			}
		})
	});
	$("#clear_tab2").click(function(){
		$(".tableau2_food").remove();
		$(".solution2").remove();
		$("#tabfood").hide();
	});
});

function solveDiet(){
	$(".tableau2_food").remove();
	var temp = [];
	var tableau = [];
	var selected = [];
	var columns = [];
	//constraints shit
	var values = [];	//price
	var size = [];	//serving size
	var size2 = [];
	var calories_max = [];
	var calories_min = [];
	var cholesterol_max = [];
	var cholesterol_min = [];
	var totalfat_max = [];
	var totalfat_min = [];
	var sodium_max = [];
	var sodium_min = [];
	var carbs_max = [];
	var carbs_min = [];
	var fiber_max = [];
	var fiber_min = [];
	var protein_max = [];
	var protein_min = [];
	var vita_max = [];
	var vita_min = [];
	var vitc_max = [];
	var vitc_min = [];
	var calcium_max = [];
	var calcium_min = [];
	var iron_max = [];
	var iron_min = [];

	//push to selected what is checked
	$(".food_item").each(function(){
		if($(this).is(':checked')){
			var name = $(this).next("label").text();
			temp.push(name);
		}
	})

	var i=0;
	for(i=0; i<temp.length; i++){
		$.each(food, function(key, value){
			if(temp[i] === value.name){
				selected.push(value);
			}
		});
	}

	for(i=0; i<selected.length; i++){
		columns.push(selected[i].name);
		values.push(selected[i].price);
		calories_max.push(-1 * selected[i].calories);
		calories_min.push(selected[i].calories);
		cholesterol_max.push(-1 * selected[i].cholesterol_mg);
		cholesterol_min.push(selected[i].cholesterol_mg);
		totalfat_max.push(-1 * selected[i].totalfat_g);
		totalfat_min.push(selected[i].totalfat_g);
		sodium_max.push(-1 * selected[i].sodium_mg);
		sodium_min.push(selected[i].sodium_mg);
		carbs_max.push(-1 * selected[i].carbs_g);
		carbs_min.push(selected[i].carbs_g);
		fiber_max.push(-1 * selected[i].fiber_g);
		fiber_min.push(selected[i].fiber_g);
		protein_max.push(-1 * selected[i].protein_g);
		protein_min.push(selected[i].protein_g);
		vita_max.push(-1 * selected[i].vita_iu);
		vita_min.push(selected[i].vita_iu);
		vitc_max.push(-1 * selected[i].vitc_iu);
		vitc_min.push(selected[i].vitc_iu);
		calcium_max.push(-1 * selected[i].calcium_mg);
		calcium_min.push(selected[i].calcium_mg);
		iron_max.push(-1 * selected[i].iron_mg);
		iron_min.push(selected[i].iron_mg);


	}

	columns.push("RHS");
	values.push(parseFloat(0));

	calories_max.push(-1 * parseFloat(2250));
	calories_min.push(parseFloat(2000));
	cholesterol_max.push(-1 * parseFloat(300));
	cholesterol_min.push(parseFloat(0));
	totalfat_max.push(-1 * parseFloat(65));
	totalfat_min.push(parseFloat(0));
	sodium_max.push(-1 * parseFloat(2400));
	sodium_min.push(parseFloat(0));
	carbs_max.push(-1 * parseFloat(300));
	carbs_min.push(parseFloat(0));
	fiber_max.push(-1 * parseFloat(100));
	fiber_min.push(parseFloat(0));
	protein_max.push(-1 * parseFloat(100));
	protein_min.push(parseFloat(50));
	vita_max.push(-1 * parseFloat(50000));
	vita_min.push(parseFloat(5000));
	vitc_max.push(-1 * parseFloat(20000));
	vitc_min.push(parseFloat(50));
	calcium_max.push(-1 * parseFloat(1600));
	calcium_min.push(parseFloat(800));
	iron_max.push(-1 * parseFloat(30));
	iron_min.push(parseFloat(10));
	
	tableau.push(calories_max);
	tableau.push(calories_min);
	tableau.push(cholesterol_max);
	tableau.push(cholesterol_min);
	tableau.push(totalfat_max);
	tableau.push(totalfat_min);
	tableau.push(sodium_max);
	tableau.push(sodium_min);
	tableau.push(carbs_max);
	tableau.push(carbs_min);
	tableau.push(fiber_max);
	tableau.push(fiber_min);
	tableau.push(protein_max);
	tableau.push(protein_min);
	tableau.push(vita_max);
	tableau.push(vita_min);
	tableau.push(vitc_max);
	tableau.push(vitc_min);
	tableau.push(calcium_max);
	tableau.push(calcium_min);
	tableau.push(iron_max);
	tableau.push(iron_min);

	//For serving size
	for(i=0; i<selected.length; i++){
		size = [];
		size2 = [];
		for(var j=0; j<selected.length; j++){
			if(i == j){
				size.push(parseFloat(1));
				size2.push(parseFloat(1));
			}else{
				size.push(parseFloat(0));
				size2.push(parseFloat(0));
			}
		}
		size.push(parseFloat(10));
		size2.push(parseFloat(0));
		tableau.push(size);
		tableau.push(size2);
	}
	//End of serving size

	tableau.push(values);
	tableau = transpose2(tableau);

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
		for(k=0; k<tableau.length; k++){
			if(i == k){
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

	var i=0;
	for(i=0; i<(23+(2*selected.length))-1; i++){
		new_cols.push("S"+(i+1));
	}
	
	for(i=0; i<selected.length;i++){
		new_cols.push(selected[i].name);
	}
	new_cols.push("Z");
	new_cols.push("RHS");

	createTableau(new_tab, new_cols);
	$("#tabfood").show();
	optimize2(new_tab, new_cols);
}

function createTableau(tableau, columns){
	var colhead = "<section class='solution2'> <table class='tableau2_food'> <thead> <tr>";
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
	$("#tableau_food").append(colhead);
}

function transpose2(array){
	var newarray = [];
	var newrow = [];
	console.log(array);
	var i=0, j=0;
	for(i=0; i<array[0].length; i++){
		newrow = [];
		for(j=0; j<array.length; j++){
			newrow.push(array[j][i]);
		}
		newarray.push(newrow);
	}
	console.log(newarray);
	return newarray;
}

function optimize2(tableau, columns){
	var pvc = findPivotCol2(tableau[tableau.length-1]);
	var counter = 0;
	while(pvc != -1){
		var pvr = findPivotRow2(tableau, pvc);
		console.log("pvr " + pvr);
		console.log("pvc " + pvc);
		var new_tableau = foo2(tableau, pvr, pvc);
		createTableau(new_tableau, columns);
		pvc = findPivotCol2(tableau[tableau.length-1]);
		counter++;
		console.log("counter " + counter);
	}
}

function findPivotCol2(row){
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

function findPivotRow2(tableau, pvc){
	var check = Infinity;
	var i = 0;
	var pvr = -1;
	for(i=0; i<tableau.length-1; i++){
		//console.log("something "+ tableau[i][pvc]);
		if(tableau[i][pvc]>0){
			var num = tableau[i][tableau[i].length-1] / tableau[i][pvc];
			if(num < check){
				check = num;
				pvr = i;
			}
		}
		
	}
	return pvr;
}

//gaussjordan?
function foo2(tableau, pvr, pvc){
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
