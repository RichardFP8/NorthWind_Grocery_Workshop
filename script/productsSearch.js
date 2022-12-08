"use strict";
const mainDropdown = document.getElementById("mainProductSearch");
const tableBody = document.getElementById("displayProductData");
let categoriesArray = [];
window.onload = function () {
    const categoryDropdown = document.getElementById("byCategoryDropdown");
    const table = document.querySelector("table");
    //using an arrow function inside an anonymous function with both being event handlers for different "things"; and using the shorthand syntax for the if stament
    mainDropdown.onchange = () => {
        mainDropdown.value === "byCategory" ? byCategoriesDropdown(categoryDropdown, table) : displayAllProducts(categoryDropdown, table);
    };
}

function byCategoriesDropdown(categoryDropdown, table) {
    categoryDropdown.style.display = "block";
    table.style.display = "";
    categoryDropdown.selectedIndex = 0;
    categoryDropdown.length = 1;  //prevent the table from repeating to add the same categories  

    //once the data is back, store it all in this array so I don't have to make another call to it

    fetch("http://localhost:8081/api/categories").then(response => response.json())
        .then(data => {
            for (let x of data) {
                let option = new Option(x.name, x.name.toLowerCase());
                categoryDropdown.appendChild(option);
                categoriesArray.push(x);
            }
        });
    /* once the second dropdown has been changed, meaning that an option was selected, get the value of the dropdown and 
        call the function to display products based on that value(which is the name propert lowercased)
    */

    categoryDropdown.onchange = () => {
        table.style.display = "block";
        let rows = document.querySelectorAll("tbody tr");
        Array.from(rows).forEach(row => tableBody.removeChild(row));
        //find the object that was selected so that we can call the function that will make the fetch call to display data based on the argument passed(a category)
        const findCategory = categoriesArray.find(category => category.name.toLowerCase() === categoryDropdown.value);
        displayProductPerCategory(findCategory);
    };
}
//using the numOfCategories, we're just making a call to every
function displayAllProducts(categoryDropdown, table) {

    let rows = document.querySelectorAll("tbody tr");
    Array.from(rows).forEach(row => tableBody.removeChild(row));
    categoryDropdown.style.display = "";
    table.style.display = "block";

    fetch("http://localhost:8081/api/products").then(response => response.json()).then(products => {
        for (let aProduct of products) {
            let row = tableBody.insertRow(-1);
            //each object(element) of the array, loop through the properties and display only 3 by using the switch statement
            for (let info in aProduct) {
                switch (info) {
                    //create a link for the name to send the user to another page to display more details of that product
                    case "productName":
                        let anchor = document.createElement("a");
                        anchor.href = `productdetails.html?productid=${aProduct["productId"]}`;
                        anchor.text = aProduct[info];
                        anchor.target = "_blank";
                        let anchorCell = row.insertCell(0);
                        anchorCell.appendChild(anchor);
                        break;
                    case "unitPrice":
                    case "unitsInStock":
                        let cell = row.insertCell(-1);
                        cell.innerHTML = aProduct[info];
                        break;
                }
            }
        }
    });

}
//this function is being passed each element of the category array from the first fetch call to make the second fetch call 
function displayProductPerCategory(category) {

    //each category has categoryId, use that to make the GET request and get products by category, display
    //the returned data is another array but products only

    fetch(`http://localhost:8081/api/categories/${category.categoryId}`).then(response => response.json()).then(products => {
        for (let aProduct of products) {
            let row = tableBody.insertRow(-1);
            //each object(element) of the array, loop through the properties and display only 3 by using the switch statement
            for (let info in aProduct) {
                switch (info) {
                    //create a link for the name to send the user to another page to display more details of that product
                    case "productName":
                        let anchor = document.createElement("a");
                        anchor.href = `productdetails.html?productid=${aProduct["productId"]}`;
                        anchor.text = aProduct[info];
                        anchor.target = "_blank";
                        let anchorCell = row.insertCell(0);
                        anchorCell.appendChild(anchor);
                        break;
                    case "unitPrice":
                    case "unitsInStock":
                        let cell = row.insertCell(-1);
                        cell.innerHTML = aProduct[info];
                        break;
                }
            }
        }
    });


}
