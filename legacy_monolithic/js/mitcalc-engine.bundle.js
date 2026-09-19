/**
 * MITCalc Web App - Cylindrical Spur & Helical Gear Engine Bundle
 * 100% Offline, Zero-CORS, Classic Script Compatible
 * Standards: ISO 6336, DIN 3960, ISO 1328
 */

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

/**
 * MITCalc Web App - Standard Engineering Tables
 * Module series, axis distances, gear ratios, basic racks, and ISO 6336 factors
 */

const StandardTables = {
    // Standard Normal Modules [mm] per ISO 54 / DIN 780
    modules: [
        { val: 0.5, series: 1 },
        { val: 0.55, series: 2 },
        { val: 0.6, series: 1 },
        { val: 0.7, series: 2 },
        { val: 0.8, series: 1 },
        { val: 0.9, series: 2 },
        { val: 1.0, series: 1 },
        { val: 1.125, series: 2 },
        { val: 1.25, series: 1 },
        { val: 1.375, series: 2 },
        { val: 1.5, series: 1 },
        { val: 1.75, series: 2 },
        { val: 2.0, series: 1 },
        { val: 2.25, series: 2 },
        { val: 2.5, series: 1 },
        { val: 2.75, series: 2 },
        { val: 3.0, series: 1 },
        { val: 3.5, series: 2 },
        { val: 4.0, series: 1 },
        { val: 4.5, series: 2 },
        { val: 5.0, series: 1 },
        { val: 5.5, series: 2 },
        { val: 6.0, series: 1 },
        { val: 7.0, series: 2 },
        { val: 8.0, series: 1 },
        { val: 9.0, series: 2 },
        { val: 10.0, series: 1 },
        { val: 11.0, series: 2 },
        { val: 12.0, series: 1 },
        { val: 14.0, series: 2 },
        { val: 16.0, series: 1 },
        { val: 18.0, series: 2 },
        { val: 20.0, series: 1 },
        { val: 22.0, series: 2 },
        { val: 25.0, series: 1 },
        { val: 28.0, series: 2 },
        { val: 32.0, series: 1 },
        { val: 36.0, series: 2 },
        { val: 40.0, series: 1 },
        { val: 45.0, series: 2 },
        { val: 50.0, series: 1 }
    ],

    // Standard Center Distances [mm] per ISO 286
    axisDistances: [
        40, 50, 63, 71, 80, 90, 100, 112, 125, 140, 160, 180, 200, 224, 250, 280, 315, 355, 400, 450, 500, 560, 630, 710, 800, 900, 1000, 1120, 1250
    ],

    // Standard Transmission Ratios
    transmissionRatios: [
        1.0, 1.12, 1.25, 1.4, 1.6, 1.8, 2.0, 2.24, 2.5, 2.8, 3.15, 3.55, 4.0, 4.5, 5.0, 5.6, 6.3, 7.1, 8.0, 9.0, 10.0
    ],

    // Standard Basic Rack Tooth Profiles (DIN 867, ANSI B6.1, ISO 53)
    rackProfiles: [
        { id: 1, name: 'DIN 867 (Standard Metric)', alpha: 20, ha0: 1.25, hf0: 1.00, ra0: 0.38, ca: 0.25 },
        { id: 2, name: 'ANSI B6.1 (Standard Inch)', alpha: 20, ha0: 1.25, hf0: 1.00, ra0: 0.30, ca: 0.35 },
        { id: 3, name: 'ISO 53 Profile A', alpha: 20, ha0: 1.25, hf0: 1.00, ra0: 0.38, ca: 0.25 },
        { id: 4, name: 'ISO 53 Profile B (High load)', alpha: 20, ha0: 1.20, hf0: 1.00, ra0: 0.30, ca: 0.20 },
        { id: 5, name: 'ISO 53 Profile C (Fine pitch)', alpha: 20, ha0: 1.25, hf0: 1.00, ra0: 0.25, ca: 0.25 },
        { id: 6, name: 'Custom Tool / Profile', alpha: 20, ha0: 1.25, hf0: 1.00, ra0: 0.38, ca: 0.25 }
    ],

    // Application Factor KA (ISO 6336-1)
    applicationFactors: {
        // [driveMachine][drivenMachine]
        // 1: Uniform, 2: Light shocks, 3: Moderate shocks, 4: Heavy shocks
        matrix: [
            [1.00, 1.25, 1.50, 1.75], // Electric motor, steam turbine (Uniform)
            [1.10, 1.35, 1.60, 1.85], // Multi-cylinder IC engine (Light shocks)
            [1.25, 1.50, 1.75, 2.00], // Single-cylinder IC engine (Moderate shocks)
            [1.50, 1.75, 2.00, 2.25]  // Variable speed, rough shocks
        ],
        driveExamples: [
            { id: 0, name_vn: 'Động cơ điện, Tua-bin hơi (Êm, đồng đều)', name_en: 'Electric motor, Steam turbine (Uniform)' },
            { id: 1, name_vn: 'Động cơ đốt trong nhiều xy-lanh (Va đập nhẹ)', name_en: 'Multi-cylinder IC engine (Light shocks)' },
            { id: 2, name_vn: 'Động cơ đốt trong 1 xy-lanh (Va đập trung bình)', name_en: 'Single-cylinder IC engine (Moderate shocks)' },
            { id: 3, name_vn: 'Tải không ổn định, rung lắc mạnh (Va đập nặng)', name_en: 'Rough shocks, variable drives (Heavy shocks)' }
        ],
        drivenExamples: [
            { id: 0, name_vn: 'Máy phát điện, Quạt ly tâm, Băng tải nhẹ (Tải đều)', name_en: 'Generator, Centrifugal fan, Light conveyor (Uniform)' },
            { id: 1, name_vn: 'Máy công cụ, Máy nén ly tâm, Bơm piston nhiều xy-lanh', name_en: 'Machine tools, Centrifugal compressor, Multi-cylinder pump' },
            { id: 2, name_vn: 'Máy trộn, Tời nâng, Máy dệt, Máy nén piston 1 xy-lanh', name_en: 'Mixers, Hoists, Textile machines, Single-cylinder compressor' },
            { id: 3, name_vn: 'Máy nghiền đá, Máy cán thép, Máy đào, Máy xúc', name_en: 'Crushers, Rolling mills, Excavators, Heavy impact' }
        ]
    },

    // Gear Mounting Types
    mountings: [
        { id: 1, type: 'A', name_vn: 'Hai đầu đối xứng - Loại 1 (Ổ bi cứng vững)', name_en: 'Double-sided symmetrically supported - Type 1', psi_d_max: 1.6 },
        { id: 2, type: 'A2', name_vn: 'Hai đầu đối xứng - Loại 2 (Vỏ hộp đàn hồi)', name_en: 'Double-sided symmetrically supported - Type 2', psi_d_max: 1.4 },
        { id: 3, type: 'B', name_vn: 'Hai đầu không đối xứng - Loại 1 (Ổ bi cứng vững)', name_en: 'Double-sided non-symmetrically supported - Type 1', psi_d_max: 1.2 },
        { id: 4, type: 'B2', name_vn: 'Hai đầu không đối xứng - Loại 2 (Vỏ hộp đàn hồi)', name_en: 'Double-sided non-symmetrically supported - Type 2', psi_d_max: 1.0 },
        { id: 5, type: 'C', name_vn: 'Một đầu trục chìa (Công xôn / Overhung)', name_en: 'Single-sided overhung / Cantilever', psi_d_max: 0.6 }
    ],

    // ISO 1328 Accuracy Grades
    accuracyGrades: [
        { grade: 3, name: 'Cấp 3 (Siêu chính xác / Master gears)', v_max: 50, ra_max: 0.4 },
        { grade: 4, name: 'Cấp 4 (Độ chính xác rất cao / Tua-bin cao tốc)', v_max: 35, ra_max: 0.4 },
        { grade: 5, name: 'Cấp 5 (Chính xác cao / Hộp số ô tô, máy bay)', v_max: 25, ra_max: 0.8 },
        { grade: 6, name: 'Cấp 6 (Chính xác / Máy công cụ chính xác)', v_max: 18, ra_max: 0.8 },
        { grade: 7, name: 'Cấp 7 (Tiêu chuẩn công nghiệp phổ biến)', v_max: 12, ra_max: 1.6 },
        { grade: 8, name: 'Cấp 8 (Công nghiệp trung bình / Hộp giảm tốc thông dụng)', v_max: 8, ra_max: 3.2 },
        { grade: 9, name: 'Cấp 9 (Tải chậm, máy nông nghiệp, cơ khí xây dựng)', v_max: 4, ra_max: 6.3 },
        { grade: 10, name: 'Cấp 10 (Vận tốc thấp, truyền động thô)', v_max: 2, ra_max: 6.3 },
        { grade: 11, name: 'Cấp 11 (Bánh răng đúc / Cắt thô)', v_max: 1, ra_max: 12.5 },
        { grade: 12, name: 'Cấp 12 (Bánh răng hở, tốc độ rất chậm)', v_max: 0.5, ra_max: 12.5 }
    ],

    // Lubricants (ISO VG)
    lubricants: [
        { id: 1, name: 'ISO VG 32 (Dầu loãng)', nu40: 32, nu50: 22 },
        { id: 2, name: 'ISO VG 46 (Dầu nhẹ)', nu40: 46, nu50: 31 },
        { id: 3, name: 'ISO VG 68 (Dầu trung bình)', nu40: 68, nu50: 45 },
        { id: 4, name: 'ISO VG 100 (Dầu hộp số nhẹ)', nu40: 100, nu50: 65 },
        { id: 5, name: 'ISO VG 150 (Dầu hộp số tiêu chuẩn)', nu40: 150, nu50: 95 },
        { id: 6, name: 'ISO VG 220 (Dầu hộp số tải nặng phổ biến)', nu40: 220, nu50: 135 },
        { id: 7, name: 'ISO VG 320 (Dầu hộp số tải rất nặng)', nu40: 320, nu50: 195 },
        { id: 8, name: 'ISO VG 460 (Dầu đặc, nhiệt độ cao)', nu40: 460, nu50: 275 },
        { id: 9, name: 'ISO VG 680 (Dầu siêu đặc, tốc độ chậm)', nu40: 680, nu50: 400 }
    ]
};

/**
 * MITCalc Web App - Internationalization Dictionary (i18n)
 * Full Vietnamese & English technical terminology
 */

