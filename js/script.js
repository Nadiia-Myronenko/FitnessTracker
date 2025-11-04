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
        const alter = parseFloat(document.getElementById("alter").value);
        if (alter >= 18){
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
            alert("Bitte gültige Werte eingeben! Sie müssen größer als 0 sein!");
        }
        } else {alert("Dieser BMI-Rechner ist für Erwachsene ab 18 Jahren geeignet.");}
    });
    // -------------- Gewichtsstat speichern ------------
    let gewichtsdaten = JSON.parse(localStorage.getItem("gewichtsdaten") || "[]");

    function speichereGewicht() {
        localStorage.setItem("gewichtsdaten", JSON.stringify(gewichtsdaten));
    }

    function aktualisiereGewichtListe() {
        const liste = document.getElementById("gewichtListe");
        liste.innerHTML = "";

        gewichtsdaten.forEach((eintrag, index) => {
            const li = document.createElement("li");
            li.textContent = `${eintrag.datum}: ${eintrag.gewicht} kg`;

            const loeschBtn = document.createElement("button");
            loeschBtn.textContent = "X";
            loeschBtn.classList.add("loesch-btn");
            loeschBtn.addEventListener("click", () => {
                gewichtsdaten.splice(index, 1);
                speichereGewicht();
                aktualisiereGewichtListe();
            });

            li.appendChild(loeschBtn);
            liste.appendChild(li);
        });
    }

    document.getElementById("gewichtHinzufuegen").addEventListener("click", () => {
        const gewicht = parseFloat(document.getElementById("gewicht").value);

        if (!gewicht || gewicht <= 0) {
            alert("Bitte gültiges Gewicht eingeben!");
            return;
        }

        gewichtsdaten.push({
            gewicht,
            datum: new Date().toLocaleDateString()
        });

        speichereGewicht();
        aktualisiereGewichtListe();

        document.getElementById("gewicht").value = "";
    });

    aktualisiereGewichtListe();

    // ------------------ Diagramm: Gewicht über Zeit ------------------
let chart;
function aktualisiereDiagram() {
    const xValues = gewichtsdaten.map(e => e.datum);
    const yValues = gewichtsdaten.map(e => e.gewicht);

    const ctx = document.getElementById('gewichtChart');

    if (chart) chart.destroy();

    chart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: xValues,
            datasets: [{
                label: "", // 🔸 Kein Label -> keine "undefined"-Anzeige
                backgroundColor: "#ffcc99",
                data: yValues
            }]
        },
        options: {
            plugins: {
                legend: { display: false }, // 🔸 Hier gehört es hin
                title: {
                    display: true,
                    text: "Gewichtsverlauf"
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    min: Math.min(...yValues) - 0.5,
                    max: Math.max(...yValues) + 0.5,
                    title: {
                        display: true,
                        text: "Gewicht (kg)",
                        font: { weight: 'bold', size: 14 }
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: "Datum",
                        font: { weight: 'bold', size: 14 }
                    }
                }
            }
        }
    });
}

aktualisiereDiagram();

document
  .getElementById("gewichtsHistory")
  .addEventListener("click", aktualisiereDiagram);

    // ------------------ Aktivitaeten  ------------------
    let aktivitaeten = [];

    //  Daten aus localStorage laden
    if (localStorage.getItem("aktivitaeten")) {
        aktivitaeten = JSON.parse(localStorage.getItem("aktivitaeten"));
    }

    function speichereDaten() {
        localStorage.setItem("aktivitaeten", JSON.stringify(aktivitaeten));
    }

    function aktualisiereListe() {
        const liste = document.getElementById("aktivitaetenListe");
        if (!liste) return;

        liste.innerHTML = "";

        aktivitaeten.forEach((eintrag, index) => {
            const li = document.createElement("li");
            li.textContent = `${eintrag.datum}: ${eintrag.name || eintrag.aktivitaet} – ${eintrag.dauer} Min.`;

            const loeschBtn = document.createElement("button");
            loeschBtn.type = "button";
            loeschBtn.textContent = "X";
            loeschBtn.classList.add("loesch-btn");
            loeschBtn.addEventListener("click", () => {
                aktivitaeten.splice(index, 1);
                speichereDaten(); // nach Löschen speichern
                aktualisiereListe();
            });

            li.appendChild(loeschBtn);
            liste.appendChild(li);
        });
    }

    document.getElementById("hinzufuegen").addEventListener("click", function () {
        const name = document.getElementById("aktivitaet").value.trim();
        const dauer = parseInt(document.getElementById("dauer").value);
        if (!name) {
            alert("Bitte eine Aktivität eingeben!");
            return;
        }
        if (!dauer || dauer <= 0) {
            alert("Bitte gültige Dauer eingeben!");
            return;
        }

        aktivitaeten.push({ name, dauer, datum: new Date().toLocaleDateString() });
        speichereDaten(); // nach Hinzufügen speichern
        aktualisiereListe();

        // Eingabefelder zurücksetzen
        document.getElementById("aktivitaet").value = "";
        document.getElementById("dauer").value = "";
    });

    // Liste beim Laden der Seite anzeigen
    aktualisiereListe();
});

//---------------Scroll nach oben Button ------------

// Get the button:
let mybutton = document.getElementById("scrollTopButton");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}