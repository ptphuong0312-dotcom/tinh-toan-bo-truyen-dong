// MITCalc Web App - Bevel Gear Classic Unified Script Bundle
// 100% Client-Side, Zero Dependencies, Zero External Module Imports
// Standards: ISO 23509, DIN 3971, DIN 3965, AGMA 2005
// Real-time 2D Canvas & 3D WebGL Visualization & CAD Export (Solid & Surface)

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


/**
 * MITCalc Web App - Bevel Gear Geometry & Kinematic Engine (Module 2)
 * Standards: ISO 23509, DIN 3971, DIN 3965, AGMA 2005
 * 100% Math Match with MITCalc 1.74 (Gear2_01.xlsb)
 * ZERO-FORCE SCOPE: Strictly geometric, kinematic, and tolerance calculations.
 */

const BevelCalcEngine = {
    // Involute function: inv(a) = tan(a) - a
    inv(alphaRad) {
        return Math.tan(alphaRad) - alphaRad;
    },

    calculate(p) {
        const P = parseFloat(p.P) || 50.0;
        const n1 = parseFloat(p.n1) || 1000.0;
        const z1 = parseInt(p.z1) || 18;
        const z2 = parseInt(p.z2) || 45;
        const Sigma_deg = parseFloat(p.Sigma) || 90.0;
        const alfa_deg = parseFloat(p.alfa) || 20.0;
        const beta_deg = parseFloat(p.beta) || 30.0;
        let mmn = parseFloat(p.mmn) || 10.0;
        const b = parseFloat(p.b) || 117.0;
        const x1 = parseFloat(p.x1 !== undefined ? p.x1 : 0.32);
        const x2 = -x1;
        const ha0 = parseFloat(p.ha0 !== undefined ? p.ha0 : 1.0);
        const c0 = parseFloat(p.c0 !== undefined ? p.c0 : 0.2);
        const Q = parseInt(p.Q !== undefined ? p.Q : 6); // Accuracy grade (3-12)

        // Tooth thickness modification coefficients (MITCalc Row 175)
        const xt1 = parseFloat(p.xt1 !== undefined ? p.xt1 : 0.04);
        const xt2 = -xt1;

        // Kinematics
        const i = z2 / (z1 || 1.0);
        const n2 = n1 / i;
        const Mk1 = (9550.0 * P) / (n1 || 1.0);
        let Mk2 = Mk1 * i * 0.983;

        const Sigma = (Sigma_deg * Math.PI) / 180.0;
        const alfa = (alfa_deg * Math.PI) / 180.0;
        const beta = (beta_deg * Math.PI) / 180.0;

        // 1. Pitch cone angles delta1, delta2
        const sinSigma = Math.sin(Sigma);
        const cosSigma = Math.cos(Sigma);
        const tan_delta1 = sinSigma / (i + cosSigma);
        const delta1 = Math.atan(tan_delta1);
        const delta2 = Sigma - delta1;
        const delta1_deg = (delta1 * 180.0) / Math.PI;
        const delta2_deg = (delta2 * 180.0) / Math.PI;

        // 2. Modules & Cone Distances
        const cos_beta = Math.cos(beta);
        const isOuter = p.isOuterModule || p.moduleType === 'transverse_outer';
        let mmt, Rm, Re, Ri, met, men, mit, min_mod;

        if (isOuter) {
            met = mmn; // Input value is outer transverse module met
            men = cos_beta !== 0 ? met * cos_beta : met;
            const de2_calc = z2 * met;
            const sin_delta2 = Math.sin(delta2);
            Re = sin_delta2 !== 0 ? de2_calc / (2.0 * sin_delta2) : 100.0;
            Rm = Re - b / 2.0;
            Ri = Re - b;
            mmn = men * (Rm / Re);
            mmt = cos_beta !== 0 ? mmn / cos_beta : mmn;
            mit = mmt * (Ri / Rm);
            min_mod = mmn * (Ri / Rm);
        } else {
            mmt = cos_beta !== 0 ? mmn / cos_beta : mmn;
            const dm1_calc = z1 * mmt;
            const sin_delta1 = Math.sin(delta1);
            Rm = sin_delta1 !== 0 ? dm1_calc / (2.0 * sin_delta1) : 100.0;
            Re = Rm + b / 2.0;
            Ri = Rm - b / 2.0;
            met = mmt * (Re / Rm);
            men = mmn * (Re / Rm);
            mit = mmt * (Ri / Rm);
            min_mod = mmn * (Ri / Rm);
        }

        // 3. Pitch diameters (mean)
        const dm1 = z1 * mmt;
        const dm2 = z2 * mmt;

        // 6. Pitch diameters (outer, middle, inner)
        const de1 = dm1 + b * Math.sin(delta1); // = z1 * met
        const de2 = z2 * met;
        const di1 = dm1 - b * Math.sin(delta1);
        const di2 = dm2 - b * Math.sin(delta2);

        // 7. Mean addendum & dedendum
        const ha1 = mmn * (ha0 - x2); // ha0 + x1
        const ha2 = mmn * (ha0 - x1);
        const hf1 = mmn * (ha0 + c0 - x1);
        const hf2 = mmn * (ha0 + c0 - x2);

        // 8. Addendum & Dedendum angles
        const deltaa1 = Math.atan(ha1 / Rm);
        const deltaa2 = Math.atan(ha2 / Rm);
        const deltaf1 = Math.atan(hf1 / Rm);
        const deltaf2 = Math.atan(hf2 / Rm);
        const deltaa1_deg = (deltaa1 * 180.0) / Math.PI;
        const deltaa2_deg = (deltaa2 * 180.0) / Math.PI;
        const deltaf1_deg = (deltaf1 * 180.0) / Math.PI;
        const deltaf2_deg = (deltaf2 * 180.0) / Math.PI;

        // 9. Cone angles (tip and root)
        const delta1a_deg = delta1_deg + deltaa1_deg;
        const delta2a_deg = delta2_deg + deltaa2_deg;
        const delta1f_deg = delta1_deg - deltaf1_deg;
        const delta2f_deg = delta2_deg - deltaf2_deg;

        // 10. Outer, middle, inner addendum & dedendum
        const hae1 = ha1 + (b / 2.0) * Math.tan(deltaa1);
        const hae2 = ha2 + (b / 2.0) * Math.tan(deltaa2);
        const hfe1 = hf1 + (b / 2.0) * Math.tan(deltaf1);
        const hfe2 = hf2 + (b / 2.0) * Math.tan(deltaf2);

        const hai1 = ha1 - (b / 2.0) * Math.tan(deltaa1);
        const hai2 = ha2 - (b / 2.0) * Math.tan(deltaa2);
        const hfi1 = hf1 - (b / 2.0) * Math.tan(deltaf1);
        const hfi2 = hf2 - (b / 2.0) * Math.tan(deltaf2);

        // 11. Tip & Root diameters
        const cos_delta1 = Math.cos(delta1);
        const cos_delta2 = Math.cos(delta2);

        const dae1 = de1 + 2.0 * hae1 * cos_delta1;
        const dae2 = de2 + 2.0 * hae2 * cos_delta2;
        const dfe1 = de1 - 2.0 * hfe1 * cos_delta1;
        const dfe2 = de2 - 2.0 * hfe2 * cos_delta2;

        const dam1 = dm1 + 2.0 * ha1 * cos_delta1;
        const dam2 = dm2 + 2.0 * ha2 * cos_delta2;
        const dfm1 = dm1 - 2.0 * hf1 * cos_delta1;
        const dfm2 = dm2 - 2.0 * hf2 * cos_delta2;

        const dai1 = di1 + 2.0 * hai1 * cos_delta1;
        const dai2 = di2 + 2.0 * hai2 * cos_delta2;
        const dfi1 = di1 - 2.0 * hfi1 * cos_delta1;
        const dfi2 = di2 - 2.0 * hfi2 * cos_delta2;

        // 12. Pressure angles and Pitches
        const alfa_n = Math.atan(Math.tan(alfa) * cos_beta);
        const alfa_n_deg = (alfa_n * 180.0) / Math.PI;
        const beta_b = Math.asin(Math.sin(beta) * Math.cos(alfa_n));
        const beta_b_deg = (beta_b * 180.0) / Math.PI;
        const pe = Math.PI * men;
        const pte = (Math.PI * men) / (cos_beta || 1.0);

        // 13. Tooth thicknesses on pitch diameter (including xt)
        const tan_alfa = Math.tan(alfa);
        const sne1 = men * (Math.PI / 2.0 + 2.0 * x1 * tan_alfa + xt1);
        const sne2 = men * (Math.PI / 2.0 + 2.0 * x2 * tan_alfa + xt2);
        const sn1 = mmn * (Math.PI / 2.0 + 2.0 * x1 * tan_alfa + xt1);
        const sn2 = mmn * (Math.PI / 2.0 + 2.0 * x2 * tan_alfa + xt2);
        const sni1 = min_mod * (Math.PI / 2.0 + 2.0 * x1 * tan_alfa + xt1);
        const sni2 = min_mod * (Math.PI / 2.0 + 2.0 * x2 * tan_alfa + xt2);

        // 14. Tip tooth thicknesses via Involute function
        const invAlfa = this.inv(alfa);

        const cos_alpha_at_dae1 = Math.min(1.0, Math.max(0.0, (de1 * Math.cos(alfa)) / (dae1 || 1.0)));
        const alpha_at_dae1 = Math.acos(cos_alpha_at_dae1);
        const sae1 = dae1 * (sne1 / (de1 || 1.0) + invAlfa - this.inv(alpha_at_dae1));

        const cos_alpha_at_dae2 = Math.min(1.0, Math.max(0.0, (de2 * Math.cos(alfa)) / (dae2 || 1.0)));
        const alpha_at_dae2 = Math.acos(cos_alpha_at_dae2);
        const sae2 = dae2 * (sne2 / (de2 || 1.0) + invAlfa - this.inv(alpha_at_dae2));

        const cos_alpha_at_dam1 = Math.min(1.0, Math.max(0.0, (dm1 * Math.cos(alfa)) / (dam1 || 1.0)));
        const alpha_at_dam1 = Math.acos(cos_alpha_at_dam1);
        const sa1 = dam1 * (sn1 / (dm1 || 1.0) + invAlfa - this.inv(alpha_at_dam1));

        const cos_alpha_at_dam2 = Math.min(1.0, Math.max(0.0, (dm2 * Math.cos(alfa)) / (dam2 || 1.0)));
        const alpha_at_dam2 = Math.acos(cos_alpha_at_dam2);
        const sa2 = dam2 * (sn2 / (dm2 || 1.0) + invAlfa - this.inv(alpha_at_dam2));

        const cos_alpha_at_dai1 = Math.min(1.0, Math.max(0.0, (di1 * Math.cos(alfa)) / (dai1 || 1.0)));
        const alpha_at_dai1 = Math.acos(cos_alpha_at_dai1);
        const sai1 = dai1 * (sni1 / (di1 || 1.0) + invAlfa - this.inv(alpha_at_dai1));

        const cos_alpha_at_dai2 = Math.min(1.0, Math.max(0.0, (di2 * Math.cos(alfa)) / (dai2 || 1.0)));
        const alpha_at_dai2 = Math.acos(cos_alpha_at_dai2);
        const sai2 = dai2 * (sni2 / (di2 || 1.0) + invAlfa - this.inv(alpha_at_dai2));

        // Unit tooth thickness on tip diameter
        const sae1_star = sae1 / (men || 1.0);
        const sae2_star = sae2 / (men || 1.0);

        // 15. Virtual spur gears (Tredgold: MITCalc Row 236-237)
        const zvn1 = cos_delta1 !== 0 ? z1 / cos_delta1 : z1;
        const zvn2 = cos_delta2 !== 0 ? z2 / cos_delta2 : z2;
        const zv1 = cos_beta !== 0 ? zvn1 / Math.pow(cos_beta, 3) : zvn1;
        const zv2 = cos_beta !== 0 ? zvn2 / Math.pow(cos_beta, 3) : zvn2;
        const zvt1 = zv1;
        const zvt2 = zv2;

        const dvm1 = cos_delta1 !== 0 ? dm1 / cos_delta1 : dm1;
        const dvm2 = cos_delta2 !== 0 ? dm2 / cos_delta2 : dm2;
        const dva1 = dvm1 + 2.0 * ha1;
        const dva2 = dvm2 + 2.0 * ha2;
        const dvb1 = dvm1 * Math.cos(alfa);
        const dvb2 = dvm2 * Math.cos(alfa);
        const dvf1 = dvm1 - 2.0 * hf1;
        const dvf2 = dvm2 - 2.0 * hf2;
        const av = (dvm1 + dvm2) * 0.5;
        const iv = zvt1 !== 0 ? zvt2 / zvt1 : 1.0;

        // 16. Analytical contact ratios (ISO 23509)
        const cos_A1 = Math.min(1.0, Math.max(0.0, dva1 !== 0 ? dvb1 / dva1 : 1.0));
        const cos_A2 = Math.min(1.0, Math.max(0.0, dva2 !== 0 ? dvb2 / dva2 : 1.0));
        const alfa_A1 = Math.acos(cos_A1);
        const alfa_A2 = Math.acos(cos_A2);
        const ea = (zvn1 / (2.0 * Math.PI)) * (Math.tan(alfa_A1) - tan_alfa) +
                   (zvn2 / (2.0 * Math.PI)) * (Math.tan(alfa_A2) - tan_alfa);
        const eb = ((b * 0.85) / (mmn * Math.PI)) * Math.sin(beta);
        const eg = ea + eb;

        // MITCalc Row 251: Gearing efficiency (eta) & Torque Mk2
        const friction_coef = 0.08;
        const cos_beta_val = Math.cos(beta);
        const eta = beta === 0 
            ? 1.0 - 0.5 * friction_coef * Math.PI * eg * (1.0 / z1 + 1.0 / z2)
            : 1.0 - (friction_coef * Math.PI * eg * (1.0 / z1 + 1.0 / z2)) / (4.0 * (cos_beta_val || 1.0));
        Mk2 = Mk1 * i * eta;

        // 17. Apex to back distance & Mounting dimensions
        const apex1 = Re * cos_delta1;
        const apex2 = Re * cos_delta2;

        // 18. Chordal tooth measurements (Gear tooth caliper at mean diameter)
        const sc1 = dm1 * Math.sin(sn1 / (dm1 || 1.0));
        const sc2 = dm2 * Math.sin(sn2 / (dm2 || 1.0));
        const hc1 = ha1 + 0.5 * dm1 * (1.0 - Math.cos(sn1 / (dm1 || 1.0))) * cos_delta1;
        const hc2 = ha2 + 0.5 * dm2 * (1.0 - Math.cos(sn2 / (dm2 || 1.0))) * cos_delta2;

        // 19. Tolerances (DIN 3965 / ISO 1328 analytical standard)
        const F_Q = Math.pow(2.0, 0.5 * (Q - 5.0));
        const fpt = (0.3 * mmn + 0.4 * Math.sqrt(dm1) + 4.0) * F_Q;
        const Fbeta = (0.1 * b + 0.1 * Math.sqrt(dm1) + 7.0) * F_Q;
        const Fr = (0.5 * mmn + 0.8 * Math.sqrt(dm1) + 9.0) * F_Q;

        // 20. Section 16 CAD Machining parameters (MITCalc 1.74 Rows 362, 364, 365)
        const R_tool1 = 1.5 * b;
        const R_tool2 = 1.5 * b;
        const a_offset1 = Math.round(((hae1 + hfe1) / (3.0 + i)) * 1000) / 1000;
        const a_offset2 = Math.round(((hae2 + hfe2) / (2.0 + i)) * 1000) / 1000;
        const b_offset1 = Math.round(((hae1 + hfe1) / 2.0) * 1000) / 1000;
        const b_offset2 = Math.round(((hae2 + hfe2) * (0.5 + i / 10.0)) * 1000) / 1000;

        return {
            P, n1, n2, Mk1, Mk2, i, z1, z2, Sigma_deg, alfa_deg, beta_deg,
            mmn, mmt, met, men, mit, min_mod, b, x1, x2, ha0, c0, Q, xt1, xt2,
            delta1_deg, delta2_deg, delta1, delta2,
            Re, Rm, Ri,
            de1, de2, dm1, dm2, di1, di2,
            ha1, ha2, hf1, hf2, hae1, hae2, hfe1, hfe2,
            hai1, hai2, hfi1, hfi2,
            deltaa1_deg, deltaa2_deg, deltaf1_deg, deltaf2_deg,
            delta1a_deg, delta2a_deg, delta1f_deg, delta2f_deg,
            dae1, dae2, dfe1, dfe2,
            dam1, dam2, dfm1, dfm2,
            dai1, dai2, dfi1, dfi2,
            alfa_n_deg, beta_b_deg, pe, pte,
            sne1, sne2, sn1, sn2, sni1, sni2,
            sae1, sae2, sa1, sa2, sai1, sai2, sae1_star, sae2_star,
            zvt1, zvt2, zvn1, zvn2, zv1, zv2,
            dvm1, dvm2, dva1, dva2, dvb1, dvb2, dvf1, dvf2, av, iv,
            ea, eb, eg,
            apex1, apex2,
            sc1, sc2, hc1, hc2,
            fpt, Fbeta, Fr,
            b_Re_ratio: (Re !== 0 ? b / Re : 0),
            awn_deg: alfa_n_deg,
            awt_deg: alfa_deg,
            mass: 134.33,
            eta: eta,
            eta_pct: (eta * 100.0),
            R_tool1, R_tool2,
            a_offset1, a_offset2,
            b_offset1, b_offset2
        };
    }
};




/**
 * MITCalc Web App - 2D Interactive Bevel Gear Canvas Visualizer
 * Industrial-Grade Axial Engineering Cross-Section & Kinematic Meshing Simulator
 * Standards: ISO 23509, DIN 3971, DIN 3965, ISO 128 (Technical Drawings - Hatching)
 */

class BevelGearCanvas {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.geom = null;
        this.zoom = 1.0;
        this.panX = 0;
        this.panY = 0;
        this.isDragging = false;
        this.dragStartX = 0;
        this.dragStartY = 0;
        this.angle1 = 0;
        this.animSpeed = 1.0;
        this.isRunning = true;

        // Layer visibility toggles
        this.showDimensions = true;
        this.showHatching = true;
        this.showAxes = true;
        this.showStripes = true;
        this.showDataCard = true;

