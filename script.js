const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

const revealNodes = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    revealNodes.forEach((node) => observer.observe(node));
} else {
    revealNodes.forEach((node) => node.classList.add('visible'));
}

const gradeRank = { A: 1, B: 2, C: 3, D: 4, E: 5, F: 6 };

const programmes = [
    {
        name: 'BSc Computer Science',
        description: 'Software development, data systems, and computing fundamentals.',
        requirements: {
            Mathematics: 'C',
            English: 'C'
        }
    },
    {
        name: 'BSc Nursing',
        description: 'Clinical training and patient care foundations for healthcare careers.',
        requirements: {
            Biology: 'C',
            English: 'C'
        }
    },
    {
        name: 'BEng Civil Engineering',
        description: 'Infrastructure design, structures, and construction management.',
        requirements: {
            Mathematics: 'C',
            Physics: 'C'
        }
    },
    {
        name: 'BCom Accounting',
        description: 'Financial reporting, taxation, auditing, and business management.',
        requirements: {
            Mathematics: 'D',
            English: 'C'
        }
    },
    {
        name: 'BA Education',
        description: 'Teaching methods, curriculum planning, and classroom leadership.',
        requirements: {
            English: 'C'
        }
    },
    {
        name: 'BSc Environmental Science',
        description: 'Sustainability, ecology, and environmental impact analysis.',
        requirements: {
            Biology: 'D',
            Geography: 'D',
            English: 'C'
        }
    }
];

const form = document.getElementById('subject-form');
const subjectRows = document.getElementById('subject-rows');
const addSubjectBtn = document.getElementById('add-subject');
const resultsContainer = document.getElementById('program-results');

function normalizeSubject(value) {
    return value.trim().toLowerCase();
}

function prettySubject(value) {
    return value
        .split(' ')
        .filter(Boolean)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}

function createRow() {
    const row = document.createElement('div');
    row.className = 'subject-row';
    row.innerHTML = `
        <input type='text' class='subject-input' placeholder='Subject (e.g. Biology)' required>
        <select class='symbol-input' required>
            <option value=''>Symbol</option>
            <option value='A'>A</option>
            <option value='B'>B</option>
            <option value='C'>C</option>
            <option value='D'>D</option>
            <option value='E'>E</option>
            <option value='F'>F</option>
        </select>
        <button type='button' class='remove-row'>Remove</button>
    `;
    return row;
}

function collectSubjects() {
    const map = {};
    const rows = subjectRows.querySelectorAll('.subject-row');

    rows.forEach((row) => {
        const subject = row.querySelector('.subject-input').value;
        const symbol = row.querySelector('.symbol-input').value;

        if (!subject || !symbol) return;

        const key = normalizeSubject(subject);

        if (!map[key] || gradeRank[symbol] < gradeRank[map[key]]) {
            map[key] = symbol;
        }
    });

    return map;
}

function qualifies(programme, subjectMap) {
    return Object.entries(programme.requirements).every(([subject, minSymbol]) => {
        const studentSymbol = subjectMap[normalizeSubject(subject)];
        if (!studentSymbol) return false;
        return gradeRank[studentSymbol] <= gradeRank[minSymbol];
    });
}

function renderResults(matches) {
    if (matches.length === 0) {
        resultsContainer.innerHTML = `
            <div class='no-match'>
                No direct matches found yet. Try adding more subjects or improving symbols in key subjects like Mathematics, English, Physics, or Biology.
            </div>
        `;
        return;
    }

    const cards = matches.map((programme) => {
        const requirementText = Object.entries(programme.requirements)
            .map(([subject, symbol]) => `${subject}: ${symbol} or better`)
            .join(' | ');

        const statusBadge = programme.qualifies 
            ? "<span class='badge success'>Qualified</span>" 
            : "<span class='badge warning'>Recommended (Check Requirements)</span>";

        return `
            <article class='result-card'>
                <div style='display:flex; justify-content:space-between; align-items:center;'>
                    <h3>${programme.name}</h3>
                    ${statusBadge}
                </div>
                <p>${programme.description}</p>
                <p class='requirements'><strong>Requirements:</strong> ${requirementText}</p>
            </article>
        `;
    });

    resultsContainer.innerHTML = cards.join('');
}

if (form && subjectRows && addSubjectBtn && resultsContainer) {
    addSubjectBtn.addEventListener('click', () => {
        subjectRows.appendChild(createRow());
    });

    subjectRows.addEventListener('click', (event) => {
        if (!event.target.classList.contains('remove-row')) return;

        const rows = subjectRows.querySelectorAll('.subject-row');
        if (rows.length === 1) {
            const subjectInput = rows[0].querySelector('.subject-input');
            const symbolInput = rows[0].querySelector('.symbol-input');
            subjectInput.value = '';
            symbolInput.value = '';
            return;
        }

        event.target.closest('.subject-row').remove();
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const subjectMap = collectSubjects();
        const subjectCount = Object.keys(subjectMap).length;

        if (subjectCount === 0) {
            resultsContainer.innerHTML = "<div class='no-match'>Please enter at least one subject and symbol.</div>";
            return;
        }

        const matches = programmes.filter((programme) => qualifies(programme, subjectMap));
        renderResults(matches);
    });
}

