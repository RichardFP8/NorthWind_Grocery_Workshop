"use strict";
window.onload = function(){
    const mainDropdown = document.getElementById("mainProductSearch");
    mainDropdown.onchange = displayProducts(mainDropdown);
}
function displayProducts(dropdown){
    if(dropdown.value == "View all")
}