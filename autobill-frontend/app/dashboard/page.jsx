"use client";
import { useState } from "react";
import Papa from "papaparse";
import { jsPDF } from "jspdf";

export default function Page() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleCSV(e) {
    setError("");
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setRows(results.data);
      },
      error: (err) => setError(err.message),
    });
  }

  function generateInvoice(row, index) {
    // Champs attendus
    const date = row.date || "";
    const client = row.client || "";
    const adresse = row.adresse || "";
    const produit = row.produit || "";
    const quantite = Number(row.quantite || 1);
    const prixHT = Number(row.prixHT || 0);
    const tva = Number(row.tva || 0);

    const totalHT = +(quantite * prixHT).toFixed(2);
    const montantTVA = +((totalHT * tva) / 100).toFixed(2);
    const totalTTC = +(totalHT + montantTVA).toFixed(2);

    const doc = new jsPDF();
    // En-tête
    doc.setFontSize(18);
    doc.text("FACTURE", 105, 18, { align: "center" });

    doc.setFontSize(11);
    doc.text(`Date : ${date}`, 14, 30);
    doc.text(`AutoBill 2.0`, 14, 36);
    doc.text(`contact@autobill.app`, 14, 42);

    // Client
    doc.setFont(undefined, "bold");
    doc.text("Client", 150, 30);
    doc.setFont(undefined, "normal");
    const clientBloc = `${client}\n${adresse}`;
    doc.text(clientBloc, 150, 36, { maxWidth: 50 });

    // Ligne produit
    doc.setFont(undefined, "bold");
    doc.text("Désignation", 14, 60);
    doc.text("Qté", 120, 60);
    doc.text("PU HT", 140, 60);
    doc.text("Total HT", 170, 60);
    doc.setFont(undefined, "normal");

    doc.text(produit, 14, 70, { maxWidth: 100 });
    doc.text(String(quantite), 120, 70);
    doc.text(`${prixHT.toFixed(2)} €`, 140, 70);
    doc.text(`${totalHT.toFixed(2)} €`, 170, 70);

    // Totaux
    doc.line(14, 80, 196, 80);
    doc.text(`TVA (${tva}%) : ${montantTVA.toFixed(2)} €`, 140, 90);
    doc.setFont(undefined, "bold");
    doc.text(`TOTAL TTC : ${totalTTC.toFixed(2)} €`, 140, 100);
    doc.setFont(undefined, "normal");

    // Pied
    doc.setFontSize(9);
    doc.text("Facture générée automatiquement par AutoBill 2.0", 14, 285);

    const name = `facture_${client.replaceAll(" ", "_")}_${index + 1}.pdf`;
    doc.save(name);
  }

  async function generateAll() {
    if (!rows.length) return;
    setLoading(true);
    try {
      rows.forEach((row, i) => generateInvoice(row, i));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section>
      <h1 className="text-3xl font-semibold mb-4">Générer une facture</h1>

      <div className="bg-white p-5 rounded-lg shadow-sm mb-6">
        <p className="text-gray-600 mb-3">
          Importe un fichier CSV avec les colonnes :
          <code className="bg-gray-100 px-2 py-1 rounded ml-2">
            date, client, adresse, produit, quantite, prixHT, tva
          </code>
        </p>
        <input
          type="file"
          accept=".csv"
          onChange={handleCSV}
          className="border border-gray-300 p-2 rounded w-full max-w-md"
        />
        {error && <p className="text-red-600 mt-2">{error}</p>}
      </div>

      {rows.length > 0 && (
        <div className="bg-white p-5 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-semibold">Aperçu ({rows.length} lignes)</h2>
            <button
              onClick={generateAll}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? "Génération..." : "Générer toutes les factures"}
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-2 pr-4">Date</th>
                  <th className="py-2 pr-4">Client</th>
                  <th className="py-2 pr-4">Produit</th>
                  <th className="py-2 pr-4">Qté</th>
                  <th className="py-2 pr-4">Prix HT</th>
                  <th className="py-2 pr-4">TVA %</th>
                  <th className="py-2 pr-4"></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i} className="border-b last:border-0">
                    <td className="py-2 pr-4">{r.date}</td>
                    <td className="py-2 pr-4">{r.client}</td>
                    <td className="py-2 pr-4">{r.produit}</td>
                    <td className="py-2 pr-4">{r.quantite}</td>
                    <td className="py-2 pr-4">{r.prixHT}</td>
                    <td className="py-2 pr-4">{r.tva}</td>
                    <td className="py-2 pr-4">
                      <button
                        onClick={() => generateInvoice(r, i)}
                        className="text-blue-600 hover:underline"
                      >
                        PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