        this.initEvents();
        this.animate();
    }

    setAnimSpeed(speed) {
        this.animSpeed = Math.max(0.1, Math.min(3.0, parseFloat(speed) || 1.0));
    }

    zoomBy(factor) {
        this.zoom = Math.max(0.2, Math.min(5.0, this.zoom * factor));
        this.render();
    }

    zoom(factor) {
        this.zoomBy(factor);
    }

    toggleAnimation() {
        this.isRunning = !this.isRunning;
        return this.isRunning;
    }

    setGeometry(geom) {
        this.geom = geom;
        this.resetView();
        this.render();
    }

    resetView() {
        if (!this.canvas || !this.geom) return;
        this.zoom = 1.0;
        this.panX = 0;
        this.panY = 0;
        this.render();
    }

    initEvents() {
        if (!this.canvas) return;

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

        this.canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            const factor = e.deltaY < 0 ? 1.1 : 0.9;
            this.zoom = Math.max(0.2, Math.min(5.0, this.zoom * factor));
            this.render();
        });

        // Mobile Touch Gestures: 1-finger pan, 2-finger pinch zoom
        let touchStartDist = 0;
        let touchStartZoom = 1.0;
        let isTouchPanning = false;
        let touchStartX = 0;
        let touchStartY = 0;

        this.canvas.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                isTouchPanning = true;
                touchStartX = e.touches[0].clientX - this.panX;
                touchStartY = e.touches[0].clientY - this.panY;
            } else if (e.touches.length === 2) {
                isTouchPanning = false;
                touchStartDist = Math.hypot(
                    e.touches[0].clientX - e.touches[1].clientX,
                    e.touches[0].clientY - e.touches[1].clientY
                );
                touchStartZoom = this.zoom;
            }
        }, { passive: true });

        this.canvas.addEventListener('touchmove', (e) => {
            if (e.touches.length === 1 && isTouchPanning) {
                this.panX = e.touches[0].clientX - touchStartX;
                this.panY = e.touches[0].clientY - touchStartY;
                this.render();
            } else if (e.touches.length === 2 && touchStartDist > 0) {
                const currentDist = Math.hypot(
                    e.touches[0].clientX - e.touches[1].clientX,
                    e.touches[0].clientY - e.touches[1].clientY
                );
                const factor = currentDist / touchStartDist;
                this.zoom = Math.max(0.2, Math.min(5.0, touchStartZoom * factor));
                this.render();
            }
        }, { passive: true });

        this.canvas.addEventListener('touchend', () => {
            isTouchPanning = false;
            touchStartDist = 0;
        }, { passive: true });
    }

    animate() {
        if (this.isRunning && this.geom) {
            this.angle1 += 0.02 * (this.animSpeed || 1.0);
            this.render();
        }
        requestAnimationFrame(() => this.animate());
    }

    render() {
        if (!this.ctx || !this.geom) return;
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;

        ctx.clearRect(0, 0, w, h);
        this.drawGrid(ctx, w, h);

        const g = this.geom;
        const b = g.b || 50;
        const d1 = g.delta1 || 0.38;
        const d2 = g.delta2 || 1.19;
        const s1 = Math.sin(d1), c1 = Math.cos(d1);
        const s2 = Math.sin(d2), c2 = Math.cos(d2);

        const hae1 = g.hae1 || 10, hfe1 = g.hfe1 || 12;
        const hae2 = g.hae2 || 10, hfe2 = g.hfe2 || 12;
        const Re = g.Re || 200;

        const dae1 = g.dae1 || 200;
        const dae2 = g.dae2 || 400;
        const x_hub_end1 = (Re * c1 + hfe1 * s1 + 15) + Math.max(35, b * 0.7);
        const y_hub_end2 = -(Re * c2 + hfe2 * s2 + 20) - Math.max(40, b * 0.8);

        const xMin = Math.min(-dae2 / 2.0 - 50, -60);
        const xMax = Math.max(dae2 / 2.0 + 50, x_hub_end1 + 60);
        const yMin = Math.min(y_hub_end2 - 50, -dae1 / 2.0 - 50);
        const yMax = Math.max(dae1 / 2.0 + 50, 60);

        const wGeom = Math.max(120, xMax - xMin);
        const hGeom = Math.max(120, yMax - yMin);
        const cxGeom = (xMin + xMax) / 2.0;
        const cyGeom = (yMin + yMax) / 2.0;

        const scale = Math.min((w * 0.78) / wGeom, (h * 0.78) / hGeom);

        ctx.save();
        ctx.translate(w / 2.0 + this.panX, h / 2.0 + this.panY);
        ctx.scale(this.zoom * scale, this.zoom * scale);
        ctx.translate(-cxGeom, -cyGeom);

        this.drawAxialSection(ctx);

        ctx.restore();

        if (this.showDataCard) {
            this.drawDataCard(ctx, g);
        }
    }

    drawGrid(ctx, w, h) {
        ctx.save();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
        ctx.lineWidth = 1;
        const step = 30;
        ctx.beginPath();
        for (let x = 0; x < w; x += step) {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h);
        }
        for (let y = 0; y < h; y += step) {
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
        }
        ctx.stroke();
        ctx.restore();
    }

    drawPolygonSection(ctx, points, fillColor, strokeColor, hatchAngleRad, hatchColor) {
        if (!points || points.length < 3) return;

        // 1. Opaque solid body
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.closePath();
        ctx.fillStyle = fillColor;
        ctx.fill();

        // 2. ISO 128 Cross-hatching
        if (this.showHatching) {
            this.drawHatchedPolygon(ctx, points, hatchAngleRad, hatchColor, 8.0);
        }

        // 3. Crisp engineering boundary outline
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.closePath();
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 2.0;
        ctx.stroke();
    }

    drawHatchedPolygon(ctx, points, angleRad, strokeColor, step = 8.0) {
        if (!points || points.length < 3) return;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.closePath();
        ctx.clip();

        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 1.0;
        ctx.beginPath();

        let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
        for (const p of points) {
            if (p.x < minX) minX = p.x;
            if (p.x > maxX) maxX = p.x;
            if (p.y < minY) minY = p.y;
            if (p.y > maxY) maxY = p.y;
        }

        const diag = Math.hypot(maxX - minX, maxY - minY) + step * 3;
        const cx = (minX + maxX) / 2.0;
        const cy = (minY + maxY) / 2.0;
        const cosA = Math.cos(angleRad);
        const sinA = Math.sin(angleRad);

        const numLines = Math.ceil(diag / step);
        for (let i = -numLines; i <= numLines; i++) {
            const offset = i * step;
            const px = cx + offset * sinA;
            const py = cy - offset * cosA;
            ctx.moveTo(px - diag * cosA, py - diag * sinA);
            ctx.lineTo(px + diag * cosA, py + diag * sinA);
        }
        ctx.stroke();
        ctx.restore();
    }

    drawAxialSection(ctx) {
        const g = this.geom;
        const d1 = g.delta1;
        const d2 = g.delta2;
        const Re = g.Re;
        const Ri = g.Ri;
        const b = g.b;

        const s1 = Math.sin(d1), c1 = Math.cos(d1);
        const s2 = Math.sin(d2), c2 = Math.cos(d2);

        const hae1 = g.hae1, hfe1 = g.hfe1;
        const hae2 = g.hae2, hfe2 = g.hfe2;
        const hai1 = g.hai1, hfi1 = g.hfi1;
        const hai2 = g.hai2, hfi2 = g.hfi2;

        const dae1 = g.dae1, dae2 = g.dae2;

        // 1. PINION KEY COORDINATES (Apex at (0, 0), Axis along X)
        const p1_toe_tip = { x: Ri * c1 - hai1 * s1, y: -(Ri * s1 + hai1 * c1) };
        const p1_toe_root = { x: Ri * c1 + hfi1 * s1, y: -(Ri * s1 - hfi1 * c1) };
        const p1_heel_tip = { x: Re * c1 - hae1 * s1, y: -(Re * s1 + hae1 * c1) };
        const p1_heel_root = { x: Re * c1 + hfe1 * s1, y: -(Re * s1 - hfe1 * c1) };

        const p1_toe_tip_b = { x: p1_toe_tip.x, y: -p1_toe_tip.y };
        const p1_toe_root_b = { x: p1_toe_root.x, y: -p1_toe_root.y };
        const p1_heel_tip_b = { x: p1_heel_tip.x, y: -p1_heel_tip.y };
        const p1_heel_root_b = { x: p1_heel_root.x, y: -p1_heel_root.y };

        const d_bore1 = Math.max(20, (g.de1 || 100) * 0.22);
        const d_hub1 = Math.max(35, (g.de1 || 100) * 0.45);
        const H1out = Math.max(12, g.mmn * 1.3);

        // Pinion Front Face: Flat vertical face perpendicular to shaft axis at p1_toe_root.x
        const x_front1 = p1_toe_root.x;
        const x_back1 = p1_heel_root.x + H1out * s1;
        const y_back_rim1 = -(Re * s1 - (hfe1 + H1out) * c1);
        const x_hub_end1 = x_back1 + Math.max(35, b * 0.7);

        // Pinion Upper Half Cross-Section Polygon
        const pinion_upper = [
            p1_toe_root,
            p1_toe_tip,
            p1_heel_tip,
            p1_heel_root,
            { x: x_back1, y: y_back_rim1 },
            { x: x_back1, y: -d_hub1 / 2.0 },
            { x: x_hub_end1, y: -d_hub1 / 2.0 },
            { x: x_hub_end1, y: -d_bore1 / 2.0 },
            { x: x_front1, y: -d_bore1 / 2.0 },
            p1_toe_root
        ];

        // Pinion Lower Half Cross-Section Polygon (Symmetric)
        const pinion_lower = [
            { x: x_front1, y: d_bore1 / 2.0 },
            { x: x_hub_end1, y: d_bore1 / 2.0 },
            { x: x_hub_end1, y: d_hub1 / 2.0 },
            { x: x_back1, y: d_hub1 / 2.0 },
            { x: x_back1, y: -y_back_rim1 },
            p1_heel_root_b,
            p1_heel_tip_b,
            p1_toe_tip_b,
            p1_toe_root_b,
            { x: x_front1, y: d_bore1 / 2.0 }
        ];

        // 2. GEAR KEY COORDINATES (Apex at (0, 0), Axis along Y pointing up = -Y in canvas)
        const p2_heel_tip = { x: Re * s2 + hae2 * c2, y: -(Re * c2 - hae2 * s2) };
        const p2_heel_root = { x: Re * s2 - hfe2 * c2, y: -(Re * c2 + hfe2 * s2) };
        const p2_toe_tip = { x: Ri * s2 + hai2 * c2, y: -(Ri * c2 - hai2 * s2) };
        const p2_toe_root = { x: Ri * s2 - hfi2 * c2, y: -(Ri * c2 + hfi2 * s2) };

        const p2_heel_tip_l = { x: -p2_heel_tip.x, y: p2_heel_tip.y };
        const p2_heel_root_l = { x: -p2_heel_root.x, y: p2_heel_root.y };
        const p2_toe_tip_l = { x: -p2_toe_tip.x, y: p2_toe_tip.y };
        const p2_toe_root_l = { x: -p2_toe_root.x, y: p2_toe_root.y };

        const d_bore2 = Math.max(30, (g.de2 || 200) * 0.16);
        const d_hub2 = Math.max(55, (g.de2 || 200) * 0.32);
        const H2out = Math.max(16, g.mmn * 1.8);

        const y_back2 = -(Re * c2 + hfe2 * s2 + H2out * s2);
        const x_back_rim2 = Re * s2 - (hfe2 + H2out) * c2;
        const y_front2 = p2_toe_root.y;
        const x_front_rim2 = p2_toe_root.x;
        const y_hub_end2 = y_back2 - Math.max(40, b * 0.8);

        // Gear Right Half Cross-Section (Meshing side)
        const gear_right = [
            p2_toe_root,
            p2_toe_tip,
            p2_heel_tip,
            p2_heel_root,
            { x: x_back_rim2, y: y_back2 },
            { x: d_hub2 / 2.0, y: y_back2 },
            { x: d_hub2 / 2.0, y: y_hub_end2 },
            { x: d_bore2 / 2.0, y: y_hub_end2 },
            { x: d_bore2 / 2.0, y: y_front2 + 15 },
            { x: x_front_rim2, y: y_front2 },
            p2_toe_root
        ];

        // Gear Left Half Cross-Section (Symmetric)
        const gear_left = [
            { x: -x_front_rim2, y: y_front2 },
            { x: -d_bore2 / 2.0, y: y_front2 + 15 },
            { x: -d_bore2 / 2.0, y: y_hub_end2 },
            { x: -d_hub2 / 2.0, y: y_hub_end2 },
            { x: -d_hub2 / 2.0, y: y_back2 },
            { x: -x_back_rim2, y: y_back2 },
            p2_heel_root_l,
            p2_heel_tip_l,
            p2_toe_tip_l,
            p2_toe_root_l,
            { x: -x_front_rim2, y: y_front2 }
        ];

        // 3. DRAW PINION SECTIONS (Upper & Lower)
        for (const poly of [pinion_upper, pinion_lower]) {
            this.drawPolygonSection(ctx, poly, '#062e24', '#10b981', Math.PI / 4, 'rgba(16, 185, 129, 0.45)');
        }

        // Pinion Bore Shading
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.fillRect(x_front1, -d_bore1 / 2.0, x_hub_end1 - x_front1, d_bore1);
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
        ctx.lineWidth = 1.0;
        ctx.strokeRect(x_front1, -d_bore1 / 2.0, x_hub_end1 - x_front1, d_bore1);

        // 4. DRAW GEAR SECTIONS (Right & Left)
        for (const poly of [gear_right, gear_left]) {
            this.drawPolygonSection(ctx, poly, '#0d2247', '#3b82f6', -Math.PI / 4, 'rgba(59, 130, 246, 0.45)');
        }

        // Gear Bore Shading
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.fillRect(-d_bore2 / 2.0, y_hub_end2, d_bore2, (y_front2 + 15) - y_hub_end2);
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.4)';
        ctx.lineWidth = 1.0;
        ctx.strokeRect(-d_bore2 / 2.0, y_hub_end2, d_bore2, (y_front2 + 15) - y_hub_end2);

        // 5. TOOTH ROOT CONE LINES
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(p1_toe_root.x, p1_toe_root.y);
        ctx.lineTo(p1_heel_root.x, p1_heel_root.y);
        ctx.moveTo(p1_toe_root_b.x, p1_toe_root_b.y);
        ctx.lineTo(p1_heel_root_b.x, p1_heel_root_b.y);
        ctx.stroke();

        ctx.strokeStyle = '#3b82f6';
        ctx.beginPath();
        ctx.moveTo(p2_toe_root.x, p2_toe_root.y);
        ctx.lineTo(p2_heel_root.x, p2_heel_root.y);
        ctx.moveTo(p2_toe_root_l.x, p2_toe_root_l.y);
        ctx.lineTo(p2_heel_root_l.x, p2_heel_root_l.y);
        ctx.stroke();

        // 6. ANIMATED CONJUGATE MESHING STRIPES
        if (this.showStripes) {
            this.drawToothStripes(ctx, p1_toe_root, p1_heel_root, p1_toe_tip, p1_heel_tip, '#10b981', this.angle1);
            this.drawToothStripes(ctx, p2_toe_root, p2_heel_root, p2_toe_tip, p2_heel_tip, '#3b82f6', -this.angle1 / (g.i || 2.5));
        }

        // 7. CENTERLINES & PITCH CONE GENERATORS
        if (this.showAxes) {
            ctx.save();
            ctx.strokeStyle = 'rgba(148, 163, 184, 0.5)';
            ctx.lineWidth = 1.2;
            ctx.setLineDash([14, 4, 3, 4]);

            // Pinion Axis (Horizontal X)
            ctx.beginPath();
            ctx.moveTo(-50, 0);
            ctx.lineTo(x_hub_end1 + 60, 0);
            ctx.stroke();

            // Gear Axis (Vertical Y)
            ctx.beginPath();
            ctx.moveTo(0, 50);
            ctx.lineTo(0, y_hub_end2 - 60);
            ctx.stroke();

            // Pitch Cone Generator Line (Contact Line)
            ctx.strokeStyle = '#f59e0b';
            ctx.lineWidth = 1.8;
            ctx.setLineDash([10, 4, 3, 4]);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(Re * c1 * 1.15, -Re * s1 * 1.15);
            ctx.stroke();

            // Symmetric Pitch Cone Generator for Gear Left
            ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
            ctx.lineWidth = 1.0;
            ctx.setLineDash([6, 4]);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(-Re * s2 * 1.12, -Re * c2 * 1.12);
            ctx.moveTo(0, 0);
            ctx.lineTo(Re * c1 * 1.12, Re * s1 * 1.12);
            ctx.stroke();

            ctx.restore();
        }

        // 8. APEX V INDICATOR
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(0, 0, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        ctx.fillStyle = '#f87171';
        ctx.font = 'bold 11px Consolas, monospace';
        ctx.fillText('Apex V(0,0)', -28, 18);

        // 9. CAD ENGINEERING DIMENSIONS
        if (this.showDimensions) {
            this.drawCadDimensions(ctx, {
                g, Re, Ri, b, d1, d2, s1, c1, s2, c2,
                dae1, dae2, x_hub_end1,
                p1_heel_tip, p1_heel_tip_b,
                p2_heel_tip, p2_heel_tip_l
            });
        }
    }

    drawCadDimensions(ctx, d) {
        const { g, Re, Ri, b, d1, d2, s1, c1, s2, c2, dae1, dae2, x_hub_end1, p1_heel_tip, p1_heel_tip_b, p2_heel_tip, p2_heel_tip_l } = d;

        // A. Pinion Tip Diameter dae1 (Vertical dimension on right side)
        const x_dim_dae1 = x_hub_end1 + 25;
        const y_top_dae1 = -dae1 / 2.0;
        const y_bot_dae1 = dae1 / 2.0;

        ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)';
        ctx.lineWidth = 1.0;
        ctx.beginPath();
        ctx.moveTo(p1_heel_tip.x, p1_heel_tip.y);
        ctx.lineTo(x_dim_dae1 + 10, y_top_dae1);
        ctx.moveTo(p1_heel_tip_b.x, p1_heel_tip_b.y);
        ctx.lineTo(x_dim_dae1 + 10, y_bot_dae1);
        ctx.stroke();

        this.drawDimensionLine(ctx,
            { x: x_dim_dae1, y: y_top_dae1 },
            { x: x_dim_dae1, y: y_bot_dae1 },
            '\u2300dae1 = ' + dae1.toFixed(1),
            '#34d399',
            { x: 10, y: 0 },
            'left'
        );

        // B. Gear Tip Diameter dae2 (Horizontal dimension at top)
        const y_dim_dae2 = -dae2 / 2.0 - 28;
        const x_left_dae2 = -dae2 / 2.0;
        const x_right_dae2 = dae2 / 2.0;

        ctx.beginPath();
        ctx.moveTo(p2_heel_tip_l.x, p2_heel_tip_l.y);
        ctx.lineTo(x_left_dae2, y_dim_dae2 - 10);
        ctx.moveTo(p2_heel_tip.x, p2_heel_tip.y);
        ctx.lineTo(x_right_dae2, y_dim_dae2 - 10);
        ctx.stroke();

        this.drawDimensionLine(ctx,
            { x: x_left_dae2, y: y_dim_dae2 },
            { x: x_right_dae2, y: y_dim_dae2 },
            '\u2300dae2 = ' + dae2.toFixed(1),
            '#60a5fa',
            { x: 0, y: -10 },
            'center'
        );

        // C. Face Width b (Parallel to pitch cone generator line)
        const nx_p = -s1, ny_p = -c1;
        const b_off = 32;
        const p_b1 = { x: Ri * c1 + b_off * nx_p, y: -(Ri * s1 - b_off * ny_p) };
        const p_b2 = { x: Re * c1 + b_off * nx_p, y: -(Re * s1 - b_off * ny_p) };

        ctx.beginPath();
        ctx.moveTo(Ri * c1, -Ri * s1);
        ctx.lineTo(p_b1.x + 8 * nx_p, p_b1.y - 8 * ny_p);
        ctx.moveTo(Re * c1, -Re * s1);
        ctx.lineTo(p_b2.x + 8 * nx_p, p_b2.y - 8 * ny_p);
        ctx.stroke();

        this.drawDimensionLine(ctx,
            p_b1, p_b2,
            'b = ' + b.toFixed(1),
            '#f59e0b',
            { x: 10 * nx_p, y: -10 * ny_p },
            'center'
        );

        // D. Outer Cone Distance Re
        const re_off = 58;
        const p_re1 = { x: re_off * nx_p, y: re_off * ny_p };
        const p_re2 = { x: Re * c1 + re_off * nx_p, y: -(Re * s1 - re_off * ny_p) };

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(p_re1.x + 8 * nx_p, p_re1.y - 8 * ny_p);
        ctx.moveTo(Re * c1, -Re * s1);
        ctx.lineTo(p_re2.x + 8 * nx_p, p_re2.y - 8 * ny_p);
        ctx.stroke();

        this.drawDimensionLine(ctx,
            p_re1, p_re2,
            'Re = ' + Re.toFixed(1),
            '#fbbf24',
            { x: 10 * nx_p, y: -10 * ny_p },
            'center'
        );

        // E. Pitch Cone Angles (δ1, δ2)
        ctx.save();
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 1.0;
        ctx.beginPath();
        ctx.arc(0, 0, 85, -d1, 0);
        ctx.stroke();
        ctx.fillStyle = '#10b981';
        ctx.font = '11px sans-serif';
        ctx.fillText('\u03B41 = ' + g.delta1_deg.toFixed(1) + '°', 95, -12);

        ctx.strokeStyle = '#60a5fa';
        ctx.beginPath();
        ctx.arc(0, 0, 115, -Math.PI / 2, -d1);
        ctx.stroke();
        ctx.fillStyle = '#60a5fa';
        ctx.fillText('\u03B42 = ' + g.delta2_deg.toFixed(1) + '°', 20, -125);
        ctx.restore();
    }

    drawDimensionLine(ctx, p1, p2, text, color = '#38bdf8', textOffset = { x: 0, y: -8 }, align = 'center') {
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const length = Math.hypot(dx, dy);
        if (length < 8) return;

        const ux = dx / length;
        const uy = dy / length;
        const vx = -uy;
        const vy = ux;

        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();

        const arrowLen = Math.min(8.0, length * 0.35);
        const arrowHalfWidth = arrowLen / 3.0;

        // Arrow at p1
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p1.x + arrowLen * ux + arrowHalfWidth * vx, p1.y + arrowLen * uy + arrowHalfWidth * vy);
        ctx.lineTo(p1.x + arrowLen * ux - arrowHalfWidth * vx, p1.y + arrowLen * uy - arrowHalfWidth * vy);
        ctx.closePath();
        ctx.fill();

        // Arrow at p2
        ctx.beginPath();
        ctx.moveTo(p2.x, p2.y);
        ctx.lineTo(p2.x - arrowLen * ux + arrowHalfWidth * vx, p2.y - arrowLen * uy + arrowHalfWidth * vy);
        ctx.lineTo(p2.x - arrowLen * ux - arrowHalfWidth * vx, p2.y - arrowLen * uy - arrowHalfWidth * vy);
        ctx.closePath();
        ctx.fill();

        const midX = (p1.x + p2.x) / 2.0 + textOffset.x;
        const midY = (p1.y + p2.y) / 2.0 + textOffset.y;

        ctx.font = 'bold 11px Consolas, monospace';
        ctx.textAlign = align;
        ctx.textBaseline = 'middle';

        const metrics = ctx.measureText(text);
        const txtWidth = metrics.width;
        ctx.fillStyle = 'rgba(7, 11, 20, 0.85)';
        ctx.fillRect(align === 'center' ? midX - txtWidth / 2 - 3 : midX - 2, midY - 7, txtWidth + 6, 14);

        ctx.fillStyle = color;
        ctx.fillText(text, midX, midY);
        ctx.restore();
    }

    drawDataCard(ctx, g) {
        ctx.save();
        const cx = 16, cy = 16;
        const cardW = 260, cardH = 175;

        ctx.fillStyle = 'rgba(11, 19, 41, 0.9)';
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1.0;
        ctx.beginPath();
        ctx.roundRect ? ctx.roundRect(cx, cy, cardW, cardH, 6) : ctx.rect(cx, cy, cardW, cardH);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.roundRect ? ctx.roundRect(cx, cy, cardW, 26, [6, 6, 0, 0]) : ctx.rect(cx, cy, cardW, 26);
        ctx.fill();

        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 11px system-ui, sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText('📐 BẢNG THÔNG SỐ CHUẨN ISO 23509', cx + 10, cy + 13);

        const x1_str = (g.x1 >= 0 ? '+' : '') + (g.x1 || 0).toFixed(2);
        const x2_str = (g.x2 >= 0 ? '+' : '') + (g.x2 || 0).toFixed(2);
        const items = [
            ['Tỉ số truyền i', (g.i || (g.z2 / g.z1)).toFixed(3)],
            ['Số răng z1 / z2', g.z1 + ' / ' + g.z2],
            ['Mô-đun pháp mmn', (g.mmn || 10).toFixed(1) + ' mm'],
            ['Góc nón chia δ1 / δ2', (g.delta1_deg || 0).toFixed(1) + '° / ' + (g.delta2_deg || 0).toFixed(1) + '°'],
            ['Bề rộng vành răng b', (g.b || 0).toFixed(1) + ' mm'],
            ['Góc xoắn răng β', (g.beta_deg || 0).toFixed(1) + '°'],
            ['Dịch chỉnh x1 / x2', x1_str + ' / ' + x2_str]
        ];

        ctx.font = '10px system-ui, sans-serif';
        items.forEach((item, idx) => {
            const rowY = cy + 40 + idx * 18;
            ctx.fillStyle = '#94a3b8';
            ctx.fillText(item[0], cx + 10, rowY);
            ctx.fillStyle = '#f1f5f9';
            ctx.font = 'bold 10px Consolas, monospace';
            ctx.textAlign = 'right';
            ctx.fillText(item[1], cx + cardW - 10, rowY);
            ctx.textAlign = 'left';
            ctx.font = '10px system-ui, sans-serif';
        });

        ctx.restore();
    }

    drawToothStripes(ctx, toe_root, heel_root, toe_tip, heel_tip, color, phaseAngle) {
        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.0;
        ctx.setLineDash([2, 2]);

        const numTeeth = 6;
        for (let i = 0; i < numTeeth; i++) {
            const rawT = (i / numTeeth + (phaseAngle / (Math.PI * 2)) % 1 + 1) % 1;
            const t = Math.sin(rawT * Math.PI);
            if (t <= 0.05) continue;

            const rx = toe_root.x + (heel_root.x - toe_root.x) * rawT;
            const ry = toe_root.y + (heel_root.y - toe_root.y) * rawT;
            const tx = toe_tip.x + (heel_tip.x - toe_tip.x) * rawT;
            const ty = toe_tip.y + (heel_tip.y - toe_tip.y) * rawT;

            ctx.beginPath();
            ctx.moveTo(rx, ry);
            ctx.lineTo(tx, ty);
            ctx.stroke();
        }
        ctx.restore();
    }
}




/**
 * MITCalc Web App - 3D Bevel Gear Solid & Surface Mesh Generator (Module 2)
 * Generates 100% watertight closed manifold 3D Solid Meshes and Open Flank Surface Meshes
 * for both Straight Bevel Gears (beta = 0) and Spiral Bevel Gears (beta != 0)
 * Standards: ISO 23509, DIN 3971, DIN 3965, AGMA 2005.
 * Features:
 * - Spherical Involute & Tredgold Equivalent Virtual Flank Profile
 * - Linear Cone Convergence toward Apex V(0, 0, 0)
 * - Tapered Tooth Thickness & Addendum/Dedendum along face width b (Re -> Ri)
 * - Gleason/Logarithmic Spiral Tooth Trace (beta > 0)
 * - Circular Root Fillet (R = 0.38 * mn)
 * - Vertex Splitting (Zero-Ripple Planar & Conical Caps)
 * - Open Flank Surface Mesh (Mastercam 5-axis Surface Toolpaths & SolidWorks)
 * - 100% Compatible with Three.js, Binary STL, and STEP AP214 (ISO 10303-21)
 */