const API_BASE = 'http://localhost:4000/api';

async function fetchUniversities() {
    const response = await fetch(`${API_BASE}/universities`);
    if (!response.ok) throw new Error('Could not load universities');
    return response.json();
}

function normalizeName(value) {
    return String(value || '').trim().toLowerCase();
}

function setupUniversityCardNavigation() {
    const universityCards = document.querySelectorAll('.uni-card[data-university]');
    if (universityCards.length === 0) return;

    fetchUniversities()
        .then((rows) => {
            const byName = new Map(rows.map((row) => [normalizeName(row.name), row]));

            universityCards.forEach((card) => {
                card.tabIndex = 0;
                card.style.cursor = 'pointer';
                const title = card.querySelector('h2');
                const cardName = title ? title.textContent : '';
                const matched = byName.get(normalizeName(cardName));

                const openDetails = () => {
                    if (matched) {
                        window.location.href = `universities-details.html?university_id=${matched.id}`;
                    } else {
                        window.location.href = `universities-details.html?university_name=${encodeURIComponent(cardName)}`;
                    }
                };

                card.addEventListener('click', openDetails);
                card.addEventListener('keydown', (event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        openDetails();
                    }
                });
            });
        })
        .catch(() => {
            universityCards.forEach((card) => {
                card.tabIndex = 0;
                card.style.cursor = 'pointer';
                const title = card.querySelector('h2');
                const cardName = title ? title.textContent : '';
                const openDetails = () => {
                    window.location.href = `universities-details.html?university_name=${encodeURIComponent(cardName)}`;
                };
                card.addEventListener('click', openDetails);
            });
        });
}

setupUniversityCardNavigation();

