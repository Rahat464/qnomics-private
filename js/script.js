// // Queen Mary University of London (QMUL)
// // qNomics Financial Literacy Project
// // Date: 19/02/2024
// // Developed by: Rahat Ali
// // Contact: r.ali@se22.qmul.ac.uk

// Description: This file contains the code to create a chart using CanvasJS.

// When the page loads, render the chart with default values
window.onload = function () {
    const dataPoints = generateDataPoints(27750, 2025, "plan2", 30000, 1);
    renderChart(dataPoints);
}

// Update Chart when user clicks "Generate Chart" button
function updateChart() {
    // Get user input
    const userInput = getUserInput();
    if (!userInput) return;

    // Generate dataPoints
    const dataPoints = generateDataPoints(userInput.debt, userInput.grad_year, userInput.plan, userInput.income, userInput.yearlyIncrease);

    // Reset chart
    document.getElementById("chartContainer").innerHTML = "";

    // Render chart
    renderChart(dataPoints);
}

// Get user input and validate it
function getUserInput() {
    const debt = parseFloat(document.getElementById("debt").value);
    const grad_year = parseInt(document.getElementById("graduation_year").value);
    const plan = document.getElementById("payment_plan").value;
    const income = parseInt(document.getElementById("income").value);
    const yearlyIncrease = parseFloat(document.getElementById("incomeIncrease").value);

    // Check if inputs are valid
    if (isNaN(debt) || isNaN(grad_year) || plan === "" || isNaN(income) || isNaN(yearlyIncrease)
        || debt < 0 || grad_year < 0 || income < 0 || yearlyIncrease < 0) {
        alert("Please enter valid numbers");
        return;
    }

    return { debt, grad_year, plan, income, yearlyIncrease };
}

// Updated generateDataPoints function that takes into account the payment plan
function generateDataPoints(debt, grad_year, plan, income, yearlyIncrease) {
    const dataPoints = [{ x: 0, y: debt }];
    let debtPaid = 0;

    // Calculate remaining years of repayment plan depending on plan and graduation year
    const totalYears = plan === "plan2" ? 30 : 40;

    // We calculate the interest for each month since the interest rate can change each month
    // Year starts from 1 since we assume the user will pay back the April after they graduate
    for (let year = 1; year <= totalYears; year++) {
        for (let month = 0; month < 12; month++) {
            // Get the current date to find the interest rate
            let curr_date = new Date(grad_year + year, month, 1)
            
            // Find the interest rate for the current date
            let interestRate = (findInterestRate(curr_date, plan) / 100)  + 1;

            // Apply the interest rate to the debt
            debt += ((debt * interestRate) - debt) / 12;
        }

        // If the user has an income, subtract the income from the debt
        if (income) {
            let incomeToDebt = 0;
            if (plan === "plan2" && income >= 27000) {
                // Plan 2: Take away 9% of the income above 27,000 from the debt
                incomeToDebt = (income - 27000) * 0.09;
            }
            else if (plan === "plan5" && income >= 25000) {
                // Plan 5: Take away 9% of the income above 25000 from the debt
                incomeToDebt = (income - 25000) * 0.09;
            }
            
            // if there is less debt than the income to be paid, only pay the remaining debt
            incomeToDebt = Math.min(incomeToDebt, debt);
            
            // Update the amount of debt paid so far
            debtPaid += incomeToDebt;

            // Subtract the income from the debt
            debt -= incomeToDebt;
        }

        // Add yearly increase to the income
        income += (income * (yearlyIncrease / 100));

        if (debt <= 0) {
            dataPoints.push({ x: (year), y: (0)});
            document.getElementById("debtPaid").innerHTML = `Total debt paid: £${debtPaid.toFixed(2)}`;
            return dataPoints;
        }

        dataPoints.push({ x: (year), y: Math.round(debt) });
    }

    // Change innerHTML of id debtPaid to the amount paid
    document.getElementById("debtPaid").innerHTML = `Total debt paid: £${debtPaid.toFixed(2)}`;
    return dataPoints;
}

// Given a data object and a plan,
// Find the interest rate for the given month and return the interest rate
function findInterestRate(date, plan) {
    // Fetch the JSON file
    let data = plan === "plan2" ? plan2 : plan5;
    data = data.reverse(); // Reverse order since the JSON file starts with the most recent year

    // Convert the year to a UNIX timestamp
    const timestamp = date.getTime() / 1000; // Convert to seconds

    for (const item of data) {
        // Check if the year falls within the start and end timestamps
        if (timestamp >= item.start && timestamp <= item.end) {
            // Return the interest rate for this date range
            return parseFloat(item.interestRate);
        }
    }
    // If no interest rate is found, return the most recent interest rate
    return parseFloat(data[data.length -1]?.interestRate) || 7.6;
}

// Render Chart
function renderChart(Points){
    const chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: true,
        theme: "light2",
        title: {text: "Debt Over Time"},
        axisY: {
            includeZero: false,
            title: "Debt (GBP)"
        },
        axisX: {
            title: "Years",
            interval: 10, // Show every year
            // Divide by 12 to get years
        },
        data: [{
            type: "line",
            dataPoints: Points
        }]
    });

    chart.render();
}

// CONSTANTS
const plan2 = [
    {"start": 1704067200, "end": 4102444800, "interestRate": "7.6"},
    {"start": 1638316800, "end": 1640908800, "interestRate": "7.5"},
    {"start": 1630454400, "end": 1638316800, "interestRate": "7.3"},
    {"start": 1622505600, "end": 1630454400, "interestRate": "7.1"},
    {"start": 1614556800, "end": 1622505600, "interestRate": "6.9"},
    {"start": 1606780800, "end": 1614556800, "interestRate": "6.5"},
    {"start": 1598918400, "end": 1606780800, "interestRate": "6.3"},
    {"start": 1583020800, "end": 1598918400, "interestRate": "4.5"},
    {"start": 1609459200, "end": 1614556800, "interestRate": "4.4"},
    {"start": 1601510400, "end": 1609459200, "interestRate": "4.1"},
    {"start": 1598918400, "end": 1601510400, "interestRate": "4.2"},
    {"start": 1593561600, "end": 1598918400, "interestRate": "5.3"},
    {"start": 1598918400, "end": 1625097600, "interestRate": "5.6"},
    {"start": 1567296000, "end": 1598918400, "interestRate": "5.4"},
    {"start": 1535760000, "end": 1567296000, "interestRate": "6.3"},
    {"start": 1504224000, "end": 1535760000, "interestRate": "6.1"},
    {"start": 1472688000, "end": 1504224000, "interestRate": "4.6"},
    {"start": 1441152000, "end": 1472688000, "interestRate": "3.9"},
    {"start": 1409616000, "end": 1441152000, "interestRate": "5.5"},
    {"start": 1378076400, "end": 1409616000, "interestRate": "6.3"},
    {"start": 1346534400, "end": 1378076400, "interestRate": "6.6"}
]

const plan5 = [    
    {"start": 1638316800000, "end": 1640908800000, "interestRate": "7.5"},
    {"start": 1630454400000, "end": 1638316800000, "interestRate": "7.3"},
    {"start": 1627756800000, "end": 1630454400000, "interestRate": "7.1"}
]

/* Credits:
- CanvasJS free license used under CC BY-NC-SA 3.0 DEED
*/