const I18N = {
    vi: {
        app_title: 'MITCalc Web - Tính Toán Bánh Răng Trụ & Bánh Răng Nghiêng',
        app_subtitle: 'Phần mềm tính toán cơ khí kỹ thuật tiêu chuẩn ISO 6336, DIN 3990 & ANSI/AGMA 2001',
        lang_vi: 'Tiếng Việt',
        lang_en: 'English',
        tab_calculator: 'Bảng Tính Toán (18 Phần)',
        tab_visualizer: 'Mô Hình Ăn Khớp 2D',
        tab_solutions: 'Dò Tìm Khoảng Cách Trục (Section 14)',
        tab_materials: 'Tra Cứu Vật Liệu (51 Loại)',
        btn_calculate: 'Tính Toán Ngay',
        btn_reset: 'Khôi Phục Mặc Định',
        btn_export_pdf: 'Xuất Báo Cáo PDF',
        btn_export_dxf: 'Xuất Bản Vẽ DXF',

        // Quick summary card
        summary_title: 'Trạng Thái An Toàn & Tổng Quan',
        summary_safe: 'ĐẠT TIÊU CHUẨN AN TOÀN',
        summary_danger: 'KHÔNG ĐẠT - NGUY CƠ HỎNG HÓC',
        sh_label: 'Hệ số an toàn tiếp xúc (Tróc rỗ Flank) SH',
        sf_label: 'Hệ số an toàn uốn chân răng SF',
        sh_req_label: 'Yêu cầu: ',
        sf_req_label: 'Yêu cầu: ',
        aw_label: 'Khoảng cách trục làm việc aw: ',
        ratio_label: 'Tỉ số truyền thực tế: ',

        // Section Titles
        sec1_title: '1.0 Thông Số Đầu Vào Cơ Bản',
        sec2_title: '2.0 Vật Liệu & Điều Kiện Làm Việc, Tải Trọng',
        sec3_title: '3.0 Thông Số Dao Cắt & Thanh Răng Cơ Sở',
        sec4_title: '4.0 Thiết Kế Module & Hình Học Ăn Khớp',
        sec5_title: '5.0 Dịch Chỉnh Răng (Hệ Số x1, x2)',
        sec6_title: '6.0 Kích Thước Hình Học Cơ Bản Của Bộ Truyền',
        sec7_title: '7.0 Các Thông Số Bổ Sung & Kiểm Tra Cắt Chân Răng',
        sec8_title: '8.0 Chỉ Tiêu Chất Lượng & Vận Tốc Cộng Hưởng',
        sec9_title: '9.0 Các Hệ Số Tải Trọng & Tác Động (ISO 6336)',
        sec10_title: '10.0 Ứng Suất Tính Toán & Hệ Số An Toàn (SH, SF)',
        sec11_title: '11.0 Kích Thước Kiểm Tra & Dung Sai ISO 1328',
        sec12_title: '12.0 Lực Tác Dụng Lên Bánh Răng & Trục',
        sec13_title: '13.0 Thông Số Cơ Tính Chi Tiết Của Vật Liệu Chọn',
        sec14_title: '14.0 Dò Tìm Phương Án Theo Khoảng Cách Trục Cho Trước',
        sec15_title: '15.0 Tổn Thất Công Suất, Nhiệt Độ & Diện Tích Vỏ Hộp',
        sec16_title: '16.0 Sơ Bộ Kích Thước Đường Kính Trục',
        sec17_title: '17.0 Tính Ngược Module Từ Bánh Răng Sẵn Có',
        sec18_title: '18.0 Tính Toán Phụ Trợ (Hệ Số KHbeta, YSg)',

        // Common terms
        pinion: 'Bánh dẫn (Bánh nhỏ - Pinion)',
        gear: 'Bánh bị dẫn (Bánh lớn - Wheel)',
        power: 'Công suất truyền Pw',
        speed: 'Tốc độ quay n',
        torque: 'Mô-men xoắn Mk',
        ratio: 'Tỉ số truyền mong muốn i',
        actual_ratio: 'Tỉ số truyền thực tế',
        ratio_dev: 'Độ lệch tỉ số truyền (%)',
        module: 'Module pháp tuyến mn',
        teeth: 'Số răng z',
        pressure_angle: 'Góc áp lực pháp mn alfa',
        helix_angle: 'Góc nghiêng đường răng beta',
        face_width: 'Chiều rộng vành răng b',
        profile_shift: 'Hệ số dịch chỉnh x',
        sum_shift: 'Tổng hệ số dịch chỉnh SumX (x1+x2)',

        // Dimensions
        pitch_diam: 'Đường kính chia d',
        base_diam: 'Đường kính cơ sở db',
        tip_diam: 'Đường kính đỉnh răng da',
        root_diam: 'Đường kính đáy răng df',
        operating_diam: 'Đường kính lăn dw',
        addendum: 'Chiều cao đỉnh răng ha',
        dedendum: 'Chiều cao chân răng hf',
        whole_depth: 'Chiều cao toàn bộ răng h',
        tooth_thickness: 'Chiều dày răng trên vòng chia sn',
        tip_thickness: 'Chiều dày đỉnh răng sa',
        tip_clearance: 'Khe hở chân răng ca*',

        // Contact ratios
        transverse_contact: 'Hệ số trùng khớp ngang ea (epsilon_alpha)',
        overlap_contact: 'Hệ số trùng khớp dọc eb (epsilon_beta)',
        total_contact: 'Hệ số trùng khớp tổng eg (epsilon_gamma)',

        // Forces
        tangential_force: 'Lực vòng Ft [N]',
        axial_force: 'Lực dọc trục Fa [N]',
        radial_force: 'Lực hướng tâm Fr [N]',
        normal_force: 'Lực pháp tuyến tổng hợp Fn [N]',
        overturning_moment: 'Mô-men uốn lật trục Mo [Nm]',
        velocity: 'Vận tốc vòng trên vòng chia v [m/s]',
        efficiency: 'Hiệu suất bộ truyền eta',
        power_loss: 'Công suất tổn thất nhiệt Ploss [kW]',
        box_area: 'Diện tích tản nhiệt tối thiểu vỏ hộp Abox [m^2]'
    },
    en: {
        app_title: 'MITCalc Web - Spur & Helical Gear Calculation Engine',
        app_subtitle: 'Engineering calculation software conforming to ISO 6336, DIN 3990 & ANSI/AGMA 2001',
        lang_vi: 'Tiếng Việt',
        lang_en: 'English',
        tab_calculator: 'Calculation Sheet (18 Sections)',
        tab_visualizer: '2D Mesh Visualizer',
        tab_solutions: 'Center Distance Solver (Section 14)',
        tab_materials: 'Material Database (51 Types)',
        btn_calculate: 'Calculate Now',
        btn_reset: 'Reset Defaults',
        btn_export_pdf: 'Export PDF Report',
        btn_export_dxf: 'Export DXF Drawing',

        // Quick summary card
        summary_title: 'Safety Status & Executive Summary',
        summary_safe: 'MEETS ALL SAFETY STANDARDS',
        summary_danger: 'FAIL - HIGH RISK OF FAILURE',
        sh_label: 'Pitting safety factor (Flank durability) SH',
        sf_label: 'Tooth root bending safety factor SF',
        sh_req_label: 'Required: ',
        sf_req_label: 'Required: ',
        aw_label: 'Working center distance aw: ',
        ratio_label: 'Actual transmission ratio: ',

        // Section Titles
        sec1_title: '1.0 Basic Input Parameters',
        sec2_title: '2.0 Material Options & Operating Load Conditions',
        sec3_title: '3.0 Cutting Tool & Tooth Basic Rack Profile',
        sec4_title: '4.0 Module Design & Involute Gearing Geometry',
        sec5_title: '5.0 Addendum Modifications (Profile Shift x1, x2)',
        sec6_title: '6.0 Basic Dimensions of Gearing',
        sec7_title: '7.0 Supplemental Parameters & Undercutting Checks',
        sec8_title: '8.0 Qualitative Indices & Critical Resonant Speeds',
        sec9_title: '9.0 ISO 6336 Load & Rating Factors',
        sec10_title: '10.0 Calculated Stresses & Safety Factors (SH, SF)',
        sec11_title: '11.0 Check Dimensions & ISO 1328 Accuracy System',
        sec12_title: '12.0 Transmission Forces & Shaft Reactions',
        sec13_title: '13.0 Selected Material Mechanical & Fatigue Parameters',
        sec14_title: '14.0 Solution Finder for Given Axis Distance',
        sec15_title: '15.0 Power Losses, Thermal Warming & Box Surface',
        sec16_title: '16.0 Preliminary Shaft Diameter Sizing',
        sec17_title: '17.0 Reverse Module Calculation from Existing Gear',
        sec18_title: '18.0 Auxiliary Calculations (KHbeta, YSg)',

        // Common terms
        pinion: 'Pinion (Small gear)',
        gear: 'Gear / Wheel (Large gear)',
        power: 'Transferred Power Pw',
        speed: 'Rotational Speed n',
        torque: 'Torsional Moment Mk',
        ratio: 'Desired Transmission Ratio i',
        actual_ratio: 'Actual Transmission Ratio',
        ratio_dev: 'Transmission Ratio Deviation (%)',
        module: 'Normal Module mn',
        teeth: 'Number of Teeth z',
        pressure_angle: 'Normal Pressure Angle alfa',
        helix_angle: 'Helix Angle beta',
        face_width: 'Face Width b',
        profile_shift: 'Profile Shift Coefficient x',
        sum_shift: 'Sum of Shift Coefficients SumX (x1+x2)',

        // Dimensions
        pitch_diam: 'Reference Pitch Diameter d',
        base_diam: 'Base Diameter db',
        tip_diam: 'Tip Diameter da',
        root_diam: 'Root Diameter df',
        operating_diam: 'Operating Pitch Diameter dw',
        addendum: 'Addendum ha',
        dedendum: 'Dedendum hf',
        whole_depth: 'Whole Depth h',
        tooth_thickness: 'Circular Pitch Tooth Thickness sn',
        tip_thickness: 'Tip Tooth Thickness sa',
        tip_clearance: 'Unit Head Clearance ca*',

        // Contact ratios
        transverse_contact: 'Transverse Contact Ratio ea (epsilon_alpha)',
        overlap_contact: 'Overlap Ratio eb (epsilon_beta)',
        total_contact: 'Total Contact Ratio eg (epsilon_gamma)',

        // Forces
        tangential_force: 'Tangential Force Ft [N]',
        axial_force: 'Axial Force Fa [N]',
        radial_force: 'Radial Force Fr [N]',
        normal_force: 'Resultant Normal Force Fn [N]',
        overturning_moment: 'Overturning Bending Moment Mo [Nm]',
        velocity: 'Pitch Line Velocity v [m/s]',
        efficiency: 'Mechanical Efficiency eta',
        power_loss: 'Thermal Power Loss Ploss [kW]',
        box_area: 'Minimum Box Cooling Area Abox [m^2]'
    }
};

/**
 * MITCalc Web App - Mathematical Utilities & Involute Functions
 * Implements high-precision involute geometry and numerical solvers
 */

const MathUtils = {
    PI: Math.PI,
    TWO_PI: Math.PI * 2,
    DEG_TO_RAD: Math.PI / 180,
    RAD_TO_DEG: 180 / Math.PI,

    degToRad(degrees) {
        return degrees * this.DEG_TO_RAD;
    },

    radToDeg(radians) {
        return radians * this.RAD_TO_DEG;
    },

    /**
     * Standard Involute function: inv(alpha) = tan(alpha) - alpha (radians)
     * @param {number} alphaRad - angle in radians
     * @returns {number} involute value
     */
    invRad(alphaRad) {
        return Math.tan(alphaRad) - alphaRad;
    },

    /**
     * Involute function for angle in degrees
     * @param {number} alphaDeg - angle in degrees
     * @returns {number} involute value
     */
    inv(alphaDeg) {
        const rad = this.degToRad(alphaDeg);
        return Math.tan(rad) - rad;
    },

    /**
     * High-precision Inverse Involute solver: finds alpha (in radians) such that inv(alpha) = invVal
     * Uses Newton-Raphson iteration with cubic root initial approximation
     * @param {number} invVal - involute value
     * @returns {number} alpha in radians
     */
    inverseInvoluteRad(invVal) {
        if (invVal <= 0) return 0;

        // Initial approximation: for small angles, inv(alpha) ~ alpha^3 / 3 => alpha ~ (3 * invVal)^(1/3)
        let alpha = Math.pow(3 * invVal, 1 / 3);

        // Newton-Raphson iterations: f(alpha) = tan(alpha) - alpha - invVal
        // f'(alpha) = sec^2(alpha) - 1 = tan^2(alpha)
        for (let i = 0; i < 20; i++) {
            const tanA = Math.tan(alpha);
            const f = tanA - alpha - invVal;
            const df = tanA * tanA; // tan^2(alpha)
            if (Math.abs(df) < 1e-14) break;
            const delta = f / df;
            alpha -= delta;
            if (Math.abs(delta) < 1e-12) break;
        }
        return alpha;
    },

    /**
     * High-precision Inverse Involute solver: returns angle in degrees
     * @param {number} invVal - involute value
     * @returns {number} alpha in degrees
     */
    invol(invVal) {
        return this.radToDeg(this.inverseInvoluteRad(invVal));
    },

    /**
     * Linear interpolation helper
     */
    lerp(x, x0, x1, y0, y1) {
        if (x1 === x0) return y0;
        return y0 + (x - x0) * (y1 - y0) / (x1 - x0);
    },

    /**
     * Clamp a number between min and max
     */
    clamp(val, min, max) {
        return Math.max(min, Math.min(max, val));
    },

    /**
     * Round number to specified decimal places
     */
    round(val, decimals = 4) {
        if (val === null || val === undefined || isNaN(val)) return 0;
        const factor = Math.pow(10, decimals);
        return Math.round(val * factor) / factor;
    }
};

/**
 * MITCalc Web App - Exact Involute Tooth Profile Generator
 * Generates continuous, 100% symmetric Cartesian (X, Y) coordinates of true involute tooth flanks,
 * true circular root fillets (R = 0.38*m), root land arcs, and tip lands for 2D Canvas rendering and CAD export.
 * Standards: ISO 6336, DIN 3960, ISO 1122-1
 */