function escapeHtml(value) {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function setupUniversityDetailsPage() {
    const detailTitle = document.getElementById('detail-title');
    const detailLead = document.getElementById('detail-lead');
    const facultyList = document.getElementById('faculty-list');
    const programmeList = document.getElementById('programme-list');
    const programmeDetails = document.getElementById('programme-details');
    if (!detailTitle || !detailLead || !facultyList || !programmeList || !programmeDetails) return;

    const summary1 = document.getElementById('summary-text-1');
    const summary2 = document.getElementById('summary-text-2');
    const summary3 = document.getElementById('summary-text-3');
    const infoHeading = document.getElementById('info-heading');
    const infoText = document.getElementById('info-text');
    const genericHeading = document.getElementById('generic-heading');
    const genericCopy = document.getElementById('generic-copy');
    const allSections = document.querySelectorAll('.uni-detail');
    const params = new URLSearchParams(window.location.search);
    const requestedId = Number(params.get('university_id'));
    const requestedName = params.get('university_name');

    function showDataSections(show) {
        allSections.forEach((section) => {
            const target = section.dataset.university;
            if (target === 'nul') section.hidden = !show;
            if (target === 'generic') section.hidden = show;
        });
    }

    function renderProgrammeDetails(programme) {
        const requirements = Array.isArray(programme.requirements) ? programme.requirements : [];
        const requirementLines = requirements.length === 0
            ? '<p class="requirements"><strong>Requirements:</strong> Not listed yet.</p>'
            : `<p class="requirements"><strong>Requirements:</strong> ${requirements.map((r) => `${escapeHtml(r.subject)}: ${escapeHtml(r.min_symbol)} or better`).join(' | ')}</p>`;

        programmeDetails.innerHTML = `
            <article class='result-card'>
                <h3>${escapeHtml(programme.name)}</h3>
                <p><strong>Duration:</strong> ${escapeHtml(programme.duration || 'Not specified')}</p>
                <p><strong>Entry Type:</strong> ${escapeHtml(programme.entry_type || 'Not specified')}</p>
                <p>${escapeHtml(programme.description || 'No description available yet.')}</p>
                ${requirementLines}
                <p class='requirements'><strong>Career Paths:</strong> ${escapeHtml(programme.career_paths || 'Not listed yet.')}</p>
                <p class='requirements'><strong>Additional Info:</strong> ${escapeHtml(programme.additional_info || 'Not listed yet.')}</p>
            </article>
        `;
    }

    function renderProgrammes(faculty) {
        const programmes = Array.isArray(faculty.programmes) ? faculty.programmes : [];
        if (programmes.length === 0) {
            programmeList.innerHTML = "<div class='no-match'>No programmes listed for this faculty.</div>";
            programmeDetails.innerHTML = "<div class='no-match'>Choose another faculty.</div>";
            return;
        }

        programmeList.innerHTML = programmes
            .map((programme, index) => `<button type='button' class='btn btn-secondary programme-btn' data-index='${index}'>${escapeHtml(programme.name)}</button>`)
            .join('');

        programmeDetails.innerHTML = "<div class='no-match'>Choose a programme to view details.</div>";

        programmeList.querySelectorAll('.programme-btn').forEach((button) => {
            button.addEventListener('click', () => {
                const index = Number(button.dataset.index);
                renderProgrammeDetails(programmes[index]);
            });
        });
    }

    function renderUniversity(university) {
        detailTitle.textContent = university.name;
        detailLead.textContent = 'Tap a faculty, then a programme, to view requirements, career paths, and full programme details.';
        showDataSections(true);

        const faculties = Array.isArray(university.faculties) ? university.faculties : [];
        const programmeCount = faculties.reduce((sum, f) => sum + (Array.isArray(f.programmes) ? f.programmes.length : 0), 0);

        if (summary1) summary1.textContent = university.location || 'Location not specified';
        if (summary2) summary2.textContent = `${faculties.length} faculties/institutes`;
        if (summary3) summary3.textContent = `${programmeCount} programmes`;
        if (infoHeading) infoHeading.textContent = `${university.name} Information`;
        if (infoText) infoText.textContent = university.description || 'Programme records loaded from backend.';

        if (faculties.length === 0) {
            facultyList.innerHTML = "<div class='no-match'>No faculties added yet for this university.</div>";
            programmeList.innerHTML = "<div class='no-match'>No programmes available.</div>";
            programmeDetails.innerHTML = "<div class='no-match'>No details available.</div>";
            return;
        }

        facultyList.innerHTML = faculties
            .map((faculty, index) => `<button type='button' class='btn btn-secondary faculty-btn' data-index='${index}'>${escapeHtml(faculty.name)}</button>`)
            .join('');

        programmeList.innerHTML = "<div class='no-match'>Choose a faculty to load programmes.</div>";
        programmeDetails.innerHTML = "<div class='no-match'>Choose a programme to view details.</div>";

        facultyList.querySelectorAll('.faculty-btn').forEach((button) => {
            button.addEventListener('click', () => {
                const index = Number(button.dataset.index);
                renderProgrammes(faculties[index]);
            });
        });
    }

    function showGeneric(name, message) {
        showDataSections(false);
        detailTitle.textContent = name || 'University Details';
        detailLead.textContent = message;
        if (genericHeading) genericHeading.textContent = `${name || 'University'} Details`;
        if (genericCopy) genericCopy.textContent = message;
    }

    if (requestedId) {
        fetch(`${API_BASE}/universities/${requestedId}/full`)
            .then((response) => {
                if (!response.ok) throw new Error('not found');
                return response.json();
            })
            .then(renderUniversity)
            .catch(() => showGeneric('University', 'Details not found in backend yet. Add this university in the backend API first.'));
        return;
    }

    fetchUniversities()
        .then((rows) => {
            if (!Array.isArray(rows) || rows.length === 0) {
                showGeneric('University', 'No universities found in backend.');
                return;
            }

            if (requestedName) {
                const matched = rows.find((row) => normalizeName(row.name) === normalizeName(requestedName));
                if (!matched) {
                    showGeneric(requestedName, `${requestedName} is not in backend yet.`);
                    return;
                }
                return fetch(`${API_BASE}/universities/${matched.id}/full`)
                    .then((response) => response.json())
                    .then(renderUniversity);
            }

            return fetch(`${API_BASE}/universities/${rows[0].id}/full`)
                .then((response) => response.json())
                .then(renderUniversity);
        })
        .catch(() => {
            showGeneric('University', 'Could not connect to backend API. Make sure backend server is running on http://localhost:4000.');
        });
}

setupUniversityDetailsPage();

const institutions = [
    { name: 'National University of Lesotho (NUL)', type: 'Public University', location: 'Roma', aps: 'Yes - max APS 26 varies by faculty', link: 'https://www.nul.ls' },
    { name: 'Limkokwing University of Creative Technology', type: 'Private University', location: 'Maseru', aps: 'No - portfolio + minimum LGCSE grades', link: 'https://www.limkokwing.net/lesotho/academic/admission/' },
    { name: 'Botho University Lesotho', type: 'Private University', location: 'Ha Pena-Pena Green City, Maseru', aps: 'No - own admission-points system', link: 'https://lesotho.bothouniversity.com/' },
    { name: 'Lerotholi Polytechnic', type: 'Public Polytechnic', location: 'Maseru', aps: 'No - subject-specific grade minimums', link: 'http://www.lp.ac.ls/' },
    { name: 'Lesotho College of Education', type: 'Public College', location: 'Maseru', aps: 'No - subject-specific grade minimums', link: 'https://www.che.ac.ls/lesotho-college-of-education/' },
    { name: 'Lesotho Institute of Public Administration & Management', type: 'Public Institute', location: 'Maseru', aps: 'No - in-service training institute', link: 'https://mps.gov.ls/about-lipam/' },
    { name: 'Lesotho Agricultural College', type: 'Public College', location: 'Maseru District', aps: 'No - subject-specific grade minimums', link: 'https://www.che.ac.ls/lesotho-agricultural-college-lac-accredited-programmes/' },
    { name: 'Centre for Accounting Studies', type: 'Private Institution', location: 'Maseru', aps: 'No - subject-specific grade minimums', link: 'https://www.che.ac.ls/centre-for-accounting-studies/' },
    { name: 'Institute of Development Management - Lesotho Campus', type: 'Public regional institute', location: 'Maseru', aps: 'No - own admission criteria', link: 'https://idm.ac.ls/' },
    { name: 'National Health Training College', type: 'Public College', location: 'Maseru', aps: 'No - nursing/health subject minimums', link: 'https://nhtc.ac.ls/' }
];

const qualificationProgrammes = [
    {
        name: 'BSc Environmental Science',
        institution: 'National University of Lesotho (NUL)',
        aps: 26,
        field: 'Science',
        careers: 'Environmental officer, conservation planner, laboratory technician, climate and sustainability roles.',
        requirements: [
            { subject: 'English Language', min: 'D' },
            { subject: 'Mathematics', min: 'C' },
            { subject: 'Biology or Physical Science', min: 'C' }
        ]
    },
    {
        name: 'BA Sesotho & Communication',
        institution: 'National University of Lesotho (NUL)',
        aps: 24,
        field: 'Humanities',
        careers: 'Communications officer, editor, translator, media assistant, cultural-sector roles.',
        requirements: [
            { subject: 'English Language', min: 'C' },
            { subject: 'Sesotho', min: 'C' }
        ]
    },
    {
        name: 'Bachelor of Laws (LLB)',
        institution: 'National University of Lesotho (NUL)',
        aps: 28,
        field: 'Law',
        careers: 'Legal practitioner, magistrate, legal researcher, compliance officer, policy advisor.',
        requirements: [
            { subject: 'English Language', min: 'C' },
            { subject: 'History or Development Studies', min: 'C' }
        ]
    },
    {
        name: 'Bachelor of Science with Education',
        institution: 'National University of Lesotho (NUL)',
        aps: 22,
        field: 'Education',
        careers: 'Science teacher, mathematics teacher, curriculum assistant, education officer.',
        requirements: [
            { subject: 'English Language', min: 'D' },
            { subject: 'Mathematics', min: 'B' },
            { subject: 'Biology or Physical Science', min: 'C' }
        ]
    },
    {
        name: 'Creative Technology Programmes',
        institution: 'Limkokwing University of Creative Technology',
        aps: null,
        field: 'Creative',
        careers: 'Designer, multimedia producer, brand assistant, animator, creative technologist.',
        requirements: [
            { subject: 'English Language', min: 'D' },
            { subject: 'Art or Design or Computer Studies', min: 'D' }
        ],
        note: 'Portfolio review may also be required.'
    },
    {
        name: 'Computing and Business Degrees',
        institution: 'Botho University Lesotho',
        aps: null,
        field: 'Technology',
        careers: 'Software developer, systems support officer, business analyst, IT support technician.',
        requirements: [
            { subject: 'English Language', min: 'D' },
            { subject: 'Mathematics', min: 'D' }
        ],
        note: 'Botho uses its own admission-points system; verify final points with admissions.'
    },
    {
        name: 'Engineering and Built Environment Diplomas',
        institution: 'Lerotholi Polytechnic',
        aps: null,
        field: 'Engineering',
        careers: 'Technician, site supervisor, draughting assistant, built-environment support roles.',
        requirements: [
            { subject: 'English Language', min: 'D' },
            { subject: 'Mathematics', min: 'C' },
            { subject: 'Physical Science', min: 'C' }
        ]
    },
    {
        name: 'Teacher Education Programmes',
        institution: 'Lesotho College of Education',
        aps: null,
        field: 'Education',
        careers: 'Primary teacher, secondary teacher, education assistant, school administrator.',
        requirements: [
            { subject: 'English Language', min: 'C' },
            { subject: 'Mathematics', min: 'D' }
        ]
    },
    {
        name: 'Agriculture Diplomas',
        institution: 'Lesotho Agricultural College',
        aps: null,
        field: 'Agriculture',
        careers: 'Agricultural extension worker, farm manager, food-security assistant, agribusiness support.',
        requirements: [
            { subject: 'English Language', min: 'D' },
            { subject: 'Biology or Agricultural Science', min: 'C' },
            { subject: 'Mathematics', min: 'D' }
        ]
    },
    {
        name: 'Accounting and Professional Studies',
        institution: 'Centre for Accounting Studies',
        aps: null,
        field: 'Business',
        careers: 'Accounting technician, bookkeeper, auditor assistant, finance clerk.',
        requirements: [
            { subject: 'English Language', min: 'C' },
            { subject: 'Mathematics', min: 'C' },
            { subject: 'Accounting or Business Studies', min: 'D' }
        ]
    },
    {
        name: 'Management and Public Administration Programmes',
        institution: 'Institute of Development Management - Lesotho Campus',
        aps: null,
        field: 'Business',
        careers: 'Administrator, project assistant, HR assistant, public-sector support officer.',
        requirements: [
            { subject: 'English Language', min: 'D' },
            { subject: 'Mathematics', min: 'D' }
        ]
    },
    {
        name: 'Nursing and Health Sciences',
        institution: 'National Health Training College',
        aps: null,
        field: 'Health',
        careers: 'Nurse, health assistant, clinical support worker, public-health support roles.',
        requirements: [
            { subject: 'English Language', min: 'C' },
            { subject: 'Biology', min: 'C' },
            { subject: 'Mathematics', min: 'C' }
        ]
    }
];

const prospectuses = [
    { institution: 'National University of Lesotho (NUL)', file: 'NUL.docx', type: 'DOCX' },
    { institution: 'Botho University Lesotho', file: 'Botho-University-2026-Lesotho-Campus-Prospectus.pdf', type: 'PDF' },
    { institution: 'Lerotholi Polytechnic', file: 'Lerothollli polytechnique.pdf', type: 'PDF' },
    { institution: 'Centre for Accounting Studies', file: 'CAS.pdf', type: 'PDF' },
    { institution: 'Roma College of Nursing', file: 'Roma college.pdf', type: 'PDF' }
];

const scholarships = [
    { name: 'Chevening Scholarships', region: 'United Kingdom', link: 'https://www.chevening.org/scholarship/lesotho/' },
    { name: 'Mastercard Foundation Scholars Program', region: 'Africa, North America, Europe', link: 'https://mastercardfdn.org/en/what-we-do/our-programs/mastercard-foundation-scholars-program/' },
    { name: 'Commonwealth Scholarships', region: 'United Kingdom', link: 'https://cscuk.fcdo.gov.uk/scholarships' },
    { name: 'Turkiye Burslari', region: 'Turkiye', link: 'https://www.turkiyeburslari.gov.tr' },
    { name: 'DAAD Scholarships', region: 'Germany', link: 'https://www.daad.de/en/studying-in-germany/scholarships/' },
    { name: 'Fulbright Foreign Student Program', region: 'United States', link: 'https://foreign.fulbrightonline.org/about/foreign-student-program' }
];

const placements = [
    'NUL work-integrated learning placements built into selected degrees, including practicum and teaching practice.',
    'NMDS-sponsored loan-bursary bonds may function as post-graduation public-sector placements, but bursary tracking is outside this build.',
    'Mastercard Foundation Scholars can access career services through partner universities.',
    'Regional and remote opportunities are flagged for verification before publication.'
];

const posts = [
    { title: 'How ECOL releases LGCSE results', body: 'Use the official ECOL results portal and keep candidate details ready before checking results.' },
    { title: 'NUL APS is not universal', body: 'NUL uses APS, while most other Lesotho institutions use portfolios, own points systems, or subject minimums.' },
    { title: 'Diploma vs degree pathways', body: 'Compare practical diploma routes like Lerotholi Polytechnic with degree routes such as NUL programmes.' },
    { title: 'Scholarship awareness after Form E', body: 'International scholarships have annual deadlines and should be checked directly each cycle.' }
];

const questions = [
    { name: 'Mpho', topic: 'APS', text: 'Can I apply to NUL if my APS is close but one science subject is weak?' },
    { name: 'Lineo', topic: 'Institution requirements', text: 'Does Limkokwing need a portfolio for every creative programme?' },
    { name: 'Thabo', topic: 'Scholarships', text: 'Which scholarships are realistic for Basotho students after Form E?' }
];

const lgcsePoints = { 'A*': 8, A: 7, B: 6, C: 5, D: 4, E: 3, F: 2, G: 1 };
const lgcseRank = { 'A*': 1, A: 2, B: 3, C: 4, D: 5, E: 6, F: 7, G: 8 };
let latestEligibleProgrammes = [];
let latestStudentSubjects = [];

function safeText(value) {
    return String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function setupProductHomepage() {
    const grid = document.getElementById('institution-grid');
    if (!grid) return;

    grid.innerHTML = institutions.map((institution, index) => `
        <article class="directory-card">
            <div class="card-index">${index + 1}</div>
            <h3>${safeText(institution.name)}</h3>
            <p>${safeText(institution.type)} &middot; ${safeText(institution.location)}</p>
            <span>${safeText(institution.aps)}</span>
            <a href="${safeText(institution.link)}" target="_blank" rel="noreferrer">Official source</a>
        </article>
    `).join('');

    const results = document.getElementById('programme-results');
    const matchCount = document.getElementById('match-count');
    const qualificationForm = document.getElementById('qualification-form');

    if (qualificationForm) {
        setupQualificationMatcher();
        qualificationForm.addEventListener('submit', (event) => {
            event.preventDefault();
            renderEligibilityMatches();
        });
        results.innerHTML = '<div class="empty-state">Enter your subjects and grades, then submit to see matching programmes.</div>';
        matchCount.textContent = '0 shown';
        results.addEventListener('click', (event) => {
            const button = event.target.closest('.ask-programme');
            if (!button) return;
            const programme = latestEligibleProgrammes[Number(button.dataset.index)];
            if (!programme) return;
            const advisorButton = document.getElementById('advisor-header-open');
            const messageInput = document.getElementById('advisor-message');
            if (advisorButton) advisorButton.click();
            if (messageInput) {
                messageInput.value = `What careers can ${programme.name} at ${programme.institution} lead to, and what should I know before applying?`;
                messageInput.focus();
            }
        });
    }

    setupApsCalculator();
    setupAdvisor();
    setupProductNavigation();
    renderResources();
    renderProspectuses();
    renderPosts();
    setupCommunityQuestions();
}

function setupQualificationMatcher() {
    const stack = document.getElementById('result-subjects');
    const addButton = document.getElementById('add-result-subject');
    if (!stack || !addButton) return;

    function addResultRow(subject = '', grade = '') {
        const row = document.createElement('div');
        row.className = 'aps-row result-row';
        row.innerHTML = `
            <input type="text" class="result-subject" placeholder="Subject" value="${safeText(subject)}">
            <select class="result-grade">
                <option value="">Grade</option>
                ${Object.keys(lgcseRank).map((key) => `<option value="${key}" ${grade === key ? 'selected' : ''}>${key}</option>`).join('')}
            </select>
            <button type="button" class="aps-remove result-remove" aria-label="Remove subject">x</button>
        `;
        stack.appendChild(row);
    }

    ['English Language', 'Mathematics', 'Biology', 'Physical Science', 'Sesotho', 'Accounting'].forEach((subject) => addResultRow(subject));
    addButton.addEventListener('click', () => addResultRow());
    stack.addEventListener('click', (event) => {
        if (!event.target.classList.contains('result-remove')) return;
        if (stack.children.length === 1) return;
        event.target.closest('.result-row').remove();
    });
}

function normalizeResultSubject(value) {
    return String(value || '')
        .trim()
        .toLowerCase()
        .replace(/\s+/g, ' ')
        .replace(/^english$/, 'english language')
        .replace(/^maths?$/, 'mathematics')
        .replace(/^physics$/, 'physical science')
        .replace(/^chemistry$/, 'physical science')
        .replace(/^science$/, 'physical science')
        .replace(/^agriculture$/, 'agricultural science')
        .replace(/^computer science$/, 'computer studies')
        .replace(/^computing$/, 'computer studies')
        .replace(/^business$/, 'business studies')
        .replace(/^design$/, 'art');
}

function splitAcceptedSubjects(value) {
    return String(value || '')
        .split(/\s+or\s+|\/|,/i)
        .map(normalizeResultSubject)
        .filter(Boolean);
}

function collectResultSubjects() {
    const rows = document.querySelectorAll('#result-subjects .result-row');
    const map = {};
    const subjects = [];

    rows.forEach((row) => {
        const subject = row.querySelector('.result-subject').value.trim();
        const symbol = row.querySelector('.result-grade').value;
        if (!subject || !symbol) return;
        const key = normalizeResultSubject(subject);
        if (!map[key] || lgcseRank[symbol] < lgcseRank[map[key]]) map[key] = symbol;
        subjects.push({ subject, symbol });
    });

    return { map, subjects };
}

function studentMeetsRequirement(subjectMap, requirement) {
    const acceptedSubjects = splitAcceptedSubjects(requirement.subject);
    const studentSymbol = acceptedSubjects
        .map((subject) => subjectMap[subject])
        .filter(Boolean)
        .sort((a, b) => lgcseRank[a] - lgcseRank[b])[0];

    return {
        met: Boolean(studentSymbol) && lgcseRank[studentSymbol] <= lgcseRank[requirement.min],
        studentSymbol: studentSymbol || null,
        text: `${requirement.subject}: ${requirement.min} or better`
    };
}

function calculateStudentAps(subjectMap) {
    return Object.values(subjectMap)
        .map((symbol) => lgcsePoints[symbol] || 0)
        .sort((a, b) => b - a)
        .slice(0, 6)
        .reduce((sum, points) => sum + points, 0);
}

function renderEligibilityMatches() {
    const results = document.getElementById('programme-results');
    const matchCount = document.getElementById('match-count');
    const goal = document.getElementById('career-goal').value.trim().toLowerCase();
    const { map, subjects } = collectResultSubjects();
    const aps = calculateStudentAps(map);

    latestStudentSubjects = subjects;

    if (subjects.length === 0) {
        latestEligibleProgrammes = [];
        results.innerHTML = '<div class="empty-state">Please enter at least one subject and grade.</div>';
        matchCount.textContent = '0 shown';
        return;
    }

    const eligible = qualificationProgrammes
        .map((programme) => {
            const checks = programme.requirements.map((requirement) => studentMeetsRequirement(map, requirement));
            const subjectEligible = checks.every((check) => check.met);
            const apsEligible = programme.aps === null || aps >= programme.aps;
            const goalBoost = goal && `${programme.name} ${programme.field} ${programme.careers}`.toLowerCase().includes(goal);
            return { ...programme, checks, subjectEligible, apsEligible, score: (subjectEligible ? 40 : 0) + (apsEligible ? 20 : 0) + (goalBoost ? 15 : 0) };
        })
        .filter((programme) => programme.subjectEligible && programme.apsEligible)
        .sort((a, b) => b.score - a.score || a.institution.localeCompare(b.institution));

    latestEligibleProgrammes = eligible;
    matchCount.textContent = `${eligible.length} shown`;

    if (eligible.length === 0) {
        results.innerHTML = `
            <div class="empty-state">
                No eligible programmes found in the current catalogue. Try adding all your LGCSE subjects, then check the prospectuses or ask the advisor what to improve.
            </div>
        `;
        return;
    }

    results.innerHTML = eligible.map((programme, index) => `
        <article class="stack-card">
            <div class="stack-card-heading">
                <h3>${safeText(programme.name)}</h3>
                <strong>Eligible</strong>
            </div>
            <p>${safeText(programme.institution)} &middot; ${safeText(programme.field)}</p>
            <p><strong>Careers:</strong> ${safeText(programme.careers)}</p>
            <p><strong>Requirements met:</strong> ${programme.checks.map((check) => safeText(check.text)).join('; ')}${programme.aps ? `; APS ${programme.aps}+` : ''}</p>
            ${programme.note ? `<p><strong>Note:</strong> ${safeText(programme.note)}</p>` : ''}
            <button class="mini-action ask-programme" type="button" data-index="${index}">Ask AI about this</button>
        </article>
    `).join('');
}

function setupApsCalculator() {
    const form = document.getElementById('aps-form');
    const stack = document.getElementById('aps-subjects');
    const addButton = document.getElementById('add-aps-subject');
    if (!form || !stack || !addButton) return;

    function addRow(subject = '', grade = '') {
        const row = document.createElement('div');
        row.className = 'aps-row';
        row.innerHTML = `
            <input type="text" class="aps-subject" placeholder="Subject" value="${safeText(subject)}">
            <select class="aps-grade">
                <option value="">Grade</option>
                ${Object.keys(lgcsePoints).map((key) => `<option value="${key}" ${grade === key ? 'selected' : ''}>${key}</option>`).join('')}
            </select>
            <button type="button" class="aps-remove" aria-label="Remove subject">x</button>
        `;
        stack.appendChild(row);
    }

    function calculate() {
        const scores = [...stack.querySelectorAll('.aps-grade')]
            .map((select) => lgcsePoints[select.value] || 0)
            .sort((a, b) => b - a)
            .slice(0, 6);
        const total = scores.reduce((sum, points) => sum + points, 0);
        document.getElementById('aps-score').textContent = total;
        document.getElementById('aps-eligibility').innerHTML = institutions.map((institution) => {
            const isNul = institution.name.includes('NUL');
            const status = isNul
                ? (total >= 26 ? 'Meets the illustrative NUL 26-point benchmark.' : 'Below the illustrative NUL 26-point benchmark.')
                : institution.aps;
            return `<article class="stack-card compact"><h3>${safeText(institution.name)}</h3><p>${safeText(status)}</p></article>`;
        }).join('');
    }

    ['English Language', 'Mathematics', 'Biology', 'Physical Science', 'Sesotho', 'Geography'].forEach((subject) => addRow(subject));
    stack.addEventListener('click', (event) => {
        if (!event.target.classList.contains('aps-remove')) return;
        if (stack.children.length === 1) return;
        event.target.closest('.aps-row').remove();
        calculate();
    });
    stack.addEventListener('input', calculate);
    addButton.addEventListener('click', () => addRow());
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        calculate();
    });
    calculate();
}

