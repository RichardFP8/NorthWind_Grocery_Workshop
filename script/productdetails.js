"use strict";
window.onload = function (){
    const urlParams = new URLSearchParams(location.search);
    const row = document.getElementById("showAllProductData");
    let id = -1;
    if(urlParams.has("productid")){
        id = urlParams.get("productid");
        fetch(`http://localhost:8081/api/products/${id}`)
        .then((response) => response.json())
        .then(data => {
            for(let x in data){
                let cell = row.insertCell(-1);
                cell.innerHTML = data[x];
            }
        })
    }
}