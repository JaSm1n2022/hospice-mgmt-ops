import os
from datetime import date, timedelta
from reportlab.lib.pagesizes import letter, landscape
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.platypus import (BaseDocTemplate, PageTemplate, Frame, Paragraph,
                                Table, TableStyle, Spacer, KeepTogether)

OUT = os.environ.get("HOPE_OUT", "HOPE_Report_Mockup.pdf")
PAGE = landscape(letter)
W, H = PAGE

GREEN = colors.HexColor("#2E6B3F")
GREEN_MID = colors.HexColor("#5A9A68")
GREEN_LIGHT = colors.HexColor("#DDEFD9")
GREEN_PALE = colors.HexColor("#F3F9F1")
INK = colors.HexColor("#22302A")
MUTED = colors.HexColor("#6B7B72")
LINE = colors.HexColor("#C9DCC6")
AMBER = colors.HexColor("#C98A12"); AMBER_BG = colors.HexColor("#FDF3DE")
BLUE = colors.HexColor("#3B6EA5"); BLUE_BG = colors.HexColor("#E6EEF8")
GREY_BG = colors.HexColor("#EEF1EF")
RED = colors.HexColor("#B23B3B"); RED_BG = colors.HexColor("#F9E4E4")

def S(name, **kw):
    base = dict(fontName="Helvetica", fontSize=9, leading=11.5, textColor=INK)
    base.update(kw); return ParagraphStyle(name, **base)

sTitle = S("t", fontName="Helvetica-Bold", fontSize=18, leading=22, textColor=GREEN)
sSub = S("s", fontSize=9.5, textColor=MUTED)
sH = S("h", fontName="Helvetica-Bold", fontSize=12, leading=15, textColor=GREEN)
sHnote = S("hn", fontSize=8, textColor=MUTED)
sLbl = S("l", fontName="Helvetica-Bold", fontSize=7.5, leading=9, textColor=MUTED)
sVal = S("v", fontSize=9.5, leading=12)
sValB = S("vb", fontName="Helvetica-Bold", fontSize=9.5, leading=12)
sCellHdrDay = S("chd", fontName="Helvetica-Bold", fontSize=8.5, leading=10, textColor=colors.white, alignment=TA_CENTER)
sCellHdrSub = S("chs", fontSize=7, leading=8.5, textColor=colors.HexColor("#E3F1E0"), alignment=TA_CENTER)
sCellC = S("cc", fontSize=8.5, leading=10.5, alignment=TA_CENTER)
sCellCB = S("ccb", fontName="Helvetica-Bold", fontSize=8.5, leading=10.5, alignment=TA_CENTER)
sRowLbl = S("rl", fontName="Helvetica-Bold", fontSize=8, leading=10, textColor=GREEN)
sSmall = S("sm", fontSize=7.5, leading=9.5, textColor=MUTED)

# ---------------- MOCK DATA ----------------
ADMIT = date(2026, 10, 20)
TODAY = date(2026, 11, 12)
fmt = lambda d: d.strftime("%m/%d/%Y")
add = lambda n: ADMIT + timedelta(days=n)

patient = {
    "Patient": "Doe, Jane (MOCK)", "MRN": "HT-000123", "Primary Dx": "G30.1 Alzheimer's, late onset",
    "Level of Care": "Routine Home Care", "Case Manager": "RN Case Manager", "Report Date": fmt(TODAY),
}

# milestone: (day label, subtitle, target text, actual, status)
milestones = [
    ("Admit", "Admit Date", fmt(ADMIT), fmt(ADMIT), "done"),
    ("Day 2", "SFV Due", fmt(add(2)), fmt(add(1)), "done"),
    ("Day 5", "Comprehensive Assessment", fmt(add(5)), fmt(add(4)), "done"),
    ("Day 6-12", "HUV1 Window", f"{add(6).strftime('%m/%d')}-{add(12).strftime('%m/%d')}", fmt(add(9)), "done"),
    ("Day 13", "SFV Due", fmt(add(13)), fmt(add(11)), "done"),
    ("Day 15", "HUV1 Completed", fmt(add(15)), fmt(add(9)), "done"),
    ("Day 16-22", "HUV2 Window", f"{add(16).strftime('%m/%d')}-{add(22).strftime('%m/%d')}", fmt(add(19)), "done"),
    ("Day 28", "SFV Due", fmt(add(28)), "—", "due"),
    ("Day 30", "HUV2 Completed", fmt(add(30)), "—", "upcoming"),
]
STATUS = {
    "done": ("Completed", GREEN, GREEN_LIGHT),
    "due": ("Due Soon", AMBER, AMBER_BG),
    "upcoming": ("Upcoming", BLUE, BLUE_BG),
    "overdue": ("Overdue", RED, RED_BG),
}

