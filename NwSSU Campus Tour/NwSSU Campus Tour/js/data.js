// ============================================================
// NWSSU Campus Tour — Data Store
// ============================================================

const BUILDINGS = [
  {
    id: 'cat', name: 'College of Agriculture Building', abbr: 'CAT',
    type: 'academic', color: '#2d5a27', emoji: '🌾',
    photo: 'images/cat_logo.jpg',
    desc: 'Home of the College of Agriculture and Technology, offering programs in agricultural sciences, crop production, animal science, and agri-business management. The building features modern laboratories, demonstration farms, and classrooms.',
    location: 'North Wing, Campus',
    offices: ['Dean\'s Office', 'Faculty Room', 'Agricultural Laboratory', 'Student Affairs', 'Research Center'],
    programs: ['BS Agriculture', 'BS Agricultural Engineering', 'BS Horticulture'],
    dept: 'cat'
  },
  {
    id: 'ccis', name: 'College of Computing & Information Sciences Building', abbr: 'CCIS',
    type: 'academic', color: '#1a3a6b', emoji: '💻',
    photo: 'images/Me.jpg',
    desc: 'State-of-the-art building equipped with modern computer laboratories, networking rooms, and smart classrooms. Hosts the newest college at NWSSU, offering technology-focused programs to prepare students for the digital economy.',
    location: 'North-Central Wing, Campus',
    offices: ['Dean\'s Office', 'Computer Lab 1', 'Computer Lab 2', 'Networking Lab', 'Faculty Room', 'CCIS Student Council'],
    programs: ['BS Computer Science', 'BS Information Technology', 'BS Information Systems'],
    dept: 'ccis'
  },
  {
    id: 'ccjs', name: 'College of Criminal Justice & Science Building', abbr: 'CCJS',
    type: 'academic', color: '#8b1a1a', emoji: '⚖️',
    photo: 'images/ccjs_logo.png',
    desc: 'Training ground for future law enforcement professionals and criminologists. Features a moot court, forensic science laboratory, and simulation rooms for practical police science training.',
    location: 'East Wing, Campus',
    offices: ['Dean\'s Office', 'Forensic Lab', 'Moot Court Room', 'Faculty Room', 'CCJS Student Council'],
    programs: ['BS Criminology'],
    dept: 'ccjs'
  },
  {
    id: 'coed', name: 'College of Education Building', abbr: 'COED',
    type: 'academic', color: '#c8a84b', emoji: '🎓',
    photo: 'images/coed_logo.jpg',
    desc: 'Dedicated to training future educators with a focus on pedagogical excellence. Features demonstration classrooms, a micro-teaching facility, and a curriculum resource center to support teacher education programs.',
    location: 'North-East Wing, Campus',
    offices: ['Dean\'s Office', 'Curriculum Center', 'Micro-Teaching Lab', 'Faculty Room', 'COED Student Council'],
    programs: ['Bachelor of Elementary Education', 'Bachelor of Secondary Education', 'Bachelor of Special Needs Education'],
    dept: 'coed'
  },
  {
    id: 'con', name: 'College of Nursing Building', abbr: 'CON',
    type: 'academic', color: '#1a6b5a', emoji: '🏥',
    photo: 'images/con_logo.jpg',
    desc: 'A modern nursing building featuring state-of-the-art simulation laboratories, skill stations, and clinical training facilities. Prepares students for both local and international nursing careers.',
    location: 'West Wing, Campus',
    offices: ['Dean\'s Office', 'Nursing Skills Lab', 'Simulation Room', 'Faculty Room', 'CON Student Council', 'Clinical Training Office'],
    programs: ['BS Nursing'],
    dept: 'con'
  },
  {
    id: 'com', name: 'College of Management Building', abbr: 'COM',
    type: 'academic', color: '#b5611a', emoji: '📊',
    photo: 'images/com_logo.png',
    desc: 'Hub for business and management education at NWSSU. Equipped with business simulation rooms, accounting labs, and a mini-hotel training facility for hospitality management students.',
    location: 'Central-West Wing, Campus',
    offices: ['Dean\'s Office', 'Accounting Lab', 'Business Simulation Room', 'Faculty Room', 'COM Student Council'],
    programs: ['BS Business Administration', 'BS Accountancy', 'BS Hotel and Restaurant Management', 'BS Entrepreneurship'],
    dept: 'com'
  },
  {
    id: 'cea', name: 'College of Engineering & Architecture Building', abbr: 'CEA',
    type: 'academic', color: '#4a1a6b', emoji: '🏗️',
    photo: 'images/cea_logo.jpg',
    desc: 'Engineering and Architecture hub featuring specialized labs, drafting rooms, a materials testing laboratory, and a CAD center. Prepares students for professional engineering and architectural licensure examinations.',
    location: 'North-East Campus',
    offices: ['Dean\'s Office', 'CAD Laboratory', 'Materials Testing Lab', 'Drafting Room', 'Faculty Room', 'CEA Student Council'],
    programs: ['BS Civil Engineering', 'BS Electrical Engineering', 'BS Mechanical Engineering', 'BS Architecture'],
    dept: 'cea'
  },
  {
    id: 'library', name: 'University Library', abbr: 'LIB',
    type: 'facility', color: '#445566', emoji: '📚',
    photo: '',
    desc: 'The NWSSU Library serves as the primary resource center for students, faculty, and staff. It houses thousands of books, periodicals, local and foreign journals, theses, dissertations, and digital resources via the library management system.',
    location: 'Central Campus',
    offices: ['Reference Section', 'Circulation Desk', 'Periodicals Section', 'Digital Library Section', 'Filipiniana Section', 'Thesis & Dissertation Section'],
    hours: 'Mon–Fri: 7:00 AM – 9:00 PM | Sat: 8:00 AM – 5:00 PM',
  },
  {
    id: 'registrar', name: 'Registrar\'s Office Building', abbr: 'REG',
    type: 'admin', color: '#334455', emoji: '📋',
    photo: '',
    desc: 'The Office of the University Registrar handles all student records, enrollment, transcript of records, certifications, and other academic documents. Students must present a valid NWSSU ID for document requests.',
    location: 'Central Campus, Ground Floor',
    offices: ['Registrar Office', 'Records Section', 'Certification Desk', 'Enrollment Counter'],
    hours: 'Mon–Fri: 8:00 AM – 5:00 PM',
  },
  {
    id: 'cashier', name: 'Cashier\'s Office Building', abbr: 'CASH',
    type: 'admin', color: '#334455', emoji: '💳',
    photo: '',
    desc: 'The Cashier\'s Office handles all financial transactions including tuition payment, miscellaneous fees, scholarship disbursements, and other university-related payments.',
    location: 'Central Campus, Ground Floor',
    offices: ['Cashier Windows 1–4', 'Scholarship Desk', 'Finance Records'],
    hours: 'Mon–Fri: 8:00 AM – 5:00 PM',
  },
  {
    id: 'president', name: 'Administration Building', abbr: 'ADMIN',
    type: 'admin', color: '#2c3e50', emoji: '🏛️',
    photo: '',
    desc: 'The main administrative hub of NWSSU, housing the Office of the University President, Vice Presidents, Human Resources, and key administrative offices. The nerve center of the university\'s operations and strategic direction.',
    location: 'Central Campus',
    offices: ['Office of the President', 'VP Academic Affairs', 'VP Administration & Finance', 'Human Resources', 'Planning & Development', 'Research & Extension', 'International Linkages', 'Public Relations'],
    hours: 'Mon–Fri: 8:00 AM – 5:00 PM',
  },
  {
    id: 'alumni', name: 'Alumni Building', abbr: 'ALU',
    type: 'facility', color: '#556677', emoji: '🎓',
    photo: '',
    desc: 'The Alumni Building serves as the headquarters of the NWSSU Alumni Association and hosts reunions, alumni networking events, career fairs, and development programs for graduates.',
    location: 'South Wing, Campus',
    offices: ['Alumni Affairs Office', 'Career Services', 'Event Hall'],
    hours: 'Mon–Fri: 8:00 AM – 5:00 PM',
  },
  {
    id: 'sociocultural', name: 'Socio-Cultural Building', abbr: 'SCB',
    type: 'facility', color: '#556677', emoji: '🎭',
    photo: '',
    desc: 'Dedicated to the arts, culture, and social development programs of NWSSU. Features an auditorium, rehearsal spaces, and exhibit areas for the university\'s cultural troupes and events.',
    location: 'South-Central Campus',
    offices: ['Cultural Office', 'Auditorium', 'Rehearsal Rooms', 'Exhibit Area'],
    hours: 'Mon–Sat: 8:00 AM – 8:00 PM',
  },
  {
    id: 'studentcouncil', name: 'Student Council Building', abbr: 'SC',
    type: 'facility', color: '#556677', emoji: '⭐',
    photo: '',
    desc: 'Home of the NWSSU Supreme Student Council and various student organization offices. A hub of student governance, leadership development, and extracurricular activities.',
    location: 'South-Central Campus',
    offices: ['Supreme Student Council Office', 'Student Organizations Room', 'Student Affairs Office'],
    hours: 'Mon–Sat: 8:00 AM – 6:00 PM',
  },
  {
    id: 'hotel', name: 'NWSSU Hotel & Restaurant', abbr: 'HTL',
    type: 'facility', color: '#556677', emoji: '🏨',
    photo: '',
    desc: 'A fully operational training hotel and restaurant managed by COM students under faculty supervision. Provides real-world hospitality experience while offering affordable accommodation and dining to university guests.',
    location: 'South Wing, Campus',
    offices: ['Front Desk', 'Training Restaurant', 'Housekeeping', 'Kitchen Training Area'],
    hours: 'Daily: 7:00 AM – 10:00 PM',
  },
  {
    id: 'canteen', name: 'University Canteen', abbr: 'CAN',
    type: 'facility', color: '#556677', emoji: '🍽️',
    photo: '',
    desc: 'The main dining facility of NWSSU serving affordable Filipino meals to students, faculty, and staff. Multiple food stalls offer a variety of local dishes, snacks, and beverages throughout the day.',
    location: 'South-East Campus',
    offices: ['Canteen Management Office', 'Food Stalls 1–8', 'Catering Services'],
    hours: 'Mon–Sat: 6:30 AM – 7:00 PM',
  },
  {
    id: 'sports', name: 'Sports Complex', abbr: 'SC',
    type: 'facility', color: '#2d5a27', emoji: '⚽',
    photo: '',
    desc: 'NWSSU\'s Sports Complex features a basketball gymnasium, volleyball courts, a track oval, and open fields for various sports. Home of the university\'s athletics programs and intramural competitions.',
    location: 'South-West Campus',
    offices: ['Sports Coordinator\'s Office', 'Gym', 'Equipment Room', 'Athletics Office'],
    hours: 'Mon–Fri: 5:00 AM – 9:00 PM | Weekends: 6:00 AM – 8:00 PM',
  },
];