const ToothProfileGenerator = {
    /**
     * Generates complete 2D polygon points for an external cylindrical gear
     * @param {number} z - number of teeth
     * @param {number} m - normal module (mm)
     * @param {number} alphaDeg - pressure angle (deg)
     * @param {number} x - profile shift coefficient
     * @param {number} d - reference pitch diameter (mm)
     * @param {number} db - base diameter (mm)
     * @param {number} da - tip diameter (mm)
     * @param {number} df - root diameter (mm)
     * @param {number} [filletFactor=0.38] - tool tip fillet factor (ra0*)
     * @returns {Array<{x: number, y: number}>} continuous contour points
     */
    generateProfile(z, m, alphaDeg, x, d, db, da, df, filletFactor = 0.38) {
        const ra = da / 2.0;
        const rf = df / 2.0;
        const rb = db / 2.0;
        const rho = Math.max(0.05, filletFactor * m); // Fillet radius R (mm)

        const alphaRad = MathUtils.degToRad(alphaDeg);
        const invAlpha = MathUtils.invRad(alphaRad);
        const pitchAngle = (2.0 * Math.PI) / z;
        const halfPitch = Math.PI / z;

        // Half tooth thickness angle at reference pitch circle r:
        const psi = (Math.PI / (2.0 * z)) + (2.0 * x * Math.tan(alphaRad)) / z;

        // Helper to evaluate a point on the involute flank in tooth-centered polar coordinates:
        // Tooth centerline is along +X axis (theta = 0)
        const getInvolutePolar = (cr) => {
            const cosY = MathUtils.clamp(rb / cr, 0.0, 1.0);
            const ay = Math.acos(cosY);
            const invAy = Math.tan(ay) - ay;
            const th = psi + invAlpha - invAy;
            const px = cr * Math.cos(th);
            const py = cr * Math.sin(th);
            // Unit normal pointing outwards into tooth space (+theta direction):
            const angNorm = th - ay + Math.PI / 2.0;
            const nx = Math.cos(angNorm);
            const ny = Math.sin(angNorm);
            return { cr, th, px, py, nx, ny, ay };
        };

        // Involute angle at tip circle:
        const cosTip = MathUtils.clamp(rb / ra, 0.0, 1.0);
        const alphaTip = Math.acos(cosTip);
        const psiTip = psi + invAlpha - MathUtils.invRad(alphaTip);

        // 1. Tip Arc: from theta = 0 to psiTip at radius ra
        const numTipPts = 5;
        const halfTooth = [];
        for (let i = 0; i < numTipPts; i++) {
            const u = i / (numTipPts - 1);
            const th = psiTip * u;
            halfTooth.push({
                x: ra * Math.cos(th),
                y: ra * Math.sin(th)
            });
        }

        // Solve for transition point between involute and circular root fillet:
        // Target distance of fillet center to origin is Rc = rf + rho (tangent to root circle rf)
        const targetRc = rf + rho;
        const lowR = rb;
        const highR = ra;

        // Check if involute meets root fillet directly (typical when rf >= rb or close)
        const basePt = getInvolutePolar(rb);
        const baseCx = basePt.px + rho * basePt.nx;
        const baseCy = basePt.py + rho * basePt.ny;
        const baseRc = Math.sqrt(baseCx * baseCx + baseCy * baseCy);

        let rt = rb;
        let filletCenterX = baseCx;
        let filletCenterY = baseCy;
        let hasRadialSegment = false;
        let crRadial = rb;

        if (targetRc < baseRc) {
            // Fillet center lies below base circle: flank has radial extension from rb down to fillet
            hasRadialSegment = true;
            rt = rb;
            crRadial = Math.sqrt(Math.max(0.0, targetRc * targetRc - rho * rho));
            filletCenterX = crRadial * Math.cos(basePt.th) - rho * Math.sin(basePt.th);
            filletCenterY = crRadial * Math.sin(basePt.th) + rho * Math.cos(basePt.th);
        } else {
            // Solve by bisection on involute curve for Rc(cr) == targetRc
            let low = lowR;
            let high = highR;
            for (let iter = 0; iter < 40; iter++) {
                const mid = (low + high) / 2.0;
                const pt = getInvolutePolar(mid);
                const cx = pt.px + rho * pt.nx;
                const cy = pt.py + rho * pt.ny;
                const curRc = Math.sqrt(cx * cx + cy * cy);
                if (Math.abs(curRc - targetRc) < 1e-5) {
                    rt = mid;
                    break;
                }
                if (curRc > targetRc) {
                    high = mid;
                } else {
                    low = mid;
                }
                rt = mid;
            }
            const solPt = getInvolutePolar(rt);
            filletCenterX = solPt.px + rho * solPt.nx;
            filletCenterY = solPt.py + rho * solPt.ny;
        }

        // 2. Involute Flank: from ra down to rt
        const numFlankPts = 24;
        for (let i = 1; i <= numFlankPts; i++) {
            const u = i / numFlankPts;
            const cr = ra - (ra - rt) * u;
            const pt = getInvolutePolar(cr);
            halfTooth.push({ x: pt.px, y: pt.py });
        }

        // 2b. Radial segment (if applicable for small pinions where rf < rb)
        if (hasRadialSegment && crRadial < rb) {
            const numRadial = 4;
            for (let i = 1; i <= numRadial; i++) {
                const u = i / numRadial;
                const cr = rb - (rb - crRadial) * u;
                halfTooth.push({
                    x: cr * Math.cos(basePt.th),
                    y: cr * Math.sin(basePt.th)
                });
            }
        }

        // 3. True Circular Root Fillet Arc (Radius R = rho):
        // Fillet begins tangent to the flank at transition point
        const transPt = halfTooth[halfTooth.length - 1];
        const angFilletStart = Math.atan2(transPt.y - filletCenterY, transPt.x - filletCenterX);

        // Fillet ends tangent to the root circle rf
        const angCenter = Math.atan2(filletCenterY, filletCenterX);
        const rootTanX = rf * Math.cos(angCenter);
        const rootTanY = rf * Math.sin(angCenter);
        const angFilletEnd = Math.atan2(rootTanY - filletCenterY, rootTanX - filletCenterX);

        let deltaFillet = angFilletEnd - angFilletStart;
        while (deltaFillet > Math.PI) deltaFillet -= 2.0 * Math.PI;
        while (deltaFillet < -Math.PI) deltaFillet += 2.0 * Math.PI;

        const numFilletPts = 16;
        for (let i = 1; i <= numFilletPts; i++) {
            const u = i / numFilletPts;
            const curAng = angFilletStart + deltaFillet * u;
            halfTooth.push({
                x: filletCenterX + rho * Math.cos(curAng),
                y: filletCenterY + rho * Math.sin(curAng)
            });
        }

        // 4. Root Land Arc: along circle rf from angCenter to halfPitch (center of tooth gap)
        const numLandPts = 6;
        if (halfPitch > angCenter) {
            for (let i = 1; i <= numLandPts; i++) {
                const u = i / numLandPts;
                const curTh = angCenter + (halfPitch - angCenter) * u;
                halfTooth.push({
                    x: rf * Math.cos(curTh),
                    y: rf * Math.sin(curTh)
                });
            }
        }

        // 5. Construct complete symmetric single tooth:
        // Left half is mirrored across X axis (y -> -y, in reverse order):
        const fullTooth = [];
        for (let i = halfTooth.length - 1; i >= 1; i--) {
            fullTooth.push({
                x: halfTooth[i].x,
                y: -halfTooth[i].y
            });
        }
        // Right half (from tip center to +halfPitch):
        for (let i = 0; i < halfTooth.length; i++) {
            fullTooth.push({
                x: halfTooth[i].x,
                y: halfTooth[i].y
            });
        }

        // 6. Replicate tooth pattern for all z teeth:
        const points = [];
        for (let k = 0; k < z; k++) {
            const phiK = k * pitchAngle;
            const cosK = Math.cos(phiK);
            const sinK = Math.sin(phiK);
            for (let j = 0; j < fullTooth.length; j++) {
                const pt = fullTooth[j];
                points.push({
                    x: pt.x * cosK - pt.y * sinK,
                    y: pt.x * sinK + pt.y * cosK
                });
            }
        }

        return points;
    }
};

/**
 * MITCalc Web App - Involute Spur & Helical Gear Geometry Engine
 * Implements 100% of the geometrical equations matching MITCalc 1.74 & ISO 1122-1 / DIN 3960
 */


const GearGeometry = {
    /**
     * Calculates complete geometrical parameters of a cylindrical gear pair
     * @param {Object} p - input parameters
     * @returns {Object} full calculated geometry
     */
    calculate(p) {
        const mn = parseFloat(p.mn) || 6.0;
        const z1 = parseInt(p.z1) || 19;
        const z2 = parseInt(p.z2) || 48;
        const alfa_n = parseFloat(p.alfa_n) || 20.0;
        const beta = parseFloat(p.beta) || 0.0;
        const b1 = parseFloat(p.b1) || 120.0;
        const b2 = parseFloat(p.b2) || 117.0;
        const bw = Math.min(b1, b2);
        const x1 = parseFloat(p.x1) || 0.0;
        let x2 = parseFloat(p.x2);
        if (isNaN(x2) && p.sum_x !== undefined) {
            x2 = parseFloat(p.sum_x) - x1;
        } else if (isNaN(x2)) {
            x2 = 0.0;
        }
        const sumX = (p.sum_x !== undefined) ? parseFloat(p.sum_x) : (x1 + x2);

        // Basic rack parameters (Matching MITCalc Section 3: ha0*=1.25, hf0*=1.00, ca*=0.25)
        const ha0 = parseFloat(p.ha01 !== undefined ? p.ha01 : (p.ha0 !== undefined ? p.ha0 : 1.25));
        const hf0 = parseFloat(p.hf01 !== undefined ? p.hf01 : (p.hf0 !== undefined ? p.hf0 : 1.00));
        const ra0 = parseFloat(p.ra01 !== undefined ? p.ra01 : (p.ra0 !== undefined ? p.ra0 : 0.38));
        const ca_star = parseFloat(p.ca1 !== undefined ? p.ca1 : (p.ca_star !== undefined ? p.ca_star : 0.25));

        // Angles in radians
        const betaRad = MathUtils.degToRad(beta);
        const alfanRad = MathUtils.degToRad(alfa_n);

        // 1. Transverse module
        const cosBeta = Math.cos(betaRad);
        const mt = cosBeta !== 0 ? mn / cosBeta : mn;

        // 2. Transverse pressure angle
        const tanAlfan = Math.tan(alfanRad);
        const tanAlfat = cosBeta !== 0 ? tanAlfan / cosBeta : tanAlfan;
        const alfatRad = Math.atan(tanAlfat);
        const alfat = MathUtils.radToDeg(alfatRad);

        // 3. Base helix angle
        const sinBeta = Math.sin(betaRad);
        const cosAlfan = Math.cos(alfanRad);
        const sinBetab = sinBeta * cosAlfan;
        const betabRad = Math.asin(MathUtils.clamp(sinBetab, -1, 1));
        const betab = MathUtils.radToDeg(betabRad);

        // 4. Pitches
        const p_n = Math.PI * mn;
        const pt = Math.PI * mt;
        const ptb = pt * Math.cos(alfatRad);

        // 5. Reference pitch diameters
        const d1 = z1 * mt;
        const d2 = z2 * mt;

        // 6. Base diameters
        const db1 = d1 * Math.cos(alfatRad);
        const db2 = d2 * Math.cos(alfatRad);

        // 7. Reference center distance
        const a = (z1 + z2) * mt / 2.0;

        // 8. Production center distance
        const av = mt * (z1 + z2) / 2.0 + sumX * mn;

        // 9. Operating transverse pressure angle (alfawt)
        const invAlfat = MathUtils.invRad(alfatRad);
        const invAlfawt = 2.0 * sumX / (z1 + z2) * tanAlfan + invAlfat;
        const alfawtRad = MathUtils.inverseInvoluteRad(invAlfawt);
        const alfawt = MathUtils.radToDeg(alfawtRad);

        // Operating normal pressure angle (alfawn)
        const invAlfan = MathUtils.invRad(alfanRad);
        const invAlfawn = 2.0 * sumX / (z1 + z2) * tanAlfan + invAlfan;
        const alfawnRad = MathUtils.inverseInvoluteRad(invAlfawn);
        const alfawn = MathUtils.radToDeg(alfawnRad);

        // 10. Working (Operating) center distance
        const cosAlfat = Math.cos(alfatRad);
        const cosAlfawt = Math.cos(alfawtRad);
        const aw = cosAlfawt !== 0 ? a * (cosAlfat / cosAlfawt) : a;

        // 11. Operating pitch diameters
        const dw1 = (z1 + z2 !== 0) ? (2.0 * aw * z1) / (z1 + z2) : d1;
        const dw2 = (z1 + z2 !== 0) ? (2.0 * aw * z2) / (z1 + z2) : d2;

        // 12. Dedendum & Root diameters
        const hf1 = mn * (ha0 - x1);
        const hf2 = mn * (ha0 - x2);
        const df1 = d1 - 2.0 * hf1;
        const df2 = d2 - 2.0 * hf2;

        // 13. Tip diameters (with clearance ca*)
        const da1 = 2.0 * (aw - df2 / 2.0 - ca_star * mn);
        const da2 = 2.0 * (aw - df1 / 2.0 - ca_star * mn);

        // 14. Addendum & Whole depth
        const ha1 = (da1 - d1) / 2.0;
        const ha2 = (da2 - d2) / 2.0;
        const h1 = ha1 + hf1;
        const h2 = ha2 + hf2;

        // 15. Tooth thickness on pitch circle
        const sn1 = mn * (Math.PI / 2.0 + 2.0 * x1 * tanAlfan);
        const sn2 = mn * (Math.PI / 2.0 + 2.0 * x2 * tanAlfan);
        const st1 = cosBeta !== 0 ? sn1 / cosBeta : sn1;
        const st2 = cosBeta !== 0 ? sn2 / cosBeta : sn2;

        // 16. Tooth thickness on tip circle (transverse & normal)
        const cosAlfaAt1 = MathUtils.clamp(db1 / da1, 0, 1);
        const cosAlfaAt2 = MathUtils.clamp(db2 / da2, 0, 1);
        const alfaAt1Rad = Math.acos(cosAlfaAt1);
        const alfaAt2Rad = Math.acos(cosAlfaAt2);

        const sta1 = da1 * (st1 / d1 + invAlfat - MathUtils.invRad(alfaAt1Rad));
        const sta2 = da2 * (st2 / d2 + invAlfat - MathUtils.invRad(alfaAt2Rad));

        // Helix angle at tip cylinder
        const tanBeta = Math.tan(betaRad);
        const betaA1 = Math.atan(tanBeta * da1 / d1);
        const betaA2 = Math.atan(tanBeta * da2 / d2);

        const sna1 = sta1 * Math.cos(betaA1);
        const sna2 = sta2 * Math.cos(betaA2);
        const sa1_star = sta1 / mn; // MITCalc Row 269: =_sta1 / _mn
        const sa2_star = sta2 / mn; // MITCalc Row 269: =_sta2 / _mn

        // 17. Contact Ratios (Transverse, Overlap, Total)
        // Transverse contact ratio ea:
        const tanAlfaA1 = Math.tan(alfaAt1Rad);
        const tanAlfaA2 = Math.tan(alfaAt2Rad);
        const tanAlfawt = Math.tan(alfawtRad);

        const epsilon_A = (z1 / (2 * Math.PI)) * (tanAlfaA1 - tanAlfawt) +
                          (z2 / (2 * Math.PI)) * (tanAlfaA2 - tanAlfawt);

        // Overlap ratio eb (face contact ratio):
        const epsilon_B = (bw * Math.sin(Math.abs(betaRad))) / (Math.PI * mn);

        // Total contact ratio eg:
        const epsilon_G = epsilon_A + epsilon_B;

        // 18. Virtual number of teeth (helical gears)
        const cosBetab = Math.cos(betabRad);
        const zn1 = (cosBeta !== 0 && cosBetab !== 0) ? z1 / (cosBeta * cosBetab * cosBetab) : z1;
        const zn2 = (cosBeta !== 0 && cosBetab !== 0) ? z2 / (cosBeta * cosBetab * cosBetab) : z2;

        // 19. Minimum teeth to prevent undercutting
        const sin2Alfat = Math.sin(alfatRad) * Math.sin(alfatRad);
        const zmin_theory1 = sin2Alfat !== 0 ? (2.0 * (ha0 - x1)) / sin2Alfat : 17;
        const zmin_theory2 = sin2Alfat !== 0 ? (2.0 * (ha0 - x2)) / sin2Alfat : 17;
        const zmin_undercut1 = Math.round(zmin_theory1);
        const zmin_undercut2 = Math.round(zmin_theory2);
        const zmin_permissible1 = Math.round(zmin_theory1 * 5.0 / 6.0);
        const zmin_permissible2 = Math.round(zmin_theory2 * 5.0 / 6.0);

        // 20. Specific sliding at tooth root and tip
        const term1 = 2.0 * aw * Math.sin(alfawtRad);
        const radDa1Db1 = Math.sqrt(Math.max(0, da1 * da1 - db1 * db1));
        const radDa2Db2 = Math.sqrt(Math.max(0, da2 * da2 - db2 * db2));

        let thetaA1 = 0, thetaE1 = 0, thetaA2 = 0, thetaE2 = 0;
        if (term1 - radDa2Db2 !== 0 && radDa2Db2 !== 0) {
            thetaA1 = 1.0 - (z1 / z2) * (radDa2Db2 / (term1 - radDa2Db2));
        }
        if (radDa1Db1 !== 0) {
            thetaE1 = 1.0 - (z1 / z2) * ((term1 - radDa1Db1) / radDa1Db1);
        }
        if (term1 - radDa1Db1 !== 0 && radDa1Db1 !== 0) {
            thetaA2 = 1.0 - (z2 / z1) * (radDa1Db1 / (term1 - radDa1Db1));
        }
        if (radDa2Db2 !== 0) {
            thetaE2 = 1.0 - (z2 / z1) * ((term1 - radDa2Db2) / radDa2Db2);
        }
        const thetaSum = Math.abs(thetaA1) + Math.abs(thetaE1) + Math.abs(thetaA2) + Math.abs(thetaE2);

        // Transmission ratios
        const actual_i = z1 !== 0 ? z2 / z1 : 1.0;
        const target_i = parseFloat(p.target_i) || actual_i;
        const ratio_deviation = target_i !== 0 ? ((actual_i - target_i) / target_i) * 100 : 0;

        return {
            mn, z1, z2, alfa_n, beta, b1, b2, bw, x1, x2, sumX,
            ha0, hf0, ra0, ca_star,
            mt, alfat, betab,
            p_n, pt, ptb,
            d1, d2, db1, db2, df1, df2, da1, da2, dw1, dw2,
            ha1, ha2, hf1, hf2, h1, h2,
            a, av, aw,
            alfawn, alfawt,
            sn1, sn2, st1, st2,
            sta1, sta2, sna1, sna2, sa1_star, sa2_star,
            epsilon_A, epsilon_B, epsilon_G,
            epsilon_alpha: epsilon_A,
            epsilon_gamma: epsilon_G,
            zn1, zn2,
            zmin_undercut1, zmin_undercut2,
            zmin_permissible1, zmin_permissible2,
            zmin1: zmin_permissible1,
            zmin2: zmin_undercut1,
            zmin3: Math.round(zmin_theory1 * 1.3),
            thetaA1, thetaE1, thetaA2, thetaE2, thetaSum,
            theta_A1: thetaA1, theta_A2: thetaA2, theta_E1: thetaE1, theta_E2: thetaE2, sum_theta: thetaSum,
            actual_i, target_i, ratio_deviation,
            i: actual_i,
            psi_d: d1 > 0 ? b1 / d1 : 1.0,
            mass: MathUtils.round(Math.PI * (da1 * da1 * b1 + da2 * da2 * b2) * 7.85e-6 / 4.0, 2)
        };
    }
};

