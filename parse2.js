const fs = require('fs');

const ECOLOGY_BANK = {
  title: "بنك أسئلة علم البيئة",
  subtitle: "مراجعة وواجبات شاملة",
  units: []
};

// Instead of reading the file, I will just paste the json string
const jsonString = fs.readFileSync('exam_questions.json', 'utf8');
const data = JSON.parse(jsonString);

data.sheets.forEach((sheet, i) => {
  const unit = {
    id: 'sheet' + (i+1),
    name: sheet.sheet,
    sub: 'صفحة ' + sheet.page,
    sections: []
  };

  sheet.sections.forEach(sec => {
    const section = {
      name: sec.instruction,
      questions: []
    };

    sec.questions.forEach(q => {
      let type = sec.type;
      let outQ = { q: q.q };

      if (type === "essay" || type === "ordering" || type === "fill_table") {
        outQ.type = "essay";
        outQ.answer = q.student_answer || "";
      } else if (type === "fill_blank") {
        outQ.type = "fill";
        outQ.answer = q.student_answer || "";
      } else if (type === "underline_replace") {
        outQ.type = "correct";
        outQ.answer = q.student_answer || "";
      } else if (type === "true_false") {
        outQ.type = "tf";
        outQ.answer = (q.student_answer === "✓");
      } else if (type === "multiple_choice") {
        outQ.type = "mcq";
        outQ.options = q.options;
        let ansIdx = q.options.findIndex(opt => opt === q.student_answer);
        if (ansIdx === -1) ansIdx = 0; 
        outQ.answer = ansIdx;
      }

      section.questions.push(outQ);
    });

    unit.sections.push(section);
  });

  ECOLOGY_BANK.units.push(unit);
});

const fileContent = '// بنك الأسئلة — علم البيئة\n' +
'// تم توليده تلقائياً\n\n' +
'const ECOLOGY_BANK = ' + JSON.stringify(ECOLOGY_BANK, null, 2) + ';\n';

fs.writeFileSync('ecology-bank.js', fileContent);