function renderResources() {
    const scholarshipList = document.getElementById('scholarship-list');
    const placementList = document.getElementById('placement-list');
    if (scholarshipList) {
        scholarshipList.innerHTML = scholarships.map((item) => `
            <article class="stack-card">
                <h3>${safeText(item.name)}</h3>
                <p>${safeText(item.region)}</p>
                <a href="${safeText(item.link)}" target="_blank" rel="noreferrer">Open source</a>
            </article>
        `).join('');
    }
    if (placementList) {
        placementList.innerHTML = placements.map((item) => `<article class="stack-card"><p>${safeText(item)}</p></article>`).join('');
    }
}

function renderProspectuses() {
    const list = document.getElementById('prospectus-list');
    if (!list) return;

    list.innerHTML = prospectuses.map((item) => `
        <article class="prospectus-card">
            <span>${safeText(item.type)}</span>
            <h3>${safeText(item.institution)}</h3>
            <p>${safeText(item.file)}</p>
            <a class="product-btn product-btn-secondary" href="${encodeURI(item.file)}" target="_blank" rel="noreferrer">Open Prospectus</a>
        </article>
    `).join('');
}

function setupAdvisor() {
    const shell = document.getElementById('floating-advisor');
    const toggle = document.getElementById('advisor-toggle');
    const close = document.getElementById('advisor-close');
    const headerOpen = document.getElementById('advisor-header-open');
    const form = document.getElementById('advisor-form');
    const messageInput = document.getElementById('advisor-message');
    const messages = document.getElementById('advisor-messages');
    if (!shell || !toggle || !close || !form || !messageInput || !messages) return;

    function openAdvisor() {
        shell.classList.add('open');
        toggle.setAttribute('aria-expanded', 'true');
        window.setTimeout(() => messageInput.focus(), 120);
    }

    function closeAdvisor() {
        shell.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
    }

    function appendAdvisorMessage(role, text) {
        const bubble = document.createElement('article');
        bubble.className = `advisor-message ${role}`;
        bubble.textContent = text;
        messages.appendChild(bubble);
        messages.scrollTop = messages.scrollHeight;
        return bubble;
    }

    toggle.addEventListener('click', () => {
        if (shell.classList.contains('open')) {
            closeAdvisor();
        } else {
            openAdvisor();
        }
    });
    close.addEventListener('click', closeAdvisor);
    if (headerOpen) headerOpen.addEventListener('click', openAdvisor);

    messageInput.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter' || event.shiftKey) return;
        event.preventDefault();
        form.requestSubmit();
    });

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const message = messageInput.value.trim();
        if (!message) return;

        appendAdvisorMessage('user', message);
        messageInput.value = '';
        const thinkingBubble = appendAdvisorMessage('assistant', 'Thinking through your options...');

        try {
            const response = await fetch(`${API_BASE}/advisor`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message,
                    subjects: latestStudentSubjects,
                    matches: latestEligibleProgrammes
                })
            });

            if (!response.ok) throw new Error('advisor unavailable');
            const data = await response.json();
            thinkingBubble.textContent = data.reply || buildLocalAdvisorReply(message);
        } catch (_error) {
            thinkingBubble.textContent = buildLocalAdvisorReply(message);
        }
    });
}