# ---------------- PAGE DECORATION ----------------
import os
LOGO = os.environ.get("HTH_LOGO", "assets/hthlogo.png")

def logo(c, x, y):
    c.setFillColor(colors.white); c.setStrokeColor(GREEN_MID); c.setLineWidth(1.2)
    c.circle(x, y, 19, fill=1, stroke=1)
    if os.path.exists(LOGO):
        c.drawImage(LOGO, x - 14, y - 13.5, width=28, height=27,
                    preserveAspectRatio=True, mask="auto")
    else:
        c.setFillColor(GREEN); c.setFont("Helvetica-Bold", 11)
        c.drawCentredString(x, y - 4, "HT")

def on_page(c, doc):
    c.saveState()
    c.setFillColor(colors.white); c.rect(0, 0, W, H, fill=1, stroke=0)
    # header band
    c.setFillColor(GREEN_LIGHT); c.rect(0, H - 62, W, 62, fill=1, stroke=0)
    c.setFillColor(GREEN_MID); c.rect(0, H - 64, W, 2, fill=1, stroke=0)
    logo(c, 0.55 * inch + 19, H - 31)
    c.setFillColor(GREEN); c.setFont("Helvetica-Bold", 14)
    c.drawString(0.55 * inch + 48, H - 27, "Haloes Touch Hospice Inc.")
    c.setFillColor(MUTED); c.setFont("Helvetica", 8)
    c.drawString(0.55 * inch + 48, H - 40, "11500 S. Eastern Ave., Ste. 150, Henderson, NV 89052")
    c.setFillColor(GREEN); c.setFont("Helvetica-Bold", 10)
    c.drawRightString(W - 0.55 * inch, H - 27, "HOPE Tracking Report")
    c.setFillColor(MUTED); c.setFont("Helvetica", 8)
    c.drawRightString(W - 0.55 * inch, H - 40, "Hospice Outcomes & Patient Evaluation")
    # footer
    c.setStrokeColor(LINE); c.setLineWidth(0.6)
    c.line(0.55 * inch, 0.5 * inch, W - 0.55 * inch, 0.5 * inch)
    c.setFillColor(MUTED); c.setFont("Helvetica", 7.5)
    c.drawString(0.55 * inch, 0.34 * inch, "CONFIDENTIAL — Contains PHI. For internal QAPI use only.  •  Mock data for layout review")
    c.drawRightString(W - 0.55 * inch, 0.34 * inch, f"Page {doc.page}")
    c.restoreState()

doc = BaseDocTemplate(OUT, pagesize=PAGE, leftMargin=0.55*inch, rightMargin=0.55*inch,
                      topMargin=62 + 16, bottomMargin=0.7*inch,
                      title="HOPE Tracking Report", author="Haloes Touch Hospice Inc.")
frame = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id="f",
              leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)
doc.addPageTemplates([PageTemplate(id="p", frames=[frame], onPage=on_page)])
CW = doc.width

def section(title, note=None):
    rows = [[Paragraph(title, sH), Paragraph(note or "", S("r", fontSize=8, textColor=MUTED, alignment=2))]]
    t = Table(rows, colWidths=[CW * 0.6, CW * 0.4])
    t.setStyle(TableStyle([
        ("LINEBELOW", (0, 0), (-1, 0), 1.2, GREEN_MID),
        ("VALIGN", (0, 0), (-1, -1), "BOTTOM"),
        ("LEFTPADDING", (0, 0), (-1, -1), 0), ("RIGHTPADDING", (0, 0), (-1, -1), 0),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
    ]))
    return t

