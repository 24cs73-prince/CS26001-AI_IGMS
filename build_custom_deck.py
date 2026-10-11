import os
import sys
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

def create_presentation():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # Reusable Palette
    DARK_NAVY   = RGBColor(11, 19, 43)      # #0B132B
    DEEP_SLATE  = RGBColor(15, 23, 42)      # #0F172A
    CARD_DARK   = RGBColor(26, 38, 57)      # #1A2639
    MID_SLATE   = RGBColor(30, 41, 59)      # #1E293B
    TEXT_MUTED  = RGBColor(148, 163, 184)   # #94A3B8
    TEXT_DARK   = RGBColor(15, 23, 42)      # #0F172A
    WHITE       = RGBColor(255, 255, 255)

    PRIMARY_BLUE= RGBColor(37, 99, 235)     # #2563EB
    CYAN_ACCENT = RGBColor(6, 182, 212)     # #06B6D4
    EMERALD_GREEN=RGBColor(16, 185, 129)    # #10B981
    CORAL_RED   = RGBColor(239, 68, 68)     # #EF4444
    AMBER_GOLD  = RGBColor(245, 158, 11)    # #F59E0B
    PURPLE_ROYAL= RGBColor(139, 92, 246)    # #8B5CF6

    LIGHT_SLATE = RGBColor(241, 245, 249)   # #F1F5F9
    LIGHT_MINT  = RGBColor(240, 253, 244)   # #F0FDF4
    LIGHT_BLUE  = RGBColor(239, 246, 255)   # #EFF6FF
    LIGHT_PURPLE= RGBColor(245, 243, 255)   # #F5F3FF
    LIGHT_CYAN  = RGBColor(240, 249, 255)   # #F0F9FF
    CARD_WHITE  = RGBColor(255, 255, 255)
    BORDER_LIGHT= RGBColor(226, 232, 240)   # #E2E8F0

    def set_bg(slide, color):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
        bg.fill.solid()
        bg.fill.fore_color.rgb = color
        bg.line.fill.background()
        return bg

    def add_top_bar(slide, cat_text, title_text, dark_mode=False, cat_color=PRIMARY_BLUE):
        tb = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(11.7), Inches(0.9))
        tf = tb.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0

        p_cat = tf.paragraphs[0]
        p_cat.text = cat_text.upper()
        p_cat.font.size = Pt(10)
        p_cat.font.bold = True
        p_cat.font.color.rgb = cat_color

        p_t = tf.add_paragraph()
        p_t.text = title_text
        p_t.font.size = Pt(21)
        p_t.font.bold = True
        p_t.font.color.rgb = WHITE if dark_mode else DARK_NAVY
        p_t.space_before = Pt(3)

        # Subtle separator
        sep = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.35), Inches(11.733), Inches(0.015))
        sep.fill.solid()
        sep.fill.fore_color.rgb = RGBColor(51, 65, 85) if dark_mode else BORDER_LIGHT
        sep.line.fill.background()

    def add_card(slide, left, top, width, height, bg=CARD_WHITE, border=BORDER_LIGHT, border_width=1):
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        card.fill.solid()
        card.fill.fore_color.rgb = bg
        if border:
            card.line.color.rgb = border
            card.line.width = Pt(border_width)
        else:
            card.line.fill.background()
        return card

    # =========================================================================
    # SLIDE 1: HERO TITLE SLIDE (Dark Midnight Theme #0A192F)
    # =========================================================================
    s1 = prs.slides.add_slide(blank_layout)
    set_bg(s1, RGBColor(10, 25, 47))

    # Top Pill Badge
    badge = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(0.9), Inches(4.8), Inches(0.4))
    badge.fill.solid()
    badge.fill.fore_color.rgb = RGBColor(23, 42, 69)
    badge.line.color.rgb = CYAN_ACCENT
    badge.line.width = Pt(1)
    tf = badge.text_frame
    p = tf.paragraphs[0]
    p.text = "CHARUSAT CSE · SGP 5 · REVIEW 2 EVALUATION"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = CYAN_ACCENT
    p.alignment = PP_ALIGN.CENTER

    # Hero Titles
    tb = s1.shapes.add_textbox(Inches(0.8), Inches(1.5), Inches(11.7), Inches(2.2))
    tf = tb.text_frame
    tf.word_wrap = True
    
    p = tf.paragraphs[0]
    p.text = "AI-IGMS"
    p.font.size = Pt(44)
    p.font.bold = True
    p.font.color.rgb = WHITE

    p2 = tf.add_paragraph()
    p2.text = "AI-Enabled Integrated Government School Management System"
    p2.font.size = Pt(22)
    p2.font.bold = True
    p2.font.color.rgb = RGBColor(147, 197, 253)
    p2.space_before = Pt(4)

    p3 = tf.add_paragraph()
    p3.text = "A Multilingual 5-Role Digital Academic Platform Powered by Live LLM & MongoDB"
    p3.font.size = Pt(13)
    p3.font.color.rgb = TEXT_MUTED
    p3.space_before = Pt(8)

    # 3 Bottom Meta Cards
    # Card 1: Student Details
    c1 = add_card(s1, Inches(0.8), Inches(4.3), Inches(3.6), Inches(2.3), bg=RGBColor(23, 42, 69), border=PRIMARY_BLUE)
    tb = s1.shapes.add_textbox(Inches(1.0), Inches(4.5), Inches(3.2), Inches(1.9))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "STUDENT PRESENTER"
    p.font.size = Pt(10)
    p.font.bold = True
    p.font.color.rgb = CYAN_ACCENT
    p2 = tf.add_paragraph()
    p2.text = "Prince Patel"
    p2.font.size = Pt(18)
    p2.font.bold = True
    p2.font.color.rgb = WHITE
    p2.space_before = Pt(4)
    p3 = tf.add_paragraph()
    p3.text = "Student ID: 24CS073\nB.Tech Computer Science & Engg\nSemester 5 · 2025–26"
    p3.font.size = Pt(11)
    p3.font.color.rgb = TEXT_MUTED
    p3.space_before = Pt(6)

    # Card 2: Academic Institution
    c2 = add_card(s1, Inches(4.8), Inches(4.3), Inches(3.6), Inches(2.3), bg=RGBColor(23, 42, 69), border=EMERALD_GREEN)
    tb = s1.shapes.add_textbox(Inches(5.0), Inches(4.5), Inches(3.2), Inches(1.9))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "DEPARTMENT & GUIDE"
    p.font.size = Pt(10)
    p.font.bold = True
    p.font.color.rgb = EMERALD_GREEN
    p2 = tf.add_paragraph()
    p2.text = "CHARUSAT University"
    p2.font.size = Pt(18)
    p2.font.bold = True
    p2.font.color.rgb = WHITE
    p2.space_before = Pt(4)
    p3 = tf.add_paragraph()
    p3.text = "CSPIT · Dept. of Computer Science\nProject Review Committee\nSGP Review 2 Examination"
    p3.font.size = Pt(11)
    p3.font.color.rgb = TEXT_MUTED
    p3.space_before = Pt(6)

    # Card 3: Key Deliverables Highlight
    c3 = add_card(s1, Inches(8.8), Inches(4.3), Inches(3.7), Inches(2.3), bg=RGBColor(23, 42, 69), border=AMBER_GOLD)
    tb = s1.shapes.add_textbox(Inches(9.0), Inches(4.5), Inches(3.3), Inches(1.9))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "SYSTEM HIGHLIGHTS"
    p.font.size = Pt(10)
    p.font.bold = True
    p.font.color.rgb = AMBER_GOLD
    p2 = tf.add_paragraph()
    p2.text = "100% Live Architecture"
    p2.font.size = Pt(18)
    p2.font.bold = True
    p2.font.color.rgb = WHITE
    p2.space_before = Pt(4)
    p3 = tf.add_paragraph()
    p3.text = "• 5 Distinct Portals with RBAC\n• Multilingual AI Exam Generator\n• 18 Indexed MongoDB Collections\n• 0-Second Auto-Grading Engine"
    p3.font.size = Pt(11)
    p3.font.color.rgb = TEXT_MUTED
    p3.space_before = Pt(6)

    # =========================================================================
    # SLIDE 2: PROBLEM STATEMENT (Light Slate with Crimson & Amber Alert Cards)
    # =========================================================================
    s2 = prs.slides.add_slide(blank_layout)
    set_bg(s2, LIGHT_SLATE)
    add_top_bar(s2, "01 | Background & Motivation", "Critical Bottlenecks in Traditional School Administration", cat_color=CORAL_RED)

    # 3 High-Impact Problem Cards
    cards_data = [
        ("MANUAL PAPER REGISTERS", "45+ Hours Monthly Administrative Drain", 
         "Teachers spend over 45 minutes daily hand-marking physical attendance registers and calculating aggregates. Physical logs suffer from dampness, loss, tampering, and zero instant reporting to headmasters.", 
         CORAL_RED, RGBColor(254, 242, 242)),
        ("EXAMINATION FATIGUE", "High Cognitive Load & Days of Grading Lag", 
         "Creating custom terminal question papers across Grades 1–12 requires extensive teacher effort. Furthermore, grading 40+ paper answer sheets takes days, delaying learning feedback and creating human grading variance.", 
         AMBER_GOLD, RGBColor(254, 243, 199)),
        ("RURAL PARENTAL DISCONNECT", "Complete Blind Spot on Child Progress", 
         "Parents in rural government schools lack real-time visibility into whether their children attended school or how they performed on tests, leading to unchecked absenteeism and high dropout rates.", 
         PURPLE_ROYAL, RGBColor(245, 243, 255))
    ]

    for idx, (head, sub, desc, col, bg_col) in enumerate(cards_data):
        c_left = Inches(0.8 + idx * 3.95)
        add_card(s2, c_left, Inches(1.6), Inches(3.8), Inches(4.1), bg=bg_col, border=col, border_width=1.5)
        
        # Pill inside card
        tb = s2.shapes.add_textbox(c_left + Inches(0.2), Inches(1.8), Inches(3.4), Inches(3.6))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = f"CHALLENGE 0{idx+1} · {head}"
        p.font.size = Pt(9.5)
        p.font.bold = True
        p.font.color.rgb = col
        
        p2 = tf.add_paragraph()
        p2.text = sub
        p2.font.size = Pt(14)
        p2.font.bold = True
        p2.font.color.rgb = DARK_NAVY
        p2.space_before = Pt(8)
        p2.space_after = Pt(10)
        
        p3 = tf.add_paragraph()
        p3.text = desc
        p3.font.size = Pt(11)
        p3.font.color.rgb = RGBColor(71, 85, 105)

    # Bottom Stat Summary Bar
    stat_bar = add_card(s2, Inches(0.8), Inches(5.9), Inches(11.7), Inches(1.1), bg=DARK_NAVY, border=None)
    tb = s2.shapes.add_textbox(Inches(1.0), Inches(6.0), Inches(11.3), Inches(0.9))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "THE QUANTIFIABLE IMPACT OF EXISTING PROCESSES:"
    p.font.size = Pt(9)
    p.font.bold = True
    p.font.color.rgb = RGBColor(147, 197, 253)

    p2 = tf.add_paragraph()
    p2.text = "  ⚡ 78% Manual Admin Overhead    |    📉 Zero Real-Time Attendance Sync    |    ⏱️ 3-5 Days Evaluation Lag    |    🚫 No Multilingual Question Generator"
    p2.font.size = Pt(12)
    p2.font.bold = True
    p2.font.color.rgb = WHITE
    p2.space_before = Pt(4)

    # =========================================================================
    # SLIDE 3: PROPOSED SOLUTION (Light Mint Theme with 4 Colored Pillars)
    # =========================================================================
    s3 = prs.slides.add_slide(blank_layout)
    set_bg(s3, LIGHT_MINT)
    add_top_bar(s3, "02 | Objectives & Value Proposition", "AI-IGMS: The 4-Pillar Modernized School Ecosystem", cat_color=EMERALD_GREEN)

    pillars = [
        ("PILLAR 1", "Unified 5-Role Digital Portal", 
         "Provides isolated, secure dashboards for Super Admin, Principal, Teacher, Student, and Parent with role-specific access controls.", 
         PRIMARY_BLUE, RGBColor(239, 246, 255)),
        ("PILLAR 2", "Live Multilingual AI Engine", 
         "Groq Cloud LLM integration automatically generates standardized, syllabus-aligned question papers in English, Gujarati, and Hindi in under 2 seconds.", 
         EMERALD_GREEN, RGBColor(240, 253, 244)),
        ("PILLAR 3", "Online Exam & 0s Auto-Grading", 
         "Fully automated MCQ testing platform that instantly evaluates student submissions against MongoDB keys with zero teacher workload.", 
         PURPLE_ROYAL, RGBColor(245, 243, 255)),
        ("PILLAR 4", "Transparent Academic Operations", 
         "Real-time attendance tracking, marks entry with automatic grade calculation (A+–F), and timetable management across all standards.", 
         AMBER_GOLD, RGBColor(254, 243, 199))
    ]

    for idx, (pill, title, desc, col, bg_col) in enumerate(pillars):
        row = idx // 2
        col_idx = idx % 2
        c_left = Inches(0.8 + col_idx * 5.95)
        c_top = Inches(1.6 + row * 2.65)
        
        add_card(s3, c_left, c_top, Inches(5.75), Inches(2.45), bg=bg_col, border=col, border_width=1.5)
        
        tb = s3.shapes.add_textbox(c_left + Inches(0.3), c_top + Inches(0.2), Inches(5.15), Inches(2.05))
        tf = tb.text_frame
        tf.word_wrap = True
        
        p = tf.paragraphs[0]
        p.text = pill
        p.font.size = Pt(10)
        p.font.bold = True
        p.font.color.rgb = col
        
        p2 = tf.add_paragraph()
        p2.text = title
        p2.font.size = Pt(16)
        p2.font.bold = True
        p2.font.color.rgb = DARK_NAVY
        p2.space_before = Pt(4)
        
        p3 = tf.add_paragraph()
        p3.text = desc
        p3.font.size = Pt(11)
        p3.font.color.rgb = RGBColor(71, 85, 105)
        p3.space_before = Pt(6)

    # =========================================================================
    # SLIDE 4: 3-TIER SYSTEM ARCHITECTURE (Deep Midnight Dark Theme #0F172A)
    # =========================================================================
    s4 = prs.slides.add_slide(blank_layout)
    set_bg(s4, DEEP_SLATE)
    add_top_bar(s4, "03 | Technical Architecture", "3-Tier System Architecture & Communication Pipeline", dark_mode=True, cat_color=CYAN_ACCENT)

    tiers = [
        ("TIER 1: PRESENTATION CLIENT", "React 18 · Vite 5 · Tailwind CSS", 
         "• Responsive Single Page Application (SPA)\n• 5 Dedicated Role Portals with Dynamic Routing\n• Multi-Language UI (English / Gujarati / Hindi)\n• Axios HTTP Client with JWT Bearer Interceptors", 
         CYAN_ACCENT, Inches(1.6)),
        ("TIER 2: APPLICATION & LOGIC", "Node.js · Express.js REST API", 
         "• Stateless REST API with Granular Route Guards\n• JWT Token Generation & Bcrypt 10-Salt Hashing\n• Groq Cloud SDK Bridge with JSON Schema Enforcement\n• Circuit-Breaker Guard with 2.5s Failover Timeout", 
         EMERALD_GREEN, Inches(3.3)),
        ("TIER 3: DATA & AI INTELLIGENCE", "MongoDB Atlas & Groq LPU Engine", 
         "• 18 Normalized Collections with Indexed Keys\n• Multi-Tenant Isolation via schoolId & studentId\n• Llama-3.3-70B/8B Ultra-Fast Inference via Groq Cloud\n• Dual Cluster Resiliency (Atlas Cloud + Local Fallback)", 
         AMBER_GOLD, Inches(5.0))
    ]

    for title, subtitle, bullets, col, top_pos in tiers:
        add_card(s4, Inches(0.8), top_pos, Inches(11.7), Inches(1.5), bg=CARD_DARK, border=col, border_width=1.5)
        
        # Color accent strip on left
        strip = s4.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), top_pos, Inches(0.12), Inches(1.5))
        strip.fill.solid()
        strip.fill.fore_color.rgb = col
        strip.line.fill.background()

        tb = s4.shapes.add_textbox(Inches(1.2), top_pos + Inches(0.15), Inches(3.6), Inches(1.2))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(13)
        p.font.bold = True
        p.font.color.rgb = col
        p2 = tf.add_paragraph()
        p2.text = subtitle
        p2.font.size = Pt(11)
        p2.font.color.rgb = WHITE
        p2.space_before = Pt(4)

        tb2 = s4.shapes.add_textbox(Inches(5.0), top_pos + Inches(0.15), Inches(7.3), Inches(1.2))
        tf2 = tb2.text_frame
        tf2.word_wrap = True
        p = tf2.paragraphs[0]
        p.text = bullets
        p.font.size = Pt(10.5)
        p.font.color.rgb = RGBColor(203, 213, 225)

    # =========================================================================
    # SLIDE 5: DATABASE ARCHITECTURE (With Real MongoDB Compass Screenshot)
    # =========================================================================
    s5 = prs.slides.add_slide(blank_layout)
    set_bg(s5, LIGHT_SLATE)
    add_top_bar(s5, "04 | Persistence & Data Model", "MongoDB Database Architecture: 18 Indexed Collections", cat_color=EMERALD_GREEN)

    # Left: Schema Explanation (5.2" wide)
    c_left = add_card(s5, Inches(0.8), Inches(1.6), Inches(5.4), Inches(5.4), bg=CARD_WHITE, border=BORDER_LIGHT)
    tb = s5.shapes.add_textbox(Inches(1.0), Inches(1.8), Inches(5.0), Inches(5.0))
    tf = tb.text_frame
    tf.word_wrap = True

    p = tf.paragraphs[0]
    p.text = "18 COLLECTIONS STRUCTURED BY DOMAIN"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = EMERALD_GREEN

    domains = [
        ("Auth & System", "Users, Schools, Audits", "Manages credentials, school profile, and audit logs with role-based claims."),
        ("Stakeholder Profiles", "Students, Teachers, Parents", "Maintains relational entities linked through unique IDs (teacherId, studentId)."),
        ("Exams & AI Engine", "Exams, Submissions, Results", "Stores published AI papers, questions with answer keys, and student submission logs."),
        ("Academic Operations", "Attendance, Timetables, Leaves, Notices", "Tracks daily attendance rosters, 6-period weekly matrices, and official circulars.")
    ]

    for d_title, d_cols, d_desc in domains:
        p_t = tf.add_paragraph()
        p_t.text = f"📁 {d_title} ({d_cols})"
        p_t.font.size = Pt(12)
        p_t.font.bold = True
        p_t.font.color.rgb = DARK_NAVY
        p_t.space_before = Pt(8)

        p_d = tf.add_paragraph()
        p_d.text = d_desc
        p_d.font.size = Pt(10)
        p_d.font.color.rgb = RGBColor(71, 85, 105)
        p_d.space_before = Pt(2)

    # Right: Embedded MongoDB Compass Screenshot (6.1" wide)
    compass_img = os.path.abspath("presentation_assets/media_1791476719428.png")
    if os.path.exists(compass_img):
        # Card container for photo
        img_card = add_card(s5, Inches(6.5), Inches(1.6), Inches(6.0), Inches(5.4), bg=CARD_WHITE, border=EMERALD_GREEN, border_width=1.5)
        # Add screenshot
        s5.shapes.add_picture(compass_img, Inches(6.6), Inches(2.1), width=Inches(5.8))
        
        # Caption bar
        tb_cap = s5.shapes.add_textbox(Inches(6.6), Inches(1.7), Inches(5.8), Inches(0.4))
        tf_cap = tb_cap.text_frame
        p_cap = tf_cap.paragraphs[0]
        p_cap.text = "LIVE MONGODB COMPASS INSPECTION · ai_igms > teachers"
        p_cap.font.size = Pt(9.5)
        p_cap.font.bold = True
        p_cap.font.color.rgb = EMERALD_GREEN

    # =========================================================================
    # SLIDE 6: 5 ROLE-BASED PORTALS (With Real Super Admin Dashboard Screenshot)
    # =========================================================================
    s6 = prs.slides.add_slide(blank_layout)
    set_bg(s6, LIGHT_BLUE)
    add_top_bar(s6, "05 | Role-Based Access Control", "5 Dedicated Portals with Granular RBAC Security", cat_color=PRIMARY_BLUE)

    # Left: Role Descriptions
    c_left = add_card(s6, Inches(0.8), Inches(1.6), Inches(5.4), Inches(5.4), bg=CARD_WHITE, border=BORDER_LIGHT)
    tb = s6.shapes.add_textbox(Inches(1.0), Inches(1.8), Inches(5.0), Inches(5.0))
    tf = tb.text_frame
    tf.word_wrap = True

    p = tf.paragraphs[0]
    p.text = "GRANULAR ROLE GOVERNANCE"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = PRIMARY_BLUE

    roles_data = [
        ("Super Admin", "State command center, onboard schools, district audits, state-wide enrolment metrics."),
        ("Principal", "School operations, teacher roster management, student master records, circular notices."),
        ("Teacher", "AI question generator, publish exams, mark daily attendance, input marks, class timetable."),
        ("Student", "Attempt timed online exams, view immediate report cards, check timetable & announcements."),
        ("Parent", "Live attendance tracking of child, terminal marks view, leave applications, school direct alerts.")
    ]

    for r_title, r_desc in roles_data:
        p_t = tf.add_paragraph()
        p_t.text = f"👤 {r_title} Portal"
        p_t.font.size = Pt(12)
        p_t.font.bold = True
        p_t.font.color.rgb = DARK_NAVY
        p_t.space_before = Pt(6)

        p_d = tf.add_paragraph()
        p_d.text = r_desc
        p_d.font.size = Pt(10)
        p_d.font.color.rgb = RGBColor(71, 85, 105)
        p_d.space_before = Pt(2)

    # Right: Embedded Super Admin Screenshot
    super_admin_img = os.path.abspath("presentation_assets/media_1791474270915.png")
    if os.path.exists(super_admin_img):
        img_card = add_card(s6, Inches(6.5), Inches(1.6), Inches(6.0), Inches(5.4), bg=CARD_WHITE, border=PRIMARY_BLUE, border_width=1.5)
        s6.shapes.add_picture(super_admin_img, Inches(6.6), Inches(2.1), width=Inches(5.8))
        
        tb_cap = s6.shapes.add_textbox(Inches(6.6), Inches(1.7), Inches(5.8), Inches(0.4))
        tf_cap = tb_cap.text_frame
        p_cap = tf_cap.paragraphs[0]
        p_cap.text = "LIVE SUPER ADMIN COMMAND CENTER (GOVT OF GUJARAT)"
        p_cap.font.size = Pt(9.5)
        p_cap.font.bold = True
        p_cap.font.color.rgb = PRIMARY_BLUE

    # =========================================================================
    # SLIDE 7: LIVE MULTILINGUAL AI PAPER GENERATOR (With Real Gujarati Screenshot)
    # =========================================================================
    s7 = prs.slides.add_slide(blank_layout)
    set_bg(s7, LIGHT_PURPLE)
    add_top_bar(s7, "06 | Live Artificial Intelligence Engine", "Multilingual Live AI Paper Generator (Groq Cloud LLM)", cat_color=PURPLE_ROYAL)

    # Left: AI Engine Details
    c_left = add_card(s7, Inches(0.8), Inches(1.6), Inches(5.4), Inches(5.4), bg=CARD_WHITE, border=BORDER_LIGHT)
    tb = s7.shapes.add_textbox(Inches(1.0), Inches(1.8), Inches(5.0), Inches(5.0))
    tf = tb.text_frame
    tf.word_wrap = True

    p = tf.paragraphs[0]
    p.text = "GROQ CLOUD LPU INFERENCE ENGINE"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = PURPLE_ROYAL

    ai_features = [
        ("Multilingual Generation", "Native support for English, Gujarati (ગુજરાતી), and Hindi (हिन्दी) with 100% language fidelity."),
        ("Sub-2 Second Generation", "Powered by Groq LPU Llama-3.3 hardware acceleration, delivering 10-question papers in < 2.0s without server lag."),
        ("Syllabus & Difficulty Matching", "Generates age-appropriate questions aligned to Class 1–12 with custom difficulty sliders (Easy / Medium / Hard)."),
        ("Strict JSON Schema Output", "Enforces rigid JSON schema validation: question title, 4 options, and correct answer key for instant zero-error database publication."),
        ("Fail-Safe Circuit Breaker", "Embedded fallback question cache ensures the teacher never faces timeouts even if internet drops.")
    ]

    for a_title, a_desc in ai_features:
        p_t = tf.add_paragraph()
        p_t.text = f"✨ {a_title}"
        p_t.font.size = Pt(11.5)
        p_t.font.bold = True
        p_t.font.color.rgb = DARK_NAVY
        p_t.space_before = Pt(6)

        p_d = tf.add_paragraph()
        p_d.text = a_desc
        p_d.font.size = Pt(10)
        p_d.font.color.rgb = RGBColor(71, 85, 105)
        p_d.space_before = Pt(2)

    # Right: Embedded Gujarati Paper Screenshot
    guj_img = os.path.abspath("presentation_assets/media_1791657269059.png")
    if os.path.exists(guj_img):
        img_card = add_card(s7, Inches(6.5), Inches(1.6), Inches(6.0), Inches(5.4), bg=CARD_WHITE, border=PURPLE_ROYAL, border_width=1.5)
        s7.shapes.add_picture(guj_img, Inches(6.6), Inches(2.1), width=Inches(5.8))
        
        tb_cap = s7.shapes.add_textbox(Inches(6.6), Inches(1.7), Inches(5.8), Inches(0.4))
        tf_cap = tb_cap.text_frame
        p_cap = tf_cap.paragraphs[0]
        p_cap.text = "LIVE GUJARATI AI PAPER GENERATED IN TEACHER PORTAL"
        p_cap.font.size = Pt(9.5)
        p_cap.font.bold = True
        p_cap.font.color.rgb = PURPLE_ROYAL

    # =========================================================================
    # SLIDE 8: ONLINE EXAM ENGINE & AUTO-GRADING (With Real Published Exam Screenshot)
    # =========================================================================
    s8 = prs.slides.add_slide(blank_layout)
    set_bg(s8, LIGHT_CYAN)
    add_top_bar(s8, "07 | Assessment & Auto-Grading Engine", "Automated Online Examination & Zero-Latency Scoring", cat_color=CYAN_ACCENT)

    # Left: Exam Pipeline
    c_left = add_card(s8, Inches(0.8), Inches(1.6), Inches(5.4), Inches(5.4), bg=CARD_WHITE, border=BORDER_LIGHT)
    tb = s8.shapes.add_textbox(Inches(1.0), Inches(1.8), Inches(5.0), Inches(5.0))
    tf = tb.text_frame
    tf.word_wrap = True

    p = tf.paragraphs[0]
    p.text = "AUTOMATED EXAM EVALUATION LIFECYCLE"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = CYAN_ACCENT

    exam_steps = [
        ("Step 1: One-Click Publishing", "AI-generated papers are immediately saved into the Exams collection with status 'Published' and allocated to specific classes."),
        ("Step 2: Timed Student Assessment", "Students take the test inside a clean, distraction-free interface with countdown timer and randomized option presentation."),
        ("Step 3: 0-Second Auto-Grading", "Upon submission, answers are instantly matched against MongoDB answer keys on the server—zero human evaluation required."),
        ("Step 4: Real-Time Report Card", "Students and teachers receive immediate score breakdowns, correct answer reviews, and percentage rankings."),
        ("Step 5: PDF Export & Archive", "Teachers can print official PDF question papers with school header and answer keys with a single click.")
    ]

    for e_title, e_desc in exam_steps:
        p_t = tf.add_paragraph()
        p_t.text = f"⚙️ {e_title}"
        p_t.font.size = Pt(11.5)
        p_t.font.bold = True
        p_t.font.color.rgb = DARK_NAVY
        p_t.space_before = Pt(6)

        p_d = tf.add_paragraph()
        p_d.text = e_desc
        p_d.font.size = Pt(10)
        p_d.font.color.rgb = RGBColor(71, 85, 105)
        p_d.space_before = Pt(2)

    # Right: Embedded Published Exam Screenshot
    exam_img = os.path.abspath("presentation_assets/media_1791654171228.png")
    if os.path.exists(exam_img):
        img_card = add_card(s8, Inches(6.5), Inches(1.6), Inches(6.0), Inches(5.4), bg=CARD_WHITE, border=CYAN_ACCENT, border_width=1.5)
        s8.shapes.add_picture(exam_img, Inches(6.6), Inches(2.1), width=Inches(5.8))
        
        tb_cap = s8.shapes.add_textbox(Inches(6.6), Inches(1.7), Inches(5.8), Inches(0.4))
        tf_cap = tb_cap.text_frame
        p_cap = tf_cap.paragraphs[0]
        p_cap.text = "LIVE EXAM AUTO-PUBLISHED TO MONGODB DATABASE"
        p_cap.font.size = Pt(9.5)
        p_cap.font.bold = True
        p_cap.font.color.rgb = CYAN_ACCENT

    # =========================================================================
    # SLIDE 9: ACADEMIC OPERATIONS MODULE (With Real Attendance Screenshot)
    # =========================================================================
    s9 = prs.slides.add_slide(blank_layout)
    set_bg(s9, LIGHT_SLATE)
    add_top_bar(s9, "08 | Core Academic Modules", "Daily Attendance, Marksheet Entry & Timetable Scheduling", cat_color=EMERALD_GREEN)

    # Left: Operations Overview
    c_left = add_card(s9, Inches(0.8), Inches(1.6), Inches(5.4), Inches(5.4), bg=CARD_WHITE, border=BORDER_LIGHT)
    tb = s9.shapes.add_textbox(Inches(1.0), Inches(1.8), Inches(5.0), Inches(5.0))
    tf = tb.text_frame
    tf.word_wrap = True

    p = tf.paragraphs[0]
    p.text = "ACADEMIC OPERATIONS INFRASTRUCTURE"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = EMERALD_GREEN

    ops = [
        ("Daily Attendance Roster", "Teachers select Standard & Division, then mark students Present or Absent with single clicks. Aggregates update automatically with date indexing."),
        ("Student Marks Management", "Direct marks upload interface with automated grade bands (A+, A, B, C, F), class averages, and permanent MongoDB persistence."),
        ("Weekly Timetable Matrix", "Dynamic 6-period daily timetable schedule mapping subject, teacher, and classroom allocations without double-booking conflicts."),
        ("Leave & Notice Circulars", "Teachers apply for leave directly to the Principal, and official school circulars broadcast instantly across portals.")
    ]

    for o_title, o_desc in ops:
        p_t = tf.add_paragraph()
        p_t.text = f"📋 {o_title}"
        p_t.font.size = Pt(12)
        p_t.font.bold = True
        p_t.font.color.rgb = DARK_NAVY
        p_t.space_before = Pt(8)

        p_d = tf.add_paragraph()
        p_d.text = o_desc
        p_d.font.size = Pt(10)
        p_d.font.color.rgb = RGBColor(71, 85, 105)
        p_d.space_before = Pt(2)

    # Right: Embedded Attendance Screenshot
    att_img = os.path.abspath("presentation_assets/media_1791651191349.png")
    if os.path.exists(att_img):
        img_card = add_card(s9, Inches(6.5), Inches(1.6), Inches(6.0), Inches(5.4), bg=CARD_WHITE, border=EMERALD_GREEN, border_width=1.5)
        s9.shapes.add_picture(att_img, Inches(6.6), Inches(2.1), width=Inches(5.8))
        
        tb_cap = s9.shapes.add_textbox(Inches(6.6), Inches(1.7), Inches(5.8), Inches(0.4))
        tf_cap = tb_cap.text_frame
        p_cap = tf_cap.paragraphs[0]
        p_cap.text = "LIVE ATTENDANCE ROSTER MODULE IN TEACHER PORTAL"
        p_cap.font.size = Pt(9.5)
        p_cap.font.bold = True
        p_cap.font.color.rgb = EMERALD_GREEN

    # =========================================================================
    # SLIDE 10: SECURITY & FAULT TOLERANCE (Dark Midnight Theme #0B132B)
    # =========================================================================
    s10 = prs.slides.add_slide(blank_layout)
    set_bg(s10, DARK_NAVY)
    add_top_bar(s10, "09 | Security & System Reliability", "Enterprise Security & Fault-Tolerant Architecture", dark_mode=True, cat_color=CYAN_ACCENT)

    shields = [
        ("STATELESS JWT AUTHENTICATION", "Cryptographic Token Verification", 
         "Every authenticated session receives a signed JWT token containing userId and role. Sent via HTTP Bearer headers and validated by server middleware on every request.", 
         CYAN_ACCENT),
        ("BCRYPT PASSWORD SALTING", "10-Round Cryptographic Hashing", 
         "All user passwords across all 5 roles are hashed using Bcrypt with 10 salt rounds before database persistence. Plain-text passwords are never stored or logged.", 
         EMERALD_GREEN),
        ("GRANULAR ROUTE GUARDS", "Role-Based Endpoint Protection", 
         "Client routes and Express endpoints enforce role authorization checks. A student or teacher cannot access admin endpoints or mutate other students' records.", 
         AMBER_GOLD),
        ("CIRCUIT BREAKER & FAILOVER", "2.5s Timeout Guard & Dual Cluster", 
         "Groq AI requests enforce a strict 2.5-second circuit breaker with automatic local fallback. Database connection features automatic retry between Atlas Cloud and local cluster.", 
         PURPLE_ROYAL)
    ]

    for idx, (head, sub, desc, col) in enumerate(shields):
        row = idx // 2
        col_idx = idx % 2
        c_left = Inches(0.8 + col_idx * 5.95)
        c_top = Inches(1.6 + row * 2.65)

        add_card(s10, c_left, c_top, Inches(5.75), Inches(2.45), bg=CARD_DARK, border=col, border_width=1.5)
        
        tb = s10.shapes.add_textbox(c_left + Inches(0.3), c_top + Inches(0.2), Inches(5.15), Inches(2.05))
        tf = tb.text_frame
        tf.word_wrap = True
        
        p = tf.paragraphs[0]
        p.text = f"🛡️ {head}"
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = col
        
        p2 = tf.add_paragraph()
        p2.text = sub
        p2.font.size = Pt(15)
        p2.font.bold = True
        p2.font.color.rgb = WHITE
        p2.space_before = Pt(4)
        
        p3 = tf.add_paragraph()
        p3.text = desc
        p3.font.size = Pt(10.5)
        p3.font.color.rgb = TEXT_MUTED
        p3.space_before = Pt(6)

    # =========================================================================
    # SLIDE 11: TECHNOLOGY STACK (Multi-Color Tech Badges)
    # =========================================================================
    s11 = prs.slides.add_slide(blank_layout)
    set_bg(s11, LIGHT_SLATE)
    add_top_bar(s11, "10 | Implementation Specifications", "Full-Stack Technology Stack & Developer Tooling", cat_color=PRIMARY_BLUE)

    techs = [
        ("FRONTEND SPA", "React 18 & Vite 5", "Modular component architecture, React Hooks, React Router 6, instant Hot Module Replacement (HMR).", PRIMARY_BLUE),
        ("UI & STYLING", "Tailwind CSS & Lucide Icons", "Utility-first responsive styling, accessible government color palette, rich interactive iconography.", CYAN_ACCENT),
        ("BACKEND RUNTIME", "Node.js & Express.js", "High-throughput asynchronous event-driven RESTful API server with custom route middlewares.", EMERALD_GREEN),
        ("DATABASE LAYER", "MongoDB Atlas & Mongoose", "Scalable document store, schema validations, indexed relational foreign references (ObjectId).", RGBColor(16, 124, 65)),
        ("AI ENGINE", "Groq Cloud LPU (Llama-3.3)", "Low-latency tensor processor inference with prompt engineering and strict JSON schema output.", PURPLE_ROYAL),
        ("SECURITY & DEVOPS", "JWT, Bcrypt & Git", "Stateless bearer authentication, 10-salt password hashing, Git version management.", AMBER_GOLD)
    ]

    for idx, (cat, name, desc, col) in enumerate(techs):
        row = idx // 3
        col_idx = idx % 3
        c_left = Inches(0.8 + col_idx * 3.95)
        c_top = Inches(1.6 + row * 2.65)

        add_card(s11, c_left, c_top, Inches(3.8), Inches(2.45), bg=CARD_WHITE, border=col, border_width=1.5)
        
        # Color top banner inside card
        tb = s11.shapes.add_textbox(c_left + Inches(0.2), c_top + Inches(0.2), Inches(3.4), Inches(2.05))
        tf = tb.text_frame
        tf.word_wrap = True
        
        p = tf.paragraphs[0]
        p.text = cat
        p.font.size = Pt(9.5)
        p.font.bold = True
        p.font.color.rgb = col
        
        p2 = tf.add_paragraph()
        p2.text = name
        p2.font.size = Pt(15)
        p2.font.bold = True
        p2.font.color.rgb = DARK_NAVY
        p2.space_before = Pt(4)
        
        p3 = tf.add_paragraph()
        p3.text = desc
        p3.font.size = Pt(10.5)
        p3.font.color.rgb = RGBColor(71, 85, 105)
        p3.space_before = Pt(6)

    # =========================================================================
    # SLIDE 12: SGP REVIEW 2 DELIVERABLES & ROADMAP (Executive Navy Theme)
    # =========================================================================
    s12 = prs.slides.add_slide(blank_layout)
    set_bg(s12, DEEP_SLATE)
    add_top_bar(s12, "11 | Project Milestones & Progress", "SGP Review 2 Deliverables & Review 3 Roadmap", dark_mode=True, cat_color=EMERALD_GREEN)

    stages = [
        ("PHASE 1 (COMPLETED)", "Review 1 Foundation", 
         "✅ Problem definition & literature review\n✅ UI wireframing for all 5 roles\n✅ Baseline MongoDB schema architecture\n✅ REST API endpoint design", 
         PRIMARY_BLUE),
        ("PHASE 2 (LIVE & WORKING)", "Review 2 Deliverables (100% Done)", 
         "✅ 5 Role-Based Portals fully functional\n✅ Live Multilingual AI Paper Generator (English, Gujarati, Hindi)\n✅ 18 MongoDB collections modeled & live\n✅ Online exam taking & 0s auto-grading\n✅ Attendance, marks & timetable modules", 
         EMERALD_GREEN),
        ("PHASE 3 (NEXT MILESTONE)", "Review 3 & Final Scope", 
         "🚀 Automated Parent SMS / WhatsApp alerts\n🚀 AI Student Weak-Topic Diagnostic Tutor\n🚀 Progressive Web App (PWA) offline sync for remote rural schools\n🚀 Final performance benchmarking & viva", 
         AMBER_GOLD)
    ]

    for idx, (p_title, p_sub, p_bullets, col) in enumerate(stages):
        c_left = Inches(0.8 + idx * 3.95)
        add_card(s12, c_left, Inches(1.6), Inches(3.8), Inches(4.3), bg=CARD_DARK, border=col, border_width=1.5)

        tb = s12.shapes.add_textbox(c_left + Inches(0.25), Inches(1.8), Inches(3.3), Inches(3.9))
        tf = tb.text_frame
        tf.word_wrap = True

        p = tf.paragraphs[0]
        p.text = p_title
        p.font.size = Pt(10)
        p.font.bold = True
        p.font.color.rgb = col

        p2 = tf.add_paragraph()
        p2.text = p_sub
        p2.font.size = Pt(15)
        p2.font.bold = True
        p2.font.color.rgb = WHITE
        p2.space_before = Pt(4)
        p2.space_after = Pt(10)

        p3 = tf.add_paragraph()
        p3.text = p_bullets
        p3.font.size = Pt(11)
        p3.font.color.rgb = RGBColor(226, 232, 240)

    # Bottom Thank You / Q&A Card
    qa_card = add_card(s12, Inches(0.8), Inches(6.05), Inches(11.7), Inches(0.95), bg=RGBColor(23, 42, 69), border=PRIMARY_BLUE)
    tb = s12.shapes.add_textbox(Inches(1.0), Inches(6.15), Inches(11.3), Inches(0.75))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "CHARUSAT UNIVERSITY · CSE DEPARTMENT · SGP REVIEW 2 EVALUATION"
    p.font.size = Pt(10)
    p.font.bold = True
    p.font.color.rgb = CYAN_ACCENT

    p2 = tf.add_paragraph()
    p2.text = "Thank You! Questions & Live System Demonstration Open for Faculty Reviewers."
    p2.font.size = Pt(13)
    p2.font.bold = True
    p2.font.color.rgb = WHITE
    p2.space_before = Pt(2)

    prs.save("AI_IGMS_SGP_Review_2.pptx")
    print("Successfully built AI_IGMS_SGP_Review_2.pptx with all unique layouts and embedded screenshots!")

if __name__ == "__main__":
    create_presentation()