const DEPARTMENTS = [
  {
    id: 'cat', name: 'College of Agriculture and Technology', abbr: 'CAT', color: '#2d5a27',
    photo: 'images/cat_logo.jpg',   // ✅ was ../images/a.jpg — fixed
    programs: ['BS Agriculture (Crop Science)', 'BS Agriculture (Animal Science)', 'BS Agricultural Engineering', 'BS Horticulture', 'BS Agri-Business Management'],
    faculty: ['Dr. Ramon Villanueva - Dean', 'Prof. Josefina Delos Santos - Crop Science', 'Dr. Eduardo Balmaceda - Animal Science', 'Prof. Leila Navarro - Horticulture', 'Dr. Arnaldo Tupas - Agricultural Engineering', 'Prof. Gloria Castillo - Agri-Business'],
    officers: ['Mr. Carlo Santos - President, CAT SSC', 'Ms. Maricel Reyes - Vice President', 'Mr. John Bautista - Secretary', 'Ms. Rina Cruz - Treasurer'],
    organizations: ['Agricultural Science Society (AGRISCI)', 'Future Farmers of NWSSU (FFN)', 'Horticulture Club', 'Agri-Entrepreneurs Association']
  },
  {
    id: 'ccis', name: 'College of Computing & Information Sciences', abbr: 'CCIS', color: '#1a3a6b',
    photo: 'images/Me.jpg',   // ✅ fixed
    programs: ['BS Computer Science', 'BS Information Technology', 'BS Information Systems', 'BS Software Engineering'],
    faculty: ['Dr. Michelle Tan - Dean', 'Prof. Rodel Bautista - Computer Science', 'Dr. Arvin Dela Cruz - Networking', 'Prof. Sandra Lee - Information Systems', 'Prof. Mia Villanueva - Software Engineering', 'Prof. Noel Aquino - Cybersecurity'],
    officers: ['Ms. Yvonne Natividad - President, CCIS SSC', 'Mr. Allan Reyes - Vice President', 'Ms. Tina Gomez - Secretary', 'Mr. Marco Tan - Treasurer'],
    organizations: ['Computing Society (CompSoc)', 'Developers\' League of NWSSU (DLN)', 'Cybersecurity & Networking Club (CNC)', 'AI & Data Science Club']
  },
  {
    id: 'ccjs', name: 'College of Criminal Justice & Science', abbr: 'CCJS', color: '#8b1a1a',
    photo: 'images/ccjs_logo.png',   // ✅ fixed
    programs: ['BS Criminology'],
    faculty: ['Prof. Roberto Legaspi - Dean', 'SPO2 (Ret.) Amado Ferrer - Police Science', 'Prof. Cecilia Mangubat - Criminalistics', 'Atty. Dario Guzman - Criminal Law', 'Prof. Nora Alcantara - Forensic Science'],
    officers: ['Mr. Jason Cortez - President, CCJS SSC', 'Ms. Maribel Santos - Vice President', 'Mr. Ricky Flores - Secretary', 'Ms. Donna Cruz - Treasurer'],
    organizations: ['Criminology Society of NWSSU (CSN)', 'NWSSU Criminalistics Club', 'Law and Order Forum']
  },
  {
    id: 'coed', name: 'College of Education', abbr: 'COED', color: '#c8a84b',
    photo: 'images/coed_logo.jpg',   // ✅ fixed
    programs: ['Bachelor of Elementary Education (BEEd)', 'Bachelor of Secondary Education (BSEd) - English', 'Bachelor of Secondary Education (BSEd) - Math', 'Bachelor of Secondary Education (BSEd) - Science', 'Bachelor of Special Needs Education (BSNEd)'],
    faculty: ['Dr. Paz Enriquez - Dean', 'Prof. Eduardo Salazar - Educational Psychology', 'Dr. Gloria Reyes - Curriculum & Instruction', 'Prof. Hermie Dela Rosa - Math Education', 'Prof. Connie Navarro - Science Education', 'Prof. Roderick Espinosa - English Education'],
    officers: ['Ms. Kristine Alonzo - President, COED SSC', 'Mr. Julius Mendoza - Vice President', 'Ms. Clarice Bernal - Secretary', 'Mr. Ryan Aquino - Treasurer'],
    organizations: ['Education Students Society (ESS)', 'Math Teachers Club', 'Future Science Educators', 'COED Dance Troupe']
  },
  {
    id: 'con', name: 'College of Nursing', abbr: 'CON', color: '#1a6b5a',
    photo: 'images/con_logo.jpg',   // ✅ fixed
    programs: ['BS Nursing'],
    faculty: ['Dr. Lourdes Catalan - Dean', 'Prof. Alma Hernandez - Medical-Surgical Nursing', 'Dr. Estela Jimenez - Maternal & Child Nursing', 'Prof. Vincent Baysa - Community Health Nursing', 'Prof. Cynthia Abad - Mental Health Nursing'],
    officers: ['Ms. Jennifer Ramos - President, CON SSC', 'Mr. Lorenzo Santiago - Vice President', 'Ms. Carla Vizcarra - Secretary', 'Ms. Bianca Marcos - Treasurer'],
    organizations: ['Nursing Students Association (NSA)', 'NWSSU Student Nurses\' Guild', 'Community Health Volunteers']
  },
  {
    id: 'com', name: 'College of Management', abbr: 'COM', color: '#b5611a',
    photo: 'images/com_logo.png',   // ✅ fixed
    programs: ['BS Business Administration (Marketing)', 'BS Business Administration (Management)', 'BS Accountancy', 'BS Hotel and Restaurant Management', 'BS Entrepreneurship', 'BS Tourism Management'],
    faculty: ['Dr. Shirley Villafuerte - Dean', 'Prof. Domingo Tagle - Business Management', 'CPA Rowena Manlangit - Accountancy', 'Prof. Arlene Tan - Marketing', 'Chef Roberto Abrea - HRM', 'Prof. Glenda Soliman - Tourism'],
    officers: ['Mr. Marco Delgado - President, COM SSC', 'Ms. Patricia Tuazon - Vice President', 'Ms. Rhea Magpayo - Secretary', 'Mr. Vincent Castillo - Treasurer'],
    organizations: ['Junior Entrepreneurs Society (JES)', 'Junior Philippine Institute of Accountants (JPIA)', 'Hotel and Restaurant Management Society (HRMS)', 'Tourism Students Circle']
  },
  {
    id: 'cea', name: 'College of Engineering & Architecture', abbr: 'CEA', color: '#4a1a6b',
    photo: 'images/cea_logo.jpg',   // ✅ fixed
    programs: ['BS Civil Engineering', 'BS Electrical Engineering', 'BS Mechanical Engineering', 'BS Architecture', 'BS Electronics Engineering'],
    faculty: ['Engr. Dante Padua - Dean', 'Engr. Mario Alvarado - Civil Engineering', 'Engr. Ernesto Quizon - Electrical Engineering', 'Engr. Cecilio Bravo - Mechanical Engineering', 'Arch. Florencia Reyes - Architecture', 'Engr. Bobby Palma - Electronics Engineering'],
    officers: ['Mr. Francis Dimaunahan - President, CEA SSC', 'Ms. Ria Mañibo - Vice President', 'Mr. Aldrin Soriano - Secretary', 'Mr. Jefferson Pascual - Treasurer'],
    organizations: ['Society of Civil Engineering Students (SCES)', 'Electrical Engineering Society', 'Mechanical Engineering Club', 'Architecture Students Guild (ASG)', 'Institute of Electronics Engineering Students']
  }
];

