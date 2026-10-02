// MITCalc Web App - Worm Gear Classic Unified Script Bundle (Module 3)
// 100% Client-Side, Zero Dependencies, Zero External Module Imports
// Standards: DIN 3975, DIN 3996, AGMA 6022-C93
// Real-time 2D Canvas, Dynamic Chart 1963, 3D WebGL & CAD Export (STEP AP214 / STL / OBJ / DXF R12)

// MITCalc Material Database - Extracted from MITCalc 1.74 (51 Materials)
const Materials = [
  {
    "id": 1,
    "fullName": "User material 1",
    "name": "User material 1",
    "standard": "",
    "treatment": "untreated",
    "group": "X",
    "notes": "",
    "standards": {
      "iso": "",
      "en": "",
      "ansi": "",
      "din": "",
      "csn": "",
      "jis": ""
    },
    "density": 7870.0,
    "rm": 700.0,
    "rp02": 500.0,
    "coreHardnessHV": 200.0,
    "surfaceHardnessHV": 200.0,
    "shlim": 400.0,
    "sflim": 300.0,
    "nhlim": 50000000.0,
    "nflim": 3000000.0,
    "qh": 10.0,
    "qf": 6.0,
    "elasticModulus": 206.0,
    "poissonRatio": 0.3,
    "abbrev": "V",
    "maxZNT": 1.6
  },
  {
    "id": 2,
    "fullName": "User material 2",
    "name": "User material 2",
    "standard": "",
    "treatment": "untreated",
    "group": "X",
    "notes": "",
    "standards": {
      "iso": "",
      "en": "",
      "ansi": "",
      "din": "",
      "csn": "",
      "jis": ""
    },
    "density": 7870.0,
    "rm": 700.0,
    "rp02": 500.0,
    "coreHardnessHV": 200.0,
    "surfaceHardnessHV": 200.0,
    "shlim": 400.0,
    "sflim": 300.0,
    "nhlim": 50000000.0,
    "nflim": 3000000.0,
    "qh": 10.0,
    "qf": 6.0,
    "elasticModulus": 206.0,
    "poissonRatio": 0.3,
    "abbrev": "V",
    "maxZNT": 1.6
  },
  {
    "id": 3,
    "fullName": "User material 3",
    "name": "User material 3",
    "standard": "",
    "treatment": "untreated",
    "group": "X",
    "notes": "",
    "standards": {
      "iso": "",
      "en": "",
      "ansi": "",
      "din": "",
      "csn": "",
      "jis": ""
    },
    "density": 7870.0,
    "rm": 700.0,
    "rp02": 500.0,
    "coreHardnessHV": 200.0,
    "surfaceHardnessHV": 200.0,
    "shlim": 400.0,
    "sflim": 300.0,
    "nhlim": 50000000.0,
    "nflim": 3000000.0,
    "qh": 10.0,
    "qf": 6.0,
    "elasticModulus": 206.0,
    "poissonRatio": 0.3,
    "abbrev": "V",
    "maxZNT": 1.6
  },
  {
    "id": 4,
    "fullName": "User material 4",
    "name": "User material 4",
    "standard": "",
    "treatment": "untreated",
    "group": "X",
    "notes": "",
    "standards": {
      "iso": "",
      "en": "",
      "ansi": "",
      "din": "",
      "csn": "",
      "jis": ""
    },
    "density": 7870.0,
    "rm": 700.0,
    "rp02": 500.0,
    "coreHardnessHV": 200.0,
    "surfaceHardnessHV": 200.0,
    "shlim": 400.0,
    "sflim": 300.0,
    "nhlim": 50000000.0,
    "nflim": 3000000.0,
    "qh": 10.0,
    "qf": 6.0,
    "elasticModulus": 206.0,
    "poissonRatio": 0.3,
    "abbrev": "V",
    "maxZNT": 1.6
  },
  {
    "id": 5,
    "fullName": "User material 5",
    "name": "User material 5",
    "standard": "",
    "treatment": "untreated",
    "group": "X",
    "notes": "",
    "standards": {
      "iso": "",
      "en": "",
      "ansi": "",
      "din": "",
      "csn": "",
      "jis": ""
    },
    "density": 7870.0,
    "rm": 700.0,
    "rp02": 500.0,
    "coreHardnessHV": 200.0,
    "surfaceHardnessHV": 200.0,
    "shlim": 400.0,
    "sflim": 300.0,
    "nhlim": 50000000.0,
    "nflim": 3000000.0,
    "qh": 10.0,
    "qf": 6.0,
    "elasticModulus": 206.0,
    "poissonRatio": 0.3,
    "abbrev": "V",
    "maxZNT": 1.6
  },
  {
    "id": 6,
    "fullName": "B,D...Nodular cast iron 600-3 (Rm=600 MPa)",
    "name": "Nodular cast iron",
    "standard": "600-3",
    "treatment": "untreated",
    "group": "B,D",
    "notes": "Applications include paper-mill dryer rolls at temperatures up to 230°C",
    "standards": {
      "iso": "600-3",
      "en": "GJS-600-2",
      "ansi": "80-60-03",
      "din": "GGG-60",
      "csn": "",
      "jis": "FCD600"
    },
    "density": 7250.0,
    "rm": 600.0,
    "rp02": 370.0,
    "coreHardnessHV": 190.0,
    "surfaceHardnessHV": 190.0,
    "shlim": 430.0,
    "sflim": 315.0,
    "nhlim": 50000000.0,
    "nflim": 3000000.0,
    "qh": 10.0,
    "qf": 6.0,
    "elasticModulus": 169.0,
    "poissonRatio": 0.2,
    "abbrev": "GGG",
    "maxZNT": 1.6
  },
  {
    "id": 7,
    "fullName": "B,D...Nodular cast iron 700-2 (Rm=700 MPa)",
    "name": "Nodular cast iron",
    "standard": "700-2",
    "treatment": "untreated",
    "group": "B,D",
    "notes": "Applications include high-strength gears and machine components, best combination of strength, wear resistance and response to surface hardening",
    "standards": {
      "iso": "700-2",
      "en": "GJS-700-2",
      "ansi": "100-70-03",
      "din": "GGG-70",
      "csn": "",
      "jis": "FCD700"
    },
    "density": 7250.0,
    "rm": 700.0,
    "rp02": 420.0,
    "coreHardnessHV": 230.0,
    "surfaceHardnessHV": 230.0,
    "shlim": 510.0,
    "sflim": 325.0,
    "nhlim": 50000000.0,
    "nflim": 3000000.0,
    "qh": 10.0,
    "qf": 6.0,
    "elasticModulus": 169.0,
    "poissonRatio": 0.2,
    "abbrev": "GGG",
    "maxZNT": 1.6
  },
  {
    "id": 8,
    "fullName": "B,D...Nodular cast iron 800-2 (Rm=800 MPa) heat treated",
    "name": "Nodular cast iron",
    "standard": "800-2",
    "treatment": "heat treated",
    "group": "B,D",
    "notes": "Highest strength and wear resistance. Applications include pinions, gears, rollers and slides",
    "standards": {
      "iso": "800-2",
      "en": "GJS-800-2",
      "ansi": "120-90-02",
      "din": "GGG-80",
      "csn": "",
      "jis": "FCD800"
    },
    "density": 7250.0,
    "rm": 800.0,
    "rp02": 480.0,
    "coreHardnessHV": 250.0,
    "surfaceHardnessHV": 250.0,
    "shlim": 550.0,
    "sflim": 345.0,
    "nhlim": 50000000.0,
    "nflim": 3000000.0,
    "qh": 10.0,
    "qf": 6.0,
    "elasticModulus": 169.0,
    "poissonRatio": 0.2,
    "abbrev": "GGG",
    "maxZNT": 1.6
  },
  {
    "id": 9,
    "fullName": "D...Carbon cast steel 26-52 (ISO 3755-76) (Rm=500 MPa) normalized",
    "name": "Carbon cast steel",
    "standard": "26-52 (ISO 3755-76)",
    "treatment": "normalized",
    "group": "D",
    "notes": "",
    "standards": {
      "iso": "26-52 (ISO 3755-76)",
      "en": "26-52 (ISO 3755-76)",
      "ansi": "70-40 (ASTM A27)",
      "din": "GS-52",
      "csn": "",
      "jis": "SC480 (JIS G5101-91)"
    },
    "density": 7870.0,
    "rm": 500.0,
    "rp02": 260.0,
    "coreHardnessHV": 150.0,
    "surfaceHardnessHV": 150.0,
    "shlim": 420.0,
    "sflim": 300.0,
    "nhlim": 50000000.0,
    "nflim": 3000000.0,
    "qh": 10.0,
    "qf": 6.0,
    "elasticModulus": 206.0,
    "poissonRatio": 0.3,
    "abbrev": "V(cast)",
    "maxZNT": 1.6
  },
  {
    "id": 10,
    "fullName": "D...Carbon cast steel 30-57 (ISO 3755-76) (Rm=590 MPa) normalized",
    "name": "Carbon cast steel",
    "standard": "30-57 (ISO 3755-76)",
    "treatment": "normalized",
    "group": "D",
    "notes": "",
    "standards": {
      "iso": "30-57 (ISO 3755-76)",
      "en": "30-57 (ISO 3755-76)",
      "ansi": "Gr.80-40",
      "din": "GS-60",
      "csn": "",
      "jis": "SCC 3 (JIS G5111-91)"
    },
    "density": 7870.0,
    "rm": 590.0,
    "rp02": 300.0,
    "coreHardnessHV": 180.0,
    "surfaceHardnessHV": 180.0,
    "shlim": 480.0,
    "sflim": 336.0,
    "nhlim": 50000000.0,
    "nflim": 3000000.0,
    "qh": 10.0,
    "qf": 6.0,
    "elasticModulus": 206.0,
    "poissonRatio": 0.3,
    "abbrev": "V(cast)",
    "maxZNT": 1.6
  },
  {
    "id": 11,
    "fullName": "D...Alloy cast steel 36 Mn 5 (Rm=700 MPa) normalized",
    "name": "Alloy cast steel",
    "standard": "36 Mn 5",
    "treatment": "normalized",
    "group": "D",
    "notes": "",
    "standards": {
      "iso": "36 Mn 5",
      "en": "36 Mn 5",
      "ansi": "Gr.1335 (ASTM 29)",
      "din": "36 Mn 5",
      "csn": "",
      "jis": "SMn2 (G4106)"
    },
    "density": 7870.0,
    "rm": 700.0,
    "rp02": 340.0,
    "coreHardnessHV": 210.0,
    "surfaceHardnessHV": 210.0,
    "shlim": 540.0,
    "sflim": 372.0,
    "nhlim": 50000000.0,
    "nflim": 3000000.0,
    "qh": 10.0,
    "qf": 6.0,
    "elasticModulus": 206.0,
    "poissonRatio": 0.3,
    "abbrev": "V(cast)",
    "maxZNT": 1.6
  },
  {
    "id": 12,
    "fullName": "D...Alloy cast steel 36 Mn 5 (Rm=750 MPa) heat treated",
    "name": "Alloy cast steel",
    "standard": "36 Mn 5",
    "treatment": "heat treated",
    "group": "D",
    "notes": "",
    "standards": {
      "iso": "36 Mn 5",
      "en": "36 Mn 5",
      "ansi": "Gr.1335 (ASTM 29)",
      "din": "36 Mn 5",
      "csn": "",
      "jis": "SMn2 (G4106)"
    },
    "density": 7870.0,
    "rm": 750.0,
    "rp02": 400.0,
    "coreHardnessHV": 220.0,
    "surfaceHardnessHV": 220.0,
    "shlim": 560.0,
    "sflim": 384.0,
    "nhlim": 50000000.0,
    "nflim": 3000000.0,
    "qh": 10.0,
    "qf": 6.0,
    "elasticModulus": 206.0,
    "poissonRatio": 0.3,
    "abbrev": "V(cast)",
    "maxZNT": 1.6
  },
  {
    "id": 13,
    "fullName": "D...Alloy cast steel G17CrMoV511 (Rm=650 MPa) normalized",
    "name": "Alloy cast steel",
    "standard": "G17CrMoV511",
    "treatment": "normalized",
    "group": "D",
    "notes": "",
    "standards": {
      "iso": "G17CrMoV511",
      "en": "G17CrMoV511 (EN 10213-2-95)",
      "ansi": "Gr.9 (ASTM A331)",
      "din": "GS - 17CrMoV5 11",
      "csn": "",
      "jis": "SCPH23 (JIS G5151-91)"
    },
    "density": 7870.0,
    "rm": 650.0,
    "rp02": 380.0,
    "coreHardnessHV": 200.0,
    "surfaceHardnessHV": 200.0,
    "shlim": 520.0,
    "sflim": 360.0,
    "nhlim": 50000000.0,
    "nflim": 3000000.0,
    "qh": 10.0,
    "qf": 6.0,
    "elasticModulus": 206.0,
    "poissonRatio": 0.3,
    "abbrev": "V(cast)",
    "maxZNT": 1.6
  },
  {
    "id": 14,
    "fullName": "D...Alloy cast steel G17CrMoV511 (Rm=800 MPa) heat treated",
    "name": "Alloy cast steel",
    "standard": "G17CrMoV511",
    "treatment": "heat treated",
    "group": "D",
    "notes": "",
    "standards": {
      "iso": "G17CrMoV511",
      "en": "G17CrMoV511 (EN 10213-2-95)",
      "ansi": "Gr.9 (ASTM A331)",
      "din": "GS - 17CrMoV5 11",
      "csn": "",
      "jis": "SCPH23 (JIS G5151-91)"
    },
    "density": 7870.0,
    "rm": 800.0,
    "rp02": 550.0,
    "coreHardnessHV": 245.0,
    "surfaceHardnessHV": 245.0,
    "shlim": 610.0,
    "sflim": 414.0,
    "nhlim": 50000000.0,
    "nflim": 3000000.0,
    "qh": 10.0,
    "qf": 6.0,
    "elasticModulus": 206.0,
    "poissonRatio": 0.3,
    "abbrev": "V(cast)",
    "maxZNT": 1.6
  },
  {
    "id": 15,
    "fullName": "A...Structural steel Fe490(1052.82) (Rm=490 MPa) untreated",
    "name": "Structural steel",
    "standard": "Fe490(1052.82)",
    "treatment": "untreated",
    "group": "A",
    "notes": "",
    "standards": {
      "iso": "Fe490(1052.82)",
      "en": "E295(10025.94)",
      "ansi": "Gr.50(ASTM A570-88)",
      "din": "St50 - 2",
      "csn": "",
      "jis": "SS490"
    },
    "density": 7870.0,
    "rm": 490.0,
    "rp02": 265.0,
    "coreHardnessHV": 150.0,
    "surfaceHardnessHV": 150.0,
    "shlim": 370.0,
    "sflim": 330.0,
    "nhlim": 50000000.0,
    "nflim": 3000000.0,
    "qh": 10.0,
    "qf": 6.0,
    "elasticModulus": 206.0,
    "poissonRatio": 0.3,
    "abbrev": "St",
    "maxZNT": 1.6
  },
  {
    "id": 16,
    "fullName": "A...Structural steel Fe510(630-800) (Rm=510 MPa) untreated",
    "name": "Structural steel",
    "standard": "Fe510(630-800)",
    "treatment": "untreated",
    "group": "A",
    "notes": "",
    "standards": {
      "iso": "Fe510(630-800)",
      "en": "S355J2G3(10025-93)",
      "ansi": "Gr.55(ASTM A572)",
      "din": "St52 - 3 (DIN 17120)",
      "csn": "",
      "jis": "SM520C"
    },
    "density": 7870.0,
    "rm": 510.0,
    "rp02": 333.0,
    "coreHardnessHV": 155.0,
    "surfaceHardnessHV": 155.0,
    "shlim": 380.0,
    "sflim": 336.0,
    "nhlim": 50000000.0,
    "nflim": 3000000.0,
    "qh": 10.0,
    "qf": 6.0,
    "elasticModulus": 206.0,
    "poissonRatio": 0.3,
    "abbrev": "St",
    "maxZNT": 1.6
  },
  {
    "id": 17,
    "fullName": "A...Structural steel Fe590(1052-82) (Rm=588 MPa) untreated",
    "name": "Structural steel",
    "standard": "Fe590(1052-82)",
    "treatment": "untreated",
    "group": "A",
    "notes": "",
    "standards": {
      "iso": "Fe590(1052-82)",
      "en": "E335(10025-94)",
      "ansi": "Gr.65(ASTM A572)",
      "din": "St60 - 2 (DIN1652/2)",
      "csn": "",
      "jis": "SM570"
    },
    "density": 7870.0,
    "rm": 588.0,
    "rp02": 314.0,
    "coreHardnessHV": 175.0,
    "surfaceHardnessHV": 175.0,
    "shlim": 420.0,
    "sflim": 360.0,
    "nhlim": 50000000.0,
    "nflim": 3000000.0,
    "qh": 10.0,
    "qf": 6.0,
    "elasticModulus": 206.0,
    "poissonRatio": 0.3,
    "abbrev": "St",
    "maxZNT": 1.6
  },
  {
    "id": 18,
    "fullName": "A...Structural steel Fe690(1052-82) (Rm=686 MPa) untreated",
    "name": "Structural steel",
    "standard": "Fe690(1052-82)",
    "treatment": "untreated",
    "group": "A",
    "notes": "",
    "standards": {
      "iso": "Fe690(1052-82)",
      "en": "E360",
      "ansi": "Gr.C(ASTM A284)",
      "din": "St70 - 2",
      "csn": "",
      "jis": "SM400A (JIS3101)"
    },
    "density": 7870.0,
    "rm": 686.0,
    "rp02": 363.0,
    "coreHardnessHV": 205.0,
    "surfaceHardnessHV": 205.0,
    "shlim": 480.0,
    "sflim": 396.0,
    "nhlim": 50000000.0,
    "nflim": 3000000.0,
    "qh": 10.0,
    "qf": 6.0,
    "elasticModulus": 206.0,
    "poissonRatio": 0.3,
    "abbrev": "St",
    "maxZNT": 1.6
  },
  {
    "id": 19,
    "fullName": "A...Carbon structural steel C60E4(683/1-87) (Rm=540 MPa) normalized",
    "name": "Carbon structural steel",
    "standard": "C60E4(683/1-87)",
    "treatment": "normalized",
    "group": "A",
    "notes": "",
    "standards": {
      "iso": "C60E4(683/1-87)",
      "en": "C45(10083-2-91)",
      "ansi": "Gr.1045 (ASTM A576)",
      "din": "Ck 45",
      "csn": "",
      "jis": "S45C"
    },
    "density": 7870.0,
    "rm": 540.0,
    "rp02": 325.0,
    "coreHardnessHV": 155.0,
    "surfaceHardnessHV": 155.0,
    "shlim": 430.0,
    "sflim": 356.0,
    "nhlim": 50000000.0,
    "nflim": 3000000.0,
    "qh": 10.0,
    "qf": 6.0,
    "elasticModulus": 206.0,
    "poissonRatio": 0.3,
    "abbrev": "V",
    "maxZNT": 1.6
  },
  {
    "id": 20,
    "fullName": "A...Carbon structural steel C60E4(683/1-87) (Rm=640 MPa) heat treated",
    "name": "Carbon structural steel",
    "standard": "C60E4(683/1-87)",
    "treatment": "heat treated",
    "group": "A",
    "notes": "",
    "standards": {
      "iso": "C60E4(683/1-87)",
      "en": "C45(10083-2-91)",
      "ansi": "Gr.1045 (ASTM A576)",
      "din": "Ck 45",
      "csn": "",
      "jis": "S45C"
    },
    "density": 7870.0,
    "rm": 640.0,
    "rp02": 390.0,
    "coreHardnessHV": 200.0,
    "surfaceHardnessHV": 200.0,
    "shlim": 520.0,
    "sflim": 410.0,
    "nhlim": 50000000.0,
    "nflim": 3000000.0,
    "qh": 10.0,
    "qf": 6.0,
    "elasticModulus": 206.0,
    "poissonRatio": 0.3,
    "abbrev": "V",
    "maxZNT": 1.6
  },
  {
    "id": 21,
    "fullName": "A...Carbon structural steel C60ER(683/1-87) (Rm=660 MPa) normalized",
    "name": "Carbon structural steel",
    "standard": "C60ER(683/1-87)",
    "treatment": "normalized",
    "group": "A",
    "notes": "",
    "standards": {
      "iso": "C60ER(683/1-87)",
      "en": "C60ER(10083-1-91)",
      "ansi": "Gr.1055",
      "din": "Ck 60",
      "csn": "",
      "jis": "S58C"
    },
    "density": 7870.0,
    "rm": 660.0,
    "rp02": 380.0,
    "coreHardnessHV": 200.0,
    "surfaceHardnessHV": 200.0,
    "shlim": 520.0,
    "sflim": 410.0,
    "nhlim": 50000000.0,
    "nflim": 3000000.0,
    "qh": 10.0,
    "qf": 6.0,
    "elasticModulus": 206.0,
    "poissonRatio": 0.3,
    "abbrev": "V",
    "maxZNT": 1.6
  },
  {
    "id": 22,
    "fullName": "A...Carbon structural steel C60ER(683/1-87) (Rm=740 MPa) heat treated",
    "name": "Carbon structural steel",
    "standard": "C60ER(683/1-87)",
    "treatment": "heat treated",
    "group": "A",
    "notes": "",
    "standards": {
      "iso": "C60ER(683/1-87)",
      "en": "C60ER(10083-1-91)",
      "ansi": "Gr.1055",
      "din": "Ck 60",
      "csn": "",
      "jis": "S58C"
    },
    "density": 7870.0,
    "rm": 740.0,
    "rp02": 440.0,
    "coreHardnessHV": 235.0,
    "surfaceHardnessHV": 235.0,
    "shlim": 590.0,
    "sflim": 452.0,
    "nhlim": 50000000.0,
    "nflim": 3000000.0,
    "qh": 10.0,
    "qf": 6.0,
    "elasticModulus": 206.0,
    "poissonRatio": 0.3,
    "abbrev": "V",
    "maxZNT": 1.6
  },
  {
    "id": 23,
    "fullName": "C...Alloy structural steel T2(683/7-70) (Rm=883 MPa) heat treated",
    "name": "Alloy structural steel",
    "standard": "T2(683/7-70)",
    "treatment": "heat treated",
    "group": "C",
    "notes": "",
    "standards": {
      "iso": "T2(683/7-70)",
      "en": "37Cr4(10083-91)",
      "ansi": "Gr.5135(ASTM A322)",
      "din": "37 Cr 4",
      "csn": "",
      "jis": "SCr435H"
    },
    "density": 7870.0,
    "rm": 883.0,
    "rp02": 637.0,
    "coreHardnessHV": 285.0,
    "surfaceHardnessHV": 285.0,
    "shlim": 690.0,
    "sflim": 512.0,
    "nhlim": 50000000.0,
    "nflim": 3000000.0,
    "qh": 10.0,
    "qf": 6.0,
    "elasticModulus": 206.0,
    "poissonRatio": 0.3,
    "abbrev": "V",
    "maxZNT": 1.6
  },
  {
    "id": 24,
    "fullName": "C,D...Alloy structural steel 42 CrV 6 (Rm=980 MPa) heat treated",
    "name": "Alloy structural steel",
    "standard": "42 CrV 6",
    "treatment": "heat treated",
    "group": "C,D",
    "notes": "",
    "standards": {
      "iso": "42 CrV 6",
      "en": "42 CrV 6",
      "ansi": "AISI 6150",
      "din": "42 CrV 6",
      "csn": "",
      "jis": "SUP 10"
    },
    "density": 7870.0,
    "rm": 980.0,
    "rp02": 850.0,
    "coreHardnessHV": 300.0,
    "surfaceHardnessHV": 300.0,
    "shlim": 720.0,
    "sflim": 530.0,
    "nhlim": 50000000.0,
    "nflim": 3000000.0,
    "qh": 10.0,
    "qf": 6.0,
    "elasticModulus": 206.0,
    "poissonRatio": 0.3,
    "abbrev": "V",
    "maxZNT": 1.6
  },
  {
    "id": 25,
    "fullName": "D...Alloy structural steel 31 NiCr 14 (Rm=932 MPa) heat treated",
    "name": "Alloy structural steel",
    "standard": "31 NiCr 14",
    "treatment": "heat treated",
    "group": "D",
    "notes": "",
    "standards": {
      "iso": "31 NiCr 14",
      "en": "31 NiCr 14",
      "ansi": "AISI 4130",
      "din": "31 NiCr 14",
      "csn": "",
      "jis": "SNC 836"
    },
    "density": 7870.0,
    "rm": 932.0,
    "rp02": 785.0,
    "coreHardnessHV": 290.0,
    "surfaceHardnessHV": 290.0,
    "shlim": 700.0,
    "sflim": 518.0,
    "nhlim": 50000000.0,
    "nflim": 3000000.0,
    "qh": 10.0,
    "qf": 6.0,
    "elasticModulus": 206.0,
    "poissonRatio": 0.3,
    "abbrev": "V",
    "maxZNT": 1.6
  },
  {
    "id": 26,
    "fullName": "E...Carbon cast steel 30-57 (ISO 3755-76) (Rm=590 MPa) tooth face hard.",
    "name": "Carbon cast steel",
    "standard": "30-57 (ISO 3755-76)",
    "treatment": "tooth face hard.",
    "group": "E",
    "notes": "",
    "standards": {
      "iso": "30-57 (ISO 3755-76)",
      "en": "30-57 (ISO 3755-76)",
      "ansi": "Gr.80-40",
      "din": "GS-60",
      "csn": "",
      "jis": "SCC 3 (JIS G5111-91)"
    },
    "density": 7870.0,
    "rm": 590.0,
    "rp02": 300.0,
    "coreHardnessHV": 180.0,
    "surfaceHardnessHV": 600.0,
    "shlim": 1140.0,
    "sflim": 316.0,
    "nhlim": 100000000.0,
    "nflim": 3000000.0,
    "qh": 10.0,
    "qf": 6.0,
    "elasticModulus": 206.0,
    "poissonRatio": 0.3,
    "abbrev": "IF",
    "maxZNT": 1.6
  },
  {
    "id": 27,
    "fullName": "E...Carbon cast steel 36 Mn 5 (Rm=700 MPa) tooth face hard.",
    "name": "Carbon cast steel",
    "standard": "36 Mn 5",
    "treatment": "tooth face hard.",
    "group": "E",
    "notes": "",
    "standards": {
      "iso": "36 Mn 5",
      "en": "36 Mn 5",
      "ansi": "Gr.1335 (ASTM 29)",
      "din": "36 Mn 5",
      "csn": "",
      "jis": "SMn2 (G4106)"
    },
    "density": 7870.0,
    "rm": 700.0,
    "rp02": 340.0,
    "coreHardnessHV": 210.0,
    "surfaceHardnessHV": 600.0,
    "shlim": 1140.0,
    "sflim": 352.0,
    "nhlim": 100000000.0,
    "nflim": 3000000.0,
    "qh": 10.0,
    "qf": 6.0,
    "elasticModulus": 206.0,
    "poissonRatio": 0.3,
    "abbrev": "IF",
    "maxZNT": 1.6
  },
  {
    "id": 28,
    "fullName": "E...Carbon structural steel C50 E4 (Rm=640 MPa) tooth face hard.",
    "name": "Carbon structural steel",
    "standard": "C50 E4",
    "treatment": "tooth face hard.",
    "group": "E",
    "notes": "",
    "standards": {
      "iso": "C50 E4",
      "en": "1 C50",
      "ansi": "Gr.1050 (ASTM A510)",
      "din": "Ck 50",
      "csn": "",
      "jis": "S50C"
    },
    "density": 7870.0,
    "rm": 640.0,
    "rp02": 390.0,
    "coreHardnessHV": 200.0,
    "surfaceHardnessHV": 600.0,
    "shlim": 1140.0,
    "sflim": 390.0,
    "nhlim": 100000000.0,
    "nflim": 3000000.0,
    "qh": 10.0,
    "qf": 6.0,
    "elasticModulus": 206.0,
    "poissonRatio": 0.3,
    "abbrev": "IF",
    "maxZNT": 1.6
  },
  {
    "id": 29,
    "fullName": "E,F...Alloy structural steel T2(683/7-70) (Rm=785 MPa) tooth face hard.",
    "name": "Alloy structural steel",
    "standard": "T2(683/7-70)",
    "treatment": "tooth face hard.",
    "group": "E,F",
    "notes": "",
    "standards": {
      "iso": "T2(683/7-70)",
      "en": "37Cr4(10083-91)",
      "ansi": "Gr.5135(ASTM A322)",
      "din": "37 Cr 4",
      "csn": "",
      "jis": "SCr435H"
    },
    "density": 7870.0,
    "rm": 785.0,
    "rp02": 539.0,
    "coreHardnessHV": 250.0,
    "surfaceHardnessHV": 600.0,
    "shlim": 1140.0,
    "sflim": 450.0,
    "nhlim": 100000000.0,
    "nflim": 3000000.0,
    "qh": 10.0,
    "qf": 6.0,
    "elasticModulus": 206.0,
    "poissonRatio": 0.3,
    "abbrev": "IF",
    "maxZNT": 1.6
  },
  {
    "id": 30,
    "fullName": "E...Alloy structural steel 42 CrV 6 (Rm=980 MPa) tooth face hard.",
    "name": "Alloy structural steel",
    "standard": "42 CrV 6",
    "treatment": "tooth face hard.",
    "group": "E",
    "notes": "",
    "standards": {
      "iso": "42 CrV 6",
      "en": "42 CrV 6",
      "ansi": "AISI 6150",
      "din": "42 CrV 6",
      "csn": "",
      "jis": "SUP 10"
    },
    "density": 7870.0,
    "rm": 980.0,
    "rp02": 850.0,
    "coreHardnessHV": 315.0,
    "surfaceHardnessHV": 600.0,
    "shlim": 1160.0,
    "sflim": 528.0,
    "nhlim": 100000000.0,
    "nflim": 3000000.0,
    "qh": 10.0,
    "qf": 6.0,
    "elasticModulus": 206.0,
    "poissonRatio": 0.3,
    "abbrev": "IF",
    "maxZNT": 1.6
  },
  {
    "id": 31,
    "fullName": "E,F...Alloy structural steel 42 CrV 6 (Rm=980 MPa) face hardened",
    "name": "Alloy structural steel",
    "standard": "42 CrV 6",
    "treatment": "face hardened",
    "group": "E,F",
    "notes": "",
    "standards": {
      "iso": "42 CrV 6",
      "en": "42 CrV 6",
      "ansi": "AISI 6150",
      "din": "42CrV6",
      "csn": "",
      "jis": "SUP 10"
    },
    "density": 7870.0,
    "rm": 980.0,
    "rp02": 850.0,
    "coreHardnessHV": 315.0,
    "surfaceHardnessHV": 600.0,
    "shlim": 1160.0,
    "sflim": 705.0,
    "nhlim": 100000000.0,
    "nflim": 3000000.0,
    "qh": 10.0,
    "qf": 9.0,
    "elasticModulus": 206.0,
    "poissonRatio": 0.3,
    "abbrev": "IF",
    "maxZNT": 1.6
  },
  {
    "id": 32,
    "fullName": "F...Alloy structural steel 34CrNiMo6 (Rm=965 MPa) face hardened",
    "name": "Alloy structural steel",
    "standard": "34CrNiMo6",
    "treatment": "face hardened",
    "group": "F",
    "notes": "",
    "standards": {
      "iso": "34CrNiMo6",
      "en": "34CrNiMo6",
      "ansi": "Gr. 4340 (A322-82)",
      "din": "34CrNiMo6",
      "csn": "",
      "jis": "SNCM447"
    },
    "density": 7870.0,
    "rm": 965.0,
    "rp02": 750.0,
    "coreHardnessHV": 300.0,
    "surfaceHardnessHV": 600.0,
    "shlim": 1160.0,
    "sflim": 705.0,
    "nhlim": 100000000.0,
    "nflim": 3000000.0,
    "qh": 10.0,
    "qf": 9.0,
    "elasticModulus": 206.0,
    "poissonRatio": 0.3,
    "abbrev": "IF",
    "maxZNT": 1.6
  },
  {
    "id": 33,
    "fullName": "F...Alloy structural steel 34CrNiMo6 (Rm=965 MPa) face hardened",
    "name": "Alloy structural steel",
    "standard": "34CrNiMo6",
    "treatment": "face hardened",
    "group": "F",
    "notes": "",
    "standards": {
      "iso": "34CrNiMo6",
      "en": "34CrNiMo6",
      "ansi": "Gr. 4340 (A322-82)",
      "din": "34CrNiMo6",
      "csn": "",
      "jis": "SNCM447"
    },
    "density": 7870.0,
    "rm": 965.0,
    "rp02": 750.0,
    "coreHardnessHV": 300.0,
    "surfaceHardnessHV": 500.0,
    "shlim": 1060.0,
    "sflim": 655.0,
    "nhlim": 100000000.0,
    "nflim": 3000000.0,
    "qh": 10.0,
    "qf": 9.0,
    "elasticModulus": 206.0,
    "poissonRatio": 0.3,
    "abbrev": "IF",
    "maxZNT": 1.6
  },
  {
    "id": 34,
    "fullName": "F...Alloy structural steel 42 MnV 7 (Rm=800 MPa) nitridated",
    "name": "Alloy structural steel",
    "standard": "42 MnV 7",
    "treatment": "nitridated",
    "group": "F",
    "notes": "",
    "standards": {
      "iso": "42 MnV 7",
      "en": "42 MnV 7",
      "ansi": "AISI 1340",
      "din": "42MnV7",
      "csn": "",
      "jis": "SCM 4"
    },
    "density": 7870.0,
    "rm": 800.0,
    "rp02": 620.0,
    "coreHardnessHV": 250.0,
    "surfaceHardnessHV": 550.0,
    "shlim": 930.0,
    "sflim": 580.0,
    "nhlim": 100000000.0,
    "nflim": 3000000.0,
    "qh": 10.0,
    "qf": 9.0,
    "elasticModulus": 206.0,
    "poissonRatio": 0.3,
    "abbrev": "NT(nitr.)",
    "maxZNT": 1.3
  },
  {
    "id": 35,
    "fullName": "F,H...Alloy structural steel 30 CrV 9 (Rm=800 MPa) nitridated",
    "name": "Alloy structural steel",
    "standard": "30 CrV 9",
    "treatment": "nitridated",
    "group": "F,H",
    "notes": "",
    "standards": {
      "iso": "30 CrV 9",
      "en": "30 CrV 9",
      "ansi": "AISI 4140H",
      "din": "30CrV9",
      "csn": "",
      "jis": "SCM 4 H"
    },
    "density": 7870.0,
    "rm": 800.0,
    "rp02": 600.0,
    "coreHardnessHV": 250.0,
    "surfaceHardnessHV": 800.0,
    "shlim": 1180.0,
    "sflim": 705.0,
    "nhlim": 100000000.0,
    "nflim": 3000000.0,
    "qh": 10.0,
    "qf": 9.0,
    "elasticModulus": 206.0,
    "poissonRatio": 0.3,
    "abbrev": "NT(nitr.)",
    "maxZNT": 1.3
  },
  {
    "id": 36,
    "fullName": "F,H...Alloy structural steel 30CrMoV9 (Rm=800 MPa) nitridated",
    "name": "Alloy structural steel",
    "standard": "30CrMoV9",
    "treatment": "nitridated",
    "group": "F,H",
    "notes": "",
    "standards": {
      "iso": "30CrMoV9",
      "en": "30CrMoV9",
      "ansi": "Cl.A (ASTM A355)",
      "din": "30CrMoV9",
      "csn": "",
      "jis": "SACM645"
    },
    "density": 7870.0,
    "rm": 800.0,
    "rp02": 600.0,
    "coreHardnessHV": 250.0,
    "surfaceHardnessHV": 800.0,
    "shlim": 1180.0,
    "sflim": 705.0,
    "nhlim": 100000000.0,
    "nflim": 3000000.0,
    "qh": 10.0,
    "qf": 9.0,
    "elasticModulus": 206.0,
    "poissonRatio": 0.3,
    "abbrev": "NT(nitr.)",
    "maxZNT": 1.3
  },
  {
    "id": 37,
    "fullName": "F,H...Alloy structural steel 34CrNiMo6 (Rm=965 MPa) nitridated",
    "name": "Alloy structural steel",
    "standard": "34CrNiMo6",
    "treatment": "nitridated",
    "group": "F,H",
    "notes": "",
    "standards": {
      "iso": "34CrNiMo6",
      "en": "34CrNiMo6",
      "ansi": "Gr. 4340 (A322-82)",
      "din": "34CrNiMo6",
      "csn": "",
      "jis": "SNCM447"
    },
    "density": 7870.0,
    "rm": 965.0,
    "rp02": 750.0,
    "coreHardnessHV": 300.0,
    "surfaceHardnessHV": 750.0,
    "shlim": 1180.0,
    "sflim": 730.0,
    "nhlim": 100000000.0,
    "nflim": 3000000.0,
    "qh": 10.0,
    "qf": 9.0,
    "elasticModulus": 206.0,
    "poissonRatio": 0.3,
    "abbrev": "NT(nitr.)",
    "maxZNT": 1.3
  },
  {
    "id": 38,
    "fullName": "E...Alloy structural steel T2(683/7-70) (Rm=1570 MPa) nitro-case-hard.",
    "name": "Alloy structural steel",
    "standard": "T2(683/7-70)",
    "treatment": "nitro-case-hard.",
    "group": "E",
    "notes": "",
    "standards": {
      "iso": "T2(683/7-70)",
      "en": "37Cr4(10083-91)",
      "ansi": "Gr.5135(ASTM A322)",
      "din": "37 Cr 4",
      "csn": "",
      "jis": "SCr435H"
    },
    "density": 7870.0,
    "rm": 1570.0,
    "rp02": 1350.0,
    "coreHardnessHV": 485.0,
    "surfaceHardnessHV": 615.0,
    "shlim": 1288.0,
    "sflim": 740.0,
    "nhlim": 100000000.0,
    "nflim": 3000000.0,
    "qh": 10.0,
    "qf": 9.0,
    "elasticModulus": 206.0,
    "poissonRatio": 0.3,
    "abbrev": "NV",
    "maxZNT": 1.1
  },
  {
    "id": 39,
    "fullName": "E...Carbon structural steel C10 (Rm=440 MPa) case-hardened",
    "name": "Carbon structural steel",
    "standard": "C10",
    "treatment": "case-hardened",
    "group": "E",
    "notes": "",
    "standards": {
      "iso": "C10",
      "en": "2C10",
      "ansi": "Gr.1010(ASTM A29)",
      "din": "Ck 10",
      "csn": "",
      "jis": "S10C"
    },
    "density": 7870.0,
    "rm": 440.0,
    "rp02": 275.0,
    "coreHardnessHV": 135.0,
    "surfaceHardnessHV": 650.0,
    "shlim": 1210.0,
    "sflim": 500.0,
    "nhlim": 100000000.0,
    "nflim": 3000000.0,
    "qh": 10.0,
    "qf": 9.0,
    "elasticModulus": 206.0,
    "poissonRatio": 0.3,
    "abbrev": "Eh",
    "maxZNT": 1.6
  },
  {
    "id": 40,
    "fullName": "E...Carbon structural steel C15E4 (Rm=495 MPa) case-hardened",
    "name": "Carbon structural steel",
    "standard": "C15E4",
    "treatment": "case-hardened",
    "group": "E",
    "notes": "",
    "standards": {
      "iso": "C15E4",
      "en": "C15E",
      "ansi": "Gr.1016(ASTM A576)",
      "din": "Ck 15",
      "csn": "",
      "jis": "S15C"
    },
    "density": 7870.0,
    "rm": 495.0,
    "rp02": 295.0,
    "coreHardnessHV": 150.0,
    "surfaceHardnessHV": 650.0,
    "shlim": 1210.0,
    "sflim": 500.0,
    "nhlim": 100000000.0,
    "nflim": 3000000.0,
    "qh": 10.0,
    "qf": 9.0,
    "elasticModulus": 206.0,
    "poissonRatio": 0.3,
    "abbrev": "Eh",
    "maxZNT": 1.6
  },
  {
    "id": 41,
    "fullName": "G...Alloy structural steel TYPE 5 (Rm=785 MPa) case-hardened",
    "name": "Alloy structural steel",
    "standard": "TYPE 5",
    "treatment": "case-hardened",
    "group": "G",
    "notes": "",
    "standards": {
      "iso": "TYPE 5",
      "en": "16MnCr5",
      "ansi": "Gr.5120(ASTM A506)",
      "din": "16MnCr5",
      "csn": "",
      "jis": "SMnC420H"
    },
    "density": 7870.0,
    "rm": 785.0,
    "rp02": 588.0,
    "coreHardnessHV": 250.0,
    "surfaceHardnessHV": 650.0,
    "shlim": 1270.0,
    "sflim": 700.0,
    "nhlim": 100000000.0,
    "nflim": 3000000.0,
    "qh": 10.0,
    "qf": 9.0,
    "elasticModulus": 206.0,
    "poissonRatio": 0.3,
    "abbrev": "Eh",
    "maxZNT": 1.6
  },
  {
    "id": 42,
    "fullName": "G...Alloy structural steel 35CrMo4 (Rm=880 MPa) case-hardened",
    "name": "Alloy structural steel",
    "standard": "35CrMo4",
    "treatment": "case-hardened",
    "group": "G",
    "notes": "",
    "standards": {
      "iso": "35CrMo4",
      "en": "35CrMo4",
      "ansi": "Gr.Q (ASTM A514)",
      "din": "35CrMo4",
      "csn": "",
      "jis": "SCr4H"
    },
    "density": 7870.0,
    "rm": 880.0,
    "rp02": 685.0,
    "coreHardnessHV": 285.0,
    "surfaceHardnessHV": 650.0,
    "shlim": 1270.0,
    "sflim": 700.0,
    "nhlim": 100000000.0,
    "nflim": 3000000.0,
    "qh": 10.0,
    "qf": 9.0,
    "elasticModulus": 206.0,
    "poissonRatio": 0.3,
    "abbrev": "Eh",
    "maxZNT": 1.6
  },
  {
    "id": 43,
    "fullName": "G...Alloy structural steel 15NiCr6 (Rm=880 MPa) case-hardened",
    "name": "Alloy structural steel",
    "standard": "15NiCr6",
    "treatment": "case-hardened",
    "group": "G",
    "notes": "",
    "standards": {
      "iso": "15NiCr6",
      "en": "15NiCr6",
      "ansi": "Gr.4320(A322)",
      "din": "15NiCr6",
      "csn": "",
      "jis": "SNC815"
    },
    "density": 7870.0,
    "rm": 880.0,
    "rp02": 635.0,
    "coreHardnessHV": 285.0,
    "surfaceHardnessHV": 650.0,
    "shlim": 1270.0,
    "sflim": 700.0,
    "nhlim": 100000000.0,
    "nflim": 3000000.0,
    "qh": 10.0,
    "qf": 9.0,
    "elasticModulus": 206.0,
    "poissonRatio": 0.3,
    "abbrev": "Eh",
    "maxZNT": 1.6
  },
  {
    "id": 44,
    "fullName": "G...Alloy structural steel 14NiCr14 (Rm=932 MPa) case-hardened",
    "name": "Alloy structural steel",
    "standard": "14NiCr14",
    "treatment": "case-hardened",
    "group": "G",
    "notes": "",
    "standards": {
      "iso": "14NiCr14",
      "en": "14NiCr14",
      "ansi": "E3310(ASTM A507)",
      "din": "14NiCr14",
      "csn": "",
      "jis": "SNC815H"
    },
    "density": 7870.0,
    "rm": 932.0,
    "rp02": 735.0,
    "coreHardnessHV": 300.0,
    "surfaceHardnessHV": 650.0,
    "shlim": 1270.0,
    "sflim": 700.0,
    "nhlim": 100000000.0,
    "nflim": 3000000.0,
    "qh": 10.0,
    "qf": 9.0,
    "elasticModulus": 206.0,
    "poissonRatio": 0.3,
    "abbrev": "Eh",
    "maxZNT": 1.6
  },
  {
    "id": 45,
    "fullName": "E...Carbon structural steel C60ER(683/1-87) (Rm=740 MPa) nitro-carburized",
    "name": "Carbon structural steel",
    "standard": "C60ER(683/1-87)",
    "treatment": "nitro-carburized",
    "group": "E",
    "notes": "",
    "standards": {
      "iso": "C60ER(683/1-87)",
      "en": "C60ER(10083-1-91)",
      "ansi": "Gr.1055",
      "din": "Ck 60",
      "csn": "",
      "jis": "S58C"
    },
    "density": 7870.0,
    "rm": 740.0,
    "rp02": 440.0,
    "coreHardnessHV": 235.0,
    "surfaceHardnessHV": 235.0,
    "shlim": 800.0,
    "sflim": 650.0,
    "nhlim": 100000000.0,
    "nflim": 3000000.0,
    "qh": 10.0,
    "qf": 9.0,
    "elasticModulus": 206.0,
    "poissonRatio": 0.3,
    "abbrev": "NV",
    "maxZNT": 1.3
  },
  {
    "id": 46,
    "fullName": "E...Carbon structural steel C60ER(683/1-87) (Rm=740 MPa) nitro-carburized",
    "name": "Carbon structural steel",
    "standard": "C60ER(683/1-87)",
    "treatment": "nitro-carburized",
    "group": "E",
    "notes": "",
    "standards": {
      "iso": "C60ER(683/1-87)",
      "en": "C60ER(10083-1-91)",
      "ansi": "Gr.1055",
      "din": "Ck 60",
      "csn": "",
      "jis": "S58C"
    },
    "density": 7870.0,
    "rm": 740.0,
    "rp02": 440.0,
    "coreHardnessHV": 235.0,
    "surfaceHardnessHV": 235.0,
    "shlim": 800.0,
    "sflim": 650.0,
    "nhlim": 100000000.0,
    "nflim": 3000000.0,
    "qh": 10.0,
    "qf": 9.0,
    "elasticModulus": 206.0,
    "poissonRatio": 0.3,
    "abbrev": "NV",
    "maxZNT": 1.3
  },
  {
    "id": 47,
    "fullName": "E...Carbon structural steel C50 E4 (Rm=640 MPa) face hardened",
    "name": "Carbon structural steel",
    "standard": "C50 E4",
    "treatment": "face hardened",
    "group": "E",
    "notes": "",
    "standards": {
      "iso": "C50 E4",
      "en": "1 C50",
      "ansi": "Gr.1050 (ASTM A510)",
      "din": "Ck 50",
      "csn": "",
      "jis": "S50C"
    },
    "density": 7870.0,
    "rm": 640.0,
    "rp02": 390.0,
    "coreHardnessHV": 200.0,
    "surfaceHardnessHV": 600.0,
    "shlim": 1140.0,
    "sflim": 605.0,
    "nhlim": 100000000.0,
    "nflim": 3000000.0,
    "qh": 10.0,
    "qf": 9.0,
    "elasticModulus": 206.0,
    "poissonRatio": 0.3,
    "abbrev": "IF",
    "maxZNT": 1.6
  },
  {
    "id": 48,
    "fullName": "E...Alloy structural steel T2(683/7-70) (Rm=785 MPa) face hardened",
    "name": "Alloy structural steel",
    "standard": "T2(683/7-70)",
    "treatment": "face hardened",
    "group": "E",
    "notes": "",
    "standards": {
      "iso": "T2(683/7-70)",
      "en": "37Cr4(10083-91)",
      "ansi": "Gr.5135(ASTM A322)",
      "din": "37 Cr 4",
      "csn": "",
      "jis": "SCr435H"
    },
    "density": 7870.0,
    "rm": 785.0,
    "rp02": 539.0,
    "coreHardnessHV": 250.0,
    "surfaceHardnessHV": 600.0,
    "shlim": 1140.0,
    "sflim": 605.0,
    "nhlim": 100000000.0,
    "nflim": 3000000.0,
    "qh": 10.0,
    "qf": 9.0,
    "elasticModulus": 206.0,
    "poissonRatio": 0.3,
    "abbrev": "IF",
    "maxZNT": 1.6
  },
  {
    "id": 49,
    "fullName": "B...Grey cast iron Gr.200 (Rm=200 MPa)",
    "name": "Grey cast iron",
    "standard": "Gr.200",
    "treatment": "untreated",
    "group": "B",
    "notes": "",
    "standards": {
      "iso": "Gr.200",
      "en": "FG20",
      "ansi": "Cl.30B (ASTM A48)",
      "din": "GG-20",
      "csn": "",
      "jis": "FC200"
    },
    "density": 7870.0,
    "rm": 200.0,
    "rp02": 100.0,
    "coreHardnessHV": 200.0,
    "surfaceHardnessHV": 200.0,
    "shlim": 340.0,
    "sflim": 95.0,
    "nhlim": 50000000.0,
    "nflim": 3000000.0,
    "qh": 10.0,
    "qf": 6.0,
    "elasticModulus": 91.0,
    "poissonRatio": 0.25,
    "abbrev": "GG",
    "maxZNT": 1.3
  },
  {
    "id": 50,
    "fullName": "B...Grey cast iron Gr.250 (Rm=250 MPa)",
    "name": "Grey cast iron",
    "standard": "Gr.250",
    "treatment": "untreated",
    "group": "B",
    "notes": "",
    "standards": {
      "iso": "Gr.250",
      "en": "FG25",
      "ansi": "Cl.40B (ASTM A48)",
      "din": "GG-25",
      "csn": "",
      "jis": "FC250"
    },
    "density": 7870.0,
    "rm": 250.0,
    "rp02": 125.0,
    "coreHardnessHV": 220.0,
    "surfaceHardnessHV": 220.0,
    "shlim": 350.0,
    "sflim": 105.0,
    "nhlim": 50000000.0,
    "nflim": 3000000.0,
    "qh": 10.0,
    "qf": 6.0,
    "elasticModulus": 105.0,
    "poissonRatio": 0.25,
    "abbrev": "GG",
    "maxZNT": 1.3
  },
  {
    "id": 51,
    "fullName": "B...Grey cast iron Gr.300 (Rm=300 MPa)",
    "name": "Grey cast iron",
    "standard": "Gr.300",
    "treatment": "untreated",
    "group": "B",
    "notes": "",
    "standards": {
      "iso": "Gr.300",
      "en": "FG30",
      "ansi": "No.45 (ASTM A48)",
      "din": "GG-30",
      "csn": "",
      "jis": "FC300"
    },
    "density": 7870.0,
    "rm": 300.0,
    "rp02": 150.0,
    "coreHardnessHV": 240.0,
    "surfaceHardnessHV": 240.0,
    "shlim": 360.0,
    "sflim": 120.0,
    "nhlim": 50000000.0,
    "nflim": 3000000.0,
    "qh": 10.0,
    "qf": 6.0,
    "elasticModulus": 113.0,
    "poissonRatio": 0.25,
    "abbrev": "GG",
    "maxZNT": 1.3
  }
];

const MATERIALS_DB = Materials;
const MITCALC_MATERIALS = Materials;


/**
 * MITCalc Web App - Worm Gear Materials & Standard Lookup Tables (Module 3)
 * 100% 1-to-1 Extraction from C:\MITCalc\gear4\Gear4_01.xlsb (Material & Tables sheets)
 */

const WORM_WHEEL_MATERIALS = [
    {
        id: 1,
        fullName: "User material 1",
        name: "User material 1",
        designation: "",
        density: 8800.0,
        matTypeW: 1, // 1=Bronze, 2=Cast Iron, 3=Al Bronze
        group: "X",
        rm: 300.0,
        rp02: 150.0,
        coreHardnessHV: 200.0,
        surfaceHardnessHV: 200.0,
        shlim: 400.0,
        sflim: 300.0,
        nhlim: 50000000.0,
        nflim: 3000000.0,
        qh: 10.0,
        qf: 6.0,
        elasticModulus: 88.0,
        poissonRatio: 0.3,
        wml: [1.0, 1.0, 1.0], // [Mineral, PAO, PEG]
        yw: 1.0,
        sigmaHlimT: 400.0,
        tauFlimT: 100.0,
        ynlMode: "fixed1"
    },
    {
        id: 2,
        fullName: "User material 2",
        name: "User material 2",
        designation: "",
        density: 8800.0,
        matTypeW: 1,
        group: "X",
        rm: 300.0,
        rp02: 150.0,
        coreHardnessHV: 200.0,
        surfaceHardnessHV: 200.0,
        shlim: 400.0,
        sflim: 300.0,
        nhlim: 50000000.0,
        nflim: 3000000.0,
        qh: 10.0,
        qf: 6.0,
        elasticModulus: 88.0,
        poissonRatio: 0.3,
        wml: [1.0, 1.0, 1.0],
        yw: 1.0,
        sigmaHlimT: 400.0,
        tauFlimT: 100.0,
        ynlMode: "fixed1"
    },
    {
        id: 3,
        fullName: "User material 3",
        name: "User material 3",
        designation: "",
        density: 8800.0,
        matTypeW: 1,
        group: "X",
        rm: 300.0,
        rp02: 150.0,
        coreHardnessHV: 200.0,
        surfaceHardnessHV: 200.0,
        shlim: 400.0,
        sflim: 300.0,
        nhlim: 50000000.0,
        nflim: 3000000.0,
        qh: 10.0,
        qf: 6.0,
        elasticModulus: 88.0,
        poissonRatio: 0.3,
        wml: [1.0, 1.0, 1.0],
        yw: 1.0,
        sigmaHlimT: 400.0,
        tauFlimT: 100.0,
        ynlMode: "fixed1"
    },
    {
        id: 4,
        fullName: "User material 4",
        name: "User material 4",
        designation: "",
        density: 8800.0,
        matTypeW: 1,
        group: "X",
        rm: 300.0,
        rp02: 150.0,
        coreHardnessHV: 200.0,
        surfaceHardnessHV: 200.0,
        shlim: 400.0,
        sflim: 300.0,
        nhlim: 50000000.0,
        nflim: 3000000.0,
        qh: 10.0,
        qf: 6.0,
        elasticModulus: 88.0,
        poissonRatio: 0.3,
        wml: [1.0, 1.0, 1.0],
        yw: 1.0,
        sigmaHlimT: 400.0,
        tauFlimT: 100.0,
        ynlMode: "fixed1"
    },
    {
        id: 5,
        fullName: "User material 5",
        name: "User material 5",
        designation: "",
        density: 8800.0,
        matTypeW: 1,
        group: "X",
        rm: 300.0,
        rp02: 150.0,
        coreHardnessHV: 200.0,
        surfaceHardnessHV: 200.0,
        shlim: 400.0,
        sflim: 300.0,
        nhlim: 50000000.0,
        nflim: 3000000.0,
        qh: 10.0,
        qf: 6.0,
        elasticModulus: 88.0,
        poissonRatio: 0.3,
        wml: [1.0, 1.0, 1.0],
        yw: 1.0,
        sigmaHlimT: 400.0,
        tauFlimT: 100.0,
        ynlMode: "fixed1"
    },
    {
        id: 6,
        fullName: "Tinbronze CuSn12-C-GZ (DIN EN 1982) (Rm=280 MPa)",
        name: "Tinbronze",
        designation: "CuSn12-C-GZ (DIN EN 1982)",
        density: 8800.0,
        matTypeW: 1,
        group: "X",
        rm: 280.0,
        rp02: 150.0,
        coreHardnessHV: 190.0,
        surfaceHardnessHV: 190.0,
        shlim: 430.0,
        sflim: 315.0,
        nhlim: 50000000.0,
        nflim: 3000000.0,
        qh: 10.0,
        qf: 6.0,
        elasticModulus: 88.3,
        poissonRatio: 0.35,
        wml: [1.6, 1.6, 2.25],
        yw: 1.0,
        sigmaHlimT: 425.0,
        tauFlimT: 92.0,
        ynlMode: "bronze"
    },
    {
        id: 7,
        fullName: "Bronze (centrifugal cast) CuSn12Ni2-C-GZ (DIN EN 1982) (Rm=300 MPa)",
        name: "Bronze (centrifugal cast)",
        designation: "CuSn12Ni2-C-GZ (DIN EN 1982)",
        density: 8800.0,
        matTypeW: 1,
        group: "X",
        rm: 300.0,
        rp02: 180.0,
        coreHardnessHV: 230.0,
        surfaceHardnessHV: 230.0,
        shlim: 510.0,
        sflim: 325.0,
        nhlim: 50000000.0,
        nflim: 3000000.0,
        qh: 10.0,
        qf: 6.0,
        elasticModulus: 98.1,
        poissonRatio: 0.35,
        wml: [1.0, 1.0, 1.75],
        yw: 0.95,
        sigmaHlimT: 520.0,
        tauFlimT: 100.0,
        ynlMode: "bronze"
    },
    {
        id: 8,
        fullName: "Bronze (continuous casting) CuSn12Ni2-C-GC (DIN EN 1982) (Rm=300 MPa)",
        name: "Bronze (continuous casting)",
        designation: "CuSn12Ni2-C-GC (DIN EN 1982)",
        density: 8800.0,
        matTypeW: 1,
        group: "X",
        rm: 300.0,
        rp02: 180.0,
        coreHardnessHV: 250.0,
        surfaceHardnessHV: 250.0,
        shlim: 550.0,
        sflim: 345.0,
        nhlim: 50000000.0,
        nflim: 3000000.0,
        qh: 10.0,
        qf: 6.0,
        elasticModulus: 98.1,
        poissonRatio: 0.35,
        wml: [4.1, 4.1, 4.1],
        yw: 0.95,
        sigmaHlimT: 520.0,
        tauFlimT: 100.0,
        ynlMode: "bronze"
    },
    {
        id: 9,
        fullName: "Aluminium Bronze CuAl10Fe5Ni5-C-GZ (DIN EN 1982) (Rm=700 MPa)",
        name: "Aluminium Bronze",
        designation: "CuAl10Fe5Ni5-C-GZ (DIN EN 1982)",
        density: 7400.0,
        matTypeW: 3,
        group: "X",
        rm: 700.0,
        rp02: 300.0,
        coreHardnessHV: 150.0,
        surfaceHardnessHV: 150.0,
        shlim: 420.0,
        sflim: 300.0,
        nhlim: 50000000.0,
        nflim: 3000000.0,
        qh: 10.0,
        qf: 6.0,
        elasticModulus: 122.6,
        poissonRatio: 0.35,
        wml: [1.0, 1.0, 1.0],
        yw: 1.1,
        sigmaHlimT: 660.0,
        tauFlimT: 128.0,
        ynlMode: "albronze"
    },
    {
        id: 10,
        fullName: "SG Cast iron EN-GJS-400-15 (DIN EN 1563) (Rm=400 MPa)",
        name: "SG Cast iron",
        designation: "EN-GJS-400-15 (DIN EN 1563)",
        density: 7000.0,
        matTypeW: 2,
        group: "X",
        rm: 400.0,
        rp02: 250.0,
        coreHardnessHV: 180.0,
        surfaceHardnessHV: 180.0,
        shlim: 480.0,
        sflim: 336.0,
        nhlim: 50000000.0,
        nflim: 3000000.0,
        qh: 10.0,
        qf: 6.0,
        elasticModulus: 175.0,
        poissonRatio: 0.3,
        wml: [1.0, 1.0, 1.0],
        yw: 1.0,
        sigmaHlimT: 490.0,
        tauFlimT: 115.0,
        ynlMode: "gjs"
    },
    {
        id: 11,
        fullName: "Cast iron EN-GJL-250 (DIN EN 1561) (Rm=250 MPa)",
        name: "Cast iron",
        designation: "EN-GJL-250 (DIN EN 1561)",
        density: 7000.0,
        matTypeW: 2,
        group: "X",
        rm: 250.0,
        rp02: 165.0,
        coreHardnessHV: 210.0,
        surfaceHardnessHV: 210.0,
        shlim: 540.0,
        sflim: 372.0,
        nhlim: 50000000.0,
        nflim: 3000000.0,
        qh: 10.0,
        qf: 6.0,
        elasticModulus: 98.1,
        poissonRatio: 0.3,
        wml: [1.0, 1.0, 1.0],
        yw: 1.05,
        sigmaHlimT: 350.0,
        tauFlimT: 70.0,
        ynlMode: "gjl"
    }
];

const WORM_STD_TABLES = {
    // T_ToothType (Tables!B7:B11)
    T_ToothType: [
        { id: 1, code: "ZA", label: "ZA (A) Wormgear — Trục vít Ác-si-mét (Archimedean)" },
        { id: 2, code: "ZN", label: "ZN (N) Wormgear — Trục vít কনボリュート pháp tuyến (Normal Straight)" },
        { id: 3, code: "ZI", label: "ZI (I) Wormgear — Trục vít Thân khai (Involute)" },
        { id: 4, code: "ZK", label: "ZK (K) Wormgear — Trục vít Gia công bằng đá mài/dao côn (Cone Milled)" },
        { id: 5, code: "ZH", label: "ZH (C) Wormgear — Trục vít Biên dạng lõm Cavex (Concave Profile)" }
    ],

    // T_DesignCooling (Tables!B31:G33)
    T_DesignCooling: [
        { id: 1, label: "Worm oil bath lubrication (Ngâm dầu trục vít)", indexOffset: 3 },
        { id: 2, label: "Worm gear oil bath lubrication (Ngâm dầu bánh vít)", indexOffset: 3 },
        { id: 3, label: "Oil-spray lubrication (Phun dầu cưỡng bức)", indexOffset: 0 }
    ],

    // T_OilType (Tables!B26:E28)
    T_OilType: [
        { id: 1, label: "Mineral oil (Dầu khoáng)", Zoil: 0.89, calfa: 1.7e-8, kp: 0.0007 },
        { id: 2, label: "Oil based on polyalphaolefins (PAO - Dầu tổng hợp PAO)", Zoil: 0.94, calfa: 1.4e-8, kp: 0.00076 },
        { id: 3, label: "Oil based on Polyglycols (PEG - Dầu tổng hợp Polyglycol)", Zoil: 1.0, calfa: 1.3e-8, kp: 0.00077 }
    ],

    // T_Lubricant (Tables!B70:E79)
    T_Lubricant: [
        { id: 1, label: "ISO VG - 32", ro15: 0.984, ny40: 32.0, ny100: 6.5 },
        { id: 2, label: "ISO VG - 46      (AGMA no 1)", ro15: 1.035, ny40: 46.0, ny100: 9.0 },
        { id: 3, label: "ISO VG - 80", ro15: 1.04, ny40: 80.0, ny100: 15.0 },
        { id: 4, label: "ISO VG - 100    (AGMA no 3)", ro15: 1.043, ny40: 100.0, ny100: 20.0 },
        { id: 5, label: "ISO VG - 150    (AGMA no 4)", ro15: 1.05, ny40: 150.0, ny100: 29.0 },
        { id: 6, label: "ISO VG - 220    (AGMA no 5)", ro15: 1.06, ny40: 220.0, ny100: 40.0 },
        { id: 7, label: "ISO VG - 320    (AGMA no 6)", ro15: 1.067, ny40: 320.0, ny100: 54.0 },
        { id: 8, label: "ISO VG - 460    (AGMA no 7)", ro15: 1.074, ny40: 460.0, ny100: 71.0 },
        { id: 9, label: "ISO VG - 680    (AGMA no 8)", ro15: 1.075, ny40: 680.0, ny100: 110.0 },
        { id: 10, label: "ISO VG - 1000  (AGMA no 9)", ro15: 1.075, ny40: 1000.0, ny100: 167.0 }
    ],

    // T_BearingTyp (Tables!B45:B47)
    T_BearingTyp: [
        { id: 1, label: "A..Fixed/fixed bearing (Ổ đỡ cố định - cố định)" },
        { id: 2, label: "B..Fixed/floating bearing (Ổ đỡ cố định - tùy động)" },
        { id: 3, label: "C..Friction bearing (Ổ trượt)" }
    ],

    // T_LoadType (Tables!B343:B346)
    T_LoadType: [
        { id: 1, label: "A...Continuous (Tải êm, liên tục)" },
        { id: 2, label: "B...Light shocks (Va đập nhẹ)" },
        { id: 3, label: "C...Moderate shocks (Va đập vừa)" },
        { id: 4, label: "D...Heavy shocks (Va đập mạnh)" }
    ],

    // T_KAcoef (Tables!C337:F340) [LoadTypeA - 1][LoadTypeB - 1]
    T_KAcoef: [
        [1.00, 1.25, 1.50, 1.75],
        [1.10, 1.35, 1.60, 1.85],
        [1.25, 1.50, 1.75, 2.00],
        [1.50, 1.75, 2.00, 2.25]
    ],

    // T_Diam_q (Tables!B82:B99)
    T_Diam_q: [6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0, 9.5, 10.0, 11.0, 12.0, 13.0, 14.0, 16.0, 18.0, 20.0, 22.0, 25.0],

    // T_Module (Tables!B103:E123)
    T_Module: [
        { id: 1, m: 0.5, dp: 40.0 },
        { id: 2, m: 0.6, dp: 32.0 },
        { id: 3, m: 0.8, dp: 24.0 },
        { id: 4, m: 1.0, dp: 20.0 },
        { id: 5, m: 1.25, dp: 16.0 },
        { id: 6, m: 1.6, dp: 14.0 },
        { id: 7, m: 2.0, dp: 12.0 },
        { id: 8, m: 2.5, dp: 10.0 },
        { id: 9, m: 3.15, dp: 8.0 },
        { id: 10, m: 4.0, dp: 6.0 },
        { id: 11, m: 4.233333333333333, dp: 6.0, label: "4.2333 (DP 6)" },
        { id: 12, m: 5.0, dp: 5.0 },
        { id: 13, m: 6.3, dp: 4.0 },
        { id: 14, m: 8.0, dp: 3.0 },
        { id: 15, m: 10.0, dp: 2.5 },
        { id: 16, m: 12.5, dp: 2.0 },
        { id: 17, m: 16.0, dp: 1.5 },
        { id: 18, m: 20.0, dp: 1.25 },
        { id: 19, m: 25.0, dp: 1.0 },
        { id: 20, m: 32.0, dp: 0.75 },
        { id: 21, m: 40.0, dp: 0.6 },
        { id: 22, m: 50.0, dp: 0.5 }
    ],

    // Pure 21 rows of T_Module in Gear4_01.xlsb Tables!B103:E123 (used by AxisDistTbl)
    T_Module_Excel21: [
        0.5, 0.6, 0.8, 1.0, 1.25, 1.6, 2.0, 2.5, 3.15, 4.0, 5.0,
        6.3, 8.0, 10.0, 12.5, 16.0, 20.0, 25.0, 32.0, 40.0, 50.0
    ],

    // T_Alfa0 (Tables!B158:D164)
    T_Alfa0: [14.5, 17.5, 20.0, 22.5, 25.0, 27.5, 30.0],

    // T_gamaProp (Tables!B167:B178)
    T_gamaProp: [2.0, 3.0, 4.0, 5.0, 7.0, 9.0, 11.0, 14.0, 17.0, 21.0, 25.0, 30.0],

    // T_i (Tables!B299:C331)
    T_i: [
        { label: "5.00", val: 5.0 },
        { label: "*5.60", val: 5.6 },
        { label: "6.30", val: 6.3 },
        { label: "*7.10", val: 7.1 },
        { label: "8.00", val: 8.0 },
        { label: "*9.00", val: 9.0 },
        { label: "10.00", val: 10.0 },
        { label: "*11.20", val: 11.2 },
        { label: "12.50", val: 12.5 },
        { label: "*14.00", val: 14.0 },
        { label: "16.00", val: 16.0 },
        { label: "*18.00", val: 18.0 },
        { label: "20.00", val: 20.0 },
        { label: "*22.40", val: 22.4 },
        { label: "25.00", val: 25.0 },
        { label: "*28.00", val: 28.0 },
        { label: "31.50", val: 31.5 },
        { label: "*35.50", val: 35.5 },
        { label: "40.00", val: 40.0 },
        { label: "*45.00", val: 45.0 },
        { label: "50.00", val: 50.0 },
        { label: "*56.00", val: 56.0 },
        { label: "63.00", val: 63.0 },
        { label: "*71.00", val: 71.0 },
        { label: "80.00", val: 80.0 },
        { label: "*90.00", val: 90.0 },
        { label: "100.00", val: 100.0 },
        { label: "*112.00", val: 112.0 },
        { label: "125.00", val: 125.0 },
        { label: "*140.00", val: 140.0 },
        { label: "160.00", val: 160.0 },
        { label: "*180.00", val: 180.0 },
        { label: "200.00", val: 200.0 }
    ],

    // T_av (Tables!B262:C296)
    T_av: [
        { label: "40", val: 40 },
        { label: "50", val: 50 },
        { label: "63", val: 63 },
        { label: "*71", val: 71 },
        { label: "80", val: 80 },
        { label: "*90", val: 90 },
        { label: "100", val: 100 },
        { label: "*112", val: 112 },
        { label: "125", val: 125 },
        { label: "*140", val: 140 },
        { label: "160", val: 160 },
        { label: "*180", val: 180 },
        { label: "200", val: 200 },
        { label: "*224", val: 224 },
        { label: "250", val: 250 },
        { label: "*280", val: 280 },
        { label: "315", val: 315 },
        { label: "*355", val: 355 },
        { label: "400", val: 400 },
        { label: "*450", val: 450 },
        { label: "500", val: 500 }
    ]
};

if (typeof window !== 'undefined') {
    window.WORM_WHEEL_MATERIALS = WORM_WHEEL_MATERIALS;
    window.WORM_STD_TABLES = WORM_STD_TABLES;
}



/**
 * MITCalc Web App - Worm Gear Geometry, Kinematics & Efficiency Engine (Module 3)
 * Standards: DIN 3975, DIN 3996 (1998 & 2005), AGMA 6022-C93
 * 100% Cell-by-Cell Math Match with MITCalc 1.74 (C:\MITCalc\gear4\Gear4_01.xlsb)
 * ZERO-FORCE SCOPE: Strictly geometric, kinematic, efficiency/self-locking, AGMA, and CAD calculations.
 */

const WormCalcEngine = {
    getWormMaterial(matP) {
        const id = parseInt(matP) || 41;
        const db = (typeof MATERIALS_DB !== 'undefined') ? MATERIALS_DB : ((typeof Materials !== 'undefined') ? Materials : []);
        const found = db.find(m => m.id === id);
        if (found) {
            return {
                id: found.id,
                name: found.name,
                designation: (found.standards && (found.standards.din || found.standards.en || found.standards.iso)) || found.standard || found.name,
                density: found.density || 7870.0,
                elasticModulus: found.elasticModulus || 206.0,
                poissonRatio: found.poissonRatio || 0.3,
                rm: found.rm || 785.0,
                rp02: found.rp02 || 588.0,
                shlim: found.shlim || 1270.0,
                sflim: found.sflim || 700.0,
                vhv: found.surfaceHardnessHV || 650.0,
                jhv: found.coreHardnessHV || 250.0,
                nhlim: found.nhlim || 100000000.0,
                nflim: found.nflim || 3000000.0,
                qh: found.qh || 10.0,
                qf: found.qf || 9.0
            };
        }
        return {
            id: 41,
            name: "Alloy structural steel",
            designation: "16MnCr5",
            density: 7870.0,
            elasticModulus: 206.0,
            poissonRatio: 0.3,
            rm: 785.0,
            rp02: 588.0,
            shlim: 1270.0,
            sflim: 700.0,
            vhv: 650.0,
            jhv: 250.0,
            nhlim: 100000000.0,
            nflim: 3000000.0,
            qh: 10.0,
            qf: 9.0
        };
    },

    getWheelMaterial(matW) {
        const id = parseInt(matW) || 7;
        const db = (typeof WORM_WHEEL_MATERIALS !== 'undefined') ? WORM_WHEEL_MATERIALS : [];
        const found = db.find(m => m.id === id);
        if (found) return found;
        return {
            id: 7,
            fullName: "Bronze (centrifugal cast) CuSn12Ni2-C-GZ (DIN EN 1982) (Rm=300 MPa)",
            name: "Bronze (centrifugal cast)",
            designation: "CuSn12Ni2-C-GZ (DIN EN 1982)",
            density: 8800.0,
            matTypeW: 1,
            rm: 300.0,
            rp02: 180.0,
            coreHardnessHV: 230.0,
            surfaceHardnessHV: 230.0,
            shlim: 510.0,
            sflim: 325.0,
            nhlim: 50000000.0,
            nflim: 3000000.0,
            qh: 10.0,
            qf: 6.0,
            elasticModulus: 98.1,
            poissonRatio: 0.35,
            wml: [1.0, 1.0, 1.75],
            yw: 0.95,
            sigmaHlimT: 520.0,
            tauFlimT: 100.0
        };
    },

    calculate(p = {}) {
        // 1.0 Basic Input Parameters (Rows 117-123)
        const poweredWoWh = parseInt(p.poweredWoWh !== undefined ? p.poweredWoWh : 1); // 1=Worm driving, 2=Gear driving
        const Pw2 = (p.Pw2 !== undefined && p.Pw2 !== null && String(p.Pw2).trim() !== '') ? parseFloat(p.Pw2) : 3.0;
        const n1 = (p.n1 !== undefined && p.n1 !== null && String(p.n1).trim() !== '') ? parseFloat(p.n1) : 1500.0;
        const iin = (p.iin !== undefined && p.iin !== null && String(p.iin).trim() !== '') ? parseFloat(p.iin) : 40.0;

        // 2.0 Material, Loading, Lubrication & Production Parameters (Rows 126-139)
        const matP = parseInt(p.matP !== undefined ? p.matP : 41);
        const matW = parseInt(p.matW !== undefined ? p.matW : 7);
        const wormMat = this.getWormMaterial(matP);
        const wheelMat = this.getWheelMaterial(matW);
        const MatTypeW = wheelMat.matTypeW || 1; // X128: 1=Bronze, 2=Cast Iron, 3=Al Bronze

        const toothType = parseInt(p.toothType !== undefined ? p.toothType : 2); // 1=ZA, 2=ZN, 3=ZI, 4=ZK, 5=ZH
        const loadTypeA = parseInt(p.loadTypeA !== undefined ? p.loadTypeA : 1); // 1..4
        const loadTypeB = parseInt(p.loadTypeB !== undefined ? p.loadTypeB : 1); // 1..4
        const designCooling = parseInt(p.designCooling !== undefined ? p.designCooling : 1); // 1=Worm bath, 2=Gear bath, 3=Oil-spray
        const oilType = parseInt(p.oilType !== undefined ? p.oilType : 3); // 1=Mineral, 2=PAO, 3=PEG
        const lubricant = parseInt(p.lubricant !== undefined ? p.lubricant : 6); // 1..10 (6=ISO VG 220)

        const ny40 = (p.ny40 !== undefined && p.ny40 !== null && String(p.ny40).trim() !== '') ? parseFloat(p.ny40) : 220.0;
        const ny100 = (p.ny100 !== undefined && p.ny100 !== null && String(p.ny100).trim() !== '') ? parseFloat(p.ny100) : 40.0;
        const rooil15 = (p.rooil15 !== undefined && p.rooil15 !== null && String(p.rooil15).trim() !== '') ? parseFloat(p.rooil15) : 1.06;
        const Ra1 = (p.Ra1 !== undefined && p.Ra1 !== null && String(p.Ra1).trim() !== '') ? parseFloat(p.Ra1) : 0.5;

        const kaTable = (typeof WORM_STD_TABLES !== 'undefined' && WORM_STD_TABLES.T_KAcoef)
            ? WORM_STD_TABLES.T_KAcoef
            : [[1.0, 1.25, 1.5, 1.75], [1.1, 1.35, 1.6, 1.85], [1.25, 1.5, 1.75, 2.0], [1.5, 1.75, 2.0, 2.25]];
        const KA_Prop = (kaTable[loadTypeA - 1] && kaTable[loadTypeA - 1][loadTypeB - 1]) || 1.0;
        const kaFlag = (p.kaFlag !== undefined) ? Boolean(p.kaFlag) : true;
        const KA = kaFlag ? KA_Prop : ((p.KA !== undefined && String(p.KA).trim() !== '') ? parseFloat(p.KA) : KA_Prop);
        const Lh = (p.Lh !== undefined && p.Lh !== null && String(p.Lh).trim() !== '') ? parseFloat(p.Lh) : 25000.0;

        // 3.0 Parameters of the Tooth Profile (Rows 147-150)
        const haXP = (p.haXP !== undefined && p.haXP !== null && String(p.haXP).trim() !== '') ? parseFloat(p.haXP) : 1.0;
        const haXG = haXP;
        const caXP = (p.caXP !== undefined && p.caXP !== null && String(p.caXP).trim() !== '') ? parseFloat(p.caXP) : 0.25;
        const caXG = caXP;
        const alfa_temp = (p.alfa_temp !== undefined && p.alfa_temp !== null && String(p.alfa_temp).trim() !== '') ? parseFloat(p.alfa_temp) : 20.0;
        const alfa0 = alfa_temp; // X222
        const rf1_rec = caXG / (1.0 - Math.sin((alfa0 * Math.PI) / 180.0)); // O149
        const rf1Flag = (p.rf1Flag !== undefined) ? Boolean(p.rf1Flag) : true; // B149
        const rf1 = rf1Flag ? rf1_rec : ((p.rf1 !== undefined && String(p.rf1).trim() !== '') ? parseFloat(p.rf1) : rf1_rec); // O150
        const rf2 = rf1; // X150

        // 4.0 Design of a Geometry of Toothing (Rows 160-185)
        const z1 = Math.max(1, parseInt(p.z1 !== undefined ? p.z1 : 1)); // O161
        // T161: _z2 = INT(_iin * _z1 + 0.5)
        const z2 = (p.z2_direct !== undefined && p.z2_direct !== null) ? parseInt(p.z2_direct) : Math.floor(iin * z1 + 0.5);
        const i = z2 / z1; // O123
        const i_dev = (i - iin) / i; // P123
        const i_dev_pct = i_dev * 100.0;
        const n2 = n1 / i; // P120

        const m_Input = (p.m_Input !== undefined && p.m_Input !== null && String(p.m_Input).trim() !== '') ? parseFloat(p.m_Input) : (25.4 / 6.0); // O167 (4.233333333333333)
        const m_temp = m_Input; // T167 (SI)
        const CP = (m_temp * Math.PI) / 25.4; // O168
        const DP = 25.4 / m_temp; // P168

        const teethOrientation = parseInt(p.teethOrientation !== undefined ? p.teethOrientation : 1); // 1=Right, 2=Left
        const calc_q = parseInt(p.calc_q !== undefined ? p.calc_q : 1); // F163: 1=q input, 2=d1 input, 3=gama input

        let q = (p.q !== undefined && p.q !== null && String(p.q).trim() !== '') ? parseFloat(p.q) : 8.5;
        let d1_Input = (p.d1_Input !== undefined && p.d1_Input !== null && String(p.d1_Input).trim() !== '') ? parseFloat(p.d1_Input) : 36.23149719358681;
        let gama = (p.gama !== undefined && p.gama !== null && String(p.gama).trim() !== '') ? parseFloat(p.gama) : 6.709836807756933;

        let mn, mx, d1;
        if (calc_q === 1) {
            // Mode 1: q is input -> compute gama and d1
            gama = (Math.atan(z1 / q) * 180.0) / Math.PI; // X165
            const gama_rad_1 = (gama * Math.PI) / 180.0;
            if (toothType === 1) {
                mx = m_temp;
                mn = mx * Math.cos(gama_rad_1);
                d1 = (mx * z1) / Math.tan(gama_rad_1);
            } else {
                mn = m_temp;
                mx = mn / Math.cos(gama_rad_1);
                d1 = (mn * z1) / Math.sin(gama_rad_1);
            }
            d1_Input = d1;
        } else if (calc_q === 2) {
            // Mode 2: d1 is input -> compute q and gama via exact CellTransmitVal fixed-point
            d1 = d1_Input;
            if (toothType === 1) {
                mx = m_temp;
                q = d1 / mx;
                gama = (Math.atan(z1 / q) * 180.0) / Math.PI;
                mn = mx * Math.cos((gama * Math.PI) / 180.0);
            } else {
                mn = m_temp;
                for (let iter = 0; iter < 40; iter++) {
                    mx = mn / Math.cos((gama * Math.PI) / 180.0);
                    q = d1 / mx;
                    gama = (Math.atan(z1 / q) * 180.0) / Math.PI;
                }
                mx = mn / Math.cos((gama * Math.PI) / 180.0);
                q = d1 / mx;
            }
        } else {
            // Mode 3: gama is input -> compute d1 and q
            const gama_rad_3 = (gama * Math.PI) / 180.0;
            if (toothType === 1) {
                mx = m_temp;
                mn = mx * Math.cos(gama_rad_3);
                d1 = (mx * z1) / Math.tan(gama_rad_3);
            } else {
                mn = m_temp;
                mx = mn / Math.cos(gama_rad_3);
                d1 = (mn * z1) / Math.sin(gama_rad_3);
            }
            d1_Input = d1;
            q = d1 / mx;
        }

        const gama_rad = (gama * Math.PI) / 180.0;
        const q_calc = d1 / mx; // X163
        const d1_calc = (toothType === 1) ? ((mx * z1) / Math.tan(gama_rad)) : ((mn * z1) / Math.sin(gama_rad)); // X164
        const gama_calc = (Math.atan(z1 / q) * 180.0) / Math.PI; // X165

        // Recommended q and d1 (X160, Y160)
        const q_rec = 2.0 * (1.4 + 2.0 * Math.sqrt(z1)); // X160
        const d1_rec = Math.round(q_rec * m_temp * 100.0) / 100.0; // Y160

        // 5.0 Basic Dimensions of Gearing (DIN 3975) (Rows 220-238)
        const mt = mn / Math.sin(gama_rad); // U220
        const pn = Math.PI * mn; // T221
        const pt = pn / Math.sin(gama_rad); // U221
        const px = pt * Math.tan(gama_rad); // V221

        // Pressure angles (Row 222)
        const alfax = (toothType === 1)
            ? alfa_temp
            : (Math.atan(Math.tan((alfa_temp * Math.PI) / 180.0) / Math.cos(gama_rad)) * 180.0) / Math.PI; // P222
        const alfan = (toothType === 1)
            ? (Math.atan(Math.tan((alfax * Math.PI) / 180.0) * Math.cos(gama_rad)) * 180.0) / Math.PI
            : alfa_temp; // M222
        const alfat = (Math.atan(Math.tan((alfan * Math.PI) / 180.0) / Math.sin(gama_rad)) * 180.0) / Math.PI; // O222

        const x1 = 0.0; // X172
        const x2 = (p.x2 !== undefined && p.x2 !== null && String(p.x2).trim() !== '') ? parseFloat(p.x2) : 0.0; // O173

        // Diameters (Rows 224-228)
        const d2 = (toothType === 1) ? (mx * z2) : ((mn * z2) / Math.cos(gama_rad)); // U225
        const da1 = (toothType === 1) ? (d1 + 2.0 * mx * (haXP + x1)) : (d1 + 2.0 * mn * (haXP + x1)); // T224
        const da2 = (toothType === 1) ? (d2 + 2.0 * mx * (haXG + x2)) : (d2 + 2.0 * mn * (haXG + x2)); // U224
        const df1 = (toothType === 1) ? (d1 - 2.0 * mx * (haXP + caXP)) : (d1 - 2.0 * mn * (haXP + caXP)); // T226
        const df2 = (toothType === 1) ? (d2 - 2.0 * mx * (haXG + caXG - x2)) : (d2 - 2.0 * mn * (haXG + caXG - x2)); // U226
        const dw1 = (toothType === 1) ? (d1 + 2.0 * mx * x2) : (d1 - 2.0 * mn * x2); // T227
        const dw2 = (toothType === 1) ? (d2 + 2.0 * mx * x1) : (d2 + 2.0 * mn * x1); // U227
        const dm1 = q * mx; // T228
        const dm2 = mx * z2 + 2.0 * x2 * mx; // U228

        const ha1 = (da1 - d1) / 2.0; // T230
        const ha2 = (da2 - d2) / 2.0; // U230
        const hf1 = (d1 - df1) / 2.0; // T231
        const hf2 = (d2 - df2) / 2.0; // U231
        const a = (toothType === 1) ? (0.5 * (d1 + d2) + x2 * mx) : (0.5 * (d1 + d2) + x2 * mn); // T232

        // Bearing distances l1, l2 & Face widths L, b2H (Rows 169-172)
        const l1_proc = (p.l1_proc !== undefined && p.l1_proc !== null && String(p.l1_proc).trim() !== '') ? parseFloat(p.l1_proc) : 50.0; // O169
        const l2_proc = (p.l2_proc !== undefined && p.l2_proc !== null && String(p.l2_proc).trim() !== '') ? parseFloat(p.l2_proc) : 50.0; // P169
        const l1_Units = (da2 * l1_proc) / 100.0; // T169
        const l2_Units = (da2 * l2_proc) / 100.0; // U169
        const l1l2_flag = (p.l1l2_flag !== undefined) ? Boolean(p.l1l2_flag) : true; // B170
        const l1_input = l1l2_flag ? l1_Units : ((p.l1_input !== undefined && String(p.l1_input).trim() !== '') ? parseFloat(p.l1_input) : l1_Units); // O170
        const l2_input = l1l2_flag ? l2_Units : ((p.l2_input !== undefined && String(p.l2_input).trim() !== '') ? parseFloat(p.l2_input) : l2_Units); // P170
        const l1 = l1_input; // T170
        const l2 = l2_input; // U170

        const L_Proposal = (toothType === 1)
            ? ((z1 < 4) ? (11.0 + 0.06 * z2) * mx : (12.5 + 0.09 * z2) * mx)
            : ((z1 < 4) ? (11.0 + 0.06 * z2) * mn : (12.5 + 0.09 * z2) * mn); // P171
        const FlagL = (p.FlagL !== undefined) ? Boolean(p.FlagL) : true; // B171
        const L_Input = FlagL ? L_Proposal : ((p.L_Input !== undefined && String(p.L_Input).trim() !== '') ? parseFloat(p.L_Input) : L_Proposal); // O171
        const L = L_Input; // T171

        const b2H_Proposal = Math.round(((z1 < 4) ? 0.75 * (1.0 + 2.0 / q) * d1 : 0.67 * (1.0 + 2.0 / q) * d1) * 100.0) / 100.0; // P172
        const Flagb2H = (p.Flagb2H !== undefined) ? Boolean(p.Flagb2H) : true; // B172
        const b2H_Input = Flagb2H ? b2H_Proposal : ((p.b2H_Input !== undefined && String(p.b2H_Input).trim() !== '') ? parseFloat(p.b2H_Input) : b2H_Proposal); // O172
        const b2H = b2H_Input; // T172

        // Outside diameter of wormgear de2 (Rows 229, 231, 232)
        const X231 = Math.sqrt(Math.max(0.0, Math.pow(a - df2 / 2.0, 2) - Math.pow(b2H / 2.0, 2)));
        const Y231 = a - df2 / 2.0 - X231;
        const de2min = df2 + 2.0 * Y231 + 0.02 * mn; // Z231
        const AA231 = ((b2H / 2.0) * (a - da2 / 2.0)) / (a - df2 / 2.0);
        const AB231 = Math.sqrt(Math.max(0.0, Math.pow(a - da2 / 2.0, 2) - Math.pow(AA231, 2)));
        const AC231 = a - df2 / 2.0 - AB231;
        const de2max = df2 + 2.0 * AC231 - 0.02 * mn; // AD231
        const AA229 = da2 + mx;
        const de2Prop = Math.round(Math.min(Math.max(de2min, AA229), de2max) * 100.0) / 100.0; // Z229
        const de2Flag = (p.de2Flag !== undefined) ? Boolean(p.de2Flag) : true; // B229
        const de2Input = de2Flag ? de2Prop : ((p.de2Input !== undefined && String(p.de2Input).trim() !== '') ? parseFloat(p.de2Input) : de2Prop); // O229
        const de2 = de2Input; // U229
        const de2_range_str = `${(Math.round(de2min * 10.0) / 10.0).toFixed(1)}-${(Math.round(de2max * 10.0) / 10.0).toFixed(1)}`; // P229

        // Pitch angle on pitch diameter & Tooth thicknesses (Rows 234-238)
        const gamaw = (Math.atan((d1 / dw1) * Math.tan(gama_rad)) * 180.0) / Math.PI; // P234
        const gamab = (Math.acos(Math.cos(gama_rad) * Math.cos((alfan * Math.PI) / 180.0)) * 180.0) / Math.PI; // X234

        const sn1 = (toothType === 1) ? (0.5 * Math.PI * mx * Math.cos(gama_rad)) : (0.5 * Math.PI * mn); // T235
        const sx1 = (toothType === 1) ? (0.5 * Math.PI * mx) : ((0.5 * Math.PI * mn) / Math.cos(gama_rad)); // T236
        let sn2, sx2, en2, ex2;
        if (toothType === 1) {
            sx2 = 0.5 * Math.PI * mx + 2.0 * x2 * mx * Math.tan((alfax * Math.PI) / 180.0); // U236
            sn2 = sx2 * Math.cos(gama_rad); // U235
            ex2 = 0.5 * Math.PI * mx - 2.0 * x2 * mx * Math.tan((alfax * Math.PI) / 180.0); // U238
            en2 = ex2 * Math.cos(gama_rad); // U237
        } else {
            sn2 = 0.5 * Math.PI * mn + 2.0 * x2 * mn * Math.tan((alfan * Math.PI) / 180.0); // U235
            sx2 = sn2 / Math.cos(gama_rad); // U236
            en2 = 0.5 * Math.PI * mn - 2.0 * x2 * mn * Math.tan((alfan * Math.PI) / 180.0); // U237
            ex2 = en2 / Math.cos(gama_rad); // U238
        }
        const en1 = sn1; // T237
        const ex1 = sx1; // T238

        // Undercutting & Axis Distance Fitting Helpers (Rows 169-184)
        const z2minTh = (2.0 * haXP) / Math.pow(Math.sin((alfa_temp * Math.PI) / 180.0), 2); // X169
        const Y170 = (alfa_temp <= 15.0) ? 0.2 : ((alfa_temp >= 20.0) ? 0.3 : (((alfa_temp - 15.0) / 5.0) * 0.1 + 0.2));
        const z2minPr = (1.0 + Y170 / haXP) * z2minTh; // X170
        const xmin = Math.round(Math.max((haXP * (z2minPr - z2)) / z2minTh, -1.0) * 1000.0) / 1000.0; // X171
        const Flag_z2min = (z2 < z2minPr && x2 < xmin) ? 1 : 0; // U161

        const a_req1_Input = (p.a_req1_Input !== undefined && p.a_req1_Input !== null && String(p.a_req1_Input).trim() !== '') ? parseFloat(p.a_req1_Input) : 100.0; // O176
        const a_req1 = a_req1_Input; // T177
        const x_for_a = (toothType === 1)
            ? (a_req1 / mx - 0.5 * q - 0.5 * z2)
            : (a_req1 / mn - (0.5 * z1) / Math.sin(gama_rad) - (0.5 * z2) / Math.cos(gama_rad)); // X174
        const amin_dx = (toothType === 1) ? (0.5 * (d1 + d2) - 0.5 * mx) : (0.5 * (d1 + d2) - 0.5 * mn); // X175
        const amax_dx = (toothType === 1) ? (0.5 * (d1 + d2) + 1.0 * mx) : (0.5 * (d1 + d2) + 1.0 * mn); // Y175
        const Y176 = (a_req1_Input * 2.0) / (q + z2 + 2.0 * x2);
        const Z176 = (2.0 * a_req1_Input) / (z1 / Math.sin(gama_rad) + z2 / Math.cos(gama_rad) + x2);
        const m_for_a = (toothType === 1) ? Y176 : Z176; // X176
        const q_for_a = (toothType === 1)
            ? ((a_req1 - 0.5 * mx * z2 - mx * x2) / (0.5 * mx))
            : ((a_req1 - (0.5 * mn * z2) / Math.cos(gama_rad) - x2 * mn) / (0.5 * mx)); // X177

        const X183 = (Math.atan(z1 / 6.0) * 180.0) / Math.PI;
        const Y183 = mn / Math.cos((X183 * Math.PI) / 180.0);
        const Z183 = 0.5 * (Y183 * 6.0 + (mn * z2) / Math.cos((X183 * Math.PI) / 180.0) + 2.0 * x2 * mn);
        const X184 = (Math.atan(z1 / 25.0) * 180.0) / Math.PI;
        const Y184 = mn / Math.cos((X184 * Math.PI) / 180.0);
        const Z184 = 0.5 * (Y184 * 25.0 + (mn * z2) / Math.cos((X184 * Math.PI) / 180.0) + 2.0 * x2 * mn);
        const amin_q = (toothType === 1) ? (0.5 * mx * (6.0 + z2 + 2.0 * x2)) : Z183; // Y177
        const amax_q = (toothType === 1) ? (0.5 * mx * (25.0 + z2 + 2.0 * x2)) : Z184; // Z177

        // 6.0 Efficiency and Losses (DIN 3996) (Rows 240-255)
        const Mk2 = (30.0 / Math.PI) * (Pw2 / n1) * (z2 / z1) * 1000.0; // U121
        const T2 = Mk2 * KA; // Y259
        const vgm = (dm1 * n1) / (19098.0 * Math.cos(gama_rad)); // T241
        const YS = Math.sqrt(100.0 / Math.min(Math.max(65.0, a), 250.0)); // O242

        const B_coef = Math.sqrt(Math.max(0.0, 6.0 * mx * dm1 - 9.0 * mx * mx + mx)); // Y243
        const Z243 = -0.393 + 0.0000029157 * Math.pow(z2, -0.0847) * Math.pow(alfa0, 0.0595)
            * (0.0000007947 * x2 + 0.00005927) * ((1.0 - 0.038 * q) * q + 65.576)
            * (((108.8547 * z1) / q - 1.0) * (z1 / q) - 3294.921)
            * ((0.003291 * B_coef + 1.0) * B_coef - 13064.58);
        const AA243 = -0.511 + 0.0000037904 * Math.pow(z2, -0.0847) * Math.pow(alfa0, 0.0595)
            * (0.0000007947 * x2 + 0.00005927) * ((1.0 - 0.038 * q) * q + 65.576)
            * (((108.8547 * z1) / q - 1.0) * (z1 / q) - 3294.921)
            * ((0.003291 * B_coef + 1.0) * B_coef - 13064.58);
        const h_x_1998 = 0.018 + q / (7.86 * (q + z2)) + 1.0 / z2 + x2 / 110.0 - (z2 / z1) / 36300.0 + b2H / (370.4 * mx) - Math.sqrt(2.0 * q - 1.0) / 213.9; // X244
        const dinVersion = parseInt(p.dinVersion !== undefined ? p.dinVersion : 1); // Options!F5 = 1
        const h_x = Math.max((dinVersion === 1) ? h_x_1998 : ((toothType === 5) ? AA243 : Z243), 1e-9); // X243
        const YG = Math.min(Math.sqrt(0.07 / h_x), 2.0); // O243
        const YW = wheelMat.yw; // O244
        const YR = Math.pow(Ra1 / 0.5, 0.25); // O245

        // Lubrication index X132 = INDEX(T_DesignCooling, _DesignCooling, 2) + _OilType
        const lubricationIndex = ((designCooling === 3) ? 0 : 3) + oilType; // 1..6
        let X246, Y246;
        switch (lubricationIndex) {
            case 1: // Oil-spray + Mineral
                X246 = Math.min(0.028 + 0.026 / Math.pow(vgm + 0.17, 0.76), 0.1);
                Y246 = Math.min(0.055 + 0.015 / Math.pow(vgm + 0.2, 0.87), 0.1);
                break;
            case 2: // Oil-spray + PAO
                X246 = Math.min(0.026 + 0.017 / Math.pow(vgm + 0.17, 0.92), 0.096);
                Y246 = Math.min(0.055 + 0.015 / Math.pow(vgm + 0.2, 0.87), 0.1);
                break;
            case 3: // Oil-spray + PEG
                X246 = Math.min(0.02 + 0.02 / Math.pow(vgm + 0.2, 0.97), 0.094);
                Y246 = Math.min(0.034 + 0.015 / Math.pow(vgm + 0.19, 0.97), 0.1);
                break;
            case 4: // Oil bath + Mineral
                X246 = Math.min(0.033 + 0.079 / Math.pow(vgm + 0.2, 1.55), 0.1);
                Y246 = Math.min(0.055 + 0.015 / Math.pow(vgm + 0.2, 0.87), 0.1);
                break;
            case 5: // Oil bath + PAO
                X246 = Math.min(0.027 + 0.0056 / Math.pow(vgm + 0.15, 1.63), 0.096);
                Y246 = Math.min(0.055 + 0.015 / Math.pow(vgm + 0.2, 0.87), 0.1);
                break;
            case 6: // Oil bath + PEG
            default:
                X246 = Math.min(0.024 + 0.0032 / Math.pow(vgm + 0.1, 1.71), 0.094);
                Y246 = Math.min(0.034 + 0.015 / Math.pow(vgm + 0.19, 0.97), 0.1);
                break;
        }
        const eta0T = (MatTypeW === 2) ? Y246 : X246; // O246
        const etazm = eta0T * YS * YG * YW * YR; // O247
        const roz = (Math.atan(etazm) * 180.0) / Math.PI; // O248
        const etaz = Math.max(
            0.0001,
            (poweredWoWh === 1)
                ? (Math.tan(gama_rad) / Math.tan(((gama + roz) * Math.PI) / 180.0))
                : (Math.tan(((gama - roz) * Math.PI) / 180.0) / Math.tan(gama_rad))
        ); // O249

        const PV0_W = 0.000089 * a * Math.pow(n1, 4.0 / 3.0); // U250
        const PV0 = PV0_W * 0.001; // O250

        const bearingType = parseInt(p.bearingType !== undefined ? p.bearingType : 1); // F251
        const X251 = (0.03 * Pw2 * 1000.0 * Math.pow(a, 0.44) * (z2 / z1)) / dm2;
        const Y251 = (0.013 * Pw2 * 1000.0 * Math.pow(a, 0.44) * (z2 / z1)) / dm2;
        const AG251 = ((Mk2 / i) / etaz) * KA;
        const AH251 = Math.pow((0.83 * 1e7 * Pw2) / etaz / n1, 0.333);
        const ShaftDB2 = Math.pow((0.83 * 1e7 * Pw2) / n2, 0.333); // P405
        const Ftm2 = (2000.0 * T2) / dm2; // U373
        const AF251 = (2000.0 * AG251) / dm1;
        const AE251 = (AF251 * Math.tan((alfan * Math.PI) / 180.0)) / Math.sin(((gama + roz) * Math.PI) / 180.0);
        const AD251 = Math.sqrt(AE251 * AE251 + AF251 * AF251);
        const AC251 = Math.sqrt(AE251 * AE251 + Ftm2 * Ftm2);
        const AA251 = ((AD251 * 0.01 * (AH251 / 1000.0)) / 2.0) * (n1 / 9550.0) * 1000.0 * 2.0;
        const AB251 = ((AC251 * 0.01 * (ShaftDB2 / 1000.0)) / 2.0) * (n2 / 9550.0) * 1000.0 * 2.0;
        const Z251 = AA251 + AB251;
        const PVLP_W = (bearingType === 1) ? X251 : ((bearingType === 2) ? Y251 : Z251); // U251
        const PVLP = PVLP_W * 0.001; // O251

        const PVD_W = 0.00001178 * dm1 * dm1 * n1 * 2.0; // U252
        const PVD = PVD_W * 0.001; // O252

        const PVz_W = ((0.1 * Mk2 * n1) / (z2 / z1)) * (1.0 / etaz - 1.0); // U253
        const PVz = PVz_W * 0.001; // O253

        const PV_W = PVz_W + PV0_W + PVLP_W + PVD_W; // U254
        const PV = PV_W * 0.001; // O254

        const etages = (poweredWoWh === 1) ? (Pw2 / (Pw2 + PV_W / 1000.0)) : ((Pw2 - PV_W / 1000.0) / Pw2); // O255

        // Back-couple Pw1, Mk1, etages_pct, etamax_pct, SelfLock, and Mass (Rows 119, 121, 178-185)
        const Pw1 = (poweredWoWh === 1) ? (Pw2 / etages) : (Pw2 * etages); // T119, O119
        const Mk1 = (poweredWoWh === 1) ? (Mk2 / (i * etages)) : (Mk2 / (i / etages)); // T121, O121
        const etages_pct = etages * 100.0; // O179
        const etamax_pct = (Math.tan(((45.0 - roz / 2.0) * Math.PI) / 180.0) / Math.tan(((45.0 + roz / 2.0) * Math.PI) / 180.0) - (etaz - etages)) * 100.0; // P179

        const Z185 = (MatTypeW === 1) ? 0.13 : ((MatTypeW === 2) ? 0.18 : 0.15);
        const etaStatic = Z185 * Math.sqrt(YS) * YW * YR; // Y185
        const gama_SelfLock = Math.round(((Math.atan(etaStatic) * 180.0) / Math.PI) * 100.0) / 100.0; // X185
        const isSelfLocking = gama <= gama_SelfLock;

        const ShaftDA1 = Math.pow((1.77 * 1e7 * Pw1) / n1, 0.333); // O404
        const ShaftDA2 = Math.pow((1.77 * 1e7 * Pw2) / n2, 0.333); // P404
        const ShaftDB1 = Math.pow((0.83 * 1e7 * Pw1) / n1, 0.333); // O405
        const Flag_d1min = (df1 < ShaftDB1) ? 1 : 0; // U164

        const Ro1 = wormMat.density; // O380
        const Ro2 = wheelMat.density; // P380
        const SK_Proposal = Math.round(mx * 2.0 * 1.001 * 1000.0) / 1000.0; // P301
        const SK = SK_Proposal; // T301
        const mass1 = (((Math.PI * df1 * df1) / 4.0) * (l1 - L / 2.0) + ((Math.PI * d1 * d1) / 4.0) * L + ((Math.PI * df1 * df1) / 4.0) * (l2 - L / 2.0)) * (Ro1 / 1e9); // X179
        const mass2 = Math.PI * b2H * (Math.pow(da2 - ha2, 2) / 4.0 - Math.pow(da2 - 2.0 * (ha2 + hf2) - 2.0 * SK, 2) / 4.0) * (Ro2 / 1e9)
            + (Math.PI * b2H * 0.25 * (Math.pow(da2 - 2.0 * (ha2 + hf2) - SK, 2) / 4.0 - Math.pow(ShaftDB2, 2) / 4.0)
                + Math.PI * b2H * (Math.pow(ShaftDB2 + 3.0 * SK, 2) / 4.0 - Math.pow(ShaftDB2, 2) / 4.0)) * (Ro1 / 1e9)
            + Math.PI * b2H * 2.5 * (Math.pow(ShaftDB2, 2) / 4.0) * (Ro1 / 1e9); // X180
        const GboxArea = (Math.PI * Math.pow(da2 + 4.0 * mn, 2)) / 2.0 + Math.pow(da2 + mn * 4.0, 2)
            + ((Math.PI * (da2 + mn * 4.0)) / 2.0 + da2) * (b2H + mn * 4.0)
            + (l1 + l2) * (da1 + mn * 4.0) * 3.0 + Math.pow(da1 + mn * 4.0, 2) * 2.0; // Y181
        const mass3 = ((GboxArea * Math.sqrt(mn) * 5.0) / 1e9) * 7250.0; // X181
        const mass_gears = mass1 + mass2; // P178
        const mass = mass1 + mass2 + mass3; // O178

        // 12.0 Dimensions of Cylindrical Wormgearing (AGMA 6022-C93) (Rows 334-344)
        const NW = z1; // O334
        const NG = z2; // P334
        const mG = i; // O335
        const C_agma = a / 25.4; // O336
        const d_LC = d1 / 25.4; // O338
        const D_UC = 2.0 * C_agma - d_LC; // P338
        const pitchx = (Math.PI * D_UC) / NG; // P336
        const dmin_agma = Math.round((Math.pow(C_agma, 0.875) / 3.0) * 1000.0) / 1000.0;
        const dmax_agma = Math.round((Math.pow(C_agma, 0.875) / 1.6) * 1000.0) / 1000.0;
        const d_rec_agma_str = `${dmin_agma} - ${dmax_agma}`; // O337
        const Lead_agma = NW * pitchx; // O339
        const leadAngle_agma = (Math.atan(Lead_agma / (Math.PI * d_LC)) * 180.0) / Math.PI; // P339
        const addendum_agma = pitchx / Math.PI; // O340
        const dedendum_agma = (pitchx > 0.16) ? ((1.157 * pitchx) / Math.PI) : ((1.2 * pitchx) / Math.PI + 0.002); // P340
        const Dt_agma = D_UC + 2.0 * addendum_agma; // P342
        const do1_agma = d_LC + 2.0 * addendum_agma; // O341
        const Do2_agma = Dt_agma + addendum_agma; // P341
        const dr_agma = d_LC - 2.0 * dedendum_agma; // O342
        const clearance_agma = dedendum_agma - addendum_agma; // O343
        const FWmax_agma = 2.0 * Math.sqrt(Math.max(0.0, Math.pow(Dt_agma / 2.0, 2) - Math.pow(D_UC / 2.0 - addendum_agma, 2))); // O344
        const FG_agma = 1.125 * Math.sqrt(Math.max(0.0, Math.pow(do1_agma + 2.0 * clearance_agma, 2) - Math.pow(do1_agma - 4.0 * addendum_agma, 2))); // P344
        const FWmax_agma_mm = FWmax_agma * 25.4; // T344
        const FG_agma_mm = FG_agma * 25.4; // U344

        // Peripheral speeds v1, v2 (Row 372)
        const v1 = ((Math.PI * d1) / 1000.0) * (n1 / 60.0); // O372
        const v2 = ((Math.PI * d2) / 1000.0) * (n2 / 60.0); // P372

        // 16.0 Calculation of Gearing for Given Axis Distance (Rows 397-400)
        const z1_req = Math.max(1, parseInt(p.z1_req !== undefined ? p.z1_req : 1)); // O397
        const z2_req = Math.max(5, parseInt(p.z2_req !== undefined ? p.z2_req : 50)); // P397
        const a_req = (p.a_req !== undefined && p.a_req !== null && String(p.a_req).trim() !== '') ? parseFloat(p.a_req) : 180.0; // O398
        const axisDistSolutions = this.computeAxisDistTable(z1_req, z2_req, a_req, toothType);

        // 18.0 Auxiliary Calculations (Rows 408-410)
        const XX_z1 = (p.XX_z1 !== undefined && String(p.XX_z1).trim() !== '') ? parseFloat(p.XX_z1) : 2.0; // O408
        const XX_z2 = (p.XX_z2 !== undefined && String(p.XX_z2).trim() !== '') ? parseFloat(p.XX_z2) : 41.0; // P408
        const XXX_i = XX_z2 / (XX_z1 || 1.0); // R408
        const XX_n1 = (p.XX_n1 !== undefined && String(p.XX_n1).trim() !== '') ? parseFloat(p.XX_n1) : 1600.0; // O409
        const XX_n2_ratio = (p.XX_n2_ratio !== undefined && String(p.XX_n2_ratio).trim() !== '') ? parseFloat(p.XX_n2_ratio) : 80.0; // P409
        const XX_i = XX_n1 / (XX_n2_ratio || 1.0); // R409
        const XX_Mk2 = (p.XX_Mk2 !== undefined && String(p.XX_Mk2).trim() !== '') ? parseFloat(p.XX_Mk2) : 300.0; // O410
        const XX_n2 = (p.XX_n2 !== undefined && String(p.XX_n2).trim() !== '') ? parseFloat(p.XX_n2) : 3.75; // P410
        const XX_Pw2 = (XX_Mk2 * XX_n2) / 9550.0; // R410

        // 19.0 Graphical Output, CAD Systems & DXFTables (Rows 412-427, DXFTables!B2:D29)
        const Shaft_ds_prop = Math.round((df1 - mn) * 10.0) / 10.0; // X416
        const Shaft_th_prop = Math.round((mn / 4.0) * 10.0) / 10.0; // X417
        const dstFlag = (p.dstFlag !== undefined) ? Boolean(p.dstFlag) : true; // B416
        const Shaft_ds = dstFlag ? Shaft_ds_prop : ((p.Shaft_ds !== undefined && String(p.Shaft_ds).trim() !== '') ? parseFloat(p.Shaft_ds) : Shaft_ds_prop); // O416
        const Shaft_th = dstFlag ? Shaft_th_prop : ((p.Shaft_th !== undefined && String(p.Shaft_th).trim() !== '') ? parseFloat(p.Shaft_th) : Shaft_th_prop); // P416
        const DXF_Beta = (p.DXF_Beta !== undefined && String(p.DXF_Beta).trim() !== '') ? parseFloat(p.DXF_Beta) : 10.0; // O417
        const DXF_AutoScale = a / 100.0; // X415

        const ABOM01 = "Worm gear - Worm";
        const ABOM02 = `z1=${z1}, mn=${Math.round(mn * 100.0) / 100.0}`;
        const ABOM03 = `Material: ${wormMat.designation}`;
        const BBOM01 = "Worm gear - Gear";
        const BBOM02 = `z2=${z2}, mn=${Math.round(mn * 100.0) / 100.0}`;
        const BBOM03 = `Material: ${wheelMat.designation}`;

        // DXFTables values (DXFTables!D4:D29)
        const dxf_worm_m = mn; // D4
        const dxf_worm_z1 = z1; // D5
        const dxf_worm_alfa = alfa0; // D6
        const dxf_worm_d1 = Math.round(d1 * 1000.0) / 1000.0; // D7
        const dxf_worm_da1 = Math.round(da1 * 1000.0) / 1000.0; // D8
        const dxf_worm_L = Math.round(L_Input * 1000.0) / 1000.0; // D9
        const dxf_worm_mat = wormMat.designation; // C11
        const dxf_worm_a = Math.round(a * 1000.0) / 1000.0; // D12
        const dxf_worm_z2 = z2; // D14

        const dxf_wheel_m = mn; // D18
        const dxf_wheel_z2 = z2; // D19
        const dxf_wheel_alfa = alfa0; // D20
        const dxf_wheel_d2 = Math.round(d2 * 1000.0) / 1000.0; // D21
        const dxf_wheel_da2 = Math.round(da2 * 1000.0) / 1000.0; // D22
        const dxf_wheel_b2H = Math.round(b2H_Input * 1000.0) / 1000.0; // D23
        const dxf_wheel_x2 = Math.round(x2 * 1000.0) / 1000.0; // D24
        const dxf_wheel_mat = wheelMat.designation; // C26
        const dxf_wheel_a = Math.round(a * 1000.0) / 1000.0; // D27
        const dxf_wheel_z1 = z1; // D29

        // 32 MITCalc 1.74 3D CAD Parameters (Calculation!A1:AF4 exported by MTC_3D.bas!Output3D)
        const MC_a = a;                                                 // A2: =_a
        const MC_px = px;                                               // B2: =_px
        const MC_pxn = px * z1;                                         // C2: =_px*_z1
        const MC_alfa = alfax;                                          // D2: =_alfax
        const MC_z1 = z1;                                               // E2: =_z1
        const MC_z1sw = (z1 < 2) ? 2 : z1;                              // F2: =IF(_z1<2,2,_z1)
        const MC_arrang = (z1 === 1) ? 0.001 : 360.0;                   // G2: =IF(_z1=1,0.001,360)
        const MC_L = L;                                                 // H2: =_L
        const MC_da1 = da1;                                             // I2: =_da1
        const MC_d1 = d1;                                               // J2: =_d1
        const MC_df1 = df1;                                             // K2: =_df1
        const MC_sn1 = sn1 / 2.0;                                       // L2: =_sn1/2
        const MC_sx1 = sx1 / 2.0;                                       // M2: =_sx1/2
        const MC_en1 = en1 / 2.0;                                       // N2: =_en1/2
        const MC_ex1 = ex1 / 2.0;                                       // O2: =_ex1/2
        const MC_ds1 = Shaft_ds;                                        // P2: =_Shaft_ds
        const MC_t1 = Shaft_th;                                         // Q2: =_Shaft_th
        const MC_beta1 = (DXF_Beta < 0.001) ? 0.001 : DXF_Beta;         // R2: =IF(_DXF_Beta<0.001,0.001,_DXF_Beta)
        const MC_z2 = z2;                                               // S2: =_z2
        const MC_b2H = b2H;                                             // T2: =_b2H
        const MC_da2 = da2;                                             // U2: =_da2
        const MC_d2 = d2;                                               // V2: =_d2
        const MC_df2 = df2;                                             // W2: =_df2
        const MC_de2 = de2;                                             // X2: =_de2
        const MC_sn2 = sn2 / 2.0;                                       // Y2: =_sn2/2
        const MC_sx2 = sx2 / 2.0;                                       // Z2: =_sx2/2
        const MC_en2 = en2 / 2.0;                                       // AA2: =_en2/2
        const MC_ex2 = ex2 / 2.0;                                       // AB2: =_ex2/2
        const MC_d1cutmin = 2.0 * (a - da2 / 2.0);                      // AC2: =2*(_a-_da2/2)
        const MC_d1cut = 2.0 * (a - d2 / 2.0);                          // AD2: =2*(_a-_d2/2)
        const MC_d1cutmax = 2.0 * (a - df2 / 2.0);                      // AE2: =2*(_a-_df2/2)
        const MC_pxnhalf = (px * z1) / 2.0;                             // AF2: =_px*_z1/2

        const MC_3D = {
            MC_a, MC_px, MC_pxn, MC_alfa, MC_z1, MC_z1sw, MC_arrang, MC_L,
            MC_da1, MC_d1, MC_df1, MC_sn1, MC_sx1, MC_en1, MC_ex1, MC_ds1, MC_t1, MC_beta1,
            MC_z2, MC_b2H, MC_da2, MC_d2, MC_df2, MC_de2, MC_sn2, MC_sx2, MC_en2, MC_ex2,
            MC_d1cutmin, MC_d1cut, MC_d1cutmax, MC_pxnhalf
        };

        // Data1 coordinates for Section 4.0 Dynamic Plot (Chart 1963)
        const BeSi = Math.min(
            Math.min(
                Math.max(
                    (1.0 + (0.001 * (Ftm2 / 2.0) + 0.8 * Math.pow(Ftm2 / 2.0, 0.33))) * (1.0 + 0.000051 * Math.pow(n1, 1.19)),
                    4.0
                ),
                200.0
            ) / 2.0,
            d2 / 4.0
        ); // Data1!F45
        const chartData1 = this.computeChartData1({
            a, da1, d1, df1, da2, d2, df2, L, b2H, l1, l2, BeSi
        });

        return {
            // Section 1.0
            poweredWoWh, Pw1, Pw2, n1, n2, Mk1, Mk2, iin, i, i_dev, i_dev_pct,
            // Section 2.0 & 15.0
            matP, matW, wormMat, wheelMat, MatTypeW,
            Ro1, Ro2,
            E1: wormMat.elasticModulus, E2: wheelMat.elasticModulus,
            Rm1: wormMat.rm, Rm2: wheelMat.rm,
            Rp02_1: wormMat.rp02, Rp02_2: wheelMat.rp02,
            Poison1: wormMat.poissonRatio, Poison2: wheelMat.poissonRatio,
            SHlim1: wormMat.shlim, SHlim2: wheelMat.shlim,
            SFlim1: wormMat.sflim, SFlim2: wheelMat.sflim,
            VHV1: wormMat.vhv, VHV2: wheelMat.surfaceHardnessHV,
            JHV1: wormMat.jhv, JHV2: wheelMat.coreHardnessHV,
            toothType, loadTypeA, loadTypeB, designCooling, oilType, lubricant,
            ny40, ny100, rooil15, Ra1, kaFlag, KA, KA_Prop, Lh,
            // Section 3.0
            haXP, haXG, caXP, caXG, rf1Flag, rf1_rec, rf1, rf2,
            // Section 4.0
            z1, z2, alfa_temp, alfa0, calc_q, q, q_calc, q_rec,
            d1_Input, d1, d1_calc, d1_rec, Flag_d1min,
            gama, gama_calc, gama_SelfLock, etaStatic, isSelfLocking,
            teethOrientation, m_Input, m_temp, CP, DP,
            l1_proc, l2_proc, l1_Units, l2_Units, l1l2_flag, l1_input, l2_input, l1, l2,
            FlagL, L_Proposal, L_Input, L,
            Flagb2H, b2H_Proposal, b2H_Input, b2H,
            x1, x2, z2minTh, z2minPr, xmin, Flag_z2min,
            a_req1_Input, a_req1, x_for_a, amin_dx, amax_dx, m_for_a, q_for_a, amin_q, amax_q,
            mass1, mass2, mass3, mass_gears, mass,
            etages_pct, etamax_pct,
            // Section 5.0 (DIN 3975)
            mn, mt, mx, pn, pt, px, alfan, alfat, alfax,
            da1, da2, d2, df1, df2, dw1, dw2, dm1, dm2,
            de2Flag, de2min, de2max, de2Prop, de2Input, de2, de2_range_str,
            ha1, ha2, hf1, hf2, a, gamaw, gamab,
            sn1, sn2, sx1, sx2, en1, en2, ex1, ex2,
            // Section 6.0 (DIN 3996 Efficiency & Losses)
            vgm, YS, h_x, YG, YW, YR, lubricationIndex, eta0T, etazm, roz, etaz,
            PV0, PV0_W, bearingType, PVLP, PVLP_W, PVD, PVD_W, PVz, PVz_W, PV, PV_W, etages,
            v1, v2,
            // Section 12.0 (AGMA 6022-C93)
            NW, NG, mG, C_agma, pitchx, dmin_agma, dmax_agma, d_rec_agma_str,
            d_LC, D_UC, Lead_agma, leadAngle_agma, addendum_agma, dedendum_agma,
            do1_agma, Do2_agma, dr_agma, Dt_agma, clearance_agma,
            FWmax_agma, FG_agma, FWmax_agma_mm, FG_agma_mm,
            // Section 16.0 (Axis Distance Table)
            z1_req, z2_req, a_req, axisDistSolutions,
            // Section 17.0 (Shaft Diameters helper)
            ShaftDA1, ShaftDA2, ShaftDB1, ShaftDB2,
            // Section 18.0 (Auxiliary Calculations)
            XX_z1, XX_z2, XXX_i, XX_n1, XX_n2_ratio, XX_i, XX_Mk2, XX_n2, XX_Pw2,
            // Section 19.0 (CAD & DXFTables)
            dstFlag, Shaft_ds_prop, Shaft_th_prop, Shaft_ds, Shaft_th, DXF_Beta, DXF_AutoScale,
            ABOM01, ABOM02, ABOM03, BBOM01, BBOM02, BBOM03,
            dxf_worm_m, dxf_worm_z1, dxf_worm_alfa, dxf_worm_d1, dxf_worm_da1, dxf_worm_L, dxf_worm_mat, dxf_worm_a, dxf_worm_z2,
            dxf_wheel_m, dxf_wheel_z2, dxf_wheel_alfa, dxf_wheel_d2, dxf_wheel_da2, dxf_wheel_b2H, dxf_wheel_x2, dxf_wheel_mat, dxf_wheel_a, dxf_wheel_z1,
            // 32 MITCalc 1.74 3D CAD Parameters (Calculation!A1:AF4)
            MC_a, MC_px, MC_pxn, MC_alfa, MC_z1, MC_z1sw, MC_arrang, MC_L,
            MC_da1, MC_d1, MC_df1, MC_sn1, MC_sx1, MC_en1, MC_ex1, MC_ds1, MC_t1, MC_beta1,
            MC_z2, MC_b2H, MC_da2, MC_d2, MC_df2, MC_de2, MC_sn2, MC_sx2, MC_en2, MC_ex2,
            MC_d1cutmin, MC_d1cut, MC_d1cutmax, MC_pxnhalf, MC_3D,
            // Chart 1963 Data1
            BeSi, chartData1
        };
    },

    // Exact reproduction of VBA AxisDistTbl (GearFunctions.bas lines 757-835)
    computeAxisDistTable(z1_req, z2_req, a_req, toothType) {
        const modules = (typeof WORM_STD_TABLES !== 'undefined' && WORM_STD_TABLES.T_Module_Excel21)
            ? WORM_STD_TABLES.T_Module_Excel21
            : [0.5, 0.6, 0.8, 1.0, 1.25, 1.6, 2.0, 2.5, 3.15, 4.0, 5.0, 6.3, 8.0, 10.0, 12.5, 16.0, 20.0, 25.0, 32.0, 40.0, 50.0];
        const qList = (typeof WORM_STD_TABLES !== 'undefined' && WORM_STD_TABLES.T_Diam_q)
            ? WORM_STD_TABLES.T_Diam_q
            : [6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0, 9.5, 10.0, 11.0, 12.0, 13.0, 14.0, 16.0, 18.0, 20.0, 22.0, 25.0];

        const solutions = [];
        const PI_VBA = 3.141592653;
        for (let z2_c = z2_req - 1; z2_c <= z2_req + 1; z2_c++) {
            if (z2_c < 1) continue;
            for (let m_idx = 0; m_idx < modules.length; m_idx++) {
                const m_c = modules[m_idx];
                for (let q_idx = 0; q_idx < qList.length; q_idx++) {
                    const q_c = qList[q_idx];
                    const gama_c = (Math.atan(z1_req / q_c) * 180.0) / PI_VBA;
                    const gama_rad_c = (gama_c * PI_VBA) / 180.0;
                    let X;
                    if (toothType === 1) {
                        X = a_req / m_c - 0.5 * q_c - 0.5 * z2_c;
                    } else {
                        X = a_req / m_c - (0.5 * z1_req) / Math.sin(gama_rad_c) - (0.5 * z2_c) / Math.cos(gama_rad_c);
                    }
                    if (X >= -0.5 && X <= 1.0) {
                        const dp_c = 25.4 / m_c;
                        const i_c = z2_c / z1_req;
                        solutions.push({
                            id: solutions.length + 1,
                            z1: z1_req,
                            z2: z2_c,
                            m: m_c,
                            dp: dp_c,
                            q: q_c,
                            i: i_c,
                            x2: X,
                            label: `z1=${z1_req} | z2=${z2_c} | m=${m_c.toFixed(2)} | DP=${dp_c.toFixed(2)} | q=${q_c.toFixed(2)} | i=${i_c.toFixed(2)} | x=${X.toFixed(4)}`
                        });
                    }
                }
            }
        }
        return solutions;
    },

    // Exact reproduction of Data1!C3:J86 for Section 4.0 Dynamic Plot (Chart 1963)
    computeChartData1(g) {
        const { a, da1, d1, df1, da2, d2, L, b2H, l1, l2, BeSi } = g;
        const C3 = -Math.max(da2 * 0.55, l1 + df1 * 0.6);
        const C9 = Math.max(da2 * 0.55, l2 + BeSi) + 1.0 * da1;
        const C4 = C9 + 0.6 * da1;
        const D7 = da2 * 0.55;
        const D8 = -a - df1;
        const C11 = -l1;
        const D11 = -a + df1 / 2.0 + BeSi * 2.0;
        const D12 = -a - df1 / 2.0 - BeSi * 2.0;
        const C13 = l2;

        // Axis segments (Data1!C3:D14)
        const axisLines = [
            [{ x: C3, y: 0.0 }, { x: C4, y: 0.0 }],
            [{ x: C4, y: -a }, { x: C3, y: -a }],
            [{ x: 0.0, y: D7 }, { x: 0.0, y: D8 }],
            [{ x: C9, y: D8 }, { x: C9, y: D7 }],
            [{ x: C11, y: D11 }, { x: C11, y: D12 }],
            [{ x: C13, y: D12 }, { x: C13, y: D11 }]
        ];

        // Worm shaft outline (Data1!C45:D57)
        const C45 = -L / 2.0;
        const D45 = -a + df1 / 2.0;
        const C46 = -l1 - BeSi;
        const D47 = D45 - df1;
        const D49 = -a - da1 / 2.0;
        const C50 = L / 2.0;
        const D51 = D49 + da1;
        const C55 = l2 + BeSi;

        const shaftPolyline = [
            { x: C45, y: D45 },
            { x: C46, y: D45 },
            { x: C46, y: D47 },
            { x: C45, y: D47 },
            { x: C45, y: D49 },
            { x: C50, y: D49 },
            { x: C50, y: D51 },
            { x: C45, y: D51 },
            { x: C45, y: D47 },
            { x: C50, y: D45 },
            { x: C55, y: D45 },
            { x: C55, y: D47 },
            { x: C50, y: D47 }
        ];

        // Wheel side rectangle (Data1!C60:D64)
        const C60 = C9 - b2H / 2.0;
        const C62 = C9 + b2H / 2.0;
        const D60 = da2 / 2.0;
        const wheelBox = [
            { x: C60, y: D60 },
            { x: C60, y: -D60 },
            { x: C62, y: -D60 },
            { x: C62, y: D60 },
            { x: C60, y: D60 }
        ];

        // 4 Bearing boxes (Data1!C67:D86)
        const C67 = C11 + BeSi;
        const D67 = D45 + df1 / 10.0;
        const D68 = D67 + BeSi * 2.0;
        const C69 = C11 - BeSi;
        const D72 = D47 - df1 / 10.0;
        const D73 = D72 - BeSi * 2.0;
        const C77 = C13 - BeSi;
        const C79 = C13 + BeSi;

        const bearingBoxes = [
            [{ x: C67, y: D67 }, { x: C67, y: D68 }, { x: C69, y: D68 }, { x: C69, y: D67 }, { x: C67, y: D67 }],
            [{ x: C67, y: D72 }, { x: C67, y: D73 }, { x: C69, y: D73 }, { x: C69, y: D72 }, { x: C67, y: D72 }],
            [{ x: C77, y: D67 }, { x: C77, y: D68 }, { x: C79, y: D68 }, { x: C79, y: D67 }, { x: C77, y: D67 }],
            [{ x: C77, y: D72 }, { x: C77, y: D73 }, { x: C79, y: D73 }, { x: C79, y: D72 }, { x: C77, y: D72 }]
        ];

        return {
            C3, C4, C9, D7, D8, D11, D12,
            wheelCenter: { x: 0.0, y: 0.0, r_da2: da2 / 2.0, r_d2: d2 / 2.0 },
            wormSideCenter: { x: C9, y: -a, r_da1: da1 / 2.0, r_d1: d1 / 2.0 },
            axisLines,
            shaftPolyline,
            wheelBox,
            bearingBoxes
        };
    }
};

if (typeof window !== 'undefined') {
    window.WormCalcEngine = WormCalcEngine;
}



/**
 * MITCalc Web App - Worm Gear 2D CAD Canvas, Dynamic Chart 1963 & DXF R12 Exporter (Module 3)
 * 100% Client-Side Offline Rendering (DIN 3975 / DIN 3996 / DXF.bas 1-to-1)
 */

class WormCanvasRenderer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
        this.sec4Canvas = document.getElementById('wormSec4ChartCanvas');
        this.sec4Ctx = this.sec4Canvas ? this.sec4Canvas.getContext('2d') : null;

        this.geom = null;
        this.viewMode = 'assembly'; // 'assembly' | 'worm' | 'wheel' | 'normal_profile' | 'tangential_profile'
        this.showWorm = true;
        this.showWheel = true;
        this.zoom = 1.0;
        this.panX = 0;
        this.panY = 0;
        this.showGrid = true;
        this.showDims = true;

        this.isPlaying = false;
        this.animSpeed = 1.0;
        this.animPhase = 0.0; // Worm rotation angle in radians
        this.lastFrameTime = 0;
        this.animFrameId = null;

        this.isDragging = false;
        this.dragStartX = 0;
        this.dragStartY = 0;
        this.lastPinchDist = null;

        if (this.canvas) {
            this.initInteractions();
        }
    }

    initInteractions() {
        this.canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            const factor = e.deltaY < 0 ? 1.12 : 0.89;
            this.zoom = Math.max(0.25, Math.min(8.0, this.zoom * factor));
            this.render();
        }, { passive: false });

        this.canvas.addEventListener('mousedown', (e) => {
            this.isDragging = true;
            this.dragStartX = e.clientX - this.panX;
            this.dragStartY = e.clientY - this.panY;
        });

        window.addEventListener('mousemove', (e) => {
            if (!this.isDragging) return;
            this.panX = e.clientX - this.dragStartX;
            this.panY = e.clientY - this.dragStartY;
            this.render();
        });

        window.addEventListener('mouseup', () => {
            this.isDragging = false;
        });

        // Mobile Multi-Touch (Rule 11)
        this.canvas.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                this.isDragging = true;
                this.dragStartX = e.touches[0].clientX - this.panX;
                this.dragStartY = e.touches[0].clientY - this.panY;
            } else if (e.touches.length === 2) {
                this.isDragging = false;
                const dx = e.touches[0].clientX - e.touches[1].clientX;
                const dy = e.touches[0].clientY - e.touches[1].clientY;
                this.lastPinchDist = Math.hypot(dx, dy);
            }
        }, { passive: true });

        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (e.touches.length === 1 && this.isDragging) {
                this.panX = e.touches[0].clientX - this.dragStartX;
                this.panY = e.touches[0].clientY - this.dragStartY;
                this.render();
            } else if (e.touches.length === 2 && this.lastPinchDist) {
                const dx = e.touches[0].clientX - e.touches[1].clientX;
                const dy = e.touches[0].clientY - e.touches[1].clientY;
                const dist = Math.hypot(dx, dy);
                const ratio = dist / this.lastPinchDist;
                this.zoom = Math.max(0.25, Math.min(8.0, this.zoom * ratio));
                this.lastPinchDist = dist;
                this.render();
            }
        }, { passive: false });

        this.canvas.addEventListener('touchend', () => {
            this.isDragging = false;
            this.lastPinchDist = null;
        });
    }

    updateGeometry(geom) {
        this.geom = geom;
        this.renderSec4Chart();
        this.render();
    }

    resetView() {
        this.zoom = 1.0;
        this.panX = 0;
        this.panY = 0;
        this.render();
    }

    toggleAnimation() {
        this.isPlaying = !this.isPlaying;
        if (this.isPlaying) {
            this.lastFrameTime = performance.now();
            const loop = (now) => {
                if (!this.isPlaying) return;
                const dt = (now - this.lastFrameTime) / 1000.0;
                this.lastFrameTime = now;
                this.animPhase += dt * 3.0 * this.animSpeed;
                this.render();
                this.animFrameId = requestAnimationFrame(loop);
            };
            this.animFrameId = requestAnimationFrame(loop);
        } else if (this.animFrameId) {
            cancelAnimationFrame(this.animFrameId);
        }
        return this.isPlaying;
    }

    // =========================================================================
    // SECTION 4.0 DYNAMIC PLOT (1-to-1 Reproduction of Chart 1963 / Data1)
    // =========================================================================
    renderSec4Chart() {
        if (!this.sec4Canvas || !this.sec4Ctx || !this.geom || !this.geom.chartData1) return;
        const ctx = this.sec4Ctx;
        const W = this.sec4Canvas.width;
        const H = this.sec4Canvas.height;
        const d1 = this.geom.chartData1;

        ctx.clearRect(0, 0, W, H);
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, W, H);

        // Compute bounds from Data1 points
        const minX = Math.min(d1.C3, -this.geom.l1 - this.geom.BeSi) * 1.12;
        const maxX = Math.max(d1.C4, d1.C9 + this.geom.da1 * 0.65) * 1.08;
        const minY = Math.min(d1.D8, d1.D12, -this.geom.a - this.geom.BeSi * 2.5 - this.geom.df1 * 0.6) * 1.1;
        const maxY = Math.max(d1.D7, this.geom.da2 * 0.58) * 1.12;

        const padL = 44, padR = 18, padT = 20, padB = 32;
        const plotW = W - padL - padR;
        const plotH = H - padT - padB;

        const spanX = Math.max(10, maxX - minX);
        const spanY = Math.max(10, maxY - minY);
        const scale = Math.min(plotW / spanX, plotH / spanY);

        const cxWorld = (minX + maxX) / 2.0;
        const cyWorld = (minY + maxY) / 2.0;
        const cxScr = padL + plotW / 2.0;
        const cyScr = padT + plotH / 2.0;

        const toX = (wx) => cxScr + (wx - cxWorld) * scale;
        const toY = (wy) => cyScr - (wy - cyWorld) * scale;

        // Nice grid step
        const rawStep = Math.max(spanX, spanY) / 6.0;
        const mag = Math.pow(10, Math.floor(Math.log10(rawStep)));
        const norm = rawStep / mag;
        const step = (norm <= 2 ? 2 : (norm <= 5 ? 5 : 10)) * mag;

        // Draw grid
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.16)';
        ctx.lineWidth = 1;
        ctx.fillStyle = '#94a3b8';
        ctx.font = '10px Inter, sans-serif';

        const startX = Math.ceil((cxWorld - (plotW / 2) / scale) / step) * step;
        const endX = Math.floor((cxWorld + (plotW / 2) / scale) / step) * step;
        for (let gx = startX; gx <= endX; gx += step) {
            const sx = toX(gx);
            ctx.beginPath();
            ctx.moveTo(sx, padT);
            ctx.lineTo(sx, H - padB);
            ctx.stroke();
            ctx.textAlign = 'center';
            ctx.fillText(Math.round(gx).toString(), sx, H - padB + 14);
        }

        const startY = Math.ceil((cyWorld - (plotH / 2) / scale) / step) * step;
        const endY = Math.floor((cyWorld + (plotH / 2) / scale) / step) * step;
        for (let gy = startY; gy <= endY; gy += step) {
            const sy = toY(gy);
            ctx.beginPath();
            ctx.moveTo(padL, sy);
            ctx.lineTo(W - padR, sy);
            ctx.stroke();
            ctx.textAlign = 'right';
            ctx.fillText(Math.round(gy).toString(), padL - 6, sy + 3);
        }

        // Border box
        ctx.strokeStyle = '#334155';
        ctx.strokeRect(padL, padT, plotW, plotH);

        // 1. Axis lines (Data1!C3:D14)
        ctx.save();
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 1.2;
        ctx.setLineDash([8, 4, 2, 4]);
        d1.axisLines.forEach(seg => {
            ctx.beginPath();
            ctx.moveTo(toX(seg[0].x), toY(seg[0].y));
            ctx.lineTo(toX(seg[1].x), toY(seg[1].y));
            ctx.stroke();
        });
        ctx.restore();

        // 2. Wheel Circles da2 (solid cyan) and d2 (dashed amber) at (0,0)
        ctx.save();
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        ctx.arc(toX(0), toY(0), d1.wheelCenter.r_da2 * scale, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 1.2;
        ctx.setLineDash([5, 4]);
        ctx.beginPath();
        ctx.arc(toX(0), toY(0), d1.wheelCenter.r_d2 * scale, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        // 3. Worm Side Circles da1 and d1 at (C9, -a)
        ctx.save();
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        ctx.arc(toX(d1.wormSideCenter.x), toY(d1.wormSideCenter.y), d1.wormSideCenter.r_da1 * scale, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 1.2;
        ctx.setLineDash([4, 3]);
        ctx.beginPath();
        ctx.arc(toX(d1.wormSideCenter.x), toY(d1.wormSideCenter.y), d1.wormSideCenter.r_d1 * scale, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        // 4. Wheel Side Box (Data1!C60:D64)
        ctx.save();
        ctx.fillStyle = 'rgba(56, 189, 248, 0.12)';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        d1.wheelBox.forEach((pt, idx) => {
            if (idx === 0) ctx.moveTo(toX(pt.x), toY(pt.y));
            else ctx.lineTo(toX(pt.x), toY(pt.y));
        });
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        // 5. Worm Shaft Polyline (Data1!C45:D57)
        ctx.save();
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        d1.shaftPolyline.forEach((pt, idx) => {
            if (idx === 0) ctx.moveTo(toX(pt.x), toY(pt.y));
            else ctx.lineTo(toX(pt.x), toY(pt.y));
        });
        ctx.stroke();
        ctx.restore();

        // 6. Bearing Boxes (Data1!C67:D86)
        ctx.save();
        ctx.fillStyle = 'rgba(245, 158, 11, 0.18)';
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 1.5;
        d1.bearingBoxes.forEach(box => {
            ctx.beginPath();
            box.forEach((pt, idx) => {
                if (idx === 0) ctx.moveTo(toX(pt.x), toY(pt.y));
                else ctx.lineTo(toX(pt.x), toY(pt.y));
            });
            ctx.fill();
            ctx.stroke();
            // Draw X diagonal inside bearing box
            ctx.beginPath();
            ctx.moveTo(toX(box[0].x), toY(box[0].y));
            ctx.lineTo(toX(box[2].x), toY(box[2].y));
            ctx.moveTo(toX(box[1].x), toY(box[1].y));
            ctx.lineTo(toX(box[3].x), toY(box[3].y));
            ctx.stroke();
        });
        ctx.restore();
    }

    // =========================================================================
    // TAB 2 MAIN INTERACTIVE 2D CAD CANVAS
    // =========================================================================
    render() {
        if (!this.canvas || !this.ctx || !this.geom) return;
        const ctx = this.ctx;
        const W = this.canvas.width;
        const H = this.canvas.height;
        const g = this.geom;

        ctx.clearRect(0, 0, W, H);
        ctx.fillStyle = '#0b1120';
        ctx.fillRect(0, 0, W, H);

        if (this.showGrid) {
            this.drawBackgroundGrid(ctx, W, H);
        }

        if (this.viewMode === 'assembly') {
            this.renderAssemblyView(ctx, W, H, g);
        } else if (this.viewMode === 'worm') {
            this.renderWormDetailView(ctx, W, H, g);
        } else if (this.viewMode === 'wheel') {
            this.renderWheelDetailView(ctx, W, H, g);
        } else if (this.viewMode === 'normal_profile') {
            this.renderNormalProfileView(ctx, W, H, g);
        } else if (this.viewMode === 'axial_profile') {
            this.renderAxialProfileView(ctx, W, H, g);
        } else if (this.viewMode === 'tangential_profile') {
            this.renderTangentialProfileView(ctx, W, H, g);
        }

        this.drawHUD(ctx, W, H, g);
    }

    drawBackgroundGrid(ctx, W, H) {
        ctx.save();
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.08)';
        ctx.lineWidth = 1;
        const step = 40;
        for (let x = 0; x < W; x += step) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, H);
            ctx.stroke();
        }
        for (let y = 0; y < H; y += step) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(W, y);
            ctx.stroke();
        }
        ctx.restore();
    }

    renderAssemblyView(ctx, W, H, g) {
        // Compute world bounding box of Dual View (Front View at x=0, Side Throat Section at x=C9)
        const d1Chart = g.chartData1;
        const minX = Math.min(-g.da2 * 0.6, -g.l1 - g.BeSi * 1.5);
        const maxX = d1Chart.C9 + Math.max(g.b2H, g.da1) * 0.9;
        const minY = -g.a - g.da1 * 0.85;
        const maxY = g.de2 * 0.6;

        const spanX = Math.max(20, maxX - minX);
        const spanY = Math.max(20, maxY - minY);
        const baseScale = Math.min((W * 0.82) / spanX, (H * 0.80) / spanY);
        const scale = baseScale * this.zoom;

        const cxWorld = (minX + maxX) / 2.0;
        const cyWorld = (minY + maxY) / 2.0;
        const cxScr = W / 2.0 + this.panX;
        const cyScr = H / 2.0 + this.panY;

        const toX = (wx) => cxScr + (wx - cxWorld) * scale;
        const toY = (wy) => cyScr - (wy - cyWorld) * scale;

        // 1. Centerlines
        ctx.save();
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 1.1;
        ctx.setLineDash([10, 4, 2, 4]);
        // Wheel horizontal axis
        ctx.beginPath();
        ctx.moveTo(toX(minX), toY(0));
        ctx.lineTo(toX(maxX), toY(0));
        ctx.stroke();
        // Worm horizontal axis at y = -a
        ctx.beginPath();
        ctx.moveTo(toX(minX), toY(-g.a));
        ctx.lineTo(toX(maxX), toY(-g.a));
        ctx.stroke();
        // Front vertical axis at x = 0
        ctx.beginPath();
        ctx.moveTo(toX(0), toY(maxY));
        ctx.lineTo(toX(0), toY(minY));
        ctx.stroke();
        // Side vertical axis at x = C9
        ctx.beginPath();
        ctx.moveTo(toX(d1Chart.C9), toY(maxY));
        ctx.lineTo(toX(d1Chart.C9), toY(minY));
        ctx.stroke();
        ctx.restore();

        // 2. Left View: Worm Wheel (with animated conjugate teeth) + Horizontal Worm Thread Rack
        if (this.showWheel) this.drawAnimatedWheelFront(ctx, toX(0), toY(0), scale, g);
        if (this.showWorm) this.drawHorizontalWormFront(ctx, toX, toY, scale, 0, -g.a, g);

        // 3. Right View: Worm Wheel Throat Section (exact DXF.bas WWheel) + Worm Cross Section at (C9, -a)
        if (this.showWheel) this.drawWheelThroatSection(ctx, toX, toY, scale, d1Chart.C9, 0, g);
        if (this.showWorm) this.drawWormCrossSection(ctx, toX(d1Chart.C9), toY(-g.a), scale, g);

        // 4. Dimension Callouts
        if (this.showDims) {
            this.drawDimLine(ctx, toX(-g.da2 * 0.58), toY(0), toX(-g.da2 * 0.58), toY(-g.a), `a = ${g.a.toFixed(2)} mm`, -14);
            this.drawDimLine(ctx, toX(-g.L / 2), toY(-g.a - g.da1 * 0.65), toX(g.L / 2), toY(-g.a - g.da1 * 0.65), `L = ${g.L.toFixed(2)} mm`, 16);
            this.drawDimLine(ctx, toX(d1Chart.C9 - g.b2H / 2), toY(g.de2 * 0.54), toX(d1Chart.C9 + g.b2H / 2), toY(g.de2 * 0.54), `b2H = ${g.b2H.toFixed(2)}`, -12);
        }
    }

    renderWormDetailView(ctx, W, H, g) {
        const minX = -g.l1 - g.df1 * 0.8;
        const maxX = g.l2 + g.da1 * 1.8;
        const minY = -g.da1 * 1.1;
        const maxY = g.da1 * 1.1;

        const spanX = Math.max(20, maxX - minX);
        const spanY = Math.max(20, maxY - minY);
        const scale = Math.min((W * 0.82) / spanX, (H * 0.72) / spanY) * this.zoom;

        const cxWorld = (minX + maxX) / 2.0;
        const cyWorld = 0.0;
        const cxScr = W / 2.0 + this.panX;
        const cyScr = H / 2.0 + this.panY;

        const toX = (wx) => cxScr + (wx - cxWorld) * scale;
        const toY = (wy) => cyScr - (wy - cyWorld) * scale;

        // Centerline
        ctx.save();
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 1.2;
        ctx.setLineDash([10, 4, 2, 4]);
        ctx.beginPath();
        ctx.moveTo(toX(minX), toY(0));
        ctx.lineTo(toX(maxX), toY(0));
        ctx.stroke();
        ctx.restore();

        this.drawHorizontalWormFront(ctx, toX, toY, scale, 0, 0, g);
        const sideX = g.l2 + g.da1 * 0.95;
        this.drawWormCrossSection(ctx, toX(sideX), toY(0), scale, g);

        if (this.showDims) {
            this.drawDimLine(ctx, toX(-g.L / 2), toY(-g.da1 * 0.72), toX(g.L / 2), toY(-g.da1 * 0.72), `L = ${g.L.toFixed(2)} mm`, 18);
            this.drawDimLine(ctx, toX(-g.l1), toY(g.da1 * 0.75), toX(g.l2), toY(g.da1 * 0.75), `l1 + l2 = ${(g.l1 + g.l2).toFixed(2)} mm`, -14);
            this.drawDimLine(ctx, toX(sideX + g.da1 * 0.6), toY(-g.da1 / 2), toX(sideX + g.da1 * 0.6), toY(g.da1 / 2), `da1 = ${g.da1.toFixed(2)}`, 14);
        }
    }

    renderWheelDetailView(ctx, W, H, g) {
        const sideOffsetX = g.de2 * 0.65 + g.b2H * 0.8;
        const minX = -g.de2 * 0.6;
        const maxX = sideOffsetX + g.b2H * 0.8;
        const minY = -g.de2 * 0.6;
        const maxY = g.de2 * 0.6;

        const spanX = Math.max(20, maxX - minX);
        const spanY = Math.max(20, maxY - minY);
        const scale = Math.min((W * 0.82) / spanX, (H * 0.78) / spanY) * this.zoom;

        const cxWorld = (minX + maxX) / 2.0;
        const cyWorld = 0.0;
        const cxScr = W / 2.0 + this.panX;
        const cyScr = H / 2.0 + this.panY;

        const toX = (wx) => cxScr + (wx - cxWorld) * scale;
        const toY = (wy) => cyScr - (wy - cyWorld) * scale;

        // Centerlines
        ctx.save();
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 1.2;
        ctx.setLineDash([10, 4, 2, 4]);
        ctx.beginPath();
        ctx.moveTo(toX(minX), toY(0));
        ctx.lineTo(toX(maxX), toY(0));
        ctx.moveTo(toX(0), toY(minY));
        ctx.lineTo(toX(0), toY(maxY));
        ctx.moveTo(toX(sideOffsetX), toY(minY));
        ctx.lineTo(toX(sideOffsetX), toY(maxY));
        ctx.stroke();
        ctx.restore();

        this.drawAnimatedWheelFront(ctx, toX(0), toY(0), scale, g);
        this.drawWheelThroatSection(ctx, toX, toY, scale, sideOffsetX, 0, g);

        if (this.showDims) {
            this.drawDimLine(ctx, toX(-g.de2 / 2), toY(-g.de2 * 0.56), toX(g.de2 / 2), toY(-g.de2 * 0.56), `de2 = ${g.de2.toFixed(2)} mm`, 18);
            this.drawDimLine(ctx, toX(sideOffsetX - g.b2H / 2), toY(g.de2 * 0.55), toX(sideOffsetX + g.b2H / 2), toY(g.de2 * 0.55), `b2H = ${g.b2H.toFixed(2)} mm`, -14);
        }
    }

    setWormVisible(visible) {
        this.showWorm = !!visible;
        this.render();
        return this.showWorm;
    }

    setWheelVisible(visible) {
        this.showWheel = !!visible;
        this.render();
        return this.showWheel;
    }

    toggleWormVisible() {
        return this.setWormVisible(!this.showWorm);
    }

    toggleWheelVisible() {
        return this.setWheelVisible(!this.showWheel);
    }

    renderNormalProfileView(ctx, W, H, g) {
        const mn = g.mn;
        const alfanRad = (g.toothType === 1
            ? Math.atan(Math.tan((g.alfax || 20) * Math.PI / 180.0) * Math.cos((g.gama || 0) * Math.PI / 180.0))
            : (g.alfa0 || 20) * Math.PI / 180.0);
        const alfanDeg = (alfanRad * 180.0) / Math.PI;

        const pn = Math.PI * mn;
        const sn = pn / 2.0;
        const en = pn / 2.0;
        const ha1 = (g.da1 - g.d1) / 2.0;
        const hf1 = (g.d1 - g.df1) / 2.0;
        const rhof0 = 0.38 * mn;

        const tanA = Math.tan(alfanRad);
        const san = Math.max(0.08 * mn, sn - 2.0 * ha1 * tanA);
        const yStock = -hf1 - 1.25 * mn;

        const xMinWorld = -2.4 * pn;
        const xMaxWorld = 2.4 * pn;
        const yMinWorld = yStock - 0.25 * mn;
        const yMaxWorld = ha1 + 1.25 * mn;

        const spanX = xMaxWorld - xMinWorld;
        const spanY = yMaxWorld - yMinWorld;
        const baseScale = Math.min((W * 0.82) / spanX, (H * 0.68) / spanY);
        const scale = baseScale * this.zoom;

        const cxWorld = 0.0;
        const cyWorld = (yMinWorld + yMaxWorld) / 2.0;
        const cxScr = W / 2.0 + this.panX;
        const cyScr = H / 2.0 + this.panY;

        const toX = (wx) => cxScr + (wx - cxWorld) * scale;
        const toY = (wy) => cyScr - (wy - cyWorld) * scale;

        const teeth = [-2, -1, 0, 1, 2];

        // 1. Draw Body Fill & 45-deg Cross Hatching
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(toX(xMinWorld), toY(yStock));
        ctx.lineTo(toX(xMinWorld), toY(-hf1));

        teeth.forEach(k => {
            const xk = k * pn;
            const xRootL = xk - sn / 2.0 - hf1 * tanA;
            const xRootR = xk + sn / 2.0 + hf1 * tanA;
            const xTipL = xk - san / 2.0;
            const xTipR = xk + san / 2.0;
            const nextRootL = (k + 1) * pn - sn / 2.0 - hf1 * tanA;

            ctx.lineTo(toX(xRootL - rhof0), toY(-hf1));
            ctx.arcTo(toX(xRootL), toY(-hf1), toX(xTipL), toY(ha1), rhof0 * scale);
            ctx.lineTo(toX(xTipL), toY(ha1));
            ctx.lineTo(toX(xTipR), toY(ha1));
            ctx.arcTo(toX(xRootR), toY(-hf1), toX(nextRootL), toY(-hf1), rhof0 * scale);
            ctx.lineTo(toX(nextRootL - rhof0), toY(-hf1));
        });

        ctx.lineTo(toX(xMaxWorld), toY(-hf1));
        ctx.lineTo(toX(xMaxWorld), toY(yStock));
        ctx.closePath();

        ctx.fillStyle = 'rgba(56, 189, 248, 0.12)';
        ctx.fill();

        // 45-deg Hatch lines
        ctx.save();
        ctx.clip();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.22)';
        ctx.lineWidth = 1.0;
        const hStep = 12 * Math.max(0.6, this.zoom);
        for (let d = -W - H; d <= W + H; d += hStep) {
            ctx.beginPath();
            ctx.moveTo(d, 0);
            ctx.lineTo(d + H, H);
            ctx.stroke();
        }
        ctx.restore();

        // Rack Outline
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2.0;
        ctx.stroke();
        ctx.restore();

        // 2. Tooth Centerlines & Reference Lines
        ctx.save();
        teeth.forEach(k => {
            const xk = k * pn;
            ctx.strokeStyle = '#f43f5e';
            ctx.lineWidth = 1.0;
            ctx.setLineDash([8, 3, 2, 3]);
            ctx.beginPath();
            ctx.moveTo(toX(xk), toY(yStock - 0.1 * mn));
            ctx.lineTo(toX(xk), toY(ha1 + 0.5 * mn));
            ctx.stroke();
        });

        // Pitch line (y = 0)
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 1.4;
        ctx.setLineDash([6, 4]);
        ctx.beginPath();
        ctx.moveTo(toX(xMinWorld - 0.2 * pn), toY(0));
        ctx.lineTo(toX(xMaxWorld + 0.2 * pn), toY(0));
        ctx.stroke();

        // Tip line (y = ha1)
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.1;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(toX(xMinWorld - 0.2 * pn), toY(ha1));
        ctx.lineTo(toX(xMaxWorld + 0.2 * pn), toY(ha1));
        ctx.stroke();

        // Root line (y = -hf1)
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1.1;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(toX(xMinWorld - 0.2 * pn), toY(-hf1));
        ctx.lineTo(toX(xMaxWorld + 0.2 * pn), toY(-hf1));
        ctx.stroke();
        ctx.restore();

        // Text labels for lines
        ctx.save();
        ctx.font = '10px Inter, sans-serif';
        ctx.textAlign = 'right';
        ctx.fillStyle = '#fbbf24';
        ctx.fillText(`Đường chia danh nghĩa (Pitch Line y = 0)`, toX(xMaxWorld) - 12, toY(0) - 5);
        ctx.fillStyle = '#38bdf8';
        ctx.fillText(`Đường đỉnh răng (Tip Line y = +${ha1.toFixed(2)})`, toX(xMaxWorld) - 12, toY(ha1) - 5);
        ctx.fillStyle = '#94a3b8';
        ctx.fillText(`Đường chân răng (Root Line y = -${hf1.toFixed(2)})`, toX(xMaxWorld) - 12, toY(-hf1) + 12);
        ctx.restore();

        // 3. Dimensions
        if (this.showDims) {
            this.drawDimLine(ctx, toX(0), toY(ha1 + 0.45 * mn), toX(pn), toY(ha1 + 0.45 * mn), `pn = ${pn.toFixed(3)} mm`, -8);
            this.drawDimLine(ctx, toX(-sn / 2.0), toY(0), toX(sn / 2.0), toY(0), `sn = ${sn.toFixed(3)}`, -8);
            this.drawDimLine(ctx, toX(sn / 2.0), toY(0), toX(pn - sn / 2.0), toY(0), `en = ${en.toFixed(3)}`, -8);
            this.drawDimLine(ctx, toX(-1.5 * pn), toY(0), toX(-1.5 * pn), toY(ha1), `ha1 = ${ha1.toFixed(2)}`, -10);
            this.drawDimLine(ctx, toX(-1.5 * pn), toY(0), toX(-1.5 * pn), toY(-hf1), `hf1 = ${hf1.toFixed(2)}`, 14);

            // Pressure angle callout arc
            ctx.save();
            ctx.strokeStyle = '#f59e0b';
            ctx.fillStyle = '#f59e0b';
            ctx.lineWidth = 1.2;
            const xPitchR = sn / 2.0;
            ctx.beginPath();
            ctx.arc(toX(xPitchR), toY(0), 22 * this.zoom, -Math.PI / 2.0, -Math.PI / 2.0 + alfanRad, false);
            ctx.stroke();
            ctx.font = 'bold 11px Inter, sans-serif';
            ctx.fillText(`αn = ${alfanDeg.toFixed(2)}°`, toX(xPitchR + 0.15 * mn), toY(0.25 * ha1));

            // Fillet radius callout
            const xRootR0 = sn / 2.0 + hf1 * tanA;
            ctx.strokeStyle = '#a855f7';
            ctx.fillStyle = '#c084fc';
            ctx.beginPath();
            ctx.moveTo(toX(xRootR0 + rhof0 * 0.3), toY(-hf1 + rhof0 * 0.3));
            ctx.lineTo(toX(xRootR0 + 0.6 * mn), toY(-hf1 + 0.75 * mn));
            ctx.stroke();
            ctx.fillText(`ρf0 = ${rhof0.toFixed(2)} (0.38 mn)`, toX(xRootR0 + 0.65 * mn), toY(-hf1 + 0.8 * mn));
            ctx.restore();
        }
    }

    renderAxialProfileView(ctx, W, H, g) {
        const mx = g.mx;
        const px = g.px;
        const alfaxRad = (g.alfax * Math.PI) / 180.0;
        const alfaxDeg = g.alfax;
        const gama = g.gama;
        const sx = g.sx1;
        const d1 = g.d1;
        const da1 = g.da1;
        const df1 = g.df1;
        const ha1 = (da1 - d1) / 2.0;
        const hf1 = (d1 - df1) / 2.0;
        const ds = g.Shaft_ds;
        const th = g.Shaft_th;
        const L = g.L;
        const l1 = g.l1;
        const l2 = g.l2;
        const beta = g.DXF_Beta;

        const tanAx = Math.tan(alfaxRad);
        const sa1 = Math.max(0.08 * mx, sx - 2.0 * ha1 * tanAx);

        const minX = -l1 - 12.0;
        const maxX = l2 + 12.0;
        const minY = -da1 * 0.68;
        const maxY = da1 * 0.68;

        const spanX = maxX - minX;
        const spanY = maxY - minY;
        const baseScale = Math.min((W * 0.84) / spanX, (H * 0.72) / spanY);
        const scale = baseScale * this.zoom;

        const cxWorld = (minX + maxX) / 2.0;
        const cyWorld = 0.0;
        const cxScr = W / 2.0 + this.panX;
        const cyScr = H / 2.0 + this.panY;

        const toX = (wx) => cxScr + (wx - cxWorld) * scale;
        const toY = (wy) => cyScr - (wy - cyWorld) * scale;

        // 1. Centerline along worm axis y = 0
        ctx.save();
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 1.2;
        ctx.setLineDash([10, 4, 2, 4]);
        ctx.beginPath();
        ctx.moveTo(toX(minX), toY(0));
        ctx.lineTo(toX(maxX), toY(0));
        ctx.stroke();
        ctx.restore();

        // 2. Shaft core, extensions & shoulders
        ctx.save();
        ctx.fillStyle = 'rgba(148, 163, 184, 0.16)';
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1.5;
        // Left shaft extension
        ctx.strokeRect(toX(-l1), toY(ds / 2.0), (l1 - L / 2.0 - th) * scale, ds * scale);
        ctx.fillRect(toX(-l1), toY(ds / 2.0), (l1 - L / 2.0 - th) * scale, ds * scale);
        // Right shaft extension
        ctx.strokeRect(toX(L / 2.0 + th), toY(ds / 2.0), (l2 - L / 2.0 - th) * scale, ds * scale);
        ctx.fillRect(toX(L / 2.0 + th), toY(ds / 2.0), (l2 - L / 2.0 - th) * scale, ds * scale);
        // Shoulders
        ctx.strokeRect(toX(-L / 2.0 - th), toY(df1 / 2.0), th * scale, (df1 - ds) * 0.5 * scale);
        ctx.strokeRect(toX(-L / 2.0 - th), toY(-ds / 2.0), th * scale, (df1 - ds) * 0.5 * scale);
        ctx.strokeRect(toX(L / 2.0), toY(df1 / 2.0), th * scale, (df1 - ds) * 0.5 * scale);
        ctx.strokeRect(toX(L / 2.0), toY(-ds / 2.0), th * scale, (df1 - ds) * 0.5 * scale);

        // Core cylinder (-L/2 to +L/2, -df1/2 to +df1/2)
        ctx.fillStyle = 'rgba(56, 189, 248, 0.15)';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.6;
        ctx.strokeRect(toX(-L / 2.0), toY(df1 / 2.0), L * scale, df1 * scale);
        ctx.fillRect(toX(-L / 2.0), toY(df1 / 2.0), L * scale, df1 * scale);
        ctx.restore();

        // 3. Teeth on Upper Flank (+y) and Lower Flank (-y)
        const ch = Math.tan((beta * Math.PI) / 180.0) * ((da1 - df1) / 2.0);
        const nP = Math.ceil(L / px) + 2;

        const drawRackHalf = (signY, shiftX) => {
            ctx.save();
            ctx.beginPath();
            if (signY > 0) {
                ctx.moveTo(toX(-L / 2.0), toY(df1 / 2.0));
                ctx.lineTo(toX(-L / 2.0 + ch), toY(da1 / 2.0));
                ctx.lineTo(toX(L / 2.0 - ch), toY(da1 / 2.0));
                ctx.lineTo(toX(L / 2.0), toY(df1 / 2.0));
            } else {
                ctx.moveTo(toX(-L / 2.0), toY(-df1 / 2.0));
                ctx.lineTo(toX(-L / 2.0 + ch), toY(-da1 / 2.0));
                ctx.lineTo(toX(L / 2.0 - ch), toY(-da1 / 2.0));
                ctx.lineTo(toX(L / 2.0), toY(-df1 / 2.0));
            }
            ctx.closePath();
            ctx.clip();

            ctx.fillStyle = 'rgba(56, 189, 248, 0.32)';
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 1.8;

            for (let k = -nP; k <= nP; k++) {
                const xc = k * px + shiftX;
                const xL_flank = xc - sa1 / 2.0;
                const xR_flank = xc + sa1 / 2.0;
                const xL_root = xc - sx / 2.0 - hf1 * tanAx;
                const xR_root = xc + sx / 2.0 + hf1 * tanAx;

                ctx.beginPath();
                if (signY > 0) {
                    ctx.moveTo(toX(xL_root), toY(df1 / 2.0));
                    ctx.lineTo(toX(xL_flank), toY(da1 / 2.0));
                    ctx.lineTo(toX(xR_flank), toY(da1 / 2.0));
                    ctx.lineTo(toX(xR_root), toY(df1 / 2.0));
                } else {
                    ctx.moveTo(toX(xL_root), toY(-df1 / 2.0));
                    ctx.lineTo(toX(xL_flank), toY(-da1 / 2.0));
                    ctx.lineTo(toX(xR_flank), toY(-da1 / 2.0));
                    ctx.lineTo(toX(xR_root), toY(-df1 / 2.0));
                }
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
            }

            // Cross-hatching for teeth
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
            ctx.lineWidth = 1.0;
            const hStep = 10 * Math.max(0.6, this.zoom);
            for (let d = -W - H; d <= W + H; d += hStep) {
                ctx.beginPath();
                ctx.moveTo(d, 0);
                ctx.lineTo(d + H, H);
                ctx.stroke();
            }
            ctx.restore();
        };

        // Draw upper teeth (shiftX = 0)
        drawRackHalf(1, 0);
        // Draw lower teeth (shiftX = px/2 for odd z1)
        const botShift = (g.z1 % 2 === 1) ? px / 2.0 : 0.0;
        drawRackHalf(-1, botShift);

        // 4. Reference lines: Pitch lines (d1/2), Tip lines (da1/2), Root lines (df1/2)
        ctx.save();
        ctx.lineWidth = 1.1;

        // Pitch lines
        ctx.strokeStyle = '#fbbf24';
        ctx.setLineDash([6, 4]);
        ctx.beginPath();
        ctx.moveTo(toX(-L / 2.0), toY(d1 / 2.0));
        ctx.lineTo(toX(L / 2.0), toY(d1 / 2.0));
        ctx.moveTo(toX(-L / 2.0), toY(-d1 / 2.0));
        ctx.lineTo(toX(L / 2.0), toY(-d1 / 2.0));
        ctx.stroke();

        // Tip lines
        ctx.strokeStyle = '#38bdf8';
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(toX(-L / 2.0 + ch), toY(da1 / 2.0));
        ctx.lineTo(toX(L / 2.0 - ch), toY(da1 / 2.0));
        ctx.moveTo(toX(-L / 2.0 + ch), toY(-da1 / 2.0));
        ctx.lineTo(toX(L / 2.0 - ch), toY(-da1 / 2.0));
        ctx.stroke();

        // Root lines
        ctx.strokeStyle = '#94a3b8';
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(toX(-L / 2.0), toY(df1 / 2.0));
        ctx.lineTo(toX(L / 2.0), toY(df1 / 2.0));
        ctx.moveTo(toX(-L / 2.0), toY(-df1 / 2.0));
        ctx.lineTo(toX(L / 2.0), toY(-df1 / 2.0));
        ctx.stroke();
        ctx.restore();

        // 5. Dimension Callouts
        if (this.showDims) {
            this.drawDimLine(ctx, toX(-L / 2.0), toY(da1 / 2.0 + 8.0), toX(L / 2.0), toY(da1 / 2.0 + 8.0), `L = ${L.toFixed(2)} mm`, -10);
            this.drawDimLine(ctx, toX(-L / 2.0 - th - 12.0), toY(-da1 / 2.0), toX(-L / 2.0 - th - 12.0), toY(da1 / 2.0), `da1 = ${da1.toFixed(2)}`, -14);
            this.drawDimLine(ctx, toX(L / 2.0 + th + 12.0), toY(-d1 / 2.0), toX(L / 2.0 + th + 12.0), toY(d1 / 2.0), `d1 = ${d1.toFixed(2)}`, 14);
            this.drawDimLine(ctx, toX(L / 2.0 + th + 24.0), toY(-df1 / 2.0), toX(L / 2.0 + th + 24.0), toY(df1 / 2.0), `df1 = ${df1.toFixed(2)}`, 14);
            this.drawDimLine(ctx, toX(0), toY(da1 / 2.0 + 3.0), toX(px), toY(da1 / 2.0 + 3.0), `px = ${px.toFixed(3)} mm`, -8);
            this.drawDimLine(ctx, toX(-sx / 2.0), toY(d1 / 2.0), toX(sx / 2.0), toY(d1 / 2.0), `sx = ${sx.toFixed(3)}`, -10);

            // Pressure angle callout arc on tooth +1
            ctx.save();
            ctx.strokeStyle = '#f59e0b';
            ctx.fillStyle = '#f59e0b';
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.arc(toX(px), toY(d1 / 2.0), 16 * this.zoom, -Math.PI / 2.0, -Math.PI / 2.0 + alfaxRad, false);
            ctx.stroke();
            ctx.font = 'bold 11px Inter, sans-serif';
            ctx.fillText(`αx = ${alfaxDeg.toFixed(2)}°`, toX(px + 0.15 * mx), toY(d1 / 2.0 + 0.35 * ha1));
            ctx.restore();
        }
    }

    renderTangentialProfileView(ctx, W, H, g) {
        const mx = g.mx;
        const mn = g.mn;
        const px = g.px;
        const pn = Math.PI * mn;
        const alfaxRad = (g.alfax * Math.PI) / 180.0;
        const alfaxDeg = g.alfax;
        const gama = g.gama;
        const gamaRad = (gama * Math.PI) / 180.0;
        const sx = g.sx1;
        const sn = pn / 2.0;
        const d1 = g.d1;
        const da1 = g.da1;
        const df1 = g.df1;
        const ha1 = (da1 - d1) / 2.0;
        const ds = g.Shaft_ds;
        const th = g.Shaft_th;
        const L = g.L;
        const l1 = g.l1;
        const l2 = g.l2;
        const beta = g.DXF_Beta || 15.0;

        // Tangent Plane slice width at y = d1/2
        const r1 = d1 / 2.0;
        const ra1 = da1 / 2.0;
        const wt = Math.sqrt(Math.max(0, ra1 * ra1 - r1 * r1)); // half chord
        const bt = 2.0 * wt; // total chord width of tangent cut
        const tanAx = Math.tan(alfaxRad);
        const tanGama = Math.tan(gamaRad);

        const minX = -l1 - 12.0;
        const maxX = l2 + 12.0;
        const minY = -Math.max(da1 / 2.0, wt * 1.35) * 1.15;
        const maxY = Math.max(da1 / 2.0, wt * 1.35) * 1.15;

        const spanX = maxX - minX;
        const spanY = maxY - minY;
        const baseScale = Math.min((W * 0.84) / spanX, (H * 0.72) / spanY);
        const scale = baseScale * this.zoom;

        const cxWorld = (minX + maxX) / 2.0;
        const cyWorld = 0.0;
        const cxScr = W / 2.0 + this.panX;
        const cyScr = H / 2.0 + this.panY;

        const toX = (wx) => cxScr + (wx - cxWorld) * scale;
        const toY = (wz) => cyScr - (wz - cyWorld) * scale;

        // 1. Ghost Background: Worm Outline in Top View (Shaft extensions & Body cylinder)
        ctx.save();
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.25)';
        ctx.fillStyle = 'rgba(148, 163, 184, 0.04)';
        ctx.lineWidth = 1.0;
        // Shaft extension left
        ctx.strokeRect(toX(-l1), toY(ds / 2.0), (l1 - L / 2.0 - th) * scale, ds * scale);
        // Shaft extension right
        ctx.strokeRect(toX(L / 2.0 + th), toY(ds / 2.0), (l2 - L / 2.0 - th) * scale, ds * scale);
        // Shoulders
        ctx.strokeRect(toX(-L / 2.0 - th), toY(df1 / 2.0), th * scale, df1 * scale);
        ctx.strokeRect(toX(L / 2.0), toY(df1 / 2.0), th * scale, df1 * scale);
        // Tip cylinder projection (ghost boundary)
        ctx.setLineDash([4, 4]);
        ctx.strokeRect(toX(-L / 2.0), toY(da1 / 2.0), L * scale, da1 * scale);
        ctx.restore();

        // 2. Central Tangent Cut Band: [-L/2, L/2] x [-wt, wt]
        const ch = Math.tan((beta * Math.PI) / 180.0) * ha1;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(toX(-L / 2.0), toY(0));
        ctx.lineTo(toX(-L / 2.0 + ch), toY(wt));
        ctx.lineTo(toX(L / 2.0 - ch), toY(wt));
        ctx.lineTo(toX(L / 2.0), toY(0));
        ctx.lineTo(toX(L / 2.0 - ch), toY(-wt));
        ctx.lineTo(toX(-L / 2.0 + ch), toY(-wt));
        ctx.closePath();

        ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
        ctx.lineWidth = 1.2;
        ctx.setLineDash([4, 3]);
        ctx.stroke();
        ctx.restore();

        // 3. Centerline along worm axis / Pitch generator line at Z = 0
        ctx.save();
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 1.3;
        ctx.setLineDash([10, 4, 2, 4]);
        ctx.beginPath();
        ctx.moveTo(toX(minX), toY(0));
        ctx.lineTo(toX(maxX), toY(0));
        ctx.stroke();
        ctx.restore();

        // 4. Helical Teeth Ribbons on Tangent Plane
        const handSign = (parseInt(g.teethOrientation) === 2) ? -1.0 : 1.0;
        const nP = Math.ceil(L / px) + 2;

        ctx.save();
        // Clip to Tangent Cut Band
        ctx.beginPath();
        ctx.moveTo(toX(-L / 2.0), toY(0));
        ctx.lineTo(toX(-L / 2.0 + ch), toY(wt));
        ctx.lineTo(toX(L / 2.0 - ch), toY(wt));
        ctx.lineTo(toX(L / 2.0), toY(0));
        ctx.lineTo(toX(L / 2.0 - ch), toY(-wt));
        ctx.lineTo(toX(-L / 2.0 + ch), toY(-wt));
        ctx.closePath();
        ctx.clip();

        const numZSteps = 16;
        for (let k = -nP; k <= nP; k++) {
            const xk = k * px;
            const ptsR = [];
            const ptsL = [];

            for (let i = 0; i <= numZSteps; i++) {
                const zVal = -wt + (2.0 * wt * i) / numZSteps;
                const rz = Math.sqrt(r1 * r1 + zVal * zVal);
                const deltaR = Math.max(0, rz - r1);
                const sxz = Math.max(0.08 * mx, sx - 2.0 * deltaR * tanAx);
                const xc = xk + handSign * zVal * tanGama;
                ptsR.push({ x: xc + sxz / 2.0, z: zVal });
                ptsL.push({ x: xc - sxz / 2.0, z: zVal });
            }

            // Draw tooth polygon
            ctx.beginPath();
            ptsR.forEach((pt, idx) => {
                if (idx === 0) ctx.moveTo(toX(pt.x), toY(pt.z));
                else ctx.lineTo(toX(pt.x), toY(pt.z));
            });
            for (let i = ptsL.length - 1; i >= 0; i--) {
                ctx.lineTo(toX(ptsL[i].x), toY(ptsL[i].z));
            }
            ctx.closePath();

            ctx.fillStyle = 'rgba(56, 189, 248, 0.35)';
            ctx.fill();
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 1.6;
            ctx.stroke();

            // Pitch point on generator line Z = 0
            ctx.save();
            ctx.fillStyle = '#f59e0b';
            ctx.strokeStyle = '#d97706';
            ctx.lineWidth = 1.0;
            ctx.beginPath();
            ctx.arc(toX(xk), toY(0), 3.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.restore();
        }

        // 45-degree Hatching across all teeth in tangent cut
        ctx.save();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.22)';
        ctx.lineWidth = 1.0;
        const hStep = 10 * Math.max(0.6, this.zoom);
        for (let d = -W - H; d <= W + H; d += hStep) {
            ctx.beginPath();
            ctx.moveTo(d, 0);
            ctx.lineTo(d + H, H);
            ctx.stroke();
        }
        ctx.restore();
        ctx.restore(); // end clip

        // 5. Tangent Band Limit Lines (Z = +wt and Z = -wt)
        ctx.save();
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 1.2;
        ctx.setLineDash([6, 4]);
        ctx.beginPath();
        ctx.moveTo(toX(-L / 2.0 + ch), toY(wt));
        ctx.lineTo(toX(L / 2.0 - ch), toY(wt));
        ctx.moveTo(toX(-L / 2.0 + ch), toY(-wt));
        ctx.lineTo(toX(L / 2.0 - ch), toY(-wt));
        ctx.stroke();
        ctx.restore();

        // 6. Dimensions and Callouts
        if (this.showDims) {
            // Total Length L
            this.drawDimLine(ctx, toX(-L / 2.0), toY(wt + 8.0), toX(L / 2.0), toY(wt + 8.0), `L = ${L.toFixed(2)} mm`, -10);

            // Contact Width Bt
            this.drawDimLine(ctx, toX(-L / 2.0 - th - 12.0), toY(-wt), toX(-L / 2.0 - th - 12.0), toY(wt), `Bt = ${bt.toFixed(2)} mm`, -14);

            // Axial Pitch px along generator line
            this.drawDimLine(ctx, toX(0), toY(0), toX(px), toY(0), `px = ${px.toFixed(3)} mm`, 14);

            // Axial Tooth Thickness sx
            this.drawDimLine(ctx, toX(-sx / 2.0), toY(0), toX(sx / 2.0), toY(0), `sx = ${sx.toFixed(3)}`, -14);

            // Lead angle callout arc
            ctx.save();
            ctx.strokeStyle = '#f59e0b';
            ctx.fillStyle = '#f59e0b';
            ctx.lineWidth = 1.3;
            ctx.beginPath();
            ctx.moveTo(toX(0), toY(0));
            ctx.lineTo(toX(0), toY(wt * 0.9));
            ctx.stroke();

            const arcR = 24 * this.zoom;
            ctx.beginPath();
            ctx.arc(toX(0), toY(0), arcR, -Math.PI / 2.0, -Math.PI / 2.0 + handSign * gamaRad, handSign < 0);
            ctx.stroke();
            ctx.font = 'bold 11px Inter, sans-serif';
            ctx.fillText(`γ = ${gama.toFixed(2)}°`, toX(handSign * arcR * 0.7), toY(wt * 0.45));
            ctx.restore();
        }
    }

    drawAnimatedWheelFront(ctx, cx, cy, scale, g) {
        const z2 = Math.max(6, Math.round(g.z2));
        const r_de2 = (g.de2 / 2.0) * scale;
        const r_da2 = (g.da2 / 2.0) * scale;
        const r_d2 = (g.d2 / 2.0) * scale;
        const r_df2 = (g.df2 / 2.0) * scale;
        const r_bore = Math.max(8, (g.ShaftDB2 / 2.0) * scale);

        const handSign = (parseInt(g.teethOrientation) === 2) ? -1.0 : 1.0;
        const wheelRot = -handSign * (this.animPhase * g.z1) / z2;

        ctx.save();
        ctx.translate(cx, cy);

        // Outside rim circle de2
        ctx.fillStyle = 'rgba(245, 158, 11, 0.08)';
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.arc(0, 0, r_de2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Draw conjugate gear teeth around throat circumference
        const alphaRad = (g.alfax * Math.PI) / 180.0;
        const pitchAngle = (Math.PI * 2.0) / z2;
        const halfPitchTooth = (g.sx2 / g.d2); // angular half-thickness on pitch circle
        const daDelta = ((r_da2 - r_d2) / Math.max(1, r_d2)) * Math.tan(alphaRad);
        const dfDelta = ((r_d2 - r_df2) / Math.max(1, r_d2)) * Math.tan(alphaRad);
        const halfTipAngle = Math.max(0.05 * pitchAngle, halfPitchTooth - daDelta);
        const halfRootAngle = Math.min(0.46 * pitchAngle, halfPitchTooth + dfDelta);

        // At bottom (angle = +PI/2 in canvas coordinates where +Y is down), wheel tooth space meets worm tooth
        const basePhase = Math.PI / 2.0 + pitchAngle / 2.0 + wheelRot;

        ctx.fillStyle = 'rgba(56, 189, 248, 0.20)';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        for (let k = 0; k < z2; k++) {
            const th = basePhase + k * pitchAngle;
            const a1 = th - halfRootAngle;
            const a2 = th - halfTipAngle;
            const a3 = th + halfTipAngle;
            const a4 = th + halfRootAngle;
            const aNext = th + pitchAngle - halfRootAngle;

            if (k === 0) {
                ctx.moveTo(r_df2 * Math.cos(a1), r_df2 * Math.sin(a1));
            } else {
                ctx.lineTo(r_df2 * Math.cos(a1), r_df2 * Math.sin(a1));
            }
            ctx.lineTo(r_da2 * Math.cos(a2), r_da2 * Math.sin(a2));
            ctx.arc(0, 0, r_da2, a2, a3, false);
            ctx.lineTo(r_df2 * Math.cos(a4), r_df2 * Math.sin(a4));
            ctx.arc(0, 0, r_df2, a4, aNext, false);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Pitch circle d2 (dashed)
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 1.2;
        ctx.setLineDash([6, 4]);
        ctx.beginPath();
        ctx.arc(0, 0, r_d2, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        // Bore + Keyway
        ctx.fillStyle = '#0b1120';
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(0, 0, r_bore, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.restore();
    }

    drawHorizontalWormFront(ctx, toX, toY, scale, wxCenter, wyCenter, g) {
        const L = g.L;
        const da1 = g.da1;
        const d1 = g.d1;
        const df1 = g.df1;
        const ds = g.Shaft_ds;
        const th = g.Shaft_th;
        const px = g.px;
        const alfaxRad = (g.alfax * Math.PI) / 180.0;

        // Shaft extensions out to bearings (-l1 to +l2)
        ctx.save();
        ctx.fillStyle = 'rgba(148, 163, 184, 0.16)';
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1.5;
        // Left shaft
        ctx.beginPath();
        ctx.rect(toX(wxCenter - g.l1), toY(wyCenter + ds / 2), (g.l1 - L / 2) * scale, ds * scale);
        ctx.fill();
        ctx.stroke();
        // Right shaft
        ctx.beginPath();
        ctx.rect(toX(wxCenter + L / 2), toY(wyCenter + ds / 2), (g.l2 - L / 2) * scale, ds * scale);
        ctx.fill();
        ctx.stroke();

        // Shoulders (ds x t) from DXF.bas Worm()
        ctx.strokeStyle = '#cbd5e1';
        ctx.strokeRect(toX(wxCenter - L / 2 - th), toY(wyCenter + ds / 2), th * scale, ds * scale);
        ctx.strokeRect(toX(wxCenter + L / 2), toY(wyCenter + ds / 2), th * scale, ds * scale);

        // Root cylinder core (-L/2 to +L/2, -df1/2 to +df1/2)
        ctx.fillStyle = 'rgba(56, 189, 248, 0.18)';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.rect(toX(wxCenter - L / 2), toY(wyCenter + df1 / 2), L * scale, df1 * scale);
        ctx.fill();
        ctx.stroke();

        // Trapezoidal worm thread rack along [-L/2, +L/2]
        // Thread axial shift from animation:
        const handSign = (parseInt(g.teethOrientation) === 2) ? -1.0 : 1.0;
        const axialShift = (handSign * ((this.animPhase / (Math.PI * 2.0)) * g.z1 * px)) % px;
        const ha1 = g.ha1;
        const hf1 = g.hf1;
        const halfSx1 = g.sx1 / 2.0;
        const halfSa1 = Math.max(0.05 * px, halfSx1 - ha1 * Math.tan(alfaxRad));
        const halfSf1 = Math.min(0.48 * px, halfSx1 + hf1 * Math.tan(alfaxRad));

        const nPitches = Math.ceil(L / px) + 2;
        ctx.fillStyle = 'rgba(56, 189, 248, 0.30)';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.6;

        // Clip to worm face width [-L/2, +L/2] with chamfer angle DXF_Beta
        ctx.save();
        const ch = Math.tan((g.DXF_Beta * Math.PI) / 180.0) * ((da1 - df1) / 2.0);
        ctx.beginPath();
        ctx.moveTo(toX(wxCenter - L / 2), toY(wyCenter));
        ctx.lineTo(toX(wxCenter - L / 2), toY(wyCenter + df1 / 2));
        ctx.lineTo(toX(wxCenter - L / 2 + ch), toY(wyCenter + da1 / 2));
        ctx.lineTo(toX(wxCenter + L / 2 - ch), toY(wyCenter + da1 / 2));
        ctx.lineTo(toX(wxCenter + L / 2), toY(wyCenter + df1 / 2));
        ctx.lineTo(toX(wxCenter + L / 2), toY(wyCenter - df1 / 2));
        ctx.lineTo(toX(wxCenter + L / 2 - ch), toY(wyCenter - da1 / 2));
        ctx.lineTo(toX(wxCenter - L / 2 + ch), toY(wyCenter - da1 / 2));
        ctx.lineTo(toX(wxCenter - L / 2), toY(wyCenter - df1 / 2));
        ctx.closePath();
        ctx.clip();

        for (let k = -nPitches; k <= nPitches; k++) {
            // Top tooth centered at x = k * px + axialShift (at k=0, tooth crest is at x=0 meshing with wheel space)
            const xcTop = wxCenter + k * px + axialShift;
            ctx.beginPath();
            ctx.moveTo(toX(xcTop - halfSf1), toY(wyCenter + df1 / 2));
            ctx.lineTo(toX(xcTop - halfSa1), toY(wyCenter + da1 / 2));
            ctx.lineTo(toX(xcTop + halfSa1), toY(wyCenter + da1 / 2));
            ctx.lineTo(toX(xcTop + halfSf1), toY(wyCenter + df1 / 2));
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // Bottom tooth (shifted by px/2 for odd z1)
            const xcBot = xcTop + (g.z1 % 2 === 1 ? px / 2.0 : 0.0);
            ctx.beginPath();
            ctx.moveTo(toX(xcBot - halfSf1), toY(wyCenter - df1 / 2));
            ctx.lineTo(toX(xcBot - halfSa1), toY(wyCenter - da1 / 2));
            ctx.lineTo(toX(xcBot + halfSa1), toY(wyCenter - da1 / 2));
            ctx.lineTo(toX(xcBot + halfSf1), toY(wyCenter - df1 / 2));
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        }
        ctx.restore();

        // Pitch lines y = wyCenter +- d1/2
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 1.1;
        ctx.setLineDash([6, 4]);
        ctx.beginPath();
        ctx.moveTo(toX(wxCenter - L / 2), toY(wyCenter + d1 / 2));
        ctx.lineTo(toX(wxCenter + L / 2), toY(wyCenter + d1 / 2));
        ctx.moveTo(toX(wxCenter - L / 2), toY(wyCenter - d1 / 2));
        ctx.lineTo(toX(wxCenter + L / 2), toY(wyCenter - d1 / 2));
        ctx.stroke();
        ctx.restore();
    }

    // Exact reproduction of DXF.bas WWheel(x1, y1) throat geometry
    drawWheelThroatSection(ctx, toX, toY, scale, wx, wy, g) {
        const a = g.a;
        const da2 = g.da2;
        const dm2 = g.dm2;
        const df2 = g.df2;
        const de2 = Math.max(g.de2, 1.001 * da2);
        const b2h = g.b2H;

        const r1 = a - da2 / 2.0; // Throat tip arc radius centered at worm axis
        const r2 = a - dm2 / 2.0; // Throat pitch arc radius
        const r3 = a - df2 / 2.0; // Throat root arc radius

        const v4 = r3 - 0.5 * Math.sqrt(Math.max(0.0, 4.0 * r3 * r3 - b2h * b2h));

        ctx.save();
        // Draw upper and lower wheel body halves with concave throat arcs
        [-1, 1].forEach(signY => {
            const wormCenterY = wy + signY * a;
            const yRootEdge = wy + signY * (df2 / 2.0 + v4);
            const yBore = wy + signY * (g.ShaftDB2 / 2.0);

            ctx.fillStyle = 'rgba(245, 158, 11, 0.16)';
            ctx.strokeStyle = '#f59e0b';
            ctx.lineWidth = 1.8;

            ctx.beginPath();
            ctx.moveTo(toX(wx - b2h / 2.0), toY(yBore));
            ctx.lineTo(toX(wx - b2h / 2.0), toY(yRootEdge));
            // Concave root throat arc around (wx, wormCenterY) of radius r3
            const angL = Math.atan2(yRootEdge - wormCenterY, -b2h / 2.0);
            const angR = Math.atan2(yRootEdge - wormCenterY, b2h / 2.0);
            ctx.arc(
                toX(wx),
                toY(wormCenterY),
                r3 * scale,
                -angL,
                -angR,
                signY > 0
            );
            ctx.lineTo(toX(wx + b2h / 2.0), toY(yBore));
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // Concave tip throat arc (radius r1)
            const v1 = Math.min(r1 * 0.9, (de2 - da2) / 2.0);
            const b1 = Math.min(b2h / 2.0, Math.sqrt(Math.max(0.0, v1 * (2.0 * r1 - v1))));
            const yTipEdge = wy + signY * (da2 / 2.0 + v1);
            const angTipL = Math.atan2(yTipEdge - wormCenterY, -b1);
            const angTipR = Math.atan2(yTipEdge - wormCenterY, b1);

            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 1.8;
            ctx.beginPath();
            ctx.arc(toX(wx), toY(wormCenterY), r1 * scale, -angTipL, -angTipR, signY > 0);
            ctx.stroke();

            // Concave pitch throat arc (radius r2, dashed)
            const v2 = Math.min(r2 * 0.9, (de2 - dm2) / 2.0);
            const b2 = Math.min(b2h / 2.0, Math.sqrt(Math.max(0.0, v2 * (2.0 * r2 - v2))));
            const yPitchEdge = wy + signY * (dm2 / 2.0 + v2);
            const angPitchL = Math.atan2(yPitchEdge - wormCenterY, -b2);
            const angPitchR = Math.atan2(yPitchEdge - wormCenterY, b2);

            ctx.strokeStyle = '#fbbf24';
            ctx.lineWidth = 1.2;
            ctx.setLineDash([5, 4]);
            ctx.beginPath();
            ctx.arc(toX(wx), toY(wormCenterY), r2 * scale, -angPitchL, -angPitchR, signY > 0);
            ctx.stroke();
            ctx.setLineDash([]);
        });
        ctx.restore();
    }

    drawWormCrossSection(ctx, cx, cy, scale, g) {
        ctx.save();
        ctx.translate(cx, cy);
        // Tip circle da1
        ctx.fillStyle = 'rgba(56, 189, 248, 0.14)';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.arc(0, 0, (g.da1 / 2.0) * scale, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Pitch circle d1 (dashed)
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 1.2;
        ctx.setLineDash([5, 4]);
        ctx.beginPath();
        ctx.arc(0, 0, (g.d1 / 2.0) * scale, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        // Root circle df1
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(0, 0, (g.df1 / 2.0) * scale, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
    }

    drawDimLine(ctx, x1, y1, x2, y2, label, offset) {
        ctx.save();
        ctx.strokeStyle = '#94a3b8';
        ctx.fillStyle = '#e2e8f0';
        ctx.lineWidth = 1;
        ctx.font = 'bold 11px Inter, sans-serif';
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        const mx = (x1 + x2) / 2.0;
        const my = (y1 + y2) / 2.0;
        ctx.textAlign = 'center';
        ctx.fillText(label, mx, my + (offset || -8));
        ctx.restore();
    }

    drawHUD(ctx, W, H, g) {
        ctx.save();
        ctx.fillStyle = 'rgba(15, 23, 42, 0.86)';
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1;
        ctx.fillRect(14, 14, 345, 96);
        ctx.strokeRect(14, 14, 345, 96);

        const typeNames = ["", "ZA (Archimedean)", "ZN (Normal Straight)", "ZI (Involute)", "ZK (Cone Milled)", "ZH (Cavex Concave)"];
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 12px Inter, sans-serif';

        if (this.viewMode === 'normal_profile') {
            ctx.fillText(`MẶT CẮT PHÁP TUYẾN BIÊN DẠNG RĂNG (N-N)`, 24, 34);
            ctx.fillStyle = '#e2e8f0';
            ctx.font = '11px Inter, sans-serif';
            const alfan = (g.toothType === 1
                ? Math.atan(Math.tan((g.alfax || 20) * Math.PI / 180.0) * Math.cos((g.gama || 0) * Math.PI / 180.0)) * 180 / Math.PI
                : (g.alfa0 || 20));
            ctx.fillText(`mn = ${g.mn.toFixed(3)} mm | αn = ${alfan.toFixed(2)}° | pn = ${(Math.PI * g.mn).toFixed(3)} mm`, 24, 54);
            ctx.fillText(`sn = ${(Math.PI * g.mn / 2).toFixed(3)} mm | ha1 = ${((g.da1 - g.d1)/2).toFixed(3)} | hf1 = ${((g.d1 - g.df1)/2).toFixed(3)} mm`, 24, 72);
            ctx.fillText(`ρf0 = ${(0.38 * g.mn).toFixed(3)} mm (0.38 mn) | Kiểu ren: ${typeNames[g.toothType] || 'ZN'}`, 24, 90);
        } else if (this.viewMode === 'axial_profile') {
            ctx.fillText(`MẶT CẮT DỌC TRỤC TRỤC VÍT (A-A)`, 24, 34);
            ctx.fillStyle = '#e2e8f0';
            ctx.font = '11px Inter, sans-serif';
            ctx.fillText(`mx = ${g.mx.toFixed(3)} mm | αx = ${g.alfax.toFixed(2)}° | γ = ${g.gama.toFixed(3)}°`, 24, 54);
            ctx.fillText(`px = ${g.px.toFixed(3)} mm | sx = ${g.sx1.toFixed(3)} mm | L = ${g.L.toFixed(2)} mm`, 24, 72);
            ctx.fillText(`d1 = ${g.d1.toFixed(2)} mm | da1 = ${g.da1.toFixed(2)} mm | df1 = ${g.df1.toFixed(2)} mm`, 24, 90);
        } else if (this.viewMode === 'tangential_profile') {
            const wt = 0.5 * Math.sqrt(Math.max(0, g.da1 * g.da1 - g.d1 * g.d1));
            const bt = 2.0 * wt;
            ctx.fillText(`MẶT CẮT TIẾP TUYẾN MẶT TRỤ CHIA (T-T)`, 24, 34);
            ctx.fillStyle = '#e2e8f0';
            ctx.font = '11px Inter, sans-serif';
            ctx.fillText(`Mặt phẳng y = d1/2 (${(g.d1/2).toFixed(2)} mm) tiếp xúc mặt trụ chia | Bề rộng tiếp xúc Bt = ${bt.toFixed(2)} mm`, 24, 54);
            ctx.fillText(`γ = ${g.gama.toFixed(3)}° | px = ${g.px.toFixed(3)} mm | pn = ${(Math.PI * g.mn).toFixed(3)} mm`, 24, 72);
            ctx.fillText(`sx = ${g.sx1.toFixed(3)} mm | sn = ${(Math.PI * g.mn / 2).toFixed(3)} mm | L = ${g.L.toFixed(2)} mm`, 24, 90);
        } else {
            ctx.fillText(`TRỤC VÍT - BÁNH VÍT (${typeNames[g.toothType] || 'ZN'})`, 24, 34);
            ctx.fillStyle = '#e2e8f0';
            ctx.font = '11px Inter, sans-serif';
            ctx.fillText(`z1 = ${g.z1} | z2 = ${g.z2} | i = ${g.i.toFixed(2)} | q = ${g.q.toFixed(3)}`, 24, 54);
            ctx.fillText(`mn = ${g.mn.toFixed(3)} mm | mx = ${g.mx.toFixed(3)} mm | γ = ${g.gama.toFixed(3)}°`, 24, 72);
            ctx.fillText(`a = ${g.a.toFixed(3)} mm | d1 = ${g.d1.toFixed(2)} | d2 = ${g.d2.toFixed(2)} | η = ${g.etages_pct.toFixed(2)}%`, 24, 90);
        }
        ctx.restore();
    }

    // =========================================================================
    // 100% OFFLINE DXF RELEASE 12 (AC1009) EXPORTER (Exact DXF.bas Port)
    // =========================================================================
    exportDXF(mode = 'assembly_front') {
        if (!this.geom) return;
        const g = this.geom;
        const entities = [];

        const addLine = (x1, y1, x2, y2, layer = 'OUTLINE') => {
            entities.push(
                `0\nLINE\n8\n${layer}\n10\n${x1.toFixed(6)}\n20\n${y1.toFixed(6)}\n30\n0.0\n11\n${x2.toFixed(6)}\n21\n${y2.toFixed(6)}\n31\n0.0`
            );
        };
        const addCircle = (cx, cy, r, layer = 'OUTLINE') => {
            entities.push(
                `0\nCIRCLE\n8\n${layer}\n10\n${cx.toFixed(6)}\n20\n${cy.toFixed(6)}\n30\n0.0\n40\n${r.toFixed(6)}`
            );
        };
        const addArc = (cx, cy, r, startDeg, endDeg, layer = 'OUTLINE') => {
            entities.push(
                `0\nARC\n8\n${layer}\n10\n${cx.toFixed(6)}\n20\n${cy.toFixed(6)}\n30\n0.0\n40\n${r.toFixed(6)}\n50\n${startDeg.toFixed(6)}\n51\n${endDeg.toFixed(6)}`
            );
        };
        const addText = (x, y, h, text, layer = 'TEXT') => {
            entities.push(
                `0\nTEXT\n8\n${layer}\n10\n${x.toFixed(6)}\n20\n${y.toFixed(6)}\n30\n0.0\n40\n${h.toFixed(4)}\n1\n${text}`
            );
        };

        // Helper: Wheel(x1, y1, d1, d2, d3, d4, isWorm) from DXF.bas lines 232-246
        const dxfWheel = (x1, y1, d1, d2, d3, d4, isWorm) => {
            const lap = d1 * 0.08;
            addCircle(x1, y1, d1 / 2.0, 'OUTLINE');
            addCircle(x1, y1, d2 / 2.0, 'AXIS');
            addCircle(x1, y1, d3 / 2.0, isWorm ? 'OUTLINE' : 'INVISIBLE');
            if (!isWorm && d4 > 0) {
                addCircle(x1, y1, d4 / 2.0, 'INVISIBLE');
            }
            addLine(x1 - d1 / 2.0 - lap, y1, x1 + d1 / 2.0 + lap, y1, 'AXIS');
            addLine(x1, y1 - d1 / 2.0 - lap, x1, y1 + d1 / 2.0 + lap, 'AXIS');
        };

        // Helper: Worm(x1, y1) from DXF.bas lines 258-280
        const dxfWorm = (x1, y1) => {
            const { da1, d1, df1, l1, l2, L, Shaft_ds: ds, Shaft_th: th, DXF_Beta } = g;
            addLine(x1 - l1, y1, x1 + l2, y1, 'AXIS');
            addLine(x1 - l1, y1 + df1 / 2.0, x1 - l1, y1 - df1 / 2.0, 'AXIS');
            addLine(x1 + l2, y1 + df1 / 2.0, x1 + l2, y1 - df1 / 2.0, 'AXIS');
            addLine(x1 - L / 2.0, y1 + d1 / 2.0, x1 + L / 2.0, y1 + d1 / 2.0, 'AXIS');
            addLine(x1 - L / 2.0, y1 - d1 / 2.0, x1 + L / 2.0, y1 - d1 / 2.0, 'AXIS');

            const miLine = (ax, ay, bx, by) => {
                addLine(ax, ay, bx, by, 'OUTLINE');
                addLine(ax, 2 * y1 - ay, bx, 2 * y1 - by, 'OUTLINE');
                addLine(2 * x1 - ax, ay, 2 * x1 - bx, by, 'OUTLINE');
                addLine(2 * x1 - ax, 2 * y1 - ay, 2 * x1 - bx, 2 * y1 - by, 'OUTLINE');
            };
            miLine(x1 - L / 2.0 - th, y1 + ds / 2.0, x1 - L / 2.0, y1 + ds / 2.0);
            miLine(x1 - L / 2.0 - th, y1 + ds / 2.0, x1 - L / 2.0 - th, y1);
            miLine(x1 - L / 2.0, y1 + df1 / 2.0, x1 - L / 2.0, y1);
            miLine(x1 - L / 2.0, y1 + df1 / 2.0, x1, y1 + df1 / 2.0);
            const tmp = Math.tan((DXF_Beta * Math.PI) / 180.0) * ((da1 - df1) / 2.0);
            miLine(x1 - L / 2.0, y1 + df1 / 2.0, x1 - L / 2.0 + tmp, y1 + da1 / 2.0);
            miLine(x1 - L / 2.0 + tmp, y1 + da1 / 2.0, x1, y1 + da1 / 2.0);
        };

        // Helper: WWheel(x1, y1) from DXF.bas lines 305-354
        const dxfWWheel = (x1, y1) => {
            const { da2, dm2, df2, b2H: b2h, a, mn: m } = g;
            const de2 = Math.max(g.de2, 1.001 * da2);
            addLine(x1, y1 + a, x1, y1 - a, 'AXIS');
            addLine(x1 - b2h / 2.0, y1, x1 + b2h / 2.0, y1, 'AXIS');
            addLine(x1 - m / 4.0, y1 + a, x1 + m / 4.0, y1 + a, 'AXIS');
            addLine(x1 - m / 4.0, y1 - a, x1 + m / 4.0, y1 - a, 'AXIS');

            const r1 = a - da2 / 2.0;
            const r2 = a - dm2 / 2.0;
            const r3 = a - df2 / 2.0;
            const v1 = Math.max(0.01, r1 - (a - de2 / 2.0));
            const v2 = Math.max(0.01, r2 - (a - de2 / 2.0));
            const v4 = r3 - 0.5 * Math.sqrt(Math.max(0.0, 4.0 * r3 * r3 - b2h * b2h));
            const b1 = Math.min(b2h / 2.0, Math.sqrt(Math.max(0.0, v1 * (2.0 * r1 - v1))));
            const b2 = Math.min(b2h / 2.0, Math.sqrt(Math.max(0.0, v2 * (2.0 * r2 - v2))));
            const b4 = (b2h / 2.0) * (r1 / r3);

            // Top and bottom throat arcs & rim lines
            [-1, 1].forEach(sy => {
                const wy = y1 + sy * a;
                const deg1 = (Math.atan2(-sy * (r3 - v4), -b2h / 2.0) * 180.0) / Math.PI;
                const deg2 = (Math.atan2(-sy * (r3 - v4), b2h / 2.0) * 180.0) / Math.PI;
                addArc(x1, wy, r3, sy > 0 ? deg1 : deg2, sy > 0 ? deg2 : deg1, 'OUTLINE');

                const degT1 = (Math.atan2(-sy * (r1 - v1), -b1) * 180.0) / Math.PI;
                const degT2 = (Math.atan2(-sy * (r1 - v1), b1) * 180.0) / Math.PI;
                addArc(x1, wy, r1, sy > 0 ? degT1 : degT2, sy > 0 ? degT2 : degT1, 'OUTLINE');

                const degP1 = (Math.atan2(-sy * (r2 - v2), -b2) * 180.0) / Math.PI;
                const degP2 = (Math.atan2(-sy * (r2 - v2), b2) * 180.0) / Math.PI;
                addArc(x1, wy, r2, sy > 0 ? degP1 : degP2, sy > 0 ? degP2 : degP1, 'AXIS');

                addLine(x1 - b2h / 2.0, y1 + sy * (df2 / 2.0 + v4), x1 - b2h / 2.0, y1, 'OUTLINE');
                addLine(x1 + b2h / 2.0, y1 + sy * (df2 / 2.0 + v4), x1 + b2h / 2.0, y1, 'OUTLINE');
                addLine(x1 - b2h / 2.0, y1 + sy * (df2 / 2.0 + v4), x1 - b4, y1 + sy * (da2 / 2.0 + v1), 'OUTLINE');
                addLine(x1 + b2h / 2.0, y1 + sy * (df2 / 2.0 + v4), x1 + b4, y1 + sy * (da2 / 2.0 + v1), 'OUTLINE');
                addLine(x1 - b4, y1 + sy * (da2 / 2.0 + v1), x1 - b1, y1 + sy * (da2 / 2.0 + v1), 'OUTLINE');
                addLine(x1 + b4, y1 + sy * (da2 / 2.0 + v1), x1 + b1, y1 + sy * (da2 / 2.0 + v1), 'OUTLINE');
            });
        };

        if (mode === 'normal_profile') {
            const mn = g.mn;
            const alfanRad = (g.toothType === 1
                ? Math.atan(Math.tan((g.alfax || 20) * Math.PI / 180.0) * Math.cos((g.gama || 0) * Math.PI / 180.0))
                : (g.alfa0 || 20) * Math.PI / 180.0);
            const alfanDeg = (alfanRad * 180.0) / Math.PI;
            const pn = Math.PI * mn;
            const sn = pn / 2.0;
            const en = pn / 2.0;
            const ha1 = (g.da1 - g.d1) / 2.0;
            const hf1 = (g.d1 - g.df1) / 2.0;
            const rhof0 = 0.38 * mn;
            const tanA = Math.tan(alfanRad);
            const sinA = Math.sin(alfanRad);
            const cosA = Math.cos(alfanRad);
            const san = Math.max(0.08 * mn, sn - 2.0 * ha1 * tanA);
            const yStock = -hf1 - 1.5 * mn;

            const xL = -2.5 * pn;
            const xR = 2.5 * pn;
            addLine(xL, 0, xR, 0, 'PITCH_LINE');
            addLine(xL, ha1, xR, ha1, 'LIMIT_LINES');
            addLine(xL, -hf1, xR, -hf1, 'LIMIT_LINES');
            addLine(xL, yStock, xR, yStock, 'OUTLINE');
            addLine(xL, yStock, xL, -hf1, 'OUTLINE');
            addLine(xR, yStock, xR, -hf1, 'OUTLINE');

            const teeth = [-2, -1, 0, 1, 2];
            teeth.forEach(k => {
                const xk = k * pn;
                addLine(xk, yStock, xk, ha1 + mn * 0.5, 'AXIS');

                const xRootL = xk - sn / 2.0 - hf1 * tanA;
                const xRootR = xk + sn / 2.0 + hf1 * tanA;
                const xTipL = xk - san / 2.0;
                const xTipR = xk + san / 2.0;

                const xcL = xRootL - rhof0 * ((1.0 - sinA) / cosA);
                const xcR = xRootR + rhof0 * ((1.0 - sinA) / cosA);
                const xtL = xRootL + rhof0 * (1.0 - sinA) * tanA;
                const xtR = xRootR - rhof0 * (1.0 - sinA) * tanA;
                const ytL = -hf1 + rhof0 * (1.0 - sinA);
                const ytR = -hf1 + rhof0 * (1.0 - sinA);

                // Flanks & Tip
                addLine(xtL, ytL, xTipL, ha1, 'OUTLINE');
                addLine(xTipL, ha1, xTipR, ha1, 'OUTLINE');
                addLine(xTipR, ha1, xtR, ytR, 'OUTLINE');

                // Fillet arcs
                addArc(xcL, -hf1 + rhof0, rhof0, 270.0, 360.0 - alfanDeg, 'OUTLINE');
                addArc(xcR, -hf1 + rhof0, rhof0, 180.0 + alfanDeg, 270.0, 'OUTLINE');

                // Root land between teeth
                if (k < 2) {
                    const nextXk = (k + 1) * pn;
                    const nextXRootL = nextXk - sn / 2.0 - hf1 * tanA;
                    const nextXcL = nextXRootL - rhof0 * ((1.0 - sinA) / cosA);
                    addLine(xcR, -hf1, nextXcL, -hf1, 'OUTLINE');
                }
            });

            // Dimensions on DIMS layer
            addLine(-pn / 2.0, ha1 + mn * 0.4, pn / 2.0, ha1 + mn * 0.4, 'DIMS');
            addText(0, ha1 + mn * 0.45, mn * 0.28, `pn = ${pn.toFixed(4)} mm`, 'DIMS');

            addLine(-sn / 2.0, 0, sn / 2.0, 0, 'DIMS');
            addText(0, mn * 0.15, mn * 0.26, `sn = ${sn.toFixed(4)} mm`, 'DIMS');

            addLine(-1.6 * pn, 0, -1.6 * pn, ha1, 'DIMS');
            addText(-1.6 * pn - mn * 0.8, ha1 / 2.0, mn * 0.26, `ha1 = ${ha1.toFixed(3)} mm`, 'DIMS');

            addLine(-1.6 * pn, 0, -1.6 * pn, -hf1, 'DIMS');
            addText(-1.6 * pn - mn * 0.8, -hf1 / 2.0, mn * 0.26, `hf1 = ${hf1.toFixed(3)} mm`, 'DIMS');

            // Manufacturing Parameter Table on MFG_TABLE layer
            const tblX = xR + mn * 1.5;
            let tblY = ha1 + mn * 0.8;
            const rows = [
                `WORM NORMAL TOOTH PROFILE (DIN 3975 / DIN 3996)`,
                `Normal Module mn: ${mn.toFixed(4)} mm`,
                `Normal Pressure Angle alfan: ${alfanDeg.toFixed(4)} deg`,
                `Normal Pitch pn: ${pn.toFixed(4)} mm`,
                `Normal Tooth Thickness sn: ${sn.toFixed(4)} mm`,
                `Normal Space Width en: ${en.toFixed(4)} mm`,
                `Addendum ha1: ${ha1.toFixed(3)} mm`,
                `Dedendum hf1: ${hf1.toFixed(3)} mm`,
                `Whole Tooth Depth h1: ${(ha1 + hf1).toFixed(3)} mm`,
                `Root Fillet Radius rhof0: ${rhof0.toFixed(3)} mm (0.38*mn)`,
                `Tip Land Width san: ${san.toFixed(3)} mm`,
                `Root Land Width efn: ${(en - 2.0 * hf1 * tanA).toFixed(3)} mm`
            ];
            rows.forEach(r => {
                addText(tblX, tblY, mn * 0.30, r, 'MFG_TABLE');
                tblY -= mn * 0.58;
            });
        } else if (mode === 'axial_profile') {
            const { mx, px, alfax, gama, sx1: sx, da1, d1, df1, L, l1, l2, Shaft_ds: ds, Shaft_th: th, DXF_Beta } = g;
            const ha1 = (da1 - d1) / 2.0;
            const hf1 = (d1 - df1) / 2.0;
            const alfaxRad = (alfax * Math.PI) / 180.0;
            const tanAx = Math.tan(alfaxRad);
            const sa1 = Math.max(0.08 * mx, sx - 2.0 * ha1 * tanAx);

            // Centerline
            addLine(-l1 - 5, 0, l2 + 5, 0, 'AXIS');

            // Pitch lines
            addLine(-L / 2.0, d1 / 2.0, L / 2.0, d1 / 2.0, 'PITCH_LINE');
            addLine(-L / 2.0, -d1 / 2.0, L / 2.0, -d1 / 2.0, 'PITCH_LINE');

            // Tip & Root lines
            addLine(-L / 2.0, da1 / 2.0, L / 2.0, da1 / 2.0, 'LIMIT_LINES');
            addLine(-L / 2.0, -da1 / 2.0, L / 2.0, -da1 / 2.0, 'LIMIT_LINES');
            addLine(-L / 2.0, df1 / 2.0, L / 2.0, df1 / 2.0, 'LIMIT_LINES');
            addLine(-L / 2.0, -df1 / 2.0, L / 2.0, -df1 / 2.0, 'LIMIT_LINES');

            // Shaft shoulders and extensions
            addLine(-l1, ds / 2.0, -L / 2.0 - th, ds / 2.0, 'OUTLINE');
            addLine(-l1, -ds / 2.0, -L / 2.0 - th, -ds / 2.0, 'OUTLINE');
            addLine(-l1, -ds / 2.0, -l1, ds / 2.0, 'OUTLINE');

            addLine(L / 2.0 + th, ds / 2.0, l2, ds / 2.0, 'OUTLINE');
            addLine(L / 2.0 + th, -ds / 2.0, l2, -ds / 2.0, 'OUTLINE');
            addLine(l2, -ds / 2.0, l2, ds / 2.0, 'OUTLINE');

            // Shoulders
            addLine(-L / 2.0 - th, ds / 2.0, -L / 2.0 - th, df1 / 2.0, 'OUTLINE');
            addLine(-L / 2.0 - th, -ds / 2.0, -L / 2.0 - th, -df1 / 2.0, 'OUTLINE');
            addLine(-L / 2.0 - th, df1 / 2.0, -L / 2.0, df1 / 2.0, 'OUTLINE');
            addLine(-L / 2.0 - th, -df1 / 2.0, -L / 2.0, -df1 / 2.0, 'OUTLINE');

            addLine(L / 2.0, df1 / 2.0, L / 2.0 + th, df1 / 2.0, 'OUTLINE');
            addLine(L / 2.0, -df1 / 2.0, L / 2.0 + th, -df1 / 2.0, 'OUTLINE');
            addLine(L / 2.0 + th, ds / 2.0, L / 2.0 + th, df1 / 2.0, 'OUTLINE');
            addLine(L / 2.0 + th, -ds / 2.0, L / 2.0 + th, -df1 / 2.0, 'OUTLINE');

            // End chamfers
            const ch = Math.tan((DXF_Beta * Math.PI) / 180.0) * ((da1 - df1) / 2.0);
            addLine(-L / 2.0, df1 / 2.0, -L / 2.0 + ch, da1 / 2.0, 'OUTLINE');
            addLine(L / 2.0, df1 / 2.0, L / 2.0 - ch, da1 / 2.0, 'OUTLINE');
            addLine(-L / 2.0, -df1 / 2.0, -L / 2.0 + ch, -da1 / 2.0, 'OUTLINE');
            addLine(L / 2.0, -df1 / 2.0, L / 2.0 - ch, -da1 / 2.0, 'OUTLINE');

            // Upper & Lower teeth along [-L/2 + ch, L/2 - ch]
            const nP = Math.ceil(L / px) + 1;
            for (let k = -nP; k <= nP; k++) {
                const xcTop = k * px;
                const xL_flank = xcTop - sa1 / 2.0;
                const xR_flank = xcTop + sa1 / 2.0;
                const xL_root = xcTop - sx / 2.0 - hf1 * tanAx;
                const xR_root = xcTop + sx / 2.0 + hf1 * tanAx;

                if (xL_root >= -L / 2.0 && xR_root <= L / 2.0) {
                    addLine(xL_root, df1 / 2.0, xL_flank, da1 / 2.0, 'OUTLINE');
                    addLine(xL_flank, da1 / 2.0, xR_flank, da1 / 2.0, 'OUTLINE');
                    addLine(xR_flank, da1 / 2.0, xR_root, df1 / 2.0, 'OUTLINE');
                }

                const xcBot = xcTop + (g.z1 % 2 === 1 ? px / 2.0 : 0.0);
                const xL_bflank = xcBot - sa1 / 2.0;
                const xR_bflank = xcBot + sa1 / 2.0;
                const xL_broot = xcBot - sx / 2.0 - hf1 * tanAx;
                const xR_broot = xcBot + sx / 2.0 + hf1 * tanAx;

                if (xL_broot >= -L / 2.0 && xR_broot <= L / 2.0) {
                    addLine(xL_broot, -df1 / 2.0, xL_bflank, -da1 / 2.0, 'OUTLINE');
                    addLine(xL_bflank, -da1 / 2.0, xR_bflank, -da1 / 2.0, 'OUTLINE');
                    addLine(xR_bflank, -da1 / 2.0, xR_broot, -df1 / 2.0, 'OUTLINE');
                }
            }

            // Dimensions on DIMS layer
            addLine(-L / 2.0, da1 / 2.0 + 8, L / 2.0, da1 / 2.0 + 8, 'DIMS');
            addText(0, da1 / 2.0 + 10, 3.5, `L = ${L.toFixed(3)} mm`, 'DIMS');

            addLine(-L / 2.0 - 15, -da1 / 2.0, -L / 2.0 - 15, da1 / 2.0, 'DIMS');
            addText(-L / 2.0 - 25, 0, 3.5, `da1 = ${da1.toFixed(3)} mm`, 'DIMS');

            addLine(-L / 2.0 - 8, -d1 / 2.0, -L / 2.0 - 8, d1 / 2.0, 'DIMS');
            addText(-L / 2.0 - 12, 0, 3.0, `d1 = ${d1.toFixed(3)} mm`, 'DIMS');

            // Manufacturing Parameter Table on MFG_TABLE layer
            const tblX = l2 + 15;
            let tblY = da1 / 2.0 + 8;
            const rows = [
                `WORM AXIAL TOOTH PROFILE A-A (DIN 3975)`,
                `Axial Module mx: ${mx.toFixed(4)} mm`,
                `Axial Pressure Angle alfax: ${alfax.toFixed(4)} deg`,
                `Lead Angle gama: ${gama.toFixed(4)} deg`,
                `Axial Pitch px: ${px.toFixed(4)} mm`,
                `Axial Tooth Thickness sx: ${sx.toFixed(4)} mm`,
                `Pitch Diameter d1: ${d1.toFixed(3)} mm`,
                `Tip Diameter da1: ${da1.toFixed(3)} mm`,
                `Root Diameter df1: ${df1.toFixed(3)} mm`,
                `Worm Thread Length L: ${L.toFixed(3)} mm`,
                `Shaft Shoulder Diameter ds: ${ds.toFixed(2)} mm`,
                `End Chamfer Angle: ${DXF_Beta} deg`
            ];
            rows.forEach(r => {
                addText(tblX, tblY, 3.2, r, 'MFG_TABLE');
                tblY -= 6.5;
            });
        } else if (mode === 'tangential_profile') {
            const { mx, mn, px, alfax, gama, sx1: sx, da1, d1, df1, L, l1, l2, Shaft_ds: ds, Shaft_th: th, DXF_Beta } = g;
            const pn = Math.PI * mn;
            const sn = pn / 2.0;
            const alfaxRad = (alfax * Math.PI) / 180.0;
            const gamaRad = (gama * Math.PI) / 180.0;
            const tanAx = Math.tan(alfaxRad);
            const tanGama = Math.tan(gamaRad);
            const r1 = d1 / 2.0;
            const ra1 = da1 / 2.0;
            const wt = Math.sqrt(Math.max(0, ra1 * ra1 - r1 * r1));
            const bt = 2.0 * wt;
            const beta = DXF_Beta || 15.0;
            const ch = Math.tan((beta * Math.PI) / 180.0) * ((da1 - d1) / 2.0);
            const handSign = (parseInt(g.teethOrientation) === 2) ? -1.0 : 1.0;

            // 1. Centerline along worm axis / Pitch generator line (y = d1/2)
            addLine(-l1 - 5, 0, l2 + 5, 0, 'AXIS');

            // 2. Tangent Cut Boundary Lines (Z = +wt and Z = -wt)
            addLine(-L / 2.0 + ch, wt, L / 2.0 - ch, wt, 'LIMIT_LINES');
            addLine(-L / 2.0 + ch, -wt, L / 2.0 - ch, -wt, 'LIMIT_LINES');
            addLine(-L / 2.0, 0, -L / 2.0 + ch, wt, 'LIMIT_LINES');
            addLine(-L / 2.0, 0, -L / 2.0 + ch, -wt, 'LIMIT_LINES');
            addLine(L / 2.0, 0, L / 2.0 - ch, wt, 'LIMIT_LINES');
            addLine(L / 2.0, 0, L / 2.0 - ch, -wt, 'LIMIT_LINES');

            // Ghost outer cylinder bounds
            addLine(-L / 2.0, da1 / 2.0, L / 2.0, da1 / 2.0, 'PITCH_LINE');
            addLine(-L / 2.0, -da1 / 2.0, L / 2.0, -da1 / 2.0, 'PITCH_LINE');

            // Shaft shoulders and extensions
            addLine(-l1, ds / 2.0, -L / 2.0 - th, ds / 2.0, 'OUTLINE');
            addLine(-l1, -ds / 2.0, -L / 2.0 - th, -ds / 2.0, 'OUTLINE');
            addLine(-l1, -ds / 2.0, -l1, ds / 2.0, 'OUTLINE');
            addLine(L / 2.0 + th, ds / 2.0, l2, ds / 2.0, 'OUTLINE');
            addLine(L / 2.0 + th, -ds / 2.0, l2, -ds / 2.0, 'OUTLINE');
            addLine(l2, -ds / 2.0, l2, ds / 2.0, 'OUTLINE');

            // Shoulders
            addLine(-L / 2.0 - th, ds / 2.0, -L / 2.0 - th, df1 / 2.0, 'OUTLINE');
            addLine(-L / 2.0 - th, -ds / 2.0, -L / 2.0 - th, -df1 / 2.0, 'OUTLINE');
            addLine(-L / 2.0 - th, df1 / 2.0, -L / 2.0, df1 / 2.0, 'OUTLINE');
            addLine(-L / 2.0 - th, -df1 / 2.0, -L / 2.0, -df1 / 2.0, 'OUTLINE');
            addLine(L / 2.0, df1 / 2.0, L / 2.0 + th, df1 / 2.0, 'OUTLINE');
            addLine(L / 2.0, -df1 / 2.0, L / 2.0 + th, -df1 / 2.0, 'OUTLINE');
            addLine(L / 2.0 + th, ds / 2.0, L / 2.0 + th, df1 / 2.0, 'OUTLINE');
            addLine(L / 2.0 + th, -ds / 2.0, L / 2.0 + th, -df1 / 2.0, 'OUTLINE');

            // 3. Teeth ribbons across tangent plane
            const nP = Math.ceil(L / px) + 2;
            const numSteps = 10;
            for (let k = -nP; k <= nP; k++) {
                const xk = k * px;
                const ptsR = [];
                const ptsL = [];

                for (let i = 0; i <= numSteps; i++) {
                    const zVal = -wt + (2.0 * wt * i) / numSteps;
                    const rz = Math.sqrt(r1 * r1 + zVal * zVal);
                    const deltaR = Math.max(0, rz - r1);
                    const sxz = Math.max(0.08 * mx, sx - 2.0 * deltaR * tanAx);
                    const xc = xk + handSign * zVal * tanGama;
                    ptsR.push({ x: xc + sxz / 2.0, z: zVal });
                    ptsL.push({ x: xc - sxz / 2.0, z: zVal });
                }

                // Only draw if inside [-L/2, L/2]
                const xMid = xk;
                if (xMid >= -L / 2.0 - px && xMid <= L / 2.0 + px) {
                    for (let i = 0; i < ptsR.length - 1; i++) {
                        addLine(ptsR[i].x, ptsR[i].z, ptsR[i + 1].x, ptsR[i + 1].z, 'OUTLINE');
                    }
                    for (let i = 0; i < ptsL.length - 1; i++) {
                        addLine(ptsL[i].x, ptsL[i].z, ptsL[i + 1].x, ptsL[i + 1].z, 'OUTLINE');
                    }
                    addLine(ptsL[ptsL.length - 1].x, wt, ptsR[ptsR.length - 1].x, wt, 'OUTLINE');
                    addLine(ptsL[0].x, -wt, ptsR[0].x, -wt, 'OUTLINE');

                    if (xk >= -L / 2.0 && xk <= L / 2.0) {
                        addCircle(xk, 0, 0.6 * mx, 'PITCH_LINE');
                    }
                }
            }

            // Dimensions on DIMS layer
            addLine(-L / 2.0, wt + 8.0, L / 2.0, wt + 8.0, 'DIMS');
            addText(0, wt + 10.0, 3.5, `L = ${L.toFixed(3)} mm`, 'DIMS');

            addLine(-L / 2.0 - 15, -wt, -L / 2.0 - 15, wt, 'DIMS');
            addText(-L / 2.0 - 25, 0, 3.5, `Bt = ${bt.toFixed(3)} mm`, 'DIMS');

            addLine(0, 0, px, 0, 'DIMS');
            addText(px / 2.0, 1.5, 3.0, `px = ${px.toFixed(4)} mm`, 'DIMS');

            addLine(-sx / 2.0, -2.5, sx / 2.0, -2.5, 'DIMS');
            addText(0, -5.5, 3.0, `sx = ${sx.toFixed(4)} mm`, 'DIMS');

            // Manufacturing Parameter Table on MFG_TABLE layer
            const tblX = l2 + 15;
            let tblY = wt + 8.0;
            const rows = [
                `WORM PITCH CYLINDER TANGENT SECTION T-T (DIN 3975)`,
                `Tangent Plane Position y: ${(d1 / 2.0).toFixed(4)} mm`,
                `Contact Slice Width Bt: ${bt.toFixed(4)} mm`,
                `Lead Angle gama: ${gama.toFixed(4)} deg`,
                `Axial Module mx: ${mx.toFixed(4)} mm`,
                `Axial Pitch px: ${px.toFixed(4)} mm`,
                `Normal Module mn: ${mn.toFixed(4)} mm`,
                `Normal Pitch pn: ${pn.toFixed(4)} mm`,
                `Axial Tooth Thickness sx: ${sx.toFixed(4)} mm`,
                `Normal Tooth Thickness sn: ${sn.toFixed(4)} mm`,
                `Pitch Diameter d1: ${d1.toFixed(3)} mm`,
                `Tip Diameter da1: ${da1.toFixed(3)} mm`,
                `Thread Length L: ${L.toFixed(3)} mm`,
                `Number of Threads z1: ${g.z1}`
            ];
            rows.forEach(r => {
                addText(tblX, tblY, 3.2, r, 'MFG_TABLE');
                tblY -= 6.5;
            });
        } else if (mode === 'worm_left') {
            dxfWheel(0, 0, g.da1, g.d1, g.df1, 0, true);
        } else if (mode === 'worm_front' || mode === 'worm') {
            dxfWorm(0, 0);
        } else if (mode === 'gear_front') {
            dxfWheel(0, 0, g.de2, g.d2, g.da2, g.df2, false);
        } else if (mode === 'gear_left' || mode === 'wheel') {
            dxfWWheel(0, 0);
        } else if (mode === 'assembly_left') {
            dxfWheel(0, -g.a, g.da1, g.d1, g.df1, 0, true);
            dxfWWheel(0, 0);
        } else {
            // Default: assembly_front + assembly_left + parameter table
            dxfWheel(0, 0, g.de2, g.d2, g.da2, g.df2, false);
            dxfWorm(0, -g.a);
            const offsetX = g.chartData1.C9;
            dxfWheel(offsetX, -g.a, g.da1, g.d1, g.df1, 0, true);
            dxfWWheel(offsetX, 0);

            // Parameter table on the right
            const tx = offsetX + g.b2H + 40;
            let ty = g.de2 / 2.0;
            const rows = [
                `WORM GEARING PARAMETERS (DIN 3975 / DIN 3996)`,
                `Worm Type: ${g.toothType === 1 ? 'ZA' : 'ZN'} | z1 = ${g.z1} | z2 = ${g.z2} | i = ${g.i}`,
                `Module mn = ${g.mn.toFixed(4)} mm | mx = ${g.mx.toFixed(4)} mm`,
                `Pressure angle alfa0 = ${g.alfa0} deg | Lead angle gama = ${g.gama.toFixed(4)} deg`,
                `Center distance a = ${g.a.toFixed(3)} mm | x2 = ${g.x2.toFixed(4)}`,
                `Worm: d1 = ${g.d1.toFixed(3)} | da1 = ${g.da1.toFixed(3)} | df1 = ${g.df1.toFixed(3)} | L = ${g.L.toFixed(3)}`,
                `Wheel: d2 = ${g.d2.toFixed(3)} | da2 = ${g.da2.toFixed(3)} | df2 = ${g.df2.toFixed(3)} | de2 = ${g.de2.toFixed(3)} | b2H = ${g.b2H.toFixed(2)}`,
                `Materials: ${g.dxf_worm_mat} / ${g.dxf_wheel_mat}`
            ];
            rows.forEach((line) => {
                addText(tx, ty, 3.5, line);
                ty -= 8.0;
            });
        }

        const dxfString = [
            "0\nSECTION\n2\nHEADER\n9\n$ACADVER\n1\nAC1009\n0\nENDSEC",
            "0\nSECTION\n2\nENTITIES",
            entities.join("\n"),
            "0\nENDSEC\n0\nEOF\n"
        ].join("\n");

        const blob = new Blob([dxfString], { type: 'application/dxf' });
        const url = URL.createObjectURL(blob);
        const aTag = document.createElement('a');
        aTag.href = url;
        aTag.download = `MITCalc_WormGear_${mode}_z${g.z1}x${g.z2}_m${g.mn.toFixed(2)}.dxf`;
        document.body.appendChild(aTag);
        aTag.click();
        document.body.removeChild(aTag);
        URL.revokeObjectURL(url);
    }
}

if (typeof window !== 'undefined') {
    window.WormCanvasRenderer = WormCanvasRenderer;
}



/**
 * ============================================================================
 * MITCALC WEB APP - 3D WORM GEAR SOLID & SURFACE MESH GENERATOR (V5 - PURE LITVIN ENVELOPE)
 * ============================================================================
 * Built strictly following MITCalc 1.74's authentic engineering standards & CAD specifications:
 * 
 * 1. Standards & Geometry:
 *    - DIN 3975: Definitions and parameters of cylindrical worm gears
 *    - DIN 3996: Calculation of load capacity of cylindrical worm gears
 *    - ANSI/AGMA 6022-C93: Design of General Industrial Gearing
 * 
 * 2. Worm 1 (ZA Archimedean Helicoid):
 *    - Ground alloy steel solid shaft with shoulders (MC_ds1, MC_t1), extensions (l1, l2), bore.
 *    - Archimedean thread with straight trapezoidal profile in axial section (MC_alfa = 20 deg).
 *    - Linear end chamfer angle beta = 10 deg (Section 19.4 DXF_Beta).
 *    - Pitch thread lead pz = px * z1, lead angle gamma = atan(z1 * mn / d1).
 *    - Tooth centered at x = 0 facing towards wheel at (0, -r1, 0) with phi0 = 0.
 * 
 * 3. Globoid Throated Worm Wheel 2 (Bánh Vít Họng Lõm Chuẩn MITCalc):
 *    - Authentic 3-branch throated blank body from MITCalc DXF.bas!WWheel:
 *      r1 = a - da2/2 (tip throat), r2 = a - d2/2 (pitch throat), r3 = a - df2/2 (root throat).
 *    - 100% Watertight Closed Manifold Solid Body.
 *    - FLAT SMOOTH ANNULAR END CAPS (z = -halfB & +halfB): Concentric annular rings with normal [0, 0, +-1].
 *      Eliminates all spoke-like radial grooves and honeycomb artifacts.
 *    - Exact Litvin Conjugate Flank Envelope (n1 . v^(12) = 0):
 *      * Closed-form kinematic meshing solution for Archimedean worm & wheel.
 *      * Differential tooth space widening across face width z (eliminates all gouging / undercut).
 *      * Tapered teeth: thicker at root, thinner at tip, matching axial pitch px.
 *      * Pure analytical conjugate flanks with zero clearance error (Delta = 0.000000 mm).
 *      * Built-in 0.04 mm engineering backlash for smooth, jam-free real-time 3D simulation.
 * 
 * 4. PBR Materials & Visualizer Support:
 *    - Worm 1 Solid: Cobalt-Cyan Alloy Steel (#0284c7)
 *    - Wheel 2 Solid: Tin-Bronze CuSn12Ni2 (#ea580c)
 *    - NO vertex colors, NO paint/smears, 100% pure authentic CAD rendering.
 * ============================================================================
 */

const Worm3DGenerator = {
    getDensitySettings(level = 8, z1 = 1, z2 = 40) {
        const lvl = Math.max(1, Math.min(10, parseInt(level) || 8));
        const table = {
            1: { wormSlices: 60,  wormPtsR: 8,  wormTipPts: 6,  wheelSlices: 25, wheelPtsR: 8,  wheelTipPts: 2, boreSegs: 60 },
            2: { wormSlices: 80,  wormPtsR: 10, wormTipPts: 6,  wheelSlices: 31, wheelPtsR: 10, wheelTipPts: 2, boreSegs: 72 },
            3: { wormSlices: 100, wormPtsR: 12, wormTipPts: 8,  wheelSlices: 39, wheelPtsR: 12, wheelTipPts: 3, boreSegs: 84 },
            4: { wormSlices: 130, wormPtsR: 14, wormTipPts: 8,  wheelSlices: 47, wheelPtsR: 14, wheelTipPts: 3, boreSegs: 96 },
            5: { wormSlices: 160, wormPtsR: 16, wormTipPts: 10, wheelSlices: 57, wheelPtsR: 16, wheelTipPts: 4, boreSegs: 110 },
            6: { wormSlices: 200, wormPtsR: 20, wormTipPts: 10, wheelSlices: 69, wheelPtsR: 20, wheelTipPts: 4, boreSegs: 128 },
            7: { wormSlices: 240, wormPtsR: 24, wormTipPts: 12, wheelSlices: 81, wheelPtsR: 24, wheelTipPts: 5, boreSegs: 144 },
            8: { wormSlices: 280, wormPtsR: 28, wormTipPts: 14, wheelSlices: 95, wheelPtsR: 28, wheelTipPts: 5, boreSegs: 160 },
            9: { wormSlices: 320, wormPtsR: 32, wormTipPts: 16, wheelSlices: 111, wheelPtsR: 32, wheelTipPts: 6, boreSegs: 180 },
            10: { wormSlices: 380, wormPtsR: 36, wormTipPts: 18, wheelSlices: 131, wheelPtsR: 36, wheelTipPts: 6, boreSegs: 200 }
        };
        return table[lvl] || table[8];
    },

    extractMC3DParams(opt = {}) {
        const z1 = Math.max(1, parseInt(opt.MC_z1 ?? opt.z1) || 1);
        const z2 = Math.max(5, parseInt(opt.MC_z2 ?? opt.z2) || 40);
        const mn = parseFloat(opt.mn ?? opt.m) || 4.233333;
        const px = parseFloat(opt.MC_px ?? opt.px) || (Math.PI * mn);
        const a = parseFloat(opt.MC_a ?? opt.a) || 103.36633;

        const d1 = parseFloat(opt.MC_d1 ?? opt.d1) || 36.231497;
        const da1 = parseFloat(opt.MC_da1 ?? opt.da1) || (d1 + 2.0 * mn);
        const df1 = parseFloat(opt.MC_df1 ?? opt.df1) || (d1 - 2.5 * mn);
        const L = parseFloat(opt.MC_L ?? opt.L) || 56.726667;

        const d2 = parseFloat(opt.MC_d2 ?? opt.d2) || 170.501163;
        const dm2 = parseFloat(opt.dm2) || d2;
        const da2 = parseFloat(opt.MC_da2 ?? opt.da2) || 178.96783;
        const df2 = parseFloat(opt.MC_df2 ?? opt.df2) || 159.91783;
        const rawDe2 = parseFloat(opt.MC_de2 ?? opt.de2) || (da2 + 0.8 * mn);
        const de2 = (rawDe2 <= da2) ? (1.001 * da2) : rawDe2;
        const b2H = parseFloat(opt.MC_b2H ?? opt.b2H) || 33.57;

        const alfax_deg = parseFloat(opt.MC_alfa ?? opt.alfax) || 20.126896;
        const alfax_rad = (alfax_deg * Math.PI) / 180.0;

        const sx1_full = parseFloat(opt.sx1) || (0.5 * px);
        const sx2_full = parseFloat(opt.sx2) || (0.5 * px);

        const MC_sx1 = (opt.MC_sx1 !== undefined) ? parseFloat(opt.MC_sx1) : (sx1_full / 2.0);
        const MC_sx2 = (opt.MC_sx2 !== undefined) ? parseFloat(opt.MC_sx2) : (sx2_full / 2.0);

        const MC_ds1 = parseFloat(opt.MC_ds1 ?? opt.Shaft_ds) || 21.4;
        const MC_t1 = parseFloat(opt.MC_t1 ?? opt.Shaft_th) || 1.1;
        const rawBeta = parseFloat(opt.MC_beta1 ?? opt.DXF_Beta);
        const MC_beta1 = (isNaN(rawBeta) ? 10.0 : (rawBeta < 0.001 ? 0.001 : rawBeta));

        const MC_pxn = parseFloat(opt.MC_pxn) || (px * z1);
        const MC_pxnhalf = parseFloat(opt.MC_pxnhalf) || (MC_pxn / 2.0);

        const l1 = Math.max(L * 0.5 + MC_t1 + 8.0, parseFloat(opt.l1) || 50.0);
        const l2 = Math.max(L * 0.5 + MC_t1 + 8.0, parseFloat(opt.l2) || 50.0);
        const handSign = (parseInt(opt.teethOrientation) === 2) ? -1.0 : 1.0;

        const r1 = d1 * 0.5;
        const r2 = d2 * 0.5;
        const rf1 = df1 * 0.5;
        const ra1 = da1 * 0.5;
        const rf2 = df2 * 0.5;
        const ra2 = da2 * 0.5;
        const gamma = Math.atan((z1 * mn) / Math.max(1e-6, d1));

        // Throated blank dimensions from MITCalc DXF.bas!WWheel
        const r_throat_tip = a - 0.5 * da2;
        const r_throat_root = a - 0.5 * df2;
        const r_outer = 0.5 * de2;
        const v1 = r_throat_tip - (a - r_outer);
        const b1 = Math.sqrt(Math.max(0.0, v1 * (2.0 * r_throat_tip - v1)));

        return {
            MC_a: a, MC_px: px, MC_pxn, MC_pxnhalf,
            MC_alfa: alfax_deg, MC_alfa_rad: alfax_rad,
            MC_z1: z1, MC_L: L,
            MC_da1: da1, MC_d1: d1, MC_df1: df1,
            MC_sn1: MC_sx1, MC_sx1, MC_en1: MC_sx1, MC_ex1: MC_sx1,
            MC_ds1, MC_t1, MC_beta1,
            MC_z2: z2, MC_b2H: b2H,
            MC_da2: da2, MC_d2: d2, MC_df2: df2, MC_de2: de2,
            MC_sn2: MC_sx2, MC_sx2, MC_en2: MC_sx2, MC_ex2: MC_sx2,
            mn, dm2, l1, l2, handSign,
            r1, r2, rf1, ra1, rf2, ra2, gamma,
            r_throat_tip, r_throat_root, r_outer, b1,
            ShaftDB2: parseFloat(opt.ShaftDB2) || 0
        };
    },

    evalWormBlankRadius(x, mc) {
        const ra1 = mc.MC_da1 * 0.5;
        const rf1 = mc.MC_df1 * 0.5;
        const halfL = mc.MC_L * 0.5;
        const chamferLen = Math.tan((mc.MC_beta1 * Math.PI) / 180.0) * (ra1 - rf1);
        const absX = Math.abs(x);
        if (absX <= halfL - chamferLen) {
            return ra1;
        } else if (absX <= halfL) {
            if (chamferLen <= 1e-6) return rf1;
            const t = (halfL - absX) / chamferLen;
            return rf1 + t * (ra1 - rf1);
        } else {
            return rf1;
        }
    },

    evalWheelBlank(z, mc) {
        const absZ = Math.abs(z);
        const a = mc.MC_a;
        const da2 = mc.MC_da2;
        const df2 = mc.MC_df2;
        const de2 = mc.MC_de2;
        const b2H = mc.MC_b2H;
        const halfB = b2H * 0.5;

        const r1 = a - da2 * 0.5;
        const r3 = a - df2 * 0.5;

        const v1 = r1 - (a - de2 * 0.5);
        const v3 = r3 - (a - de2 * 0.5);
        const b1 = Math.sqrt(Math.max(0.0, v1 * (2.0 * r1 - v1)));
        const b3 = Math.sqrt(Math.max(0.0, v3 * (2.0 * r3 - v3)));
        const b4 = (halfB * r1) / r3;

        const v4 = r3 - 0.5 * Math.sqrt(Math.max(0.0, 4.0 * r3 * r3 - b2H * b2H));

        let rTip;
        if (halfB > b3) {
            // Case 1: Wide face width (DXF.bas lines 173-180)
            if (absZ <= b1) {
                rTip = a - Math.sqrt(Math.max(0.0, r1 * r1 - absZ * absZ));
            } else if (absZ <= b3) {
                const t = (absZ - b1) / Math.max(1e-6, b3 - b1);
                rTip = (de2 * 0.5) - t * ((de2 * 0.5) - (df2 * 0.5 + v3));
            } else {
                rTip = df2 * 0.5 + v3;
            }
        } else if (halfB < (b1 * r3 / r1)) {
            // Case 2: Narrow face width (DXF.bas lines 182-189)
            const b5 = (halfB * r1) / r3;
            const v5 = r1 - 0.5 * Math.sqrt(Math.max(0.0, 4.0 * r1 * r1 - 4.0 * b5 * b5));
            if (absZ <= b5) {
                rTip = a - Math.sqrt(Math.max(0.0, r1 * r1 - absZ * absZ));
            } else {
                const t = (absZ - b5) / Math.max(1e-6, halfB - b5);
                rTip = (da2 * 0.5 + v5) - t * ((da2 * 0.5 + v5) - (df2 * 0.5 + v4));
            }
        } else {
            // Case 3: Standard MITCalc WWheel geometry with side chamfer (DXF.bas lines 191-198)
            if (absZ <= b1) {
                rTip = a - Math.sqrt(Math.max(0.0, r1 * r1 - absZ * absZ));
            } else if (absZ <= b4) {
                rTip = de2 * 0.5;
            } else {
                // Chamfer / bevel from de2/2 at b4 down to (df2/2 + v4) at halfB (~33.75 deg slope)
                const t = (absZ - b4) / Math.max(1e-6, halfB - b4);
                rTip = (de2 * 0.5) - t * ((de2 * 0.5) - (df2 * 0.5 + v4));
            }
        }

        let rRoot;
        if ((r3 * r3 - absZ * absZ) >= 0) {
            rRoot = a - Math.sqrt(r3 * r3 - absZ * absZ);
        } else {
            rRoot = df2 * 0.5;
        }

        return {
            rTip: Math.max(rRoot + 0.15, rTip),
            rRoot: rRoot
        };
    },

    /**
     * Solves for generating worm radius u for target wheel radius r and axial position z,
     * based on Litvin's analytical meshing equation for Archimedean (ZA) worm gearing:
     * n1 . v^(12) = 0 => x1 = u * (u*cos(Phi) - a + i*p) / N0y.
     */
    solveConjugateUForR(rTarget, z, flankSide, mc) {
        const uLow = Math.max(mc.rf1, Math.abs(z) + 1e-4);
        const uHigh = mc.ra1;
        if (uLow >= uHigh) return null;

        const a = mc.MC_a;
        const ip = (mc.MC_z2 / mc.MC_z1) * (mc.MC_pxn / (2.0 * Math.PI));
        const tanA = Math.tan(mc.MC_alfa_rad);
        const p = mc.MC_pxn / (2.0 * Math.PI);

        function evalR(u) {
            const ratio = z / u;
            const cosPhi = Math.sqrt(Math.max(0.0, 1.0 - ratio * ratio));
            const sinPhi = ratio;
            const N0y = p * sinPhi + flankSide * tanA * u * cosPhi;
            if (Math.abs(N0y) < 1e-7) return 1e9;
            const x1 = u * (u * cosPhi - a + ip) / N0y;
            const y0 = -a + u * cosPhi;
            return Math.hypot(x1, y0);
        }

        let low = uLow, high = uHigh;
        const rAtLow = evalR(uLow);
        const rAtHigh = evalR(uHigh);

        const isDecreasing = (rAtLow >= rAtHigh);
        if (isDecreasing) {
            if (rTarget >= rAtLow) return uLow;
            if (rTarget <= rAtHigh) return uHigh;
        } else {
            if (rTarget <= rAtLow) return uLow;
            if (rTarget >= rAtHigh) return uHigh;
        }

        // Monotonic bisection convergence (< 0.0001 mm precision)
        for (let iter = 0; iter < 18; iter++) {
            const mid = (low + high) * 0.5;
            const rMid = evalR(mid);
            if (isDecreasing) {
                if (rMid > rTarget) {
                    low = mid;
                } else {
                    high = mid;
                }
            } else {
                if (rMid < rTarget) {
                    low = mid;
                } else {
                    high = mid;
                }
            }
        }
        return (low + high) * 0.5;
    },

    /**
     * Evaluates exact conjugate tooth space polar angle theta in the wheel frame S2.
     * Incorporates 0.04 mm engineering backlash to ensure zero tooth penetration.
     */
    evalConjugateFlankTheta(r, z, flankSide, mc) {
        const u = this.solveConjugateUForR(r, z, flankSide, mc);
        if (u === null) return null;

        const a = mc.MC_a;
        const i = mc.MC_z2 / mc.MC_z1;
        const ip = i * (mc.MC_pxn / (2.0 * Math.PI));
        const tanA = Math.tan(mc.MC_alfa_rad);
        const p = mc.MC_pxn / (2.0 * Math.PI);
        const halfSx1 = mc.MC_sx1;
        const r1 = mc.r1;

        const ratio = Math.min(1.0, Math.max(-1.0, z / u));
        const cosPhi = Math.sqrt(Math.max(0.0, 1.0 - ratio * ratio));
        const sinPhi = ratio;
        const Phi = Math.asin(ratio);

        const N0y = p * sinPhi + flankSide * tanA * u * cosPhi;
        if (Math.abs(N0y) < 1e-7) return null;

        const isSurface = Boolean(mc.surfaceOnly);
        const contactMode = mc.contactMode || 'theory';
        let kissAllowance = 0.0;
        if (isSurface) {
            if (contactMode === 'crowning') {
                // Crowning mode: parabolic easing from center of throat to edges
                const halfB = mc.MC_b2H * 0.5;
                const uNorm = Math.min(1.0, Math.abs(z) / halfB);
                const K_crown = Math.max(0.0, 1.0 - 1.8 * uNorm * uNorm);
                kissAllowance = 0.024 * K_crown;
            } else {
                // Theory mode (default): uniform conjugate line contact
                kissAllowance = 0.020; // 20 microns kiss for sharp visible back-face imprint
            }
        } else {
            // Solid body mode: 0.04 mm engineering backlash to prevent solid body jamming
            kissAllowance = -0.04;
        }

        const x1 = u * (u * cosPhi - a + ip) / N0y;
        // Tool half-thickness with conjugate kiss / backlash
        const x1_prof = flankSide * (halfSx1 - kissAllowance - (u - r1) * tanA);
        const phi1 = Phi - (x1 - x1_prof) / p;
        const phi2 = -phi1 / i;

        const X0 = x1;
        const Y0 = -a + u * cosPhi;

        // Transform into rotating wheel frame S2
        const X2 = X0 * Math.cos(phi2) + Y0 * Math.sin(phi2);
        const Y2 = -X0 * Math.sin(phi2) + Y0 * Math.cos(phi2);

        return Math.atan2(Y2, X2);
    },

    /**
     * Generates Worm 1 3D Solid Mesh (ZA Archimedean Helicoid)
     */
    generateWormMesh(opt = {}) {
        const mc = this.extractMC3DParams(opt);
        const z1 = mc.MC_z1;
        const px = mc.MC_px;
        const pz = mc.MC_pxn;
        const L = mc.MC_L;
        const r1 = mc.r1;
        const rf1 = mc.rf1;
        const rShaft = Math.min(rf1, Math.max(2.0, mc.MC_ds1 * 0.5));
        const rBore = Math.min(rShaft * 0.48, Math.max(3.0, rShaft * 0.32));
        const halfSx1 = mc.MC_sx1;
        const tanA = Math.tan(mc.MC_alfa_rad);
        const surfaceOnly = Boolean(opt.surfaceOnly);
        const density = this.getDensitySettings(opt.meshDensityLevel || 8, z1, mc.MC_z2);
        const numSlices = opt.numWormSlices || density.wormSlices;
        const ptsR = opt.ptsPerFlank || density.wormPtsR;
        const wormTipPts = density.wormTipPts || 14;
        const handSign = mc.handSign;

        const positions = [];
        const normals = [];
        const indices = [];

        function pushTri(p1, p2, p3, nOverride = null) {
            const ux = p2.x - p1.x, uy = p2.y - p1.y, uz = p2.z - p1.z;
            const vx = p3.x - p1.x, vy = p3.y - p1.y, vz = p3.z - p1.z;
            let nx = uy * vz - uz * vy;
            let ny = uz * vx - ux * vz;
            let nz = ux * vy - uy * vx;
            const len = Math.hypot(nx, ny, nz);
            if (len < 1e-10) return;
            nx /= len; ny /= len; nz /= len;

            let n1x = nx, n1y = ny, n1z = nz;
            let n2x = nx, n2y = ny, n2z = nz;
            let n3x = nx, n3y = ny, n3z = nz;

            if (nOverride) {
                n1x = nOverride[0]; n1y = nOverride[1]; n1z = nOverride[2];
                n2x = nOverride[0]; n2y = nOverride[1]; n2z = nOverride[2];
                n3x = nOverride[0]; n3y = nOverride[1]; n3z = nOverride[2];
            } else {
                if (p1.nx !== undefined && !isNaN(p1.nx)) { n1x = p1.nx; n1y = p1.ny; n1z = p1.nz; }
                if (p2.nx !== undefined && !isNaN(p2.nx)) { n2x = p2.nx; n2y = p2.ny; n2z = p2.nz; }
                if (p3.nx !== undefined && !isNaN(p3.nx)) { n3x = p3.nx; n3y = p3.ny; n3z = p3.nz; }
            }

            const baseIdx = positions.length / 3;
            positions.push(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z, p3.x, p3.y, p3.z);
            normals.push(n1x, n1y, n1z, n2x, n2y, n2z, n3x, n3y, n3z);
            indices.push(baseIdx, baseIdx + 1, baseIdx + 2);
        }

        const xStep = L / (numSlices - 1);
        const threadSlices = [];

        for (let s = 0; s < numSlices; s++) {
            const x = -L * 0.5 + s * xStep;
            const rBlank = this.evalWormBlankRadius(x, mc);
            const starts = [];

            for (let k = 0; k < z1; k++) {
                const startPhase = (k * 2.0 * Math.PI) / z1;
                // Pure conjugate engagement: at x=0, thread 0 is centered at phi0 = 0 (pointing towards wheel at Y=-a+R)
                const phi0 = handSign * (2.0 * Math.PI / pz) * x + startPhase;

                const rFlankR = [];
                const rFlankL = [];

                for (let m = 0; m <= ptsR; m++) {
                    const frac = m / ptsR;
                    const R = rf1 + frac * (rBlank - rf1);
                    const w = halfSx1 - (R - r1) * tanA;
                    const dPhi = (2.0 * Math.PI / pz) * w;

                    const phiR = phi0 - dPhi;
                    const phiL = phi0 + dPhi;

                    rFlankR.push({ x, y: R * Math.cos(phiR), z: R * Math.sin(phiR), R, phi: phiR });
                    rFlankL.push({ x, y: R * Math.cos(phiL), z: R * Math.sin(phiL), R, phi: phiL });
                }

                // Cylindrical Tip Crest Arc (Analytical radial normals eliminate all kinks and bumps)
                const tipArc = [];
                const pTipR = rFlankR[ptsR];
                const pTipL = rFlankL[ptsR];
                for (let t = 0; t <= wormTipPts; t++) {
                    const fracTip = t / wormTipPts;
                    const phi = pTipR.phi + fracTip * (pTipL.phi - pTipR.phi);
                    const cosPhi = Math.cos(phi);
                    const sinPhi = Math.sin(phi);
                    tipArc.push({
                        x,
                        y: rBlank * cosPhi,
                        z: rBlank * sinPhi,
                        R: rBlank,
                        phi,
                        nx: 0,
                        ny: cosPhi,
                        nz: sinPhi
                    });
                }

                starts.push({ rFlankR, rFlankL, tipArc, rBlank });
            }
            threadSlices.push({ x, starts, rBlank });
        }

        // Compute Smooth / Continuous Analytical Normals for Worm Flanks
        for (let k = 0; k < z1; k++) {
            for (let s = 0; s < numSlices; s++) {
                const sPrev = Math.max(0, s - 1);
                const sNext = Math.min(numSlices - 1, s + 1);

                const flankR = threadSlices[s].starts[k].rFlankR;
                const flankL = threadSlices[s].starts[k].rFlankL;

                const flankR_prev = threadSlices[sPrev].starts[k].rFlankR;
                const flankR_next = threadSlices[sNext].starts[k].rFlankR;
                const flankL_prev = threadSlices[sPrev].starts[k].rFlankL;
                const flankL_next = threadSlices[sNext].starts[k].rFlankL;

                for (let m = 0; m <= ptsR; m++) {
                    const mPrev = Math.max(0, m - 1);
                    const mNext = Math.min(ptsR, m + 1);

                    // Right Flank Normal (dm x ds)
                    const dsR_x = flankR_next[m].x - flankR_prev[m].x;
                    const dsR_y = flankR_next[m].y - flankR_prev[m].y;
                    const dsR_z = flankR_next[m].z - flankR_prev[m].z;

                    const dmR_x = flankR[mNext].x - flankR[mPrev].x;
                    const dmR_y = flankR[mNext].y - flankR[mPrev].y;
                    const dmR_z = flankR[mNext].z - flankR[mPrev].z;

                    let nRx = dmR_y * dsR_z - dmR_z * dsR_y;
                    let nRy = dmR_z * dsR_x - dmR_x * dsR_z;
                    let nRz = dmR_x * dsR_y - dmR_y * dsR_x;
                    let lenR = Math.hypot(nRx, nRy, nRz);
                    if (lenR > 1e-10) {
                        nRx /= lenR; nRy /= lenR; nRz /= lenR;
                    }
                    flankR[m].nx = nRx;
                    flankR[m].ny = nRy;
                    flankR[m].nz = nRz;

                    // Left Flank Normal (ds x dm)
                    const dsL_x = flankL_next[m].x - flankL_prev[m].x;
                    const dsL_y = flankL_next[m].y - flankL_prev[m].y;
                    const dsL_z = flankL_next[m].z - flankL_prev[m].z;

                    const dmL_x = flankL[mNext].x - flankL[mPrev].x;
                    const dmL_y = flankL[mNext].y - flankL[mPrev].y;
                    const dmL_z = flankL[mNext].z - flankL[mPrev].z;

                    let nLx = dsL_y * dmL_z - dsL_z * dmL_y;
                    let nLy = dsL_z * dmL_x - dsL_x * dmL_z;
                    let nLz = dsL_x * dmL_y - dsL_y * dmL_x;
                    let lenL = Math.hypot(nLx, nLy, nLz);
                    if (lenL > 1e-10) {
                        nLx /= lenL; nLy /= lenL; nLz /= lenL;
                    }
                    flankL[m].nx = nLx;
                    flankL[m].ny = nLy;
                    flankL[m].nz = nLz;
                }
            }
        }

        // Build Quads for Flanks, Tip Crest, and Root Valley
        for (let s = 0; s < numSlices - 1; s++) {
            const sA = threadSlices[s];
            const sB = threadSlices[s + 1];

            for (let k = 0; k < z1; k++) {
                const stA = sA.starts[k];
                const stB = sB.starts[k];

                // Right Flank (Adaptive Shortest-Diagonal Delaunay Triangulation)
                for (let m = 0; m < ptsR; m++) {
                    const p00 = stA.rFlankR[m];
                    const p01 = stA.rFlankR[m + 1];
                    const p10 = stB.rFlankR[m];
                    const p11 = stB.rFlankR[m + 1];

                    const d00_11_sq = (p00.x - p11.x) ** 2 + (p00.y - p11.y) ** 2 + (p00.z - p11.z) ** 2;
                    const d01_10_sq = (p01.x - p10.x) ** 2 + (p01.y - p10.y) ** 2 + (p01.z - p10.z) ** 2;

                    if (d00_11_sq <= d01_10_sq) {
                        pushTri(p00, p01, p11);
                        pushTri(p00, p11, p10);
                    } else {
                        pushTri(p00, p01, p10);
                        pushTri(p01, p11, p10);
                    }
                }

                // Left Flank (Adaptive Shortest-Diagonal Delaunay Triangulation)
                for (let m = 0; m < ptsR; m++) {
                    const p00 = stA.rFlankL[m];
                    const p01 = stA.rFlankL[m + 1];
                    const p10 = stB.rFlankL[m];
                    const p11 = stB.rFlankL[m + 1];

                    const d00_11_sq = (p00.x - p11.x) ** 2 + (p00.y - p11.y) ** 2 + (p00.z - p11.z) ** 2;
                    const d01_10_sq = (p01.x - p10.x) ** 2 + (p01.y - p10.y) ** 2 + (p01.z - p10.z) ** 2;

                    if (d00_11_sq <= d01_10_sq) {
                        pushTri(p00, p10, p11);
                        pushTri(p00, p11, p01);
                    } else {
                        pushTri(p00, p10, p01);
                        pushTri(p10, p11, p01);
                    }
                }

                if (!surfaceOnly) {
                    // Tip Crest (subdivided cylindrical arc - Adaptive Shortest-Diagonal Delaunay Triangulation)
                    for (let t = 0; t < wormTipPts; t++) {
                        const pA0 = stA.tipArc[t];
                        const pA1 = stA.tipArc[t + 1];
                        const pB0 = stB.tipArc[t];
                        const pB1 = stB.tipArc[t + 1];

                        const d00_11_sq = (pA0.x - pB1.x) ** 2 + (pA0.y - pB1.y) ** 2 + (pA0.z - pB1.z) ** 2;
                        const d01_10_sq = (pA1.x - pB0.x) ** 2 + (pA1.y - pB0.y) ** 2 + (pA1.z - pB0.z) ** 2;

                        if (d00_11_sq <= d01_10_sq) {
                            pushTri(pA0, pA1, pB1);
                            pushTri(pA0, pB1, pB0);
                        } else {
                            pushTri(pA0, pA1, pB0);
                            pushTri(pA1, pB1, pB0);
                        }
                    }
                }
            }
        }

        // Solid Shaft Extensions, Shoulders, Root Core, and Bore
        if (!surfaceOnly) {
            const xL_thread = -L * 0.5;
            const xR_thread = L * 0.5;
            const xL_shoulder = xL_thread - mc.MC_t1;
            const xR_shoulder = xR_thread + mc.MC_t1;
            const xLEnd = -mc.l1;
            const xREnd = mc.l2;
            const nCirc = Math.max(32, Math.round(density.boreSegs * 0.8));

            function pushCylinder(x0, x1, radius, inward = false) {
                const sgn = inward ? -1 : 1;
                for (let i = 0; i < nCirc; i++) {
                    const a1 = (i * 2.0 * Math.PI) / nCirc;
                    const a2 = ((i + 1) * 2.0 * Math.PI) / nCirc;
                    const cos1 = Math.cos(a1), sin1 = Math.sin(a1);
                    const cos2 = Math.cos(a2), sin2 = Math.sin(a2);
                    const y1 = radius * cos1, z1_c = radius * sin1;
                    const y2 = radius * cos2, z2_c = radius * sin2;

                    const p00 = { x: x0, y: y1, z: z1_c, nx: 0, ny: sgn * cos1, nz: sgn * sin1 };
                    const p01 = { x: x0, y: y2, z: z2_c, nx: 0, ny: sgn * cos2, nz: sgn * sin2 };
                    const p10 = { x: x1, y: y1, z: z1_c, nx: 0, ny: sgn * cos1, nz: sgn * sin1 };
                    const p11 = { x: x1, y: y2, z: z2_c, nx: 0, ny: sgn * cos2, nz: sgn * sin2 };

                    if (!inward) {
                        pushTri(p00, p01, p11);
                        pushTri(p00, p11, p10);
                    } else {
                        pushTri(p00, p11, p01);
                        pushTri(p00, p10, p11);
                    }
                }
            }

            // Continuous cylindrical root core underneath threads
            pushCylinder(xL_thread, xR_thread, rf1);

            // Shoulder Step Rings
            for (let i = 0; i < nCirc; i++) {
                const a1 = (i * 2.0 * Math.PI) / nCirc;
                const a2 = ((i + 1) * 2.0 * Math.PI) / nCirc;
                const cosA1 = Math.cos(a1), sinA1 = Math.sin(a1);
                const cosA2 = Math.cos(a2), sinA2 = Math.sin(a2);

                pushTri(
                    { x: xL_thread, y: rShaft * cosA1, z: rShaft * sinA1 },
                    { x: xL_thread, y: rShaft * cosA2, z: rShaft * sinA2 },
                    { x: xL_thread, y: rf1 * cosA2, z: rf1 * sinA2 },
                    [-1, 0, 0]
                );
                pushTri(
                    { x: xL_thread, y: rShaft * cosA1, z: rShaft * sinA1 },
                    { x: xL_thread, y: rf1 * cosA2, z: rf1 * sinA2 },
                    { x: xL_thread, y: rf1 * cosA1, z: rf1 * sinA1 },
                    [-1, 0, 0]
                );

                pushTri(
                    { x: xR_thread, y: rShaft * cosA1, z: rShaft * sinA1 },
                    { x: xR_thread, y: rf1 * cosA2, z: rf1 * sinA2 },
                    { x: xR_thread, y: rShaft * cosA2, z: rShaft * sinA2 },
                    [1, 0, 0]
                );
                pushTri(
                    { x: xR_thread, y: rShaft * cosA1, z: rShaft * sinA1 },
                    { x: xR_thread, y: rf1 * cosA1, z: rf1 * sinA1 },
                    { x: xR_thread, y: rf1 * cosA2, z: rf1 * sinA2 },
                    [1, 0, 0]
                );
            }

            pushCylinder(xLEnd, xL_shoulder, rShaft);
            pushCylinder(xL_shoulder, xL_thread, rShaft);
            pushCylinder(xR_thread, xR_shoulder, rShaft);
            pushCylinder(xR_shoulder, xREnd, rShaft);

            // Annular End Disks
            for (let i = 0; i < nCirc; i++) {
                const a1 = (i * 2.0 * Math.PI) / nCirc;
                const a2 = ((i + 1) * 2.0 * Math.PI) / nCirc;

                pushTri(
                    { x: xLEnd, y: rShaft * Math.cos(a1), z: rShaft * Math.sin(a1) },
                    { x: xLEnd, y: rBore * Math.cos(a2), z: rBore * Math.sin(a2) },
                    { x: xLEnd, y: rShaft * Math.cos(a2), z: rShaft * Math.sin(a2) },
                    [-1, 0, 0]
                );
                pushTri(
                    { x: xLEnd, y: rShaft * Math.cos(a1), z: rShaft * Math.sin(a1) },
                    { x: xLEnd, y: rBore * Math.cos(a1), z: rBore * Math.sin(a1) },
                    { x: xLEnd, y: rBore * Math.cos(a2), z: rBore * Math.sin(a2) },
                    [-1, 0, 0]
                );

                pushTri(
                    { x: xREnd, y: rShaft * Math.cos(a1), z: rShaft * Math.sin(a1) },
                    { x: xREnd, y: rShaft * Math.cos(a2), z: rShaft * Math.sin(a2) },
                    { x: xREnd, y: rBore * Math.cos(a2), z: rBore * Math.sin(a2) },
                    [1, 0, 0]
                );
                pushTri(
                    { x: xREnd, y: rShaft * Math.cos(a1), z: rShaft * Math.sin(a1) },
                    { x: xREnd, y: rBore * Math.cos(a1), z: rBore * Math.sin(a1) },
                    { x: xREnd, y: rBore * Math.cos(a2), z: rBore * Math.sin(a2) },
                    [1, 0, 0]
                );
            }
            pushCylinder(xLEnd, xREnd, rBore, true);
        }

        return {
            vertices: new Float32Array(positions),
            normals: new Float32Array(normals),
            indices: new Uint32Array(indices)
        };
    },

    /**
     * Generates Worm Wheel 2 3D Solid Mesh (Authentic Litvin Conjugate Flanks)
     */
    generateWheelMesh(opt = {}) {
        const mc = this.extractMC3DParams(opt);
        const z2 = mc.MC_z2;
        const b2H = mc.MC_b2H;
        const halfB = 0.5 * b2H;
        const df2 = mc.MC_df2;
        const surfaceOnly = Boolean(opt.surfaceOnly);
        mc.surfaceOnly = surfaceOnly;
        mc.contactMode = opt.contactMode || 'theory';

        const dBore2 = Math.min(df2 * 0.65, Math.max(16.0, mc.ShaftDB2 || (df2 * 0.32)));
        const rBore2 = dBore2 * 0.5;

        const density = this.getDensitySettings(opt.meshDensityLevel || 8, mc.MC_z1, z2);
        const numSlices = opt.numWheelSlices || density.wheelSlices;
        const ptsR = opt.ptsPerFlank || density.wheelPtsR;
        const wheelTipPts = density.wheelTipPts || 5;
        const boreSegs = density.boreSegs;

        const positions = [];
        const normals = [];
        const indices = [];

        function pushTri(p1, p2, p3, nOverride = null) {
            const ux = p2.x - p1.x, uy = p2.y - p1.y, uz = p2.z - p1.z;
            const vx = p3.x - p1.x, vy = p3.y - p1.y, vz = p3.z - p1.z;
            let nx = uy * vz - uz * vy;
            let ny = uz * vx - ux * vz;
            let nz = ux * vy - uy * vx;
            const len = Math.hypot(nx, ny, nz);
            if (len < 1e-10) return;
            nx /= len; ny /= len; nz /= len;

            let n1x = nx, n1y = ny, n1z = nz;
            let n2x = nx, n2y = ny, n2z = nz;
            let n3x = nx, n3y = ny, n3z = nz;

            if (nOverride) {
                n1x = nOverride[0]; n1y = nOverride[1]; n1z = nOverride[2];
                n2x = nOverride[0]; n2y = nOverride[1]; n2z = nOverride[2];
                n3x = nOverride[0]; n3y = nOverride[1]; n3z = nOverride[2];
            } else {
                if (p1.nx !== undefined && !isNaN(p1.nx)) { n1x = p1.nx; n1y = p1.ny; n1z = p1.nz; }
                if (p2.nx !== undefined && !isNaN(p2.nx)) { n2x = p2.nx; n2y = p2.ny; n2z = p2.nz; }
                if (p3.nx !== undefined && !isNaN(p3.nx)) { n3x = p3.nx; n3y = p3.ny; n3z = p3.nz; }
            }

            const baseIdx = positions.length / 3;
            positions.push(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z, p3.x, p3.y, p3.z);
            normals.push(n1x, n1y, n1z, n2x, n2y, n2z, n3x, n3y, n3z);
            indices.push(baseIdx, baseIdx + 1, baseIdx + 2);
        }

        const zStep = b2H / (numSlices - 1);
        const slices = [];
        const pitchAngle = (2.0 * Math.PI) / z2;

        for (let s = 0; s < numSlices; s++) {
            const z = -halfB + s * zStep;
            const blank = this.evalWheelBlank(z, mc);
            const rRoot = blank.rRoot;
            const rTip = blank.rTip;

            const teeth = [];
            for (let j = 0; j < z2; j++) {
                const rFlankL = [];
                const rFlankR = [];

                for (let m = 0; m <= ptsR; m++) {
                    const frac = m / ptsR;
                    const r = rRoot + frac * (rTip - rRoot);

                    let thSpaceR = this.evalConjugateFlankTheta(r, z, +1, mc);
                    let thSpaceL = this.evalConjugateFlankTheta(r, z, -1, mc);

                    if (thSpaceR === null) thSpaceR = -Math.PI * 0.5 + (0.5 * mc.MC_sx1 / mc.r2);
                    if (thSpaceL === null) thSpaceL = -Math.PI * 0.5 - (0.5 * mc.MC_sx1 / mc.r2);

                    const thetaToothL = thSpaceR + j * pitchAngle;
                    const thetaToothR = thSpaceL + (j + 1) * pitchAngle;

                    rFlankL.push({ x: r * Math.cos(thetaToothL), y: r * Math.sin(thetaToothL), z, r, theta: thetaToothL });
                    rFlankR.push({ x: r * Math.cos(thetaToothR), y: r * Math.sin(thetaToothR), z, r, theta: thetaToothR });
                }

                // Subdivided Tip Land Arc (Analytical radial normals)
                const tipArc = [];
                const pTipL = rFlankL[ptsR];
                const pTipR = rFlankR[ptsR];
                for (let t = 0; t <= wheelTipPts; t++) {
                    const fracTip = t / wheelTipPts;
                    const th = pTipL.theta + fracTip * (pTipR.theta - pTipL.theta);
                    const cosTh = Math.cos(th);
                    const sinTh = Math.sin(th);
                    tipArc.push({
                        x: rTip * cosTh,
                        y: rTip * sinTh,
                        z,
                        r: rTip,
                        theta: th,
                        nx: cosTh,
                        ny: sinTh,
                        nz: 0
                    });
                }

                teeth.push({ rFlankL, rFlankR, tipArc });
            }
            slices.push({ z, rRoot, rTip, teeth });
        }

        // Compute Smooth / Continuous Analytical Normals for Wheel Flanks
        for (let j = 0; j < z2; j++) {
            for (let s = 0; s < numSlices; s++) {
                const sPrev = Math.max(0, s - 1);
                const sNext = Math.min(numSlices - 1, s + 1);

                const flankL = slices[s].teeth[j].rFlankL;
                const flankR = slices[s].teeth[j].rFlankR;

                const flankL_prev = slices[sPrev].teeth[j].rFlankL;
                const flankL_next = slices[sNext].teeth[j].rFlankL;
                const flankR_prev = slices[sPrev].teeth[j].rFlankR;
                const flankR_next = slices[sNext].teeth[j].rFlankR;

                for (let m = 0; m <= ptsR; m++) {
                    const mPrev = Math.max(0, m - 1);
                    const mNext = Math.min(ptsR, m + 1);

                    // Left Flank Normal (dz x dr)
                    const dzL_x = flankL_next[m].x - flankL_prev[m].x;
                    const dzL_y = flankL_next[m].y - flankL_prev[m].y;
                    const dzL_z = flankL_next[m].z - flankL_prev[m].z;

                    const drL_x = flankL[mNext].x - flankL[mPrev].x;
                    const drL_y = flankL[mNext].y - flankL[mPrev].y;
                    const drL_z = flankL[mNext].z - flankL[mPrev].z;

                    let nLx = dzL_y * drL_z - dzL_z * drL_y;
                    let nLy = dzL_z * drL_x - dzL_x * drL_z;
                    let nLz = dzL_x * drL_y - dzL_y * drL_x;
                    let lenL = Math.hypot(nLx, nLy, nLz);
                    if (lenL > 1e-10) {
                        nLx /= lenL; nLy /= lenL; nLz /= lenL;
                    }
                    flankL[m].nx = nLx;
                    flankL[m].ny = nLy;
                    flankL[m].nz = nLz;

                    // Right Flank Normal (dr x dz)
                    const dzR_x = flankR_next[m].x - flankR_prev[m].x;
                    const dzR_y = flankR_next[m].y - flankR_prev[m].y;
                    const dzR_z = flankR_next[m].z - flankR_prev[m].z;

                    const drR_x = flankR[mNext].x - flankR[mPrev].x;
                    const drR_y = flankR[mNext].y - flankR[mPrev].y;
                    const drR_z = flankR[mNext].z - flankR[mPrev].z;

                    let nRx = drR_y * dzR_z - drR_z * dzR_y;
                    let nRy = drR_z * dzR_x - drR_x * dzR_z;
                    let nRz = drR_x * dzR_y - drR_y * dzR_x;
                    let lenR = Math.hypot(nRx, nRy, nRz);
                    if (lenR > 1e-10) {
                        nRx /= lenR; nRy /= lenR; nRz /= lenR;
                    }
                    flankR[m].nx = nRx;
                    flankR[m].ny = nRy;
                    flankR[m].nz = nRz;
                }
            }
        }

        // Quads between slice s and s + 1
        for (let s = 0; s < numSlices - 1; s++) {
            const sA = slices[s];
            const sB = slices[s + 1];

            for (let j = 0; j < z2; j++) {
                const tA = sA.teeth[j];
                const tB = sB.teeth[j];

                // Left Flank (Adaptive Shortest-Diagonal Delaunay Triangulation)
                for (let m = 0; m < ptsR; m++) {
                    const p00 = tA.rFlankL[m];
                    const p01 = tA.rFlankL[m + 1];
                    const p10 = tB.rFlankL[m];
                    const p11 = tB.rFlankL[m + 1];

                    const d00_11_sq = (p00.x - p11.x) ** 2 + (p00.y - p11.y) ** 2 + (p00.z - p11.z) ** 2;
                    const d01_10_sq = (p01.x - p10.x) ** 2 + (p01.y - p10.y) ** 2 + (p01.z - p10.z) ** 2;

                    if (d00_11_sq <= d01_10_sq) {
                        pushTri(p00, p10, p11);
                        pushTri(p00, p11, p01);
                    } else {
                        pushTri(p00, p10, p01);
                        pushTri(p10, p11, p01);
                    }
                }

                // Right Flank (Adaptive Shortest-Diagonal Delaunay Triangulation)
                for (let m = 0; m < ptsR; m++) {
                    const p00 = tA.rFlankR[m];
                    const p01 = tA.rFlankR[m + 1];
                    const p10 = tB.rFlankR[m];
                    const p11 = tB.rFlankR[m + 1];

                    const d00_11_sq = (p00.x - p11.x) ** 2 + (p00.y - p11.y) ** 2 + (p00.z - p11.z) ** 2;
                    const d01_10_sq = (p01.x - p10.x) ** 2 + (p01.y - p10.y) ** 2 + (p01.z - p10.z) ** 2;

                    if (d00_11_sq <= d01_10_sq) {
                        pushTri(p00, p01, p11);
                        pushTri(p00, p11, p10);
                    } else {
                        pushTri(p00, p01, p10);
                        pushTri(p01, p11, p10);
                    }
                }

                if (!surfaceOnly) {
                    // Tip Crest (subdivided circular arc - Adaptive Shortest-Diagonal Delaunay Triangulation)
                    for (let t = 0; t < wheelTipPts; t++) {
                        const pA0 = tA.tipArc[t];
                        const pA1 = tA.tipArc[t + 1];
                        const pB0 = tB.tipArc[t];
                        const pB1 = tB.tipArc[t + 1];

                        const d00_11_sq = (pA0.x - pB1.x) ** 2 + (pA0.y - pB1.y) ** 2 + (pA0.z - pB1.z) ** 2;
                        const d01_10_sq = (pA1.x - pB0.x) ** 2 + (pA1.y - pB0.y) ** 2 + (pA1.z - pB0.z) ** 2;

                        if (d00_11_sq <= d01_10_sq) {
                            pushTri(pA0, pB0, pB1);
                            pushTri(pA0, pB1, pA1);
                        } else {
                            pushTri(pA0, pB0, pA1);
                            pushTri(pB0, pB1, pA1);
                        }
                    }

                    // Root Valley
                    const nextJ = (j + 1) % z2;
                    const pRootR_A = tA.rFlankR[0];
                    const pRootR_B = tB.rFlankR[0];
                    const pRootL_A = sA.teeth[nextJ].rFlankL[0];
                    const pRootL_B = sB.teeth[nextJ].rFlankL[0];

                    pushTri(pRootR_A, pRootL_B, pRootR_B);
                    pushTri(pRootR_A, pRootL_A, pRootL_B);
                }
            }
        }

        // Watertight Solid Body & Flat Annular End Caps
        if (!surfaceOnly) {
            for (let side = 0; side < 2; side++) {
                const sIdx = (side === 0) ? 0 : (numSlices - 1);
                const sData = slices[sIdx];
                const zVal = sData.z;
                const normalZ = (side === 0) ? -1 : 1;
                const rRimRoot = sData.rRoot;

                // 1. Flat Annular Disk from rBore2 to rRimRoot
                for (let k = 0; k < boreSegs; k++) {
                    const psi1 = (k * 2.0 * Math.PI) / boreSegs;
                    const psi2 = ((k + 1) * 2.0 * Math.PI) / boreSegs;

                    const pBore1 = { x: rBore2 * Math.cos(psi1), y: rBore2 * Math.sin(psi1), z: zVal };
                    const pBore2 = { x: rBore2 * Math.cos(psi2), y: rBore2 * Math.sin(psi2), z: zVal };
                    const pRim1  = { x: rRimRoot * Math.cos(psi1), y: rRimRoot * Math.sin(psi1), z: zVal };
                    const pRim2  = { x: rRimRoot * Math.cos(psi2), y: rRimRoot * Math.sin(psi2), z: zVal };

                    if (side === 0) {
                        pushTri(pBore1, pRim2, pRim1, [0, 0, normalZ]);
                        pushTri(pBore1, pBore2, pRim2, [0, 0, normalZ]);
                    } else {
                        pushTri(pBore1, pRim1, pRim2, [0, 0, normalZ]);
                        pushTri(pBore1, pRim2, pBore2, [0, 0, normalZ]);
                    }
                }

                // 2. Teeth Front/Back End Faces
                for (let j = 0; j < z2; j++) {
                    const t = sData.teeth[j];
                    for (let m = 0; m < ptsR; m++) {
                        const pL0 = t.rFlankL[m], pL1 = t.rFlankL[m + 1];
                        const pR0 = t.rFlankR[m], pR1 = t.rFlankR[m + 1];

                        if (side === 0) {
                            pushTri(pL0, pR1, pR0, [0, 0, normalZ]);
                            pushTri(pL0, pL1, pR1, [0, 0, normalZ]);
                        } else {
                            pushTri(pL0, pR0, pR1, [0, 0, normalZ]);
                            pushTri(pL0, pR1, pL1, [0, 0, normalZ]);
                        }
                    }
                }
            }

            // 3. Inner Bore Cylinder
            const z0 = -halfB, z1_bore = halfB;
            for (let k = 0; k < boreSegs; k++) {
                const psi1 = (k * 2.0 * Math.PI) / boreSegs;
                const psi2 = ((k + 1) * 2.0 * Math.PI) / boreSegs;
                const cos1 = Math.cos(psi1), sin1 = Math.sin(psi1);
                const cos2 = Math.cos(psi2), sin2 = Math.sin(psi2);

                const p00 = { x: rBore2 * cos1, y: rBore2 * sin1, z: z0, nx: -cos1, ny: -sin1, nz: 0 };
                const p01 = { x: rBore2 * cos2, y: rBore2 * sin2, z: z0, nx: -cos2, ny: -sin2, nz: 0 };
                const p10 = { x: rBore2 * cos1, y: rBore2 * sin1, z: z1_bore, nx: -cos1, ny: -sin1, nz: 0 };
                const p11 = { x: rBore2 * cos2, y: rBore2 * sin2, z: z1_bore, nx: -cos2, ny: -sin2, nz: 0 };

                pushTri(p00, p11, p01);
                pushTri(p00, p10, p11);
            }
        }

        return {
            vertices: new Float32Array(positions),
            normals: new Float32Array(normals),
            indices: new Uint32Array(indices)
        };
    },

    /**
     * Solves tridiagonal system for clamped cubic B-spline interpolation via Thomas algorithm.
     * Given sampled points D_0 .. D_{N-1}, finds control points P_0 .. P_{N-1} such that
     * evaluated B-spline curve passes EXACTLY through all sample points D_i (C(t_i) = D_i).
     * Guarantees 0 boundary error, 0 crest dip/trough, and smooth C2 curvature.
     */
    fitCubicBSplineCtrlPts(pts) {
        const N = pts.length;
        if (N <= 3) return pts;

        const b = new Float64Array(N);
        const a = new Float64Array(N);
        const c = new Float64Array(N);
        b.fill(4.0); a.fill(1.0); c.fill(1.0);
        b[0] = 1.0; b[N - 1] = 1.0;
        a[0] = 0.0; a[N - 1] = 0.0;
        c[0] = 0.0; c[N - 1] = 0.0;

        const rhs = [];
        for (let i = 0; i < N; i++) {
            if (i === 0 || i === N - 1) {
                rhs.push([pts[i][0], pts[i][1], pts[i][2]]);
            } else {
                rhs.push([6.0 * pts[i][0], 6.0 * pts[i][1], 6.0 * pts[i][2]]);
            }
        }

        const cp = new Float64Array(N);
        const dp = [];
        cp[0] = c[0] / b[0];
        dp.push([rhs[0][0] / b[0], rhs[0][1] / b[0], rhs[0][2] / b[0]]);

        for (let i = 1; i < N; i++) {
            const m = b[i] - a[i] * cp[i - 1];
            cp[i] = c[i] / m;
            dp.push([
                (rhs[i][0] - a[i] * dp[i - 1][0]) / m,
                (rhs[i][1] - a[i] * dp[i - 1][1]) / m,
                (rhs[i][2] - a[i] * dp[i - 1][2]) / m
            ]);
        }

        const P = new Array(N);
        P[N - 1] = [dp[N - 1][0], dp[N - 1][1], dp[N - 1][2]];
        for (let i = N - 2; i >= 0; i--) {
            P[i] = [
                dp[i][0] - cp[i] * P[i + 1][0],
                dp[i][1] - cp[i] * P[i + 1][1],
                dp[i][2] - cp[i] * P[i + 1][2]
            ];
        }

        return P;
    },

    /**
     * Extracts parametric grid surfaces and generator curves for native CAD/CAM surface export (IGES / Mastercam)
     */
    getWormParametricData(opt = {}) {
        const mc = this.extractMC3DParams(opt);
        const z1 = mc.MC_z1;
        const px = mc.MC_px;
        const pz = mc.MC_pxn;
        const L = mc.MC_L;
        const r1 = mc.r1;
        const rf1 = mc.rf1;
        const halfSx1 = mc.MC_sx1;
        const tanA = Math.tan(mc.MC_alfa_rad);
        const handSign = mc.handSign;

        // Ultra-precision sampling: 360 slices along length L for sub-micron helix curvature
        const numSlices = opt.numWormSlices || 360;
        const ptsR = opt.ptsPerFlank || 20;
        const wormTipPts = opt.wormTipPts || 24;
        const wormRootPts = opt.wormRootPts || 24;

        const surfaces = [];
        const curves = [];

        const ra1 = mc.ra1 || (mc.MC_da1 * 0.5);

        // Precompute axial step and lead curvature compensations along U
        const dx = L / (numSlices - 1);
        const dphi_u = (2.0 * Math.PI / pz) * dx;
        const scale_u = 3.0 / (2.0 + Math.cos(dphi_u));

        for (let k = 0; k < z1; k++) {
            const startPhase = (k * 2.0 * Math.PI) / z1;
            const gridR = [];
            const gridL = [];
            const gridTip = [];
            const gridRoot = [];

            for (let s = 0; s < numSlices; s++) {
                const x = -L * 0.5 + s * dx;
                const phi0 = handSign * (2.0 * Math.PI / pz) * x + startPhase;

                const sliceR = [];
                const sliceL = [];

                for (let m = 0; m <= ptsR; m++) {
                    const frac = m / ptsR;
                    const R = rf1 + frac * (ra1 - rf1);
                    const w = halfSx1 - (R - r1) * tanA;
                    const dPhi = (2.0 * Math.PI / pz) * w;

                    const phiR = phi0 - dPhi;
                    const phiL = phi0 + dPhi;

                    sliceR.push([x, R * scale_u * Math.cos(phiR), R * scale_u * Math.sin(phiR)]);
                    sliceL.push([x, R * scale_u * Math.cos(phiL), R * scale_u * Math.sin(phiL)]);
                }

                // 1. Tip Crest Arc: sample directly on exact cylinder, then solve exact B-spline control points
                const w_tip = halfSx1 - (ra1 - r1) * tanA;
                const dPhi_tip = (2.0 * Math.PI / pz) * w_tip;
                const phiTipR = phi0 - dPhi_tip;
                const phiTipL = phi0 + dPhi_tip;
                const dphi_tip = phiTipL - phiTipR;

                const rawSliceTip = [];
                for (let t = 0; t <= wormTipPts; t++) {
                    const fracTip = t / wormTipPts;
                    const phi = phiTipR + fracTip * dphi_tip;
                    rawSliceTip.push([x, ra1 * scale_u * Math.cos(phi), ra1 * scale_u * Math.sin(phi)]);
                }
                const sliceTip = this.fitCubicBSplineCtrlPts(rawSliceTip);

                // 2. Root Flute / Shaft Core: sample directly on exact root cylinder, then solve exact B-spline control points
                const w_root = halfSx1 - (rf1 - r1) * tanA;
                const dPhi_root = (2.0 * Math.PI / pz) * w_root;
                const phiRootL = phi0 + dPhi_root;
                const dphi_root = (2.0 * Math.PI / z1) - 2.0 * dPhi_root;

                const rawSliceRoot = [];
                for (let t = 0; t <= wormRootPts; t++) {
                    const fracRoot = t / wormRootPts;
                    const phi = phiRootL + fracRoot * dphi_root;
                    rawSliceRoot.push([x, rf1 * scale_u * Math.cos(phi), rf1 * scale_u * Math.sin(phi)]);
                }
                const sliceRoot = this.fitCubicBSplineCtrlPts(rawSliceRoot);

                gridR.push(sliceR);
                gridL.push(sliceL);
                gridTip.push(sliceTip);
                gridRoot.push(sliceRoot);
            }

            surfaces.push({ label: `WORM_FLANK_R_${k+1}`, grid: gridR, color: 3 });
            surfaces.push({ label: `WORM_FLANK_L_${k+1}`, grid: gridL, color: 3 });
            surfaces.push({ label: `WORM_TIP_${k+1}`, grid: gridTip, color: 2 });
            surfaces.push({ label: `WORM_ROOT_${k+1}`, grid: gridRoot, color: 1 });

            // Only generate wireframe curves when explicitly requested (keeps pure surface file pristine in Mastercam)
            if (opt.includeCurves || opt.curvesOnly) {
                const railRootR = gridR.map(s => s[0]);
                const railTipR = gridR.map(s => s[ptsR]);
                const railRootL = gridL.map(s => s[0]);
                const railTipL = gridL.map(s => s[ptsR]);
                const railRootVly = gridRoot.map(s => s[Math.round(wormRootPts / 2)]);
                curves.push({ label: `RAIL_ROT_R${k+1}`, points: railRootR, color: 1 });
                curves.push({ label: `RAIL_TIP_R${k+1}`, points: railTipR, color: 2 });
                curves.push({ label: `RAIL_ROT_L${k+1}`, points: railRootL, color: 1 });
                curves.push({ label: `RAIL_TIP_L${k+1}`, points: railTipL, color: 2 });
                curves.push({ label: `RAIL_ROOT_VLY${k+1}`, points: railRootVly, color: 1 });

                // Ultra-smooth Cross-Section Profiles (120 points/profile) for Ruled/Lofted
                const numProfiles = opt.numProfiles || 11;
                const ptsPerCurve = opt.ptsPerCurve || 30;
                for (let p = 0; p < numProfiles; p++) {
                    const sIdx = Math.round((p / (numProfiles - 1)) * (numSlices - 1));
                    const x_prof = -L * 0.5 + sIdx * dx;
                    const phi0_p = handSign * (2.0 * Math.PI / pz) * x_prof + startPhase;
                    const prof = [];

                    // Flank R from root to tip
                    for (let m = 0; m <= ptsPerCurve; m++) {
                        const R = rf1 + (m / ptsPerCurve) * (ra1 - rf1);
                        const w = halfSx1 - (R - r1) * tanA;
                        const phi = phi0_p - (2.0 * Math.PI / pz) * w;
                        prof.push([x_prof, R * Math.cos(phi), R * Math.sin(phi)]);
                    }
                    // Tip arc
                    const w_t = halfSx1 - (ra1 - r1) * tanA;
                    const phiTR = phi0_p - (2.0 * Math.PI / pz) * w_t;
                    const phiTL = phi0_p + (2.0 * Math.PI / pz) * w_t;
                    for (let t = 1; t <= ptsPerCurve; t++) {
                        const phi = phiTR + (t / ptsPerCurve) * (phiTL - phiTR);
                        prof.push([x_prof, ra1 * Math.cos(phi), ra1 * Math.sin(phi)]);
                    }
                    // Flank L from tip to root
                    for (let m = ptsPerCurve - 1; m >= 0; m--) {
                        const R = rf1 + (m / ptsPerCurve) * (ra1 - rf1);
                        const w = halfSx1 - (R - r1) * tanA;
                        const phi = phi0_p + (2.0 * Math.PI / pz) * w;
                        prof.push([x_prof, R * Math.cos(phi), R * Math.sin(phi)]);
                    }
                    // Root arc
                    const w_rt = halfSx1 - (rf1 - r1) * tanA;
                    const phiRL = phi0_p + (2.0 * Math.PI / pz) * w_rt;
                    const dphi_rt = (2.0 * Math.PI / z1) - 2.0 * (2.0 * Math.PI / pz) * w_rt;
                    for (let t = 1; t <= ptsPerCurve; t++) {
                        const phi = phiRL + (t / ptsPerCurve) * dphi_rt;
                        prof.push([x_prof, rf1 * Math.cos(phi), rf1 * Math.sin(phi)]);
                    }
                    curves.push({ label: `LOFT_SEC_${p+1}`, points: prof, color: 5 });
                }
            }
        }

        return { surfaces, curves, mc };
    },

    getWheelParametricData(opt = {}) {
        const mc = this.extractMC3DParams(opt);
        const z2 = mc.MC_z2;
        const b2H = mc.MC_b2H;
        const halfB = 0.5 * b2H;
        mc.surfaceOnly = true;
        mc.contactMode = opt.contactMode || 'theory';

        const numSlices = opt.numWheelSlices || 60;
        const ptsR = opt.ptsPerFlank || 16;
        const wheelTipPts = opt.wheelTipPts || 16;
        const wheelRootPts = opt.wheelRootPts || 16;
        const pitchAngle = (2.0 * Math.PI) / z2;

        const surfaces = [];
        const curves = [];

        // DEFAULT TO ALL z2 TEETH (Full 360-degree Wheel) unless explicitly disabled
        const activeTeeth = (opt.exportAllTeeth === false) ? Math.min(8, z2) : z2;

        for (let j = 0; j < activeTeeth; j++) {
            const gridDrive = [];
            const gridCoast = [];
            const gridTip = [];
            const gridRoot = [];

            for (let s = 0; s < numSlices; s++) {
                const z = -halfB + s * (b2H / (numSlices - 1));
                const blank = this.evalWheelBlank(z, mc);
                const rRoot = blank.rRoot;
                const rTip = blank.rTip;

                const sliceDrive = [];
                const sliceCoast = [];

                for (let m = 0; m <= ptsR; m++) {
                    const frac = m / ptsR;
                    const r = rRoot + frac * (rTip - rRoot);

                    let thSpaceR = this.evalConjugateFlankTheta(r, z, +1, mc);
                    let thSpaceL = this.evalConjugateFlankTheta(r, z, -1, mc);

                    if (thSpaceR === null) thSpaceR = -Math.PI * 0.5 + (0.5 * mc.MC_sx1 / mc.r2);
                    if (thSpaceL === null) thSpaceL = -Math.PI * 0.5 - (0.5 * mc.MC_sx1 / mc.r2);

                    const thetaDrive = thSpaceR + j * pitchAngle;
                    const thetaCoast = thSpaceL + (j + 1) * pitchAngle;

                    sliceDrive.push([r * Math.cos(thetaDrive), r * Math.sin(thetaDrive), z]);
                    sliceCoast.push([r * Math.cos(thetaCoast), r * Math.sin(thetaCoast), z]);
                }

                // 1. Tip Crest Arc: sample directly on exact blank throat, then solve exact B-spline control points
                const pTipDrive = sliceDrive[ptsR];
                const pTipCoast = sliceCoast[ptsR];
                const thDrive = Math.atan2(pTipDrive[1], pTipDrive[0]);
                let thCoast = Math.atan2(pTipCoast[1], pTipCoast[0]);
                while (thCoast < thDrive) thCoast += 2.0 * Math.PI;

                const dth_tip = thCoast - thDrive;
                const rawSliceTip = [];
                for (let t = 0; t <= wheelTipPts; t++) {
                    const fracTip = t / wheelTipPts;
                    const th = thDrive + fracTip * dth_tip;
                    rawSliceTip.push([rTip * Math.cos(th), rTip * Math.sin(th), z]);
                }
                const sliceTip = this.fitCubicBSplineCtrlPts(rawSliceTip);

                // 2. Root Throat Rim: sample directly on exact root throat, then solve exact B-spline control points
                const pCoastRoot = sliceCoast[0];
                const thCoastRoot = Math.atan2(pCoastRoot[1], pCoastRoot[0]);

                let thSpaceR_root = this.evalConjugateFlankTheta(rRoot, z, +1, mc);
                if (thSpaceR_root === null) thSpaceR_root = -Math.PI * 0.5 + (0.5 * mc.MC_sx1 / mc.r2);
                let thDriveNext = thSpaceR_root + (j + 1) * pitchAngle;
                while (thDriveNext < thCoastRoot) thDriveNext += 2.0 * Math.PI;

                const dth_root = thDriveNext - thCoastRoot;
                const rawSliceRoot = [];
                for (let t = 0; t <= wheelRootPts; t++) {
                    const fracRoot = t / wheelRootPts;
                    const th = thCoastRoot + fracRoot * dth_root;
                    rawSliceRoot.push([rRoot * Math.cos(th), rRoot * Math.sin(th), z]);
                }
                const sliceRoot = this.fitCubicBSplineCtrlPts(rawSliceRoot);

                gridDrive.push(sliceDrive);
                gridCoast.push(sliceCoast);
                gridTip.push(sliceTip);
                gridRoot.push(sliceRoot);
            }

            surfaces.push({ label: `WHEEL_DRV_${j+1}`, grid: gridDrive, color: 4 });
            surfaces.push({ label: `WHEEL_CST_${j+1}`, grid: gridCoast, color: 4 });
            surfaces.push({ label: `WHEEL_TIP_${j+1}`, grid: gridTip, color: 2 });
            surfaces.push({ label: `WHEEL_ROOT_${j+1}`, grid: gridRoot, color: 6 });

            if (opt.includeCurves && j === 0) {
                const numCross = 5;
                for (let c = 0; c < numCross; c++) {
                    const sIdx = Math.round((c / (numCross - 1)) * (numSlices - 1));
                    const prof = [];
                    for (let m = 0; m <= ptsR; m++) prof.push(gridDrive[sIdx][m]);
                    for (let t = 1; t <= wheelTipPts; t++) prof.push(gridTip[sIdx][t]);
                    for (let m = ptsR - 1; m >= 0; m--) prof.push(gridCoast[sIdx][m]);
                    for (let t = 1; t <= wheelRootPts; t++) prof.push(gridRoot[sIdx][t]);
                    curves.push({ label: `THROAT_SEC_${c+1}`, points: prof, color: 5 });
                }
            }
        }

        return { surfaces, curves, mc };
    },

    generateWormSurfaceMesh(opt = {}) {
        return this.generateWormMesh(Object.assign({}, opt, { surfaceOnly: true }));
    },

    generateWheelSurfaceMesh(opt = {}) {
        return this.generateWheelMesh(Object.assign({}, opt, { surfaceOnly: true }));
    }
};


if (typeof window !== 'undefined') {
    window.Worm3DGenerator = Worm3DGenerator;
}


/**
 * ============================================================================
 * MITCALC WEB APP - 3D WORM GEAR CAD EXPORTER FOR SOLIDWORKS & MASTERCAM (MODULE 3)
 * ============================================================================
 * Generates industry-standard 3D CAD files:
 * 1. Binary STL (.stl) - High-precision, compact binary mesh ready for Mastercam Toolpaths
 *    (4-Axis Rotary Worm Milling, 5-Axis Swarf/Multiaxis Wheel Hobbing) & SolidWorks Mesh Body.
 * 2. ISO 10303-21 STEP AP214 (.step / .stp) - Standard CAD Solid B-Rep format recognized by
 *    SolidWorks as a native Solid Body and Mastercam as a Machinable Solid.
 * 3. STEP AP214 Hollow Flank Surface (.step) - OPEN_SHELL with SHELL_BASED_SURFACE_MODEL for
 *    Mastercam 5-axis Surface Toolpaths & SolidWorks surface modeling.
 * 4. Wavefront OBJ (.obj) - Universal 3D geometry interchange format.
 * ============================================================================
 */

const Worm3DExporter = {
    downloadBlob(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 300);
    },

    meshToRawTriangles(meshData) {
        if (!meshData) return [];
        if (meshData.rawTriangles) return meshData.rawTriangles;
        const { vertices, normals, indices } = meshData;
        if (!vertices || !indices) return [];
        const tris = [];
        for (let i = 0; i < indices.length; i += 3) {
            const i1 = indices[i] * 3, i2 = indices[i + 1] * 3, i3 = indices[i + 2] * 3;
            const p1 = [vertices[i1], vertices[i1 + 1], vertices[i1 + 2]];
            const p2 = [vertices[i2], vertices[i2 + 1], vertices[i2 + 2]];
            const p3 = [vertices[i3], vertices[i3 + 1], vertices[i3 + 2]];
            const n = normals ? [normals[i1], normals[i1 + 1], normals[i1 + 2]] : [0, 1, 0];
            tris.push([p1, p2, p3, n]);
        }
        return tris;
    },

    normalizeTriangles(input) {
        if (!input) return [];
        if (Array.isArray(input)) {
            if (input.length > 0 && Array.isArray(input[0]) && input[0].length === 4) {
                return input;
            }
            let combined = [];
            for (const part of input) {
                if (Array.isArray(part)) {
                    combined = combined.concat(this.normalizeTriangles(part));
                } else if (part && part.rawTriangles) {
                    combined = combined.concat(part.rawTriangles);
                } else if (part && part.vertices && part.indices) {
                    combined = combined.concat(this.meshToRawTriangles(part));
                }
            }
            return combined;
        } else if (input.rawTriangles) {
            return input.rawTriangles;
        } else if (input.vertices && input.indices) {
            return this.meshToRawTriangles(input);
        }
        return [];
    },

    exportBinarySTL(input, filename = 'worm_gear.stl', autoDownload = true) {
        const triangles = this.normalizeTriangles(input);
        const numTriangles = triangles.length;

        const totalBytes = 84 + numTriangles * 50;
        const buffer = new ArrayBuffer(totalBytes);
        const view = new DataView(buffer);

        const headerStr = 'MITCalc 3D Worm Gear Model - DIN 3975 / DIN 3996 SolidWorks & Mastercam';
        for (let i = 0; i < 80; i++) {
            view.setUint8(i, i < headerStr.length ? headerStr.charCodeAt(i) : 32);
        }

        view.setUint32(80, numTriangles, true);

        let offset = 84;
        for (let i = 0; i < numTriangles; i++) {
            const tri = triangles[i];
            const p1 = tri[0];
            const p2 = tri[1];
            const p3 = tri[2];
            const n = tri[3];

            view.setFloat32(offset, n[0], true);
            view.setFloat32(offset + 4, n[1], true);
            view.setFloat32(offset + 8, n[2], true);

            view.setFloat32(offset + 12, p1[0], true);
            view.setFloat32(offset + 16, p1[1], true);
            view.setFloat32(offset + 20, p1[2], true);

            view.setFloat32(offset + 24, p2[0], true);
            view.setFloat32(offset + 28, p2[1], true);
            view.setFloat32(offset + 32, p2[2], true);

            view.setFloat32(offset + 36, p3[0], true);
            view.setFloat32(offset + 40, p3[1], true);
            view.setFloat32(offset + 44, p3[2], true);

            view.setUint16(offset + 48, 0, true);
            offset += 50;
        }

        const blob = new Blob([buffer], { type: 'application/octet-stream' });
        if (autoDownload) this.downloadBlob(blob, filename);
        return { buffer, blob, numTriangles, totalBytes };
    },

    exportSTLSurface(input, filename = 'worm_gear_surface.stl', autoDownload = true) {
        return this.exportBinarySTL(input, filename, autoDownload);
    },

    normalizePartTriangleArrays(input) {
        if (!input) return [];
        if (Array.isArray(input)) {
            if (input.length === 0) return [];
            if (Array.isArray(input[0]) && input[0].length === 4 && Array.isArray(input[0][0]) && typeof input[0][0][0] === 'number') {
                return [input];
            }
            const parts = [];
            for (const part of input) {
                if (Array.isArray(part) && part.length > 0) {
                    parts.push(part);
                } else if (part && Array.isArray(part.rawTriangles) && part.rawTriangles.length > 0) {
                    parts.push(part.rawTriangles);
                }
            }
            return parts;
        } else if (input.rawTriangles && input.rawTriangles.length > 0) {
            return [input.rawTriangles];
        }
        return [];
    },

    exportSTEP(input, filename = 'worm_gear.step', partName = 'WORM_GEAR_PART', autoDownload = true, isSurface = false) {
        const partArrays = this.normalizePartTriangleArrays(input);
        const now = new Date().toISOString().replace(/\.\d+Z$/, '');

        const lines = [];
        lines.push('ISO-10303-21;');
        lines.push('HEADER;');
        const fileDesc = isSurface
            ? 'MITCalc 3D Worm Gear Hollow Flank Surface Model for SolidWorks and Mastercam Surface Toolpaths'
            : 'MITCalc 3D Worm Gear Solid Model for SolidWorks and Mastercam (DIN 3975 / DIN 3996)';
        lines.push(`FILE_DESCRIPTION(('${fileDesc}'),'2;1');`);
        lines.push(`FILE_NAME('${filename}','${now}',('SirPhuong'),('MITCalc-Gear-Engineering'),'Antigravity CAD/CAM Engine','SolidWorks / Mastercam Compatible','');`);
        lines.push(`FILE_SCHEMA(('AUTOMOTIVE_DESIGN { 1 0 10303 214 1 1 1 1 }'));`);
        lines.push('ENDSEC;');
        lines.push('DATA;');

        let id = 1;

        lines.push(`#${id++}=APPLICATION_CONTEXT('automotive design');`); // #1
        lines.push(`#${id++}=APPLICATION_PROTOCOL_DEFINITION('international standard','automotive_design',2000,#1);`); // #2
        lines.push(`#${id++}=PRODUCT_CONTEXT('',#1,'mechanical');`); // #3
        lines.push(`#${id++}=PRODUCT('${partName}','${partName}','',(#3));`); // #4
        lines.push(`#${id++}=PRODUCT_DEFINITION_FORMATION('','',#4);`); // #5
        lines.push(`#${id++}=PRODUCT_DEFINITION_CONTEXT('part definition',#1,'design');`); // #6
        lines.push(`#${id++}=PRODUCT_DEFINITION('design','',#5,#6);`); // #7
        lines.push(`#${id++}=PRODUCT_DEFINITION_SHAPE('','',#7);`); // #8

        lines.push(`#${id++}=(LENGTH_UNIT()NAMED_UNIT(*)SI_UNIT(.MILLI.,.METRE.));`); // #9
        lines.push(`#${id++}=(NAMED_UNIT(*)PLANE_ANGLE_UNIT()SI_UNIT($,.RADIAN.));`); // #10
        lines.push(`#${id++}=(NAMED_UNIT(*)SOLID_ANGLE_UNIT()SI_UNIT($,.STERADIAN.));`); // #11
        lines.push(`#${id++}=UNCERTAINTY_MEASURE_WITH_UNIT(LENGTH_MEASURE(1.0E-04),#9,'distance_accuracy_value','confusion accuracy');`); // #12
        lines.push(`#${id++}=(GEOMETRIC_REPRESENTATION_CONTEXT(3)GLOBAL_UNCERTAINTY_ASSIGNED_CONTEXT((#12))GLOBAL_UNIT_ASSIGNED_CONTEXT((#9,#10,#11))REPRESENTATION_CONTEXT('Context3D','3D Context'));`); // #13

        const prodDefShapeId = 8;
        const repContextId = 13;

        const origPtId = id++;
        const origDirZId = id++;
        const origDirXId = id++;
        const origAxisId = id++;
        lines.push(`#${origPtId}=CARTESIAN_POINT('',(0.0,0.0,0.0));`);
        lines.push(`#${origDirZId}=DIRECTION('',(0.0,0.0,1.0));`);
        lines.push(`#${origDirXId}=DIRECTION('',(1.0,0.0,0.0));`);
        lines.push(`#${origAxisId}=AXIS2_PLACEMENT_3D('',#${origPtId},#${origDirZId},#${origDirXId});`);

        const fStr = (v) => {
            const val = Math.abs(v) < 1e-12 ? 0.0 : v;
            const s = val.toFixed(6);
            return s.indexOf('.') === -1 ? s + '.0' : s;
        };

        let totalTriangles = 0;
        let totalFaces = 0;
        const bodyItemIds = [];

        for (let pIdx = 0; pIdx < partArrays.length; pIdx++) {
            const triangles = partArrays[pIdx];
            totalTriangles += triangles.length;

            const vertices = [];
            const vMap = new Map();

            const getVertexIdx = (p) => {
                const key = `${Math.round(p[0] * 10000)},${Math.round(p[1] * 10000)},${Math.round(p[2] * 10000)}`;
                let vIdx = vMap.get(key);
                if (vIdx === undefined) {
                    vIdx = vertices.length;
                    vMap.set(key, vIdx);
                    const ptId = id++;
                    const vtxId = id++;
                    lines.push(`#${ptId}=CARTESIAN_POINT('',(${fStr(p[0])},${fStr(p[1])},${fStr(p[2])}));`);
                    lines.push(`#${vtxId}=VERTEX_POINT('',#${ptId});`);
                    vertices.push({ x: p[0], y: p[1], z: p[2], ptId, vtxId });
                }
                return vIdx;
            };

            const rawTris = [];
            for (let i = 0; i < triangles.length; i++) {
                const [p1, p2, p3, nHint] = triangles[i];
                const i1 = getVertexIdx(p1);
                const i2 = getVertexIdx(p2);
                const i3 = getVertexIdx(p3);
                if (i1 === i2 || i2 === i3 || i3 === i1) continue;

                const vA = vertices[i1], vB = vertices[i2], vC = vertices[i3];
                const abx = vB.x - vA.x, aby = vB.y - vA.y, abz = vB.z - vA.z;
                const acx = vC.x - vA.x, acy = vC.y - vA.y, acz = vC.z - vA.z;
                let nx = aby * acz - abz * acy;
                let ny = abz * acx - abx * acz;
                let nz = abx * acy - aby * acx;
                const nLen = Math.hypot(nx, ny, nz);
                if (nLen < 1e-11) continue;
                nx /= nLen; ny /= nLen; nz /= nLen;

                if (nHint && (nx * nHint[0] + ny * nHint[1] + nz * nHint[2] < -1e-6)) {
                    rawTris.push({ verts: [i1, i3, i2], n: [-nx, -ny, -nz] });
                } else {
                    rawTris.push({ verts: [i1, i2, i3], n: [nx, ny, nz] });
                }
            }

            const polygons = [];
            const isConvexQuad = (ia, ib, ic, id4, n) => {
                const pts = [vertices[ia], vertices[ib], vertices[ic], vertices[id4]];
                const distD = Math.abs((pts[3].x - pts[0].x) * n[0] + (pts[3].y - pts[0].y) * n[1] + (pts[3].z - pts[0].z) * n[2]);
                if (distD > 1e-5) return false;
                for (let k = 0; k < 4; k++) {
                    const pPrev = pts[(k + 3) % 4];
                    const pCurr = pts[k];
                    const pNext = pts[(k + 1) % 4];
                    const e1x = pCurr.x - pPrev.x, e1y = pCurr.y - pPrev.y, e1z = pCurr.z - pPrev.z;
                    const e2x = pNext.x - pCurr.x, e2y = pNext.y - pCurr.y, e2z = pNext.z - pCurr.z;
                    const cx = e1y * e2z - e1z * e2y;
                    const cy = e1z * e2x - e1x * e2z;
                    const cz = e1x * e2y - e1y * e2x;
                    if (cx * n[0] + cy * n[1] + cz * n[2] <= 1e-8) return false;
                }
                return true;
            };

            let idx = 0;
            while (idx < rawTris.length) {
                const t1 = rawTris[idx];
                if (idx + 1 < rawTris.length) {
                    const t2 = rawTris[idx + 1];
                    const dotN = t1.n[0] * t2.n[0] + t1.n[1] * t2.n[1] + t1.n[2] * t2.n[2];
                    if (dotN > 0.999999) {
                        const [a, b, c] = t1.verts;
                        const [d, e, f] = t2.verts;
                        if (a === d && c === e && b !== f && isConvexQuad(a, b, c, f, t1.n)) {
                            polygons.push({ verts: [a, b, c, f], n: t1.n });
                            idx += 2;
                            continue;
                        }
                        if (b === d && c === f && a !== e && isConvexQuad(a, b, e, c, t1.n)) {
                            polygons.push({ verts: [a, b, e, c], n: t1.n });
                            idx += 2;
                            continue;
                        }
                        if (a === d && b === f && c !== e && isConvexQuad(a, e, b, c, t1.n)) {
                            polygons.push({ verts: [a, e, b, c], n: t1.n });
                            idx += 2;
                            continue;
                        }
                    }
                }
                polygons.push(t1);
                idx++;
            }

            const edgeMap = new Map();
            const getEdgeCurve = (u, v) => {
                const uMin = u < v ? u : v;
                const uMax = u < v ? v : u;
                const key = `${uMin}_${uMax}`;
                let ecId = edgeMap.get(key);
                if (ecId === undefined) {
                    const pA = vertices[uMin];
                    const pB = vertices[uMax];
                    let dx = pB.x - pA.x, dy = pB.y - pA.y, dz = pB.z - pA.z;
                    const len = Math.hypot(dx, dy, dz) || 1.0;
                    dx /= len; dy /= len; dz /= len;
                    const dirId = id++;
                    const vecId = id++;
                    const lineId = id++;
                    ecId = id++;
                    lines.push(`#${dirId}=DIRECTION('',(${fStr(dx)},${fStr(dy)},${fStr(dz)}));`);
                    lines.push(`#${vecId}=VECTOR('',#${dirId},1.0);`);
                    lines.push(`#${lineId}=LINE('',#${pA.ptId},#${vecId});`);
                    lines.push(`#${ecId}=EDGE_CURVE('',#${pA.vtxId},#${pB.vtxId},#${lineId},.T.);`);
                    edgeMap.set(key, ecId);
                }
                return { ecId, sense: u < v ? '.T.' : '.F.' };
            };

            const faceIds = [];
            for (let i = 0; i < polygons.length; i++) {
                const poly = polygons[i];
                const m = poly.verts.length;
                const oeIds = [];
                for (let k = 0; k < m; k++) {
                    const u = poly.verts[k];
                    const v = poly.verts[(k + 1) % m];
                    const { ecId, sense } = getEdgeCurve(u, v);
                    const oeId = id++;
                    lines.push(`#${oeId}=ORIENTED_EDGE('',*,*,#${ecId},${sense});`);
                    oeIds.push(`#${oeId}`);
                }

                const loopId = id++;
                const boundId = id++;
                const p0 = vertices[poly.verts[0]];
                const p1 = vertices[poly.verts[1]];
                let rx = p1.x - p0.x, ry = p1.y - p0.y, rz = p1.z - p0.z;
                const dotNR = rx * poly.n[0] + ry * poly.n[1] + rz * poly.n[2];
                rx -= dotNR * poly.n[0];
                ry -= dotNR * poly.n[1];
                rz -= dotNR * poly.n[2];
                const rLen = Math.hypot(rx, ry, rz) || 1.0;
                rx /= rLen; ry /= rLen; rz /= rLen;

                const nDirId = id++;
                const rDirId = id++;
                const axisId = id++;
                const planeId = id++;
                const faceId = id++;

                lines.push(`#${loopId}=EDGE_LOOP('',(${oeIds.join(',')}));`);
                lines.push(`#${boundId}=FACE_OUTER_BOUND('',#${loopId},.T.);`);
                lines.push(`#${nDirId}=DIRECTION('',(${fStr(poly.n[0])},${fStr(poly.n[1])},${fStr(poly.n[2])}));`);
                lines.push(`#${rDirId}=DIRECTION('',(${fStr(rx)},${fStr(ry)},${fStr(rz)}));`);
                lines.push(`#${axisId}=AXIS2_PLACEMENT_3D('',#${p0.ptId},#${nDirId},#${rDirId});`);
                lines.push(`#${planeId}=PLANE('',#${axisId});`);
                lines.push(`#${faceId}=ADVANCED_FACE('',(#${boundId}),#${planeId},.T.);`);
                faceIds.push(`#${faceId}`);
            }

            totalFaces += faceIds.length;
            if (faceIds.length === 0) continue;

            const bodyLabel = partArrays.length > 1 ? `${partName}_BODY_${pIdx + 1}` : partName;
            const shellId = id++;
            if (isSurface) {
                lines.push(`#${shellId}=OPEN_SHELL('${bodyLabel}',(${faceIds.join(',')}));`);
                const sbsmId = id++;
                lines.push(`#${sbsmId}=SHELL_BASED_SURFACE_MODEL('${bodyLabel}',(#${shellId}));`);
                bodyItemIds.push(`#${sbsmId}`);
            } else {
                lines.push(`#${shellId}=CLOSED_SHELL('${bodyLabel}',(${faceIds.join(',')}));`);
                const brepId = id++;
                lines.push(`#${brepId}=MANIFOLD_SOLID_BREP('${bodyLabel}',#${shellId});`);
                bodyItemIds.push(`#${brepId}`);
            }
        }

        bodyItemIds.push(`#${origAxisId}`);
        const shapeRepId = id++;
        if (isSurface) {
            lines.push(`#${shapeRepId}=MANIFOLD_SURFACE_SHAPE_REPRESENTATION('${partName}',(${bodyItemIds.join(',')}),#${repContextId});`);
        } else {
            lines.push(`#${shapeRepId}=ADVANCED_BREP_SHAPE_REPRESENTATION('${partName}',(${bodyItemIds.join(',')}),#${repContextId});`);
        }
        lines.push(`#${id++}=SHAPE_DEFINITION_REPRESENTATION(#${prodDefShapeId},#${shapeRepId});`);

        lines.push('ENDSEC;');
        lines.push('END-ISO-10303-21;');

        const stepContent = lines.join('\r\n') + '\r\n';
        const blob = new Blob([stepContent], { type: 'application/step;charset=utf-8' });
        if (autoDownload) this.downloadBlob(blob, filename);
        return { content: stepContent, blob, numFaces: totalFaces, triangleCount: totalTriangles, isSurface };
    },

    exportSTEPSurface(input, filename = 'worm_gear_surface.step', partName = 'WORM_GEAR_SURFACE', autoDownload = true) {
        return this.exportSTEP(input, filename, partName, autoDownload, true);
    },

    exportOBJ(input, filename = 'worm_gear.obj', autoDownload = true) {
        const partArrays = this.normalizePartTriangleArrays(input);
        const lines = [
            '# MITCalc 3D Worm Gear Wavefront OBJ File',
            '# Standards: DIN 3975 / DIN 3996 / AGMA 6022 - Welded Manifold Mesh'
        ];

        let globalVtxOffset = 0;
        let globalNormOffset = 0;
        let totalTriangles = 0;

        for (let pIdx = 0; pIdx < partArrays.length; pIdx++) {
            const triangles = partArrays[pIdx];
            totalTriangles += triangles.length;
            lines.push(`o WormGearBody_${pIdx + 1}`);

            const vMap = new Map();
            let localVtxCount = 0;
            const getVtxIndex = (p) => {
                const key = `${Math.round(p[0] * 10000)},${Math.round(p[1] * 10000)},${Math.round(p[2] * 10000)}`;
                let vId = vMap.get(key);
                if (vId === undefined) {
                    localVtxCount++;
                    vId = globalVtxOffset + localVtxCount;
                    vMap.set(key, vId);
                    lines.push(`v ${p[0].toFixed(5)} ${p[1].toFixed(5)} ${p[2].toFixed(5)}`);
                }
                return vId;
            };

            const faceLines = [];
            for (let i = 0; i < triangles.length; i++) {
                const [p1, p2, p3, n] = triangles[i];
                const v1 = getVtxIndex(p1);
                const v2 = getVtxIndex(p2);
                const v3 = getVtxIndex(p3);
                if (v1 === v2 || v2 === v3 || v3 === v1) continue;
                globalNormOffset++;
                lines.push(`vn ${n[0].toFixed(5)} ${n[1].toFixed(5)} ${n[2].toFixed(5)}`);
                faceLines.push(`f ${v1}//${globalNormOffset} ${v2}//${globalNormOffset} ${v3}//${globalNormOffset}`);
            }

            for (let i = 0; i < faceLines.length; i++) {
                lines.push(faceLines[i]);
            }
            globalVtxOffset += localVtxCount;
        }

        const textContent = lines.join('\r\n') + '\r\n';
        const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
        if (autoDownload) this.downloadBlob(blob, filename);
        return { blob, text: textContent, triangleCount: totalTriangles };
    },

    /**
     * Exports True Parametric B-Spline Surfaces (Entity 128) and Wireframe Profile Curves (Entity 106 Form 2)
     * strictly formatted according to ANSI/USPRO/IPO-100-1996 (IGES 5.3) for Mastercam (X5-2026) & SolidWorks.
     * Level 1: SURFACES (Flanks, Tip Crests) - True surfaces, opens instantly in Mastercam without solid conversion!
     * Level 2: WIREFRAME_LOFT_PROFILES (Tooth cross profiles, Helical/Throat Rails) for Mastercam Create -> Surface -> Ruled/Lofted.
     * Level 3: AXES_DATUMS (Shaft / wheel rotation centerlines).
     *
     * @param {Object|Array} parametricData - { surfaces, curves, mc } or array of such objects
     * @param {string} filename - Target .igs filename
     * @param {boolean} autoDownload - Triggers browser Blob download
     */
    exportIGES(parametricData, filename = 'worm_gear_surface.igs', autoDownload = true) {
        let surfaces = [];
        let curves = [];
        if (Array.isArray(parametricData)) {
            parametricData.forEach(p => {
                if (p && p.surfaces) surfaces.push(...p.surfaces);
                if (p && p.curves) curves.push(...p.curves);
            });
        } else if (parametricData) {
            if (parametricData.surfaces) surfaces.push(...parametricData.surfaces);
            if (parametricData.curves) curves.push(...parametricData.curves);
        }

        const pad8 = (v) => ('        ' + v).slice(-8);
        const padLine = (txt, char, seq) => {
            const p = (txt + ' '.repeat(72)).slice(0, 72);
            const s = ('       ' + seq).slice(-7);
            return p + char + s;
        };
        const deL1 = (eType, pPtr, level, seq) => {
            return pad8(eType) + pad8(pPtr) + pad8(0) + pad8(1) + pad8(level) + pad8(0) + pad8(0) + pad8(0) + pad8('00000000') + 'D' + ('       ' + seq).slice(-7);
        };
        const deL2 = (eType, color, pCnt, form, label, seq) => {
            const shortLbl = (label || '')
                .replace('WHEEL_DRV_', 'DRV_')
                .replace('WHEEL_CST_', 'CST_')
                .replace('WHEEL_TIP_', 'TIP_')
                .replace('WHEEL_ROOT_', 'ROT_')
                .replace('WORM_FLANK_R_', 'FLK_R')
                .replace('WORM_FLANK_L_', 'FLK_L')
                .replace('WORM_TIP_', 'TIP_W')
                .replace('WORM_ROOT_', 'ROT_W');
            const padLbl = (shortLbl + '        ').slice(0, 8);
            return pad8(eType) + pad8(1) + pad8(color) + pad8(pCnt) + pad8(form) + pad8(0) + pad8(0) + padLbl + pad8(0) + 'D' + ('       ' + seq).slice(-7);
        };
        const pLine = (chunk, dePtr, seq) => {
            const c = (chunk + ' '.repeat(64)).slice(0, 64);
            return c + pad8(dePtr) + 'P' + ('       ' + seq).slice(-7);
        };

        // Start Section S
        const sLines = [
            padLine('MITCalc Web App - 3D Worm Gear Native Surface Export for Mastercam X5-2026', 'S', 1),
            padLine('Direct Parametric B-Spline Surfaces & Wireframe Profiles - Zero Conversion', 'S', 2)
        ];

        // Global Section G
        const now = new Date();
        const dateStr = now.getFullYear().toString() +
            String(now.getMonth() + 1).padStart(2, '0') +
            String(now.getDate()).padStart(2, '0') + '.' +
            String(now.getHours()).padStart(2, '0') +
            String(now.getMinutes()).padStart(2, '0') +
            String(now.getSeconds()).padStart(2, '0');

        const gTokens = [
            '1H,', '1H;',
            '33HMITCalc 3D Worm Gear Surface CAD',
            filename.length + 'H' + filename,
            '21HAntigravity CAD Engine',
            '12HMastercam X5',
            32, 38, 6, 308, 15,
            '12HMastercam X5',
            '1.0', 2, '2HMM', 1, '1.0',
            '15H' + dateStr,
            '0.0001', '1000.0',
            '9HSirPhuong',
            '24HMITCalc-Gear-Engineering',
            11, 0
        ];
        const gChunks = [];
        let curG = '';
        for (let i = 0; i < gTokens.length; i++) {
            const delim = (i === gTokens.length - 1) ? ';' : ',';
            const item = String(gTokens[i]) + delim;
            if (curG.length + item.length <= 72) {
                curG += item;
            } else {
                gChunks.push(curG);
                curG = item;
            }
        }
        if (curG.length > 0) gChunks.push(curG);
        const gLines = gChunks.map((chunk, idx) => padLine(chunk, 'G', idx + 1));

        // Entities preparation
        const entityList = [];

        // 1. Parametric B-Spline Surfaces (Entity 128) - Level 1 (SURFACES)
        surfaces.forEach(s => {
            const grid = s.grid;
            if (!grid || !grid.length || !grid[0].length) return;
            const Nu = grid.length;
            const Nv = grid[0].length;
            const K1 = Nu - 1;
            const K2 = Nv - 1;
            const M1 = Math.min(3, Nu - 1);
            const M2 = Math.min(3, Nv - 1); // Bicubic B-Spline (Degree 3 in U and V) for C2 curvature continuity

            const uKnots = [];
            for (let i = 0; i <= M1; i++) uKnots.push('0');
            const uInt = Nu - M1 - 1;
            for (let i = 1; i <= uInt; i++) uKnots.push((i / (uInt + 1)).toFixed(6));
            for (let i = 0; i <= M1; i++) uKnots.push('1');

            const vKnots = [];
            for (let j = 0; j <= M2; j++) vKnots.push('0');
            const vInt = Nv - M2 - 1;
            for (let j = 1; j <= vInt; j++) vKnots.push((j / (vInt + 1)).toFixed(6));
            for (let j = 0; j <= M2; j++) vKnots.push('1');

            const totalPts = Nu * Nv;
            const weights = new Array(totalPts).fill('1');

            const ptsCoords = [];
            // IGES Entity 128 Specification:
            // First index i (0 .. K1 = Nu - 1, along U) varies FASTEST (inner loop)
            // Second index j (0 .. K2 = Nv - 1, along V) varies slowest (outer loop)
            for (let j = 0; j < Nv; j++) {
                for (let i = 0; i < Nu; i++) {
                    const pt = grid[i][j];
                    ptsCoords.push(Number(pt[0]).toFixed(5));
                    ptsCoords.push(Number(pt[1]).toFixed(5));
                    ptsCoords.push(Number(pt[2]).toFixed(5));
                }
            }

            const pTokens = [
                128, K1, K2, M1, M2,
                0, 0, 1, 0, 0,
                ...uKnots,
                ...vKnots,
                ...weights,
                ...ptsCoords,
                0, 1, 0, 1
            ];

            entityList.push({
                type: 128,
                form: 0,
                level: s.level || 1,
                color: s.color || 3,
                label: s.label || 'SURFACE',
                pTokens
            });
        });

        // 2. Wireframe Profiles and Rails (Entity 106 Form 12 Copious Data: Linear Path) - Level 2 / Level 3
        curves.forEach(c => {
            const pts = c.points;
            if (!pts || !pts.length) return;
            const N = pts.length;
            const coords = [];
            for (let i = 0; i < N; i++) {
                coords.push(Number(pts[i][0]).toFixed(5));
                coords.push(Number(pts[i][1]).toFixed(5));
                coords.push(Number(pts[i][2]).toFixed(5));
            }
            const pTokens = [106, 2, N, ...coords];
            entityList.push({
                type: 106,
                form: 12, // Form 12 = Linear Path in 3D (connected 3D wireframe curve, NOT discrete point markers!)
                level: c.level || 2,
                color: c.color || 5,
                label: c.label || 'CURVE',
                pTokens
            });
        });

        // Compute P lines & DE lines with strict token-aware line wrapping
        const dLines = [];
        const pLines = [];
        let pSeq = 1;

        entityList.forEach((e, idx) => {
            const deLine1Seq = idx * 2 + 1;
            const deLine2Seq = idx * 2 + 2;
            const pStartPtr = pSeq;

            // Strictly token-aware: each token is placed completely within column 1-64.
            // No parameter, number, or sign ever crosses column 64!
            const chunks = [];
            let curChunk = '';
            for (let i = 0; i < e.pTokens.length; i++) {
                const delim = (i === e.pTokens.length - 1) ? ';' : ',';
                const item = String(e.pTokens[i]) + delim;
                if (curChunk.length + item.length <= 64) {
                    curChunk += item;
                } else {
                    chunks.push(curChunk);
                    curChunk = item;
                }
            }
            if (curChunk.length > 0) {
                chunks.push(curChunk);
            }

            dLines.push(deL1(e.type, pStartPtr, e.level, deLine1Seq));
            dLines.push(deL2(e.type, e.color, chunks.length, e.form, e.label, deLine2Seq));

            chunks.forEach(chunk => {
                pLines.push(pLine(chunk, deLine1Seq, pSeq++));
            });
        });

        // Terminate Section T
        const sCnt = String(sLines.length).padStart(7, ' ');
        const gCnt = String(gLines.length).padStart(7, ' ');
        const dCnt = String(dLines.length).padStart(7, ' ');
        const pCnt = String(pLines.length).padStart(7, ' ');
        const tLine = `S${sCnt}G${gCnt}D${dCnt}P${pCnt}` + ' '.repeat(40) + 'T      1';

        const allLines = sLines.concat(gLines, dLines, pLines, [tLine]);
        const igesContent = allLines.join('\r\n') + '\r\n';
        const blob = new Blob([igesContent], { type: 'application/iges;charset=utf-8' });
        if (autoDownload) this.downloadBlob(blob, filename);

        return {
            content: igesContent,
            blob,
            numSurfaces: surfaces.length,
            numCurves: curves.length,
            totalLines: allLines.length
        };
    }
};

if (typeof window !== 'undefined') {
    window.Worm3DExporter = Worm3DExporter;
}



/**
 * ============================================================================
 * MITCALC WEB APP - 3D WEBGL WORM GEAR VISUALIZER & MESHING SIMULATOR (MODULE 3)
 * ============================================================================
 * Renders real-time 3D conjugate meshing of Cylindrical Worm 1 (ZA/ZN/ZI/ZK)
 * and Globoid Throated Worm Wheel 2 at orthogonal axes (Sigma = 90 deg) and
 * center distance a (DIN 3975 / DIN 3996 / AGMA 6022) using Three.js,
 * PBR metallic materials, OrbitControls (360 deg CAD orbit), and analytical
 * collision-free conjugate screw-wheel kinematics.
 * ============================================================================
 */

class Worm3DVisualizer {
    constructor(containerElement) {
        this.container = typeof containerElement === 'string'
            ? document.getElementById(containerElement)
            : containerElement;

        this.geom = null;
        this.renderer = null;
        this.scene = null;
        this.camera = null;
        this.controls = null;

        this.wormGroup = null;
        this.wheelGroup = null;
        this.wormMesh = null;
        this.wheelMesh = null;
        this.wormSurfMesh = null;
        this.wheelSurfMesh = null;
        this.gridHelper = null;

        // Static by default on initialization (Rule 14)
        this.isAnimating = false;
        this.animSpeed = 1.0;
        this.animDirection = 1; // 1: Thuận (forward), -1: Nghịch (reverse)
        this.rotSpeedBase = 0.035; // rad per frame for Worm 1 at 1.0x
        this.wormAngle = 0.0;
        this.wheelAngle = 0.0;
        this.initialWheelAngle = 0.0;
        this.gearRatio = 40.0;
        this.handSign = 1.0;
        this.centerDistA = 103.3663;
        this.viewInitialized = false;

        this.wireframeMode = false;
        this.flankOnlyMode = false;
        this.wormVisible = true;
        this.wheelVisible = true;
        this.contactMode = 'theory'; // 'theory' (Mặc định: Đường tiếp xúc liên hợp) | 'crowning' (Vết elip có độ vồng)
        this.meshDensityLevel = 8; // Default Level 8 (Ultra Precision CAD)

        this.mesh1Data = null;
        this.mesh2Data = null;
        this.surf1Data = null;
        this.surf2Data = null;
        this.initialized = false;
    }

    ensureInitialized() {
        if (this.initialized) return true;
        if (typeof THREE === 'undefined') {
            console.error('Three.js is not loaded.');
            return false;
        }
        if (!this.container) return false;
        this.initialized = true;

        const width = this.container.clientWidth || 1200;
        const height = this.container.clientHeight || 650;

        // 1. Scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0b1120);

        // 2. Camera
        this.camera = new THREE.PerspectiveCamera(42, width / height, 1.0, 10000);
        this.camera.position.set(180, -40, 240);

        // 3. Renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        this.renderer.shadowMap.enabled = false;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.05;

        while (this.container.firstChild) {
            this.container.removeChild(this.container.firstChild);
        }
        this.container.appendChild(this.renderer.domElement);

        // 4. OrbitControls with full 360-deg CAD orbit
        if (typeof THREE.OrbitControls !== 'undefined') {
            this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
            this.controls.cadOrbit360 = true;
            this.controls.enableDamping = true;
            this.controls.dampingFactor = 0.08;
            this.controls.screenSpacePanning = true;
            this.controls.maxDistance = 5000;
            this.controls.minDistance = 8;
        }

        // 5. Studio CAD Lighting
        this.setupLighting();

        // 6. Groups for Worm 1 (at Y = -a, axis along X) and Worm Wheel 2 (at origin, axis along Z)
        this.wormGroup = new THREE.Group();
        this.wheelGroup = new THREE.Group();
        this.scene.add(this.wormGroup);
        this.scene.add(this.wheelGroup);

        // 7. Reference Grid below Worm 1
        this.gridHelper = new THREE.GridHelper(600, 30, 0x334155, 0x1e293b);
        this.gridHelper.position.set(0, -160, 0);
        this.scene.add(this.gridHelper);

        // 8. Window resize listener
        window.addEventListener('resize', () => this.onResize());

        // 9. Start render loop
        this.animate();
    }

    setupLighting() {
        const hemiLight = new THREE.HemisphereLight(0xffffff, 0x1e293b, 0.55);
        hemiLight.position.set(0, 300, 300);
        this.scene.add(hemiLight);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.50);
        this.scene.add(ambientLight);

        const dirLight1 = new THREE.DirectionalLight(0xffffff, 0.70);
        dirLight1.position.set(250, 300, 350);
        this.scene.add(dirLight1);

        const dirLight2 = new THREE.DirectionalLight(0xffffff, 0.45);
        dirLight2.position.set(-300, -200, -250);
        this.scene.add(dirLight2);

        const dirLight3 = new THREE.DirectionalLight(0xffffff, 0.40);
        dirLight3.position.set(0, -350, 250);
        this.scene.add(dirLight3);

        const dirLight4 = new THREE.DirectionalLight(0xffffff, 0.30);
        dirLight4.position.set(-200, 250, -300);
        this.scene.add(dirLight4);
    }

    onResize() {
        this.ensureInitialized();
        if (!this.container || !this.renderer || !this.camera) return;
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        if (width === 0 || height === 0) return;
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    setGeometry(geom) {
        if (!geom || typeof Worm3DGenerator === 'undefined') return;
        this.ensureInitialized();
        this.geom = geom;

        const z1 = Math.max(1, parseInt(geom.z1) || 1);
        const z2 = Math.max(5, parseInt(geom.z2) || 40);
        this.gearRatio = z2 / z1;
        this.handSign = (parseInt(geom.teethOrientation) === 2) ? -1.0 : 1.0;
        this.centerDistA = parseFloat(geom.a) || 103.3663;

        const da1 = parseFloat(geom.da1) || 44.698;
        if (this.gridHelper) {
            this.gridHelper.position.set(0, -this.centerDistA - da1 * 0.85, 0);
        }

        const genOpts = Object.assign({}, geom, {
            meshDensityLevel: this.meshDensityLevel,
            contactMode: this.contactMode
        });

        // 1. Generate Worm 1 Solid Mesh (High Grade Hardened Steel)
        this.mesh1Data = Worm3DGenerator.generateWormMesh(genOpts);

        // 2. Generate Globoid Worm Wheel 2 Solid Mesh (Centrifugal Tin-Nickel Bronze CuSn12Ni2)
        this.mesh2Data = Worm3DGenerator.generateWheelMesh(genOpts);

        // 3. Generate Worm 1 Flank Surface Mesh (Flank Only)
        this.surf1Data = Worm3DGenerator.generateWormSurfaceMesh(genOpts);

        // 4. Generate Globoid Worm Wheel 2 Flank Surface Mesh (Flank Only)
        this.surf2Data = Worm3DGenerator.generateWheelSurfaceMesh(genOpts);

        this.updateMeshes();

        // Position Worm 1 at (0, -a, 0) and Worm Wheel 2 at (0, 0, 0)
        if (this.wormGroup) {
            this.wormGroup.position.set(0, -this.centerDistA, 0);
            this.wormGroup.visible = this.wormVisible;
        }
        if (this.wheelGroup) {
            this.wheelGroup.position.set(0, 0, 0);
            this.wheelGroup.visible = this.wheelVisible;
        }

        this.initialWheelAngle = 0.0;
        this.wormAngle = 0.0;
        this.wheelAngle = this.initialWheelAngle;
        this.updateGearRotations();

        if (!this.viewInitialized) {
            this.setViewPreset('iso');
            this.viewInitialized = true;
        }
    }

    updateMeshes() {
        if (!this.mesh1Data || !this.mesh2Data) return;

        if (this.wormMesh) {
            this.wormGroup.remove(this.wormMesh);
            this.wormMesh.geometry.dispose();
            this.wormMesh = null;
        }
        if (this.wheelMesh) {
            this.wheelGroup.remove(this.wheelMesh);
            this.wheelMesh.geometry.dispose();
            this.wheelMesh = null;
        }
        if (this.wormSurfMesh) {
            this.wormGroup.remove(this.wormSurfMesh);
            this.wormSurfMesh.geometry.dispose();
            this.wormSurfMesh = null;
        }
        if (this.wheelSurfMesh) {
            this.wheelGroup.remove(this.wheelSurfMesh);
            this.wheelSurfMesh.geometry.dispose();
            this.wheelSurfMesh = null;
        }

        // PBR Materials (Authentic Mechanical CAD Engineering Standards):
        // Worm 1 Solid: Case-Hardened Ground Alloy Steel (Cobalt-Cyan Metallic)
        const matWorm = new THREE.MeshStandardMaterial({
            color: 0x0284c7,
            emissive: 0x013a63,
            emissiveIntensity: 0.08,
            metalness: 0.35,
            roughness: 0.42,
            side: THREE.DoubleSide,
            wireframe: this.wireframeMode
        });

        // Worm Wheel 2 Solid: Centrifugal Tin-Nickel Bronze CuSn12Ni2 (Coral-Orange Bronze)
        const matWheel = new THREE.MeshStandardMaterial({
            color: 0xea580c,
            emissive: 0x7c2d12,
            emissiveIntensity: 0.08,
            metalness: 0.30,
            roughness: 0.44,
            side: THREE.DoubleSide,
            wireframe: this.wireframeMode
        });

        // Flank Only Surface Materials (PBR Metallic CAD - High Contrast for Back-face Imprint):
        // Worm 1 Flank: Vivid Electric Cyan-Blue (#00a8ff)
        const matWormSurf = new THREE.MeshStandardMaterial({
            color: 0x00a8ff,
            emissive: 0x0284c7,
            emissiveIntensity: 0.16,
            metalness: 0.20,
            roughness: 0.35,
            side: THREE.DoubleSide,
            wireframe: this.wireframeMode
        });

        // Worm Wheel 2 Flank: Vivid Flame Coral-Orange (#ff5722)
        const matWheelSurf = new THREE.MeshStandardMaterial({
            color: 0xff5722,
            emissive: 0xc2410c,
            emissiveIntensity: 0.16,
            metalness: 0.20,
            roughness: 0.35,
            side: THREE.DoubleSide,
            wireframe: this.wireframeMode
        });

        // 1. Worm 1 Solid Mesh
        const geo1 = new THREE.BufferGeometry();
        geo1.setAttribute('position', new THREE.BufferAttribute(this.mesh1Data.vertices, 3));
        geo1.setAttribute('normal', new THREE.BufferAttribute(this.mesh1Data.normals, 3));
        geo1.setIndex(new THREE.BufferAttribute(this.mesh1Data.indices, 1));
        this.wormMesh = new THREE.Mesh(geo1, matWorm);
        this.wormMesh.visible = !this.flankOnlyMode;
        this.wormGroup.add(this.wormMesh);

        // 2. Worm Wheel 2 Solid Mesh
        const geo2 = new THREE.BufferGeometry();
        geo2.setAttribute('position', new THREE.BufferAttribute(this.mesh2Data.vertices, 3));
        geo2.setAttribute('normal', new THREE.BufferAttribute(this.mesh2Data.normals, 3));
        geo2.setIndex(new THREE.BufferAttribute(this.mesh2Data.indices, 1));
        this.wheelMesh = new THREE.Mesh(geo2, matWheel);
        this.wheelMesh.visible = !this.flankOnlyMode;
        this.wheelGroup.add(this.wheelMesh);

        // 3. Worm 1 Surface Mesh (Flank Only)
        if (this.surf1Data) {
            const geoSurf1 = new THREE.BufferGeometry();
            geoSurf1.setAttribute('position', new THREE.BufferAttribute(this.surf1Data.vertices, 3));
            geoSurf1.setAttribute('normal', new THREE.BufferAttribute(this.surf1Data.normals, 3));
            geoSurf1.setIndex(new THREE.BufferAttribute(this.surf1Data.indices, 1));
            this.wormSurfMesh = new THREE.Mesh(geoSurf1, matWormSurf);
            this.wormSurfMesh.visible = this.flankOnlyMode;
            this.wormGroup.add(this.wormSurfMesh);
        }

        // 4. Worm Wheel 2 Surface Mesh (Flank Only)
        if (this.surf2Data) {
            const geoSurf2 = new THREE.BufferGeometry();
            geoSurf2.setAttribute('position', new THREE.BufferAttribute(this.surf2Data.vertices, 3));
            geoSurf2.setAttribute('normal', new THREE.BufferAttribute(this.surf2Data.normals, 3));
            geoSurf2.setIndex(new THREE.BufferAttribute(this.surf2Data.indices, 1));
            this.wheelSurfMesh = new THREE.Mesh(geoSurf2, matWheelSurf);
            this.wheelSurfMesh.visible = this.flankOnlyMode;
            this.wheelGroup.add(this.wheelSurfMesh);
        }
    }

    updateGearRotations() {
        if (!this.wormGroup || !this.wheelGroup) return;
        this.wormGroup.rotation.x = this.wormAngle;
        this.wheelGroup.rotation.z = this.wheelAngle;
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        if (!this.container || this.container.clientWidth === 0 || this.container.clientHeight === 0) {
            return;
        }

        if (this.isAnimating && this.wormGroup && this.wheelGroup) {
            const step = this.rotSpeedBase * this.animSpeed * (this.animDirection || 1);
            this.wormAngle += step;
            // Exact conjugate synchronization between Worm 1 (X-axis) and Worm Wheel 2 (Z-axis):
            this.wheelAngle = this.initialWheelAngle - this.handSign * (this.wormAngle / this.gearRatio);
            this.updateGearRotations();
        }

        if (this.controls) {
            this.controls.update();
            if (this.camera) {
                const camDist = this.camera.position.distanceTo(this.controls.target);
                const newNear = Math.max(1.0, Math.min(40.0, camDist * 0.12));
                const newFar = Math.max(800.0, camDist * 8.0);
                if (Math.abs(this.camera.near - newNear) > 0.8 || Math.abs(this.camera.far - newFar) > 25.0) {
                    this.camera.near = newNear;
                    this.camera.far = newFar;
                    this.camera.updateProjectionMatrix();
                }
            }
        }

        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }

    setAnimSpeed(speed) {
        this.animSpeed = Math.max(0.01, Math.min(3.0, parseFloat(speed) || 1.0));
    }

    toggleAnimDirection() {
        this.animDirection = (this.animDirection === 1) ? -1 : 1;
        return this.animDirection;
    }

    stepAnimation(direction = 1) {
        this.isAnimating = false;
        const stepRad = (Math.PI / 18.0) * direction; // 10 deg of worm rotation per step
        this.wormAngle += stepRad;
        this.wheelAngle = this.initialWheelAngle - this.handSign * (this.wormAngle / this.gearRatio);
        this.updateGearRotations();
        return this.wormAngle;
    }

    toggleAnimation() {
        this.isAnimating = !this.isAnimating;
        return this.isAnimating;
    }

    toggleWireframe() {
        this.wireframeMode = !this.wireframeMode;
        if (this.wormMesh) this.wormMesh.material.wireframe = this.wireframeMode;
        if (this.wheelMesh) this.wheelMesh.material.wireframe = this.wireframeMode;
        if (this.wormSurfMesh) this.wormSurfMesh.material.wireframe = this.wireframeMode;
        if (this.wheelSurfMesh) this.wheelSurfMesh.material.wireframe = this.wireframeMode;
        return this.wireframeMode;
    }

    toggleFlankOnly() {
        this.flankOnlyMode = !this.flankOnlyMode;
        if (this.wormMesh) this.wormMesh.visible = !this.flankOnlyMode;
        if (this.wheelMesh) this.wheelMesh.visible = !this.flankOnlyMode;
        if (this.wormSurfMesh) this.wormSurfMesh.visible = this.flankOnlyMode;
        if (this.wheelSurfMesh) this.wheelSurfMesh.visible = this.flankOnlyMode;
        return this.flankOnlyMode;
    }

    setWormVisible(visible) {
        this.wormVisible = !!visible;
        if (this.wormGroup) {
            this.wormGroup.visible = this.wormVisible;
        }
        return this.wormVisible;
    }

    setWheelVisible(visible) {
        this.wheelVisible = !!visible;
        if (this.wheelGroup) {
            this.wheelGroup.visible = this.wheelVisible;
        }
        return this.wheelVisible;
    }

    toggleWormVisible() {
        return this.setWormVisible(!this.wormVisible);
    }

    toggleWheelVisible() {
        return this.setWheelVisible(!this.wheelVisible);
    }

    setMeshDensityLevel(level) {
        this.meshDensityLevel = Math.max(1, Math.min(10, parseInt(level) || 8));
        if (this.geom) {
            const curWormAngle = this.wormAngle;
            const curWheelAngle = this.wheelAngle;
            this.setGeometry(this.geom);
            this.wormAngle = curWormAngle;
            this.wheelAngle = curWheelAngle;
            this.updateGearRotations();
        }
        return this.meshDensityLevel;
    }

    setContactMode(mode) {
        this.contactMode = (mode === 'crowning') ? 'crowning' : 'theory';
        if (this.geom) {
            const curWormAngle = this.wormAngle;
            const curWheelAngle = this.wheelAngle;
            this.setGeometry(this.geom);
            this.wormAngle = curWormAngle;
            this.wheelAngle = curWheelAngle;
            this.updateGearRotations();
        }
        return this.contactMode;
    }

    resetView() {
        this.setViewPreset('iso');
    }

    setViewPreset(preset) {
        if (!this.camera || !this.controls) return;

        const a = this.centerDistA || 103.3663;
        const de2 = this.geom ? (parseFloat(this.geom.de2) || 183.23) : 183.23;
        const da1 = this.geom ? (parseFloat(this.geom.da1) || 44.7) : 44.7;
        const span = Math.max(120.0, de2 * 0.5 + a + da1 * 0.5);
        const cenX = 0.0;
        // Midpoint between wheel top (+de2/2) and worm bottom (-a - da1/2):
        const cenY = (de2 * 0.5 - (a + da1 * 0.5)) * 0.5;
        const cenZ = 0.0;
        const viewDist = span * 1.62;

        switch (preset) {
            case 'front': // Front View (XY plane from +Z: shows horizontal Worm 1 under Wheel 2)
                this.camera.position.set(cenX, cenY, cenZ + viewDist * 1.05);
                this.camera.up.set(0, 1, 0);
                this.controls.target.set(cenX, cenY, cenZ);
                break;
            case 'worm': // Side Throat View along +X axis (YZ plane: shows concave wheel throat wrapping worm!)
                const throatY = -a + (this.geom ? (parseFloat(this.geom.d1) || 36.23) : 36.23) * 0.5;
                this.camera.position.set(cenX + viewDist * 0.85, throatY, cenZ);
                this.camera.up.set(0, 1, 0);
                this.controls.target.set(cenX, throatY, cenZ);
                break;
            case 'wheel': // Direct Wheel View from +Z centered on Wheel 2
                this.camera.position.set(0, 0, viewDist * 0.95);
                this.camera.up.set(0, 1, 0);
                this.controls.target.set(0, 0, 0);
                break;
            case 'top': // Top View looking down -Y
                this.camera.position.set(0, viewDist * 1.15, 0);
                this.camera.up.set(0, 0, -1);
                this.controls.target.set(0, -a * 0.5, 0);
                break;
            case 'mesh': // Close-up on Conjugate Meshing Throat Zone at (0, -a + r1, 0)
                const d1 = this.geom ? (parseFloat(this.geom.d1) || 36.23) : 36.23;
                const b2H = this.geom ? (parseFloat(this.geom.b2H) || 33.57) : 33.57;
                const meshY = -a + d1 * 0.5;
                const meshDist = Math.max(55.0, 1.8 * b2H);
                this.camera.position.set(meshDist * 0.45, meshY - meshDist * 0.15, meshDist * 0.80);
                this.camera.up.set(0, 1, 0);
                this.controls.target.set(0, meshY, 0);
                break;
            case 'rear': // Close-up on Rear Tooth Flank Contact Imprint (Soi Vết In Màu Mặt Sau Sườn Răng)
                const d1_r = this.geom ? (parseFloat(this.geom.d1) || 36.23) : 36.23;
                const b2H_r = this.geom ? (parseFloat(this.geom.b2H) || 33.57) : 33.57;
                const meshY_r = -a + d1_r * 0.5;
                const rearDist = Math.max(50.0, 1.5 * b2H_r);
                this.camera.position.set(-rearDist * 0.35, meshY_r + rearDist * 0.45, rearDist * 0.90);
                this.camera.up.set(0, 1, 0);
                this.controls.target.set(0, meshY_r, 0);
                break;
            case 'iso':
            default:
                this.camera.position.set(cenX + viewDist * 0.72, cenY + viewDist * 0.38, cenZ + viewDist * 0.85);
                this.camera.up.set(0, 1, 0);
                this.controls.target.set(cenX, cenY, cenZ);
                break;
        }

        this.camera.lookAt(this.controls.target);
        this.controls.update();
    }

    meshToRawTriangles(meshData) {
        if (!meshData) return [];
        if (meshData.rawTriangles) return meshData.rawTriangles;
        const { vertices, normals, indices } = meshData;
        if (!vertices || !indices) return [];
        const tris = [];
        for (let i = 0; i < indices.length; i += 3) {
            const i1 = indices[i] * 3, i2 = indices[i + 1] * 3, i3 = indices[i + 2] * 3;
            const p1 = [vertices[i1], vertices[i1 + 1], vertices[i1 + 2]];
            const p2 = [vertices[i2], vertices[i2 + 1], vertices[i2 + 2]];
            const p3 = [vertices[i3], vertices[i3 + 1], vertices[i3 + 2]];
            const n = normals ? [normals[i1], normals[i1 + 1], normals[i1 + 2]] : [0, 1, 0];
            tris.push([p1, p2, p3, n]);
        }
        return tris;
    }

    /**
     * Extracts raw triangles for 3D CAD export (Worm 1, Worm Wheel 2, or Assembly Pair)
     * @param {string} type - 'worm' ('pinion'), 'wheel' ('gear'), or 'assembly'
     * @param {boolean} surfaceOnly - If true, exports open flank surface only
     * @param {boolean} forStep - Uses compact STEP resolution if true
     */
    getExportTriangles(type = 'worm', surfaceOnly = false, forStep = false) {
        if (!this.geom || typeof Worm3DGenerator === 'undefined') return [];

        const activeLevel = Math.max(1, Math.min(10, parseInt(this.meshDensityLevel) || 8));
        const density = Worm3DGenerator.getDensitySettings(activeLevel, this.geom.z1, this.geom.z2);

        // Balanced CAD Export Settings for Mastercam & SolidWorks STEP compatibility:
        // Capped to prevent Mastercam Parasolid translator stalls (eliminating the 13,231 faces bottleneck)
        const stepOpts = forStep ? {
            numWormSlices: surfaceOnly ? 48 : Math.min(96, Math.max(48, density.wormSlices)),
            ptsPerFlank: surfaceOnly ? 8 : Math.min(12, Math.max(8, density.wormPtsR)),
            wormTipPts: surfaceOnly ? 4 : Math.min(6, Math.max(4, density.wormTipPts)),
            numWheelSlices: surfaceOnly ? 25 : Math.min(32, Math.max(22, density.wheelSlices)),
            wheelPtsR: surfaceOnly ? 8 : Math.min(10, Math.max(8, density.wheelPtsR)),
            wheelTipPts: 3
        } : {
            meshDensityLevel: activeLevel
        };

        const fullOpts = Object.assign({}, this.geom, stepOpts, { surfaceOnly });

        if (type === 'worm' || type === 'pinion') {
            const m1 = surfaceOnly
                ? Worm3DGenerator.generateWormSurfaceMesh(fullOpts)
                : Worm3DGenerator.generateWormMesh(fullOpts);
            return this.meshToRawTriangles(m1);
        }

        if (type === 'wheel' || type === 'gear') {
            const m2 = surfaceOnly
                ? Worm3DGenerator.generateWheelSurfaceMesh(fullOpts)
                : Worm3DGenerator.generateWheelMesh(fullOpts);
            return this.meshToRawTriangles(m2);
        }

        // Assembly Pair: Worm 1 translated to (0, -a, 0) + Worm Wheel 2 at (0, 0, 0)
        const m1 = surfaceOnly
            ? Worm3DGenerator.generateWormSurfaceMesh(fullOpts)
            : Worm3DGenerator.generateWormMesh(fullOpts);
        const m2 = surfaceOnly
            ? Worm3DGenerator.generateWheelSurfaceMesh(fullOpts)
            : Worm3DGenerator.generateWheelMesh(fullOpts);
        const a = this.centerDistA || parseFloat(this.geom.a) || 103.3663;

        const rawM1 = this.meshToRawTriangles(m1);
        const tWorm = rawM1.map(([p1, p2, p3, n]) => [
            [p1[0], p1[1] - a, p1[2]],
            [p2[0], p2[1] - a, p2[2]],
            [p3[0], p3[1] - a, p3[2]],
            [n[0], n[1], n[2]]
        ]);
        const tWheel = this.meshToRawTriangles(m2);

        if (forStep) {
            return [tWorm, tWheel];
        }
        return tWorm.concat(tWheel);
    }

    /**
     * Extracts true parametric B-Spline surfaces and wireframe profile curves for Mastercam IGES export.
     * @param {string} type - 'worm', 'wheel', 'assembly', or 'curves_worm'
     */
    getParametricData(type = 'worm') {
        if (!this.geom || typeof Worm3DGenerator === 'undefined') return { surfaces: [], curves: [] };

        const a = this.centerDistA || parseFloat(this.geom.a) || 103.3663;
        const L = parseFloat(this.geom.L) || 56.0;
        const b2H = parseFloat(this.geom.b2H) || 33.57;

        if (type === 'worm' || type === 'pinion') {
            const data = Worm3DGenerator.getWormParametricData(Object.assign({}, this.geom, { includeCurves: false }));
            data.curves = [{
                label: 'AXIS_W1',
                points: [[-L * 0.5 - 15, 0, 0], [L * 0.5 + 15, 0, 0]],
                color: 1,
                level: 3
            }];
            return data;
        }

        if (type === 'wheel' || type === 'gear') {
            const data = Worm3DGenerator.getWheelParametricData(Object.assign({}, this.geom, { exportAllTeeth: true, includeCurves: false }));
            data.curves = [{
                label: 'AXIS_W2',
                points: [[0, 0, -b2H * 0.5 - 15], [0, 0, b2H * 0.5 + 15]],
                color: 1,
                level: 3
            }];
            return data;
        }

        if (type === 'curves_worm') {
            const data = Worm3DGenerator.getWormParametricData(Object.assign({}, this.geom, { curvesOnly: true, includeCurves: true, ptsPerCurve: 60, numProfiles: 11 }));
            return {
                surfaces: [],
                curves: [
                    ...data.curves,
                    {
                        label: 'AXIS_W1',
                        points: [[-L * 0.5 - 15, 0, 0], [L * 0.5 + 15, 0, 0]],
                        color: 1,
                        level: 3
                    }
                ]
            };
        }

        // Assembly Pair: Worm 1 translated along Y by -a, Worm Wheel 2 at origin (full 360-deg)
        const wormData = Worm3DGenerator.getWormParametricData(Object.assign({}, this.geom, { includeCurves: false }));
        const wheelData = Worm3DGenerator.getWheelParametricData(Object.assign({}, this.geom, { exportAllTeeth: true, includeCurves: false }));

        const shiftedSurfaces = wormData.surfaces.map(s => ({
            label: s.label,
            color: s.color,
            level: 1,
            grid: s.grid.map(slice => slice.map(p => [p[0], p[1] - a, p[2]]))
        }));

        const shiftedCurves = [
            {
                label: 'AXIS_W1',
                points: [[-L * 0.5 - 15, -a, 0], [L * 0.5 + 15, -a, 0]],
                color: 1,
                level: 3
            },
            {
                label: 'AXIS_W2',
                points: [[0, 0, -b2H * 0.5 - 15], [0, 0, b2H * 0.5 + 15]],
                color: 1,
                level: 3
            }
        ];

        return {
            surfaces: shiftedSurfaces.concat(wheelData.surfaces),
            curves: shiftedCurves
        };
    }
}

if (typeof window !== 'undefined') {
    window.Worm3DVisualizer = Worm3DVisualizer;
}



/**
 * ============================================================================
 * MITCALC WORM GEAR UI CONTROLLER (Gear4_01.xlsb - Module 3)
 * ============================================================================
 * Connects DOM inputs/outputs in modules/worm-gear/index.html with:
 * - WormCalcEngine (worm-calc-engine.js)
 * - WormCanvasRenderer (worm-canvas.js)
 * - Materials & WORM_WHEEL_MATERIALS & WORM_STD_TABLES
 * ============================================================================
 */

class WormUIController {
    constructor() {
        this.activeMode = '2D';
        this.canvasRenderer = new WormCanvasRenderer('wormCanvas');
        const container3DEl = document.getElementById('worm3DContainer');
        this.visualizer3D = (typeof Worm3DVisualizer !== 'undefined' && container3DEl)
            ? new Worm3DVisualizer(container3DEl)
            : null;
        window.worm3DVisualizer = this.visualizer3D;
        window.wormCanvas = this.canvasRenderer;
        this.latestResult = null;
        this.init();
    }

    init() {
        this.populateSelectDropdowns();
        this.bindTabsAndAccordions();
        this.bindInputsAndControls();
        this.bindCanvasControls();
        this.resetDefaults();
    }

    parseVal(elId, fallback = 0) {
        const el = document.getElementById(elId);
        if (!el) return fallback;
        const raw = String(el.value || '').trim().replace(',', '.');
        const num = parseFloat(raw);
        return Number.isFinite(num) ? num : fallback;
    }

    setVal(elId, val, decimals = null) {
        const el = document.getElementById(elId);
        if (!el) return;
        if (val === null || val === undefined || (typeof val === 'number' && !Number.isFinite(val))) {
            if (el.tagName === 'INPUT' || el.tagName === 'SELECT' || el.tagName === 'TEXTAREA') {
                el.value = '-';
            } else {
                el.textContent = '-';
            }
            return;
        }
        const formatted = (decimals !== null && typeof val === 'number')
            ? val.toFixed(decimals)
            : String(val);
        if (el.tagName === 'INPUT' || el.tagName === 'SELECT' || el.tagName === 'TEXTAREA') {
            if (document.activeElement !== el) {
                el.value = formatted;
            }
        } else {
            el.textContent = formatted;
        }
    }

    populateSelectDropdowns() {
        // 1. Worm Materials (51 steels from Materials / MATERIALS_DB)
        const selMatP = document.getElementById('sel_matP');
        const matDb = (typeof MATERIALS_DB !== 'undefined')
            ? MATERIALS_DB
            : ((typeof Materials !== 'undefined') ? Materials : []);
        if (selMatP && Array.isArray(matDb)) {
            selMatP.innerHTML = '';
            matDb.forEach(m => {
                const opt = document.createElement('option');
                opt.value = m.id;
                opt.textContent = `${m.id}. ${m.fullName || m.name}`;
                if (m.id === 41) opt.selected = true;
                selMatP.appendChild(opt);
            });
        }

        // 2. Worm Wheel Materials (11 bronzes/cast irons from WORM_WHEEL_MATERIALS)
        const selMatW = document.getElementById('sel_matW');
        if (selMatW && typeof WORM_WHEEL_MATERIALS !== 'undefined') {
            selMatW.innerHTML = '';
            WORM_WHEEL_MATERIALS.forEach(m => {
                const opt = document.createElement('option');
                opt.value = m.id;
                opt.textContent = `${m.id}. ${m.fullName || m.name}`;
                if (m.id === 7) opt.selected = true;
                selMatW.appendChild(opt);
            });
        }

        // Helper for table dropdowns
        const fillSelect = (elId, list, defaultId, labelFn) => {
            const sel = document.getElementById(elId);
            if (!sel || !Array.isArray(list)) return;
            sel.innerHTML = '';
            list.forEach(item => {
                const opt = document.createElement('option');
                opt.value = item.id;
                opt.textContent = labelFn ? labelFn(item) : item.name;
                if (item.id === defaultId) opt.selected = true;
                sel.appendChild(opt);
            });
        };

        if (typeof WORM_STD_TABLES !== 'undefined') {
            fillSelect('sel_toothType', WORM_STD_TABLES.T_ToothType, 2);
            fillSelect('sel_loadTypeA', WORM_STD_TABLES.T_LoadType, 1);
            fillSelect('sel_loadTypeB', WORM_STD_TABLES.T_LoadType, 1);
            fillSelect('sel_designCooling', WORM_STD_TABLES.T_DesignCooling, 1);
            fillSelect('sel_oilType', WORM_STD_TABLES.T_OilType, 3);
            fillSelect('sel_lubricant', WORM_STD_TABLES.T_Lubricant, 6, item => `${item.name} (ν40=${item.ny40}, ν100=${item.ny100})`);
            fillSelect('sel_bearingType', WORM_STD_TABLES.T_BearingTyp, 1);

            // Standard combo-box helper selects
            const fillComboSelect = (elId, arr, placeholder = '') => {
                const sel = document.getElementById(elId);
                if (!sel || !Array.isArray(arr)) return;
                sel.innerHTML = `<option value="">${placeholder}</option>`;
                arr.forEach(v => {
                    const opt = document.createElement('option');
                    opt.value = v;
                    opt.textContent = v;
                    sel.appendChild(opt);
                });
            };

            fillComboSelect('sel_std_i', WORM_STD_TABLES.T_i);
            fillComboSelect('sel_std_alfa0', WORM_STD_TABLES.T_Alfa0);
            fillComboSelect('sel_std_q', WORM_STD_TABLES.T_Diam_q);
            fillComboSelect('sel_std_gama', WORM_STD_TABLES.T_gamaProp);
            fillComboSelect('sel_std_module', WORM_STD_TABLES.T_Module);
            fillComboSelect('sel_std_av', WORM_STD_TABLES.T_av);
        }
    }

    bindTabsAndAccordions() {
        // Main 2-Tab Navigation
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const targetId = btn.getAttribute('data-target');
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.tab-pane').forEach(p => {
                    p.classList.remove('active');
                    p.style.display = 'none';
                });
                btn.classList.add('active');
                const pane = document.getElementById(targetId);
                if (pane) {
                    pane.classList.add('active');
                    pane.style.display = 'block';
                }
                if (targetId === 'tabCanvas') {
                    if (this.activeMode === '2D') {
                        this.canvasRenderer.render();
                    } else if (this.activeMode === '3D' && this.visualizer3D) {
                        this.visualizer3D.onResize();
                        if (this.latestResult) {
                            this.visualizer3D.setGeometry(this.latestResult);
                        }
                    }
                }
            });
        });

        // Accordion Section Headers (.calc-section and .accordion-section)
        document.querySelectorAll('.calc-section .section-header, .accordion-section .section-header').forEach(hdr => {
            hdr.addEventListener('click', (e) => {
                if (e.target.closest('button') || e.target.closest('input') || e.target.closest('select')) return;
                const sec = hdr.closest('.calc-section') || hdr.closest('.accordion-section');
                if (!sec) return;
                const isCollapsed = sec.classList.contains('collapsed');
                sec.classList.toggle('collapsed', !isCollapsed);
                sec.classList.toggle('open', isCollapsed);
                const toggle = hdr.querySelector('.section-toggle');
                if (toggle) toggle.textContent = isCollapsed ? '▼' : '▶';
            });
        });

        const toggleAllSections = (expand) => {
            document.querySelectorAll('.calc-section, .accordion-section').forEach(sec => {
                sec.classList.toggle('collapsed', !expand);
                sec.classList.toggle('open', expand);
                const toggle = sec.querySelector('.section-toggle');
                if (toggle) toggle.textContent = expand ? '▼' : '▶';
            });
        };

        // Expand / Collapse All
        const btnExpandAll = document.getElementById('btnExpandAll');
        if (btnExpandAll) {
            btnExpandAll.addEventListener('click', () => toggleAllSections(true));
        }
        const btnCollapseAll = document.getElementById('btnCollapseAll');
        if (btnCollapseAll) {
            btnCollapseAll.addEventListener('click', () => toggleAllSections(false));
        }
    }

    bindComboArrow(selectId, inputId) {
        const sel = document.getElementById(selectId);
        const inp = document.getElementById(inputId);
        if (!sel || !inp) return;
        sel.addEventListener('change', () => {
            if (sel.value !== '') {
                inp.value = sel.value;
                sel.value = '';
                this.recalculate();
            }
        });
    }

    syncRadioCalcQVisuals() {
        const checkedRadio = document.querySelector('input[name="rad_calc_q"]:checked');
        const calcQ = checkedRadio ? parseInt(checkedRadio.value, 10) : 1;

        const inpQ = document.getElementById('inp_q');
        const inpD1 = document.getElementById('inp_d1_Input');
        const inpGama = document.getElementById('inp_gama');

        const setInputMode = (el, isEditable) => {
            if (!el) return;
            el.readOnly = !isEditable;
            if (isEditable) {
                el.classList.add('user-input');
                el.classList.remove('readonly-calc');
            } else {
                el.classList.remove('user-input');
                el.classList.add('readonly-calc');
            }
        };

        setInputMode(inpQ, calcQ === 1);
        setInputMode(inpD1, calcQ === 2);
        setInputMode(inpGama, calcQ === 3);

        const optFitQ = document.getElementById('opt_fit_q');
        const selFitAxis = document.getElementById('sel_FitAxis');
        if (optFitQ) {
            optFitQ.textContent = (calcQ === 1)
                ? 'Thay đổi hệ số đường kính trục vít [4.6]'
                : 'Không khả dụng ở chế độ này';
        }
        if (selFitAxis && calcQ !== 1 && selFitAxis.value === '3') {
            selFitAxis.value = '2';
        }
    }

    syncAutoFlagsVisuals() {
        const toggleAutoInput = (chkId, inpIds) => {
            const chk = document.getElementById(chkId);
            if (!chk) return;
            const isAuto = chk.checked;
            inpIds.forEach(id => {
                const inp = document.getElementById(id);
                if (!inp) return;
                inp.readOnly = isAuto;
                if (isAuto) {
                    inp.classList.remove('user-input');
                    inp.classList.add('readonly-calc');
                } else {
                    inp.classList.add('user-input');
                    inp.classList.remove('readonly-calc');
                }
            });
        };

        toggleAutoInput('chk_kaFlag', ['inp_KA']);
        toggleAutoInput('chk_rf1Flag', ['inp_rf1']);
        toggleAutoInput('chk_l1l2_flag', ['inp_l1_input', 'inp_l2_input']);
        toggleAutoInput('chk_FlagL', ['inp_L_Input']);
        toggleAutoInput('chk_Flagb2H', ['inp_b2H_Input']);
        toggleAutoInput('chk_de2Flag', ['inp_de2Input']);
        toggleAutoInput('chk_dstFlag', ['inp_Shaft_ds', 'inp_Shaft_th']);
    }

    bindInputsAndControls() {
        // Combo-box arrows
        this.bindComboArrow('sel_std_i', 'inp_iin');
        this.bindComboArrow('sel_std_alfa0', 'inp_alfa_temp');
        this.bindComboArrow('sel_std_q', 'inp_q');
        this.bindComboArrow('sel_std_gama', 'inp_gama');
        this.bindComboArrow('sel_std_module', 'inp_m_Input');
        this.bindComboArrow('sel_std_av', 'inp_a_req');

        // Lubricant dropdown updates ny40, ny100, rooil15 automatically (like VBA LubricantChange)
        const selLub = document.getElementById('sel_lubricant');
        if (selLub) {
            selLub.addEventListener('change', () => {
                const lubId = parseInt(selLub.value, 10);
                if (typeof WORM_STD_TABLES !== 'undefined') {
                    const item = WORM_STD_TABLES.T_Lubricant.find(x => x.id === lubId);
                    if (item && item.id < 12) {
                        const el40 = document.getElementById('inp_ny40');
                        const el100 = document.getElementById('inp_ny100');
                        const elRo = document.getElementById('inp_rooil15');
                        if (el40) el40.value = item.ny40.toFixed(1);
                        if (el100) el100.value = item.ny100.toFixed(1);
                        if (elRo) elRo.value = item.rooil15.toFixed(3);
                    }
                }
                this.recalculate();
            });
        }

        // Radio calc_q (4.6 / 4.7 / 4.8)
        document.querySelectorAll('input[name="rad_calc_q"]').forEach(r => {
            r.addEventListener('change', () => {
                this.syncRadioCalcQVisuals();
                this.recalculate();
            });
        });

        // Auto checkboxes
        ['chk_kaFlag', 'chk_rf1Flag', 'chk_l1l2_flag', 'chk_FlagL', 'chk_Flagb2H', 'chk_de2Flag', 'chk_dstFlag'].forEach(chkId => {
            const chk = document.getElementById(chkId);
            if (chk) {
                chk.addEventListener('change', () => {
                    this.syncAutoFlagsVisuals();
                    this.recalculate();
                });
            }
        });

        // Slider x2 <-> inp_x2
        const sliderX2 = document.getElementById('slider_x2');
        const inpX2 = document.getElementById('inp_x2');
        if (sliderX2 && inpX2) {
            sliderX2.addEventListener('input', () => {
                inpX2.value = parseFloat(sliderX2.value).toFixed(4);
                this.recalculate();
            });
            inpX2.addEventListener('input', () => {
                const v = this.parseVal('inp_x2', 0);
                sliderX2.value = Math.max(-1, Math.min(1, v));
            });
        }

        // Button [ < ] Set Self-Locking Lead Angle (Row 50: gama = gama_SelfLock)
        const btnGamaSL = document.getElementById('btn_gama_SL');
        if (btnGamaSL) {
            btnGamaSL.addEventListener('click', () => {
                if (!this.latestResult) return;
                const radio3 = document.querySelector('input[name="rad_calc_q"][value="3"]');
                if (radio3) radio3.checked = true;
                this.syncRadioCalcQVisuals();
                const inpGama = document.getElementById('inp_gama');
                if (inpGama) {
                    inpGama.value = this.latestResult.gama_SelfLock.toFixed(4);
                }
                this.recalculate();
            });
        }

        // Button [ Tính khớp a ] FitAxisDistance Solver (VBA FitAxisDistance exact port)
        const btnSolveFitAxis = document.getElementById('btn_SolveFitAxis');
        if (btnSolveFitAxis) {
            btnSolveFitAxis.addEventListener('click', () => {
                this.solveFitAxisDistance();
            });
        }

        // Section 16.0: Sync z2_req = ROUND(z1_req * iin)
        const btnSyncZ2Req = document.getElementById('btn_sync_z2req');
        if (btnSyncZ2Req) {
            btnSyncZ2Req.addEventListener('click', () => {
                const z1Req = this.parseVal('inp_z1_req', 1);
                const iin = this.parseVal('inp_iin', 40.0);
                const elZ2Req = document.getElementById('inp_z2_req');
                if (elZ2Req) elZ2Req.value = Math.max(5, Math.round(z1Req * iin));
                this.recalculate();
            });
        }

        // Section 16.0: Apply selected variant from AxisDistTbl to Section 4.0
        const btnApplyAxisDist = document.getElementById('btn_ApplyAxisDist');
        if (btnApplyAxisDist) {
            btnApplyAxisDist.addEventListener('click', () => {
                this.applySelectedAxisDistVariant();
            });
        }

        // Jump buttons from Section 1.0 & 4.0 to Section 18.0
        const openSec18AndFocus = (focusId) => {
            const sec18 = document.getElementById('sec18Accordion');
            if (sec18) {
                sec18.classList.remove('collapsed');
                sec18.classList.add('open');
                const toggle = sec18.querySelector('.section-toggle');
                if (toggle) toggle.textContent = '▼';
                sec18.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            const el = document.getElementById(focusId);
            if (el) setTimeout(() => el.focus(), 250);
        };

        const btnJumpN1N2 = document.getElementById('btn_jump_n1n2');
        if (btnJumpN1N2) btnJumpN1N2.addEventListener('click', () => openSec18AndFocus('inp_XX_n1'));

        const btnJumpPw2 = document.getElementById('btn_jump_Pw2');
        if (btnJumpPw2) btnJumpPw2.addEventListener('click', () => openSec18AndFocus('inp_XX_Mk2'));

        const btnJumpZ1Z2 = document.getElementById('btn_jump_z1z2');
        if (btnJumpZ1Z2) btnJumpZ1Z2.addEventListener('click', () => openSec18AndFocus('inp_XX_z1'));

        // Section 18.0 Auxiliary [ OK ] Transfer Buttons (VBA Move_z1z2, Move_n1n2, Move_Pwn2)
        const btnMoveZ1Z2 = document.getElementById('btn_Move_z1z2');
        if (btnMoveZ1Z2) {
            btnMoveZ1Z2.addEventListener('click', () => {
                if (!this.latestResult) return;
                const elIin = document.getElementById('inp_iin');
                const elZ1 = document.getElementById('inp_z1');
                if (elIin) elIin.value = this.latestResult.XXX_i.toFixed(2);
                if (elZ1) elZ1.value = Math.round(this.latestResult.XX_z1);
                this.recalculate();
            });
        }

        const btnMoveN1N2 = document.getElementById('btn_Move_n1n2');
        if (btnMoveN1N2) {
            btnMoveN1N2.addEventListener('click', () => {
                if (!this.latestResult) return;
                const elIin = document.getElementById('inp_iin');
                const elN1 = document.getElementById('inp_n1');
                if (elIin) elIin.value = this.latestResult.XX_i.toFixed(2);
                if (elN1) elN1.value = this.latestResult.XX_n1.toFixed(1);
                this.recalculate();
            });
        }

        const btnMovePwN2 = document.getElementById('btn_Move_Pwn2');
        if (btnMovePwN2) {
            btnMovePwN2.addEventListener('click', () => {
                if (!this.latestResult) return;
                const elPw2 = document.getElementById('inp_Pw2');
                const elN1 = document.getElementById('inp_n1');
                if (elPw2) elPw2.value = this.latestResult.XX_Pw2.toFixed(3);
                if (elN1) elN1.value = (this.latestResult.XX_n2 * this.latestResult.i).toFixed(1);
                this.recalculate();
            });
        }

        // Section 19.0 CAD Icon Buttons (Export DXF directly)
        document.querySelectorAll('.cad-icon-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const mode = btn.getAttribute('data-dxf-mode') || 'assembly';
                this.canvasRenderer.exportDXF(mode);
            });
        });

        // Header Reset & Print
        const btnReset = document.getElementById('btnResetDefaults');
        if (btnReset) {
            btnReset.addEventListener('click', () => this.resetDefaults());
        }
        const btnPrint = document.getElementById('btnPrintReport');
        if (btnPrint) {
            btnPrint.addEventListener('click', () => window.print());
        }

        // Bind all inputs & selects for live recalculation
        const allInputs = document.querySelectorAll('#tabCalculator input, #tabCalculator select');
        allInputs.forEach(el => {
            if (el.id && el.id.startsWith('sel_std_')) return;
            if (el.id === 'sel_AxisDist') return;
            const evtName = (el.tagName === 'SELECT' || el.type === 'checkbox' || el.type === 'radio') ? 'change' : 'input';
            el.addEventListener(evtName, () => this.recalculate());
            if (evtName === 'input') {
                el.addEventListener('change', () => this.recalculate());
            }
        });
    }

    bindCanvasControls() {
        // 1. 2D / 3D Mode Switcher
        const btnMode2D = document.getElementById('btnMode2D');
        const btnMode3D = document.getElementById('btnMode3D');
        const container2D = document.getElementById('container2D');
        const container3D = document.getElementById('container3D');
        const toolbar2D = document.getElementById('toolbar2D');
        const toolbar3D = document.getElementById('toolbar3D');
        const visualizerTitle = document.getElementById('visualizerTitle');
        const visualizerDesc = document.getElementById('visualizerDesc');

        if (btnMode2D && btnMode3D) {
            btnMode2D.addEventListener('click', () => {
                this.activeMode = '2D';
                btnMode2D.style.background = 'var(--accent-green)';
                btnMode2D.style.color = '#000';
                btnMode3D.style.background = 'transparent';
                btnMode3D.style.color = 'var(--text-secondary)';
                if (container2D) container2D.style.display = 'flex';
                if (container3D) container3D.style.display = 'none';
                if (toolbar2D) toolbar2D.style.display = 'flex';
                if (toolbar3D) toolbar3D.style.display = 'none';
                if (visualizerTitle) visualizerTitle.textContent = '📐 Mô Hình 2D Bộ Truyền Trục Vít - Bánh Vít Ăn Khớp (DIN 3975 / DIN 3996)';
                if (visualizerDesc) visualizerDesc.textContent = 'Bản vẽ lắp 2 hình chiếu vuông góc chuẩn MITCalc Data1, mặt cắt họng bánh vít lõm ôm trục vít có bán kính lượn chân răng rf1. Bấm 3D WebGL để quan sát ăn khớp không gian và xuất file CAD STEP/STL cho SolidWorks & Mastercam.';
                this.canvasRenderer.render();
            });

            btnMode3D.addEventListener('click', () => {
                this.activeMode = '3D';
                btnMode3D.style.background = 'var(--accent-cyan)';
                btnMode3D.style.color = '#000';
                btnMode2D.style.background = 'transparent';
                btnMode2D.style.color = 'var(--text-secondary)';
                if (container2D) container2D.style.display = 'none';
                if (container3D) container3D.style.display = 'block';
                if (toolbar2D) toolbar2D.style.display = 'none';
                if (toolbar3D) toolbar3D.style.display = 'flex';
                if (visualizerTitle) visualizerTitle.textContent = '🧊 Mô Phỏng Ăn Khớp 3D WebGL (Trục Vít 1 & Bánh Vít Lõm 2)';
                if (visualizerDesc) visualizerDesc.textContent = 'Mô hình 3D thực thể Trục Vít xoắn ốc (ZA/ZN/ZI/ZK) có R chân rf1 và Bánh Vít họng lõm chữ U ôm trục vít. Xuất file CAD STEP AP214 / STL cho SolidWorks & Mastercam.';
                if (this.visualizer3D) {
                    requestAnimationFrame(() => {
                        this.visualizer3D.onResize();
                        if (this.latestResult) {
                            const curW = this.visualizer3D.wormAngle;
                            const curG = this.visualizer3D.wheelAngle;
                            this.visualizer3D.setGeometry(this.latestResult);
                            this.visualizer3D.wormAngle = curW;
                            this.visualizer3D.wheelAngle = curG;
                            this.visualizer3D.updateGearRotations();
                        }
                        if (!this._hasSetInitial3DView) {
                            this.visualizer3D.setViewPreset('iso');
                            this._hasSetInitial3DView = true;
                        }
                    });
                }
            });
        }

        // 2. 2D Canvas Controls
        const viewBtnIds = ['btnViewAssembly', 'btnViewWorm', 'btnViewWheel', 'btnViewNormalProfile', 'btnViewAxialProfile', 'btnViewTangentialProfile'];
        const setViewBtnActive = (activeBtnId, mode) => {
            viewBtnIds.forEach(id => {
                const b = document.getElementById(id);
                if (b) {
                    b.classList.toggle('btn-primary', id === activeBtnId);
                    b.classList.toggle('btn-secondary', id !== activeBtnId);
                }
            });
            this.canvasRenderer.viewMode = mode;
            this.canvasRenderer.render();
        };

        const btnAssy = document.getElementById('btnViewAssembly');
        if (btnAssy) btnAssy.addEventListener('click', () => setViewBtnActive('btnViewAssembly', 'assembly'));

        const btnWorm = document.getElementById('btnViewWorm');
        if (btnWorm) btnWorm.addEventListener('click', () => setViewBtnActive('btnViewWorm', 'worm'));

        const btnWheel = document.getElementById('btnViewWheel');
        if (btnWheel) btnWheel.addEventListener('click', () => setViewBtnActive('btnViewWheel', 'wheel'));

        const btnNormal = document.getElementById('btnViewNormalProfile');
        if (btnNormal) btnNormal.addEventListener('click', () => setViewBtnActive('btnViewNormalProfile', 'normal_profile'));

        const btnAxial = document.getElementById('btnViewAxialProfile');
        if (btnAxial) btnAxial.addEventListener('click', () => setViewBtnActive('btnViewAxialProfile', 'axial_profile'));

        const btnTangential = document.getElementById('btnViewTangentialProfile');
        if (btnTangential) btnTangential.addEventListener('click', () => setViewBtnActive('btnViewTangentialProfile', 'tangential_profile'));

        const btnToggleWorm2D = document.getElementById('btnToggleWorm2D');
        if (btnToggleWorm2D) {
            btnToggleWorm2D.addEventListener('click', () => {
                const vis = this.canvasRenderer.toggleWormVisible();
                btnToggleWorm2D.textContent = vis ? '🔩 Trục Vít: Hiện' : '🔩 Trục Vít: Ẩn';
                btnToggleWorm2D.style.opacity = vis ? '1' : '0.6';
            });
        }

        const btnToggleWheel2D = document.getElementById('btnToggleWheel2D');
        if (btnToggleWheel2D) {
            btnToggleWheel2D.addEventListener('click', () => {
                const vis = this.canvasRenderer.toggleWheelVisible();
                btnToggleWheel2D.textContent = vis ? '⚙️ Bánh Vít: Hiện' : '⚙️ Bánh Vít: Ẩn';
                btnToggleWheel2D.style.opacity = vis ? '1' : '0.6';
            });
        }

        const btnPlay = document.getElementById('btnPlayAnim');
        if (btnPlay) {
            btnPlay.addEventListener('click', () => {
                const running = this.canvasRenderer.toggleAnimation();
                btnPlay.textContent = running ? '⏸ Dừng Quay' : '▶ Mô Phỏng Ăn Khớp';
            });
        }

        const sliderSpeed = document.getElementById('sliderAnimSpeed');
        const lblSpeed = document.getElementById('lblAnimSpeed');
        if (sliderSpeed) {
            sliderSpeed.addEventListener('input', () => {
                const spd = parseFloat(sliderSpeed.value) || 1.0;
                this.canvasRenderer.animSpeed = spd;
                if (lblSpeed) lblSpeed.textContent = `${spd.toFixed(1)}x`;
            });
        }

        const btnToggleDims = document.getElementById('btnToggleDims');
        if (btnToggleDims) {
            btnToggleDims.addEventListener('click', () => {
                this.canvasRenderer.showDims = !this.canvasRenderer.showDims;
                this.canvasRenderer.render();
            });
        }

        const btnResetView = document.getElementById('btnResetView');
        if (btnResetView) {
            btnResetView.addEventListener('click', () => {
                this.canvasRenderer.resetView();
            });
        }

        // 2D DXF Export Dropdown & Items
        const btnExport2DMenu = document.getElementById('btnExport2DMenu');
        const export2DDropdown = document.getElementById('export2DDropdown');
        if (btnExport2DMenu && export2DDropdown) {
            btnExport2DMenu.addEventListener('click', (e) => {
                e.stopPropagation();
                export2DDropdown.style.display = (export2DDropdown.style.display === 'block') ? 'none' : 'block';
            });
            document.addEventListener('click', () => {
                export2DDropdown.style.display = 'none';
            });
        }

        const bind2DExp = (id, mode) => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('click', (e) => {
                    e.preventDefault();
                    if (export2DDropdown) export2DDropdown.style.display = 'none';
                    const targetMode = mode === 'current' ? this.canvasRenderer.viewMode : mode;
                    this.canvasRenderer.exportDXF(targetMode);
                });
            }
        };

        bind2DExp('expDxfCurrent', 'current');
        bind2DExp('expDxfNormalProfile', 'normal_profile');
        bind2DExp('expDxfAxialProfile', 'axial_profile');
        bind2DExp('expDxfTangentialProfile', 'tangential_profile');
        bind2DExp('expDxfAssembly', 'assembly');
        bind2DExp('expDxfWormFront', 'worm_front');
        bind2DExp('expDxfWheelThroat', 'gear_left');

        const btnExportDXF = document.getElementById('btnExportDXF');
        if (btnExportDXF) {
            btnExportDXF.addEventListener('click', () => {
                this.canvasRenderer.exportDXF(this.canvasRenderer.viewMode);
            });
        }

        // 3. 3D WebGL Controls
        const sel3DViewPreset = document.getElementById('sel3DViewPreset');
        const btnReset3DView = document.getElementById('btnReset3DView');
        if (sel3DViewPreset && this.visualizer3D) {
            sel3DViewPreset.addEventListener('change', () => {
                this.visualizer3D.setViewPreset(sel3DViewPreset.value);
            });
        }
        if (btnReset3DView && this.visualizer3D) {
            btnReset3DView.addEventListener('click', () => {
                if (sel3DViewPreset) sel3DViewPreset.value = 'iso';
                this.visualizer3D.setViewPreset('iso');
            });
        }

        // 3D Worm and Wheel Visibility Toggles
        const btnToggleWorm = document.getElementById('btnToggleWorm');
        if (btnToggleWorm && this.visualizer3D) {
            btnToggleWorm.addEventListener('click', () => {
                const vis = this.visualizer3D.toggleWormVisible();
                btnToggleWorm.textContent = vis ? '🔩 Trục Vít: Hiện' : '🔩 Trục Vít: Ẩn';
                btnToggleWorm.style.opacity = vis ? '1' : '0.6';
            });
        }

        const btnToggleWheel = document.getElementById('btnToggleWheel');
        if (btnToggleWheel && this.visualizer3D) {
            btnToggleWheel.addEventListener('click', () => {
                const vis = this.visualizer3D.toggleWheelVisible();
                btnToggleWheel.textContent = vis ? '⚙️ Bánh Vít: Hiện' : '⚙️ Bánh Vít: Ẩn';
                btnToggleWheel.style.opacity = vis ? '1' : '0.6';
            });
        }

        const btnWireframe = document.getElementById('btnToggleWireframe');
        if (btnWireframe && this.visualizer3D) {
            btnWireframe.addEventListener('click', () => {
                this.visualizer3D.toggleWireframe();
                btnWireframe.classList.toggle('active', this.visualizer3D.wireframeMode);
            });
        }

        const btnFlankOnly = document.getElementById('btnToggleFlankOnly');
        if (btnFlankOnly && this.visualizer3D) {
            btnFlankOnly.addEventListener('click', () => {
                const isFlankOnly = this.visualizer3D.toggleFlankOnly();
                btnFlankOnly.classList.toggle('active', isFlankOnly);
                btnFlankOnly.textContent = isFlankOnly ? '👁️ Đang Xem Mặt Bên' : '👁️ Chỉ Mặt Bên';
            });
        }

        const btnToggle3DAnim = document.getElementById('btnToggle3DAnim');
        if (btnToggle3DAnim && this.visualizer3D) {
            btnToggle3DAnim.addEventListener('click', () => {
                const isRunning = this.visualizer3D.toggleAnimation();
                btnToggle3DAnim.textContent = isRunning ? '⏸️ Tạm Dừng' : '▶️ Chạy Mô Phỏng';
            });
            btnToggle3DAnim.textContent = '▶️ Chạy Mô Phỏng';
        }

        const btn3DDir = document.getElementById('btn3DAnimDirection');
        if (btn3DDir && this.visualizer3D) {
            btn3DDir.addEventListener('click', () => {
                const dir = this.visualizer3D.toggleAnimDirection();
                if (dir === 1) {
                    btn3DDir.innerHTML = '🔄 Chiều: ↻ Thuận';
                    btn3DDir.style.color = '';
                    btn3DDir.style.borderColor = '';
                } else {
                    btn3DDir.innerHTML = '🔄 Chiều: ↺ Nghịch';
                    btn3DDir.style.color = '#f59e0b';
                    btn3DDir.style.borderColor = '#d97706';
                }
            });
        }

        const slider3DSpeed = document.getElementById('slider3DAnimSpeed');
        const anim3DSpeedVal = document.getElementById('anim3DSpeedVal');
        if (slider3DSpeed && this.visualizer3D) {
            slider3DSpeed.addEventListener('input', (e) => {
                const val = parseFloat(e.target.value) || 1.0;
                if (anim3DSpeedVal) anim3DSpeedVal.textContent = `${val.toFixed(1)}x`;
                this.visualizer3D.setAnimSpeed(val);
            });
        }

        const btn3DStepBack = document.getElementById('btn3DStepBack');
        const btn3DStepFwd = document.getElementById('btn3DStepFwd');
        if (btn3DStepBack && this.visualizer3D) {
            btn3DStepBack.addEventListener('click', () => {
                this.visualizer3D.stepAnimation(-1);
                if (btnToggle3DAnim) btnToggle3DAnim.textContent = '▶️ Chạy Mô Phỏng';
            });
        }
        if (btn3DStepFwd && this.visualizer3D) {
            btn3DStepFwd.addEventListener('click', () => {
                this.visualizer3D.stepAnimation(1);
                if (btnToggle3DAnim) btnToggle3DAnim.textContent = '▶️ Chạy Mô Phỏng';
            });
        }

        const selMeshDensity = document.getElementById('selMeshDensity');
        if (selMeshDensity && this.visualizer3D) {
            const initDensity = parseInt(selMeshDensity.value, 10) || 6;
            this.visualizer3D.setMeshDensityLevel(initDensity);
            selMeshDensity.addEventListener('change', (e) => {
                const level = parseInt(e.target.value, 10) || 6;
                this.visualizer3D.setMeshDensityLevel(level);
            });
        }



        // 4. 3D Export Dropdown & Items
        const btnExport3DMenu = document.getElementById('btnExport3DMenu');
        const export3DDropdown = document.getElementById('export3DDropdown');
        if (btnExport3DMenu && export3DDropdown) {
            btnExport3DMenu.addEventListener('click', (e) => {
                e.stopPropagation();
                export3DDropdown.style.display = (export3DDropdown.style.display === 'block') ? 'none' : 'block';
            });
            document.addEventListener('click', () => {
                export3DDropdown.style.display = 'none';
            });
        }

        const bind3DExp = (id, format, target) => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('click', (e) => {
                    e.preventDefault();
                    if (export3DDropdown) export3DDropdown.style.display = 'none';
                    this.export3DCAD(format, target);
                });
            }
        };

        // IGES 5.3 Mastercam Native Surface & Wireframe
        bind3DExp('expIgesWorm', 'iges', 'worm');
        bind3DExp('expIgesWheel', 'iges', 'wheel');
        bind3DExp('expIgesAssembly', 'iges', 'assembly');
        bind3DExp('expIgesCurvesWorm', 'iges_curves', 'worm');

        bind3DExp('expStepWorm', 'step', 'worm');
        bind3DExp('expStepWheel', 'step', 'wheel');
        bind3DExp('expStepAssembly', 'step', 'assembly');

        bind3DExp('expStepSurfaceWorm', 'step_surface', 'worm');
        bind3DExp('expStepSurfaceWheel', 'step_surface', 'wheel');
        bind3DExp('expStepSurfaceAssembly', 'step_surface', 'assembly');

        bind3DExp('expStlSurfaceWorm', 'stl_surface', 'worm');
        bind3DExp('expStlSurfaceWheel', 'stl_surface', 'wheel');

        bind3DExp('expStlWorm', 'stl', 'worm');
        bind3DExp('expStlWheel', 'stl', 'wheel');
        bind3DExp('expStlAssembly', 'stl', 'assembly');

        bind3DExp('expObjAssembly', 'obj', 'assembly');
    }

    export3DCAD(format, target) {
        if (!this.visualizer3D || !this.latestResult || typeof Worm3DExporter === 'undefined') return;
        const g = this.latestResult;
        const typeNames = { 1: 'ZA', 2: 'ZN', 3: 'ZI', 4: 'ZK' };
        const typeCode = typeNames[g.toothType] || 'ZN';

        // Native Mastercam IGES 5.3 Surface / Wireframe Export
        if (format === 'iges' || format === 'iges_curves') {
            const pData = this.visualizer3D.getParametricData(format === 'iges_curves' ? 'curves_worm' : target);
            let igsFilename = '';
            if (format === 'iges_curves') {
                igsFilename = `Khung_Day_Truc_Vit_1_${typeCode}_z${g.z1}_Ruled_Loft.igs`;
            } else if (target === 'worm') {
                igsFilename = `Truc_Vit_1_${typeCode}_z${g.z1}_Mastercam_Surface.igs`;
            } else if (target === 'wheel') {
                igsFilename = `Banh_Vit_Lom_2_${typeCode}_z${g.z2}_Mastercam_Surface.igs`;
            } else {
                igsFilename = `Cap_Truc_Vit_Banh_Vit_${typeCode}_z${g.z1}x${g.z2}_Mastercam_Surface.igs`;
            }
            return Worm3DExporter.exportIGES(pData, igsFilename, true);
        }

        const isSurface = (format === 'step_surface' || format === 'stl_surface');
        const forStep = (format === 'step' || format === 'step_surface');
        const tris = this.visualizer3D.getExportTriangles(target, isSurface, forStep);

        let filenameBase = '';
        let partName = '';
        if (target === 'worm') {
            filenameBase = `Truc_Vit_1_${typeCode}_z${g.z1}_mn${g.mn.toFixed(2)}`;
            partName = `WORM_1_${typeCode}_Z${g.z1}`;
        } else if (target === 'wheel') {
            filenameBase = `Banh_Vit_Lom_2_${typeCode}_z${g.z2}_mn${g.mn.toFixed(2)}`;
            partName = `WORM_WHEEL_2_${typeCode}_Z${g.z2}`;
        } else {
            filenameBase = `Cap_Truc_Vit_Banh_Vit_${typeCode}_z${g.z1}x${g.z2}_a${g.a.toFixed(1)}`;
            partName = `WORM_GEAR_ASSEMBLY_${typeCode}_Z${g.z1}x${g.z2}`;
        }

        if (isSurface) {
            filenameBase += '_Surface_Rong';
            partName += '_SURFACE';
        }

        if (format === 'step') {
            return Worm3DExporter.exportSTEP(tris, `${filenameBase}.step`, partName, true, false);
        } else if (format === 'step_surface') {
            return Worm3DExporter.exportSTEPSurface(tris, `${filenameBase}.step`, partName, true);
        } else if (format === 'stl' || format === 'stl_surface') {
            return Worm3DExporter.exportBinarySTL(tris, `${filenameBase}.stl`);
        } else if (format === 'obj') {
            return Worm3DExporter.exportOBJ(tris, `${filenameBase}.obj`);
        }
    }

    collectParams() {
        const checkedRadio = document.querySelector('input[name="rad_calc_q"]:checked');
        const calc_q = checkedRadio ? parseInt(checkedRadio.value, 10) : 1;

        return {
            // Section 1.0
            poweredWoWh: parseInt(document.getElementById('sel_poweredWoWh')?.value || '1', 10),
            Pw2: this.parseVal('inp_Pw2', 3.0),
            n1: this.parseVal('inp_n1', 1500.0),
            iin: this.parseVal('inp_iin', 40.0),

            // Section 2.0
            matP: parseInt(document.getElementById('sel_matP')?.value || '41', 10),
            matW: parseInt(document.getElementById('sel_matW')?.value || '7', 10),
            toothType: parseInt(document.getElementById('sel_toothType')?.value || '2', 10),
            loadTypeA: parseInt(document.getElementById('sel_loadTypeA')?.value || '1', 10),
            loadTypeB: parseInt(document.getElementById('sel_loadTypeB')?.value || '1', 10),
            designCooling: parseInt(document.getElementById('sel_designCooling')?.value || '1', 10),
            oilType: parseInt(document.getElementById('sel_oilType')?.value || '3', 10),
            lubricant: parseInt(document.getElementById('sel_lubricant')?.value || '6', 10),
            ny40: this.parseVal('inp_ny40', 220.0),
            ny100: this.parseVal('inp_ny100', 40.0),
            rooil15: this.parseVal('inp_rooil15', 1.06),
            Ra1: this.parseVal('inp_Ra1', 0.5),
            kaFlag: document.getElementById('chk_kaFlag')?.checked ?? true,
            KA: this.parseVal('inp_KA', 1.0),

            // Section 3.0
            haXP: this.parseVal('inp_haXP', 1.0),
            caXP: this.parseVal('inp_caXP', 0.25),
            rf1Flag: document.getElementById('chk_rf1Flag')?.checked ?? true,
            rf1: this.parseVal('inp_rf1', 0.3799508411451843),

            // Section 4.0
            z1: Math.max(1, Math.round(this.parseVal('inp_z1', 1))),
            alfa_temp: this.parseVal('inp_alfa_temp', 20.0),
            calc_q: calc_q,
            q: this.parseVal('inp_q', 8.5),
            d1_Input: this.parseVal('inp_d1_Input', 36.23149719358681),
            gama: this.parseVal('inp_gama', 6.709836807756933),
            teethOrientation: parseInt(document.getElementById('sel_teethOrientation')?.value || '1', 10),
            m_Input: this.parseVal('inp_m_Input', 25.4 / 6.0),
            l1_proc: this.parseVal('inp_l1_proc', 50.0),
            l2_proc: this.parseVal('inp_l2_proc', 50.0),
            l1l2_flag: document.getElementById('chk_l1l2_flag')?.checked ?? true,
            l1_input: this.parseVal('inp_l1_input', 89.4839149653023),
            l2_input: this.parseVal('inp_l2_input', 89.4839149653023),
            FlagL: document.getElementById('chk_FlagL')?.checked ?? true,
            L_Input: this.parseVal('inp_L_Input', 56.72666666666667),
            Flagb2H: document.getElementById('chk_Flagb2H')?.checked ?? true,
            b2H_Input: this.parseVal('inp_b2H_Input', 33.57),
            x2: this.parseVal('inp_x2', 0.0),
            a_req1_Input: this.parseVal('inp_a_req1_Input', 100.0),
            FitAxis: parseInt(document.getElementById('sel_FitAxis')?.value || '2', 10),

            // Section 5.0
            de2Flag: document.getElementById('chk_de2Flag')?.checked ?? true,
            de2Input: this.parseVal('inp_de2Input', 183.23),

            // Section 6.0
            bearingType: parseInt(document.getElementById('sel_bearingType')?.value || '1', 10),

            // Section 16.0
            z1_req: Math.max(1, Math.round(this.parseVal('inp_z1_req', 1))),
            z2_req: Math.max(5, Math.round(this.parseVal('inp_z2_req', 50))),
            a_req: this.parseVal('inp_a_req', 180.0),

            // Section 18.0
            XX_z1: this.parseVal('inp_XX_z1', 2.0),
            XX_z2: this.parseVal('inp_XX_z2', 41.0),
            XX_n1: this.parseVal('inp_XX_n1', 1600.0),
            XX_n2_ratio: this.parseVal('inp_XX_n2_ratio', 80.0),
            XX_Mk2: this.parseVal('inp_XX_Mk2', 300.0),
            XX_n2: this.parseVal('inp_XX_n2', 3.75),

            // Section 19.0
            dstFlag: document.getElementById('chk_dstFlag')?.checked ?? true,
            Shaft_ds: this.parseVal('inp_Shaft_ds', 21.4),
            Shaft_th: this.parseVal('inp_Shaft_th', 1.1),
            DXF_Beta: this.parseVal('inp_DXF_Beta', 10.0)
        };
    }

    recalculate() {
        const params = this.collectParams();
        const res = WormCalcEngine.calculate(params);
        this.latestResult = res;
        window.latestWormResult = res;

        this.renderDOM(res);
        this.canvasRenderer.updateGeometry(res);

        // Update 3D Badge & 3D WebGL Geometry
        const typeNames = { 1: 'ZA', 2: 'ZN', 3: 'ZI', 4: 'ZK' };
        const typeCode = typeNames[res.toothType] || 'ZN';
        const orientStr = res.teethOrientation === 2 ? 'Ren Trái' : 'Ren Phải';
        this.setVal('badge3DType', `🌀 Trục Vít - Bánh Vít Lõm (${typeCode} - ${orientStr})`);
        this.setVal('badge3DRatio', `${res.i.toFixed(2)} (z1=${res.z1}, z2=${res.z2})`);
        this.setVal('badge3DA', `${res.a.toFixed(3)} mm`);
        this.setVal('badge3DGama', `${res.gama.toFixed(3)}°`);

        if (this.visualizer3D && this.activeMode === '3D') {
            const curW = this.visualizer3D.wormAngle;
            const curG = this.visualizer3D.wheelAngle;
            this.visualizer3D.setGeometry(res);
            this.visualizer3D.wormAngle = curW;
            this.visualizer3D.wheelAngle = curG;
            this.visualizer3D.updateGearRotations();
        }
    }

    renderDOM(r) {
        // Executive Summary Banner
        this.setVal('summaryA', `${r.a.toFixed(2)} mm`);
        this.setVal('summaryRatio', `${r.i.toFixed(2)} (${r.z1}:${r.z2})`);
        this.setVal('summaryGama', `${r.gama.toFixed(2)}°`);
        this.setVal('summaryEta', `${r.etages_pct.toFixed(1)} %`);
        this.setVal('summarySelfLock', r.isSelfLocking
            ? `Tự hãm tĩnh (γ ≤ ${r.gama_SelfLock.toFixed(2)}°)`
            : `Không tự hãm (γ > ${r.gama_SelfLock.toFixed(2)}°)`);

        const dot = document.getElementById('summaryStatusDot');
        const txt = document.getElementById('summaryStatusText');
        const isGeomOk = (r.Flag_z2min === 0);
        if (dot && txt) {
            dot.className = 'status-indicator ' + (isGeomOk ? 'status-safe' : 'status-warning');
            txt.textContent = isGeomOk
                ? 'ĐẠT TIÊU CHUẨN DIN 3975 / DIN 3996'
                : 'CẢNH BÁO: CẮT CHÂN RĂNG (x2 < xmin)';
        }

        // Section 1.0
        this.setVal('out_Pw1', r.Pw1, 4);
        this.setVal('out_n2', r.n2, 2);
        this.setVal('out_Mk1', r.Mk1, 3);
        this.setVal('out_Mk2', r.Mk2, 3);
        this.setVal('out_i', r.i, 2);
        this.setVal('out_i_dev', `${r.i_dev_pct >= 0 ? '+' : ''}${r.i_dev_pct.toFixed(2)} %`);

        // Section 2.0
        this.setVal('out_matP_des', r.wormMat.designation || r.wormMat.name);
        this.setVal('out_matW_des', r.wheelMat.designation || r.wheelMat.name);
        this.setVal('out_lubIndex', `Nhóm ${r.lubricationIndex}`);
        this.setVal('out_YW', r.YW, 2);
        this.setVal('out_YR', r.YR, 4);
        this.setVal('out_KA_Prop', r.KA_Prop, 2);
        if (r.kaFlag) this.setVal('inp_KA', r.KA, 2);
        this.setVal('out_mat1_prop', `${r.Rm1} / ${r.Rp02_1} (E=${r.E1})`);
        this.setVal('out_mat2_prop', `${r.Rm2} / ${r.Rp02_2} (E=${r.E2})`);

        // Section 3.0
        this.setVal('out_haXG', r.haXG, 2);
        this.setVal('out_caXG', r.caXG, 2);
        this.setVal('out_rf1_rec', r.rf1_rec, 4);
        if (r.rf1Flag) this.setVal('inp_rf1', r.rf1, 4);
        this.setVal('out_rf2', r.rf2, 4);

        // Section 4.0
        this.setVal('out_z2', r.z2, 0);
        this.setVal('lbl_alfa_type', r.toothType === 1
            ? 'Góc ăn khớp dọc trục α₀ (4.10) — Hệ ZA'
            : 'Góc ăn khớp pháp tuyến αn (4.10) — Hệ ZN/ZI/ZK');
        this.setVal('out_q_rec', r.q_rec, 1);

        if (r.calc_q !== 1) this.setVal('inp_q', r.q, 4);
        if (r.calc_q !== 2) this.setVal('inp_d1_Input', r.d1, 4);
        if (r.calc_q !== 3) this.setVal('inp_gama', r.gama, 4);

        this.setVal('out_d1_rec', `~ ${r.d1_rec.toFixed(2)}`);
        this.setVal('out_gama_SL', `< ${r.gama_SelfLock.toFixed(2)}°`);

        this.setVal('sym_module_mode', r.toothType === 1 ? 'mx' : 'mn');
        this.setVal('out_module_conj', r.toothType === 1 ? r.mn : r.mx, 4);
        this.setVal('out_CP', r.CP, 4);
        this.setVal('out_DP', r.DP, 4);

        if (r.l1l2_flag) {
            this.setVal('inp_l1_input', r.l1, 2);
            this.setVal('inp_l2_input', r.l2, 2);
        }
        this.setVal('out_L_Proposal', `> ${r.L_Proposal.toFixed(2)}`);
        if (r.FlagL) this.setVal('inp_L_Input', r.L, 2);

        this.setVal('out_b2H_Proposal', r.b2H_Proposal, 2);
        if (r.Flagb2H) this.setVal('inp_b2H_Input', r.b2H, 2);

        this.setVal('out_xmin_limit', `> ${r.xmin.toFixed(3)}`);
        const sliderX2 = document.getElementById('slider_x2');
        if (sliderX2 && document.activeElement !== sliderX2) {
            sliderX2.value = Math.max(-1, Math.min(1, r.x2));
        }

        this.setVal('out_sec4_d1', r.d1, 3);
        this.setVal('out_sec4_d2', r.d2, 3);
        this.setVal('out_sec4_a', r.a, 3);
        this.setVal('out_mass', r.mass, 2);
        this.setVal('out_mass_gears', r.mass_gears, 2);
        this.setVal('out_sec4_etages', r.etages_pct, 2);
        this.setVal('out_sec4_etamax', `< ${r.etamax_pct.toFixed(2)}`);

        // Section 5.0 (DIN 3975)
        this.setVal('out_mn', r.mn, 4);
        this.setVal('out_mt', r.mt, 4);
        this.setVal('out_mx', r.mx, 4);
        this.setVal('out_pn', r.pn, 4);
        this.setVal('out_pt', r.pt, 4);
        this.setVal('out_px', r.px, 4);
        this.setVal('out_alfan', r.alfan, 4);
        this.setVal('out_alfat', r.alfat, 4);
        this.setVal('out_alfax', r.alfax, 4);
        this.setVal('out_sec5_z1', r.z1, 0);
        this.setVal('out_sec5_z2', r.z2, 0);
        this.setVal('out_da1', r.da1, 3);
        this.setVal('out_da2', r.da2, 3);
        this.setVal('out_d1', r.d1, 3);
        this.setVal('out_d2', r.d2, 3);
        this.setVal('out_df1', r.df1, 3);
        this.setVal('out_df2', r.df2, 3);
        this.setVal('out_dw1', r.dw1, 3);
        this.setVal('out_dw2', r.dw2, 3);
        this.setVal('out_dm1', r.dm1, 3);
        this.setVal('out_dm2', r.dm2, 3);
        if (r.de2Flag) this.setVal('inp_de2Input', r.de2, 2);
        this.setVal('out_de2_range', r.de2_range_str);
        this.setVal('out_ha1', r.ha1, 3);
        this.setVal('out_ha2', r.ha2, 3);
        this.setVal('out_hf1', r.hf1, 3);
        this.setVal('out_hf2', r.hf2, 3);
        this.setVal('out_a', r.a, 3);
        this.setVal('out_L', r.L, 2);
        this.setVal('out_b2H', r.b2H, 2);
        this.setVal('out_sec5_gama', r.gama, 4);
        this.setVal('out_gamaw', r.gamaw, 4);
        this.setVal('out_gamab', r.gamab, 4);
        this.setVal('out_sn1', r.sn1, 3);
        this.setVal('out_sn2', r.sn2, 3);
        this.setVal('out_sx1', r.sx1, 3);
        this.setVal('out_sx2', r.sx2, 3);
        this.setVal('out_en1', r.en1, 3);
        this.setVal('out_en2', r.en2, 3);
        this.setVal('out_ex1', r.ex1, 3);
        this.setVal('out_ex2', r.ex2, 3);

        // Section 6.0 (DIN 3996 Efficiency & Losses)
        this.setVal('out_vgm', r.vgm, 4);
        this.setVal('out_v1', r.v1, 4);
        this.setVal('out_v2', r.v2, 4);
        this.setVal('out_YS', r.YS, 4);
        this.setVal('out_YG', r.YG, 4);
        this.setVal('out_h_x', r.h_x, 5);
        this.setVal('out_sec6_YW', r.YW, 2);
        this.setVal('out_sec6_YR', r.YR, 4);
        this.setVal('out_eta0T', r.eta0T, 5);
        this.setVal('out_etazm', r.etazm, 5);
        this.setVal('out_roz', r.roz, 4);
        this.setVal('out_etaStatic', r.etaStatic, 5);
        this.setVal('out_etaz', r.etaz * 100.0, 2);
        this.setVal('out_PV0', r.PV0, 4);
        this.setVal('out_PV0_W', r.PV0_W, 2);
        this.setVal('out_PVLP', r.PVLP, 4);
        this.setVal('out_PVD', r.PVD, 4);
        this.setVal('out_PVD_W', r.PVD_W, 2);
        this.setVal('out_PVz', r.PVz, 4);
        this.setVal('out_PVz_W', r.PVz_W, 2);
        this.setVal('out_PV', r.PV, 4);
        this.setVal('out_PV_W', r.PV_W, 2);
        this.setVal('out_etages', r.etages_pct, 2);
        this.setVal('out_etages_pct2', r.etages, 4);

        // Section 12.0 AGMA
        this.setVal('out_NW', r.NW, 0);
        this.setVal('out_NG', r.NG, 0);
        this.setVal('out_mG', r.mG, 3);
        this.setVal('out_C_agma', r.C_agma, 4);
        this.setVal('out_pitchx', r.pitchx, 4);
        this.setVal('out_d_rec_agma', r.d_rec_agma_str);
        this.setVal('out_d_LC', r.d_LC, 4);
        this.setVal('out_D_UC', r.D_UC, 4);
        this.setVal('out_Lead_agma', r.Lead_agma, 4);
        this.setVal('out_leadAngle_agma', r.leadAngle_agma, 4);
        this.setVal('out_addendum_agma', r.addendum_agma, 4);
        this.setVal('out_dedendum_agma', r.dedendum_agma, 4);
        this.setVal('out_do1_agma', r.do1_agma, 4);
        this.setVal('out_Do2_agma', r.Do2_agma, 4);
        this.setVal('out_dr_agma', r.dr_agma, 4);
        this.setVal('out_Dt_agma', r.Dt_agma, 4);
        this.setVal('out_clearance_agma', r.clearance_agma, 4);
        this.setVal('out_FWmax_agma', r.FWmax_agma, 4);
        this.setVal('out_FG_agma', r.FG_agma, 4);
        this.setVal('out_agma_mm', `${r.FWmax_agma_mm.toFixed(2)} / ${r.FG_agma_mm.toFixed(2)} mm`);

        // Section 16.0 AxisDistTbl
        const selAxisDist = document.getElementById('sel_AxisDist');
        if (selAxisDist && Array.isArray(r.axisDistSolutions)) {
            const prevIdx = selAxisDist.value;
            selAxisDist.innerHTML = '';
            r.axisDistSolutions.forEach((row, idx) => {
                const opt = document.createElement('option');
                opt.value = idx;
                opt.textContent = row.label;
                selAxisDist.appendChild(opt);
            });
            if (prevIdx && selAxisDist.querySelector(`option[value="${prevIdx}"]`)) {
                selAxisDist.value = prevIdx;
            }
            this.setVal('out_AxisDistCount', `${r.axisDistSolutions.length} phương án hợp lệ`);
        }

        // Section 18.0
        this.setVal('out_XXX_i', r.XXX_i, 3);
        this.setVal('out_XX_i', r.XX_i, 3);
        this.setVal('out_XX_Pw2', r.XX_Pw2, 4);

        // Section 19.0
        this.setVal('out_DXF_AutoScale', r.DXF_AutoScale, 3);
        if (r.dstFlag) {
            this.setVal('inp_Shaft_ds', r.Shaft_ds, 1);
            this.setVal('inp_Shaft_th', r.Shaft_th, 1);
        }
        this.setVal('out_ABOM', `${r.ABOM01} | ${r.ABOM02} | ${r.ABOM03}`);
        this.setVal('out_BBOM', `${r.BBOM01} | ${r.BBOM02} | ${r.BBOM03}`);

        this.setVal('dxf_worm_m_sym', r.toothType === 1 ? 'mx' : 'mn');
        this.setVal('out_dxf_worm_m', r.dxf_worm_m, 3);
        this.setVal('out_dxf_worm_z1', r.dxf_worm_z1, 0);
        this.setVal('out_dxf_worm_alfa', `${r.dxf_worm_alfa}°`);
        this.setVal('out_dxf_worm_d1', r.dxf_worm_d1, 3);
        this.setVal('out_dxf_worm_da1', r.dxf_worm_da1, 3);
        this.setVal('out_dxf_worm_L', r.dxf_worm_L, 3);
        this.setVal('out_dxf_worm_mat', r.dxf_worm_mat);
        this.setVal('out_dxf_worm_a', r.dxf_worm_a, 3);
        this.setVal('out_dxf_worm_z2', r.dxf_worm_z2, 0);

        this.setVal('dxf_wheel_m_sym', r.toothType === 1 ? 'mx' : 'mn');
        this.setVal('out_dxf_wheel_m', r.dxf_wheel_m, 3);
        this.setVal('out_dxf_wheel_z2', r.dxf_wheel_z2, 0);
        this.setVal('out_dxf_wheel_alfa', `${r.dxf_wheel_alfa}°`);
        this.setVal('out_dxf_wheel_d2', r.dxf_wheel_d2, 3);
        this.setVal('out_dxf_wheel_da2', r.dxf_wheel_da2, 3);
        this.setVal('out_dxf_wheel_b2H', r.dxf_wheel_b2H, 3);
        this.setVal('out_dxf_wheel_x2', r.dxf_wheel_x2, 3);
        this.setVal('out_dxf_wheel_mat', r.dxf_wheel_mat);
        this.setVal('out_dxf_wheel_a', r.dxf_wheel_a, 3);
        this.setVal('out_dxf_wheel_z1', r.dxf_wheel_z1, 0);
    }

    /**
     * Exact port of VBA FitAxisDistance (Rows 174-177 in Gear4_01.xlsb)
     */
    solveFitAxisDistance() {
        if (!this.latestResult) return;
        const r = this.latestResult;
        const fitMode = parseInt(document.getElementById('sel_FitAxis')?.value || '2', 10);

        if (fitMode === 1) {
            // 1. Change Module (m_Input = m_for_a)
            const elM = document.getElementById('inp_m_Input');
            if (elM && Number.isFinite(r.m_for_a) && r.m_for_a > 0) {
                elM.value = r.m_for_a.toFixed(6);
            }
        } else if (fitMode === 2) {
            // 2. Change Profile Shift x2 (x2 = x_for_a)
            const elX2 = document.getElementById('inp_x2');
            if (elX2 && Number.isFinite(r.x_for_a)) {
                elX2.value = r.x_for_a.toFixed(6);
            }
        } else if (fitMode === 3 && r.calc_q === 1) {
            // 3. Change Diametral Quotient q (q = q_for_a)
            const elQ = document.getElementById('inp_q');
            if (elQ && Number.isFinite(r.q_for_a) && r.q_for_a > 0) {
                elQ.value = r.q_for_a.toFixed(6);
            }
        }
        this.recalculate();
    }

    /**
     * Exact port of applying a row from Section 16.0 AxisDistTbl to Section 4.0
     */
    applySelectedAxisDistVariant() {
        if (!this.latestResult || !Array.isArray(this.latestResult.axisDistSolutions)) return;
        const sel = document.getElementById('sel_AxisDist');
        const idx = sel ? parseInt(sel.value, 10) : 0;
        const row = this.latestResult.axisDistSolutions[idx];
        if (!row) return;

        const elZ1 = document.getElementById('inp_z1');
        const elIin = document.getElementById('inp_iin');
        const elM = document.getElementById('inp_m_Input');
        const elQ = document.getElementById('inp_q');
        const elX2 = document.getElementById('inp_x2');
        const radio1 = document.querySelector('input[name="rad_calc_q"][value="1"]');

        if (radio1) radio1.checked = true;
        this.syncRadioCalcQVisuals();

        if (elZ1) elZ1.value = row.z1;
        if (elIin) elIin.value = row.i.toFixed(2);
        if (elM) elM.value = row.m;
        if (elQ) elQ.value = row.q;
        if (elX2) elX2.value = row.x2.toFixed(6);

        this.recalculate();
    }

    resetDefaults() {
        const setValDirect = (id, v) => {
            const el = document.getElementById(id);
            if (el) el.value = v;
        };
        const setChkDirect = (id, c) => {
            const el = document.getElementById(id);
            if (el) el.checked = c;
        };

        // Exact SI defaults from C:\MITCalc\gear4\Gear4_01.xlsb
        setValDirect('sel_poweredWoWh', '1');
        setValDirect('inp_Pw2', '3.0');
        setValDirect('inp_n1', '1500.0');
        setValDirect('inp_iin', '40.0');

        setValDirect('sel_matP', '41');
        setValDirect('sel_matW', '7');
        setValDirect('sel_toothType', '2');
        setValDirect('sel_loadTypeA', '1');
        setValDirect('sel_loadTypeB', '1');
        setValDirect('sel_designCooling', '1');
        setValDirect('sel_oilType', '3');
        setValDirect('sel_lubricant', '6');
        setValDirect('inp_ny40', '220.0');
        setValDirect('inp_ny100', '40.0');
        setValDirect('inp_rooil15', '1.06');
        setValDirect('inp_Ra1', '0.5');
        setChkDirect('chk_kaFlag', true);

        setValDirect('inp_haXP', '1.0');
        setValDirect('inp_caXP', '0.25');
        setChkDirect('chk_rf1Flag', true);

        setValDirect('inp_z1', '1');
        setValDirect('inp_alfa_temp', '20.0');
        const radio1 = document.querySelector('input[name="rad_calc_q"][value="1"]');
        if (radio1) radio1.checked = true;
        setValDirect('inp_q', '8.5');
        setValDirect('sel_teethOrientation', '1');
        setValDirect('inp_m_Input', String(25.4 / 6.0));
        setValDirect('inp_l1_proc', '50.0');
        setValDirect('inp_l2_proc', '50.0');
        setChkDirect('chk_l1l2_flag', true);
        setChkDirect('chk_FlagL', true);
        setChkDirect('chk_Flagb2H', true);
        setValDirect('inp_x2', '0.0');
        setValDirect('inp_a_req1_Input', '100.0');
        setValDirect('sel_FitAxis', '2');

        setChkDirect('chk_de2Flag', true);
        setValDirect('sel_bearingType', '1');

        setValDirect('inp_z1_req', '1');
        setValDirect('inp_z2_req', '50');
        setValDirect('inp_a_req', '180.0');

        setValDirect('inp_XX_z1', '2');
        setValDirect('inp_XX_z2', '41');
        setValDirect('inp_XX_n1', '1600.0');
        setValDirect('inp_XX_n2_ratio', '80.0');
        setValDirect('inp_XX_Mk2', '300.0');
        setValDirect('inp_XX_n2', '3.75');

        setChkDirect('chk_dstFlag', true);
        setValDirect('inp_DXF_Beta', '10.0');

        this.syncRadioCalcQVisuals();
        this.syncAutoFlagsVisuals();
        this.recalculate();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.WormUI = new WormUIController();
    window.wormUI = window.WormUI;
});