def card(rows, widths, head_color=GREEN_PALE):
    t = Table(rows, colWidths=widths)
    t.setStyle(TableStyle([
        ("BOX", (0, 0), (-1, -1), 0.8, LINE),
        ("BACKGROUND", (0, 0), (-1, -1), colors.white),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 8), ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("TOPPADDING", (0, 0), (-1, -1), 6), ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ]))
    return t

def field(label, value, bold=False):
    return [Paragraph(label.upper(), sLbl), Paragraph(value, sValB if bold else sVal)]

story = []

# ---------------- TITLE + PATIENT STRIP ----------------
story.append(Paragraph("HOPE Report", sTitle))
story.append(Paragraph("Admission, HOPE Update Visits (HUV), Symptom Follow-up Visits (SFV), Discharge & iQIES submission tracking", sSub))
story.append(Spacer(1, 10))

pcells = [field(k, v, bold=(k == "Patient")) for k, v in patient.items()]
pt = Table([pcells], colWidths=[CW / 6] * 6)
pt.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, -1), GREEN_PALE),
    ("BOX", (0, 0), (-1, -1), 0.8, LINE),
    ("LINEAFTER", (0, 0), (-2, -1), 0.5, LINE),
    ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ("LEFTPADDING", (0, 0), (-1, -1), 9), ("TOPPADDING", (0, 0), (-1, -1), 7),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
]))
story.append(pt)
story.append(Spacer(1, 16))

# ---------------- HOPE PROGRESS BOARD ----------------
story.append(section("HOPE Progress Board", f"Timeline anchored to Admit Date {fmt(ADMIT)}  •  Status as of {fmt(TODAY)}"))
story.append(Spacer(1, 8))

lblw = 0.95 * inch
colw = (CW - lblw) / len(milestones)

hdr = [Paragraph("", sCellC)] + [
    [Paragraph(d, sCellHdrDay), Paragraph(sub, sCellHdrSub)] for d, sub, *_ in milestones]

def chip(status):
    text, fg, bg = STATUS[status]
    t = Table([[Paragraph(text, S("ch", fontName="Helvetica-Bold", fontSize=7.5, leading=9,
                                  textColor=fg, alignment=TA_CENTER))]],
              colWidths=[colw - 14], rowHeights=[15])
    t.setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, -1), bg),
                           ("ROUNDEDCORNERS", [7, 7, 7, 7]),
                           ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                           ("TOPPADDING", (0, 0), (-1, -1), 0), ("BOTTOMPADDING", (0, 0), (-1, -1), 0)]))
    return t

row_target = [Paragraph("Target Date", sRowLbl)] + [Paragraph(m[2], sCellCB) for m in milestones]
row_actual = [Paragraph("Actual Date", sRowLbl)] + [Paragraph(m[3], sCellC) for m in milestones]
row_status = [Paragraph("Status", sRowLbl)] + [chip(m[4]) for m in milestones]

board = Table([hdr, row_target, row_actual, row_status], colWidths=[lblw] + [colw] * len(milestones))
bs = [
    ("BACKGROUND", (1, 0), (-1, 0), GREEN),
    ("BACKGROUND", (0, 1), (0, -1), GREEN_PALE),
    ("BACKGROUND", (1, 2), (-1, 2), colors.HexColor("#FAFCFA")),
    ("BOX", (0, 0), (-1, -1), 0.8, LINE),
    ("INNERGRID", (0, 1), (-1, -1), 0.5, LINE),
    ("LINEAFTER", (1, 0), (-2, 0), 0.5, GREEN_MID),
    ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
    ("ALIGN", (1, 0), (-1, -1), "CENTER"),
    ("TOPPADDING", (0, 0), (-1, -1), 6), ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ("LEFTPADDING", (0, 0), (-1, -1), 6), ("RIGHTPADDING", (0, 0), (-1, -1), 6),
]
# phase tint on header for HUV windows
for i, m in enumerate(milestones, start=1):
    if "Window" in m[1]:
        bs.append(("BACKGROUND", (i, 0), (i, 0), GREEN_MID))
