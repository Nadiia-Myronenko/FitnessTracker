//Zitate

let zitate = [];

// Funktion: zufälliges Zitat anzeigen
function zeigeZufallsZitat() {
    if (zitate.length === 0) return;
    const zufallsIndex = Math.floor(Math.random() * zitate.length);
    const zufallsZitat = zitate[zufallsIndex];
    document.getElementById("zitat").textContent = zufallsZitat.zitat;
    document.getElementById("autor").textContent = "– " + zufallsZitat.autor;
}

// JSON-Datei laden
fetch("zitate.json")
    .then(response => {
    if (!response.ok) {
        throw new Error("Fehler beim Laden der JSON-Datei");
    }
    return response.json();
    })
    .then(data => {
    zitate = data.zitate;
    zeigeZufallsZitat(); // erstes Zitat beim Start anzeigen
    })
    .catch(error => {
    document.getElementById("zitat").textContent = "Fehler: " + error.message;
    });

// Klick-Event für den Button
document.getElementById("neuesZitat").addEventListener("click", zeigeZufallsZitat);


//BMI
document.getElementById("berechne").addEventListener("click", function() { 
    const gewicht = parseFloat(document.getElementById("gewicht").value);
    const groesse = parseFloat(document.getElementById("groesse").value) / 100; // in m
    if (gewicht > 0 && groesse > 0) {

        //Berechnung BMI
        const bmi = (gewicht / (groesse * groesse)).toFixed(1);

        //Bewertung BMI
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

        //Berechnung Idealgewicht
        let idealgewichtMin = (18.5 * groesse * groesse).toFixed(1);
        let idealgewichtMax = (24.9 * groesse * groesse).toFixed(1);
        document.getElementById("idealgewicht").textContent = `Idealgewicht: von ${idealgewichtMin} bis ${idealgewichtMax} kg`;
    } 
    else { alert("Bitte gültige Werte eingeben!"); } 
});