const OFFICES = [
  { name: 'Office of the University President', icon: '🏛️', location: 'Admin Building, 2nd Floor', hours: 'Mon–Fri 8AM–5PM', desc: 'Oversees all university operations and strategic direction.' },
  { name: 'VP for Academic Affairs', icon: '🎓', location: 'Admin Building, 2nd Floor', hours: 'Mon–Fri 8AM–5PM', desc: 'Manages academic programs, curriculum, and faculty.' },
  { name: 'VP for Administration & Finance', icon: '💼', location: 'Admin Building, 2nd Floor', hours: 'Mon–Fri 8AM–5PM', desc: 'Handles university finances, infrastructure, and administration.' },
  { name: 'University Registrar', icon: '📋', location: 'Registrar Building, Ground Floor', hours: 'Mon–Fri 8AM–5PM', desc: 'Student records, enrollment, transcripts, and certifications.' },
  { name: 'Cashier\'s Office', icon: '💳', location: 'Cashier Building, Ground Floor', hours: 'Mon–Fri 8AM–5PM', desc: 'Payment of tuition, fees, and financial assistance.' },
  { name: 'Human Resources Office', icon: '👥', location: 'Admin Building, 1st Floor', hours: 'Mon–Fri 8AM–5PM', desc: 'Faculty and staff recruitment, benefits, and records.' },
  { name: 'Student Affairs Office', icon: '🎒', location: 'Student Council Building', hours: 'Mon–Fri 8AM–5PM', desc: 'Student organizations, discipline, welfare, and activities.' },
  { name: 'OSAS (Office of Student Affairs)', icon: '🤝', location: 'Central Campus', hours: 'Mon–Fri 8AM–5PM', desc: 'Coordinates student life programs and services.' },
  { name: 'Guidance & Counseling Office', icon: '💬', location: 'Central Campus', hours: 'Mon–Fri 8AM–5PM', desc: 'Personal, academic, and career counseling for students.' },
  { name: 'Health Services / Clinic', icon: '🏥', location: 'Near Admin Building', hours: 'Mon–Fri 7AM–5PM', desc: 'Free basic medical services for students and staff.' },
  { name: 'Library Office', icon: '📚', location: 'Library Building', hours: 'Mon–Fri 7AM–9PM, Sat 8AM–5PM', desc: 'Access to books, journals, digital resources.' },
  { name: 'Planning & Development Office', icon: '📐', location: 'Admin Building', hours: 'Mon–Fri 8AM–5PM', desc: 'Campus infrastructure, planning, and development.' },
  { name: 'Research & Extension Office', icon: '🔬', location: 'Admin Building, 3rd Floor', hours: 'Mon–Fri 8AM–5PM', desc: 'Research programs, community extension, and publications.' },
  { name: 'International Studies & Linkages', icon: '🌏', location: 'Admin Building', hours: 'Mon–Fri 8AM–5PM', desc: 'International partnerships, exchange programs, and linkages.' },
  { name: 'Public Relations Office', icon: '📣', location: 'Admin Building, Ground Floor', hours: 'Mon–Fri 8AM–5PM', desc: 'University communications, events, and media relations.' },
  { name: 'Supreme Student Council', icon: '⭐', location: 'Student Council Building', hours: 'Mon–Sat 8AM–6PM', desc: 'Student government body representing all NWSSU students.' },
  { name: 'Sports Coordinator\'s Office', icon: '🏆', location: 'Sports Complex', hours: 'Mon–Fri 8AM–5PM', desc: 'University sports teams, intramurals, and athletic programs.' },
  { name: 'NWSSU Hotel & Restaurant', icon: '🏨', location: 'HTL Building', hours: 'Daily 7AM–10PM', desc: 'Training hotel and restaurant for HRM students.' },
];

