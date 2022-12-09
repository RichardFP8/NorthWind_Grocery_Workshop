"use strict";

const mainDropdown = document.getElementById("mainProductSearch");
const tableBody = document.getElementById("displayProductData");
const categoryDropdown = document.getElementById("byCategoryDropdown");
const forImagesArray = ["drinks", "condiments", "confections", "dairyproducts", "grains", "meats", "produce", "seafood"];
const table = document.querySelector("table");
const image = document.getElementById("categoryPicture");
window.onload = function () {

    //using an arrow function inside an anonymous function with both being event handlers for different "things"; and using the shorthand syntax for the if stament
    mainDropdown.onchange = () => {
        if (mainDropdown.value === "byCategory") byCategoriesDropdown();
        else if (mainDropdown.value === "allProducts") displayAllProducts();
    };
    categoryDropdown.onchange = categoryDropdownOnChange;
}

function byCategoriesDropdown() {
    categoryDropdown.style.display = "block";
    table.style.display = "";
    categoryDropdown.selectedIndex = 0; //make sure the table is always displaying the "Select one" option first
    categoryDropdown.length = 1;  //prevent the table from repeating to add the same categories  

    fetch("http://localhost:8081/api/categories").then(response => response.json())
        .then(data => {
            for (let x of data) {
                let option = new Option(x.name, x.name.toLowerCase());
                categoryDropdown.appendChild(option)
            }
        });

}
//using the numOfCategories, we're just making a call to every
function displayAllProducts() {
    image.style.display = "";
    //first delete any rows in the table, show the table and hide the category dropdown
    let rows = document.querySelectorAll("tbody tr");
    Array.from(rows).forEach(row => tableBody.removeChild(row));
    categoryDropdown.style.display = "";
    table.style.display = "block";

    //make the fetch call to get ALL the products
    fetch("http://localhost:8081/api/products").then(response => response.json()).then(products => {
        //store that ENTIRE array into productsArray, sort that list by the name properties and use that instead to add them to rows
        let productsArray = products.sort((x, y) => x.productName < y.productName ? -1 : x.productName === y.productName ? 0 : 1);
        for (let aProduct of productsArray) {
            let row = tableBody.insertRow(-1);
            //each object(element) of the array, loop through the properties and display only 3 by using the switch statement
            for (let info in aProduct) {
                switch (info) {
                    //create a link for the name to send the user to another page to display more details of that product
                    case "productName":
                        let anchor = document.createElement("a");
                        //is the "?" that tells the browser this does magic
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
function categoryDropdownOnChange() {
    const image = document.getElementById("categoryPicture");
    table.style.display = "block";
    let rows = document.querySelectorAll("tbody tr");
    Array.from(rows).forEach(row => tableBody.removeChild(row));

    fetch("http://localhost:8081/api/categories").then(response => response.json()).then(categoriesArray => {
        // const findCategoryId = categoriesArray.find(category => category.name.toLowerCase() === categoryDropdown.value); //find the object to get it's category Id
        const id = categoriesArray.find(category => category["name"].toLowerCase() === categoryDropdown.value).categoryId;
        image.src = `./images/${forImagesArray[id - 1]}.jpg`;
        image.style.display = "block";
        displayProductPerCategory(id);
    })


}
//this function is being passed each element of the category array from the first fetch call to make the second fetch call 
function displayProductPerCategory(id) {

    //each category has categoryId, use that to make the GET request and get products by category, display
    //the returned data is another array but products only

    fetch(`http://localhost:8081/api/categories/${id}`).then(response => response.json()).then(products => {
        let productsArray = products.sort((x, y) => x.productName < y.productName ? -1 : x.productName === y.productName ? 0 : 1);
        for (let aProduct of productsArray) {
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