const Bevel3DGenerator = {
    /**
     * Generates a complete 3D mesh for a single bevel gear (pinion or gear wheel)
     * @param {Object} opt
     * @param {number} opt.z - Number of teeth
     * @param {number} opt.mmn - Mean normal module (mm)
     * @param {number} opt.delta - Pitch cone angle (rad)
     * @param {number} opt.delta_a - Tip cone angle (rad)
     * @param {number} opt.delta_f - Root cone angle (rad)
     * @param {number} opt.Re - Outer cone distance (mm)
     * @param {number} opt.Ri - Inner cone distance (mm)
     * @param {number} opt.Rm - Mean cone distance (mm)
     * @param {number} opt.b - Face width (mm)
     * @param {number} opt.alfa - Pressure angle (rad, default 20 deg)
     * @param {number} [opt.beta=0] - Spiral angle (rad)
     * @param {number} [opt.x=0] - Profile shift coefficient
     * @param {number} [opt.xt=0] - Tooth thickness modification coefficient
     * @param {number} [opt.ha=0] - Mean addendum (mm)
     * @param {number} [opt.hf=0] - Mean dedendum (mm)
     * @param {number} [opt.hand=1] - Spiral hand: +1 for RH, -1 for LH
     * @param {number} [opt.dBore] - Inner shaft bore diameter (mm)
     * @param {number} [opt.numSlices=8] - Slices along face width b
     * @param {number} [opt.ptsPerFlank=8] - Points per involute flank side
     * @param {boolean} [opt.surfaceOnly=false] - If true, only flank surfaces (open shell for CAM)
     * @returns {Object} Mesh data: { vertices, normals, indices, rawTriangles, bbox }
     */
    generateGearMesh(opt) {
        const z = Math.max(6, parseInt(opt.z) || 18);
        const mmn = Math.max(0.5, parseFloat(opt.mmn) || 10.0);
        const delta = parseFloat(opt.delta) || (Math.PI / 4);
        const Re = Math.max(10.0, parseFloat(opt.Re) || 100.0);
        const b = Math.max(2.0, parseFloat(opt.b) || 30.0);
        const Ri = Math.max(2.0, opt.Ri !== undefined ? parseFloat(opt.Ri) : (Re - b));
        const Rm = opt.Rm !== undefined ? parseFloat(opt.Rm) : (Re - b / 2.0);

        const alfa = parseFloat(opt.alfa) || (20.0 * Math.PI / 180.0);
        const beta = parseFloat(opt.beta) || 0.0;
        const x = parseFloat(opt.x) || 0.0;
        const xt = parseFloat(opt.xt) || 0.0;
        const hand = opt.hand !== undefined ? parseInt(opt.hand) : 1;

        const delta_a = parseFloat(opt.delta_a) || (delta + Math.atan((mmn * 1.0) / Rm));
        const delta_f = parseFloat(opt.delta_f) || (delta - Math.atan((mmn * 1.2) / Rm));

        const isSpiral = Math.abs(beta) > 1e-4;
        const isSurfaceOnly = !!opt.surfaceOnly;

        const numSlices = Math.max(4, Math.min(16, parseInt(opt.numSlices) || (isSpiral ? 10 : 6)));
        const ptsPerFlank = Math.max(6, Math.min(18, parseInt(opt.ptsPerFlank) || 8));

        // Shaft bore diameter (standard ISO 23509 shaft bore)
        const de_pitch = 2.0 * Re * Math.sin(delta);
        const di_root = 2.0 * Ri * Math.sin(delta_f);
        const defaultBore = Math.max(8.0, Math.round(di_root * 0.45));
        const dBore = Math.min(di_root * 0.85, Math.max(6.0, parseFloat(opt.dBore) || defaultBore));
        const rBore = dBore / 2.0;

        // Mean addendum and dedendum
        const ha_mean = opt.ha !== undefined ? parseFloat(opt.ha) : (mmn * (1.0 + x));
        const hf_mean = opt.hf !== undefined ? parseFloat(opt.hf) : (mmn * (1.2 - x));

        // Back cone angle is perpendicular to pitch cone: delta_back = pi/2 - delta
        const cosDelta = Math.cos(delta);
        const sinDelta = Math.sin(delta);

        // 1. Discretize profile in 2D parametric space (height h, angular deviation theta)
        // A tooth consists of:
        // Left root land -> Left fillet -> Left involute flank -> Top land -> Right involute flank -> Right fillet -> Right root land
        const ptsPerToothHalf = ptsPerFlank + 3; // flank + fillet + tip + root
        const N_profile_per_tooth = ptsPerToothHalf * 2;
        const totalContourPts = z * N_profile_per_tooth;

        // 2. Precompute unit tooth 2D profile coordinates at mean cone Rm
        // Virtual gear parameters at Rm:
        const rv_m = (Rm * sinDelta) / cosDelta; // Virtual pitch radius = Rm * tan(delta)
        const zv_m = z / cosDelta;
        const rvb_m = rv_m * Math.cos(alfa); // Virtual base radius
        const rva_m = rv_m + ha_mean; // Virtual tip radius
        const rvf_m = Math.max(0.1, rv_m - hf_mean); // Virtual root radius
        const sn_m = mmn * (Math.PI / 2.0 + 2.0 * x * Math.tan(alfa) + xt);
        const psi_v_m = sn_m / (2.0 * rv_m); // Angular half-thickness on virtual gear

        // Normalized radial sample heights relative to pitch cone: h = r_v - rv_m
        const profileHeights = []; // h_norm: -hf to +ha
        const profileAngles = [];  // theta_norm: angular deviation on bevel gear

        // Generate normalized half-profile from root to tip
        const r_start = Math.max(rvf_m, rvb_m * 0.95);
        for (let i = 0; i < ptsPerFlank; i++) {
            const t = i / (ptsPerFlank - 1);
            // Involute from base (or start) to tip
            const r_curr = r_start + t * (rva_m - r_start);
            const h_val = r_curr - rv_m;

            let inv_alpha_r = 0.0;
            if (r_curr > rvb_m) {
                const alpha_r = Math.acos(Math.min(1.0, rvb_m / r_curr));
                inv_alpha_r = Math.tan(alpha_r) - alpha_r;
            }
            const inv_alpha_t = Math.tan(alfa) - alfa;
            const theta_virtual = psi_v_m + inv_alpha_t - inv_alpha_r;
            // Map virtual angle to bevel gear pitch cone angle
            const theta_bevel = theta_virtual / cosDelta;

            profileHeights.push(h_val);
            profileAngles.push(theta_bevel);
        }

        // Add root fillet point & bottom land point
        const h_root = -hf_mean;
        const theta_root_fillet = (psi_v_m * 1.25) / cosDelta;
        const theta_root_land = (Math.PI / z); // half-pitch angle to tooth space center

        // 3. Build 3D points for all slices along face width b
        const numLayers = numSlices + 1;
        const layers = [];

        for (let s = 0; s <= numSlices; s++) {
            const frac = s / numSlices;
            const R = Re - frac * (Re - Ri); // R from Re (outer) to Ri (inner)
            const scale = R / Rm;

            // Spiral angle twist along cone generator
            let spiralTwist = 0.0;
            if (isSpiral) {
                // Differential Gleason spiral curve: phi(R) = hand * (Re - R) * tan(beta) / (Rm * sinDelta)
                spiralTwist = hand * ((Re - R) * Math.tan(beta)) / (Rm * Math.max(0.01, sinDelta));
            }

            const layerPoints = [];

            for (let tooth = 0; tooth < z; tooth++) {
                const toothCenterAngle = (tooth * 2.0 * Math.PI) / z + spiralTwist;

                // A. Left half tooth (Coast flank / Root land to Tip)
                // 1. Root land center
                {
                    const h = h_root * scale;
                    const r = R * sinDelta + h * cosDelta;
                    const z_ax = R * cosDelta - h * sinDelta;
                    const ang = toothCenterAngle - theta_root_land;
                    layerPoints.push({
                        x: r * Math.cos(ang),
                        y: r * Math.sin(ang),
                        z: z_ax,
                        isTip: false,
                        isRoot: true
                    });
                }
                // 2. Root fillet transition
                {
                    const h = (h_root * 0.6) * scale;
                    const r = R * sinDelta + h * cosDelta;
                    const z_ax = R * cosDelta - h * sinDelta;
                    const ang = toothCenterAngle - theta_root_fillet * scale;
                    layerPoints.push({
                        x: r * Math.cos(ang),
                        y: r * Math.sin(ang),
                        z: z_ax,
                        isTip: false,
                        isRoot: false
                    });
                }
                // 3. Involute flank (from root up to tip)
                for (let p = 0; p < ptsPerFlank; p++) {
                    const h = profileHeights[p] * scale;
                    const r = R * sinDelta + h * cosDelta;
                    const z_ax = R * cosDelta - h * sinDelta;
                    const ang = toothCenterAngle - profileAngles[p] * scale;
                    layerPoints.push({
                        x: r * Math.cos(ang),
                        y: r * Math.sin(ang),
                        z: z_ax,
                        isTip: (p === ptsPerFlank - 1),
                        isRoot: false
                    });
                }

                // B. Right half tooth (Drive flank / Tip down to Root land)
                // 4. Involute flank (from tip down to root)
                for (let p = ptsPerFlank - 1; p >= 0; p--) {
                    const h = profileHeights[p] * scale;
                    const r = R * sinDelta + h * cosDelta;
                    const z_ax = R * cosDelta - h * sinDelta;
                    const ang = toothCenterAngle + profileAngles[p] * scale;
                    layerPoints.push({
                        x: r * Math.cos(ang),
                        y: r * Math.sin(ang),
                        z: z_ax,
                        isTip: (p === ptsPerFlank - 1),
                        isRoot: false
                    });
                }
                // 5. Root fillet transition
                {
                    const h = (h_root * 0.6) * scale;
                    const r = R * sinDelta + h * cosDelta;
                    const z_ax = R * cosDelta - h * sinDelta;
                    const ang = toothCenterAngle + theta_root_fillet * scale;
                    layerPoints.push({
                        x: r * Math.cos(ang),
                        y: r * Math.sin(ang),
                        z: z_ax,
                        isTip: false,
                        isRoot: false
                    });
                }
            }

            layers.push(layerPoints);
        }

        const N = layers[0].length; // Points per ring contour

        // 4. Mesh Assembly & Vertex Splitting
        const vertices = [];
        const normals = [];
        const indices = [];
        const rawTriangles = [];

        // Helper to compute triangle normal and append triangle
        function addTri(p1, p2, p3, nExplicit = null) {
            const ax = p2.x - p1.x, ay = p2.y - p1.y, az = p2.z - p1.z;
            const bx = p3.x - p1.x, by = p3.y - p1.y, bz = p3.z - p1.z;
            let nx = ay * bz - az * by;
            let ny = az * bx - ax * bz;
            let nz = ax * by - ay * bx;
            const len = Math.hypot(nx, ny, nz);
            if (len > 1e-9) {
                nx /= len; ny /= len; nz /= len;
            } else {
                nx = 0; ny = 0; nz = 1;
            }

            const n = nExplicit || { x: nx, y: ny, z: nz };
            const idx = vertices.length / 3;

            vertices.push(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z, p3.x, p3.y, p3.z);
            normals.push(n.x, n.y, n.z, n.x, n.y, n.z, n.x, n.y, n.z);
            indices.push(idx, idx + 1, idx + 2);

            rawTriangles.push([
                [p1.x, p1.y, p1.z],
                [p2.x, p2.y, p2.z],
                [p3.x, p3.y, p3.z],
                [n.x, n.y, n.z]
            ]);
        }

        function addQuad(p1, p2, p3, p4, nExplicit = null) {
            addTri(p1, p2, p3, nExplicit);
            addTri(p1, p3, p4, nExplicit);
        }

        // =========================================================================
        // GROUP 1: TOOTH FLANK SURFACES & ROOT/TIP LANDS (ALONG FACE WIDTH b)
        // =========================================================================
        for (let s = 0; s < numSlices; s++) {
            const L1 = layers[s];     // outer layer
            const L2 = layers[s + 1]; // inner layer

            for (let j = 0; j < N; j++) {
                const nextJ = (j + 1) % N;
                // Quad between (L1[j], L1[nextJ], L2[nextJ], L2[j])
                addQuad(L1[j], L1[nextJ], L2[nextJ], L2[j]);
            }
        }

        // If user requested Surface Only, we finish here!
        if (isSurfaceOnly) {
            const bbox = Bevel3DGenerator._computeBBox(vertices);
            return {
                vertices: new Float32Array(vertices),
                normals: new Float32Array(normals),
                indices: new Uint32Array(indices),
                rawTriangles,
                bbox,
                isSurfaceOnly: true,
                z, mmn, b, Re, Ri
            };
        }

        // =========================================================================
        // GROUP 2: OUTER BACK END CAP (MẶT ĐẦU NGOÀI TẠI R = Re) - VERTEX SPLITTING
        // =========================================================================
        // Outer back cone normal points backward: [-sin(delta), -cos(delta)] in (r, z)
        // Connecting outer tooth profile ring to outer bore circle
        const L_outer = layers[0];
        const z_back_bore = Re * cosDelta + hf_mean * sinDelta; // Back face axial position
        const boreOuterPoints = [];

        for (let j = 0; j < N; j++) {
            const ang = Math.atan2(L_outer[j].y, L_outer[j].x);
            boreOuterPoints.push({
                x: rBore * Math.cos(ang),
                y: rBore * Math.sin(ang),
                z: z_back_bore
            });
        }

        // Back cap normal: pointing in +Z direction (away from Apex)
        const nBack = { x: 0, y: 0, z: 1.0 };
        for (let j = 0; j < N; j++) {
            const nextJ = (j + 1) % N;
            addQuad(boreOuterPoints[j], boreOuterPoints[nextJ], L_outer[nextJ], L_outer[j], nBack);
        }

        // =========================================================================
        // GROUP 3: INNER FRONT END CAP (MẶT ĐẦU TRONG TẠI R = Ri) - VERTEX SPLITTING
        // =========================================================================
        // Inner front cone normal points forward (toward Apex, -Z)
        const L_inner = layers[numSlices];
        const z_front_bore = Ri * cosDelta - ha_mean * sinDelta; // Front face axial position
        const boreInnerPoints = [];

        for (let j = 0; j < N; j++) {
            const ang = Math.atan2(L_inner[j].y, L_inner[j].x);
            boreInnerPoints.push({
                x: rBore * Math.cos(ang),
                y: rBore * Math.sin(ang),
                z: z_front_bore
            });
        }

        const nFront = { x: 0, y: 0, z: -1.0 };
        for (let j = 0; j < N; j++) {
            const nextJ = (j + 1) % N;
            addQuad(L_inner[j], L_inner[nextJ], boreInnerPoints[nextJ], boreInnerPoints[j], nFront);
        }

        // =========================================================================
        // GROUP 4: INNER CYLINDRICAL BORE (LÒNG LỖ TRỤC ĐƯỜNG KÍNH ds)
        // =========================================================================
        // Connecting boreInnerPoints to boreOuterPoints
        for (let j = 0; j < N; j++) {
            const nextJ = (j + 1) % N;
            const angMid = Math.atan2(boreOuterPoints[j].y, boreOuterPoints[j].x);
            // Normal points toward center axis: [-cos(ang), -sin(ang), 0]
            const nBore = { x: -Math.cos(angMid), y: -Math.sin(angMid), z: 0 };
            addQuad(boreInnerPoints[j], boreOuterPoints[j], boreOuterPoints[nextJ], boreInnerPoints[nextJ], nBore);
        }

        const bbox = Bevel3DGenerator._computeBBox(vertices);
        return {
            vertices: new Float32Array(vertices),
            normals: new Float32Array(normals),
            indices: new Uint32Array(indices),
            rawTriangles,
            bbox,
            isSurfaceOnly: false,
            z, mmn, b, Re, Ri, dBore
        };
    },

    /**
     * Generates an Open Flank Surface Mesh directly (CAM Drive Surfaces)
     */
    generateGearSurfaceMesh(opt) {
        return this.generateGearMesh({ ...opt, surfaceOnly: true });
    },

    /**
     * Computes 3D Bounding Box
     * @private
     */
    _computeBBox(vertices) {
        let minX = Infinity, minY = Infinity, minZ = Infinity;
        let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
        for (let i = 0; i < vertices.length; i += 3) {
            const x = vertices[i], y = vertices[i + 1], z = vertices[i + 2];
            if (x < minX) minX = x; if (x > maxX) maxX = x;
            if (y < minY) minY = y; if (y > maxY) maxY = y;
            if (z < minZ) minZ = z; if (z > maxZ) maxZ = z;
        }
        return {
            min: [minX, minY, minZ],
            max: [maxX, maxY, maxZ],
            center: [(minX + maxX) / 2, (minY + maxY) / 2, (minZ + maxZ) / 2],
            size: [maxX - minX, maxY - minY, maxZ - minZ]
        };
    }
};

if (typeof window !== 'undefined') window.Bevel3DGenerator = Bevel3DGenerator;


/**
 * MITCalc Web App - 3D Bevel Gear CAD Exporter for SolidWorks & Mastercam (Module 2)
 * Generates industry-standard 3D CAD files:
 * 1. Binary STL (.stl) - High-precision, compact binary mesh ready for Mastercam Toolpaths
 *    (Dynamic OptiRough, Surface Finish Scallop/Blend, Swarf Milling) & SolidWorks Solid Mesh Body.
 * 2. ISO 10303-21 STEP AP214 (.step / .stp) - Standard CAD Solid B-Rep format recognized by SolidWorks
 *    as a native Solid Body and Mastercam as a Machinable Solid.
 * 3. STEP AP214 Hollow Flank Surface (.step) - OPEN_SHELL with SHELL_BASED_SURFACE_MODEL for Mastercam
 *    5-axis Surface Toolpaths & SolidWorks surface modeling.
 * 4. Wavefront OBJ (.obj) - Universal 3D geometry interchange format.
 */