const ORGANIZATIONS = [
  { name: 'Agricultural Science Society', abbr: 'AGRISCI', college: 'CAT', president: 'Carlo Santos', vp: 'Maricel Reyes', secretary: 'John Bautista' },
  { name: 'Future Farmers of NWSSU', abbr: 'FFN', college: 'CAT', president: 'Rina Cruz', vp: 'Paul Flores', secretary: 'Grace Soriano' },
  { name: 'Computing Society', abbr: 'CompSoc', college: 'CCIS', president: 'Yvonne Natividad', vp: 'Allan Reyes', secretary: 'Tina Gomez' },
  { name: 'Developers\' League of NWSSU', abbr: 'DLN', college: 'CCIS', president: 'Marco Tan', vp: 'Sandra Lee', secretary: 'Efren Santos' },
  { name: 'Cybersecurity & Networking Club', abbr: 'CNC', college: 'CCIS', president: 'Arvin Dela Cruz', vp: 'Mia Villanueva', secretary: 'Noel Aquino' },
  { name: 'Criminology Society of NWSSU', abbr: 'CSN', college: 'CCJS', president: 'Jason Cortez', vp: 'Lydia Santos', secretary: 'Roger Bello' },
  { name: 'Education Students Society', abbr: 'ESS', college: 'COED', president: 'Kristine Alonzo', vp: 'Joseph dela Rosa', secretary: 'Annie Cruz' },
  { name: 'Nursing Students Association', abbr: 'NSA', college: 'CON', president: 'Jennifer Ramos', vp: 'Renz Santiago', secretary: 'Carla Vizcarra' },
  { name: 'Junior Entrepreneurs Society', abbr: 'JES', college: 'COM', president: 'Marco Delgado', vp: 'Patricia Tuazon', secretary: 'Rhea Magpayo' },
  { name: 'Junior Phil. Institute of Accountants', abbr: 'JPIA', college: 'COM', president: 'Diana Castillo', vp: 'Rodney Cruz', secretary: 'Mona Fernandez' },
  { name: 'Hotel & Restaurant Mgmt. Society', abbr: 'HRMS', college: 'COM', president: 'Anna Lim', vp: 'Kevin Ramos', secretary: 'Grace Tan' },
  { name: 'Society of Civil Engineering Students', abbr: 'SCES', college: 'CEA', president: 'Francis Dimaunahan', vp: 'Ria Mañibo', secretary: 'Aldrin Soriano' },
  { name: 'Architecture Students Guild', abbr: 'ASG', college: 'CEA', president: 'Leo Santos', vp: 'Cora Reyes', secretary: 'Mark Flores' },
  { name: 'NWSSU Supreme Student Council', abbr: 'SSC', college: 'University-Wide', president: 'Alvin Dimaculangan', vp: 'Gemma Soriano', secretary: 'Neil Castro' },
  { name: 'NWSSU Cultural & Arts Troupe', abbr: 'CAT-Troupe', college: 'University-Wide', president: 'Jessa Flores', vp: 'Romeo Garcia', secretary: 'Ana Mercado' },
  { name: 'NWSSU Dance Company', abbr: 'NDC', college: 'University-Wide', president: 'Charlene Santos', vp: 'Bobby Cruz', secretary: 'Lara Reyes' },
];

const SEARCH_INDEX = [
  ...BUILDINGS.map(b => ({ id: b.id, name: b.name, type: 'Building', icon: b.emoji, action: () => openBuilding(b.id) })),
  ...DEPARTMENTS.map(d => ({ id: d.id, name: d.name + ' (' + d.abbr + ')', type: 'Department', icon: '🎓', action: () => openDept(d.id) })),
  ...OFFICES.map((o, i) => ({ id: 'office_' + i, name: o.name, type: 'Office', icon: o.icon, action: () => showOfficeModal(i) })),
  ...ORGANIZATIONS.map((o, i) => ({ id: 'org_' + i, name: o.name + ' (' + o.abbr + ')', type: 'Organization', icon: '👥', action: () => showOrgModal(i) })),
];