board.setStyle(TableStyle(bs))
story.append(board)
story.append(Spacer(1, 6))

# progress bar + legend
done = sum(1 for m in milestones if m[4] == "done")
pct = done / len(milestones)
bar_w = CW * 0.42
bar = Table([["", ""]], colWidths=[bar_w * pct, bar_w * (1 - pct)], rowHeights=[7])
bar.setStyle(TableStyle([("BACKGROUND", (0, 0), (0, 0), GREEN_MID),
                         ("BACKGROUND", (1, 0), (1, 0), GREY_BG),
                         ("ROUNDEDCORNERS", [3, 3, 3, 3])]))
legend = Paragraph(
    '<font color="#2E6B3F"><b>Completed</b></font> &nbsp;|&nbsp; '
    '<font color="#C98A12"><b>Due Soon</b></font> &nbsp;|&nbsp; '
    '<font color="#3B6EA5"><b>Upcoming</b></font> &nbsp;|&nbsp; '
    '<font color="#B23B3B"><b>Overdue</b></font>', S("lg", fontSize=8, textColor=MUTED, alignment=2))
prog = Table([[Paragraph(f"<b>{done} of {len(milestones)}</b> milestones complete ({pct:.0%})", sSmall), bar, legend]],
             colWidths=[CW * 0.22, bar_w + 10, CW - CW * 0.22 - bar_w - 10])
prog.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                          ("LEFTPADDING", (0, 0), (-1, -1), 0), ("RIGHTPADDING", (0, 0), (-1, -1), 0)]))
story.append(prog)
story.append(Spacer(1, 18))

# ---------------- ACTUAL DATES ----------------
story.append(section("Actual Visit Record", "Dates and findings as they occurred"))
story.append(Spacer(1, 8))

def phase_block(title, tag, fields, width):
    head = Table([[Paragraph(f"<b>{title}</b>", S("ph", fontName="Helvetica-Bold", fontSize=10, textColor=GREEN)),
                   Paragraph(tag, S("tg", fontSize=7.5, textColor=MUTED, alignment=2))]],
                 colWidths=[width * 0.55 - 8, width * 0.45 - 8])
    head.setStyle(TableStyle([("LEFTPADDING", (0, 0), (-1, -1), 0), ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                              ("TOPPADDING", (0, 0), (-1, -1), 0), ("BOTTOMPADDING", (0, 0), (-1, -1), 0)]))
    inner = [[head]]
    for lbl, val in fields:
        inner.append([Paragraph(lbl.upper(), sLbl)])
        inner.append([Paragraph(val, sVal)])
    t = Table(inner, colWidths=[width])
    st = [("BOX", (0, 0), (-1, -1), 0.8, LINE),
          ("BACKGROUND", (0, 0), (-1, 0), GREEN_LIGHT),
          ("LINEBELOW", (0, 0), (-1, 0), 0.8, LINE),
          ("LEFTPADDING", (0, 0), (-1, -1), 9), ("RIGHTPADDING", (0, 0), (-1, -1), 9),
          ("TOPPADDING", (0, 0), (-1, -1), 1), ("BOTTOMPADDING", (0, 0), (-1, -1), 1),
          ("TOPPADDING", (0, 0), (-1, 0), 6), ("BOTTOMPADDING", (0, 0), (-1, 0), 6),
          ("VALIGN", (0, 0), (-1, -1), "TOP")]
    for r in range(1, len(inner), 2):
        st.append(("TOPPADDING", (0, r), (-1, r), 7))
    st.append(("BOTTOMPADDING", (0, len(inner) - 1), (-1, len(inner) - 1), 8))
    t.setStyle(TableStyle(st))
    return t

