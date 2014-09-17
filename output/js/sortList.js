/*
 * Sort the brigade list names by first name. 
 * Author: Donald Pittard
 * Date: 06/02/2014
 */

/*
 * Enumeration of sorting orders.  0 for ascending, 1 for descending.
 */
SortOrderEnum = {
	ASCENDING:0,
	DESCENDING:1
}

/*
 * Sorts an html unordered list <ul>.
 * @param ul The unordered list object.
 * @param order The order in which to sort the list.  Valid values are ascending(0) and descending (1).  
 * @return Returns the sorted html <ul> object.
 */
function sortUnorderedList(ul, order){
	var listAsArray = [];
	var sortedList = document.createElement("ul");
	var listItems   = ul.getElementsByTagName('li');
	
	// Grab the values from the brigade roster list.
	for(var i = 0; i < listItems.length; i++){
		listAsArray.push(listItems[i].innerHTML);	
	}

	// Sort the list values.
	if(order === SortOrderEnum.ASCENDING){
		listAsArray.sort(function(a,b){
			return a.toLowerCase() > b.toLowerCase();
		});
	}
	
	else if(order === SortOrderEnum.DESCENDING){
		listAsArray.sort(function(a,b){
			return a.toLowerCase() < b.toLowerCase();
		});	
	}
	
	// Put the sorted list into an html element.
	for(var i = 0; i < listAsArray.length; i++){
		var li = document.createElement("li");
		li.innerHTML = listAsArray[i];
		sortedList.appendChild(li);
	}
	
	return sortedList; // */
}
    
// Grab the unordered list.
var list = document.getElementById("brigade-list");
var sortedList = null; 

if(list.tagName.toLowerCase() === "ul"){
	sortedList = sortUnorderedList(list, SortOrderEnum.ASCENDING);
}

var listParent = list.parentNode;
listParent.removeChild(list);
listParent.appendChild(sortedList);
