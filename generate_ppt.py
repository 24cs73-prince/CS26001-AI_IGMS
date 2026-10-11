import sys
import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

def create_deck():
    prs = Presentation()
    # 16:9 widescreen layout
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # Professional academic & corporate color palette
    NAVY = RGBColor(15, 30, 60)         # #0F1E3C
    PRIMARY = RGBColor(27, 67, 133)     # #1B4385
    ACCENT = RGBColor(37, 99, 235)      # #2563EB
    EMERALD = RGBColor(16, 124, 65)     # #107C41
    SLATE_DARK = RGBColor(30, 41, 59)   # #1E293B
    SLATE_TEXT = RGBColor(71, 85, 105)  # #475569
    LIGHT_BG = RGBColor(248, 250, 252)  # #F8FAFC
    CARD_BG = RGBColor(255, 255, 255)   # #FFFFFF
    BORDER_COLOR = RGBColor(226, 232, 240) # #E2E8F0
    WHITE = RGBColor(255, 255, 255)
    MUTED_BG = RGBColor(241, 245, 249)

    def set_slide_background(slide, color):
        bg_shape = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
        bg_shape.fill.solid()
        bg_shape.fill.fore_color.rgb = color
        bg_shape.line.fill.background()
        return bg_shape

    def add_header(slide, title_text, category="AI-IGMS · SGP REVIEW 2"):
        # Top banner category
        tb_cat = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(11.5), Inches(0.35))
        tf_cat = tb_cat.text_frame
        tf_cat.word_wrap = True
        p_cat = tf_cat.paragraphs[0]
        p_cat.text = category.upper()
        p_cat.font.size = Pt(10)
        p_cat.font.bold = True
        p_cat.font.color.rgb = ACCENT

        # Title text
        tb_title = slide.shapes.add_textbox(Inches(0.8), Inches(0.7), Inches(11.5), Inches(0.6))
        tf_title = tb_title.text_frame
        tf_title.word_wrap = True
        p_title = tf_title.paragraphs[0]
        p_title.text = title_text
        p_title.font.size = Pt(22)
        p_title.font.bold = True
        p_title.font.color.rgb = NAVY

        # Subtle separator line
        sep = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.35), Inches(11.733), Inches(0.02))
        sep.fill.solid()
        sep.fill.fore_color.rgb = BORDER_COLOR
        sep.line.fill.background()

    def add_card(slide, left, top, width, height, bg=CARD_BG, border=BORDER_COLOR):
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        card.fill.solid()
        card.fill.fore_color.rgb = bg
        card.line.color.rgb = border
        card.line.width = Pt(1)
        return card

    # ==========================================================
    # SLIDE 1: TITLE SLIDE (Dark Navy Premium Theme)
    # ==========================================================
    s1 = prs.slides.add_slide(blank_layout)
    set_slide_background(s1, NAVY)

    # Accent decorative bar
    bar = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.8), Inches(0.12), Inches(3.8))
    bar.fill.solid()
    bar.fill.fore_color.rgb = ACCENT
    bar.line.fill.background()

    tb1 = s1.shapes.add_textbox(Inches(1.2), Inches(1.7), Inches(11.0), Inches(4.2))
    tf1 = tb1.text_frame
    tf1.word_wrap = True

    p = tf1.paragraphs[0]
    p.text = "CHAROTAR UNIVERSITY OF SCIENCE AND TECHNOLOGY"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = RGBColor(147, 197, 253)

    p2 = tf1.add_paragraph()
    p2.text = "Department of Computer Science & Engineering · SGP 5 (Review 2)"
    p2.font.size = Pt(12)
    p2.font.color.rgb = RGBColor(203, 213, 225)
    p2.space_after = Pt(18)

    p3 = tf1.add_paragraph()
    p3.text = "AI-IGMS"
    p3.font.size = Pt(40)
    p3.font.bold = True
    p3.font.color.rgb = WHITE

    p4 = tf1.add_paragraph()
    p4.text = "AI-Enabled Integrated Government School Management System"
    p4.font.size = Pt(20)
    p4.font.bold = True
    p4.font.color.rgb = RGBColor(224, 231, 255)
    p4.space_after = Pt(28)

    p5 = tf1.add_paragraph()
    p5.text = "Presented by: 24CS073 (Prince Patel)  |  Guide: Project Review Committee"
    p5.font.size = Pt(13)
    p5.font.bold = True
    p5.font.color.rgb = RGBColor(191, 219, 254)

    p6 = tf1.add_paragraph()
    p6.text = "Academic Year: 2025–26  ·  Comprehensive Technical Presentation"
    p6.font.size = Pt(11)
    p6.font.color.rgb = RGBColor(148, 163, 184)

    # ==========================================================
    # SLIDE 2: PROBLEM STATEMENT & MOTIVATION
    # ==========================================================
    s2 = prs.slides.add_slide(blank_layout)
    set_slide_background(s2, LIGHT_BG)
    add_header(s2, "Problem Statement & Educational Context")

    # 3 Column Cards
    col_w = Inches(3.7)
    cards_data_2 = [
        ("Administrative Overload",
         "Manual Record Keeping",
         ["Reliance on paper registers causes data redundancy and record loss.",
          "Attendance calculation and reporting takes up to 45 mins daily.",
          "Difficulty tracking government school dropouts and absentee trends."]),
        ("Exam Preparation Burden",
         "Question Paper Fatigue",
         ["Teachers spend excessive time drafting syllabus-aligned tests.",
          "Lack of multi-format question banks across Gujarati, Hindi, and English.",
          "Manual mark compilation causes delays in term results publishing."]),
        ("Parental Transparency Gap",
         "Disconnected Rural Parents",
         ["Parents lack direct visibility into student attendance and grades.",
          "Notices and directives often fail to reach guardians in time.",
          "No centralized communication between school administration and parents."])
    ]

    for idx, (tag, title, points) in enumerate(cards_data_2):
        c_left = Inches(0.8 + idx * 4.0)
        add_card(s2, c_left, Inches(1.6), col_w, Inches(5.3))
        tb = s2.shapes.add_textbox(c_left + Inches(0.25), Inches(1.85), col_w - Inches(0.5), Inches(4.8))
        tf = tb.text_frame
        tf.word_wrap = True

        p = tf.paragraphs[0]
        p.text = tag.upper()
        p.font.size = Pt(10)
        p.font.bold = True
        p.font.color.rgb = ACCENT

        p_t = tf.add_paragraph()
        p_t.text = title
        p_t.font.size = Pt(16)
        p_t.font.bold = True
        p_t.font.color.rgb = NAVY
        p_t.space_after = Pt(14)

        for pt in points:
            p_pt = tf.add_paragraph()
            p_pt.text = f"• {pt}"
            p_pt.font.size = Pt(12)
            p_pt.font.color.rgb = SLATE_DARK
            p_pt.space_after = Pt(10)

    # ==========================================================
    # SLIDE 3: PROPOSED SOLUTION & PLATFORM GOALS
    # ==========================================================
    s3 = prs.slides.add_slide(blank_layout)
    set_slide_background(s3, LIGHT_BG)
    add_header(s3, "Proposed Solution: The AI-IGMS Architecture")

    # Left Card: Core Vision
    add_card(s3, Inches(0.8), Inches(1.6), Inches(5.6), Inches(5.3))
    tb_l = s3.shapes.add_textbox(Inches(1.1), Inches(1.85), Inches(5.0), Inches(4.8))
    tf_l = tb_l.text_frame
    tf_l.word_wrap = True

    p = tf_l.paragraphs[0]
    p.text = "INTEGRATED DIGITAL ECOSYSTEM"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = ACCENT

    p_t = tf_l.add_paragraph()
    p_t.text = "Unified Single-Window Management"
    p_t.font.size = Pt(18)
    p_t.font.bold = True
    p_t.font.color.rgb = NAVY
    p_t.space_after = Pt(14)

    vision_pts = [
        "End-to-End Governance: Unifies administrative oversight from State Directorate to primary classroom level.",
        "Role-Specific Dashboards: Tailored interfaces for 5 distinct stakeholders with strict permission control.",
        "Real-Time Data Pipeline: Instant synchronization between MongoDB cloud databases, local fallbacks, and React UI.",
        "Zero Paper Dependency: Digital daily rosters, automated report cards, and instant notice delivery."
    ]
    for pt in vision_pts:
        p_pt = tf_l.add_paragraph()
        p_pt.text = f"✔  {pt}"
        p_pt.font.size = Pt(12)
        p_pt.font.color.rgb = SLATE_DARK
        p_pt.space_after = Pt(12)

    # Right Card: Key Highlights
    add_card(s3, Inches(6.8), Inches(1.6), Inches(5.7), Inches(5.3))
    tb_r = s3.shapes.add_textbox(Inches(7.1), Inches(1.85), Inches(5.1), Inches(4.8))
    tf_r = tb_r.text_frame
    tf_r.word_wrap = True

    p = tf_r.paragraphs[0]
    p.text = "KEY SYSTEM PILLARS"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = EMERALD

    p_t = tf_r.add_paragraph()
    p_t.text = "Innovation & Efficiency Highlights"
    p_t.font.size = Pt(18)
    p_t.font.bold = True
    p_t.font.color.rgb = NAVY
    p_t.space_after = Pt(14)

    pillars = [
        ("AI Paper Generator", "Curriculum-aligned question paper generation in English, Gujarati, and Hindi in under 2 seconds."),
        ("Automated Grading", "Self-evaluating online exam quizzes with score calculation and qualitative feedback."),
        ("Attendance & Leave Workflow", "One-click daily attendance marking with automated percentage tracking and faculty leave routing."),
        ("Timetable Matrix", "Dynamic 6-period weekly scheduling grid mapped by class standard, section, and subject teacher.")
    ]
    for title, desc in pillars:
        p_p1 = tf_r.add_paragraph()
        p_p1.text = f"▸ {title}:"
        p_p1.font.size = Pt(12)
        p_p1.font.bold = True
        p_p1.font.color.rgb = PRIMARY

        p_p2 = tf_r.add_paragraph()
        p_p2.text = f"   {desc}"
        p_p2.font.size = Pt(11)
        p_p2.font.color.rgb = SLATE_TEXT
        p_p2.space_after = Pt(8)

    # ==========================================================
    # SLIDE 4: SYSTEM ARCHITECTURE & DATA FLOW
    # ==========================================================
    s4 = prs.slides.add_slide(blank_layout)
    set_slide_background(s4, LIGHT_BG)
    add_header(s4, "System Architecture: Layered 3-Tier Design")

    arch_layers = [
        ("PRESENTATION LAYER (CLIENT)", "React 18 · Vite · Tailwind CSS · Framer Motion",
         ["Component-based UI with responsive dashboard layouts for Desktop & Mobile.",
          "Role-specific routes with client-side JWT token validation and AuthContext.",
          "Multilingual UI localization support (English & Gujarati toggle).",
          "Clean visual analytics cards, progress meters, and dynamic student rosters."],
         ACCENT),
        ("API & BUSINESS LOGIC LAYER", "Node.js · Express.js · RESTful API · JWT Middleware",
         ["Modular routing (`/api/students`, `/api/teachers`, `/api/exams`, `/api/ai`).",
          "Strict authentication middleware (`protect`, `roleGuard`) preventing unauthorized actions.",
          "Live AI prompt orchestrator connecting with Groq Cloud LLM engine.",
          "Integrated automatic evaluation and statistical data aggregation controllers."],
         PRIMARY),
        ("DATA & PERSISTENCE LAYER", "MongoDB Atlas (Cloud) · Local Replica · Groq API",
         ["High-performance MongoDB Atlas cloud database with 18 distinct collections.",
          "Mongoose schema validation ensuring relational consistency across records.",
          "Dual resilience architecture: cloud-first connection with local development fallback.",
          "Groq Cloud AI inference running `openai/gpt-oss-120b` and `qwen/qwen3.8-27b`."],
         EMERALD)
    ]

    for idx, (title, sub, items, color) in enumerate(arch_layers):
        c_top = Inches(1.6 + idx * 1.8)
        add_card(s4, Inches(0.8), c_top, Inches(11.733), Inches(1.65))

        # Colored indicator pill on left of card
        pill = s4.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), c_top, Inches(0.1), Inches(1.65))
        pill.fill.solid()
        pill.fill.fore_color.rgb = color
        pill.line.fill.background()

        tb = s4.shapes.add_textbox(Inches(1.1), c_top + Inches(0.12), Inches(11.2), Inches(1.4))
        tf = tb.text_frame
        tf.word_wrap = True

        p = tf.paragraphs[0]
        p.text = f"{title}  —  {sub}"
        p.font.size = Pt(13)
        p.font.bold = True
        p.font.color.rgb = color
        p.space_after = Pt(4)

        for item in items:
            p_i = tf.add_paragraph()
            p_i.text = f"• {item}"
            p_i.font.size = Pt(10.5)
            p_i.font.color.rgb = SLATE_DARK

    # ==========================================================
    # SLIDE 5: DATABASE ARCHITECTURE & SCHEMA DESIGN
    # ==========================================================
    s5 = prs.slides.add_slide(blank_layout)
    set_slide_background(s5, LIGHT_BG)
    add_header(s5, "Database Architecture: 18-Collection MongoDB Schema")

    # 4 Cards describing collections
    db_groups = [
        ("Identity & Access", PRIMARY, [
            ("Users Collection", "Stores email, hashedPassword (bcrypt), system role, account status, and timestamps."),
            ("Schools Master", "School registry details: registration ID, district, address, assigned Principal."),
            ("Principals Collection", "Principal profiles linked to assigned school ID with administrative rights.")
        ]),
        ("Academic Roster", ACCENT, [
            ("Students Master", "Roll number, standard (Std 1–8), division (A–D), guardian contact, attendance%."),
            ("Teachers Roster", "Faculty credentials, assigned subjects, designated classes, departmental rating."),
            ("Parents Directory", "Linked parent accounts mapped to student roll number and performance alerts.")
        ]),
        ("Exams & Analytics", EMERALD, [
            ("Exams Collection", "MCQ question papers, title, grade, subject, duration, question array, options."),
            ("Submissions Roster", "Recorded student responses, calculated scores, time elapsed, grading flags."),
            ("Results Registry", "Term exam marks, grade classification (A+ to F), and performance averages.")
        ]),
        ("School Operations", NAVY, [
            ("Timetable Registry", "6-period daily schedule slots organized by standard, section, and faculty."),
            ("Attendance Records", "Daily date-wise attendance logs, present/absent/late status, student IDs."),
            ("Leaves & Notices", "Faculty leave applications (casual/sick) and institutional broadcast circulars.")
        ])
    ]

    for idx, (grp_name, grp_col, items) in enumerate(db_groups):
        c_left = Inches(0.8 + idx * 3.0)
        add_card(s5, c_left, Inches(1.6), Inches(2.8), Inches(5.3))

        tb = s5.shapes.add_textbox(c_left + Inches(0.18), Inches(1.8), Inches(2.44), Inches(4.8))
        tf = tb.text_frame
        tf.word_wrap = True

        p = tf.paragraphs[0]
        p.text = grp_name.upper()
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = grp_col
        p.space_after = Pt(12)

        for col_name, col_desc in items:
            p_n = tf.add_paragraph()
            p_n.text = f"▪ {col_name}"
            p_n.font.size = Pt(11)
            p_n.font.bold = True
            p_n.font.color.rgb = NAVY

            p_d = tf.add_paragraph()
            p_d.text = col_desc
            p_d.font.size = Pt(9.5)
            p_d.font.color.rgb = SLATE_TEXT
            p_d.space_after = Pt(10)

    # ==========================================================
    # SLIDE 6: 5 ROLE-BASED PORTALS OVERVIEW
    # ==========================================================
    s6 = prs.slides.add_slide(blank_layout)
    set_slide_background(s6, LIGHT_BG)
    add_header(s6, "Role-Based Access Control: 5 Specialized Portals")

    roles_data = [
        ("1. Super Admin Portal", "Directorate of School Education",
         ["School network provisioning & creation",
          "Principal credential assignment & authorization",
          "District-wide statistical KPI monitoring",
          "System audit logging & administrative maintenance"],
         NAVY),
        ("2. Principal Portal", "Institutional Oversight & Governance",
         ["Student, Teacher, and Parent Master management",
          "Faculty leave application review & approvals",
          "School-wide timetable allocation and monitoring",
          "Circulars, directives, and emergency notice broadcasts"],
         PRIMARY),
        ("3. Teacher Portal", "Classroom & Academic Execution",
         ["Daily student attendance marking with live filters",
          "Live AI Question Paper generation in < 2 seconds",
          "Examination marks upload & grade assignments",
          "Leave applications and daily period timetable view"],
         ACCENT),
        ("4. Student Portal", "Digital Learning & Examination",
         ["Interactive online MCQ exam taking with timer",
          "Instant scorecard and correct answer review",
          "Daily attendance summary and subject performance",
          "Timetable view and school notice announcements"],
         EMERALD),
        ("5. Parent Portal", "Transparency & Child Progress",
         ["Real-time child attendance percentage tracking",
          "Examination result cards & subject progress meters",
          "Teacher and school authority contact directory",
          "Direct access to official circulars and notices"],
         RGBColor(180, 83, 9))
    ]

    # Display 5 horizontal cards or 2 rows
    # Let's do 3 on top row, 2 on bottom row
    coords = [
        (Inches(0.8), Inches(1.6), Inches(3.7), Inches(2.5)),
        (Inches(4.8), Inches(1.6), Inches(3.7), Inches(2.5)),
        (Inches(8.8), Inches(1.6), Inches(3.7), Inches(2.5)),
        (Inches(2.3), Inches(4.3), Inches(4.1), Inches(2.6)),
        (Inches(6.9), Inches(4.3), Inches(4.1), Inches(2.6)),
    ]

    for (title, sub, pts, col), (x, y, w, h) in zip(roles_data, coords):
        add_card(s6, x, y, w, h)
        tb = s6.shapes.add_textbox(x + Inches(0.2), y + Inches(0.15), w - Inches(0.4), h - Inches(0.3))
        tf = tb.text_frame
        tf.word_wrap = True

        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(13)
        p.font.bold = True
        p.font.color.rgb = col

        p_s = tf.add_paragraph()
        p_s.text = sub
        p_s.font.size = Pt(9.5)
        p_s.font.color.rgb = SLATE_TEXT
        p_s.space_after = Pt(6)

        for pt in pts:
            p_p = tf.add_paragraph()
            p_p.text = f"• {pt}"
            p_p.font.size = Pt(10)
            p_p.font.color.rgb = SLATE_DARK
            p_p.space_after = Pt(2)

    # ==========================================================
    # SLIDE 7: LIVE AI QUESTION PAPER GENERATOR
    # ==========================================================
    s7 = prs.slides.add_slide(blank_layout)
    set_slide_background(s7, LIGHT_BG)
    add_header(s7, "Core Innovation: Live Multilingual AI Paper Generator")

    # Left Column: Features
    add_card(s7, Inches(0.8), Inches(1.6), Inches(6.0), Inches(5.3))
    tb_l = s7.shapes.add_textbox(Inches(1.05), Inches(1.85), Inches(5.5), Inches(4.8))
    tf_l = tb_l.text_frame
    tf_l.word_wrap = True

    p = tf_l.paragraphs[0]
    p.text = "NEXT-GENERATION FACULTY TOOL"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = ACCENT

    p_t = tf_l.add_paragraph()
    p_t.text = "Curriculum-Aligned Paper Synthesis"
    p_t.font.size = Pt(18)
    p_t.font.bold = True
    p_t.font.color.rgb = NAVY
    p_t.space_after = Pt(12)

    ai_features = [
        ("Cloud AI Engine", "Direct API integration with Groq Cloud inference (`openai/gpt-oss-120b` & `qwen/qwen3.8-27b`)."),
        ("Grade Specificity", "Restricted strictly to primary and middle standards (Class 1 to Class 8) aligned with NCERT standards."),
        ("Strict Multilingual Generation", "Generates full exam papers strictly in English, Gujarati (ગુજરાતી), or Hindi (हिंदी) based on user selection."),
        ("Custom Chapter Targeting", "Teachers can paste specific chapter topics; AI formulates targeted MCQs with 4 distinct options."),
        ("Speed & Resilience", "Sub-2-second generation speed with intelligent local fallback ensuring zero downtime even offline.")
    ]
    for ft, desc in ai_features:
        p_f = tf_l.add_paragraph()
        p_f.text = f"✔ {ft}: {desc}"
        p_f.font.size = Pt(11)
        p_f.font.color.rgb = SLATE_DARK
        p_f.space_after = Pt(8)

    # Right Column: Multilingual Sample Comparison
    add_card(s7, Inches(7.1), Inches(1.6), Inches(5.4), Inches(5.3))
    tb_r = s7.shapes.add_textbox(Inches(7.35), Inches(1.85), Inches(4.9), Inches(4.8))
    tf_r = tb_r.text_frame
    tf_r.word_wrap = True

    p = tf_r.paragraphs[0]
    p.text = "MULTILINGUAL GENERATION EXAMPLES"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = EMERALD

    p_t = tf_r.add_paragraph()
    p_t.text = "Class 5 · Science (Photosynthesis)"
    p_t.font.size = Pt(16)
    p_t.font.bold = True
    p_t.font.color.rgb = NAVY
    p_t.space_after = Pt(10)

    samples = [
        ("English Paper Mode", "Q: Which pigment in leaves absorbs light for photosynthesis?\nOptions: A) Chlorophyll  B) Xanthophyll  C) Carotene  D) Ribosome\nAns: A) Chlorophyll"),
        ("Gujarati Paper Mode (ગુજરાતી)", "પ્રશ્ન: વનસ્પતિમાં પ્રકાશસંશ્લેષણ માટે કયું અંગિકા જવાબદાર છે?\nવિકલ્પો: A) ક્લોરોપ્લાસ્ટ (હરિજનોત્પાદક)  B) માઇટોકોન્ડ્રિયા  C) કોષદીવાલ\nસાચો જવાબ: A) ક્લોરોપ્લાસ્ટ"),
        ("Hindi Paper Mode (हिंदी)", "प्रश्न: प्रकाश संश्लेषण के दौरान पौधे कौन-सी गैस अवशोषित करते हैं?\nविकल्प: A) कार्बन डाइऑक्साइड  B) ऑक्सीजन  C) नाइट्रोजन\nसही उत्तर: A) कार्बन डाइऑक्साइड")
    ]
    for lang, sample in samples:
        p_l = tf_r.add_paragraph()
        p_l.text = f"▪ {lang}"
        p_l.font.size = Pt(11)
        p_l.font.bold = True
        p_l.font.color.rgb = PRIMARY

        p_s = tf_r.add_paragraph()
        p_s.text = sample
        p_s.font.size = Pt(9.5)
        p_s.font.color.rgb = SLATE_DARK
        p_s.space_after = Pt(8)

    # ==========================================================
    # SLIDE 8: EXAMINATION & AUTO-EVALUATION PIPELINE
    # ==========================================================
    s8 = prs.slides.add_slide(blank_layout)
    set_slide_background(s8, LIGHT_BG)
    add_header(s8, "Online Examination & Automated Grading Engine")

    steps_data = [
        ("Step 1", "Paper Creation & Publish", "Teacher generates question paper using AI or creates manual exam. Automatically published to MongoDB.", ACCENT),
        ("Step 2", "Student Online Quiz", "Student launches exam in clean portal. Timed countdown, question pagination, answer selection.", PRIMARY),
        ("Step 3", "Instant Auto-Grading", "Server evaluates submitted responses against correct answers. Calculates score, percentage, correct/wrong stats.", EMERALD),
        ("Step 4", "AI Performance Analytics", "Generates personalized diagnostic report detailing student strengths, gaps, and teacher recommendations.", NAVY)
    ]

    for idx, (st, title, desc, col) in enumerate(steps_data):
        c_left = Inches(0.8 + idx * 3.0)
        add_card(s8, c_left, Inches(1.6), Inches(2.8), Inches(5.3))

        tb = s8.shapes.add_textbox(c_left + Inches(0.2), Inches(1.85), Inches(2.4), Inches(4.8))
        tf = tb.text_frame
        tf.word_wrap = True

        p = tf.paragraphs[0]
        p.text = st.upper()
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = col

        p_t = tf.add_paragraph()
        p_t.text = title
        p_t.font.size = Pt(15)
        p_t.font.bold = True
        p_t.font.color.rgb = NAVY
        p_t.space_after = Pt(14)

        p_d = tf.add_paragraph()
        p_d.text = desc
        p_d.font.size = Pt(11)
        p_d.font.color.rgb = SLATE_DARK
        p_d.space_after = Pt(14)

        p_b = tf.add_paragraph()
        p_b.text = "Key Benefit:"
        p_b.font.size = Pt(11)
        p_b.font.bold = True
        p_b.font.color.rgb = PRIMARY

        benefits = [
            "Zero manual typing; instant database persistence.",
            "Eliminates paper waste; foolproof anti-cheat timer.",
            "Results available in 0 seconds; zero evaluation bias.",
            "Deep learning insights sent directly to student & parent."
        ]
        p_b2 = tf.add_paragraph()
        p_b2.text = benefits[idx]
        p_b2.font.size = Pt(10)
        p_b2.font.color.rgb = SLATE_TEXT

    # ==========================================================
    # SLIDE 9: ATTENDANCE, MARKS & TIMETABLE MANAGEMENT
    # ==========================================================
    s9 = prs.slides.add_slide(blank_layout)
    set_slide_background(s9, LIGHT_BG)
    add_header(s9, "Academic Operations: Attendance, Marks & Timetable")

    ops = [
        ("Daily Attendance Roster",
         "Digital Roll-Call System",
         ["Normalized class filtering across standards (Std 1–8) and divisions (Div A–D).",
          "One-click status toggling: Present (Green), Absent (Red), Late (Amber).",
          "Automated monthly percentage computation reflected instantly in Parent Portal.",
          "Bulk 'Mark All Present' convenience feature for fast classroom check-in."],
         EMERALD),
        ("Examination Marks Entry",
         "Standardized Grading System",
         ["Term-based mark entry (Unit Test 1, Mid-Term, Unit Test 2, Final Exam).",
          "Automatic grade classification bands: A+ (≥90%), A (≥80%), B, C, D, and F.",
          "Class average and top score KPI computation in real-time.",
          "Printable report cards and CSV export capability for official records."],
         PRIMARY),
        ("Weekly Timetable Matrix",
         "6-Period Scheduling Grid",
         ["Organized weekly schedule (Monday–Saturday) across 6 teaching periods.",
          "Dynamic assignment linking subject, teacher, room, and standard.",
          "Principals manage and update schedules with role-guarded editing rights.",
          "Students and parents view day-to-day timetable on their dedicated screens."],
         ACCENT)
    ]

    for idx, (tag, title, points, col) in enumerate(ops):
        c_left = Inches(0.8 + idx * 4.0)
        add_card(s9, c_left, Inches(1.6), Inches(3.7), Inches(5.3))

        tb = s9.shapes.add_textbox(c_left + Inches(0.25), Inches(1.85), Inches(3.2), Inches(4.8))
        tf = tb.text_frame
        tf.word_wrap = True

        p = tf.paragraphs[0]
        p.text = tag.upper()
        p.font.size = Pt(10)
        p.font.bold = True
        p.font.color.rgb = col

        p_t = tf.add_paragraph()
        p_t.text = title
        p_t.font.size = Pt(16)
        p_t.font.bold = True
        p_t.font.color.rgb = NAVY
        p_t.space_after = Pt(14)

        for pt in points:
            p_pt = tf.add_paragraph()
            p_pt.text = f"• {pt}"
            p_pt.font.size = Pt(11)
            p_pt.font.color.rgb = SLATE_DARK
            p_pt.space_after = Pt(10)

    # ==========================================================
    # SLIDE 10: SECURITY, AUTHENTICATION & RESILIENCE
    # ==========================================================
    s10 = prs.slides.add_slide(blank_layout)
    set_slide_background(s10, LIGHT_BG)
    add_header(s10, "Security Architecture & System Robustness")

    sec_cards = [
        ("JWT Stateless Auth", "Token-Based Security",
         "Industry-standard JSON Web Tokens (7-day validity) transmitted securely via HTTP headers. Encrypts user identity, role, and permissions.", ACCENT),
        ("Role Guard Middleware", "Strict Privilege Separation",
         "Backend route guards (`protectRoles(['super_admin', 'principal'])`) prevent unauthorized cross-role API access and horizontal privilege escalation.", PRIMARY),
        ("Credential Protection", "Bcrypt Hashing",
         "All user passwords hashed securely before storage in MongoDB. Zero plain-text credentials stored across database records.", EMERALD),
        ("Data Fault Tolerance", "Dual DB & Local Resilience",
         "Atlas Cloud cluster paired with automatic local fallback and state hydration. Prevents school operations freeze in rural network drops.", NAVY),
        ("Circuit-Breaker AI", "Timeout Protection",
         "2.5s maximum UI timeout using `Promise.race`. Guarantees paper generation never hangs or crashes even during network latency spikes.", ACCENT),
        ("Responsive Layout", "Cross-Device Compatibility",
         "Engineered with mobile-first Tailwind design. Functions smoothly on low-power school tablets, faculty laptops, and parents' mobile browsers.", PRIMARY)
    ]

    for idx, (title, sub, desc, col) in enumerate(sec_cards):
        col_idx = idx % 3
        row_idx = idx // 3
        c_left = Inches(0.8 + col_idx * 4.0)
        c_top = Inches(1.6 + row_idx * 2.7)

        add_card(s10, c_left, c_top, Inches(3.7), Inches(2.45))
        tb = s10.shapes.add_textbox(c_left + Inches(0.2), c_top + Inches(0.18), Inches(3.3), Inches(2.1))
        tf = tb.text_frame
        tf.word_wrap = True

        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(13)
        p.font.bold = True
        p.font.color.rgb = col

        p_s = tf.add_paragraph()
        p_s.text = sub
        p_s.font.size = Pt(10)
        p_s.font.color.rgb = NAVY
        p_s.space_after = Pt(6)

        p_d = tf.add_paragraph()
        p_d.text = desc
        p_d.font.size = Pt(10.5)
        p_d.font.color.rgb = SLATE_DARK

    # ==========================================================
    # SLIDE 11: TECHNOLOGY STACK & TOOLS
    # ==========================================================
    s11 = prs.slides.add_slide(blank_layout)
    set_slide_background(s11, LIGHT_BG)
    add_header(s11, "Technology Stack & Development Ecosystem")

    tech_data = [
        ("Frontend Technologies", ACCENT, [
            ("React 18", "Declarative component-driven user interface architecture."),
            ("Vite 5", "Next-gen lightning fast build tool and HMR dev server."),
            ("Tailwind CSS", "Utility-first design system for clean, modern interfaces."),
            ("Framer Motion", "Smooth UI transitions, interactive cards, and micro-animations."),
            ("React Icons", "Feather icons (`react-icons/fi`) for clean visual ergonomics.")
        ]),
        ("Backend & Database", PRIMARY, [
            ("Node.js", "Asynchronous, event-driven runtime environment."),
            ("Express.js", "Robust RESTful API web framework with modular routing."),
            ("MongoDB Atlas", "Cloud NoSQL document database hosting 18 collections."),
            ("Mongoose ORM", "Schema modeling, data validation, and aggregation pipelines."),
            ("JWT & Bcrypt", "Authentication tokens and cryptographic security.")
        ]),
        ("AI, Cloud & DevOps", EMERALD, [
            ("Groq Cloud API", "Ultra-fast LPU inference engine for live AI completions."),
            ("LLM Models", "`openai/gpt-oss-120b` & `qwen/qwen3.8-27b` for multilingual MCQs."),
            ("Git & GitHub", "Source version control (`24cs73-prince/CS26001-AI_IGMS`)."),
            ("JSON / CSV Export", "Structured data exports for offline school record keeping."),
            ("Antigravity IDE", "Collaborative development and comprehensive system testing.")
        ])
    ]

    for idx, (cat, col, items) in enumerate(tech_data):
        c_left = Inches(0.8 + idx * 4.0)
        add_card(s11, c_left, Inches(1.6), Inches(3.7), Inches(5.3))

        tb = s11.shapes.add_textbox(c_left + Inches(0.25), Inches(1.85), Inches(3.2), Inches(4.8))
        tf = tb.text_frame
        tf.word_wrap = True

        p = tf.paragraphs[0]
        p.text = cat.upper()
        p.font.size = Pt(12)
        p.font.bold = True
        p.font.color.rgb = col
        p.space_after = Pt(14)

        for name, desc in items:
            p_n = tf.add_paragraph()
            p_n.text = f"▪ {name}:"
            p_n.font.size = Pt(11)
            p_n.font.bold = True
            p_n.font.color.rgb = NAVY

            p_d = tf.add_paragraph()
            p_d.text = f"   {desc}"
            p_d.font.size = Pt(10)
            p_d.font.color.rgb = SLATE_TEXT
            p_d.space_after = Pt(8)

    # ==========================================================
    # SLIDE 12: SGP REVIEW 2 MILESTONES & FUTURE SCOPE
    # ==========================================================
    s12 = prs.slides.add_slide(blank_layout)
    set_slide_background(s12, NAVY)

    # Header in white
    tb_h = s12.shapes.add_textbox(Inches(0.8), Inches(0.5), Inches(11.5), Inches(0.9))
    tf_h = tb_h.text_frame
    p_h = tf_h.paragraphs[0]
    p_h.text = "SGP REVIEW 2 MILESTONES & FUTURE ROADMAP"
    p_h.font.size = Pt(22)
    p_h.font.bold = True
    p_h.font.color.rgb = WHITE

    # Left Card: Completed
    add_card(s12, Inches(0.8), Inches(1.6), Inches(5.6), Inches(5.2), bg=RGBColor(26, 43, 76), border=RGBColor(45, 75, 125))
    tb_c = s12.shapes.add_textbox(Inches(1.1), Inches(1.85), Inches(5.0), Inches(4.7))
    tf_c = tb_c.text_frame
    tf_c.word_wrap = True

    p = tf_c.paragraphs[0]
    p.text = "ACCOMPLISHED IN REVIEW 2"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = RGBColor(147, 197, 253)

    p_t = tf_c.add_paragraph()
    p_t.text = "Demonstrated Working Capabilities"
    p_t.font.size = Pt(16)
    p_t.font.bold = True
    p_t.font.color.rgb = WHITE
    p_t.space_after = Pt(12)

    done_pts = [
        "Full 5-Portal Role Ecosystem completely implemented and tested.",
        "MongoDB Atlas cloud persistence verified across all 18 collections.",
        "Live AI Question Paper Generator integrated with Groq Cloud LLM.",
        "Multilingual support live: English, Gujarati (ગુજરાતી), and Hindi (हिंदी).",
        "Sub-2-second paper generation with zero-hang circuit breaker.",
        "Student online exam taker and automated grading scorecard pipeline verified.",
        "Production code built cleanly and pushed to GitHub repository."
    ]
    for pt in done_pts:
        p_pt = tf_c.add_paragraph()
        p_pt.text = f"✔  {pt}"
        p_pt.font.size = Pt(11)
        p_pt.font.color.rgb = RGBColor(226, 232, 240)
        p_pt.space_after = Pt(7)

    # Right Card: Future Scope (Review 3)
    add_card(s12, Inches(6.8), Inches(1.6), Inches(5.7), Inches(5.2), bg=RGBColor(26, 43, 76), border=RGBColor(45, 75, 125))
    tb_f = s12.shapes.add_textbox(Inches(7.1), Inches(1.85), Inches(5.1), Inches(4.7))
    tf_f = tb_f.text_frame
    tf_f.word_wrap = True

    p = tf_f.paragraphs[0]
    p.text = "ROADMAP FOR REVIEW 3 & BEYOND"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = RGBColor(134, 239, 172)

    p_t = tf_f.add_paragraph()
    p_t.text = "Upcoming Planned Enhancements"
    p_t.font.size = Pt(16)
    p_t.font.bold = True
    p_t.font.color.rgb = WHITE
    p_t.space_after = Pt(12)

    future_pts = [
        "Automated WhatsApp & SMS Gateway for instant rural parent notifications.",
        "Biometric & RFID integration for automated classroom entrance attendance.",
        "Advanced visual analytics charts for state-level comparative school ranking.",
        "Offline Progressive Web App (PWA) with background sync for remote areas.",
        "Exportable PDF report card generation with digital QR signature verification."
    ]
    for pt in future_pts:
        p_pt = tf_f.add_paragraph()
        p_pt.text = f"▸  {pt}"
        p_pt.font.size = Pt(11.5)
        p_pt.font.color.rgb = RGBColor(226, 232, 240)
        p_pt.space_after = Pt(10)

    # Output file
    output_path = os.path.join(os.getcwd(), "AI_IGMS_SGP_Review_2.pptx")
    prs.save(output_path)
    print(f"Presentation saved successfully to: {output_path}")

if __name__ == "__main__":
    create_deck()