gap = 10
bw = (CW - 3 * gap) / 4
blocks = [
    phase_block("Admission", "HOPE-A", [
        ("Admit Date", fmt(ADMIT)),
        ("Symptoms (Impact)", "Pain — moderate; Dyspnea — mild; Anxiety — moderate"),
        ("SFV Visit", f"{fmt(add(1))} — completed by RN"),
    ], bw),
    phase_block("HUV1", "Day 6-15", [
        ("HUV Visit", fmt(add(9))),
        ("Symptoms (Impact)", "Pain — mild; Dyspnea — none; Anxiety — mild"),
        ("SFV1 Visit", f"{fmt(add(11))} — completed by RN"),
    ], bw),
    phase_block("HUV2", "Day 16-30", [
        ("HUV Visit", fmt(add(19))),
        ("Symptoms (Impact)", "Pain — moderate; Agitation — mild"),
        ("SFV2 Visit", f"Due {fmt(add(28))} — pending"),
    ], bw),
    phase_block("Discharge", "HOPE-D", [
        ("Discharge Date", "—"),
        ("Reason", "Not applicable — patient remains on service"),
    ], bw),
]
row = Table([[blocks[0], "", blocks[1], "", blocks[2], "", blocks[3]]],
            colWidths=[bw, gap, bw, gap, bw, gap, bw])
row.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP"),
                         ("LEFTPADDING", (0, 0), (-1, -1), 0), ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                         ("TOPPADDING", (0, 0), (-1, -1), 0), ("BOTTOMPADDING", (0, 0), (-1, -1), 0)]))
story.append(row)
story.append(Spacer(1, 18))

# ---------------- iQIES + EXCEPTIONS (side by side) ----------------
half = (CW - 14) / 2

iq_hdr = [Paragraph("<b>Record</b>", S("ih", fontName="Helvetica-Bold", fontSize=8.5, textColor=colors.white)),
          Paragraph("<b>Accepted Date</b>", S("ih2", fontName="Helvetica-Bold", fontSize=8.5, textColor=colors.white)),
          Paragraph("<b>Result</b>", S("ih3", fontName="Helvetica-Bold", fontSize=8.5, textColor=colors.white))]
def res(text, fg, bg):
    t = Table([[Paragraph(f"<b>{text}</b>", S("rs", fontSize=7.5, leading=9, textColor=fg, alignment=TA_CENTER))]],
              colWidths=[1.45 * inch], rowHeights=[14])
    t.setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, -1), bg), ("ROUNDEDCORNERS", [7, 7, 7, 7]),
                           ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                           ("TOPPADDING", (0, 0), (-1, -1), 0), ("BOTTOMPADDING", (0, 0), (-1, -1), 0)]))
    return t
iq_rows = [iq_hdr,
           [Paragraph("Admission (HOPE-A)", sVal), Paragraph(fmt(add(8)), sVal), res("Accepted", GREEN, GREEN_LIGHT)],
           [Paragraph("HUV1", sVal), Paragraph(fmt(add(16)), sVal), res("Accepted w/ Warning", AMBER, AMBER_BG)],
           [Paragraph("HUV2", sVal), Paragraph("—", sVal), res("Pending", BLUE, BLUE_BG)],
           [Paragraph("Discharge (HOPE-D)", sVal), Paragraph("—", sVal), res("N/A", MUTED, GREY_BG)]]
iq = Table(iq_rows, colWidths=[half * 0.40, half * 0.28, half * 0.32])
iq.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, 0), GREEN),
    ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, GREEN_PALE]),
    ("BOX", (0, 0), (-1, -1), 0.8, LINE),
    ("LINEBELOW", (0, 1), (-1, -2), 0.5, LINE),
    ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
    ("LEFTPADDING", (0, 0), (-1, -1), 8), ("TOPPADDING", (0, 0), (-1, -1), 6),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
]))

def blank_line(label, value=""):
    return [Paragraph(f"<b>{label}</b>", S("bl", fontName="Helvetica-Bold", fontSize=8.5, textColor=GREEN)),
            Paragraph(value, sVal)]