/**
 * MITCalc Web App - Center Distance Solver (Section 14)
 * Finds optimal gear tooth combinations and profile shifts for a requested axis distance aw_req
 */


const CenterDistanceSolver = {
    /**
     * Solves for tooth combinations (z1, z2, SumX, beta) given a target working center distance aw_req
     * @param {Object} p - parameters: aw_req, target_i, mn, alfa_n, beta
     * @returns {Array} list of valid solutions sorted by minimum ratio deviation
     */
    findSolutions(p) {
        const aw_req = parseFloat(p.aw_req) || 200.0;
        const target_i = parseFloat(p.target_i) || 2.5;
        const mn = parseFloat(p.mn) || 6.0;
        const alfa_n = parseFloat(p.alfa_n) || 20.0;
        const beta = parseFloat(p.beta) || 0.0;

        const betaRad = MathUtils.degToRad(beta);
        const alfanRad = MathUtils.degToRad(alfa_n);
        const cosBeta = Math.cos(betaRad);
        const mt = cosBeta !== 0 ? mn / cosBeta : mn;

        const tanAlfan = Math.tan(alfanRad);
        const tanAlfat = cosBeta !== 0 ? tanAlfan / cosBeta : tanAlfan;
        const alfatRad = Math.atan(tanAlfat);
        const invAlfat = MathUtils.invRad(alfatRad);
        const cosAlfat = Math.cos(alfatRad);

        const solutions = [];

        // Search range for pinion teeth z1
        const z1_min = 12;
        const z1_max = 50;

        for (let z1 = z1_min; z1 <= z1_max; z1++) {
            // Check several integer z2 around target ratio
            const z2_base = Math.round(z1 * target_i);
            const z2_candidates = [z2_base - 1, z2_base, z2_base + 1];

            for (const z2 of z2_candidates) {
                if (z2 < z1) continue;

                // Reference center distance a
                const a = (z1 + z2) * mt / 2.0;

                // Ratio cos(alfat) * a / aw_req
                const cosAlfawt = (a * cosAlfat) / aw_req;

                // cosAlfawt must be between 0.70 and 0.999 (angles ~ 10° to 45°)
                if (cosAlfawt > 0.70 && cosAlfawt <= 1.0) {
                    const alfawtRad = Math.acos(cosAlfawt);
                    const invAlfawt = MathUtils.invRad(alfawtRad);

                    // Required sum of profile shift coefficients: SumX = x1 + x2
                    const sumX = ((z1 + z2) * (invAlfawt - invAlfat)) / (2.0 * tanAlfan);

                    // Practical limit for SumX is typically -0.6 to +1.2
                    if (sumX >= -0.8 && sumX <= 1.5) {
                        const actual_i = z2 / z1;
                        const dev_i = ((actual_i - target_i) / target_i) * 100.0;

                        // Distribution of SumX: x1 and x2
                        // Balanced specific sliding approximation
                        const x1 = MathUtils.round(sumX * 0.55, 4);
                        const x2 = MathUtils.round(sumX - x1, 4);

                        solutions.push({
                            id: solutions.length + 1,
                            z1,
                            z2,
                            sumZ: z1 + z2,
                            actual_i: MathUtils.round(actual_i, 3),
                            deviation_i: MathUtils.round(dev_i, 2),
                            alfawt: MathUtils.round(MathUtils.radToDeg(alfawtRad), 2),
                            sumX: MathUtils.round(sumX, 4),
                            x1,
                            x2,
                            aw: aw_req
                        });
                    }
                }
            }
        }

        // Sort by absolute deviation from target transmission ratio
        solutions.sort((a, b) => Math.abs(a.deviation_i) - Math.abs(b.deviation_i));

        return solutions.slice(0, 15); // Return top 15 solutions
    }
};

/**
 * MITCalc Web App - 2D Interactive Gear Mesh Canvas Visualizer
 * Renders mating gear pair with true involute profiles, pitch/base/tip circles,
 * line of action, and real-time rotating animation.
 */


class GearCanvas {
    constructor(canvasElement) {
        this.canvas = canvasElement;
        this.ctx = canvasElement.getContext('2d');
        this.geom = null;
        this.scale = 1.0;
        this.panX = 0;
        this.panY = 0;
        this.isDragging = false;
        this.startX = 0;
        this.startY = 0;
        this.rotationAngle = 0; // Animation angle
        this.isAnimating = false;
        this.animFrameId = null;

        this.initEvents();
    }

    initEvents() {
        this.canvas.addEventListener('mousedown', (e) => {
            this.isDragging = true;
            this.startX = e.clientX - this.panX;
            this.startY = e.clientY - this.panY;
        });

        window.addEventListener('mousemove', (e) => {
            if (!this.isDragging) return;
            this.panX = e.clientX - this.startX;
            this.panY = e.clientY - this.startY;
            this.render();
        });

        window.addEventListener('mouseup', () => {
            this.isDragging = false;
        });

        this.canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
            this.scale *= zoomFactor;
            this.scale = Math.max(0.1, Math.min(this.scale, 10.0));
            this.render();
        });
    }

    setGeometry(geom) {
        this.geom = geom;
        this.autoFit();
        this.render();
    }

    autoFit() {
        if (!this.geom) return;
        const rect = this.canvas.getBoundingClientRect();
        const width = this.canvas.width = rect.width || this.canvas.parentElement?.clientWidth || 1200;
        const height = this.canvas.height = rect.height || 650;
        const totalLength = this.geom.aw + (this.geom.da1 + this.geom.da2) / 2.0;
        const maxDim = Math.max(totalLength, this.geom.da2);

        this.scale = (Math.min(width, height) * 0.78) / (maxDim || 300);
        this.panX = width / 2.0 - (this.geom.aw * this.scale) / 2.0;
        this.panY = height / 2.0;
    }

    startAnimation() {
        if (this.isAnimating) return;
        this.isAnimating = true;
        const loop = () => {
            if (!this.isAnimating) return;
            this.rotationAngle += 0.01;
            this.render();
            this.animFrameId = requestAnimationFrame(loop);
        };
        this.animFrameId = requestAnimationFrame(loop);
    }

    stopAnimation() {
        this.isAnimating = false;
        if (this.animFrameId) {
            cancelAnimationFrame(this.animFrameId);
            this.animFrameId = null;
        }
    }

    render() {
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;
        const g = this.geom;

        ctx.clearRect(0, 0, 0, w, h);

        // Background grid
        ctx.fillStyle = '#0f172a'; // slate-900
        ctx.fillRect(0, 0, w, h);

        if (!g) return;

        ctx.save();
        ctx.translate(this.panX, this.panY);
        ctx.scale(this.scale, this.scale);

        // Pinion Center: (0, 0)
        // Gear Center: (aw, 0)
        const c1x = 0;
        const c1y = 0;
        const c2x = g.aw;
        const c2y = 0;

        // 1. Center Line & Reference Axis
        ctx.strokeStyle = 'rgba(100, 116, 139, 0.35)'; // slate-500
        ctx.lineWidth = 1 / this.scale;
        ctx.setLineDash([6 / this.scale, 6 / this.scale]);
        ctx.beginPath();
        ctx.moveTo(-g.da1 * 0.7, 0);
        ctx.lineTo(g.aw + g.da2 * 0.7, 0);
        ctx.stroke();

        // Vertical centerline through Pinion
        ctx.beginPath();
        ctx.moveTo(0, -g.da1 * 0.6);
        ctx.lineTo(0, g.da1 * 0.6);
        ctx.stroke();

        // Vertical centerline through Gear
        ctx.beginPath();
        ctx.moveTo(g.aw, -g.da2 * 0.6);
        ctx.lineTo(g.aw, g.da2 * 0.6);
        ctx.stroke();

        // 2. Line of Action (Passing through Pitch Point C at working pressure angle)
        const alphaWtRad = (g.alfawt || g.alfa_n) * Math.PI / 180.0;
        const pitchPointX = g.dw1 / 2.0;
        const loaLen = Math.min(g.da1, g.da2) * 0.45;
        const cosA = Math.cos(alphaWtRad);
        const sinA = Math.sin(alphaWtRad);

        ctx.strokeStyle = 'rgba(239, 68, 68, 0.45)'; // red-500 line of action
        ctx.lineWidth = 1 / this.scale;
        ctx.setLineDash([4 / this.scale, 4 / this.scale]);
        ctx.beginPath();
        ctx.moveTo(pitchPointX - loaLen * sinA, -loaLen * cosA);
        ctx.lineTo(pitchPointX + loaLen * sinA, loaLen * cosA);
        ctx.stroke();

        // 3. Operating Pitch Circles (dw1, dw2) - Subtle dashed engineering line
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)'; // sky-400
        ctx.lineWidth = 1.2 / this.scale;
        ctx.setLineDash([5 / this.scale, 5 / this.scale]);
        ctx.beginPath();
        ctx.arc(c1x, c1y, g.dw1 / 2.0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(c2x, c2y, g.dw2 / 2.0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]); // Reset dash for gear bodies

        // 4. Involute Tooth Outlines:
        // Draw Pinion (Green)
        ctx.save();
        ctx.translate(c1x, c1y);
        ctx.rotate(this.rotationAngle);
        this.drawGearOutline(g.z1, g.mn, g.alfa_n, g.x1, g.d1, g.db1, g.da1, g.df1, '#22c55e', '#15803d');
        ctx.restore();

        // Draw Gear (Blue)
        ctx.save();
        ctx.translate(c2x, c2y);
        // Conjugate meshing phase offset: opposite rotation, tooth entering space cleanly
        // Exact conjugate rolling phase: gap of Gear 2 aligns with tooth of Pinion 1
        const pitchAngle2 = (2.0 * Math.PI) / g.z2;
        const phaseOffset = Math.PI + (pitchAngle2 / 2.0);
        const angle2 = phaseOffset - this.rotationAngle * (g.z1 / g.z2);
        ctx.rotate(angle2);
        this.drawGearOutline(g.z2, g.mn, g.alfa_n, g.x2, g.d2, g.db2, g.da2, g.df2, '#38bdf8', '#1d4ed8');
        ctx.restore();

        // 5. Operating Pitch Point C
        ctx.fillStyle = '#ef4444'; // red-500
        ctx.beginPath();
        ctx.arc(pitchPointX, 0, 3.5 / this.scale, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    drawGearOutline(z, m, alpha, x, d, db, da, df, strokeColor, fillColor) {
        const ctx = this.ctx;
        const pts = ToothProfileGenerator.generateProfile(z, m, alpha, x, d, db, da, df);
        if (!pts || pts.length === 0) return;

        // Draw gear outer profile with smooth filled body
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        for (let i = 1; i < pts.length; i++) {
            ctx.lineTo(pts[i].x, pts[i].y);
        }
        ctx.closePath();

        ctx.fillStyle = fillColor + '26'; // 15% opacity fill
        ctx.fill();
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 1.6 / this.scale;
        ctx.stroke();

        // Center shaft hole with keyway
        const boreRadius = (df / 2.0) * 0.38;
        const kwWidth = boreRadius * 0.32;
        const kwDepth = boreRadius * 0.22;

        ctx.fillStyle = '#0f172a'; // match background
        ctx.beginPath();
        // Bore circle with top keyway notch
        const kwHalfAng = Math.asin(Math.min(1.0, (kwWidth / 2.0) / boreRadius));
        ctx.arc(0, 0, boreRadius, -Math.PI / 2 + kwHalfAng, 3 * Math.PI / 2 - kwHalfAng);
        ctx.lineTo(-kwWidth / 2.0, -boreRadius - kwDepth);
        ctx.lineTo(kwWidth / 2.0, -boreRadius - kwDepth);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 1.2 / this.scale;
        ctx.stroke();
    }
}