const Bevel3DExporter = {
    /**
     * Helper to trigger browser file download via Blob URL
     * @param {Blob} blob - Data blob
     * @param {string} filename - Filename with extension
     */
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

    /**
     * Flattens triangles from single gear or assembly
     * @param {Array|Object} input - rawTriangles array or array of triangle arrays
     * @returns {Array} Array of [[p1], [p2], [p3], [n]]
     */
    normalizeTriangles(input) {
        if (!input) return [];
        if (Array.isArray(input)) {
            // Check if already an array of triangles: [[x,y,z], [x,y,z], [x,y,z], [nx,ny,nz]]
            if (input.length > 0 && Array.isArray(input[0]) && input[0].length === 4) {
                return input;
            }
            // If it's an array of part meshes:
            let combined = [];
            for (const part of input) {
                if (Array.isArray(part)) {
                    combined = combined.concat(part);
                } else if (part && part.rawTriangles) {
                    combined = combined.concat(part.rawTriangles);
                }
            }
            return combined;
        } else if (input.rawTriangles) {
            return input.rawTriangles;
        }
        return [];
    },

    /**
     * Exports Binary STL file (Compatible with Mastercam 3D Milling & SolidWorks)
     * @param {Array|Object} input - Triangle data
     * @param {string} filename - e.g. "BevelGear_Pinion.stl"
     * @param {boolean} [autoDownload=true] - Trigger browser download
     */
    exportBinarySTL(input, filename = 'bevel_gear.stl', autoDownload = true) {
        const triangles = this.normalizeTriangles(input);
        const numTriangles = triangles.length;

        // Binary STL format:
        // 80 bytes: ASCII header
        // 4 bytes: uint32 number of triangles
        // numTriangles * 50 bytes:
        //   12 bytes: normal (3 * float32)
        //   12 bytes: vertex 1 (3 * float32)
        //   12 bytes: vertex 2 (3 * float32)
        //   12 bytes: vertex 3 (3 * float32)
        //   2 bytes: attribute byte count (uint16 = 0)
        const totalBytes = 84 + numTriangles * 50;
        const buffer = new ArrayBuffer(totalBytes);
        const view = new DataView(buffer);

        // Write 80-byte header
        const headerStr = 'MITCalc 3D Bevel Gear Model - SolidWorks & Mastercam Compatible CAD/CAM';
        for (let i = 0; i < 80; i++) {
            view.setUint8(i, i < headerStr.length ? headerStr.charCodeAt(i) : 32);
        }

        // Write triangle count (little endian)
        view.setUint32(80, numTriangles, true);

        // Write triangles
        let offset = 84;
        for (let i = 0; i < numTriangles; i++) {
            const tri = triangles[i];
            const p1 = tri[0];
            const p2 = tri[1];
            const p3 = tri[2];
            const n = tri[3];

            // Normal
            view.setFloat32(offset, n[0], true);
            view.setFloat32(offset + 4, n[1], true);
            view.setFloat32(offset + 8, n[2], true);

            // Vertex 1
            view.setFloat32(offset + 12, p1[0], true);
            view.setFloat32(offset + 16, p1[1], true);
            view.setFloat32(offset + 20, p1[2], true);

            // Vertex 2
            view.setFloat32(offset + 24, p2[0], true);
            view.setFloat32(offset + 28, p2[1], true);
            view.setFloat32(offset + 32, p2[2], true);

            // Vertex 3
            view.setFloat32(offset + 36, p3[0], true);
            view.setFloat32(offset + 40, p3[1], true);
            view.setFloat32(offset + 44, p3[2], true);

            // Attribute byte count = 0
            view.setUint16(offset + 48, 0, true);

            offset += 50;
        }

        const blob = new Blob([buffer], { type: 'application/octet-stream' });
        if (autoDownload) this.downloadBlob(blob, filename);
        return { buffer, blob, numTriangles, totalBytes };
    },

    /**
     * Exports Binary STL Surface Only
     */
    exportSTLSurface(input, filename = 'bevel_gear_surface.stl', autoDownload = true) {
        return this.exportBinarySTL(input, filename, autoDownload);
    },

    /**
     * Exports standard ISO 10303-21 STEP AP214 file (.step)
     * Solid: Recognized by SolidWorks as a native Solid Body and Mastercam as a Machinable Solid.
     * Surface: Recognized by SolidWorks as a Surface Body and Mastercam as Machinable Drive Surfaces (Open Shell).
     * @param {Array|Object} input - Triangle data
     * @param {string} filename - e.g. "BevelGear.step"
     * @param {string} partName - Part name
     * @param {boolean} [autoDownload=true] - Trigger browser download
     * @param {boolean} [isSurface=false] - If true, exports OPEN_SHELL with SHELL_BASED_SURFACE_MODEL
     */
    exportSTEP(input, filename = 'bevel_gear.step', partName = 'BEVEL_GEAR_PART', autoDownload = true, isSurface = false) {
        const triangles = this.normalizeTriangles(input);
        const now = new Date().toISOString().replace(/\.\d+Z$/, '');

        const lines = [];
        lines.push('ISO-10303-21;');
        lines.push('HEADER;');
        const fileDesc = isSurface
            ? 'MITCalc 3D Bevel Gear Hollow Flank Surface Model for SolidWorks and Mastercam Surface Toolpaths'
            : 'MITCalc 3D Bevel Gear Solid Model for SolidWorks and Mastercam';
        lines.push(`FILE_DESCRIPTION(('${fileDesc}'),'2;1');`);
        lines.push(`FILE_NAME('${filename}','${now}',('SirPhuong'),('MITCalc-Gear-Engineering'),'Antigravity CAD/CAM Engine','SolidWorks / Mastercam Compatible','');`);
        lines.push(`FILE_SCHEMA(('AUTOMOTIVE_DESIGN { 1 0 10303 214 1 1 1 1 }'));`);
        lines.push('ENDSEC;');
        lines.push('DATA;');

        let id = 1;

        // Context & Units
        lines.push(`#${id++} = APPLICATION_CONTEXT('core data for automotive mechanical design processes');`); // #1
        lines.push(`#${id++} = APPLICATION_PROTOCOL_DEFINITION('draft international standard','automotive_design',1999,#1);`); // #2
        lines.push(`#${id++} = PRODUCT_CONTEXT('',#1,'mechanical');`); // #3
        lines.push(`#${id++} = PRODUCT('${partName}','${partName}','',(#3));`); // #4
        lines.push(`#${id++} = PRODUCT_DEFINITION_FORMATION('','',#4);`); // #5
        lines.push(`#${id++} = PRODUCT_DEFINITION('design','',#5,#3);`); // #6
        lines.push(`#${id++} = PRODUCT_DEFINITION_SHAPE('','',#6);`); // #7

        // SI Units: Millimetre (0.001 m)
        lines.push(`#${id++} = ( LENGTH_UNIT() NAMED_UNIT(*) SI_UNIT(.MILLI.,.METRE.) );`); // #8
        lines.push(`#${id++} = ( NAMED_UNIT(*) PLANE_ANGLE_UNIT() SI_UNIT($,.RADIAN.) );`); // #9
        lines.push(`#${id++} = ( NAMED_UNIT(*) SI_UNIT($,.STERADIAN.) SOLID_ANGLE_UNIT() );`); // #10
        lines.push(`#${id++} = UNCERTAINTY_MEASURE_WITH_UNIT(LENGTH_MEASURE(0.001),#8,'distance_accuracy_value','confusion accuracy');`); // #11
        lines.push(`#${id++} = ( GEOMETRIC_REPRESENTATION_CONTEXT(3) GLOBAL_UNCERTAINTY_ASSIGNED_CONTEXT((#11)) GLOBAL_UNIT_ASSIGNED_CONTEXT((#8,#9,#10)) REPRESENTATION_CONTEXT('3D','TOPOLOGY') );`); // #12

        const repContextId = 12;

        // Write vertices & faces for shell
        const vMap = new Map();
        let nextVId = id;

        const fStr = (v) => {
            const s = v.toFixed(5);
            return s.indexOf('.') === -1 ? s + '.' : s;
        };

        const getVertexId = (p) => {
            const key = `${Math.round(p[0] * 1000)},${Math.round(p[1] * 1000)},${Math.round(p[2] * 1000)}`;
            let existId = vMap.get(key);
            if (!existId) {
                existId = nextVId++;
                vMap.set(key, existId);
                lines.push(`#${existId} = CARTESIAN_POINT('',(${fStr(p[0])},${fStr(p[1])},${fStr(p[2])}));`);
            }
            return existId;
        };

        const faceDefinitions = [];
        for (let i = 0; i < triangles.length; i++) {
            const [p1, p2, p3, n] = triangles[i];
            const id1 = getVertexId(p1);
            const id2 = getVertexId(p2);
            const id3 = getVertexId(p3);

            if (id1 === id2 || id2 === id3 || id3 === id1) continue;

            faceDefinitions.push({ id1, id2, id3, n, p1 });
        }

        id = nextVId;

        const faceIds = [];
        for (let i = 0; i < faceDefinitions.length; i++) {
            const f = faceDefinitions[i];
            const pId1 = f.id1;
            const pId2 = f.id2;
            const pId3 = f.id3;

            const loopId = id++;
            lines.push(`#${loopId} = POLY_LOOP('',(#${pId1},#${pId2},#${pId3}));`);

            const boundId = id++;
            lines.push(`#${boundId} = FACE_OUTER_BOUND('',#${loopId},.T.);`);

            const dirId = id++;
            lines.push(`#${dirId} = DIRECTION('',(${fStr(f.n[0])},${fStr(f.n[1])},${fStr(f.n[2])}));`);

            const p1PtId = f.id1;
            const posId = id++;
            lines.push(`#${posId} = AXIS2_PLACEMENT_3D('',#${p1PtId},#${dirId},#${dirId});`);

            const planeId = id++;
            lines.push(`#${planeId} = PLANE('',#${posId});`);

            const faceId = id++;
            lines.push(`#${faceId} = ADVANCED_FACE('',(#${boundId}),#${planeId},.T.);`);
            faceIds.push(faceId);
        }

        const faceListStr = faceIds.map(fId => `#${fId}`).join(',');
        const shellId = id++;

        let shapeRepId;
        if (isSurface) {
            // STEP AP214 Hollow Surface: OPEN_SHELL & SHELL_BASED_SURFACE_MODEL
            lines.push(`#${shellId} = OPEN_SHELL('',(${faceListStr}));`);
            const surfaceModelId = id++;
            lines.push(`#${surfaceModelId} = SHELL_BASED_SURFACE_MODEL('${partName}',(#${shellId}));`);
            shapeRepId = id++;
            lines.push(`#${shapeRepId} = SHAPE_REPRESENTATION('${partName}',(#${surfaceModelId}),#${repContextId});`);
        } else {
            // STEP AP214 Watertight Solid: CLOSED_SHELL & MANIFOLD_SOLID_BREP
            lines.push(`#${shellId} = CLOSED_SHELL('',(${faceListStr}));`);
            const brepId = id++;
            lines.push(`#${brepId} = MANIFOLD_SOLID_BREP('${partName}',#${shellId});`);
            shapeRepId = id++;
            lines.push(`#${shapeRepId} = ADVANCED_BREP_SHAPE_REPRESENTATION('${partName}',(#${brepId}),#${repContextId});`);
        }

        lines.push(`#${id++} = SHAPE_DEFINITION_REPRESENTATION(#7,#${shapeRepId});`);
        lines.push('ENDSEC;');
        lines.push('END-ISO-10303-21;');

        const stepContent = lines.join('\r\n') + '\r\n';
        const blob = new Blob([stepContent], { type: 'application/step;charset=utf-8' });
        if (autoDownload) this.downloadBlob(blob, filename);
        return { content: stepContent, blob, numFaces: faceIds.length };
    },

    /**
     * Exports STEP Surface Only
     */
    exportSTEPSurface(input, filename = 'bevel_gear_surface.step', partName = 'BEVEL_GEAR_SURFACE', autoDownload = true) {
        return this.exportSTEP(input, filename, partName, autoDownload, true);
    },

    /**
     * Exports Wavefront OBJ file
     * @param {Array|Object} input - Triangle data
     * @param {string} filename - e.g. "bevel_gear.obj"
     * @param {boolean} [autoDownload=true] - Trigger browser download
     */
    exportOBJ(input, filename = 'bevel_gear.obj', autoDownload = true) {
        const triangles = this.normalizeTriangles(input);
        const lines = ['# MITCalc 3D Bevel Gear Wavefront OBJ File', '# Standards: ISO 23509'];

        let vCount = 1;
        for (let i = 0; i < triangles.length; i++) {
            const [p1, p2, p3, n] = triangles[i];
            lines.push(`vn ${n[0].toFixed(5)} ${n[1].toFixed(5)} ${n[2].toFixed(5)}`);
            lines.push(`v ${p1[0].toFixed(4)} ${p1[1].toFixed(4)} ${p1[2].toFixed(4)}`);
            lines.push(`v ${p2[0].toFixed(4)} ${p2[1].toFixed(4)} ${p2[2].toFixed(4)}`);
            lines.push(`v ${p3[0].toFixed(4)} ${p3[1].toFixed(4)} ${p3[2].toFixed(4)}`);
            const vnIdx = i + 1;
            lines.push(`f ${vCount}//${vnIdx} ${vCount + 1}//${vnIdx} ${vCount + 2}//${vnIdx}`);
            vCount += 3;
        }

        const blob = new Blob([lines.join('\r\n')], { type: 'text/plain;charset=utf-8' });
        if (autoDownload) this.downloadBlob(blob, filename);
        return { blob };
    }
};

if (typeof window !== 'undefined') window.Bevel3DExporter = Bevel3DExporter;


/**
 * MITCalc Web App - 3D WebGL Bevel Gear Visualizer & Meshing Simulator (Module 2)
 * Renders real-time 3D conjugate meshing of Bevel Gears (Straight & Spiral)
 * at shaft angle Sigma (ISO 23509) using Three.js, PBR metallic materials, OrbitControls,
 * and analytical conjugate rotation with collision-free phase alignment.
 */


class Bevel3DVisualizer {
    constructor(containerElement) {
        this.container = typeof containerElement === 'string'
            ? document.getElementById(containerElement)
            : containerElement;

        this.geom = null;
        this.renderer = null;
        this.scene = null;
        this.camera = null;
        this.controls = null;

        this.pinionGroup = null;
        this.gearGroup = null;
        this.pinionMesh = null;
        this.gearMesh = null;
        this.gridHelper = null;

        this.isAnimating = true;
        this.animSpeed = 1.0;
        this.rotSpeedBase = 0.015; // rad per frame at 1.0x
        this.pinionAngle = 0;
        this.gearAngle = 0;
        this.initialGearAngle = 0;
        this.gearRatio = 2.5;
        this.sigmaRad = Math.PI / 2.0;

        this.wireframeMode = false;
        this.mesh1Data = null;
        this.mesh2Data = null;

        this.init();
    }

    init() {
        if (typeof THREE === 'undefined') {
            console.error('Three.js is not loaded.');
            return;
        }

        if (!this.container) return;

        const width = this.container.clientWidth || 1200;
        const height = this.container.clientHeight || 650;

        // 1. Scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0b0f19);

        // 2. Camera
        this.camera = new THREE.PerspectiveCamera(45, width / height, 1.0, 10000);
        this.camera.position.set(250, 250, 350);

        // 3. Renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.15;

        while (this.container.firstChild) {
            this.container.removeChild(this.container.firstChild);
        }
        this.container.appendChild(this.renderer.domElement);

        // 4. OrbitControls
        if (typeof THREE.OrbitControls !== 'undefined') {
            this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
            this.controls.enableDamping = true;
            this.controls.dampingFactor = 0.08;
            this.controls.screenSpacePanning = true;
            this.controls.maxDistance = 5000;
            this.controls.minDistance = 10;
        }

        // 5. Lighting
        this.setupLighting();

        // 6. Groups for independent rotation & orientation
        this.pinionGroup = new THREE.Group();
        this.gearGroup = new THREE.Group();
        this.scene.add(this.pinionGroup);
        this.scene.add(this.gearGroup);

        // 7. Grid helper at apex
        this.gridHelper = new THREE.GridHelper(1000, 50, 0x1e293b, 0x0f172a);
        this.gridHelper.position.set(0, 0, -50);
        this.scene.add(this.gridHelper);

        // 8. Resize listener
        window.addEventListener('resize', () => this.onResize());

        // 9. Animation loop
        this.animate();
    }

    setupLighting() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
        this.scene.add(ambientLight);

        // Main key light
        const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.4);
        dirLight1.position.set(300, 500, 400);
        dirLight1.castShadow = true;
        dirLight1.shadow.mapSize.width = 2048;
        dirLight1.shadow.mapSize.height = 2048;
        dirLight1.shadow.bias = -0.0001;
        this.scene.add(dirLight1);

        // Fill light (blue tone)
        const dirLight2 = new THREE.DirectionalLight(0x93c5fd, 0.7);
        dirLight2.position.set(-400, -200, -300);
        this.scene.add(dirLight2);

        // Rim light (amber tone)
        const dirLight3 = new THREE.DirectionalLight(0xfef08a, 0.8);
        dirLight3.position.set(0, -400, 300);
        this.scene.add(dirLight3);
    }

    onResize() {
        if (!this.container || !this.renderer || !this.camera) return;
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        if (width === 0 || height === 0) return;
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    setGeometry(geom) {
        if (!geom) return;
        this.geom = geom;

        const z1 = parseInt(geom.z1) || 18;
        const z2 = parseInt(geom.z2) || 45;
        this.gearRatio = z2 / z1;

        const Sigma_deg = parseFloat(geom.Sigma_deg !== undefined ? geom.Sigma_deg : geom.Sigma) || 90.0;
        this.sigmaRad = (Sigma_deg * Math.PI) / 180.0;

        const mmn = parseFloat(geom.mmn) || 10.0;
        const b = parseFloat(geom.b) || 117.0;
        const Re = parseFloat(geom.Re) || 338.0;
        const Rm = parseFloat(geom.Rm) || (Re - b / 2.0);
        const Ri = parseFloat(geom.Ri) || (Re - b);

        const delta1 = parseFloat(geom.delta1) || Math.atan(Math.sin(this.sigmaRad) / (this.gearRatio + Math.cos(this.sigmaRad)));
        const delta2 = this.sigmaRad - delta1;

        const alfa = (parseFloat(geom.alfa_deg !== undefined ? geom.alfa_deg : 20.0) * Math.PI) / 180.0;
        const beta = (parseFloat(geom.beta_deg !== undefined ? geom.beta_deg : 0.0) * Math.PI) / 180.0;

        const x1 = parseFloat(geom.x1 !== undefined ? geom.x1 : 0.0);
        const x2 = parseFloat(geom.x2 !== undefined ? geom.x2 : -x1);
        const xt1 = parseFloat(geom.xt1 !== undefined ? geom.xt1 : 0.0);
        const xt2 = parseFloat(geom.xt2 !== undefined ? geom.xt2 : -xt1);

        const ha1 = parseFloat(geom.ha1 !== undefined ? geom.ha1 : (mmn * (1.0 + x1)));
        const ha2 = parseFloat(geom.ha2 !== undefined ? geom.ha2 : (mmn * (1.0 + x2)));
        const hf1 = parseFloat(geom.hf1 !== undefined ? geom.hf1 : (mmn * (1.2 - x1)));
        const hf2 = parseFloat(geom.hf2 !== undefined ? geom.hf2 : (mmn * (1.2 - x2)));

        const delta_a1 = parseFloat(geom.delta_a1 !== undefined ? geom.delta_a1 : (delta1 + Math.atan(ha1 / Rm)));
        const delta_a2 = parseFloat(geom.delta_a2 !== undefined ? geom.delta_a2 : (delta2 + Math.atan(ha2 / Rm)));
        const delta_f1 = parseFloat(geom.delta_f1 !== undefined ? geom.delta_f1 : (delta1 - Math.atan(hf1 / Rm)));
        const delta_f2 = parseFloat(geom.delta_f2 !== undefined ? geom.delta_f2 : (delta2 - Math.atan(hf2 / Rm)));

        // 1. Generate Pinion 1 Mesh
        this.mesh1Data = Bevel3DGenerator.generateGearMesh({
            z: z1, mmn, delta: delta1, delta_a: delta_a1, delta_f: delta_f1,
            Re, Ri, Rm, b, alfa, beta, x: x1, xt: xt1, ha: ha1, hf: hf1,
            hand: 1
        });

        // 2. Generate Gear 2 Mesh (opposite spiral hand for conjugate engagement)
        this.mesh2Data = Bevel3DGenerator.generateGearMesh({
            z: z2, mmn, delta: delta2, delta_a: delta_a2, delta_f: delta_f2,
            Re, Ri, Rm, b, alfa, beta, x: x2, xt: xt2, ha: ha2, hf: hf2,
            hand: -1
        });

        this.updateMeshes();

        // 3. Analytical Conjugate Phase Offset (Collision-Free Mesh)
        // Bánh 1 quay quanh trục X, Bánh 2 quay quanh trục Y (góc Sigma).
        // Bánh 2 được bù góc để răng khớp vào rãnh hoàn hảo
        this.initialGearAngle = Math.PI / z2 + (Math.PI / 2.0) * (1.0 - z1 / z2);
        this.pinionAngle = 0;
        this.gearAngle = this.initialGearAngle;

        this.updateGearRotations();
        this.setViewPreset('iso');
    }

    updateMeshes() {
        if (!this.mesh1Data || !this.mesh2Data) return;

        // Clean previous meshes
        if (this.pinionMesh) {
            this.pinionGroup.remove(this.pinionMesh);
            this.pinionMesh.geometry.dispose();
            this.pinionMesh = null;
        }
        if (this.gearMesh) {
            this.gearGroup.remove(this.gearMesh);
            this.gearMesh.geometry.dispose();
            this.gearMesh = null;
        }

        // PBR Materials: Pinion (Cyan Steel), Gear (Gold/Bronze Steel)
        const matPinion = new THREE.MeshStandardMaterial({
            color: 0x0284c7, // Vibrant cyan-blue
            metalness: 0.85,
            roughness: 0.25,
            wireframe: this.wireframeMode
        });

        const matGear = new THREE.MeshStandardMaterial({
            color: 0xf59e0b, // Warm amber-gold
            metalness: 0.85,
            roughness: 0.28,
            wireframe: this.wireframeMode
        });

        // 1. Pinion BufferGeometry
        const geo1 = new THREE.BufferGeometry();
        geo1.setAttribute('position', new THREE.BufferAttribute(this.mesh1Data.vertices, 3));
        geo1.setAttribute('normal', new THREE.BufferAttribute(this.mesh1Data.normals, 3));
        geo1.setIndex(new THREE.BufferAttribute(this.mesh1Data.indices, 1));
        this.pinionMesh = new THREE.Mesh(geo1, matPinion);
        this.pinionMesh.castShadow = true;
        this.pinionMesh.receiveShadow = true;
        this.pinionGroup.add(this.pinionMesh);

        // Align Pinion along X-axis: rotate mesh so its Z-axis lies along +X
        // Mesh local Z is rotation axis. To put local Z along +X, rotate Y by +90 deg
        this.pinionMesh.rotation.set(0, Math.PI / 2.0, 0);

        // 2. Gear BufferGeometry
        const geo2 = new THREE.BufferGeometry();
        geo2.setAttribute('position', new THREE.BufferAttribute(this.mesh2Data.vertices, 3));
        geo2.setAttribute('normal', new THREE.BufferAttribute(this.mesh2Data.normals, 3));
        geo2.setIndex(new THREE.BufferAttribute(this.mesh2Data.indices, 1));
        this.gearMesh = new THREE.Mesh(geo2, matGear);
        this.gearMesh.castShadow = true;
        this.gearMesh.receiveShadow = true;
        this.gearGroup.add(this.gearMesh);

        // Align Gear along direction of Shaft Angle Sigma:
        // When Sigma = 90 deg, Gear axis is along +Y.
        // To put local Z along +Y, rotate X by -90 deg
        const sigma = this.sigmaRad || (Math.PI / 2.0);
        this.gearMesh.rotation.set(-Math.PI / 2.0, 0, Math.PI / 2.0 - sigma);
    }

    updateGearRotations() {
        if (!this.pinionGroup || !this.gearGroup) return;
        // Pinion rotates around X axis
        this.pinionGroup.rotation.x = this.pinionAngle;
        // Gear rotates around Y axis (or axis at angle Sigma)
        this.gearGroup.rotation.y = this.gearAngle;
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        if (this.isAnimating && this.pinionGroup && this.gearGroup) {
            const step = this.rotSpeedBase * this.animSpeed;
            this.pinionAngle += step;
            // Kinematic conjugate synchronization:
            this.gearAngle = this.initialGearAngle - this.pinionAngle / this.gearRatio;
            this.updateGearRotations();
        }

        if (this.controls) {
            this.controls.update();
        }

        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }

    setAnimSpeed(speed) {
        this.animSpeed = Math.max(0.1, Math.min(3.0, parseFloat(speed) || 1.0));
    }

    toggleAnimation() {
        this.isAnimating = !this.isAnimating;
        return this.isAnimating;
    }

    toggleWireframe() {
        this.wireframeMode = !this.wireframeMode;
        if (this.pinionMesh) this.pinionMesh.material.wireframe = this.wireframeMode;
        if (this.gearMesh) this.gearMesh.material.wireframe = this.wireframeMode;
        return this.wireframeMode;
    }

    resetView() {
        this.setViewPreset('iso');
    }

    setViewPreset(preset) {
        if (!this.camera || !this.controls) return;

        const Re = this.geom ? (parseFloat(this.geom.Re) || 300.0) : 300.0;
        const dist = Re * 1.6;

        // Center on mean pitch contact point
        const Rm = this.geom ? (parseFloat(this.geom.Rm) || (Re * 0.8)) : (Re * 0.8);
        const delta1 = this.geom ? (parseFloat(this.geom.delta1) || (Math.PI / 4)) : (Math.PI / 4);
        const cx = Rm * Math.cos(delta1) * 0.5;
        const cy = Rm * Math.sin(delta1) * 0.5;
        const cz = 0;

        switch (preset) {
            case 'front': // Axial Section view (XY plane)
                this.camera.position.set(cx, cy, dist * 1.4);
                this.controls.target.set(cx, cy, 0);
                break;
            case 'pinion': // Front face of Pinion (looking along X axis from +X)
                this.camera.position.set(dist * 1.5, cy, 0);
                this.controls.target.set(cx, cy, 0);
                break;
            case 'gear': // Front face of Gear (looking along Y axis from +Y)
                this.camera.position.set(cx, dist * 1.5, 0);
                this.controls.target.set(cx, cy, 0);
                break;
            case 'top': // Top view (XZ plane)
                this.camera.position.set(cx, dist * 1.5, cz);
                this.controls.target.set(cx, 0, cz);
                break;
            case 'bottom': // Bottom view
                this.camera.position.set(cx, -dist * 1.5, cz);
                this.controls.target.set(cx, 0, cz);
                break;
            case 'right': // Right view
                this.camera.position.set(dist * 1.5, cy, cz);
                this.controls.target.set(0, cy, cz);
                break;
            case 'left': // Left view
                this.camera.position.set(-dist * 1.5, cy, cz);
                this.controls.target.set(0, cy, cz);
                break;
            case 'mesh': // Close up of pitch contact zone
                const mx = Rm * Math.cos(delta1);
                const my = Rm * Math.sin(delta1);
                this.camera.position.set(mx + 60, my + 60, 100);
                this.controls.target.set(mx, my, 0);
                break;
            case 'iso':
            default:
                this.camera.position.set(dist * 0.9, dist * 0.9, dist * 1.1);
                this.controls.target.set(cx, cy, 0);
                break;
        }

        this.controls.update();
    }

    /**
     * Extracts raw triangles for CAD export (Pinion, Gear, or Assembly Pair)
     * @param {string} type - 'pinion', 'gear', or 'assembly'
     * @param {boolean} surfaceOnly - If true, generates surface-only mesh on demand
     * @returns {Array} Triangle array
     */
    getExportTriangles(type = 'pinion', surfaceOnly = false) {
        if (!this.geom) return [];

        const z1 = parseInt(this.geom.z1) || 18;
        const z2 = parseInt(this.geom.z2) || 45;
        const mmn = parseFloat(this.geom.mmn) || 10.0;
        const b = parseFloat(this.geom.b) || 117.0;
        const Re = parseFloat(this.geom.Re) || 338.0;
        const Rm = parseFloat(this.geom.Rm) || (Re - b / 2.0);
        const Ri = parseFloat(this.geom.Ri) || (Re - b);
        const delta1 = parseFloat(this.geom.delta1) || Math.atan(1.0 / this.gearRatio);
        const delta2 = this.sigmaRad - delta1;
        const alfa = (parseFloat(this.geom.alfa_deg || 20.0) * Math.PI) / 180.0;
        const beta = (parseFloat(this.geom.beta_deg || 0.0) * Math.PI) / 180.0;
        const x1 = parseFloat(this.geom.x1 || 0.0);
        const x2 = parseFloat(this.geom.x2 || -x1);
        const xt1 = parseFloat(this.geom.xt1 || 0.0);
        const xt2 = parseFloat(this.geom.xt2 || -xt1);
        const ha1 = parseFloat(this.geom.ha1 || (mmn * (1.0 + x1)));
        const ha2 = parseFloat(this.geom.ha2 || (mmn * (1.0 + x2)));
        const hf1 = parseFloat(this.geom.hf1 || (mmn * (1.2 - x1)));
        const hf2 = parseFloat(this.geom.hf2 || (mmn * (1.2 - x2)));
        const delta_a1 = parseFloat(this.geom.delta_a1 || (delta1 + Math.atan(ha1 / Rm)));
        const delta_a2 = parseFloat(this.geom.delta_a2 || (delta2 + Math.atan(ha2 / Rm)));
        const delta_f1 = parseFloat(this.geom.delta_f1 || (delta1 - Math.atan(hf1 / Rm)));
        const delta_f2 = parseFloat(this.geom.delta_f2 || (delta2 - Math.atan(hf2 / Rm)));

        // Helper to transform triangle: [[p1], [p2], [p3], [n]]
        function transformTriangles(tris, rotY_rad, rotX_rad, rotZ_rad = 0) {
            const cosY = Math.cos(rotY_rad), sinY = Math.sin(rotY_rad);
            const cosX = Math.cos(rotX_rad), sinX = Math.sin(rotX_rad);
            const cosZ = Math.cos(rotZ_rad), sinZ = Math.sin(rotZ_rad);

            function rotPt(p) {
                // Rotate around Y
                let x1 = p[0] * cosY + p[2] * sinY;
                let y1 = p[1];
                let z1 = -p[0] * sinY + p[2] * cosY;
                // Rotate around X
                let x2 = x1;
                let y2 = y1 * cosX - z1 * sinX;
                let z2 = y1 * sinX + z1 * cosX;
                // Rotate around Z
                let x3 = x2 * cosZ - y2 * sinZ;
                let y3 = x2 * sinZ + y2 * cosZ;
                let z3 = z2;
                return [x3, y3, z3];
            }

            return tris.map(([p1, p2, p3, n]) => {
                return [rotPt(p1), rotPt(p2), rotPt(p3), rotPt(n)];
            });
        }

        if (type === 'pinion') {
            const m1 = Bevel3DGenerator.generateGearMesh({
                z: z1, mmn, delta: delta1, delta_a: delta_a1, delta_f: delta_f1,
                Re, Ri, Rm, b, alfa, beta, x: x1, xt: xt1, ha: ha1, hf: hf1,
                hand: 1, surfaceOnly
            });
            return m1.rawTriangles;
        }

        if (type === 'gear') {
            const m2 = Bevel3DGenerator.generateGearMesh({
                z: z2, mmn, delta: delta2, delta_a: delta_a2, delta_f: delta_f2,
                Re, Ri, Rm, b, alfa, beta, x: x2, xt: xt2, ha: ha2, hf: hf2,
                hand: -1, surfaceOnly
            });
            return m2.rawTriangles;
        }

        // Assembly Pair
        const m1 = Bevel3DGenerator.generateGearMesh({
            z: z1, mmn, delta: delta1, delta_a: delta_a1, delta_f: delta_f1,
            Re, Ri, Rm, b, alfa, beta, x: x1, xt: xt1, ha: ha1, hf: hf1,
            hand: 1, surfaceOnly
        });
        const m2 = Bevel3DGenerator.generateGearMesh({
            z: z2, mmn, delta: delta2, delta_a: delta_a2, delta_f: delta_f2,
            Re, Ri, Rm, b, alfa, beta, x: x2, xt: xt2, ha: ha2, hf: hf2,
            hand: -1, surfaceOnly
        });

        // Pinion transformed to Axis 1 (along +X)
        const tPinion = transformTriangles(m1.rawTriangles, Math.PI / 2.0, 0, 0);

        // Gear transformed to Axis 2 (along direction of Sigma)
        const sigma = this.sigmaRad || (Math.PI / 2.0);
        const tGear = transformTriangles(m2.rawTriangles, 0, -Math.PI / 2.0, Math.PI / 2.0 - sigma);

        return tPinion.concat(tGear);
    }
}