exc_rows = [
    blank_line("Issue Affected / Reasons:", "HUV1 accepted with warning — SFV1 time not documented on record."),
    blank_line("Root Cause:", "SFV visit time field left blank in EMR before export."),
    blank_line("Action / Owner:", "Correct time field and resubmit; reinforce at staff meeting — RN Case Manager."),
]
exc = Table(exc_rows, colWidths=[half * 0.30, half * 0.70])
exc.setStyle(TableStyle([
    ("BOX", (0, 0), (-1, -1), 0.8, LINE),
    ("BACKGROUND", (0, 0), (0, -1), GREEN_PALE),
    ("LINEBELOW", (1, 0), (1, -1), 0.6, colors.HexColor("#9DB89A")),
    ("LINEBELOW", (0, 0), (0, -2), 0.5, LINE),
    ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ("LEFTPADDING", (0, 0), (-1, -1), 8), ("RIGHTPADDING", (0, 0), (-1, -1), 8),
    ("TOPPADDING", (0, 0), (-1, -1), 9), ("BOTTOMPADDING", (0, 0), (-1, -1), 9),
]))

def titled(title, body, width):
    t = Table([[section_small(title, width)], [body]], colWidths=[width])
    t.setStyle(TableStyle([("LEFTPADDING", (0, 0), (-1, -1), 0), ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                           ("TOPPADDING", (0, 0), (-1, -1), 0), ("BOTTOMPADDING", (0, 0), (0, 0), 8)]))
    return t
def section_small(title, width):
    t = Table([[Paragraph(title, sH)]], colWidths=[width])
    t.setStyle(TableStyle([("LINEBELOW", (0, 0), (-1, 0), 1.2, GREEN_MID),
                           ("LEFTPADDING", (0, 0), (-1, -1), 0), ("BOTTOMPADDING", (0, 0), (-1, -1), 4)]))
    return t

pair = Table([[titled("iQIES Submission", iq, half), "", titled("iQIES Exceptions & Corrective Actions", exc, half)]],
             colWidths=[half, 14, half])
pair.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP"),
                          ("LEFTPADDING", (0, 0), (-1, -1), 0), ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                          ("TOPPADDING", (0, 0), (-1, -1), 0), ("BOTTOMPADDING", (0, 0), (-1, -1), 0)]))
story.append(KeepTogether([pair]))
story.append(Spacer(1, 20))

# ---------------- REVIEW & APPROVAL ----------------
def sig_block(role):
    bw_ = CW / 3 - 24
    t = Table([[Paragraph(f"<b>{role}:</b>", S("sr", fontName="Helvetica-Bold", fontSize=9, textColor=GREEN)), "", ""],
               ["", "", ""],
               [Paragraph("Signature / Printed Name", sSmall), "", Paragraph("Date", sSmall)]],
              colWidths=[bw_ * 0.64, bw_ * 0.06, bw_ * 0.30], rowHeights=[14, 24, 12])
    t.setStyle(TableStyle([("LINEBELOW", (0, 1), (0, 1), 0.8, INK),
                           ("LINEBELOW", (2, 1), (2, 1), 0.8, INK),
                           ("SPAN", (0, 0), (-1, 0)),
                           ("LEFTPADDING", (0, 0), (-1, -1), 0), ("RIGHTPADDING", (0, 0), (0, -1), 10),
                           ("LEFTPADDING", (1, 0), (1, -1), 0), ("RIGHTPADDING", (1, 0), (1, -1), 0),
                           ("TOPPADDING", (0, 0), (-1, -1), 1), ("BOTTOMPADDING", (0, 0), (-1, -1), 1),
                           ("VALIGN", (0, 0), (-1, -1), "TOP")]))
    return t
sig = Table([[sig_block("Prepared By"), sig_block("Administrator"), sig_block("DPCS")]],
            colWidths=[CW / 3] * 3)
sig.setStyle(TableStyle([("BOX", (0, 0), (-1, -1), 0.8, LINE),
                         ("BACKGROUND", (0, 0), (-1, -1), GREEN_PALE),
                         ("LINEAFTER", (0, 0), (-2, -1), 0.5, LINE),
                         ("LEFTPADDING", (0, 0), (-1, -1), 12), ("TOPPADDING", (0, 0), (-1, -1), 8),
                         ("BOTTOMPADDING", (0, 0), (-1, -1), 10)]))
story.append(KeepTogether([section("Review & Approval"), Spacer(1, 8), sig]))

doc.build(story)
print("ok")
