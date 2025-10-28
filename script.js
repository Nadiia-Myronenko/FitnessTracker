document.getElementById("berechne").addEventListener("click", function() { 
    const gewicht = parseFloat(document.getElementById("gewicht").value);
    const groesse = parseFloat(document.getElementById("groesse").value) / 100; // in m
    if (gewicht > 0 && groesse > 0) {
        const bmi = (gewicht / (groesse * groesse)).toFixed(1);
        let bewertung = ""; 
        if (bmi < 18.5) 
            bewertung = "Untergewicht";
        else if (bmi < 25) 
            bewertung = "Normalgewicht"; 
        else if (bmi < 30) 
            bewertung = "Übergewicht"; 
        else if (bmi < 35) 
            bewertung = "Adipositas Grad I";
        else bewertung = "Adipositas Grad II"; 
        document.getElementById("ergebnis").textContent = `BMI: ${bmi} (${bewertung})`; 
    } 
    else { alert("Bitte gültige Werte eingeben!"); } 
});