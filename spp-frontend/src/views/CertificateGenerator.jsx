import React, { useState } from "react";
import jsPDF from "jspdf";

export default function CertificateGenerator({ students }) {
  const [selectedStudent, setSelectedStudent] = useState(null);

  const generateCertificate = (student) => {
    const doc = new jsPDF("landscape");
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Background
    doc.setFillColor(220, 240, 255);
    doc.rect(10, 10, pageWidth - 20, pageHeight - 20, "F");

    // Border
    doc.setDrawColor(0, 120, 212);
    doc.setLineWidth(3);
    doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

    // Certificate Title
    doc.setFontSize(28);
    doc.setTextColor(0, 120, 212);
    doc.text("CERTIFICATE OF ACHIEVEMENT", pageWidth / 2, 40, { align: "center" });

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text("This is to certify that", pageWidth / 2, 70, { align: "center" });

    doc.setFontSize(20);
    doc.setTextColor(0, 120, 212);
    doc.text(student.name, pageWidth / 2, 95, { align: "center" });

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text("Has demonstrated exceptional academic performance", pageWidth / 2, 120, { align: "center" });

    const latestTest = student.mockTests[student.mockTests.length - 1];
    if (latestTest) {
      doc.text(`Achieving a Category ${latestTest.category.split(" ")[1]} classification`, pageWidth / 2, 145, { align: "center" });
    }

    doc.text(`Date: ${new Date().toLocaleDateString()}`, pageWidth / 2, 180, { align: "center" });

    doc.save(`${student.name}_certificate.pdf`);
  };

  const topPerformers = students.filter(s => {
    const latest = s.mockTests[s.mockTests.length - 1];
    return latest && latest.category === "Category A (Top Tier)";
  });

  return (
    <div className="container">
      <div className="header">
        <h1>🏆 Certificate Generator</h1>
        <p className="subtitle">Generate certificates for top performers</p>
      </div>

      <div className="section">
        <h2>Top Performers ({topPerformers.length})</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {topPerformers.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)' }}>No top performers yet</p>
          ) : (
            topPerformers.map(student => (
              <div key={student.id} style={{ padding: '1rem', background: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--border-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4>{student.name}</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Index: {student.indexNumber}</p>
                </div>
                <button 
                  className="btn-primary"
                  onClick={() => generateCertificate(student)}
                >
                  📄 Generate Certificate
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
