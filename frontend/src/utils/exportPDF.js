import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const PRIMARY = [99, 102, 241];
const DARK    = [15, 23, 42];

const addHeader = (doc, title, subtitle = '') => {
  doc.setFillColor(...PRIMARY);
  doc.rect(0, 0, 210, 28, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(15); doc.setFont('helvetica', 'bold');
  doc.text('Student Management System', 14, 12);
  doc.setFontSize(10); doc.setFont('helvetica', 'normal');
  doc.text(title, 14, 21);
  if (subtitle) { doc.setFontSize(9); doc.text(subtitle, 14, 26); }
  doc.setTextColor(210, 210, 255); doc.setFontSize(9);
  doc.text(`Generated: ${new Date().toLocaleString('en-IN')}`, 140, 21);
  doc.setTextColor(...DARK);
};

export const exportStudentsPDF = (students) => {
  const doc = new jsPDF();
  addHeader(doc, 'Student List Report', `Total: ${students.length} students`);
  autoTable(doc, {
    startY: 34,
    head: [['#', 'Name', 'Email', 'Phone', 'Course', 'Age']],
    body: students.map((s, i) => [i + 1, s.name, s.email, s.phone || '—', s.course, s.age || '—']),
    headStyles: { fillColor: PRIMARY, textColor: 255, fontStyle: 'bold', fontSize: 9 },
    bodyStyles: { fontSize: 9 },
    alternateRowStyles: { fillColor: [245, 247, 255] },
    styles: { cellPadding: 4 },
  });
  doc.save(`students-${Date.now()}.pdf`);
};

export const exportMarksPDF = (marks, examType = 'Final') => {
  const doc = new jsPDF();
  addHeader(doc, `Marks Report — ${examType}`, `Total: ${marks.length} records`);
  autoTable(doc, {
    startY: 34,
    head: [['#', 'Student', 'Course', 'Subject', 'Marks', 'Grade']],
    body: marks.map((m, i) => {
      const g = m.marks >= 90 ? 'A+' : m.marks >= 80 ? 'A' : m.marks >= 70 ? 'B+' : m.marks >= 60 ? 'B' : 'C';
      return [i + 1, m.studentId?.name || '—', m.studentId?.course || '—', m.subject, `${m.marks}%`, g];
    }),
    headStyles: { fillColor: PRIMARY, textColor: 255, fontStyle: 'bold', fontSize: 9 },
    bodyStyles: { fontSize: 9 },
    alternateRowStyles: { fillColor: [245, 247, 255] },
    styles: { cellPadding: 4 },
  });
  doc.save(`marks-${examType.toLowerCase()}-${Date.now()}.pdf`);
};

export const exportAttendancePDF = (records) => {
  const doc = new jsPDF();
  addHeader(doc, 'Attendance Report', `Total: ${records.length} records`);
  autoTable(doc, {
    startY: 34,
    head: [['#', 'Student', 'Subject', 'Date', 'Status']],
    body: records.map((r, i) => [
      i + 1,
      r.studentId?.name || '—',
      r.subject,
      new Date(r.date).toLocaleDateString('en-IN'),
      r.status,
    ]),
    headStyles: { fillColor: PRIMARY, textColor: 255, fontStyle: 'bold', fontSize: 9 },
    bodyStyles: { fontSize: 9 },
    alternateRowStyles: { fillColor: [245, 247, 255] },
    styles: { cellPadding: 4 },
    didParseCell: (data) => {
      if (data.column.index === 4 && data.section === 'body') {
        const v = data.cell.raw;
        data.cell.styles.textColor =
          v === 'Present' ? [16, 185, 129] : v === 'Absent' ? [239, 68, 68] : [245, 158, 11];
      }
    },
  });
  doc.save(`attendance-${Date.now()}.pdf`);
};
