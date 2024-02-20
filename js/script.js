// Queen Mary University of London (QMUL)
// qNomics Financial Literacy Project
// Date: 19/02/2024
// Developed by: Rahat Ali
// Contact: r.ali@se22.qmul.ac.uk

// Description: This file contains the code to create a chart using CanvasJS.

// When the page loads, render the chart with default values
window.onload = function () {
    const dataPoints = generateDataPoints(27750, 7.6, 2025);
    renderChart(dataPoints);
}

// Update Chart when user clicks "Generate Chart" button
function updateChart() {
    // Get user input
    const userInput = getUserInput();
    if (!userInput) return;

    // Generate dataPoints
    const dataPoints = generateDataPoints(userInput.debt, userInput.interest, userInput.grad_year);

    // Reset chart
    document.getElementById("chartContainer").innerHTML = "";

    // Render chart
    renderChart(dataPoints);
}

// Get user input and validate it
function getUserInput() {
    const debt = parseFloat(document.getElementById("debt").value);
    const interest = parseFloat(document.getElementById("interest").value);
    const grad_year = parseInt(document.getElementById("graduation_year").value);

    // Check if inputs are valid
    if (isNaN(debt) || isNaN(interest) || isNaN(grad_year) ||
        debt < 0 || interest < 0 || grad_year < 0) {
        alert("Please enter valid numbers");
        return;
    }

    return { debt, interest, grad_year};
}

// Generate Data Points with user input
function generateDataPoints(debt, interest, years) {
    const dataPoints = [];

    // Calculate data points yearly
    for (let i = years; i <= years+30; i++) {
        const currentDebt = Math.round(debt + (debt * (interest / 100)));
        dataPoints.push({ x: i, y: currentDebt });
        debt = currentDebt;
    }

    return dataPoints;
}

// Render Chart
function renderChart(Points){
    const chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: true,
        theme: "light2",
        title: {text: "Debt Over Time"},
        axisY: {
            includeZero: true,
            title: "Debt (GBP)"
        },
        axisX: {
            title: "Years",
            interval: 2, // Show every year
        },
        data: [{
            type: "line",
            dataPoints: Points
        }]
    });

    chart.render();
}

/* Credits:
- CanvasJS free license used under CC BY-NC-SA 3.0 DEED
*/