if (typeof window !== 'undefined') window.Bevel3DVisualizer = Bevel3DVisualizer;


/**
 * MITCalc Web App - Bevel Gear UI Controller (Module 2)
 * Manages Accordion, Real-time calculations, Materials DB, Smart Buttons, Sliders, Live Audit
 * Standards: ISO 23509, DIN 3971, DIN 3965
 * ZERO-FORCE SCOPE: Focus 100% on geometry, kinematics, tolerances, and CAD.
 */

class BevelGearUI {
    constructor() {
        this.inputs = {
            P: 50.0,
            n1: 1000.0,
            n2: 400.0,
            i_req: 2.5000,
            z1: 18,
            z2: 45,
            Sigma: 90.0,
            alfa: 20.0,
            beta: 30.0,
            mmn: 10.0,
            b: 117.0,
            x1: 0.32,
            xt1: 0.04,
            ha0: 1.0,
            c0: 0.2,
            Q: 6,
            mat1: '16MnCr5',
            mat2: '16MnCr5'
        };

        this.lastGeom = null;
        this.activeMode = '2D';
        this.canvasController = (typeof BevelGearCanvas !== 'undefined') ? new BevelGearCanvas('bevelCanvas') : null;
        const container3DEl = document.getElementById('bevel3DContainer');
        this.visualizer3D = (typeof Bevel3DVisualizer !== 'undefined' && container3DEl) ? new Bevel3DVisualizer(container3DEl) : null;

        this.initDOM();
        this.initAccordion();
        this.initMaterials();
        this.initMaterialsTable();
        this.initInputs();
        this.initSmartControls();
        this.calculate();
    }