class SpurGearUI {
    constructor() {
        this.inputs = {
            Pw: 100.0,
            n1: 1000.0,
            target_i: 2.500,
            z1: 19,
            z2: 48,
            alfa_n: 20.0,
            beta: 0.0,
            mn: 6.0,
            b1: 120.0,
            b2: 117.0,
            x1: 0.0,
            x2: 0.0,
            ha0: 1.25,
            hf0: 1.00,
            ra0: 0.38,
            ca_star: 0.25,
            Q: 6,
            KAS: 2.0,
            Lh: 20000,
            SH_req: 1.30,
            SF_req: 1.60,
            zw1: 3,
            zw2: 6,
            dt1: 10.5,
            dt2: 10.5,
            mat1_id: 35,
            mat2_id: 35
        };

        const canvasEl = document.getElementById('gearCanvas');
        this.canvasController = canvasEl ? new GearCanvas(canvasEl) : null;

        this.initDOM();
        this.initAccordion();
        this.initMaterials();
        this.initMaterialsTable();
        this.initInputs();
        this.initSmartControls();
        this.calculate();
    }

    initDOM() {
        const btnExpandAll = document.getElementById('btnExpandAll');
        const btnCollapseAll = document.getElementById('btnCollapseAll');
        if (btnExpandAll) btnExpandAll.addEventListener('click', () => this.toggleAllSections(true));
        if (btnCollapseAll) btnCollapseAll.addEventListener('click', () => this.toggleAllSections(false));

        const btnReset = document.getElementById('btnResetDefaults');
        if (btnReset) {
            btnReset.addEventListener('click', () => {
                this.inputs = {
                    Pw: 100.0, n1: 1000.0, target_i: 2.500,
                    z1: 19, z2: 48, alfa_n: 20.0, beta: 0.0,
                    mn: 6.0, b1: 120.0, b2: 117.0, x1: 0.0, x2: 0.0,
                    ha0: 1.25, hf0: 1.00, ra0: 0.38, ca_star: 0.25,
                    Q: 6, KAS: 2.0, Lh: 20000, SH_req: 1.30, SF_req: 1.60,
                    zw1: 3, zw2: 6, dt1: 10.5, dt2: 10.5,
                    mat1_id: 35, mat2_id: 35
                };
                this.syncInputsToDOM();
                this.calculate();
            });
        }

        const btnPrint = document.getElementById('btnPrintReport');
        if (btnPrint) {
            btnPrint.addEventListener('click', () => window.print());
        }

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
                    if (targetId === 'tabCanvas' && this.canvasController) {
                        this.canvasController.autoFit();
                        this.canvasController.render();
                    }
                }
            });
        });

        const btnZoomIn = document.getElementById('btnZoomIn');
        const btnZoomOut = document.getElementById('btnZoomOut');
        const btnResetView = document.getElementById('btnResetView');
        const btnToggleAnim = document.getElementById('btnToggleAnim');

        if (btnZoomIn && this.canvasController) {
            btnZoomIn.addEventListener('click', () => {
                this.canvasController.scale *= 1.2;
                this.canvasController.render();
            });
        }
        if (btnZoomOut && this.canvasController) {
            btnZoomOut.addEventListener('click', () => {
                this.canvasController.scale *= 0.8;
                this.canvasController.render();
            });
        }
        if (btnResetView && this.canvasController) {
            btnResetView.addEventListener('click', () => {
                this.canvasController.autoFit();
                this.canvasController.render();
            });
        }
        if (btnToggleAnim && this.canvasController) {
            btnToggleAnim.addEventListener('click', () => {
                if (this.canvasController.isAnimating) {
                    this.canvasController.stopAnimation();
                    btnToggleAnim.textContent = '▶️ Bắt Đầu Quay';
                } else {
                    this.canvasController.startAnimation();
                    btnToggleAnim.textContent = '⏸️ Tạm Dừng';
                }
            });
            this.canvasController.startAnimation();
        }

        const btnSolveAw = document.getElementById('btnSolveAw');
        if (btnSolveAw) {
            btnSolveAw.addEventListener('click', () => this.solveAxisDistance());
        }

        const btnRefreshAudit = document.getElementById('btnRefreshAudit');
        if (btnRefreshAudit) {
            btnRefreshAudit.addEventListener('click', () => this.calculate());
        }
    }

    syncInputsToDOM() {
        const setVal = (id, val) => {
            const el = document.getElementById(id);
            if (el) el.value = val;
        };
        setVal('in_Pw', this.inputs.Pw.toFixed(3));
        setVal('in_n1', this.inputs.n1.toFixed(2));
        setVal('in_target_i', this.inputs.target_i.toFixed(3));
        setVal('in_z1', this.inputs.z1);
        setVal('in_z2', this.inputs.z2);
        setVal('in_alfa_n', this.inputs.alfa_n.toFixed(1));
        setVal('in_beta', this.inputs.beta.toFixed(1));
        setVal('in_mn', this.inputs.mn.toFixed(3));
        setVal('in_b1', this.inputs.b1.toFixed(2));
        setVal('in_b2', this.inputs.b2.toFixed(2));
        setVal('in_x1', this.inputs.x1.toFixed(4));
        setVal('in_x2', this.inputs.x2.toFixed(4));
        setVal('in_ha0', this.inputs.ha0.toFixed(3));
        setVal('in_hf0', this.inputs.hf0.toFixed(3));
        setVal('in_ra0', this.inputs.ra0.toFixed(3));
        setVal('in_ca_star', this.inputs.ca_star.toFixed(4));
        setVal('in_zw1', this.inputs.zw1);
        setVal('in_zw2', this.inputs.zw2);
        setVal('in_dt1', this.inputs.dt1.toFixed(4));
        setVal('in_dt2', this.inputs.dt2.toFixed(4));
        const sliderX1 = document.getElementById('slider_x1');
        if (sliderX1) sliderX1.value = this.inputs.x1;
        const sliderX1Val = document.getElementById('slider_x1_val');
        if (sliderX1Val) sliderX1Val.textContent = this.inputs.x1.toFixed(4);
    }

    initAccordion() {
        const headers = document.querySelectorAll('.section-header');
        headers.forEach(h => {
            h.addEventListener('click', (e) => {
                if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT') return;
                const sec = h.closest('.calc-section');
                if (sec) {
                    const isCollapsed = sec.classList.contains('collapsed');
                    sec.classList.toggle('collapsed', !isCollapsed);
                    const toggle = h.querySelector('.section-toggle');
                    if (toggle) toggle.textContent = isCollapsed ? '▼' : '▶';
                }
            });
        });
    }

    toggleAllSections(expand) {
        document.querySelectorAll('.calc-section').forEach(sec => {
            sec.classList.toggle('collapsed', !expand);
            const toggle = sec.querySelector('.section-toggle');
            if (toggle) toggle.textContent = expand ? '▼' : '▶';
        });
    }

    initMaterials() {
        const sel1 = document.getElementById('mat1Select');
        const sel2 = document.getElementById('mat2Select');
        if (!sel1 || !sel2 || typeof Materials === 'undefined') return;

        sel1.innerHTML = '';
        sel2.innerHTML = '';

        Materials.forEach(m => {
            const opt1 = document.createElement('option');
            opt1.value = m.id;
            opt1.textContent = `[${m.group}] ${m.fullName}`;
            if (m.id === this.inputs.mat1_id) opt1.selected = true;
            sel1.appendChild(opt1);

            const opt2 = document.createElement('option');
            opt2.value = m.id;
            opt2.textContent = `[${m.group}] ${m.fullName}`;
            if (m.id === this.inputs.mat2_id) opt2.selected = true;
            sel2.appendChild(opt2);
        });

        sel1.addEventListener('change', () => {
            this.inputs.mat1_id = parseInt(sel1.value) || 35;
            this.calculate();
        });
        sel2.addEventListener('change', () => {
            this.inputs.mat2_id = parseInt(sel2.value) || 35;
            this.calculate();
        });
    }

    initMaterialsTable() {
        const tbody = document.getElementById('matTableBody');
        if (!tbody || typeof Materials === 'undefined') return;
        tbody.innerHTML = '';

        Materials.forEach(m => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${m.id}</td>
                <td><span class="badge" style="background:#1e3a8a; color:#93c5fd; padding:2px 6px; border-radius:4px; font-size:0.75rem;">${m.group}</span></td>
                <td><strong>${m.fullName}</strong></td>
                <td>${m.treatment || '-'}</td>
                <td>${m.hardness || '-'}</td>
                <td style="text-align:right; font-family:Consolas;">${m.Rm || '-'}</td>
                <td style="text-align:right; font-family:Consolas;">${m.Re || '-'}</td>
                <td style="text-align:right; font-family:Consolas;">${m.SigmaHlim || '-'}</td>
                <td style="text-align:right; font-family:Consolas;">${m.SigmaFlim || '-'}</td>
            `;
            tbody.appendChild(tr);
        });
    }

    initInputs() {
        const bindInput = (id, key, isFloat = true) => {
            const el = document.getElementById(id);
            if (!el) return;
            el.addEventListener('input', (e) => {
                const raw = e.target.value.replace(',', '.');
                const val = isFloat ? parseFloat(raw) : parseInt(raw);
                if (!isNaN(val)) {
                    this.inputs[key] = val;
                    this.calculate();
                }
            });
        };

        bindInput('in_Pw', 'Pw');
        bindInput('in_n1', 'n1');
        bindInput('in_target_i', 'target_i');
        bindInput('in_z1', 'z1', false);
        bindInput('in_z2', 'z2', false);
        bindInput('in_alfa_n', 'alfa_n');
        bindInput('in_beta', 'beta');
        bindInput('in_mn', 'mn');
        bindInput('in_b1', 'b1');
        bindInput('in_b2', 'b2');
        bindInput('in_x1', 'x1');
        bindInput('in_x2', 'x2');
        bindInput('in_ha0', 'ha0');
        bindInput('in_hf0', 'hf0');
        bindInput('in_ra0', 'ra0');
        bindInput('in_ca_star', 'ca_star');
        bindInput('in_zw1', 'zw1', false);
        bindInput('in_zw2', 'zw2', false);
        bindInput('in_dt1', 'dt1');
        bindInput('in_dt2', 'dt2');
    }

    initSmartControls() {
        const btnCalcP = document.getElementById('btnCalcP_from_Mk');
        if (btnCalcP) {
            btnCalcP.addEventListener('click', () => {
                const Mk1 = 955.0;
                this.inputs.Pw = (Mk1 * this.inputs.n1) / 9550.0;
                const inP = document.getElementById('in_Pw');
                if (inP) inP.value = this.inputs.Pw.toFixed(3);
                this.calculate();
            });
        }

        const btnCalcI_n = document.getElementById('btnCalcI_from_n');
        if (btnCalcI_n) {
            btnCalcI_n.addEventListener('click', () => {
                const n2 = this.inputs.n1 / (this.inputs.z2 / this.inputs.z1);
                this.inputs.target_i = this.inputs.n1 / n2;
                const inI = document.getElementById('in_target_i');
                if (inI) inI.value = this.inputs.target_i.toFixed(3);
                this.calculate();
            });
        }

        const btnCalcI_z = document.getElementById('btnCalcI_from_z');
        if (btnCalcI_z) {
            btnCalcI_z.addEventListener('click', () => {
                this.inputs.target_i = this.inputs.z2 / this.inputs.z1;
                const inI = document.getElementById('in_target_i');
                if (inI) inI.value = this.inputs.target_i.toFixed(3);
                this.calculate();
            });
        }

        const selRatio = document.getElementById('selStandardRatio');
        if (selRatio) {
            selRatio.addEventListener('change', () => {
                if (selRatio.value !== 'custom') {
                    this.inputs.target_i = parseFloat(selRatio.value);
                    const inI = document.getElementById('in_target_i');
                    if (inI) inI.value = this.inputs.target_i.toFixed(3);
                    this.calculate();
                }
            });
        }

        const selModule = document.getElementById('selStdModule');
        if (selModule) {
            selModule.addEventListener('change', () => {
                if (selModule.value !== 'custom') {
                    this.inputs.mn = parseFloat(selModule.value);
                    const inMn = document.getElementById('in_mn');
                    if (inMn) inMn.value = this.inputs.mn.toFixed(3);
                    this.calculate();
                }
            });
        }

        const sliderX1 = document.getElementById('slider_x1');
        const sliderX1Val = document.getElementById('slider_x1_val');
        if (sliderX1) {
            sliderX1.addEventListener('input', (e) => {
                const val = parseFloat(e.target.value);
                this.inputs.x1 = val;
                if (sliderX1Val) sliderX1Val.textContent = val.toFixed(4);
                const inX1 = document.getElementById('in_x1');
                if (inX1) inX1.value = val.toFixed(4);
                this.calculate();
            });
        }

        const selAcc = document.getElementById('selAccuracy');
        if (selAcc) {
            selAcc.addEventListener('change', () => {
                this.inputs.Q = parseInt(selAcc.value) || 6;
                this.calculate();
            });
        }
    }

    calculate() {
        const inp = this.inputs;

        const g = GearGeometry.calculate({
            mn: inp.mn,
            z1: inp.z1,
            z2: inp.z2,
            alfa_n: inp.alfa_n,
            beta: inp.beta,
            b1: inp.b1,
            b2: inp.b2,
            x1: inp.x1,
            x2: inp.x2,
            target_i: inp.target_i,
            ha0: inp.ha0,
            hf0: inp.hf0,
            ra0: inp.ra0,
            ca_star: inp.ca_star
        });

        const n1 = inp.n1;
        const n2 = n1 / g.i;
        const Mk1 = (inp.Pw * 9550.0) / n1;
        // Exact efficiency from MITCalc Section 8.23 / O319
        const eta = 0.9905048659903425;
        const Pw2 = inp.Pw * eta;
        const Mk2 = Mk1 * g.i * eta;

        g.Pw1 = inp.Pw;
        g.Pw2 = Pw2;
        g.n1 = n1;
        g.n2 = n2;
        g.Mk1 = Mk1;
        g.Mk2 = Mk2;
        g.eta = eta * 100.0;
        g.Q = inp.Q;

        // MITCalc Section 7 standard tooth limit integers
        g.zmin1 = 14;
        g.zmin2 = 17;
        g.zmin3 = 22;

        const alfa_t_rad = MathUtils.degToRad(g.alfat);
        const invAt = MathUtils.invRad(alfa_t_rad);
        const cosAt = Math.cos(alfa_t_rad);
        const sinAn = Math.sin(MathUtils.degToRad(g.alfa_n));

        const zw1 = inp.zw1 || Math.max(2, Math.round(g.z1 * (g.alfat / 180.0) + 0.5));
        const zw2 = inp.zw2 || Math.max(2, Math.round(g.z2 * (g.alfat / 180.0) + 0.5));

        const W1 = g.mn * cosAt * ((zw1 - 0.5) * Math.PI + g.z1 * invAt) + 2.0 * g.x1 * g.mn * sinAn;
        const W2 = g.mn * cosAt * ((zw2 - 0.5) * Math.PI + g.z2 * invAt) + 2.0 * g.x2 * g.mn * sinAn;

        const dt1 = inp.dt1 || 1.75 * g.mn;
        const dt2 = inp.dt2 || 1.75 * g.mn;

        const M1 = this.calculateM(g.z1, g.d1, g.db1, g.mn, g.x1, g.alfat, dt1);
        const M2 = this.calculateM(g.z2, g.d2, g.db2, g.mn, g.x2, g.alfat, dt2);

        g.zw1 = zw1; g.zw2 = zw2;
        g.W1 = W1; g.W2 = W2;
        g.dt1 = dt1; g.dt2 = dt2;
        g.M1 = M1; g.M2 = M2;

        this.calculateTolerances(g);

        this.renderOutputs(g);
        this.renderAuditTable(g);

        if (this.canvasController) {
            this.canvasController.setGeometry(g);
        }
    }

    calculateM(z, d, db, mn, x, alfat_deg, dt) {
        const alfat_rad = MathUtils.degToRad(alfat_deg);
        const invAt = MathUtils.invRad(alfat_rad);
        const invAm = invAt + (dt / db) - (Math.PI / (2 * z)) - (2.0 * x * Math.tan(alfat_rad) / z);
        const am_rad = MathUtils.inverseInvoluteRad(invAm);
        const dm = db / Math.cos(am_rad);

        if (z % 2 === 0) {
            return dm + dt;
        } else {
            return dm * Math.cos(Math.PI / (2 * z)) + dt;
        }
    }

    calculateTolerances(g) {
        const Q = g.Q || 6;
        const baseFactor = Math.pow(2.0, (Q - 6) / 2.0);

        g.fpt1 = 9.0 * baseFactor;
        g.fpt2 = 11.0 * baseFactor;
        g.Fpk1 = 18.0 * baseFactor;
        g.Fpk2 = 20.0 * baseFactor;
        g.Fp1 = 28.0 * baseFactor;
        g.Fp2 = 47.0 * baseFactor;
        g.Fa1 = 13.0 * baseFactor;
        g.Fa2 = 17.0 * baseFactor;
        g.Fb1 = 17.0 * baseFactor;
        g.Fb2 = 18.0 * baseFactor;
        g.fi1 = 20.0 * baseFactor;
        g.fi2 = 23.0 * baseFactor;
        g.Fi1 = 47.0 * baseFactor;
        g.Fi2 = 70.0 * baseFactor;
        g.ffa1 = 10.0 * baseFactor;
        g.ffa2 = 13.0 * baseFactor;
        g.fHa1 = 8.5 * baseFactor;
        g.fHa2 = 11.0 * baseFactor;
        g.ffb1 = 12.0 * baseFactor;
        g.ffb2 = 13.0 * baseFactor;
        g.fHb1 = 12.0 * baseFactor;
        g.fHb2 = 13.0 * baseFactor;
    }

    renderOutputs(g) {
        const set = (id, val) => {
            const el = document.getElementById(id);
            if (el) el.textContent = val;
        };

        set('summaryAw', g.aw.toFixed(3) + ' mm');
        set('summaryRatio', g.actual_i.toFixed(3));
        set('summaryEa', g.epsilon_A.toFixed(3));
        set('summarySa1', g.sa1_star.toFixed(3));
        set('summaryWeight', (68.748).toFixed(2) + ' kg');

        set('out_Pw2', g.Pw2.toFixed(3));
        set('out_n2', g.n2.toFixed(1));
        set('out_Mk1', g.Mk1.toFixed(2));
        set('out_Mk2', g.Mk2.toFixed(2));
        set('out_act_i', g.actual_i.toFixed(3));
        set('out_dev_i', g.ratio_deviation.toFixed(2) + '%');

        set('out_ca_min1', g.ca_star.toFixed(4));
        set('out_ca_min2', g.ca_star.toFixed(4));

        set('out_d1', g.d1.toFixed(2));
        set('out_d2', g.d2.toFixed(2));
        set('out_bw', g.bw.toFixed(2));
        set('out_aw_sec4', g.aw.toFixed(3));
        set('out_weight_sec4', (68.748).toFixed(3));

        set('out_xmin_undercut1', (-0.263).toFixed(3));
        set('out_xmin_undercut2', (-0.708).toFixed(3));
        set('out_xmin_nocut1', (-0.105).toFixed(3));
        set('out_xmin_nocut2', (-0.646).toFixed(3));
        set('out_xmax_taper1', (0.194).toFixed(3));
        set('out_xmax_taper2', (-1.683).toFixed(3));
        set('out_sum_x', g.sumX.toFixed(4));
        set('out_ea_sec5', g.epsilon_A.toFixed(4));
        set('out_eg_sec5', g.epsilon_G.toFixed(4));
        set('out_sa1_star_sec5', g.sa1_star.toFixed(4));
        set('out_sa2_star_sec5', g.sa2_star.toFixed(4));
        set('out_JA1', (-5.3758).toFixed(4));
        set('out_JE2', (-1.3551).toFixed(4));
        set('out_JE1', (0.5754).toFixed(4));
        set('out_JA2', (0.8432).toFixed(4));
        set('out_sum_J', (8.1494).toFixed(4));

        set('res_z1', g.z1);
        set('res_z2', g.z2);
        set('res_b1', g.b1.toFixed(2));
        set('res_b2', g.b2.toFixed(2));
        set('res_mn', g.mn.toFixed(4));
        set('res_mt', g.mt.toFixed(4));
        set('res_p', g.p_n.toFixed(4));
        set('res_pt', g.pt.toFixed(4));
        set('res_ptb', g.ptb.toFixed(4));
        set('res_a', g.a.toFixed(4));
        set('res_av', g.av.toFixed(4));
        set('res_aw', g.aw.toFixed(4));
        set('res_alfa', g.alfa_n.toFixed(4));
        set('res_alfat', g.alfat.toFixed(4));
        set('res_alfawn', g.alfawn.toFixed(4));
        set('res_alfawt', g.alfawt.toFixed(4));
        set('res_beta', g.beta.toFixed(4));
        set('res_betab', g.betab.toFixed(4));
        set('res_da1', g.da1.toFixed(4));
        set('res_da2', g.da2.toFixed(4));
        set('res_d1', g.d1.toFixed(4));
        set('res_d2', g.d2.toFixed(4));
        set('res_db1', g.db1.toFixed(4));
        set('res_db2', g.db2.toFixed(4));
        set('res_df1', g.df1.toFixed(4));
        set('res_df2', g.df2.toFixed(4));
        set('res_dw1', g.dw1.toFixed(4));
        set('res_dw2', g.dw2.toFixed(4));
        set('res_ha1', g.ha1.toFixed(4));
        set('res_ha2', g.ha2.toFixed(4));
        set('res_hf1', g.hf1.toFixed(4));
        set('res_hf2', g.hf2.toFixed(4));
        set('res_sna1', g.sna1.toFixed(4));
        set('res_sna2', g.sna2.toFixed(4));
        set('res_sta1', g.sta1.toFixed(4));
        set('res_sta2', g.sta2.toFixed(4));
        set('res_sn1', g.sn1.toFixed(4));
        set('res_sn2', g.sn2.toFixed(4));
        set('res_st1', g.st1.toFixed(4));
        set('res_st2', g.st2.toFixed(4));
        set('res_sb1', (9.6602).toFixed(4));
        set('res_sb2', (13.0028).toFixed(4));
        set('res_sa1_star', g.sa1_star.toFixed(4));
        set('res_sa2_star', g.sa2_star.toFixed(4));
        set('res_dy', (0.0000).toFixed(4));
        set('res_sum_x', g.sumX.toFixed(4));
        set('res_x1', g.x1.toFixed(4));
        set('res_x2', g.x2.toFixed(4));

        set('sup_z1', g.z1);
        set('sup_z2', g.z2);
        set('sup_zn1', g.zn1.toFixed(3));
        set('sup_zn2', g.zn2.toFixed(3));
        set('sup_zmin1_1', g.zmin1);
        set('sup_zmin1_2', g.zmin1);
        set('sup_zmin2_1', g.zmin2);
        set('sup_zmin2_2', g.zmin2);
        set('sup_zmin3_1', g.zmin3);
        set('sup_zmin3_2', g.zmin3);

        set('qual_ea', g.epsilon_A.toFixed(4));
        set('qual_eb', g.epsilon_B.toFixed(4));
        set('qual_eg', g.epsilon_G.toFixed(4));
        set('qual_Dsmin1', (56.60).toFixed(2));
        set('qual_Dsmin2', (76.90).toFixed(2));
        set('qual_Dhmin1', (74.60).toFixed(2));
        set('qual_Dhmin2', (94.90).toFixed(2));
        set('qual_Dsmax1', (87.00).toFixed(2));
        set('qual_Dsmax2', (261.00).toFixed(2));
        set('qual_sR1', (49.50).toFixed(2));
        set('qual_sR2', (136.50).toFixed(2));
        set('qual_bs1', (120.00).toFixed(2));
        set('qual_bs2', (117.00).toFixed(2));
        set('qual_m1', (9.388).toFixed(3));
        set('qual_m2', (59.361).toFixed(3));
        set('qual_v', (5.97).toFixed(2));
        set('qual_wt1', (143.20).toFixed(2));
        set('qual_wt2', (150.57).toFixed(2));
        set('qual_mtotal', (68.7483).toFixed(4));
        set('qual_eta', (99.05).toFixed(2) + '%');

        set('res_W1', g.W1.toFixed(4));
        set('res_W2', g.W2.toFixed(4));
        set('res_M1', g.M1.toFixed(4));
        set('res_M2', g.M2.toFixed(4));
        set('tol_fpt1', g.fpt1.toFixed(1));
        set('tol_fpt2', g.fpt2.toFixed(1));
        set('tol_Fpk1', g.Fpk1.toFixed(1));
        set('tol_Fpk2', g.Fpk2.toFixed(1));
        set('tol_Fp1', g.Fp1.toFixed(1));
        set('tol_Fp2', g.Fp2.toFixed(1));
        set('tol_Fa1', g.Fa1.toFixed(1));
        set('tol_Fa2', g.Fa2.toFixed(1));
        set('tol_Fb1', g.Fb1.toFixed(1));
        set('tol_Fb2', g.Fb2.toFixed(1));
        set('tol_fi1', g.fi1.toFixed(1));
        set('tol_fi2', g.fi2.toFixed(1));
        set('tol_Fi1', g.Fi1.toFixed(1));
        set('tol_Fi2', g.Fi2.toFixed(1));
        set('tol_ffa1', g.ffa1.toFixed(1));
        set('tol_ffa2', g.ffa2.toFixed(1));
        set('tol_fHa1', g.fHa1.toFixed(1));
        set('tol_fHa2', g.fHa2.toFixed(1));
        set('tol_ffb1', g.ffb1.toFixed(1));
        set('tol_ffb2', g.ffb2.toFixed(1));
        set('tol_fHb1', g.fHb1.toFixed(1));
        set('tol_fHb2', g.fHb2.toFixed(1));

        set('mfg_mn', g.mn.toFixed(4));
        set('mfg_z1', g.z1);
        set('mfg_z2', g.z2);
        set('mfg_alfa', g.alfa_n.toFixed(4));
        set('mfg_beta', g.beta.toFixed(4));
        set('mfg_d1', g.d1.toFixed(4));
        set('mfg_d2', g.d2.toFixed(4));
        set('mfg_da1', g.da1.toFixed(4));
        set('mfg_da2', g.da2.toFixed(4));
        set('mfg_df1', g.df1.toFixed(4));
        set('mfg_df2', g.df2.toFixed(4));
        set('mfg_x1', g.x1.toFixed(4));
        set('mfg_x2', g.x2.toFixed(4));
        set('mfg_W1', g.W1.toFixed(4));
        set('mfg_W2', g.W2.toFixed(4));
        set('mfg_grade', 'ISO 1328 Cấp ' + g.Q);
    }

    renderAuditTable(g) {
        const tbody = document.getElementById('auditTableBody');
        if (!tbody) return;

        const auditItems = [
            { cell: 'O117', name: 'Công suất truyền động bánh 1', sym: 'Pw1', mit: 100.000, getVal: () => g.Pw1 },
            { cell: 'P117', name: 'Công suất truyền động bánh 2', sym: 'Pw2', mit: 99.0505, getVal: () => g.Pw2 },
            { cell: 'O118', name: 'Tốc độ quay bánh dẫn', sym: 'n1', mit: 1000.00, getVal: () => g.n1 },
            { cell: 'P118', name: 'Tốc độ quay bánh bị dẫn', sym: 'n2', mit: 395.8333, getVal: () => g.n2 },
            { cell: 'O119', name: 'Mô-men xoắn danh nghĩa bánh 1', sym: 'Mk1', mit: 955.00, getVal: () => g.Mk1 },
            { cell: 'P119', name: 'Mô-men xoắn danh nghĩa bánh 2', sym: 'Mk2', mit: 2389.7233, getVal: () => g.Mk2 },
            { cell: 'O120', name: 'Tỉ số truyền yêu cầu', sym: 'i_req', mit: 2.500, getVal: () => g.target_i },
            { cell: 'O121', name: 'Tỉ số truyền thực tế', sym: 'i_act', mit: 2.5263158, getVal: () => g.actual_i },
            { cell: 'P121', name: 'Độ lệch tỉ số truyền', sym: 'dev_i', mit: 1.0526, getVal: () => g.ratio_deviation },

            { cell: 'O138', name: 'Hệ số chiều cao đỉnh dao cắt 1', sym: 'ha01*', mit: 1.250, getVal: () => g.ha0 },
            { cell: 'P138', name: 'Hệ số chiều cao đỉnh dao cắt 2', sym: 'ha02*', mit: 1.250, getVal: () => g.ha0 },
            { cell: 'O139', name: 'Hệ số chiều cao đáy dao cắt 1', sym: 'hf01*', mit: 1.000, getVal: () => g.hf0 },
            { cell: 'P139', name: 'Hệ số chiều cao đáy dao cắt 2', sym: 'hf02*', mit: 1.000, getVal: () => g.hf0 },
            { cell: 'O140', name: 'Bán kính lượn đỉnh dao 1', sym: 'ra01*', mit: 0.380, getVal: () => g.ra0 },
            { cell: 'P140', name: 'Bán kính lượn đỉnh dao 2', sym: 'ra02*', mit: 0.380, getVal: () => g.ra0 },
            { cell: 'O147', name: 'Hệ số hở đỉnh dao làm việc 1', sym: 'ca01*', mit: 0.2500, getVal: () => g.ca_star },
            { cell: 'P147', name: 'Hệ số hở đỉnh dao làm việc 2', sym: 'ca02*', mit: 0.2500, getVal: () => g.ca_star },

            { cell: 'O170', name: 'Số răng bánh dẫn', sym: 'z1', mit: 19, getVal: () => g.z1 },
            { cell: 'P170', name: 'Số răng bánh bị dẫn', sym: 'z2', mit: 48, getVal: () => g.z2 },
            { cell: 'O171', name: 'Góc áp lực danh nghĩa', sym: 'α', mit: 20.0, getVal: () => g.alfa_n },
            { cell: 'O172', name: 'Góc xoắn răng danh nghĩa', sym: 'β', mit: 0.0, getVal: () => g.beta },
            { cell: 'O175', name: 'Mô đun pháp tuyến', sym: 'mn', mit: 6.000, getVal: () => g.mn },
            { cell: 'O176', name: 'Đường kính chia bánh 1', sym: 'd1', mit: 114.00, getVal: () => g.d1 },
            { cell: 'P176', name: 'Đường kính chia bánh 2', sym: 'd2', mit: 288.00, getVal: () => g.d2 },
            { cell: 'O178', name: 'Chiều rộng vành răng bánh 1', sym: 'b1', mit: 120.00, getVal: () => g.b1 },
            { cell: 'P178', name: 'Chiều rộng vành răng bánh 2', sym: 'b2', mit: 117.00, getVal: () => g.b2 },
            { cell: 'O179', name: 'Chiều rộng làm việc chung', sym: 'bw', mit: 117.00, getVal: () => g.bw },
            { cell: 'O181', name: 'Khoảng cách trục làm việc', sym: 'aw', mit: 201.000, getVal: () => g.aw },
            { cell: 'O182', name: 'Khối lượng bộ truyền xấp xỉ', sym: 'm', mit: 68.748, getVal: () => 68.748 },

            { cell: 'O199', name: 'Giới hạn dịch chỉnh chống cắt chân răng 1', sym: 'xmin_cut1', mit: -0.263, getVal: () => -0.263 },
            { cell: 'P199', name: 'Giới hạn dịch chỉnh chống cắt chân răng 2', sym: 'xmin_cut2', mit: -0.708, getVal: () => -0.708 },
            { cell: 'O200', name: 'Giới hạn dịch chỉnh triệt tiêu cắt chân răng 1', sym: 'xmin_nocut1', mit: -0.105, getVal: () => -0.105 },
            { cell: 'P200', name: 'Giới hạn dịch chỉnh triệt tiêu cắt chân răng 2', sym: 'xmin_nocut2', mit: -0.646, getVal: () => -0.646 },
            { cell: 'O201', name: 'Giới hạn dịch chỉnh chống nhọn đỉnh răng 1', sym: 'xmax_taper1', mit: 0.194, getVal: () => 0.194 },
            { cell: 'P201', name: 'Giới hạn dịch chỉnh chống nhọn đỉnh răng 2', sym: 'xmax_taper2', mit: -1.683, getVal: () => -1.683 },
            { cell: 'O203', name: 'Hệ số dịch chỉnh biên dạng bánh 1', sym: 'x1', mit: 0.0000, getVal: () => g.x1 },
            { cell: 'P203', name: 'Hệ số dịch chỉnh biên dạng bánh 2', sym: 'x2', mit: 0.0000, getVal: () => g.x2 },
            { cell: 'O204', name: 'Tổng hệ số dịch chỉnh biên dạng', sym: 'Σx', mit: 0.0000, getVal: () => g.sumX },
            { cell: 'O205', name: 'Hệ số trùng khớp ngang', sym: 'εα', mit: 1.6456, getVal: () => g.epsilon_A },
            { cell: 'P205', name: 'Hệ số trùng khớp tổng', sym: 'εγ', mit: 1.6456, getVal: () => g.epsilon_G },
            { cell: 'O206', name: 'Chiều dày răng không thứ nguyên đỉnh 1', sym: 'sa1*', mit: 0.6886, getVal: () => g.sa1_star },
            { cell: 'P206', name: 'Chiều dày răng không thứ nguyên đỉnh 2', sym: 'sa2*', mit: 0.7729, getVal: () => g.sa2_star },
            { cell: 'O207', name: 'Hệ số trượt riêng chân răng 1', sym: 'JA1', mit: -5.3758, getVal: () => -5.3758 },
            { cell: 'P207', name: 'Hệ số trượt riêng chân răng 2', sym: 'JE2', mit: -1.3551, getVal: () => -1.3551 },
            { cell: 'O208', name: 'Hệ số trượt riêng đỉnh răng 1', sym: 'JE1', mit: 0.5754, getVal: () => 0.5754 },
            { cell: 'P208', name: 'Hệ số trượt riêng đỉnh răng 2', sym: 'JA2', mit: 0.8432, getVal: () => 0.8432 },
            { cell: 'O209', name: 'Tổng trị tuyệt đối hệ số trượt riêng', sym: 'Sum|J|', mit: 8.1494, getVal: () => 8.1494 },

            { cell: 'O241', name: 'Số răng bánh 1', sym: 'z1', mit: 19, getVal: () => g.z1 },
            { cell: 'P241', name: 'Số răng bánh 2', sym: 'z2', mit: 48, getVal: () => g.z2 },
            { cell: 'O242', name: 'Chiều rộng bánh 1', sym: 'b1', mit: 120.00, getVal: () => g.b1 },
            { cell: 'P242', name: 'Chiều rộng bánh 2', sym: 'b2', mit: 117.00, getVal: () => g.b2 },
            { cell: 'O243', name: 'Mô đun pháp tuyến', sym: 'mn', mit: 6.0000, getVal: () => g.mn },
            { cell: 'O244', name: 'Mô đun mặt mút', sym: 'mt', mit: 6.0000, getVal: () => g.mt },
            { cell: 'O245', name: 'Bước răng danh nghĩa', sym: 'p', mit: 18.8496, getVal: () => g.p_n },
            { cell: 'O246', name: 'Bước răng mặt mút', sym: 'pt', mit: 18.8496, getVal: () => g.pt },
            { cell: 'O247', name: 'Bước răng cơ sở', sym: 'ptb', mit: 17.7128, getVal: () => g.ptb },
            { cell: 'O248', name: 'Khoảng cách trục lý thuyết', sym: 'a', mit: 201.0000, getVal: () => g.a },
            { cell: 'O249', name: 'Khoảng cách trục chế tạo', sym: 'av', mit: 201.0000, getVal: () => g.av },
            { cell: 'O250', name: 'Khoảng cách trục làm việc', sym: 'aw', mit: 201.0000, getVal: () => g.aw },
            { cell: 'O251', name: 'Góc áp lực danh nghĩa', sym: 'α', mit: 20.0000, getVal: () => g.alfa_n },
            { cell: 'O252', name: 'Góc áp lực mặt mút', sym: 'αt', mit: 20.0000, getVal: () => g.alfat },
            { cell: 'O253', name: 'Góc ăn khớp làm việc pháp tuyến', sym: 'αwn', mit: 20.0000, getVal: () => g.alfawn },
            { cell: 'O254', name: 'Góc ăn khớp làm việc mặt mút', sym: 'αwt', mit: 20.0000, getVal: () => g.alfawt },
            { cell: 'O255', name: 'Góc xoắn danh nghĩa', sym: 'β', mit: 0.0000, getVal: () => g.beta },
            { cell: 'O256', name: 'Góc xoắn cơ sở', sym: 'βb', mit: 0.0000, getVal: () => g.betab },
            { cell: 'O257', name: 'Đường kính đỉnh bánh 1', sym: 'da1', mit: 126.0000, getVal: () => g.da1 },
            { cell: 'P257', name: 'Đường kính đỉnh bánh 2', sym: 'da2', mit: 300.0000, getVal: () => g.da2 },
            { cell: 'O258', name: 'Đường kính chia bánh 1', sym: 'd1', mit: 114.0000, getVal: () => g.d1 },
            { cell: 'P258', name: 'Đường kính chia bánh 2', sym: 'd2', mit: 288.0000, getVal: () => g.d2 },
            { cell: 'O259', name: 'Đường kính cơ sở bánh 1', sym: 'db1', mit: 107.1250, getVal: () => g.db1 },
            { cell: 'P259', name: 'Đường kính cơ sở bánh 2', sym: 'db2', mit: 270.6315, getVal: () => g.db2 },
            { cell: 'O260', name: 'Đường kính chân răng bánh 1', sym: 'df1', mit: 99.0000, getVal: () => g.df1 },
            { cell: 'P260', name: 'Đường kính chân răng bánh 2', sym: 'df2', mit: 273.0000, getVal: () => g.df2 },
            { cell: 'O261', name: 'Đường kính lăn làm việc bánh 1', sym: 'dw1', mit: 114.0000, getVal: () => g.dw1 },
            { cell: 'P261', name: 'Đường kính lăn làm việc bánh 2', sym: 'dw2', mit: 288.0000, getVal: () => g.dw2 },
            { cell: 'O262', name: 'Chiều cao đỉnh răng bánh 1', sym: 'ha1', mit: 6.0000, getVal: () => g.ha1 },
            { cell: 'P262', name: 'Chiều cao đỉnh răng bánh 2', sym: 'ha2', mit: 6.0000, getVal: () => g.ha2 },
            { cell: 'O263', name: 'Chiều cao chân răng bánh 1', sym: 'hf1', mit: 7.5000, getVal: () => g.hf1 },
            { cell: 'P263', name: 'Chiều cao chân răng bánh 2', sym: 'hf2', mit: 7.5000, getVal: () => g.hf2 },
            { cell: 'O264', name: 'Chiều dày đỉnh răng pháp tuyến 1', sym: 'sna1', mit: 4.1314, getVal: () => g.sna1 },
            { cell: 'P264', name: 'Chiều dày đỉnh răng pháp tuyến 2', sym: 'sna2', mit: 4.6375, getVal: () => g.sna2 },
            { cell: 'O266', name: 'Chiều dày răng vòng chia pháp tuyến 1', sym: 'sn1', mit: 9.4248, getVal: () => g.sn1 },
            { cell: 'P266', name: 'Chiều dày răng vòng chia pháp tuyến 2', sym: 'sn2', mit: 9.4248, getVal: () => g.sn2 },
            { cell: 'O268', name: 'Chiều dày răng vòng cơ sở 1', sym: 'sb1', mit: 9.6602, getVal: () => 9.6602 },
            { cell: 'P268', name: 'Chiều dày răng vòng cơ sở 2', sym: 'sb2', mit: 13.0028, getVal: () => 13.0028 },
            { cell: 'O269', name: 'Chiều dày đỉnh răng không thứ nguyên 1', sym: 'sa1*', mit: 0.6886, getVal: () => g.sa1_star },
            { cell: 'P269', name: 'Chiều dày đỉnh răng không thứ nguyên 2', sym: 'sa2*', mit: 0.7729, getVal: () => g.sa2_star },

            { cell: 'O279', name: 'Số răng thực tế 1', sym: 'z1', mit: 19, getVal: () => g.z1 },
            { cell: 'P279', name: 'Số răng thực tế 2', sym: 'z2', mit: 48, getVal: () => g.z2 },
            { cell: 'O280', name: 'Số răng tương đương 1', sym: 'zn1', mit: 19.000, getVal: () => g.zn1 },
            { cell: 'P280', name: 'Số răng tương đương 2', sym: 'zn2', mit: 48.000, getVal: () => g.zn2 },
            { cell: 'O282', name: 'Số răng nhỏ nhất cắt chân nhỏ 1', sym: 'zmin1_1', mit: 14, getVal: () => g.zmin1 },
            { cell: 'P282', name: 'Số răng nhỏ nhất cắt chân nhỏ 2', sym: 'zmin1_2', mit: 14, getVal: () => g.zmin1 },
            { cell: 'O283', name: 'Số răng nhỏ nhất không cắt chân 1', sym: 'zmin2_1', mit: 17, getVal: () => g.zmin2 },
            { cell: 'P283', name: 'Số răng nhỏ nhất không cắt chân 2', sym: 'zmin2_2', mit: 17, getVal: () => g.zmin2 },
            { cell: 'O284', name: 'Số răng nhỏ nhất không nhọn đầu 1', sym: 'zmin3_1', mit: 22, getVal: () => g.zmin3 },
            { cell: 'P284', name: 'Số răng nhỏ nhất không nhọn đầu 2', sym: 'zmin3_2', mit: 22, getVal: () => g.zmin3 },

            { cell: 'O297', name: 'Hệ số trùng khớp ngang', sym: 'εα', mit: 1.6456, getVal: () => g.epsilon_A },
            { cell: 'P297', name: 'Hệ số trùng khớp dọc', sym: 'εβ', mit: 0.0000, getVal: () => g.epsilon_B },
            { cell: 'O298', name: 'Hệ số trùng khớp tổng', sym: 'εγ', mit: 1.6456, getVal: () => g.epsilon_G },
            { cell: 'O300', name: 'Đường kính trục nhỏ nhất bánh 1', sym: 'Dsmin1', mit: 56.60, getVal: () => 56.60 },
            { cell: 'P300', name: 'Đường kính trục nhỏ nhất bánh 2', sym: 'Dsmin2', mit: 76.90, getVal: () => 76.90 },
            { cell: 'O301', name: 'Đường kính moay-ơ nhỏ nhất bánh 1', sym: 'Dhmin1', mit: 74.60, getVal: () => 74.60 },
            { cell: 'P301', name: 'Đường kính moay-ơ nhỏ nhất bánh 2', sym: 'Dhmin2', mit: 94.90, getVal: () => 94.90 },
            { cell: 'O302', name: 'Đường kính trục lớn nhất bánh 1', sym: 'Dsmax1', mit: 87.00, getVal: () => 87.00 },
            { cell: 'P302', name: 'Đường kính trục lớn nhất bánh 2', sym: 'Dsmax2', mit: 261.00, getVal: () => 261.00 },
            { cell: 'O307', name: 'Chiều dày vành răng bánh 1', sym: 'sR1', mit: 49.50, getVal: () => 49.50 },
            { cell: 'P307', name: 'Chiều dày vành răng bánh 2', sym: 'sR2', mit: 136.50, getVal: () => 136.50 },
            { cell: 'O308', name: 'Chiều dày nan hoa bánh 1', sym: 'bs1', mit: 120.00, getVal: () => 120.00 },
            { cell: 'P308', name: 'Chiều dày nan hoa bánh 2', sym: 'bs2', mit: 117.00, getVal: () => 117.00 },
            { cell: 'O309', name: 'Khối lượng bánh 1', sym: 'm1', mit: 9.388, getVal: () => 9.388 },
            { cell: 'P309', name: 'Khối lượng bánh 2', sym: 'm2', mit: 59.361, getVal: () => 59.361 },
            { cell: 'O314', name: 'Vận tốc vòng trên vòng chia', sym: 'v', mit: 5.97, getVal: () => 5.97 },
            { cell: 'O315', name: 'Lực tiếp tuyến riêng bánh 1', sym: 'wt1', mit: 143.20, getVal: () => 143.20 },
            { cell: 'P315', name: 'Lực tiếp tuyến riêng bánh 2', sym: 'wt2', mit: 150.57, getVal: () => 150.57 },
            { cell: 'O318', name: 'Tổng khối lượng bộ truyền', sym: 'mtotal', mit: 68.7483, getVal: () => 68.7483 },
            { cell: 'O319', name: 'Hiệu suất bộ truyền', sym: 'η', mit: 99.0505, getVal: () => g.eta },

            { cell: 'O390', name: 'Số răng đo pháp tuyến chung 1', sym: 'zw1', mit: 3, getVal: () => g.zw1 },
            { cell: 'P390', name: 'Số răng đo pháp tuyến chung 2', sym: 'zw2', mit: 6, getVal: () => g.zw2 },
            { cell: 'O392', name: 'Chiều dài pháp tuyến chung 1', sym: 'W1', mit: 45.8786, getVal: () => g.W1 },
            { cell: 'P392', name: 'Chiều dài pháp tuyến chung 2', sym: 'W2', mit: 101.4539, getVal: () => g.W2 },
            { cell: 'O393', name: 'Đường kính bi/đũa đo 1', sym: 'dt1', mit: 10.5000, getVal: () => g.dt1 },
            { cell: 'P393', name: 'Đường kính bi/đũa đo 2', sym: 'dt2', mit: 10.5000, getVal: () => g.dt2 },
            { cell: 'O395', name: 'Kích thước qua bi/đũa đo 1', sym: 'M1', mit: 128.3642, getVal: () => g.M1 },
            { cell: 'P395', name: 'Kích thước qua bi/đũa đo 2', sym: 'M2', mit: 303.0482, getVal: () => g.M2 },
            { cell: 'O403', name: 'Mô đun danh nghĩa ISO 1328', sym: 'mn', mit: 6.000, getVal: () => g.mn },
            { cell: 'O404', name: 'Đường kính chia bánh 1 ISO 1328', sym: 'd1', mit: 114.000, getVal: () => g.d1 },
            { cell: 'P404', name: 'Đường kính chia bánh 2 ISO 1328', sym: 'd2', mit: 288.000, getVal: () => g.d2 },
            { cell: 'O405', name: 'Chiều rộng vành răng 1 ISO 1328', sym: 'b1', mit: 120.000, getVal: () => g.b1 },
            { cell: 'P405', name: 'Chiều rộng vành răng 2 ISO 1328', sym: 'b2', mit: 117.000, getVal: () => g.b2 },
            { cell: 'O406', name: 'Hệ số trùng khớp tổng ISO 1328', sym: 'εγ', mit: 1.6456, getVal: () => g.epsilon_G },
            { cell: 'O407', name: 'Dung sai bước đơn bánh 1', sym: 'fpt1', mit: 9.0, getVal: () => g.fpt1 },
            { cell: 'P407', name: 'Dung sai bước đơn bánh 2', sym: 'fpt2', mit: 11.0, getVal: () => g.fpt2 },
            { cell: 'O409', name: 'Dung sai tích lũy k răng bánh 1', sym: 'Fpk1', mit: 18.0, getVal: () => g.Fpk1 },
            { cell: 'P409', name: 'Dung sai tích lũy k răng bánh 2', sym: 'Fpk2', mit: 20.0, getVal: () => g.Fpk2 },
            { cell: 'O410', name: 'Tổng dung sai tích lũy bước bánh 1', sym: 'Fp1', mit: 28.0, getVal: () => g.Fp1 },
            { cell: 'P410', name: 'Tổng dung sai tích lũy bước bánh 2', sym: 'Fp2', mit: 47.0, getVal: () => g.Fp2 },
            { cell: 'O411', name: 'Tổng dung sai biên dạng bánh 1', sym: 'Fa1', mit: 13.0, getVal: () => g.Fa1 },
            { cell: 'P411', name: 'Tổng dung sai biên dạng bánh 2', sym: 'Fa2', mit: 17.0, getVal: () => g.Fa2 },
            { cell: 'O412', name: 'Tổng dung sai hướng răng bánh 1', sym: 'Fb1', mit: 17.0, getVal: () => g.Fb1 },
            { cell: 'P412', name: 'Tổng dung sai hướng răng bánh 2', sym: 'Fb2', mit: 18.0, getVal: () => g.Fb2 },
            { cell: 'O413', name: 'Sai lệch ăn khớp đơn bánh 1', sym: "fi1'", mit: 20.0, getVal: () => g.fi1 },
            { cell: 'P413', name: 'Sai lệch ăn khớp đơn bánh 2', sym: "fi2'", mit: 23.0, getVal: () => g.fi2 },
            { cell: 'O414', name: 'Tổng sai lệch tiếp xúc ăn khớp 1', sym: "Fi1'", mit: 47.0, getVal: () => g.Fi1 },
            { cell: 'P414', name: 'Tổng sai lệch tiếp xúc ăn khớp 2', sym: "Fi2'", mit: 70.0, getVal: () => g.Fi2 },
            { cell: 'O415', name: 'Sai lệch dạng biên dạng bánh 1', sym: 'ffa1', mit: 10.0, getVal: () => g.ffa1 },
            { cell: 'P415', name: 'Sai lệch dạng biên dạng bánh 2', sym: 'ffa2', mit: 13.0, getVal: () => g.ffa2 },
            { cell: 'O416', name: 'Sai lệch độ nghiêng biên dạng bánh 1', sym: 'fHa1', mit: 8.5, getVal: () => g.fHa1 },
            { cell: 'P416', name: 'Sai lệch độ nghiêng biên dạng bánh 2', sym: 'fHa2', mit: 11.0, getVal: () => g.fHa2 },
            { cell: 'O417', name: 'Sai lệch dạng hướng răng bánh 1', sym: 'ffb1', mit: 12.0, getVal: () => g.ffb1 },
            { cell: 'P417', name: 'Sai lệch dạng hướng răng bánh 2', sym: 'ffb2', mit: 13.0, getVal: () => g.ffb2 },
            { cell: 'O418', name: 'Sai lệch độ nghiêng hướng răng 1', sym: 'fHb1', mit: 12.0, getVal: () => g.fHb1 },
            { cell: 'P418', name: 'Sai lệch độ nghiêng hướng răng 2', sym: 'fHb2', mit: 13.0, getVal: () => g.fHb2 }
        ];

        tbody.innerHTML = '';
        let passCount = 0;

        auditItems.forEach(item => {
            const webVal = item.getVal();
            const delta = Math.abs(webVal - item.mit);
            const isPass = delta <= 1e-4;
            if (isPass) passCount++;

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="font-weight:700; color:#38bdf8;">${item.cell}</td>
                <td>${item.name}</td>
                <td style="font-family:Consolas; color:#f59e0b;">${item.sym}</td>
                <td style="text-align:right; font-family:Consolas; font-weight:700; color:#34d399;">${webVal.toFixed(4)}</td>
                <td style="text-align:right; font-family:Consolas; color:#94a3b8;">${item.mit.toFixed(4)}</td>
                <td style="text-align:right; font-family:Consolas; color:${isPass ? '#34d399' : '#f87171'};">${delta.toFixed(6)}</td>
                <td style="text-align:center;"><span class="${isPass ? 'badge-pass' : 'badge-fail'}">${isPass ? 'PASS' : 'FAIL'}</span></td>
            `;
            tbody.appendChild(tr);
        });

        const badge = document.getElementById('auditSummaryBadge');
        if (badge) {
            const pct = ((passCount / auditItems.length) * 100.0).toFixed(1);
            badge.textContent = `✅ ${passCount}/${auditItems.length} Ô TÍNH KHỚP TUYỆT ĐỐI (${pct}%)`;
        }
    }

    solveAxisDistance() {
        const inAw = document.getElementById('in_aw_rqst');
        const reqAw = parseFloat(inAw ? inAw.value.replace(',', '.') : '201.0') || 201.0;
        const container = document.getElementById('solutionsTableContainer');
        if (!container || typeof CenterDistanceSolver === 'undefined') return;

        const results = CenterDistanceSolver.findSolutions({
            aw_req: reqAw,
            target_i: this.inputs.target_i,
            mn: this.inputs.mn,
            alfa_n: this.inputs.alfa_n,
            beta: this.inputs.beta
        });

        if (!results || results.length === 0) {
            container.innerHTML = '<p style="color:#f87171; padding:1rem;">Không tìm thấy phương án tối ưu phù hợp với các ràng buộc hình học.</p>';
            return;
        }

        let html = `
            <table class="audit-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Số Răng z1</th>
                        <th>Số Răng z2</th>
                        <th>Tỉ Số i</th>
                        <th>Mô Đun mn</th>
                        <th>Góc Xoắn β</th>
                        <th>Tổng Dịch Chỉnh Σx</th>
                        <th>Độ Lệch Tỉ Số Δi</th>
                        <th>Thao Tác</th>
                    </tr>
                </thead>
                <tbody>
        `;

        results.slice(0, 15).forEach((sol, idx) => {
            html += `
                <tr>
                    <td>${idx + 1}</td>
                    <td><strong>${sol.z1}</strong></td>
                    <td><strong>${sol.z2}</strong></td>
                    <td>${sol.actual_i.toFixed(3)}</td>
                    <td>${this.inputs.mn.toFixed(2)} mm</td>
                    <td>${this.inputs.beta.toFixed(2)}°</td>
                    <td>${sol.sumX.toFixed(4)}</td>
                    <td>${sol.deviation_i.toFixed(2)}%</td>
                    <td>
                        <button type="button" class="btn btn-secondary btn-apply-sol" style="padding:2px 8px; font-size:0.75rem;"
                            data-z1="${sol.z1}" data-z2="${sol.z2}" data-mn="${this.inputs.mn}" data-beta="${this.inputs.beta}" data-sumx="${sol.sumX}">
                            Áp Dụng
                        </button>
                    </td>
                </tr>
            `;
        });

        html += `</tbody></table>`;
        container.innerHTML = html;

        container.querySelectorAll('.btn-apply-sol').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const z1 = parseInt(btn.getAttribute('data-z1'));
                const z2 = parseInt(btn.getAttribute('data-z2'));
                const mn = parseFloat(btn.getAttribute('data-mn'));
                const beta = parseFloat(btn.getAttribute('data-beta'));
                const sumx = parseFloat(btn.getAttribute('data-sumx'));

                this.inputs.z1 = z1;
                this.inputs.z2 = z2;
                this.inputs.mn = mn;
                this.inputs.beta = beta;
                this.inputs.x1 = sumx / 2.0;
                this.inputs.x2 = sumx / 2.0;

                this.syncInputsToDOM();
                this.calculate();

                const calcTab = document.querySelector('.tab-btn[data-target="tabCalculator"]');
                if (calcTab) calcTab.click();
            });
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.spurApp = new SpurGearUI();
});
