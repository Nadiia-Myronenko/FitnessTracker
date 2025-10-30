document.addEventListener("DOMContentLoaded", function () {

    // ------------------ Zitate ------------------
    let zitate = [];

    // Funktion: zufälliges Zitat anzeigen
    function zeigeZufallsZitat() {
        if (zitate.length === 0) return;
        const zufallsIndex = Math.floor(Math.random() * zitate.length);
        const zufallsZitat = zitate[zufallsIndex];
        document.getElementById("zitat").textContent = zufallsZitat.zitat;
        document.getElementById("author").textContent = "(" + zufallsZitat.autor + ")";
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
            zitate = data.zitate; // komplettes Array speichern
            zeigeZufallsZitat();   // erstes Zitat beim Seitenstart anzeigen
        })
        .catch(error => {
            document.getElementById("zitat").textContent = "Fehler: " + error.message;
        });

    // Button Event: Neues Zitat
    document.getElementById("NeuesZitat").addEventListener("click", zeigeZufallsZitat);

    // ------------------ BMI ------------------
    document.getElementById("berechne").addEventListener("click", function (event) {
        event.preventDefault(); // Verhindert das Standard-Formular-Submit

        const gewicht = parseFloat(document.getElementById("gewicht").value);
        const groesse = parseFloat(document.getElementById("groesse").value) / 100; // in m

        if (gewicht > 0 && groesse > 0) {
            const bmi = (gewicht / (groesse * groesse)).toFixed(1);

            // Bewertung
            let bewertung = "";
            if (bmi < 18.5) bewertung = "Untergewicht";
            else if (bmi < 25) bewertung = "Normalgewicht";
            else if (bmi < 30) bewertung = "Übergewicht";
            else if (bmi < 35) bewertung = "Adipositas Grad I";
            else bewertung = "Adipositas Grad II";

            document.getElementById("ergebnis").textContent = `BMI: ${bmi} (${bewertung})`;

            // Idealgewicht
            const idealgewichtMin = (18.5 * groesse * groesse).toFixed(1);
            const idealgewichtMax = (24.9 * groesse * groesse).toFixed(1);
            document.getElementById("idealgewicht").textContent = `Idealgewicht: von ${idealgewichtMin} bis ${idealgewichtMax} kg`;
        } else {
            alert("Bitte gültige Werte eingeben!");
        }
    });
    // ------------------ Zitate ------------------
    function aktualisiereListe() {
        const liste = document.getElementById("liste");
        if (!liste) return; // falls das Element noch nicht existiert

        liste.innerHTML = "";

        aktivitaeten.forEach((eintrag, index) => {
            const li = document.createElement("li");
            li.textContent = `${eintrag.datum}: ${eintrag.name || eintrag.aktivitaet} – ${eintrag.dauer} Min.`;

            // kleines Lösch-Button (optional, nützlich)
            const loeschBtn = document.createElement("button");
            loeschBtn.type = "button";
            loeschBtn.textContent = "✖";
            loeschBtn.classList.add("loesch-btn");
            loeschBtn.addEventListener("click", () => {
                aktivitaeten.splice(index, 1);
                aktualisiereListe();
            });

            li.appendChild(loeschBtn);
            liste.appendChild(li);
        });
    }
    const aktivitaeten = [];

    document.getElementById("hinzufuegen").addEventListener("click", function () {
        const name = document.getElementById("aktivitaet").value;
        const dauer = parseInt(document.getElementById("dauer").value);
        if (!dauer || dauer <= 0) {
            alert("Bitte gültige Dauer eingeben!");
            return;
        }
        aktivitaeten.push({ name, dauer, datum: new Date().toLocaleDateString() });
        aktualisiereListe();
    });
});