function setupProductNavigation() {
    const links = [...document.querySelectorAll('.product-nav a[href^="#"]')];
    if (links.length === 0) return;

    links.forEach((link) => {
        link.addEventListener('click', () => {
            links.forEach((item) => item.classList.remove('active'));
            link.classList.add('active');
        });
    });

    if (!('IntersectionObserver' in window)) return;

    const sections = links
        .map((link) => document.querySelector(link.getAttribute('href')))
        .filter(Boolean);
    const observer = new IntersectionObserver((entries) => {
        const visible = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        links.forEach((link) => {
            link.classList.toggle('active', link.getAttribute('href') === `#${visible.target.id}`);
        });
    }, { rootMargin: '-25% 0px -60% 0px', threshold: [0.1, 0.3, 0.6] });

    sections.forEach((section) => observer.observe(section));
}

function buildLocalAdvisorReply(message) {
    if (latestEligibleProgrammes.length === 0) {
        return 'I do not have eligible matches yet. Enter all your LGCSE subjects and grades first, then I can explain which programmes fit and what careers they may lead to.';
    }

    const interest = message.toLowerCase();
    const careerFocused = latestEligibleProgrammes
        .filter((programme) => `${programme.name} ${programme.field} ${programme.careers}`.toLowerCase().includes(interest))
        .slice(0, 3);
    const picks = (careerFocused.length ? careerFocused : latestEligibleProgrammes.slice(0, 3));
    const lines = picks.map((programme) => `${programme.name} at ${programme.institution}: ${programme.careers}`);

    return `Based on your entered results, start with these options: ${lines.join(' ')} Check the prospectus for exact admission details, because institutions can add interviews, portfolios, quotas, or subject rules.`;
}

function renderPosts() {
    const list = document.getElementById('post-list');
    if (!list) return;
    list.innerHTML = posts.map((post) => `
        <article class="post-card">
            <h3>${safeText(post.title)}</h3>
            <p>${safeText(post.body)}</p>
        </article>
    `).join('');
}

function setupCommunityQuestions() {
    const form = document.getElementById('question-form');
    const list = document.getElementById('question-list');
    if (!form || !list) return;

    function renderQuestions() {
        list.innerHTML = questions.map((question) => `
            <article class="stack-card question-card">
                <span>${safeText(question.topic)}</span>
                <h3>${safeText(question.text)}</h3>
                <p>Asked by ${safeText(question.name || 'Anonymous')}</p>
            </article>
        `).join('');
    }

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const name = document.getElementById('question-name').value.trim();
        const topic = document.getElementById('question-topic').value;
        const text = document.getElementById('question-text').value.trim();
        if (!text) return;
        questions.unshift({ name, topic, text });
        form.reset();
        renderQuestions();
    });

    renderQuestions();
}

setupProductHomepage();