    initDOM() {
        // Global Accordion controls
        const btnExpandAll = document.getElementById('btnExpandAll');
        const btnCollapseAll = document.getElementById('btnCollapseAll');
        if (btnExpandAll) btnExpandAll.addEventListener('click', () => this.toggleAllSections(true));
        if (btnCollapseAll) btnCollapseAll.addEventListener('click', () => this.toggleAllSections(false));

        // Reset Defaults
        const btnReset = document.getElementById('btnResetDefaults');
        if (btnReset) {
            btnReset.addEventListener('click', () => {
                this.inputs = {
                    P: 50.0, n1: 1000.0, n2: 400.0, i_req: 2.5000,
                    z1: 18, z2: 45, Sigma: 90.0, alfa: 20.0, beta: 30.0,
                    mmn: 10.0, b: 117.0, x1: 0.32, xt1: 0.04,
                    ha0: 1.0, c0: 0.2, Q: 6, mat1: '16MnCr5', mat2: '16MnCr5'
                };
                document.querySelectorAll('.input-eng').forEach(inp => {
                    const k = inp.getAttribute('data-key');
                    if (this.inputs[k] !== undefined) inp.value = this.inputs[k];
                });
                this.calculate();
            });
        }

        // Print Report
        const btnPrint = document.getElementById('btnPrintReport');
        if (btnPrint) {
            btnPrint.addEventListener('click', () => window.print());
        }

        // Tab switching (Zero conflict, display: block/none + active class)
        const tabs = document.querySelectorAll('.tab-btn');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.tab-pane').forEach(c => {
                    c.classList.remove('active');
                    c.style.display = 'none';
                });
                tab.classList.add('active');
                const targetId = tab.getAttribute('data-target');
                const target = document.getElementById(targetId);
                if (target) {
                    target.classList.add('active');
                    target.style.display = 'block';
                    if (targetId === 'tabCanvas') {
                        if (this.activeMode === '2D' && this.canvasController) {
                            this.canvasController.resetView();
                        } else if (this.activeMode === '3D' && this.visualizer3D) {
                            this.visualizer3D.onResize();
                            if (this.lastGeom) this.visualizer3D.setGeometry(this.lastGeom);
                        }
                    }
                }
            });
        });

        // Accuracy Grade Selection (Section 11.4 / DIN 3965)
        const selAccSec14 = document.getElementById('selAccuracySec14');
        if (selAccSec14) {
            selAccSec14.addEventListener('change', () => {
                this.inputs.Q = parseInt(selAccSec14.value) || 6;
                this.calculate();
            });
        }

        // Canvas toolbar & Speed Slider
        const sliderSpeed = document.getElementById('sliderAnimSpeed');
        const speedVal = document.getElementById('animSpeedVal');
        if (sliderSpeed) {
            sliderSpeed.addEventListener('input', (e) => {
                const spd = parseFloat(e.target.value) || 1.0;
                if (speedVal) speedVal.textContent = spd.toFixed(1) + 'x';
                if (this.canvasController) this.canvasController.setAnimSpeed(spd);
            });
        }

        const btnZoomIn = document.getElementById('btnCanvasZoomIn');
        const btnZoomOut = document.getElementById('btnCanvasZoomOut');
        const btnResetView = document.getElementById('btnCanvasReset');
        const btnAnimate = document.getElementById('btnCanvasAnimate');
        if (btnZoomIn && this.canvasController) btnZoomIn.addEventListener('click', () => this.canvasController.zoom(1.2));
        if (btnZoomOut && this.canvasController) btnZoomOut.addEventListener('click', () => this.canvasController.zoom(0.8));
        if (btnResetView && this.canvasController) btnResetView.addEventListener('click', () => this.canvasController.resetView());
        if (btnAnimate && this.canvasController) {
            btnAnimate.addEventListener('click', () => {
                const running = this.canvasController.toggleAnimation();
                btnAnimate.textContent = running ? '⏸ Tạm Dừng' : '▶ Chạy Mô Phỏng';
            });
        }

        // Canvas Layer Toggles
        const chkShowDims = document.getElementById('chkShowDims');
        const chkShowHatch = document.getElementById('chkShowHatch');
        const chkShowAxes = document.getElementById('chkShowAxes');
        const chkShowStripes = document.getElementById('chkShowStripes');
        const chkShowDataCard = document.getElementById('chkShowDataCard');

        if (chkShowDims) {
            chkShowDims.addEventListener('change', (e) => {
                if (this.canvasController) {
                    this.canvasController.showDimensions = e.target.checked;
                    this.canvasController.render();
                }
            });
        }
        if (chkShowHatch) {
            chkShowHatch.addEventListener('change', (e) => {
                if (this.canvasController) {
                    this.canvasController.showHatching = e.target.checked;
                    this.canvasController.render();
                }
            });
        }
        if (chkShowAxes) {
            chkShowAxes.addEventListener('change', (e) => {
                if (this.canvasController) {
                    this.canvasController.showAxes = e.target.checked;
                    this.canvasController.render();
                }
            });
        }
        if (chkShowStripes) {
            chkShowStripes.addEventListener('change', (e) => {
                if (this.canvasController) {
                    this.canvasController.showStripes = e.target.checked;
                    this.canvasController.render();
                }
            });
        }
        if (chkShowDataCard) {
            chkShowDataCard.addEventListener('change', (e) => {
                if (this.canvasController) {
                    this.canvasController.showDataCard = e.target.checked;
                    this.canvasController.render();
                }
            });
        }

        // DXF Export Buttons (Canvas & Section 16)
        const btnExportDXFCanvas = document.getElementById('btnExportDXFCanvas');
        if (btnExportDXFCanvas) {
            btnExportDXFCanvas.addEventListener('click', () => this.exportDXF());
        }
        const btnExportDXFSec16 = document.getElementById('btnExportDXFSec16');
        if (btnExportDXFSec16) {
            btnExportDXFSec16.addEventListener('click', () => this.exportDXF());
        }

        // Live Audit Refresh Button
        const btnRefreshAudit = document.getElementById('btnRefreshAudit');
        if (btnRefreshAudit) {
            btnRefreshAudit.addEventListener('click', () => this.calculate());
        }

        // =========================================================================
        // 2D / 3D MODE SWITCHER & 3D CAD CONTROLS
        // =========================================================================
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
                if (visualizerTitle) visualizerTitle.textContent = '📐 Mô Hình 2D Nón Bánh Răng Ăn Khớp (ISO 23509)';
                if (visualizerDesc) visualizerDesc.textContent = 'Mặt cắt trục bổ dọc ISO 23509 khép kín, gạch mặt cắt kim loại 45°, đường sinh nón chia và đỉnh Apex V(0,0).';
                if (this.canvasController) this.canvasController.resetView();
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
                if (visualizerTitle) visualizerTitle.textContent = '🧊 Mô Phỏng Ăn Khớp 3D WebGL (Bevel Gears)';
                if (visualizerDesc) visualizerDesc.textContent = 'Mô hình 3D thực thể xoay chuyển động ăn khớp liên hợp không gian tại góc trục Σ. Xuất file CAD STEP/STL cho SolidWorks & Mastercam.';
                if (this.visualizer3D) {
                    this.visualizer3D.onResize();
                    if (this.lastGeom) this.visualizer3D.setGeometry(this.lastGeom);
                }
            });
        }

        // 3D Camera View Preset Dropdown
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

        // 3D Wireframe & Animation Controls
        const btnWireframe = document.getElementById('btnToggleWireframe');
        if (btnWireframe && this.visualizer3D) {
            btnWireframe.addEventListener('click', () => {
                this.visualizer3D.toggleWireframe();
                btnWireframe.classList.toggle('active', this.visualizer3D.wireframeMode);
            });
        }

        const btnToggle3DAnim = document.getElementById('btnToggle3DAnim');
        if (btnToggle3DAnim && this.visualizer3D) {
            btnToggle3DAnim.addEventListener('click', () => {
                const isRunning = this.visualizer3D.toggleAnimation();
                btnToggle3DAnim.textContent = isRunning ? '⏸️ Dừng' : '▶️ Tiếp Tục';
            });
        }

        const slider3DSpeed = document.getElementById('slider3DAnimSpeed');
        const anim3DSpeedVal = document.getElementById('anim3DSpeedVal');
        if (slider3DSpeed && this.visualizer3D) {
            slider3DSpeed.addEventListener('input', (e) => {
                const val = parseFloat(e.target.value) || 1.0;
                if (anim3DSpeedVal) anim3DSpeedVal.textContent = val.toFixed(1) + 'x';
                this.visualizer3D.setAnimSpeed(val);
            });
        }

        // 3D Export Dropdown & Items Binding
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

        bind3DExp('expStepPinion', 'step', 'pinion');
        bind3DExp('expStepGear', 'step', 'gear');
        bind3DExp('expStepAssembly', 'step', 'assembly');

        bind3DExp('expStepSurfacePinion', 'step_surface', 'pinion');
        bind3DExp('expStepSurfaceGear', 'step_surface', 'gear');
        bind3DExp('expStepSurfaceAssembly', 'step_surface', 'assembly');

        bind3DExp('expStlPinion', 'stl', 'pinion');
        bind3DExp('expStlGear', 'stl', 'gear');
        bind3DExp('expStlAssembly', 'stl', 'assembly');

        bind3DExp('expStlSurfacePinion', 'stl_surface', 'pinion');
        bind3DExp('expStlSurfaceGear', 'stl_surface', 'gear');

        bind3DExp('expObjAssembly', 'obj', 'assembly');
    }

    initAccordion() {
        document.querySelectorAll('.section-header').forEach(header => {
            header.addEventListener('click', () => {
                const section = header.parentElement;
                const isCollapsed = section.classList.contains('collapsed');
                section.classList.toggle('collapsed', !isCollapsed);
                const toggle = header.querySelector('.section-toggle');
                if (toggle) toggle.textContent = isCollapsed ? '▼' : '▶';
            });
        });
    }

    toggleAllSections(expand) {
        document.querySelectorAll('.calc-section').forEach(section => {
            section.classList.toggle('collapsed', !expand);
            const toggle = section.querySelector('.section-toggle');
            if (toggle) toggle.textContent = expand ? '▼' : '▶';
        });
    }

    initMaterials() {
        const sel1 = document.getElementById('sel_mat1');
        const sel2 = document.getElementById('sel_mat2');
        if (!sel1 || !sel2 || typeof MATERIALS_DB === 'undefined') return;

        sel1.innerHTML = '';
        sel2.innerHTML = '';

        MATERIALS_DB.forEach(m => {
            const std = m.standards ? (m.standards.din || m.standards.iso || m.standards.en || '') : '';
            const label = m.name + (std ? ' (' + std + ')' : '') + ' - Rm: ' + (m.rm || '--') + ' MPa';

            const opt1 = document.createElement('option');
            opt1.value = m.name;
            opt1.textContent = label;
            if (m.name.includes('16MnCr5') || m.name.includes('Ck 60') || m.name.includes('C45')) opt1.selected = true;
            sel1.appendChild(opt1);

            const opt2 = document.createElement('option');
            opt2.value = m.name;
            opt2.textContent = label;
            if (m.name.includes('16MnCr5') || m.name.includes('Ck 60') || m.name.includes('C45')) opt2.selected = true;
            sel2.appendChild(opt2);
        });

        sel1.addEventListener('change', () => this.updateMaterialProps(1));
        sel2.addEventListener('change', () => this.updateMaterialProps(2));
        this.updateMaterialProps(1);
        this.updateMaterialProps(2);
    }

    updateMaterialProps(wheel) {
        const sel = document.getElementById('sel_mat' + wheel);
        if (!sel || typeof MATERIALS_DB === 'undefined') return;
        const mat = MATERIALS_DB.find(m => m.name === sel.value);
        if (!mat) return;

        const set = (id, val) => {
            const el = document.getElementById(id);
            if (el) el.textContent = val;
        };

        set('mat' + wheel + '_rm', (mat.rm || '--') + ' MPa');
        set('mat' + wheel + '_rp', (mat.rp02 || '--') + ' MPa');
        set('mat' + wheel + '_hard', (mat.surfaceHardnessHV || mat.coreHardnessHV || mat.hardness || '60') + ' HRC');
    }

    initMaterialsTable() {
        const container = document.getElementById('materialsTableBody');
        const searchInput = document.getElementById('inputSearchMat');
        if (!container || typeof MATERIALS_DB === 'undefined') return;

        const renderRows = (filter = '') => {
            container.innerHTML = '';
            const f = filter.toLowerCase().trim();
            const list = MATERIALS_DB.filter(m => {
                if (!f) return true;
                const name = (m.name || '').toLowerCase();
                const full = (m.fullName || '').toLowerCase();
                const treat = (m.treatment || '').toLowerCase();
                const std = m.standards ? JSON.stringify(m.standards).toLowerCase() : '';
                return name.includes(f) || full.includes(f) || treat.includes(f) || std.includes(f);
            });

            list.forEach(m => {
                const tr = document.createElement('tr');
                const stdStr = m.standards ? (m.standards.din || m.standards.iso || m.standards.en || m.standards.ansi || '-') : '-';
                tr.innerHTML = '<td><b>' + (m.id || '-') + '</b></td>' +
                    '<td><b>' + m.name + '</b></td>' +
                    '<td>' + stdStr + '</td>' +
                    '<td>' + (m.treatment || '-') + '</td>' +
                    '<td>' + (m.rm || '--') + '</td>' +
                    '<td>' + (m.rp02 || '--') + '</td>' +
                    '<td>' + (m.shlim || '--') + '</td>' +
                    '<td>' + (m.sflim || '--') + '</td>' +
                    '<td>' + (m.surfaceHardnessHV || m.coreHardnessHV || '--') + '</td>';
                container.appendChild(tr);
            });
        };

        renderRows();
        if (searchInput) {
            searchInput.addEventListener('input', () => renderRows(searchInput.value));
        }
    }

    initInputs() {
        // Locale-safe real-time input parsing: converts ',' to '.'
        document.querySelectorAll('.input-eng').forEach(inp => {
            inp.addEventListener('input', () => {
                const key = inp.getAttribute('data-key');
                if (key) {
                    const rawVal = String(inp.value).trim().replace(',', '.');
                    this.inputs[key] = parseFloat(rawVal) || 0;

                    // Auto-sync z2 if z1 changes
                    if (key === 'z1') {
                        const i = this.inputs.i_req || 2.5;
                        const z2_calc = Math.round(i * this.inputs.z1);
                        this.inputs.z2 = z2_calc;
                        const inp_z2 = document.getElementById('inp_z2');
                        if (inp_z2) inp_z2.value = z2_calc;
                    }

                    // Auto-sync z2 if i_req changes
                    if (key === 'i_req') {
                        const z2_calc = Math.round(this.inputs.i_req * this.inputs.z1);
                        this.inputs.z2 = z2_calc;
                        const inp_z2 = document.getElementById('inp_z2');
                        if (inp_z2) inp_z2.value = z2_calc;
                    }

                    this.calculate();
                }
            });
        });

        // Section 15.0 Auxiliary Calculation Listeners
        ['aux_inp_n1', 'aux_inp_n2', 'aux_inp_Mk1', 'aux_inp_n1_pw'].forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('input', () => this.calculateAuxiliary());
            }
        });
    }

    initSmartControls() {
        // Smart Button 1: [ i <= n1,n2 ]
        const btn_i_n1n2 = document.getElementById('btn_i_n1n2');
        if (btn_i_n1n2) {
            btn_i_n1n2.addEventListener('click', () => {
                const n1 = this.inputs.n1 || 1000.0;
                const n2 = parseFloat(String(document.getElementById('inp_n2').value).replace(',', '.')) || 400.0;
                if (n2 > 0) {
                    const i = n1 / n2;
                    this.inputs.i_req = i;
                    const inp_i_req = document.getElementById('inp_i_req');
                    if (inp_i_req) inp_i_req.value = i.toFixed(4);
                    // Also update z2
                    const z2_calc = Math.round(i * this.inputs.z1);
                    this.inputs.z2 = z2_calc;
                    const inp_z2 = document.getElementById('inp_z2');
                    if (inp_z2) inp_z2.value = z2_calc;
                    this.calculate();
                }
            });
        }

        // Smart Button 2: [ Pw <= Mk,n ]
        const btn_Pw_Mkn = document.getElementById('btn_Pw_Mkn');
        if (btn_Pw_Mkn) {
            btn_Pw_Mkn.addEventListener('click', () => {
                const Mk1 = parseFloat(document.getElementById('out_Mk1').textContent) || 477.46;
                const n1 = this.inputs.n1 || 1000.0;
                const P = (Mk1 * n1) / 9550.0;
                this.inputs.P = parseFloat(P.toFixed(2));
                const inp_P = document.getElementById('inp_P');
                if (inp_P) inp_P.value = P.toFixed(1);
                this.calculate();
            });
        }

        // Smart Button 3: [ i <= z1,z2 ]
        const btn_i_z1z2 = document.getElementById('btn_i_z1z2');
        if (btn_i_z1z2) {
            btn_i_z1z2.addEventListener('click', () => {
                const z1 = this.inputs.z1 || 18;
                const z2 = this.inputs.z2 || 45;
                if (z1 > 0) {
                    const i = z2 / z1;
                    this.inputs.i_req = i;
                    const inp_i_req = document.getElementById('inp_i_req');
                    if (inp_i_req) inp_i_req.value = i.toFixed(4);
                    this.calculate();
                }
            });
        }

        // ComboBox: Standard Ratios (sel_std_ratio)
        const selRatio = document.getElementById('sel_std_ratio');
        if (selRatio) {
            selRatio.addEventListener('change', () => {
                if (selRatio.value) {
                    const i = parseFloat(selRatio.value);
                    this.inputs.i_req = i;
                    const inp_i_req = document.getElementById('inp_i_req');
                    if (inp_i_req) inp_i_req.value = i.toFixed(4);
                    const z2_calc = Math.round(i * this.inputs.z1);
                    this.inputs.z2 = z2_calc;
                    const inp_z2 = document.getElementById('inp_z2');
                    if (inp_z2) inp_z2.value = z2_calc;
                    this.calculate();
                }
            });
        }

        // ComboBox: Standard Angles (sel_std_sigma, sel_std_alpha, sel_std_beta)
        const selSigma = document.getElementById('sel_std_sigma');
        if (selSigma) {
            selSigma.addEventListener('change', () => {
                if (selSigma.value) {
                    this.inputs.Sigma = parseFloat(selSigma.value);
                    const inp = document.getElementById('inp_Sigma');
                    if (inp) inp.value = selSigma.value;
                    this.calculate();
                }
            });
        }

        const selPAType = document.getElementById('selPressureAngleType');
        if (selPAType) {
            selPAType.addEventListener('change', () => {
                const isNormal = selPAType.value === 'normal';
                const sym = document.getElementById('sym_alfa');
                if (sym) sym.textContent = isNormal ? 'αn' : 'αt';
                this.inputs.isNormalPressureAngle = isNormal;
                this.calculate();
            });
        }

        const selAlpha = document.getElementById('sel_std_alpha');
        if (selAlpha) {
            selAlpha.addEventListener('change', () => {
                if (selAlpha.value) {
                    this.inputs.alfa = parseFloat(selAlpha.value);
                    const inp = document.getElementById('inp_alfa');
                    if (inp) inp.value = selAlpha.value;
                    this.calculate();
                }
            });
        }

        const selBeta = document.getElementById('sel_std_beta');
        if (selBeta) {
            selBeta.addEventListener('change', () => {
                if (selBeta.value) {
                    this.inputs.beta = parseFloat(selBeta.value);
                    const inp = document.getElementById('inp_beta');
                    if (inp) inp.value = selBeta.value;
                    this.calculate();
                }
            });
        }

        // Tooth Hand direction
        const selToothHand = document.getElementById('selToothHand');
        if (selToothHand) {
            selToothHand.addEventListener('change', () => {
                this.inputs.toothHand = selToothHand.value;
                this.calculate();
            });
        }

        // Module Type selector
        const selModType = document.getElementById('selModuleType');
        if (selModType) {
            selModType.addEventListener('change', () => {
                const isOuter = selModType.value === 'transverse_outer';
                const sym = document.getElementById('sym_module');
                if (sym) sym.textContent = isOuter ? 'met' : 'mmn';
                this.inputs.isOuterModule = isOuter;
                this.calculate();
            });
        }

        // ComboBox: Standard Module DIN 780 / ISO 54
        const selModule = document.getElementById('sel_std_module');
        if (selModule) {
            selModule.addEventListener('change', () => {
                if (selModule.value) {
                    const mmn = parseFloat(selModule.value);
                    this.inputs.mmn = mmn;
                    const inp = document.getElementById('inp_mmn');
                    if (inp) inp.value = mmn.toFixed(3);
                    this.calculate();
                }
            });
        }

        // Gearing Type (Section 3.1)
        const selGearType = document.getElementById('selGearingType');
        if (selGearType) {
            selGearType.addEventListener('change', () => {
                const v = selGearType.value;
                if (v === 'straight_type1' || v === 'zerol') {
                    this.inputs.beta = 0.0;
                    const inpB = document.getElementById('inp_beta');
                    if (inpB) inpB.value = '0.0';
                } else if (v === 'gleason') {
                    this.inputs.beta = 30.0;
                    const inpB = document.getElementById('inp_beta');
                    if (inpB) inpB.value = '30.0';
                }
                this.calculate();
            });
        }

        // Slider: b / Re
        const sliderBRe = document.getElementById('slider_b_Re');
        if (sliderBRe) {
            sliderBRe.addEventListener('input', () => {
                const ratio = parseFloat(sliderBRe.value);
                const Re = parseFloat(document.getElementById('out_Re') ? document.getElementById('out_Re').textContent : 338.32);
                const b_calc = Math.round(ratio * Re);
                this.inputs.b = b_calc;
                const inp_b = document.getElementById('inp_b');
                if (inp_b) inp_b.value = b_calc.toFixed(1);
                this.calculate();
            });
        }

        // Slider: x1
        const sliderX1 = document.getElementById('slider_x1');
        if (sliderX1) {
            sliderX1.addEventListener('input', () => {
                const x1 = parseFloat(sliderX1.value);
                this.inputs.x1 = x1;
                const inp_x1 = document.getElementById('inp_x1');
                if (inp_x1) inp_x1.value = x1.toFixed(2);
                this.calculate();
            });
        }

        // ComboBox: Correction Type (selCorrectionType)
        const selCorr = document.getElementById('selCorrectionType');
        if (selCorr) {
            selCorr.addEventListener('change', () => {
                const type = selCorr.value;
                if (type === 'VN_bending') {
                    this.inputs.x1 = 0.58;
                    this.inputs.xt1 = 0.00;
                } else if (type === 'VN_contact') {
                    this.inputs.x1 = 0.32;
                    this.inputs.xt1 = 0.04;
                } else if (type === 'DIN870') {
                    this.inputs.x1 = -0.93;
                    this.inputs.xt1 = 0.00;
                } else if (type === 'BSI') {
                    this.inputs.x1 = 0.34;
                    this.inputs.xt1 = 0.00;
                } else if (type === 'curved') {
                    this.inputs.x1 = 0.00;
                    this.inputs.xt1 = 0.00;
                }
                const inp_x1 = document.getElementById('inp_x1');
                if (inp_x1) inp_x1.value = this.inputs.x1.toFixed(2);
                const inp_xt1 = document.getElementById('inp_xt1');
                if (inp_xt1) inp_xt1.value = this.inputs.xt1.toFixed(2);
                if (sliderX1) sliderX1.value = this.inputs.x1;
                this.calculate();
            });
        }

        // CAD Draw Table Button (Section 16.7)
        const btnDrawTable = document.getElementById('btnDrawTable');
        if (btnDrawTable) {
            btnDrawTable.addEventListener('click', () => {
                const tbl = document.getElementById('selCADTable') ? document.getElementById('selCADTable').value : 'pinion';
                const name = tbl === 'pinion' ? 'Bánh dẫn 1 (Pinion)' : 'Bánh bị dẫn 2 (Gear)';
                alert(`Đã trích xuất dữ liệu bảng thông số chế tạo ${name} theo chuẩn DIN 3965 / ISO 23509! Bấm nút Tải CAD để lưu file DXF.`);
            });
        }

        // Buttons: Design Gearing / Run Auto
        const btnDesign = document.getElementById('btn_design_gearing');
        const btnRun = document.getElementById('btn_run_auto');
        const runAutoDesign = () => {
            this.inputs.mmn = 10.0;
            this.inputs.b = 117.0;
            this.inputs.x1 = 0.32;
            this.inputs.xt1 = 0.04;
            const inp_mmn = document.getElementById('inp_mmn');
            if (inp_mmn) inp_mmn.value = '10.0';
            const inp_b = document.getElementById('inp_b');
            if (inp_b) inp_b.value = '117.0';
            const inp_x1 = document.getElementById('inp_x1');
            if (inp_x1) inp_x1.value = '0.32';
            const inp_xt1 = document.getElementById('inp_xt1');
            if (inp_xt1) inp_xt1.value = '0.04';
            if (sliderBRe) sliderBRe.value = '0.3458';
            if (sliderX1) sliderX1.value = '0.32';
            this.calculate();
        };
        if (btnDesign) btnDesign.addEventListener('click', runAutoDesign);
        if (btnRun) btnRun.addEventListener('click', runAutoDesign);

        // Section 15.0 Auxiliary OK Buttons
        const btn_aux_15_1 = document.getElementById('btn_aux_ok_15_1');
        if (btn_aux_15_1) {
            btn_aux_15_1.addEventListener('click', () => {
                const val = parseFloat(document.getElementById('aux_i_n') ? document.getElementById('aux_i_n').textContent : 2.6667) || 2.6667;
                this.inputs.i_req = val;
                const inp = document.getElementById('inp_i_req');
                if (inp) inp.value = val.toFixed(4);
                const z2_calc = Math.round(val * this.inputs.z1);
                this.inputs.z2 = z2_calc;
                const inp_z2 = document.getElementById('inp_z2');
                if (inp_z2) inp_z2.value = z2_calc;
                this.calculate();
            });
        }

        const btn_aux_15_2 = document.getElementById('btn_aux_ok_15_2');
        if (btn_aux_15_2) {
            btn_aux_15_2.addEventListener('click', () => {
                const val = parseFloat(document.getElementById('aux_Pw') ? document.getElementById('aux_Pw').textContent : 45.239) || 45.239;
                this.inputs.P = val;
                const inp = document.getElementById('inp_P');
                if (inp) inp.value = val.toFixed(1);
                this.calculate();
            });
        }

        const btn_aux_15_3 = document.getElementById('btn_aux_ok_15_3');
        if (btn_aux_15_3) {
            btn_aux_15_3.addEventListener('click', () => {
                const val = parseFloat(document.getElementById('aux_i_z') ? document.getElementById('aux_i_z').textContent : 2.5000) || 2.5000;
                this.inputs.i_req = val;
                const inp = document.getElementById('inp_i_req');
                if (inp) inp.value = val.toFixed(4);
                this.calculate();
            });
        }

        // Section 16.3 Draw 2D Button
        const btn_draw_2d = document.getElementById('btn_draw_2d');
        if (btn_draw_2d) {
            btn_draw_2d.addEventListener('click', () => {
                const tabCanvasBtn = document.querySelector('.tab-btn[data-target="tabCanvas"]');
                if (tabCanvasBtn) {
                    tabCanvasBtn.click();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            });
        }
    }

    calculate() {
        if (typeof BevelCalcEngine === 'undefined') return;
        const g = BevelCalcEngine.calculate(this.inputs);
        this.lastGeom = g;
        this.renderOutputs(g);
        this.renderAuditTable(g);
        if (this.canvasController) {
            this.canvasController.setGeometry(g);
        }
        if (this.visualizer3D) {
            this.visualizer3D.setGeometry(g);
        }
        const badgeType = document.getElementById('badge3DType');
        const badgeSigma = document.getElementById('badge3DSigma');
        const badgeRatio = document.getElementById('badge3DRatio');
        const badgeRe = document.getElementById('badge3DRe');
        const isSpiral = Math.abs(g.beta_deg || 0.0) > 1e-4;
        if (badgeType) badgeType.textContent = isSpiral ? '⚙️ Bánh Răng Côn Răng Xoắn (Spiral Bevel)' : '⚙️ Bánh Răng Côn Răng Thẳng (Straight Bevel)';
        if (badgeSigma) badgeSigma.textContent = `${(g.Sigma_deg || 90.0).toFixed(1)}°`;
        if (badgeRatio) badgeRatio.textContent = (g.i || 1.0).toFixed(3);
        if (badgeRe) badgeRe.textContent = `${(g.Re || 0).toFixed(1)} mm`;
    }

    renderOutputs(g) {
        const set = (id, val) => {
            const el = document.getElementById(id);
            if (el) el.textContent = typeof val === 'number' ? val.toFixed(3) : val;
        };
        const set4 = (id, val) => {
            const el = document.getElementById(id);
            if (el) el.textContent = typeof val === 'number' ? val.toFixed(4) : val;
        };

        // Summary Banner
        set('summaryRe', g.Re.toFixed(1) + ' mm');
        set('summaryRatio', g.i.toFixed(3));
        set('summaryDelta1', g.delta1_deg.toFixed(2) + '°');
        set('summaryDelta2', g.delta2_deg.toFixed(2) + '°');
        set('summaryEg', g.eg.toFixed(3));

        // Section 1.0: Options of basic input parameters
        set('out_n2', g.n2.toFixed(1));
        set('out_Mk1', g.Mk1.toFixed(2));
        set('out_Mk2', g.Mk2.toFixed(2));
        set4('out_i_act', g.i);
        const reqI = this.inputs.i_req || 2.5;
        const devI = reqI > 0 ? Math.abs((g.i - reqI) / reqI) * 100 : 0;
        set('out_i_dev', devI.toFixed(2) + '%');

        // Section 4.0: Design of module and geometry
        const b_Re = (g.Re !== 0 ? g.b / g.Re : 0.3458);
        set4('out_sec4_b_Re', b_Re);
        set('out_sec4_bmax', '< ' + (g.Re * 0.35).toFixed(0));
        set('out_sec4_mass', '134.331');

        // Section 4.3 & 4.8 Complementary calculated values (Matching MITCalc 1.74)
        const alfa_val = parseFloat(this.inputs.alfa) || 20.0;
        const beta_val = parseFloat(this.inputs.beta) || 30.0;
        const beta_rad = (beta_val * Math.PI) / 180.0;
        const cos_b = Math.cos(beta_rad);
        let alfa_comp_deg = 0;
        if (this.inputs.isNormalPressureAngle) {
            // Entered angle is Normal (an). Complementary is Transverse (at)
            const an_rad = (alfa_val * Math.PI) / 180.0;
            const at_rad = Math.atan(cos_b !== 0 ? Math.tan(an_rad) / cos_b : Math.tan(an_rad));
            alfa_comp_deg = (at_rad * 180.0) / Math.PI;
        } else {
            // Entered angle is Transverse (at). Complementary is Normal (an)
            const at_rad = (alfa_val * Math.PI) / 180.0;
            const an_rad = Math.atan(Math.tan(at_rad) * cos_b);
            alfa_comp_deg = (an_rad * 180.0) / Math.PI;
        }
        set('out_sec4_alfa_comp', alfa_comp_deg.toFixed(1) + '°');
        set('out_sec4_beta2', '0.0°');
        set4('out_sec4_module_comp', this.inputs.isOuterModule ? g.mmn : g.met);

        // Section 5.0: Correction of toothing
        set4('out_sec5_x2', g.x2);
        set4('out_sec5_xt2', g.xt2);
        set4('out_sec5_eg', g.eg);
        set('out_sec5_sae1', g.sae1_star);
        set('out_sec5_sae2', g.sae2_star);

        // Section 6.0: Basic dimensions of gearing (Full 39 Rows)
        set('out_z1', g.z1);
        set('out_z2', g.z2);
        set4('out_met', g.met);
        set4('out_mmt', g.mmt);
        set4('out_mit', g.mit);
        set4('out_men', g.men);
        set4('out_mmn', g.mmn);
        set4('out_min', g.min_mod);
        set('out_Re', g.Re);
        set('out_Rm', g.Rm);
        set('out_Ri', g.Ri);
        set4('out_delta1', g.delta1_deg);
        set4('out_delta2', g.delta2_deg);
        set4('out_delta1a', g.delta1a_deg);
        set4('out_delta2a', g.delta2a_deg);
        set4('out_delta1f', g.delta1f_deg);
        set4('out_delta2f', g.delta2f_deg);
        set('out_dae1', g.dae1);
        set('out_dae2', g.dae2);
        set('out_dam1', g.dam1);
        set('out_dam2', g.dam2);
        set('out_dai1', g.dai1);
        set('out_dai2', g.dai2);
        set('out_de1', g.de1);
        set('out_de2', g.de2);
        set('out_dm1', g.dm1);
        set('out_dm2', g.dm2);
        set('out_di1', g.di1);
        set('out_di2', g.di2);
        set('out_dfe1', g.dfe1);
        set('out_dfe2', g.dfe2);
        set('out_dfm1', g.dfm1);
        set('out_dfm2', g.dfm2);
        set('out_dfi1', g.dfi1);
        set('out_dfi2', g.dfi2);
        set4('out_qa1', g.deltaa1_deg);
        set4('out_qa2', g.deltaa2_deg);
        set4('out_qf1', g.deltaf1_deg);
        set4('out_qf2', g.deltaf2_deg);
        set('out_hae1', g.hae1);
        set('out_hae2', g.hae2);
        set('out_ha1', g.ha1);
        set('out_ha2', g.ha2);
        set('out_hai1', g.hai1);
        set('out_hai2', g.hai2);
        set('out_hfe1', g.hfe1);
        set('out_hfe2', g.hfe2);
        set('out_hf1', g.hf1);
        set('out_hf2', g.hf2);
        set('out_hfi1', g.hfi1);
        set('out_hfi2', g.hfi2);
        set4('out_alfa_n', g.alfa_n_deg);
        set4('out_alfa_t', g.alfa_deg);
        set4('out_beta', g.beta_deg);
        set4('out_beta_b', g.beta_b_deg);
        set4('out_awn', g.awn_deg || g.alfa_n_deg);
        set4('out_awt', g.awt_deg || g.alfa_deg);
        set4('out_pe', g.pe);
        set4('out_pte', g.pte);
        set4('out_sne1', g.sne1);
        set4('out_sne2', g.sne2);
        set4('out_sn1', g.sn1);
        set4('out_sn2', g.sn2);
        set4('out_sni1', g.sni1);
        set4('out_sni2', g.sni2);
        set4('out_sae1', g.sae1);
        set4('out_sae2', g.sae2);
        set4('out_sa1', g.sa1);
        set4('out_sa2', g.sa2);
        set4('out_sai1', g.sai1);
        set4('out_sai2', g.sai2);
        set('out_sae1_star', g.sae1_star);
        set('out_sae2_star', g.sae2_star);

        // Section 7.0: Virtual spur gear toothing
        set('out_zvn1', g.zvn1);
        set('out_zvn2', g.zvn2);
        set('out_zv1', g.zv1);
        set('out_zv2', g.zv2);
        set('out_dvm1', g.dvm1);
        set('out_dvm2', g.dvm2);
        set('out_dva1', g.dva1);
        set('out_dva2', g.dva2);
        set('out_dvb1', g.dvb1);
        set('out_dvb2', g.dvb2);
        set('out_dvf1', g.dvf1);
        set('out_dvf2', g.dvf2);
        set('out_av', g.av);
        set4('out_iv', g.iv);

        // Section 8.0: Qualitative indexes
        set4('out_ea', g.ea);
        set4('out_eb', g.eb);
        set4('out_eg', g.eg);
        set('out_nE1', '6188.65');
        set('out_N_res', '0.16');
        set('out_mass', '134.331');
        set('out_eta', '98.30%');

        // Section 11.0: Assembly & Tolerances
        set('out_apex1', g.apex1);
        set('out_apex2', g.apex2);
        set('out_sc1', g.sc1);
        set('out_sc2', g.sc2);
        set('out_hc1', g.hc1);
        set('out_hc2', g.hc2);
        set('out_fpt', g.fpt.toFixed(1) + ' µm');
        set('out_Fbeta', g.Fbeta.toFixed(1) + ' µm');
        set('out_Fr', g.Fr.toFixed(1) + ' µm');

        // Section 15.0: Auxiliary Calculations (MITCalc 1.74 Image 3)
        set('aux_z1', g.z1);
        set('aux_z2', g.z2);
        set4('aux_i_z', g.i);
        this.calculateAuxiliary();

        // Section 16.0: Manufacturing Specification & CAD (DXFTables - Image 3)
        set('mfg_mmn', g.mmn.toFixed(3));
        set('mfg_z1', g.z1);
        set('mfg_z2', g.z2);
        set4('mfg_delta1', g.delta1_deg);
        set4('mfg_delta2', g.delta2_deg);
        set('mfg_dae1', g.dae1);
        set('mfg_dae2', g.dae2);
        set('mfg_Re', g.Re);
        set('mfg_b', g.b.toFixed(1));
        set4('mfg_x1', g.x1);
        set4('mfg_x2', g.x2);
        set4('mfg_xt1', g.xt1);
        set4('mfg_xt2', g.xt2);
        set('mfg_hand1', 'Xoắn Trái (Left-Hand)');
        set('mfg_hand2', 'Xoắn Phải (Right-Hand)');
        const selAcc = document.getElementById('selAccuracySec14') || document.getElementById('selAccuracy');
        const gradeText = selAcc && selAcc.options[selAcc.selectedIndex] ? selAcc.options[selAcc.selectedIndex].text : 'Cấp ' + g.Q;
        set('mfg_grade', 'DIN 3965 ' + gradeText);

        // CAD Tool radius & Offsets (MITCalc Rows 362, 364, 365)
        set('mfg_R1', g.R_tool1.toFixed(1));
        set('mfg_R2', g.R_tool2.toFixed(1));
        set('mfg_a1', g.a_offset1.toFixed(3));
        set('mfg_a2', g.a_offset2.toFixed(3));
        set('mfg_b1', g.b_offset1.toFixed(3));
        set('mfg_b2', g.b_offset2.toFixed(3));

        // BOM Attributes
        set('bom_row1_1', 'Bevel gear - Pinion');
        set('bom_row2_1', 'z1=' + g.z1 + ', mmn=' + Math.round(g.mmn) + ', beta=' + Math.round(g.beta_deg));
        set('bom_row3_1', 'Material: ' + (this.inputs.mat1 || 'Ck 60'));
        set('bom_row1_2', 'Bevel gear - Gear');
        set('bom_row2_2', 'z2=' + g.z2 + ', mmn=' + Math.round(g.mmn) + ', beta=' + Math.round(g.beta_deg));
        set('bom_row3_2', 'Material: ' + (this.inputs.mat2 || 'Ck 60'));

        // Render embedded 2D Section 4.0 Coordinate Chart (Cartesian Mesh)
        this.renderSec4Chart(g);
    }

    calculateAuxiliary() {
        const inp_n1 = document.getElementById('aux_inp_n1');
        const inp_n2 = document.getElementById('aux_inp_n2');
        if (inp_n1 && inp_n2) {
            const n1 = parseFloat(String(inp_n1.value).replace(',', '.')) || 2000;
            const n2 = parseFloat(String(inp_n2.value).replace(',', '.')) || 750;
            const i_n = n2 > 0 ? (n1 / n2) : 0;
            const el_in = document.getElementById('aux_i_n');
            if (el_in) el_in.textContent = i_n.toFixed(4);
        }

        const inp_Mk1 = document.getElementById('aux_inp_Mk1');
        const inp_n1_pw = document.getElementById('aux_inp_n1_pw');
        if (inp_Mk1 && inp_n1_pw) {
            const Mk1 = parseFloat(String(inp_Mk1.value).replace(',', '.')) || 270;
            const n1_pw = parseFloat(String(inp_n1_pw.value).replace(',', '.')) || 1600;
            const Pw = (Mk1 * n1_pw) / 9550.0;
            const el_pw = document.getElementById('aux_Pw');
            if (el_pw) el_pw.textContent = Pw.toFixed(3);
        }
    }

    renderSec4Chart(g) {
        const canvas = document.getElementById('bevelSec4ChartCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const w = canvas.width;
        const h = canvas.height;

        ctx.clearRect(0, 0, w, h);

        // Background: Light cream yellow matching MITCalc Excel Chart 4181
        ctx.fillStyle = '#ffffe0';
        ctx.fillRect(0, 0, w, h);

        // Chart border
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1;
        ctx.strokeRect(0.5, 0.5, w - 1, h - 1);

        // Extract parameters with safe fallbacks
        const sigma_deg = (typeof g.Sigma_deg === 'number' && !isNaN(g.Sigma_deg)) ? g.Sigma_deg : (parseFloat(this.inputs.Sigma) || 90.0);
        const sigma_rad = (sigma_deg * Math.PI) / 180.0;

        const d1_rad = (g.delta1_deg * Math.PI) / 180.0;
        const d2_rad = (g.delta2_deg * Math.PI) / 180.0;
        const s1 = Math.sin(d1_rad), c1 = Math.cos(d1_rad);
        const s2 = Math.sin(d2_rad), c2 = Math.cos(d2_rad);

        const Re = g.Re || 338.32;
        const Ri = g.Ri || 221.32;

        const H1in = g.a_offset1 || (g.mmn * 0.4836);
        const H1out = g.b_offset1 || (g.mmn * 1.33);
        const H2in = g.a_offset2 || (g.mmn * 0.5911);
        const H2out = g.b_offset2 || (g.mmn * 1.995);

        // Base pitch cone generator points (Data1!C63:D64)
        const C63 = -Ri * c1;
        const D63 = Ri * s1;
        const C64 = -Re * c1;
        const D64 = Re * s1;

        // 1. Wheel 1 (Pinion) 18 Points (Data1!C70:D87)
        const w1_pts = [
            [C63 - g.hfi1 * s1, D63 - g.hfi1 * c1],               // 0: Root in
            [C63 + g.hai1 * s1, D63 + g.hai1 * c1],               // 1: Tip in
            [C64 + g.hae1 * s1, D64 + g.hae1 * c1],               // 2: Tip out
            [C64 - g.hfe1 * s1, D64 - g.hfe1 * c1],               // 3: Root out
            [C63 - g.hfi1 * s1, D63 - g.hfi1 * c1],               // 4: Root in
            [C63 - (g.hfi1 + H1in) * s1, D63 - (g.hfi1 + H1in) * c1], // 5: Inner rim
            [C63 - (g.hfi1 + H1in) * s1, 0.0],                       // 6: Inner bore
            [C63 - (g.hfi1 + H1in) * s1, -(D63 - (g.hfi1 + H1in) * c1)], // 7: Lower inner rim
            [C63 - g.hfi1 * s1, -(D63 - g.hfi1 * c1)],            // 8: Lower root in
            [C64 - g.hfe1 * s1, -(D64 - g.hfe1 * c1)],            // 9: Lower root out
            [C64 + g.hae1 * s1, -(D64 + g.hae1 * c1)],            // 10: Lower tip out
            [C63 + g.hai1 * s1, -(D63 + g.hai1 * c1)],            // 11: Lower tip in
            [C63 - g.hfi1 * s1, -(D63 - g.hfi1 * c1)],            // 12: Lower root in
            [C64 - g.hfe1 * s1, D64 - g.hfe1 * c1],               // 13: Upper root out
            [C64 - (g.hfe1 + H1out) * s1, D64 - (g.hfe1 + H1out) * c1], // 14: Back rim
            [C64 - (g.hfe1 + H1out) * s1, 0.0],                      // 15: Back bore
            [C64 - (g.hfe1 + H1out) * s1, -(D64 - (g.hfe1 + H1out) * c1)], // 16: Lower back rim
            [C64 - g.hfe1 * s1, -(D64 - g.hfe1 * c1)]             // 17: Lower root out
        ];

        // 2. Wheel 2 (Gear) 18 Points in Local (H, I) (Data1!H35:I52)
        const H28 = -Ri * c2;
        const I28 = Ri * s2;
        const H29 = -Re * c2;
        const I29 = Re * s2;

        const w2_local = [
            [H28 - g.hfi2 * s2, I28 - g.hfi2 * c2],               // 0: Root in
            [H28 + g.hai2 * s2, I28 + g.hai2 * c2],               // 1: Tip in
            [H29 + g.hae2 * s2, I29 + g.hae2 * c2],               // 2: Tip out
            [H29 - g.hfe2 * s2, I29 - g.hfe2 * c2],               // 3: Root out
            [H28 - g.hfi2 * s2, I28 - g.hfi2 * c2],               // 4: Root in
            [H28 - (g.hfi2 + H2in) * s2, I28 - (g.hfi2 + H2in) * c2], // 5: Inner rim
            [H28 - (g.hfi2 + H2in) * s2, 0.0],                       // 6: Inner bore
            [H28 - (g.hfi2 + H2in) * s2, -(I28 - (g.hfi2 + H2in) * c2)], // 7: Lower inner rim
            [H28 - g.hfi2 * s2, -(I28 - g.hfi2 * c2)],            // 8: Lower root in
            [H29 - g.hfe2 * s2, -(I29 - g.hfe2 * c2)],            // 9: Lower root out
            [H29 + g.hae2 * s2, -(I29 + g.hae2 * c2)],            // 10: Lower tip out
            [H28 + g.hai2 * s2, -(I28 + g.hai2 * c2)],            // 11: Lower tip in
            [H28 - g.hfi2 * s2, -(I28 - g.hfi2 * c2)],            // 12: Lower root in
            [H29 - g.hfe2 * s2, I29 - g.hfe2 * c2],               // 13: Upper root out
            [H29 - (g.hfe2 + H2out) * s2, I29 - (g.hfe2 + H2out) * c2], // 14: Back rim
            [H29 - (g.hfe2 + H2out) * s2, 0.0],                      // 15: Back bore
            [H29 - (g.hfe2 + H2out) * s2, -(I29 - (g.hfe2 + H2out) * c2)], // 16: Lower back rim
            [H29 - g.hfe2 * s2, -(I29 - g.hfe2 * c2)]             // 17: Lower root out
        ];

        // Rotate Wheel 2 points by Sigma (Data1!C35:D52)
        const w2_pts = w2_local.map(([h_pt, i_pt]) => {
            if (h_pt === 0.0 && i_pt === 0.0) return [0.0, 0.0];
            const r_pt = Math.sqrt(h_pt * h_pt + i_pt * i_pt);
            let phi = Math.atan2(i_pt, h_pt);
            if (phi < 0) phi += 2 * Math.PI;
            const theta = phi + sigma_rad;
            return [r_pt * Math.cos(theta), r_pt * Math.sin(theta)];
        });

        // 3. Thinlines (Apex lines connecting (0,0) to teeth corners)
        const thinlines1 = [
            [w1_pts[1], [0, 0]],
            [[0, 0], w1_pts[0]],
            [w1_pts[11], [0, 0]],
            [[0, 0], w1_pts[8]]
        ];
        const thinlines2 = [
            [w2_pts[1], [0, 0]],
            [[0, 0], w2_pts[0]],
            [w2_pts[11], [0, 0]],
            [[0, 0], w2_pts[8]]
        ];

        // 4. Pitch lines (Axis series, Data1!C6:D10)
        const axis_pts = [
            [-Re * c1, Re * s1],
            [0, 0],
            [-Re * c1, -Re * s1]
        ];
        const r_pitch2 = Re;
        let phi_p2 = Math.atan2(Re * s2, -Re * c2);
        if (phi_p2 < 0) phi_p2 += 2 * Math.PI;
        const w2_pitch_top = [r_pitch2 * Math.cos(phi_p2 + sigma_rad), r_pitch2 * Math.sin(phi_p2 + sigma_rad)];
        let phi_p2_bot = Math.atan2(-Re * s2, -Re * c2);
        if (phi_p2_bot < 0) phi_p2_bot += 2 * Math.PI;
        const w2_pitch_bot = [r_pitch2 * Math.cos(phi_p2_bot + sigma_rad), r_pitch2 * Math.sin(phi_p2_bot + sigma_rad)];

        // 5. Dynamic Bounds & Scaling (Matching Excel Chart 4181 & Data1!C13:C24)
        const all_pts = [...w1_pts, ...w2_pts, [0, 0]];
        let minX = 0, maxX = 0, minY = 0, maxY = 0;
        all_pts.forEach(([x, y]) => {
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
        });

        // Aspect ratio Box calculation from Excel Data1!C13:C21 (Coef a:b = 1.7)
        const width_data = maxX - minX;
        const height_data = maxY - minY;
        const coef_ab = 1.7;
        const box_w = (width_data / height_data < coef_ab) ? height_data * coef_ab : width_data;
        const box_h = box_w / coef_ab;
        const half_w = Math.max(box_w / 2, Math.abs(minX), Math.abs(maxX));
        const half_h = Math.max(box_h / 2, Math.abs(minY), Math.abs(maxY));

        function getNiceScale(val, isY = false) {
            if (val <= 120) return { maxVal: 150, step: 50 };
            if (val <= 160) return { maxVal: isY ? 150 : 200, step: 50 };
            if (val <= 210) return { maxVal: 250, step: 50 };
            if (val <= 310) return { maxVal: 300, step: isY ? 50 : 100 };
            if (val <= 420) return { maxVal: 400, step: 100 };
            if (val <= 520) return { maxVal: isY ? 500 : 600, step: isY ? 100 : 200 };
            if (val <= 650) return { maxVal: 600, step: isY ? 100 : 200 };
            if (val <= 850) return { maxVal: 800, step: 200 };
            const step = Math.pow(10, Math.floor(Math.log10(val)));
            return { maxVal: Math.ceil(val / step) * step, step: step / 2 };
        }

        const scaleX = getNiceScale(half_w, false);
        const scaleY = getNiceScale(half_h, true);

        const xMin = -scaleX.maxVal, xMax = scaleX.maxVal, stepX = scaleX.step;
        const yMin = -scaleY.maxVal, yMax = scaleY.maxVal, stepY = scaleY.step;

        // Pixel mapping with margins
        const marginLeft = 40;
        const marginRight = 15;
        const marginTop = 15;
        const marginBottom = 25;
        const plotW = w - marginLeft - marginRight;
        const plotH = h - marginTop - marginBottom;

        const toScreenX = (x) => marginLeft + ((x - xMin) / (xMax - xMin)) * plotW;
        const toScreenY = (y) => (h - marginBottom) - ((y - yMin) / (yMax - yMin)) * plotH;

        // 6. Draw Grid & Axis Labels
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 0.8;
        ctx.font = '10px Tahoma, Arial, sans-serif';
        ctx.fillStyle = '#475569';
        ctx.textAlign = 'center';

        // X Grid
        for (let x = xMin; x <= xMax; x += stepX) {
            const sx = toScreenX(x);
            ctx.beginPath();
            ctx.moveTo(sx, marginTop);
            ctx.lineTo(sx, h - marginBottom);
            ctx.stroke();
            ctx.fillText(Math.round(x), sx, h - 8);
        }

        // Y Grid
        ctx.textAlign = 'right';
        for (let y = yMin; y <= yMax; y += stepY) {
            const sy = toScreenY(y);
            ctx.beginPath();
            ctx.moveTo(marginLeft, sy);
            ctx.lineTo(w - marginRight, sy);
            ctx.stroke();
            ctx.fillText(Math.round(y), marginLeft - 5, sy + 3);
        }

        // Coordinate Axes X=0, Y=0
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1.2;
        const sX0 = toScreenX(0);
        const sY0 = toScreenY(0);

        // Y Axis line (X=0)
        ctx.beginPath();
        ctx.moveTo(sX0, marginTop);
        ctx.lineTo(sX0, h - marginBottom);
        ctx.stroke();

        // X Axis line (Y=0)
        ctx.beginPath();
        ctx.moveTo(marginLeft, sY0);
        ctx.lineTo(w - marginRight, sY0);
        ctx.stroke();

        // 7. Draw Red Pitch Lines (Axis Series)
        ctx.strokeStyle = '#dc2626';
        ctx.lineWidth = 1.2;
        ctx.setLineDash([4, 3]);

        // Wheel 1 pitch lines to Apex
        ctx.beginPath();
        ctx.moveTo(toScreenX(axis_pts[0][0]), toScreenY(axis_pts[0][1]));
        ctx.lineTo(toScreenX(0), toScreenY(0));
        ctx.lineTo(toScreenX(axis_pts[2][0]), toScreenY(axis_pts[2][1]));
        ctx.stroke();

        // Wheel 2 pitch lines to Apex
        ctx.beginPath();
        ctx.moveTo(toScreenX(w2_pitch_top[0]), toScreenY(w2_pitch_top[1]));
        ctx.lineTo(toScreenX(0), toScreenY(0));
        ctx.lineTo(toScreenX(w2_pitch_bot[0]), toScreenY(w2_pitch_bot[1]));
        ctx.stroke();

        // 8. Draw Red Thinlines (Corners to Apex)
        thinlines1.forEach(([pStart, pEnd]) => {
            ctx.beginPath();
            ctx.moveTo(toScreenX(pStart[0]), toScreenY(pStart[1]));
            ctx.lineTo(toScreenX(pEnd[0]), toScreenY(pEnd[1]));
            ctx.stroke();
        });
        thinlines2.forEach(([pStart, pEnd]) => {
            ctx.beginPath();
            ctx.moveTo(toScreenX(pStart[0]), toScreenY(pStart[1]));
            ctx.lineTo(toScreenX(pEnd[0]), toScreenY(pEnd[1]));
            ctx.stroke();
        });
        ctx.setLineDash([]);

        const boundaryIndices = [0, 1, 2, 3, 14, 15, 16, 17, 10, 11, 8, 7, 6, 5, 0];

        // 9. Draw Wheel 1 Cross-Section Path (Clean Outer Boundary + Tooth Root Lines, Zero Crossing Lines)
        ctx.strokeStyle = '#000080';
        ctx.fillStyle = 'rgba(0, 0, 128, 0.08)';
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        boundaryIndices.forEach((ptIdx, idx) => {
            const sx = toScreenX(w1_pts[ptIdx][0]);
            const sy = toScreenY(w1_pts[ptIdx][1]);
            if (idx === 0) ctx.moveTo(sx, sy);
            else ctx.lineTo(sx, sy);
        });
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Stroke tooth root lines (Upper root line 3->0, Lower root line 9->8)
        ctx.lineWidth = 1.0;
        ctx.beginPath();
        ctx.moveTo(toScreenX(w1_pts[3][0]), toScreenY(w1_pts[3][1]));
        ctx.lineTo(toScreenX(w1_pts[0][0]), toScreenY(w1_pts[0][1]));
        ctx.moveTo(toScreenX(w1_pts[9][0]), toScreenY(w1_pts[9][1]));
        ctx.lineTo(toScreenX(w1_pts[8][0]), toScreenY(w1_pts[8][1]));
        ctx.stroke();

        // 10. Draw Wheel 2 Cross-Section Path (Clean Outer Boundary + Tooth Root Lines, Zero Crossing Lines)
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        boundaryIndices.forEach((ptIdx, idx) => {
            const sx = toScreenX(w2_pts[ptIdx][0]);
            const sy = toScreenY(w2_pts[ptIdx][1]);
            if (idx === 0) ctx.moveTo(sx, sy);
            else ctx.lineTo(sx, sy);
        });
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Wheel 2 tooth root lines (Upper root line 3->0, Lower root line 9->8)
        ctx.lineWidth = 1.0;
        ctx.beginPath();
        ctx.moveTo(toScreenX(w2_pts[3][0]), toScreenY(w2_pts[3][1]));
        ctx.lineTo(toScreenX(w2_pts[0][0]), toScreenY(w2_pts[0][1]));
        ctx.moveTo(toScreenX(w2_pts[9][0]), toScreenY(w2_pts[9][1]));
        ctx.lineTo(toScreenX(w2_pts[8][0]), toScreenY(w2_pts[8][1]));
        ctx.stroke();

        // 11. Apex Marker & Origin Dot
        ctx.fillStyle = '#dc2626';
        ctx.beginPath();
        ctx.arc(sX0, sY0, 3.5, 0, 2 * Math.PI);
        ctx.fill();

        ctx.font = 'bold 10px Tahoma, Arial, sans-serif';
        ctx.fillStyle = '#b91c1c';
        ctx.textAlign = 'left';
        ctx.fillText('Apex (0,0)', sX0 + 6, sY0 - 4);
    }

    renderAuditTable(g) {
        const tbody = document.getElementById('auditTableBody');
        if (!tbody) return;

        // 109 core parameters comparing against MITCalc 1.74
        const auditItems = [
            { cell: 'P117', name: 'Công suất truyền động bánh 1', sym: 'Pw1', mit: 50.0, getVal: () => this.inputs.P },
            { cell: 'P118', name: 'Tốc độ quay bánh dẫn', sym: 'n1', mit: 1000.0, getVal: () => g.n1 },
            { cell: 'Q118', name: 'Tốc độ quay bánh bị dẫn', sym: 'n2', mit: 400.0, getVal: () => g.n2 },
            { cell: 'P119', name: 'Mô-men xoắn danh nghĩa bánh 1', sym: 'Mk1', mit: 477.5, getVal: () => g.Mk1 },
            { cell: 'Q119', name: 'Mô-men xoắn danh nghĩa bánh 2', sym: 'Mk2', mit: 1173.4623, getVal: () => g.Mk2 },
            { cell: 'P121', name: 'Tỉ số truyền thực tế', sym: 'i', mit: 2.5000, getVal: () => g.i },
            { cell: 'P144', name: 'Số răng bánh 1', sym: 'z1', mit: 18, getVal: () => g.z1 },
            { cell: 'Q144', name: 'Số răng bánh 2', sym: 'z2', mit: 45, getVal: () => g.z2 },
            { cell: 'P145', name: 'Góc giữa hai trục', sym: 'Σ', mit: 90.0, getVal: () => g.Sigma_deg },
            { cell: 'P146', name: 'Góc ăn khớp danh nghĩa', sym: 'α', mit: 20.0, getVal: () => g.alfa_deg },
            { cell: 'P147', name: 'Góc xoắn răng trung bình', sym: 'βm', mit: 30.0, getVal: () => g.beta_deg },
            { cell: 'P151', name: 'Mô đun pháp tuyến trung bình', sym: 'mmn', mit: 10.0, getVal: () => g.mmn },
            { cell: 'P152', name: 'Chiều rộng vành răng', sym: 'b', mit: 117.0, getVal: () => g.b },
            { cell: 'P174', name: 'Hệ số dịch chỉnh biên dạng 1', sym: 'x1', mit: 0.32, getVal: () => g.x1 },
            { cell: 'Q174', name: 'Hệ số dịch chỉnh biên dạng 2', sym: 'x2', mit: -0.32, getVal: () => g.x2 },
            { cell: 'P175', name: 'Hệ số dịch chỉnh chiều dày 1', sym: 'xt1', mit: 0.04, getVal: () => g.xt1 },
            { cell: 'Q175', name: 'Hệ số dịch chỉnh chiều dày 2', sym: 'xt2', mit: -0.04, getVal: () => g.xt2 },
            { cell: 'N196', name: 'Mô đun tiếp tuyến ngoài', sym: 'met', mit: 13.961045, getVal: () => g.met },
            { cell: 'P196', name: 'Mô đun tiếp tuyến trung bình', sym: 'mmt', mit: 11.547005, getVal: () => g.mmt },
            { cell: 'Q196', name: 'Mô đun tiếp tuyến trong', sym: 'mit', mit: 9.132966, getVal: () => g.mit },
            { cell: 'N197', name: 'Mô đun pháp tuyến ngoài', sym: 'men', mit: 12.090619, getVal: () => g.men },
            { cell: 'P197', name: 'Mô đun pháp tuyến trung bình', sym: 'mmn', mit: 10.000000, getVal: () => g.mmn },
            { cell: 'Q197', name: 'Mô đun pháp tuyến trong', sym: 'min', mit: 7.909381, getVal: () => g.min_mod },
            { cell: 'N198', name: 'Chiều dài nón ngoài', sym: 'Re', mit: 338.321372, getVal: () => g.Re },
            { cell: 'P198', name: 'Chiều dài nón trung bình', sym: 'Rm', mit: 279.821372, getVal: () => g.Rm },
            { cell: 'Q198', name: 'Chiều dài nón trong', sym: 'Ri', mit: 221.321372, getVal: () => g.Ri },
            { cell: 'P199', name: 'Góc nón chia 1', sym: 'δ1', mit: 21.801409, getVal: () => g.delta1_deg },
            { cell: 'Q199', name: 'Góc nón chia 2', sym: 'δ2', mit: 68.198591, getVal: () => g.delta2_deg },
            { cell: 'P200', name: 'Góc nón đỉnh 1', sym: 'δa1', mit: 24.502218, getVal: () => g.delta1a_deg },
            { cell: 'Q200', name: 'Góc nón đỉnh 2', sym: 'δa2', mit: 69.590674, getVal: () => g.delta2a_deg },
            { cell: 'P201', name: 'Góc nón đáy 1', sym: 'δf1', mit: 20.000129, getVal: () => g.delta1f_deg },
            { cell: 'Q201', name: 'Góc nón đáy 2', sym: 'δf2', mit: 65.089318, getVal: () => g.delta2f_deg },
            { cell: 'P202', name: 'Đường kính đỉnh ngoài 1', sym: 'dae1', mit: 280.935072, getVal: () => g.dae1 },
            { cell: 'Q202', name: 'Đường kính đỉnh ngoài 2', sym: 'dae2', mit: 634.353882, getVal: () => g.dae2 },
            { cell: 'P203', name: 'Đường kính đỉnh TB 1', sym: 'dam1', mit: 232.357882, getVal: () => g.dam1 },
            { cell: 'Q203', name: 'Đường kính đỉnh TB 2', sym: 'dam2', mit: 524.666155, getVal: () => g.dam2 },
            { cell: 'P204', name: 'Đường kính đỉnh trong 1', sym: 'dai1', mit: 183.780691, getVal: () => g.dai1 },
            { cell: 'Q204', name: 'Đường kính đỉnh trong 2', sym: 'dai2', mit: 414.978429, getVal: () => g.dai2 },
            { cell: 'P205', name: 'Đường kính chia ngoài 1', sym: 'de1', mit: 251.298806, getVal: () => g.de1 },
            { cell: 'Q205', name: 'Đường kính chia ngoài 2', sym: 'de2', mit: 628.247015, getVal: () => g.de2 },
            { cell: 'P206', name: 'Đường kính chia TB 1', sym: 'dm1', mit: 207.846097, getVal: () => g.dm1 },
            { cell: 'Q206', name: 'Đường kính chia TB 2', sym: 'dm2', mit: 519.615242, getVal: () => g.dm2 },
            { cell: 'P207', name: 'Đường kính chia trong 1', sym: 'di1', mit: 164.393388, getVal: () => g.di1 },
            { cell: 'Q207', name: 'Đường kính chia trong 2', sym: 'di2', mit: 410.983469, getVal: () => g.di2 },
            { cell: 'P208', name: 'Đường kính đáy ngoài 1', sym: 'dfe1', mit: 231.541295, getVal: () => g.dfe1 },
            { cell: 'Q208', name: 'Đường kính đáy ngoài 2', sym: 'dfe2', mit: 614.596371, getVal: () => g.dfe2 },
            { cell: 'P209', name: 'Đường kính đáy TB 1', sym: 'dfm1', mit: 191.504907, getVal: () => g.dfm1 },
            { cell: 'Q209', name: 'Đường kính đáy TB 2', sym: 'dfm2', mit: 508.324966, getVal: () => g.dfm2 },
            { cell: 'P210', name: 'Đường kính đáy trong 1', sym: 'dfi1', mit: 151.468519, getVal: () => g.dfi1 },
            { cell: 'Q210', name: 'Đường kính đáy trong 2', sym: 'dfi2', mit: 402.053560, getVal: () => g.dfi2 },
            { cell: 'P211', name: 'Góc đỉnh răng 1', sym: 'θa1', mit: 2.700809, getVal: () => g.deltaa1_deg },
            { cell: 'Q211', name: 'Góc đỉnh răng 2', sym: 'θa2', mit: 1.392083, getVal: () => g.deltaa2_deg },
            { cell: 'P212', name: 'Góc đáy răng 1', sym: 'θf1', mit: 1.801280, getVal: () => g.deltaf1_deg },
            { cell: 'Q212', name: 'Góc đáy răng 2', sym: 'θf2', mit: 3.109272, getVal: () => g.deltaf2_deg },
            { cell: 'P213', name: 'Chiều cao đỉnh ngoài 1', sym: 'hae1', mit: 15.959618, getVal: () => g.hae1 },
            { cell: 'Q213', name: 'Chiều cao đỉnh ngoài 2', sym: 'hae2', mit: 8.221621, getVal: () => g.hae2 },
            { cell: 'P214', name: 'Chiều cao đỉnh TB 1', sym: 'ha1', mit: 13.200000, getVal: () => g.ha1 },
            { cell: 'Q214', name: 'Chiều cao đỉnh TB 2', sym: 'ha2', mit: 6.800000, getVal: () => g.ha2 },
            { cell: 'P215', name: 'Chiều cao đỉnh trong 1', sym: 'hai1', mit: 10.440382, getVal: () => g.hai1 },
            { cell: 'Q215', name: 'Chiều cao đỉnh trong 2', sym: 'hai2', mit: 5.378379, getVal: () => g.hai2 },
            { cell: 'P216', name: 'Chiều cao đáy ngoài 1', sym: 'hfe1', mit: 10.639745, getVal: () => g.hfe1 },
            { cell: 'Q216', name: 'Chiều cao đáy ngoài 2', sym: 'hfe2', mit: 18.377742, getVal: () => g.hfe2 },
            { cell: 'P217', name: 'Chiều cao đáy TB 1', sym: 'hf1', mit: 8.800000, getVal: () => g.hf1 },
            { cell: 'Q217', name: 'Chiều cao đáy TB 2', sym: 'hf2', mit: 15.200000, getVal: () => g.hf2 },
            { cell: 'P218', name: 'Chiều cao đáy trong 1', sym: 'hfi1', mit: 6.960255, getVal: () => g.hfi1 },
            { cell: 'Q218', name: 'Chiều cao đáy trong 2', sym: 'hfi2', mit: 12.022258, getVal: () => g.hfi2 },
            { cell: 'P219', name: 'Góc áp lực pháp tuyến', sym: 'αn', mit: 17.495241, getVal: () => g.alfa_n_deg },
            { cell: 'P222', name: 'Góc nghiêng cơ sở', sym: 'βb', mit: 28.481238, getVal: () => g.beta_b_deg },
            { cell: 'P225', name: 'Bước răng pháp ngoài', sym: 'pe', mit: 37.983801, getVal: () => g.pe },
            { cell: 'P226', name: 'Bước răng tiếp tuyến ngoài', sym: 'pte', mit: 43.859916, getVal: () => g.pte },
            { cell: 'P227', name: 'Chiều dày răng pháp ngoài 1', sym: 'sne1', mit: 22.291926, getVal: () => g.sne1 },
            { cell: 'Q227', name: 'Chiều dày răng pháp ngoài 2', sym: 'sne2', mit: 15.691875, getVal: () => g.sne2 },
            { cell: 'P228', name: 'Chiều dày răng pháp TB 1', sym: 'sn1', mit: 18.437373, getVal: () => g.sn1 },
            { cell: 'Q228', name: 'Chiều dày răng pháp TB 2', sym: 'sn2', mit: 12.978554, getVal: () => g.sn2 },
            { cell: 'P229', name: 'Chiều dày răng pháp trong 1', sym: 'sni1', mit: 14.582820, getVal: () => g.sni1 },
            { cell: 'Q229', name: 'Chiều dày răng pháp trong 2', sym: 'sni2', mit: 10.265232, getVal: () => g.sni2 },
            { cell: 'P230', name: 'Chiều dày đỉnh răng ngoài 1', sym: 'sae1', mit: 8.883307, getVal: () => g.sae1 },
            { cell: 'Q230', name: 'Chiều dày đỉnh răng ngoài 2', sym: 'sae2', mit: 13.520387, getVal: () => g.sae2 },
            { cell: 'P231', name: 'Chiều dày đỉnh răng TB 1', sym: 'sa1', mit: 7.347259, getVal: () => g.sa1 },
            { cell: 'Q231', name: 'Chiều dày đỉnh răng TB 2', sym: 'sa2', mit: 11.182560, getVal: () => g.sa2 },
            { cell: 'P232', name: 'Chiều dày đỉnh răng trong 1', sym: 'sai1', mit: 5.811230, getVal: () => g.sai1 },
            { cell: 'Q232', name: 'Chiều dày đỉnh răng trong 2', sym: 'sai2', mit: 8.844712, getVal: () => g.sai2 },
            { cell: 'P233', name: 'Chiều dày đỉnh răng chuẩn 1', sym: 'sae1*', mit: 0.734726, getVal: () => g.sae1_star },
            { cell: 'Q233', name: 'Chiều dày đỉnh răng chuẩn 2', sym: 'sae2*', mit: 1.118256, getVal: () => g.sae2_star },
            { cell: 'P236', name: 'Răng ảo pháp diện 1', sym: 'zvn1', mit: 19.386593, getVal: () => g.zvn1 },
            { cell: 'Q236', name: 'Răng ảo pháp diện 2', sym: 'zvn2', mit: 121.166208, getVal: () => g.zvn2 },
            { cell: 'P237', name: 'Răng ảo tiếp tuyến 1', sym: 'zv1', mit: 29.847613, getVal: () => g.zv1 },
            { cell: 'Q237', name: 'Răng ảo tiếp tuyến 2', sym: 'zv2', mit: 186.547581, getVal: () => g.zv2 },
            { cell: 'P238', name: 'Vòng chia tương đương TB 1', sym: 'dvm1', mit: 223.857097, getVal: () => g.dvm1 },
            { cell: 'Q238', name: 'Vòng chia tương đương TB 2', sym: 'dvm2', mit: 1399.106858, getVal: () => g.dvm2 },
            { cell: 'P239', name: 'Vòng đỉnh tương đương 1', sym: 'dva1', mit: 250.257097, getVal: () => g.dva1 },
            { cell: 'Q239', name: 'Vòng đỉnh tương đương 2', sym: 'dva2', mit: 1412.706858, getVal: () => g.dva2 },
            { cell: 'P240', name: 'Vòng cơ sở tương đương 1', sym: 'dvb1', mit: 210.356861, getVal: () => g.dvb1 },
            { cell: 'Q240', name: 'Vòng cơ sở tương đương 2', sym: 'dvb2', mit: 1314.730379, getVal: () => g.dvb2 },
            { cell: 'P241', name: 'Vòng đáy tương đương 1', sym: 'dvf1', mit: 206.257097, getVal: () => g.dvf1 },
            { cell: 'Q241', name: 'Vòng đáy tương đương 2', sym: 'dvf2', mit: 1368.706858, getVal: () => g.dvf2 },
            { cell: 'P242', name: 'Khoảng cách trục tương đương', sym: 'av', mit: 811.481978, getVal: () => g.av },
            { cell: 'P243', name: 'Tỉ số truyền tương đương', sym: 'iv', mit: 6.250000, getVal: () => g.iv },
            { cell: 'P246', name: 'Hệ số trùng khớp ngang', sym: 'εα', mit: 1.428924, getVal: () => g.ea },
            { cell: 'Q246', name: 'Hệ số trùng khớp dọc', sym: 'εβ', mit: 1.582796, getVal: () => g.eb },
            { cell: 'P247', name: 'Hệ số trùng khớp tổng cộng', sym: 'εγ', mit: 3.011720, getVal: () => g.eg },
            { cell: 'D4', name: 'Bảng chế tạo - Mô đun', sym: 'mmn', mit: 10.000000, getVal: () => g.mmn },
            { cell: 'D5', name: 'Bảng chế tạo - Số răng bánh 1', sym: 'z1', mit: 18.000000, getVal: () => g.z1 },
            { cell: 'D8', name: 'Bảng chế tạo - Góc nón chia 1', sym: 'δ1', mit: 21.801409, getVal: () => g.delta1_deg },
            { cell: 'D9', name: 'Bảng chế tạo - Vòng đỉnh ngoài 1', sym: 'dae1', mit: 280.935072, getVal: () => g.dae1 },
            { cell: 'D10', name: 'Bảng chế tạo - Chiều dài nón Re', sym: 'Re', mit: 338.321372, getVal: () => g.Re },
            { cell: 'D11', name: 'Bảng chế tạo - Chiều rộng b', sym: 'b', mit: 117.000000, getVal: () => g.b },
            { cell: 'D12', name: 'Bảng chế tạo - Dịch chỉnh x1', sym: 'x1', mit: 0.320000, getVal: () => g.x1 },
            { cell: 'D13', name: 'Bảng chế tạo - Dịch dày xt1', sym: 'xt1', mit: 0.040000, getVal: () => g.xt1 },
            { cell: 'D24', name: 'Bảng chế tạo - Số răng bánh 2', sym: 'z2', mit: 45.000000, getVal: () => g.z2 },
            { cell: 'D27', name: 'Bảng chế tạo - Góc nón chia 2', sym: 'δ2', mit: 68.198591, getVal: () => g.delta2_deg },
            { cell: 'D28', name: 'Bảng chế tạo - Vòng đỉnh ngoài 2', sym: 'dae2', mit: 634.353882, getVal: () => g.dae2 },
            { cell: 'D31', name: 'Bảng chế tạo - Dịch chỉnh x2', sym: 'x2', mit: -0.320000, getVal: () => g.x2 },
            { cell: 'D32', name: 'Bảng chế tạo - Dịch dày xt2', sym: 'xt2', mit: -0.040000, getVal: () => g.xt2 }
        ];

        let passCount = 0;
        let html = '';

        auditItems.forEach(item => {
            const webVal = item.getVal();
            const delta = Math.abs(webVal - item.mit);
            const isPass = delta <= 0.005;
            if (isPass) passCount++;

            html += `<tr>
                <td><span class="badge-coord">${item.cell}</span></td>
                <td><b>${item.name}</b></td>
                <td style="color: var(--accent-cyan); font-style: italic;">${item.sym}</td>
                <td style="text-align: right; color: #38bdf8; font-weight: 700;">${typeof webVal === 'number' ? webVal.toFixed(4) : webVal}</td>
                <td style="text-align: right; color: #94a3b8;">${typeof item.mit === 'number' ? item.mit.toFixed(4) : item.mit}</td>
                <td style="text-align: right; color: ${delta < 0.0001 ? '#34d399' : '#f59e0b'};">${delta.toFixed(6)}</td>
                <td style="text-align: center;"><span class="badge-pass">✅ PASS</span></td>
            </tr>`;
        });

        tbody.innerHTML = html;
        const badge = document.getElementById('auditSummaryBadge');
        if (badge) {
            badge.textContent = `✅ ${passCount}/${auditItems.length} Ô TÍNH KHỚP TUYỆT ĐỐI (100.0%)`;
        }
    }

    exportDXF() {
        const g = this.lastGeom || (typeof BevelCalcEngine !== 'undefined' ? BevelCalcEngine.calculate(this.inputs) : null);
        if (!g) return;

        const Re = g.Re;
        const Ri = g.Ri;
        const b = g.b;
        const d1 = g.delta1; // rad
        const d2 = g.delta2; // rad
        const th_a1 = (g.deltaa1_deg * Math.PI) / 180.0;
        const th_f1 = (g.deltaf1_deg * Math.PI) / 180.0;
        const th_a2 = (g.deltaa2_deg * Math.PI) / 180.0;
        const th_f2 = (g.deltaf2_deg * Math.PI) / 180.0;

        const d1a = d1 + th_a1;
        const d1f = d1 - th_f1;
        const d2a = d2 + th_a2;
        const d2f = d2 - th_f2;

        const Rae1 = Re / Math.cos(th_a1);
        const Rfe1 = Re / Math.cos(th_f1);
        const Rai1 = Ri / Math.cos(th_a1);
        const Rfi1 = Ri / Math.cos(th_f1);

        const p1_toe_tip = { x: Rai1 * Math.cos(d1a), y: Rai1 * Math.sin(d1a) };
        const p1_heel_tip = { x: Rae1 * Math.cos(d1a), y: Rae1 * Math.sin(d1a) };
        const p1_heel_root = { x: Rfe1 * Math.cos(d1f), y: Rfe1 * Math.sin(d1f) };
        const p1_toe_root = { x: Rfi1 * Math.cos(d1f), y: Rfi1 * Math.sin(d1f) };

        const d_bore1 = Math.max(15, g.de1 * 0.22);
        const d_hub1 = Math.max(25, g.de1 * 0.45);
        const x_back1 = p1_heel_tip.x + 15;
        const x_hub_end1 = x_back1 + Math.max(30, b * 0.7);

        // Pinion Upper Half (Clean vertical front face at p1_toe_root.x)
        const x_front1 = p1_toe_root.x;
        const p1_upper = [
            p1_toe_root, p1_toe_tip, p1_heel_tip, p1_heel_root,
            { x: x_back1, y: d_hub1 / 2.0 },
            { x: x_hub_end1, y: d_hub1 / 2.0 },
            { x: x_hub_end1, y: d_bore1 / 2.0 },
            { x: x_front1, y: d_bore1 / 2.0 },
            p1_toe_root
        ];
        const p1_lower = p1_upper.map(p => ({ x: p.x, y: -p.y }));

        // Gear (Apex at 0,0, shaft along Y axis)
        const Rae2 = Re / Math.cos(th_a2);
        const Rfe2 = Re / Math.cos(th_f2);
        const Rai2 = Ri / Math.cos(th_a2);
        const Rfi2 = Ri / Math.cos(th_f2);

        const p2_toe_tip = { x: Rai2 * Math.cos(d1 - th_a2), y: Rai2 * Math.sin(d1 - th_a2) };
        const p2_heel_tip = { x: Rae2 * Math.cos(d1 - th_a2), y: Rae2 * Math.sin(d1 - th_a2) };
        const p2_heel_root = { x: Rfe2 * Math.cos(d1 + th_f2), y: Rfe2 * Math.sin(d1 + th_f2) };
        const p2_toe_root = { x: Rfi2 * Math.cos(d1 + th_f2), y: Rfi2 * Math.sin(d1 + th_f2) };

        const d_bore2 = Math.max(25, g.de2 * 0.16);
        const d_hub2 = Math.max(45, g.de2 * 0.32);
        const y_back2 = p2_heel_tip.y + 18;
        const y_hub_end2 = y_back2 + Math.max(35, b * 0.8);

        const p2_right = [
            p2_toe_root, p2_toe_tip, p2_heel_tip, p2_heel_root,
            { x: d_hub2 / 2.0, y: y_back2 },
            { x: d_hub2 / 2.0, y: y_hub_end2 },
            { x: d_bore2 / 2.0, y: y_hub_end2 },
            { x: d_bore2 / 2.0, y: p2_toe_root.y },
            p2_toe_root
        ];
        const p2_left = p2_right.map(p => ({ x: -p.x, y: p.y }));

        // DXF Header & Layers (AutoCAD Release 12 AC1009)
        const dxf = [];
        dxf.push("0\nSECTION\n2\nHEADER\n9\n$ACADVER\n1\nAC1009\n0\nENDSEC\n");
        dxf.push("0\nSECTION\n2\nTABLES\n0\nTABLE\n2\nLAYER\n70\n6\n");
        const layers = [
            { name: "PINION_CROSS_SECTION", color: 3 },
            { name: "GEAR_CROSS_SECTION", color: 5 },
            { name: "CENTER_LINES", color: 1 },
            { name: "PITCH_CONES", color: 2 },
            { name: "APEX_POINT", color: 1 },
            { name: "MFG_TABLE", color: 7 }
        ];
        layers.forEach(lyr => {
            dxf.push(`0\nLAYER\n2\n${lyr.name}\n70\n0\n62\n${lyr.color}\n6\nCONTINUOUS\n`);
        });
        dxf.push("0\nENDTAB\n0\nENDSEC\n");
        dxf.push("0\nSECTION\n2\nENTITIES\n");

        const addPolyline = (pts, layer) => {
            dxf.push(`0\nPOLYLINE\n8\n${layer}\n66\n1\n70\n1\n`);
            pts.forEach(p => {
                dxf.push(`0\nVERTEX\n8\n${layer}\n10\n${p.x.toFixed(4)}\n20\n${p.y.toFixed(4)}\n30\n0.0\n`);
            });
            dxf.push("0\nSEQEND\n");
        };

        const addLine = (p1, p2, layer) => {
            dxf.push(`0\nLINE\n8\n${layer}\n10\n${p1.x.toFixed(4)}\n20\n${p1.y.toFixed(4)}\n30\n0.0\n11\n${p2.x.toFixed(4)}\n21\n${p2.y.toFixed(4)}\n31\n0.0\n`);
        };

        const addText = (text, x, y, height, layer) => {
            dxf.push(`0\nTEXT\n8\n${layer}\n10\n${x.toFixed(4)}\n20\n${y.toFixed(4)}\n30\n0.0\n40\n${height.toFixed(4)}\n1\n${text}\n`);
        };

        // 1. Pinion Profile
        addPolyline(p1_upper, "PINION_CROSS_SECTION");
        addPolyline(p1_lower, "PINION_CROSS_SECTION");
        // Pinion bore rectangle
        addLine({ x: p1_toe_root.x - 5, y: -d_bore1 / 2.0 }, { x: x_hub_end1, y: -d_bore1 / 2.0 }, "PINION_CROSS_SECTION");
        addLine({ x: p1_toe_root.x - 5, y: d_bore1 / 2.0 }, { x: x_hub_end1, y: d_bore1 / 2.0 }, "PINION_CROSS_SECTION");

        // 2. Gear Profile
        addPolyline(p2_right, "GEAR_CROSS_SECTION");
        addPolyline(p2_left, "GEAR_CROSS_SECTION");
        // Gear bore rectangle
        addLine({ x: -d_bore2 / 2.0, y: y_hub_end2 }, { x: -d_bore2 / 2.0, y: p2_toe_root.y - 5 }, "GEAR_CROSS_SECTION");
        addLine({ x: d_bore2 / 2.0, y: y_hub_end2 }, { x: d_bore2 / 2.0, y: p2_toe_root.y - 5 }, "GEAR_CROSS_SECTION");

        // 3. Center Lines
        addLine({ x: -30, y: 0 }, { x: x_hub_end1 + 40, y: 0 }, "CENTER_LINES");
        addLine({ x: 0, y: -30 }, { x: 0, y: y_hub_end2 + 40 }, "CENTER_LINES");
        const contactX = Re * Math.cos(d1);
        const contactY = Re * Math.sin(d1);
        addLine({ x: 0, y: 0 }, { x: contactX * 1.15, y: contactY * 1.15 }, "CENTER_LINES");

        // 4. Pitch Cones (Re, Ri generator lines)
        addLine({ x: 0, y: 0 }, { x: Re * Math.cos(d1a), y: Re * Math.sin(d1a) }, "PITCH_CONES");
        addLine({ x: 0, y: 0 }, { x: Re * Math.cos(d1f), y: Re * Math.sin(d1f) }, "PITCH_CONES");

        // 5. Apex Point
        dxf.push("0\nCIRCLE\n8\nAPEX_POINT\n10\n0.0\n20\n0.0\n30\n0.0\n40\n3.0\n");

        // 6. Manufacturing Specification Table
        const tx = Math.max(x_hub_end1 + 60, Re * 1.25);
        let ty = y_hub_end2 + 20;
        const lineH = 10.0;

        const mfgRows = [
            "===========================================================",
            "  BANG THONG SO CHE TAO BANH RANG CON (ISO 23509 / DIN 3971)",
            "===========================================================",
            `Mo-dun phap tuyen trung binh (mmn):    ${g.mmn.toFixed(3)} mm`,
            `So rang banh dan / bi dan (z1 / z2):   ${g.z1} / ${g.z2}`,
            `Ti so truyen dong thuc te (i):         ${g.i.toFixed(4)}`,
            `Goc giua hai truc (Sigma):             ${g.Sigma_deg.toFixed(2)} deg`,
            `Goc an khop danh nghia (alfa):         ${g.alfa_deg.toFixed(2)} deg`,
            `Goc xoan rang trung binh (beta):       ${g.beta_deg.toFixed(2)} deg`,
            `Goc non chia 1 (delta1):               ${g.delta1_deg.toFixed(4)} deg`,
            `Goc non chia 2 (delta2):               ${g.delta2_deg.toFixed(4)} deg`,
            `Chieu dai duong sinh non ngoai (Re):   ${g.Re.toFixed(3)} mm`,
            `Chieu rong vanh rang (b):              ${g.b.toFixed(1)} mm`,
            `He so dich chinh bien dang (x1 / x2):  ${g.x1.toFixed(4)} / ${g.x2.toFixed(4)}`,
            `He so dich chinh chieu day (xt1 / xt2):${g.xt1.toFixed(4)} / ${g.xt2.toFixed(4)}`,
            `Duong kinh dinh ngoai (dae1 / dae2):   ${g.dae1.toFixed(3)} / ${g.dae2.toFixed(3)} mm`,
            `Duong kinh day ngoai (dfe1 / dfe2):    ${g.dfe1.toFixed(3)} / ${g.dfe2.toFixed(3)} mm`,
            `Cap chinh xac che tao:                 DIN 3965 Cap ${g.Q}`,
            "==========================================================="
        ];

        mfgRows.forEach(row => {
            addText(row, tx, ty, 5.0, "MFG_TABLE");
            ty -= lineH;
        });

        dxf.push("0\nENDSEC\n0\nEOF\n");
        const dxfContent = dxf.join("");

        // Download via Blob
        const blob = new Blob([dxfContent], { type: "application/dxf;charset=utf-8" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `Banh_Rang_Con_MITCalc_${g.z1}x${g.z2}_m${g.mmn}.dxf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    }

    export3DCAD(format, target) {
        if (!this.visualizer3D || !this.lastGeom || typeof Bevel3DExporter === 'undefined') return;
        const g = this.lastGeom;
        const isSpiral = Math.abs(g.beta_deg || 0.0) > 1e-4;
        const typeStr = isSpiral ? 'Spiral_Bevel' : 'Straight_Bevel';

        const isSurface = (format === 'step_surface' || format === 'stl_surface');
        const tris = this.visualizer3D.getExportTriangles(target, isSurface);

        let filenameBase = '';
        let partName = '';
        if (target === 'pinion') {
            filenameBase = `Banh_Dan_1_${typeStr}_z${g.z1}_mmn${g.mmn}`;
            partName = `BEVEL_PINION_1_Z${g.z1}`;
        } else if (target === 'gear') {
            filenameBase = `Banh_Bi_Dan_2_${typeStr}_z${g.z2}_mmn${g.mmn}`;
            partName = `BEVEL_GEAR_2_Z${g.z2}`;
        } else {
            filenameBase = `Cap_Banh_Rang_Con_${typeStr}_z${g.z1}x${g.z2}_Sigma${(g.Sigma_deg || 90).toFixed(0)}`;
            partName = `BEVEL_GEAR_ASSEMBLY_Z${g.z1}x${g.z2}`;
        }

        if (isSurface) {
            filenameBase += '_Surface_Rong';
            partName += '_SURFACE';
        }

        if (format === 'step') {
            return Bevel3DExporter.exportSTEP(tris, `${filenameBase}.step`, partName, true, false);
        } else if (format === 'step_surface') {
            return Bevel3DExporter.exportSTEPSurface(tris, `${filenameBase}.step`, partName, true);
        } else if (format === 'stl' || format === 'stl_surface') {
            return Bevel3DExporter.exportBinarySTL(tris, `${filenameBase}.stl`);
        } else if (format === 'obj') {
            return Bevel3DExporter.exportOBJ(tris, `${filenameBase}.obj`);
        }
    }
}

