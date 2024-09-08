// const BASE_URL = "https://latest.currency-api.pages.dev/v1/currencies/eur.json";

// const dropdowns = document.querySelectorAll(".dropdown select");
// const btn = document.querySelector("form button");
// const fromCurr = document.querySelector(".from select");
// const toCurr = document.querySelector(".to select");
// const msg = document.querySelector(".msg");

// for (let select of dropdowns) {
//     for (currCode in countryList) {
//         let newOption = document.createElement("option");
//         newOption.innerText = currCode;
//         newOption.value = currCode;
//         if (select.name === "from" && currCode === "USD") {
//             newOption.selected = "selected";
//         } else if (select.name === "to" && currCode === "PKR") {
//             newOption.selected = "selected";
//         }
//         select.append(newOption);
//     }

//     select.addEventListener("change", (evt) => {
//         updateFlag(evt.target);
//     });
    
// }
 
// const updateFlag = (element) => {
//     let currCode = element.value;
//     let countryCode = countryList[currCode];
//     let newSrc = 'https://flagsapi.com/${countryCode}/flat/64.png';
//     let img = element.parentElement.querySelectorAll("img");
//     img.src = newSrc;
// };

// btn.addEventListener("click", async (evt) => {
//     evt.preventDefault();
//     let amount = document.querySelector(".amount input");
//     let amtVal = amount.value;
//     if (amtVal === "" || amtVal < 1) {
//         amtVal = 1;
//         amount.value = "1";
//     }

//     const URL = `${BASE_URL}/${fromCurr.value.toLowerCase}.json`;
//     let response = await fetch (URL);
//     let data = await response.json();
//     let rate = data[fromCurr.value.toLowerCase()][toCurr.value.toLowerCase()];
//     let finalAmount = amtVal * rate;
//     msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`
// });

// Primary and Fallback Base URLs
const PRIMARY_BASE_URL = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";
const FALLBACK_BASE_URL = "https://latest.currency-api.pages.dev/v1/currencies";

// Dropdown elements and button
const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// Populate dropdowns with currencies
for (let select of dropdowns) {
    for (currCode in countryList) {
        let newOption = document.createElement("option");
        newOption.innerText = currCode;
        newOption.value = currCode;
        if (select.name === "from" && currCode === "USD") {
            newOption.selected = "selected";
        } else if (select.name === "to" && currCode === "PKR") {
            newOption.selected = "selected";
        }
        select.append(newOption);
    }

    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
    });
}

// Update currency flag image
const updateFlag = (element) => {
    let currCode = element.value;
    let countryCode = countryList[currCode];
    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    let img = element.parentElement.querySelector("img");
    img.src = newSrc;
};

// Function to fetch exchange rates and display the result
const fetchCurrencyData = async (baseURL, fromCurrency, toCurrency) => {
    const URL = `${baseURL}/${fromCurrency.toLowerCase()}.json`;  // Base URL for fetching rates
    let response = await fetch(URL);
    if (!response.ok) {
        throw new Error("Failed to fetch data");
    }
    let data = await response.json();
    return data[toCurrency.toLowerCase()];
};

// Event listener for button click to trigger currency conversion
btn.addEventListener("click", async (evt) => {
    evt.preventDefault();
    let amount = document.querySelector(".amount input");
    let amtVal = amount.value;

    if (amtVal === "" || amtVal < 1) {
        amtVal = 1;
        amount.value = "1";
    }

    try {
        // Try fetching from the primary URL first
        let rate = await fetchCurrencyData(PRIMARY_BASE_URL, fromCurr.value, toCurr.value);

        // If primary URL fails, use the fallback URL
        if (!rate) {
            rate = await fetchCurrencyData(FALLBACK_BASE_URL, fromCurr.value, toCurr.value);
        }

        if (rate) {
            let finalAmount = amtVal * rate;
            msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount.toFixed(2)} ${toCurr.value}`;
        } else {
            msg.innerText = "Conversion rate not available.";
        }
    } catch (error) {
        console.error('Fetch error:', error);
        msg.innerText = "Error fetching conversion rate.";
    }
});
