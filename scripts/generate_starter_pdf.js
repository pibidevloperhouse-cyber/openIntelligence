const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

async function createStarterPdf() {
  const docsDir = path.join(process.cwd(), 'public', 'docs');
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
  }

  const outputPath = path.join(docsDir, 'PiBi_Open_Intelligence_Builder_Kit.pdf');
  const doc = new PDFDocument({
    margin: 50,
    size: 'A4',
  });

  const stream = fs.createWriteStream(outputPath);
  doc.pipe(stream);

  // Background accent banner
  doc.rect(0, 0, doc.page.width, 130).fill('#081528');

  // Title in header
  doc.fillColor('#2ec4b6').fontSize(12).font('Helvetica-Bold')
     .text('PIBI OPEN INTELLIGENCE', 50, 35, { characterSpacing: 2 });

  doc.fillColor('#ffffff').fontSize(22).font('Helvetica-Bold')
     .text('Student Project Awards 2026', 50, 55);

  doc.fillColor('#94a3b8').fontSize(11).font('Helvetica')
     .text("Builder's Kit & LinkedIn Announcement Guide", 50, 85);

  // Decorative line
  doc.rect(50, 115, doc.page.width - 100, 3).fill('#2ec4b6');

  // Body Content
  let y = 150;

  doc.fillColor('#0f172a').fontSize(18).font('Helvetica-Bold')
     .text("Welcome to the Builder's Network!", 50, y);
  
  y += 28;
  doc.fillColor('#334155').fontSize(10.5).font('Helvetica').lineGap(4)
     .text(
       "Congratulations on submitting your AI/ML project to the PiBi Open Intelligence Student Project Awards 2026! " +
       "By registering, you have joined a premier community of engineering students, researchers, and innovators working to bridge classroom concepts with real-world open intelligence systems.",
       50, y, { width: doc.page.width - 100 }
     );

  y += 65;
  // Core Motto Box
  doc.roundedRect(50, y, doc.page.width - 100, 40, 6)
     .fillAndStroke('#f0fdfa', '#2ec4b6');

  doc.fillColor('#0e7490').fontSize(11).font('Helvetica-Bold')
     .text("OUR CORE PHILOSOPHY: LEARN  *  BUILD  *  CONTRIBUTE", 65, y + 14, {
       characterSpacing: 1.5,
       align: 'center',
       width: doc.page.width - 130
     });

  y += 60;
  // Section: Step-by-Step LinkedIn Announcement Guide
  doc.fillColor('#0f172a').fontSize(14).font('Helvetica-Bold')
     .text("How to Share Your Builder Badge on LinkedIn", 50, y);

  y += 22;
  doc.fillColor('#475569').fontSize(10).font('Helvetica').lineGap(3)
     .text(
       "1. Visit your confirmation screen or confirmation email to download your official 1200x1200px PNG Builder Badge.\n" +
       "2. Open LinkedIn and create a new post.\n" +
       "3. Attach your downloaded digital badge image.\n" +
       "4. Copy and paste the official announcement template below.\n" +
       "5. Tag your teammates, mentors, and #PiBiOpenIntelligence!",
       50, y, { width: doc.page.width - 100 }
     );

  y += 95;
  // LinkedIn Post Template Box
  doc.roundedRect(50, y, doc.page.width - 100, 195, 6)
     .fillAndStroke('#0f172a', '#1e293b');

  doc.fillColor('#2ec4b6').fontSize(9).font('Helvetica-Bold')
     .text("OFFICIAL LINKEDIN POST TEMPLATE (COPY & SHARE)", 65, y + 15, { characterSpacing: 1 });

  const postText = 
`🚀 I've taken a step beyond the classroom!

I've registered my AI/ML project for the PiBi Open Intelligence Student Project Awards 2026.

I believe student projects shouldn't end with a final-year presentation. They should be shared, improved, and developed further.

I'm excited to be part of a community that encourages students to learn, build, and contribute.

Are you working on an AI/ML project too? Join me!

🔗 Register here: https://www.pibiopenintelligence.com/students

#PiBiOpenIntelligence #StudentProjects #ArtificialIntelligence #MachineLearning #LearnBuildContribute`;

  doc.fillColor('#e2e8f0').fontSize(9).font('Helvetica').lineGap(2.5)
     .text(postText, 65, y + 35, { width: doc.page.width - 130 });

  y += 215;
  // Next steps & Important Disclaimer
  doc.fillColor('#0f172a').fontSize(12).font('Helvetica-Bold')
     .text("Important Information & Next Steps", 50, y);

  y += 18;
  doc.fillColor('#64748b').fontSize(8.5).font('Helvetica').lineGap(3)
     .text(
       "* Evaluation & Review: The jury reviews registered prototypes on technical execution, innovation, and open community impact.\n" +
       "* Participation Disclaimer: This registration badge confirms registration only. It does not represent project evaluation, finalist selection, or an award.\n" +
       "* Updates & Mentorship: Watch your inbox for evaluation updates and shortlist announcements.\n" +
       "* Community Hub: Explore open intelligence resources, datasets, and MCP templates at https://www.pibiopenintelligence.com",
       50, y, { width: doc.page.width - 100 }
     );

  // Footer
  doc.fontSize(8).fillColor('#94a3b8')
     .text("PiBi Open Intelligence · PiBi Foundation · Madurai AI Community", 50, doc.page.height - 35, {
       align: 'center',
       width: doc.page.width - 100
     });

  doc.end();

  return new Promise((resolve, reject) => {
    stream.on('finish', () => {
      console.log('Starter PDF generated successfully at:', outputPath);
      resolve(outputPath);
    });
    stream.on('error', reject);
  });
}

createStarterPdf().catch(console.error);
