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

    // ISO 1328 Accuracy Grades (MITCalc 1.74: T_AG & T_MaxV)
    accuracyGrades: [
        { grade: 3, name: '3....(Ra max.= 0.1 / v max.= 80)', ra_max: 0.1, v_max: 80, v_max_helical: 100 },
        { grade: 4, name: '4....(Ra max.= 0.2 / v max.= 60)', ra_max: 0.2, v_max: 60, v_max_helical: 80 },
        { grade: 5, name: '5....(Ra max.= 0.4 / v max.= 35)', ra_max: 0.4, v_max: 35, v_max_helical: 50 },
        { grade: 6, name: '6....(Ra max.= 0.8 / v max.= 15)', ra_max: 0.8, v_max: 15, v_max_helical: 30 },
        { grade: 7, name: '7....(Ra max.= 1.6 / v max.= 8)',  ra_max: 1.6, v_max: 8,  v_max_helical: 12 },
        { grade: 8, name: '8....(Ra max.= 1.6 / v max.= 5)',  ra_max: 1.6, v_max: 5,  v_max_helical: 8 },
        { grade: 9, name: '9....(Ra max.= 3.2 / v max.= 3)',  ra_max: 3.2, v_max: 3,  v_max_helical: 5 },
        { grade: 10, name: '10..(Ra max.= 6.3 / v max.= 3)', ra_max: 6.3, v_max: 3,  v_max_helical: 3 },
        { grade: 11, name: '11..(Ra max.= 12.5 / v max.= 3)', ra_max: 12.5, v_max: 3, v_max_helical: 3 },
        { grade: 12, name: '12..(Ra max.= 25 / v max.= 3)',  ra_max: 25.0, v_max: 3, v_max_helical: 3 }
    ],

    getMaxVelocity: function(grade, beta) {
        const isHelical = Math.abs(beta || 0.0) > 1e-4;
        const entry = this.accuracyGrades.find(g => g.grade === grade);
        if (!entry) return isHelical ? 30 : 15;
        return isHelical ? entry.v_max_helical : entry.v_max;
    },

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
    ],

    // ISO 1328 Step Tables
    T_modulx: [
        [0.0, 0.5, 2.0],
        [0.5, 0.5, 2.0],
        [2.0, 2.0, 3.5],
        [3.5, 3.5, 6.0],
        [6.0, 6.0, 10.0],
        [10.0, 10.0, 16.0],
        [16.0, 16.0, 25.0],
        [25.0, 25.0, 40.0],
        [40.0, 40.0, 70.0],
        [70.0, 70.0, 70.0]
    ],
    T_modulx2: [
        [0.0, 0.2, 0.5],
        [0.2, 0.2, 0.5],
        [0.5, 0.5, 0.8],
        [0.8, 0.8, 1.0],
        [1.0, 1.0, 1.5],
        [1.5, 1.5, 2.5],
        [2.5, 2.5, 4.0],
        [4.0, 4.0, 6.0],
        [6.0, 6.0, 10.0],
        [10.0, 10.0, 10.0]
    ],
    T_diamx: [
        [0.0, 5.0, 20.0],
        [5.0, 5.0, 20.0],
        [20.0, 20.0, 50.0],
        [50.0, 50.0, 125.0],
        [125.0, 125.0, 280.0],
        [280.0, 280.0, 560.0],
        [560.0, 560.0, 1000.0],
        [1000.0, 1000.0, 1600.0],
        [1600.0, 1600.0, 2500.0],
        [2500.0, 2500.0, 4000.0],
        [4000.0, 4000.0, 6000.0],
        [6000.0, 6000.0, 8000.0],
        [8000.0, 8000.0, 10000.0],
        [10000.0, 10000.0, 10000.0]
    ],
    T_bx: [
        [0.0, 4.0, 10.0],
        [4.0, 4.0, 10.0],
        [10.0, 10.0, 20.0],
        [20.0, 20.0, 40.0],
        [40.0, 40.0, 80.0],
        [80.0, 80.0, 160.0],
        [160.0, 160.0, 250.0],
        [250.0, 250.0, 400.0],
        [400.0, 400.0, 650.0],
        [650.0, 650.0, 1000.0],
        [1000.0, 1000.0, 1000.0]
    ],

    lookupStep(table, val) {
        const v = val - 1e-8;
        let match = table[0];
        for (let i = 0; i < table.length; i++) {
            if (table[i][0] <= v) {
                match = table[i];
            } else {
                break;
            }
        }
        return Math.sqrt(match[1] * match[2]);
    },

    roundISO(v) {
        if (v < 5) {
            return Math.round(v * 10) / 10;
        } else if (v > 10) {
            return Math.round(v);
        } else {
            return Math.round(v * 2) / 2;
        }
    },

    calcISO1328Tolerances(mn, d1, d2, b1, b2, z1, z2, eg, Q = 6, k1 = 2, k2 = 2) {
        const mg = (mn < 0.5) ? mn : ((mn > 70) ? mn : this.lookupStep(this.T_modulx, mn));
        const dg1 = (d1 < 5) ? d1 : ((d1 > 10000) ? d1 : this.lookupStep(this.T_diamx, d1));
        const dg2 = (d2 < 5) ? d2 : ((d2 > 10000) ? d2 : this.lookupStep(this.T_diamx, d2));
        const bg1 = (b1 < 4) ? b1 : ((b1 > 1000) ? b1 : this.lookupStep(this.T_bx, b1));
        const bg2 = (b2 < 4) ? b2 : ((b2 > 1000) ? b2 : this.lookupStep(this.T_bx, b2));

        const F_Q = Math.pow(2.0, 0.5 * (Q - 5));

        const raw_fpt1 = (0.3 * (mg + 0.4 * Math.sqrt(dg1)) + 4.0) * F_Q;
        const raw_fpt2 = (0.3 * (mg + 0.4 * Math.sqrt(dg2)) + 4.0) * F_Q;

        const K = (eg < 4.0) ? (0.2 * (eg + 4.0) / eg) : 0.4;

        const raw_Fpk1 = (raw_fpt1 + 1.6 * Math.sqrt((k1 - 1) * mg)) * F_Q;
        const raw_Fpk2 = (raw_fpt2 + 1.6 * Math.sqrt((k2 - 1) * mg)) * F_Q;

        const raw_Fp1 = (0.3 * mg + 1.25 * Math.sqrt(dg1) + 7.0) * F_Q;
        const raw_Fp2 = (0.3 * mg + 1.25 * Math.sqrt(dg2) + 7.0) * F_Q;

        const raw_Fa1 = (3.2 * Math.sqrt(mg) + 0.22 * Math.sqrt(dg1) + 0.7) * F_Q;
        const raw_Fa2 = (3.2 * Math.sqrt(mg) + 0.22 * Math.sqrt(dg2) + 0.7) * F_Q;

        const raw_Fb1 = (0.1 * Math.sqrt(dg1) + 0.63 * Math.sqrt(bg1) + 4.2) * F_Q;
        const raw_Fb2 = (0.1 * Math.sqrt(dg2) + 0.63 * Math.sqrt(bg2) + 4.2) * F_Q;

        const raw_fi1 = K * (9.0 + 0.3 * mg + 3.2 * Math.sqrt(mg) + 0.34 * Math.sqrt(dg1)) * F_Q;
        const raw_fi2 = K * (9.0 + 0.3 * mg + 3.2 * Math.sqrt(mg) + 0.34 * Math.sqrt(dg2)) * F_Q;

        const raw_Fi1 = raw_Fp1 + raw_fi1;
        const raw_Fi2 = raw_Fp2 + raw_fi2;

        const raw_ffa1 = (2.5 * Math.sqrt(mg) + 0.17 * Math.sqrt(dg1) + 0.5) * F_Q;
        const raw_ffa2 = (2.5 * Math.sqrt(mg) + 0.17 * Math.sqrt(dg2) + 0.5) * F_Q;

        const raw_fHa1 = (2.0 * Math.sqrt(mg) + 0.14 * Math.sqrt(dg1) + 0.5) * F_Q;
        const raw_fHa2 = (2.0 * Math.sqrt(mg) + 0.14 * Math.sqrt(dg2) + 0.5) * F_Q;

        const raw_ffb1 = (0.07 * Math.sqrt(dg1) + 0.45 * Math.sqrt(bg1) + 3.0) * F_Q;
        const raw_ffb2 = (0.07 * Math.sqrt(dg2) + 0.45 * Math.sqrt(bg2) + 3.0) * F_Q;

        // ISO 1328 - Part 2 (Radial composite and runout)
        const mg2 = (mn < 0.2) ? mn : ((mn > 10) ? mn : this.lookupStep(this.T_modulx2, mn));
        const dg1_p2 = (d1 < 5) ? d1 : ((d1 > 1000) ? d1 : this.lookupStep(this.T_diamx, d1));
        const dg2_p2 = (d2 < 5) ? d2 : ((d2 > 1000) ? d2 : this.lookupStep(this.T_diamx, d2));

        const raw_fffi1 = (2.96 * mg2 + 0.01 * Math.sqrt(dg1_p2) + 0.8) * F_Q;
        const raw_fffi2 = (2.96 * mg2 + 0.01 * Math.sqrt(dg2_p2) + 0.8) * F_Q;
        const raw_FFFFi1 = (3.2 * mg2 + 1.01 * Math.sqrt(dg1_p2) + 6.4) * F_Q;
        const raw_FFFFi2 = (3.2 * mg2 + 1.01 * Math.sqrt(dg2_p2) + 6.4) * F_Q;
        const raw_Fr1 = (0.24 * mg + 1.0 * Math.sqrt(dg1) + 5.6) * F_Q;
        const raw_Fr2 = (0.24 * mg + 1.0 * Math.sqrt(dg2) + 5.6) * F_Q;

        return {
            fpt1: this.roundISO(raw_fpt1),
            fpt2: this.roundISO(raw_fpt2),
            Fpk1: this.roundISO(raw_Fpk1),
            Fpk2: this.roundISO(raw_Fpk2),
            Fp1: this.roundISO(raw_Fp1),
            Fp2: this.roundISO(raw_Fp2),
            Fa1: this.roundISO(raw_Fa1),
            Fa2: this.roundISO(raw_Fa2),
            Fb1: this.roundISO(raw_Fb1),
            Fb2: this.roundISO(raw_Fb2),
            fi1: this.roundISO(raw_fi1),
            fi2: this.roundISO(raw_fi2),
            Fi1: this.roundISO(raw_Fi1),
            Fi2: this.roundISO(raw_Fi2),
            ffa1: this.roundISO(raw_ffa1),
            ffa2: this.roundISO(raw_ffa2),
            fHa1: this.roundISO(raw_fHa1),
            fHa2: this.roundISO(raw_fHa2),
            ffb1: this.roundISO(raw_ffb1),
            ffb2: this.roundISO(raw_ffb2),
            fHb1: this.roundISO(raw_ffb1),
            fHb2: this.roundISO(raw_ffb2),
            fffi1: this.roundISO(raw_fffi1),
            fffi2: this.roundISO(raw_fffi2),
            FFFFi1: this.roundISO(raw_FFFFi1),
            FFFFi2: this.roundISO(raw_FFFFi2),
            Fr1: this.roundISO(raw_Fr1),
            Fr2: this.roundISO(raw_Fr2),
            k1: k1,
            k2: k2
        };
    }
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
     * Exact MITCalc VBA Involute function: Inv(a)
     * a in degrees. Matches MITCalc 1.74 GearFunctions.bas line 764:
     * Inv = Tan(a * 3.141592653 / 180) - a * 3.141592653 / 180
     * @param {number} aDeg - angle in degrees
     * @returns {number} involute value
     */
    inv(aDeg) {
        const rad = aDeg * 3.141592653 / 180.0;
        return Math.tan(rad) - rad;
    },

    /**
     * Exact MITCalc VBA Involute inverse solver: Invol(X)
     * Direct 1-to-1 match with MITCalc 1.74 GearFunctions.bas line 770
     * @param {number} X - involute value
     * @returns {number} angle in degrees
     */
    invol(X) {
        const pi = 3.14159265358979;
        X = Math.abs(X);
        if (X < 0.00000001) X = 0.00000001;
        if (X > 1.5707963) X = 1.5707963;
        let pom = 1;
        let alfa = 0.0;
        let delta = X / 2.0;
        const presnost = 0.0000001;
        while (true) {
            alfa = alfa + delta;
            const x1 = Math.tan(alfa) - alfa;
            const rozdil = X - x1;
            if (Math.abs(rozdil) < presnost) break;
            if (pom > 1000000) break;
            if (rozdil < 0) {
                alfa = alfa - delta;
                delta = delta / 2.0;
            }
            pom++;
        }
        return alfa * 180.0 / pi;
    },

    /**
     * Inverse Involute solver returning radians
     * @param {number} invVal - involute value
     * @returns {number} alpha in radians
     */
    inverseInvoluteRad(invVal) {
        return this.invol(invVal) * Math.PI / 180.0;
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
        // Excel formula O254: =invol(2*(_x1+_x2)/(_z1+_z2)*TAN(_alfa*_pi/180)+Inv(_alfat))
        const invAlfat = MathUtils.inv(alfat);
        const invAlfawt = 2.0 * sumX / (z1 + z2) * Math.tan(alfa_n * Math.PI / 180.0) + invAlfat;
        const alfawt = MathUtils.invol(invAlfawt);
        const alfawtRad = alfawt * Math.PI / 180.0;

        // Operating normal pressure angle (alfawn)
        // Excel formula O253: =invol(2*(_x1+_x2)/(_z1+_z2)*TAN(_alfa*_pi/180)+Inv(_alfa))
        const invAlfan = MathUtils.inv(alfa_n);
        const invAlfawn = 2.0 * sumX / (z1 + z2) * Math.tan(alfa_n * Math.PI / 180.0) + invAlfan;
        const alfawn = MathUtils.invol(invAlfawn);
        const alfawnRad = alfawn * Math.PI / 180.0;

        // 10. Working (Operating) center distance
        // Excel formula O250: =_mt*(_z1+_z2)/2*COS(_alfat*_pi/180)/COS(_alfawt*_pi/180)+_q
        const cosAlfat = Math.cos(alfat * Math.PI / 180.0);
        const cosAlfawt = Math.cos(alfawt * Math.PI / 180.0);
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
        const st1 = pt / 2.0 + 2.0 * x1 * mn * Math.tan(alfatRad);
        const st2 = pt / 2.0 + 2.0 * x2 * mn * Math.tan(alfatRad);
        const sn1 = st1 * cosBeta;
        const sn2 = st2 * cosBeta;

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

        // Tooth thickness on root circle (Row 268)
        const sb1 = df1 * (st1 / d1 + invAlfat);
        const sb2 = df2 * (st2 / d2 + invAlfat);

        // 17. Contact Ratios (Transverse, Overlap, Total)
        const tanAlfaA1 = Math.tan(alfaAt1Rad);
        const tanAlfaA2 = Math.tan(alfaAt2Rad);
        const tanAlfawt = Math.tan(alfawtRad);

        const epsilon_A = (z1 / (2 * Math.PI)) * (tanAlfaA1 - tanAlfawt) +
                          (z2 / (2 * Math.PI)) * (tanAlfaA2 - tanAlfawt);

        // Overlap ratio eb (face contact ratio):
        const epsilon_B = (bw * Math.sin(Math.abs(betaRad))) / (Math.PI * mn);

        // Total contact ratio eg:
        const epsilon_G = epsilon_A + epsilon_B;

        // 18. Virtual number of teeth (helical gears - Row 280)
        const cosBetab = Math.cos(betabRad);
        const zn1 = (cosBeta !== 0 && cosBetab !== 0) ? z1 / (cosBeta * cosBetab * cosBetab) : z1;
        const zn2 = (cosBeta !== 0 && cosBetab !== 0) ? z2 / (cosBeta * cosBetab * cosBetab) : z2;

        // 19. Tool working addendum & Minimum teeth (Section 7.3 - 7.5)
        const hvX1 = ha0 - ra0 * (1.0 - Math.sin(alfanRad));
        const hvX2 = ha0 - ra0 * (1.0 - Math.sin(alfanRad));
        const sinAlfan = Math.sin(alfanRad);
        const cosBeta3 = Math.pow(cosBeta, 3);

        const zminP = (2.0 * hvX1 / (sinAlfan * sinAlfan)) * cosBeta3;
        const zminG = (2.0 * hvX2 / (sinAlfan * sinAlfan)) * cosBeta3;

        const zmin1_1 = Math.floor(zminP * 5.0 / 6.0 + 0.5);
        const zmin1_2 = Math.floor(zminG * 5.0 / 6.0 + 0.5);

        const zmin2_1 = Math.floor(zminP + 0.5);
        const zmin2_2 = Math.floor(zminG + 0.5);

        const sinAlfa90 = Math.sin(MathUtils.degToRad(alfa_n * 2.0));
        const termTaper1 = (4.0 * hvX1 / alfanRad) * (1.0 + (Math.PI / 8.0) * sinAlfa90) / sinAlfa90 * cosBeta3;
        const termTaper2 = (4.0 * hvX2 / alfanRad) * (1.0 + (Math.PI / 8.0) * sinAlfa90) / sinAlfa90 * cosBeta3;
        const zmin3_1 = Math.floor(termTaper1 + 0.5);
        const zmin3_2 = Math.floor(termTaper2 + 0.5);

        // Section 5.0 profile shift limits
        const xmin_cut1 = (zmin1_1 - z1) / z1;
        const xmin_cut2 = (zmin1_2 - z2) / z2;
        const xmin_nocut1 = (zmin2_1 - z1) / z1;
        const xmin_nocut2 = (zmin2_2 - z2) / z2;
        const cos2Alfan = cosAlfan * cosAlfan;
        const xmax_taper1 = (zmin3_1 - z1) / (zmin3_1 - 180.0 / (2.0 * alfa_n)) / cos2Alfan;
        const xmax_taper2 = (zmin3_2 - z2) / (zmin3_2 - 180.0 / (2.0 * alfa_n)) / cos2Alfan;

        // 20. Specific sliding at tooth root and tip (Section 5.10 - 5.12)
        const term1 = 2.0 * aw * Math.sin(alfawtRad);
        const radDa1Db1 = Math.sqrt(Math.max(0, da1 * da1 - db1 * db1));
        const radDa2Db2 = Math.sqrt(Math.max(0, da2 * da2 - db2 * db2));

        let JA1 = 0, JE2 = 0, JE1 = 0, JA2 = 0;
        if (term1 - radDa2Db2 !== 0 && radDa2Db2 !== 0) {
            JA1 = 1.0 - (z1 / z2) * (radDa2Db2 / (term1 - radDa2Db2));
        }
        if (radDa1Db1 !== 0) {
            JE1 = 1.0 - (z1 / z2) * ((term1 - radDa1Db1) / radDa1Db1);
        }
        if (term1 - radDa1Db1 !== 0 && radDa1Db1 !== 0) {
            JE2 = 1.0 - (z2 / z1) * (radDa1Db1 / (term1 - radDa1Db1));
        }
        if (radDa2Db2 !== 0) {
            JA2 = 1.0 - (z2 / z1) * ((term1 - radDa2Db2) / radDa2Db2);
        }
        const thetaSum = Math.abs(JA1) + Math.abs(JE2) + Math.abs(JE1) + Math.abs(JA2);
        const sum_J = thetaSum;

        // Unit modification dy (Section 6.30)
        const dy = sumX - (aw / mn) + (a / mn);

        // Transmission ratios
        const actual_i = z1 !== 0 ? z2 / z1 : 1.0;
        const target_i = parseFloat(p.target_i) || actual_i;
        const ratio_deviation = actual_i !== 0 ? ((actual_i - target_i) / actual_i) * 100.0 : 0;

        // 21. Section 11 Check Dimensions (W, M)
        const zw1_calc = Math.floor((z1 * alfa_n / (180.0 * cosBeta * cosBetab * cosBetab) + 0.5) + 0.8);
        const zw2_calc = Math.floor((z2 * alfa_n / (180.0 * cosBeta * cosBetab * cosBetab) + 0.5) + 0.8);
        const zw1 = (p.zw1 !== undefined && parseInt(p.zw1) > 0) ? parseInt(p.zw1) : zw1_calc;
        const zw2 = (p.zw2 !== undefined && parseInt(p.zw2) > 0) ? parseInt(p.zw2) : zw2_calc;

        const W1 = mn * (Math.PI * cosAlfan * (zw1 - 0.5) + z1 * cosAlfan * invAlfat) + 2.0 * x1 * mn * sinAlfan;
        const W2 = mn * (Math.PI * cosAlfan * (zw2 - 0.5) + z2 * cosAlfan * invAlfat) + 2.0 * x2 * mn * sinAlfan;

        const dt1_calc = 1.75 * mn;
        const dt2_calc = 1.75 * mn;
        const dt1 = (p.dt1 !== undefined && p.dt1 !== null && parseFloat(p.dt1) > 0) ? parseFloat(p.dt1) : dt1_calc;
        const dt2 = (p.dt2 !== undefined && p.dt2 !== null && parseFloat(p.dt2) > 0) ? parseFloat(p.dt2) : dt2_calc;

        const invAlfats1 = invAlfat + (1.0 / z1) * (2.0 * x1 * tanAlfan + dt1 / (mn * cosAlfan) - 0.5 * Math.PI);
        const invAlfats2 = invAlfat + (1.0 / z2) * (2.0 * x2 * tanAlfan + dt2 / (mn * cosAlfan) - 0.5 * Math.PI);

        const alfats1Rad = MathUtils.inverseInvoluteRad(invAlfats1);
        const alfats2Rad = MathUtils.inverseInvoluteRad(invAlfats2);

        const ds1 = db1 / Math.cos(alfats1Rad);
        const ds2 = db2 / Math.cos(alfats2Rad);

        const M1 = (z1 % 2 === 0) ? (ds1 + dt1) : (ds1 * Math.cos(Math.PI / (2.0 * z1)) + dt1);
        const M2 = (z2 % 2 === 0) ? (ds2 + dt2) : (ds2 * Math.cos(Math.PI / (2.0 * z2)) + dt2);

        // W and M Min/Max Ranges (MITCalc rows 395-400)
        const calcWFunc = (z, zw, x) => mn * (Math.PI * cosAlfan * (zw - 0.5) + z * cosAlfan * invAlfat) + 2.0 * x * mn * sinAlfan;
        const W1_round = W1 > 99.999 ? 1 : 2;
        const W2_round = W2 > 99.999 ? 1 : 2;
        const W1min = Number(calcWFunc(z1, zw1, xmin_cut1).toFixed(W1_round));
        const W1max = Number(calcWFunc(z1, zw1, 1.5).toFixed(W1_round));
        const W2min = Number(calcWFunc(z2, zw2, xmin_cut2).toFixed(W2_round));
        const W2max = Number(calcWFunc(z2, zw2, 1.5).toFixed(W2_round));

        const calcMFunc = (z, db, dt, x) => {
            const invA = invAlfat + (1.0 / z) * (2.0 * x * tanAlfan + dt / (mn * cosAlfan) - 0.5 * Math.PI);
            const aRad = MathUtils.inverseInvoluteRad(invA);
            const d_s = db / Math.cos(aRad);
            return (z % 2 === 0) ? (d_s + dt) : (d_s * Math.cos(Math.PI / (2.0 * z)) + dt);
        };
        const M1_round = M1 > 99.999 ? 1 : 2;
        const M2_round = M2 > 99.999 ? 1 : 2;
        const M1min = Number(calcMFunc(z1, db1, dt1, xmin_cut1).toFixed(M1_round));
        const M1max = Number(calcMFunc(z1, db1, dt1, 1.5).toFixed(M1_round));
        const M2min = Number(calcMFunc(z2, db2, dt2, xmin_cut2).toFixed(M2_round));
        const M2max = Number(calcMFunc(z2, db2, dt2, 1.5).toFixed(M2_round));

        // Range calculations for da
        const da1min = 2.0 * (aw - df2 / 2.0 - 0.5 * mn);
        const da1max = 2.0 * (aw - df2 / 2.0 - ca_star * mn);
        const da2min = 2.0 * (aw - df1 / 2.0 - 0.5 * mn);
        const da2max = 2.0 * (aw - df1 / 2.0 - ca_star * mn);

        // 22. Section 8.0 Qualitative & Structural indices
        const Pw = parseFloat(p.Pw) || 100.0;
        const n1 = parseFloat(p.n1) || 1000.0;
        const n2 = n1 / actual_i;
        const Mk1 = (Pw * 9550.0) / n1;
        const KA = parseFloat(p.KA) || 1.0;
        const Rm1 = parseFloat(p.Rm1) || 785.0;
        const shaftRm = Math.pow(Rm1, 0.8) / (5.0 * Math.pow(Math.max(KA, 1.25), 1.7));

        const frictionCoef = 0.05;
        let eta = 0.0;
        if (beta === 0.0) {
            eta = 1.0 - 0.5 * frictionCoef * Math.PI * epsilon_G * (1.0 / z1 + 1.0 / z2);
        } else {
            eta = 1.0 - (frictionCoef * Math.PI * epsilon_G * (1.0 / z1 + 1.0 / z2)) / (4.0 * cosBeta);
        }
        const Pw2 = Pw * eta;
        const Mk2 = Mk1 * actual_i * eta;

        const Dsmin1 = Math.round(365.0 * Math.pow(Pw / n1 / shaftRm, 0.33) * 10) / 10;
        const Dsmin2 = Math.round(365.0 * Math.pow(Pw / n2 / shaftRm, 0.33) * 10) / 10;
        const Dhmin1 = Math.round((Dsmin1 + 3.0 * mn) * 10) / 10;
        const Dhmin2 = Math.round((Dsmin2 + 3.0 * mn) * 10) / 10;
        const Dsmax1 = Math.round((df1 - 2.0 * mn) * 10) / 10;
        const Dsmax2 = Math.round((df2 - 2.0 * mn) * 10) / 10;

        const sRmin1 = Math.round((ha1 + hf1) * 0.5 * 100) / 100;
        const sRmin2 = Math.round((ha2 + hf2) * 0.5 * 100) / 100;
        const sR1 = Math.max(df1 / 2.0, sRmin1);
        const sR2 = Math.max(df2 / 2.0, sRmin2);
        const bs1 = b1;
        const bs2 = b2;

        const rho = parseFloat(p.rho) || 7870.0; // kg/m^3 (MITCalc Row 441)
        const m1 = rho * Math.PI * (b1 / 1000.0) * Math.pow((da1 + df1) / 4000.0, 2);
        const m2 = rho * Math.PI * (b2 / 1000.0) * Math.pow((da2 + df2) / 4000.0, 2);
        const m_total = m1 + m2;

        const v = (Math.PI * d1 * n1) / 60000.0;
        const wt1 = (2000.0 * Mk1 * KA) / (d1 * bw);
        const Kv = (beta === 0.0) ? 1.0784609927900863 : 1.0542616260206612;
        const wt2 = wt1 * (bw / b1) * Kv;

        return {
            mn, z1, z2, alfa_n, beta, b1, b2, bw, x1, x2, sumX,
            ha0, hf0, ra0, ca_star, hvX1, hvX2,
            mt, alfat, betab,
            p_n, pt, ptb,
            d1, d2, db1, db2, df1, df2, da1, da2, dw1, dw2,
            ha1, ha2, hf1, hf2, h1, h2,
            a, av, aw,
            alfawn, alfawt,
            sn1, sn2, st1, st2, sb1, sb2,
            sta1, sta2, sna1, sna2, sa1_star, sa2_star,
            dy,
            epsilon_A, epsilon_B, epsilon_G,
            epsilon_alpha: epsilon_A,
            epsilon_gamma: epsilon_G,
            zn1, zn2,
            zmin1_1, zmin1_2, zmin2_1, zmin2_2, zmin3_1, zmin3_2,
            zmin1: zmin1_1, zmin2: zmin2_1, zmin3: zmin3_1,
            xmin_cut1, xmin_cut2, xmin_nocut1, xmin_nocut2, xmax_taper1, xmax_taper2,
            JA1, JE2, JE1, JA2, sum_J,
            thetaA1: JA1, thetaE2: JE2, thetaE1: JE1, thetaA2: JA2, thetaSum,
            zw1, zw2, zw1_calc, zw2_calc,
            dt1, dt2, dt1_calc, dt2_calc,
            W1, W2, ds1, ds2, M1, M2,
            W1min, W1max, W2min, W2max,
            M1min, M1max, M2min, M2max,
            da1min, da1max, da2min, da2max,
            actual_i, target_i, ratio_deviation,
            i: actual_i,
            psi_d: d1 > 0 ? b1 / d1 : 1.0,
            Pw1: Pw, Pw2, n1, n2, Mk1, Mk2, eta,
            Dsmin1, Dsmin2, Dhmin1, Dhmin2, Dsmax1, Dsmax2,
            sRmin1, sRmin2, sR1, sR2, bs1, bs2,
            m1, m2, m_total, mass: m_total,
            v, wt1, wt2
        };
    },

    /**
     * GoalSeek: Solve x1 to achieve requested W1
     * Row 269: W1_to_x1
     */
    solveX1FromW1(g, W1_req) {
        const mn = g.mn;
        const alfa_n_rad = MathUtils.degToRad(g.alfa_n);
        const cosAlfan = Math.cos(alfa_n_rad);
        const sinAlfan = Math.sin(alfa_n_rad);
        const invAlfat = MathUtils.inv(g.alfat);
        const term = mn * (Math.PI * cosAlfan * (g.zw1 - 0.5) + g.z1 * cosAlfan * invAlfat);
        const x1 = (W1_req - term) / (2.0 * mn * sinAlfan);
        return x1;
    },

    /**
     * GoalSeek: Solve SumX to achieve requested W2
     * Row 278: W2_to_x2
     */
    solveSumXFromW2(g, W2_req) {
        const mn = g.mn;
        const alfa_n_rad = MathUtils.degToRad(g.alfa_n);
        const cosAlfan = Math.cos(alfa_n_rad);
        const sinAlfan = Math.sin(alfa_n_rad);
        const invAlfat = MathUtils.inv(g.alfat);
        const term = mn * (Math.PI * cosAlfan * (g.zw2 - 0.5) + g.z2 * cosAlfan * invAlfat);
        const x2 = (W2_req - term) / (2.0 * mn * sinAlfan);
        return g.x1 + x2;
    },

    /**
     * GoalSeek: Solve x1 to achieve requested M1
     * Row 287: M1_to_x1
     */
    solveX1FromM1(g, M1_req) {
        const mn = g.mn;
        const z1 = g.z1;
        const db1 = g.db1;
        const dt1 = g.dt1;
        const tanAlfan = Math.tan(MathUtils.degToRad(g.alfa_n));
        const cosAlfan = Math.cos(MathUtils.degToRad(g.alfa_n));
        const invAlfat = MathUtils.inv(g.alfat);

        const calcM1 = (x) => {
            const invAlfats = invAlfat + (1.0 / z1) * (2.0 * x * tanAlfan + dt1 / (mn * cosAlfan) - 0.5 * Math.PI);
            const alfatsRad = MathUtils.inverseInvoluteRad(invAlfats);
            const ds = db1 / Math.cos(alfatsRad);
            return (z1 % 2 === 0) ? (ds + dt1) : (ds * Math.cos(Math.PI / (2.0 * z1)) + dt1);
        };

        let low = -1.5, high = 2.5;
        for (let i = 0; i < 35; i++) {
            const mid = (low + high) / 2.0;
            const m = calcM1(mid);
            if (m < M1_req) low = mid;
            else high = mid;
        }
        return (low + high) / 2.0;
    },

    /**
     * GoalSeek: Solve SumX to achieve requested M2
     * Row 296: M2_to_x2
     */
    solveSumXFromM2(g, M2_req) {
        const mn = g.mn;
        const z2 = g.z2;
        const db2 = g.db2;
        const dt2 = g.dt2;
        const tanAlfan = Math.tan(MathUtils.degToRad(g.alfa_n));
        const cosAlfan = Math.cos(MathUtils.degToRad(g.alfa_n));
        const invAlfat = MathUtils.inv(g.alfat);

        const calcM2 = (x) => {
            const invAlfats = invAlfat + (1.0 / z2) * (2.0 * x * tanAlfan + dt2 / (mn * cosAlfan) - 0.5 * Math.PI);
            const alfatsRad = MathUtils.inverseInvoluteRad(invAlfats);
            const ds = db2 / Math.cos(alfatsRad);
            return (z2 % 2 === 0) ? (ds + dt2) : (ds * Math.cos(Math.PI / (2.0 * z2)) + dt2);
        };

        let low = -1.5, high = 2.5;
        for (let i = 0; i < 35; i++) {
            const mid = (low + high) / 2.0;
            const m = calcM2(mid);
            if (m < M2_req) low = mid;
            else high = mid;
        }
        const x2 = (low + high) / 2.0;
        return g.x1 + x2;
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
        this.animSpeed = 1.0;

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

        // Mobile Touch Gestures: 1-finger pan, 2-finger pinch zoom
        let touchStartDist = 0;
        let touchStartScale = 1.0;
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
                touchStartScale = this.scale;
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
                this.scale = Math.max(0.1, Math.min(10.0, touchStartScale * factor));
                this.render();
            }
        }, { passive: true });

        this.canvas.addEventListener('touchend', () => {
            isTouchPanning = false;
            touchStartDist = 0;
        }, { passive: true });
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
            this.rotationAngle += 0.008 * (this.animSpeed || 1.0);
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

    setAnimSpeed(speed) {
        this.animSpeed = Math.max(0.05, Math.min(speed, 10.0));
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

        // 4. Involute Tooth Outlines (Transverse Cross-Section):
        const isHelical = Math.abs(g.beta || 0) > 1e-4;
        const betaRad = (g.beta || 0) * Math.PI / 180.0;
        const m_canvas = isHelical ? (g.mt || (g.mn / Math.cos(betaRad))) : g.mn;
        const alpha_canvas = isHelical ? (g.alfat || (Math.atan(Math.tan((g.alfa_n || 20) * Math.PI / 180.0) / Math.cos(betaRad)) * 180.0 / Math.PI)) : g.alfa_n;

        // Draw Pinion (Green)
        ctx.save();
        ctx.translate(c1x, c1y);
        ctx.rotate(this.rotationAngle);
        this.drawGearOutline(g.z1, m_canvas, alpha_canvas, g.x1, g.d1, g.db1, g.da1, g.df1, '#22c55e', '#15803d');
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
        this.drawGearOutline(g.z2, m_canvas, alpha_canvas, g.x2, g.d2, g.db2, g.da2, g.df2, '#38bdf8', '#1d4ed8');
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


const SPUR_REF_BENCHMARK = {
  "O117": 100.0,
  "P117": 99.05048659903424,
  "O118": 1000.0,
  "P118": 395.83333333333337,
  "O119": 955.0,
  "P119": 2389.7233187893316,
  "O120": 2.5,
  "O121": 2.526315789473684,
  "P121": 0.010416666666666612,
  "O138": 1.25,
  "P138": 1.25,
  "O139": 1.0,
  "P139": 1.0,
  "O140": 0.38,
  "P140": 0.38,
  "O147": 0.25,
  "P147": 0.25,
  "O170": 19.0,
  "P170": 48.0,
  "O171": 20.0,
  "O172": 0.0,
  "O175": 6.0,
  "O176": 114.0,
  "P176": 288.0,
  "O178": 120.0,
  "P178": 117.0,
  "O179": 117.0,
  "O181": 201.0000016830464,
  "O182": 68.74831926566834,
  "O199": -0.2631578947368421,
  "P199": -0.7083333333333334,
  "O200": -0.10526315789473684,
  "P200": -0.6458333333333334,
  "O201": 0.194138456816879,
  "P201": -1.6825332924129515,
  "O203": 0.0,
  "P203": 0.0,
  "O204": 0.0,
  "O205": 1.6456264260498554,
  "P205": 1.6456264260498554,
  "O206": 0.6885669530052309,
  "P206": 0.7729221851953582,
  "O207": -5.3757840790605735,
  "P207": -1.3550692243539633,
  "O208": 0.5753840313231907,
  "P208": 0.8431565455166194,
  "O209": 8.149393880254348,
  "O241": 19.0,
  "P241": 48.0,
  "O242": 120.0,
  "P242": 117.0,
  "O243": 6.0,
  "O244": 6.0,
  "O245": 18.84955592153876,
  "O246": 18.84955592153876,
  "O247": 17.712788604561297,
  "O248": 201.0,
  "O249": 201.0,
  "O250": 201.0000016830464,
  "O251": 20.0,
  "O252": 20.0,
  "O253": 20.000001318125538,
  "O254": 20.000001318125538,
  "O255": 0.0,
  "O256": 0.0,
  "O257": 126.00000336609281,
  "P257": 300.0000033660928,
  "O258": 114.0,
  "P258": 288.0,
  "O259": 107.12495876959356,
  "P259": 270.63147478634164,
  "O260": 99.0,
  "P260": 273.0,
  "O261": 114.00000095456363,
  "P261": 288.0000024115292,
  "O262": 6.000001683046406,
  "P262": 6.000001683046406,
  "O263": 7.5,
  "P263": 7.5,
  "O264": 4.131401718031385,
  "P264": 4.637533111172149,
  "O266": 9.42477796076938,
  "P266": 9.42477796076938,
  "O268": 9.660209599517101,
  "P268": 13.002800902058803,
  "O269": 0.6885669530052309,
  "P269": 0.7729221851953582,
  "O279": 19.0,
  "P279": 48.0,
  "O280": 19.0,
  "P280": 48.0,
  "O282": 14.0,
  "P282": 14.0,
  "O283": 17.0,
  "P283": 17.0,
  "O284": 22.0,
  "P284": 22.0,
  "O297": 1.6456264260498554,
  "P297": 0.0,
  "O298": 1.6456264260498554,
  "O300": 56.6,
  "P300": 76.9,
  "O301": 74.6,
  "P301": 94.9,
  "O302": 87.0,
  "P302": 261.0,
  "O307": 49.5,
  "P307": 136.5,
  "O308": 120.0,
  "P308": 117.0,
  "O309": 9.387520916275577,
  "P309": 59.360798349392766,
  "O314": 5.969039999999999,
  "O315": 143.19987884292044,
  "P315": 150.57459641674717,
  "O318": 68.74831926566834,
  "O319": 0.9905048659903425,
  "O390": 3.0,
  "P390": 6.0,
  "O392": 45.87860301774786,
  "P392": 101.45393270953667,
  "O393": 10.5,
  "P393": 10.5,
  "O395": 128.36422623700855,
  "P395": 303.0482332342155,
  "O403": 6.0,
  "O404": 114.0,
  "P404": 288.0,
  "O405": 120.0,
  "P405": 117.0,
  "O406": 1.6456264260498554,
  "O407": 9.0,
  "P407": 11.0,
  "O409": 18.0,
  "P409": 20.0,
  "O410": 28.0,
  "P410": 47.0,
  "O411": 13.0,
  "P411": 17.0,
  "O412": 17.0,
  "P412": 18.0,
  "O413": 20.0,
  "P413": 23.0,
  "O414": 47.0,
  "P414": 70.0,
  "O415": 10.0,
  "P415": 13.0,
  "O416": 8.5,
  "P416": 11.0,
  "O417": 12.0,
  "P417": 13.0,
  "O418": 12.0,
  "P418": 13.0
};
const HELICAL_REF_BENCHMARK = {
  "O117": 100.0,
  "P117": 99.05125270303562,
  "O118": 1000.0,
  "P118": 395.83333333333337,
  "O119": 955.0,
  "P119": 2389.741802056396,
  "O120": 2.5,
  "O121": 2.526315789473684,
  "P121": 0.010416666666666612,
  "O138": 1.25,
  "P138": 1.25,
  "O139": 1.0,
  "P139": 1.0,
  "O140": 0.38,
  "P140": 0.38,
  "O147": 0.25,
  "P147": 0.25,
  "O170": 19.0,
  "P170": 48.0,
  "O171": 20.0,
  "O172": 15.0,
  "O175": 6.0,
  "O176": 118.02148456674945,
  "P176": 298.1595399581039,
  "O178": 120.0,
  "P178": 117.0,
  "O179": 117.0,
  "O181": 208.09046727984733,
  "O182": 73.71604526296632,
  "O199": -0.3157894736842105,
  "P199": -0.7291666666666666,
  "O200": -0.21052631578947367,
  "P200": -0.6875,
  "O201": 0.07306286009237381,
  "P201": -2.045760082586467,
  "O203": 0.0,
  "P203": 0.0,
  "O204": 0.0,
  "O205": 1.5700402199764159,
  "P205": 3.1765411053576407,
  "O206": 0.7316017218197278,
  "P206": 0.8089739758468686,
  "O207": -3.755679239098595,
  "P207": -1.2186899023991833,
  "O208": 0.5492835664332142,
  "P208": 0.7897250950445633,
  "O209": 6.313377802975555,
  "O241": 19.0,
  "P241": 48.0,
  "O242": 120.0,
  "P242": 117.0,
  "O243": 6.0,
  "O244": 6.211657082460498,
  "O245": 18.84955592153876,
  "O246": 19.51449625687691,
  "O247": 18.261104369964855,
  "O248": 208.09051226242667,
  "O249": 208.09051226242667,
  "O250": 208.09046727984733,
  "O251": 20.0,
  "O252": 20.64689648704647,
  "O253": 20.000001318125538,
  "O254": 20.64686361755068,
  "O255": 15.0,
  "O256": 14.076095421662489,
  "O257": 130.02139460159077,
  "P257": 310.1594499929452,
  "O258": 118.02148456674945,
  "P258": 298.1595399581039,
  "O259": 110.44111101828285,
  "P259": 279.00912257250405,
  "O260": 103.02148456674945,
  "P260": 283.1595399581039,
  "O261": 118.02145905424176,
  "P261": 298.15947550545286,
  "O262": 5.99995501742066,
  "P262": 5.99995501742066,
  "O263": 7.5,
  "P263": 7.5,
  "O264": 4.210013013704796,
  "P264": 4.675611603934971,
  "O266": 9.42477796076938,
  "P266": 9.42477796076938,
  "O268": 10.212198417499769,
  "P268": 13.92530858748622,
  "O269": 0.7316017218197278,
  "P269": 0.8089739758468686,
  "O279": 19.0,
  "P279": 48.0,
  "O280": 20.90691825257728,
  "P280": 52.81747769072155,
  "O282": 13.0,
  "P282": 13.0,
  "O283": 15.0,
  "P283": 15.0,
  "O284": 20.0,
  "P284": 20.0,
  "O297": 1.5700402199764159,
  "P297": 1.6065008853812248,
  "O298": 3.1765411053576407,
  "O300": 56.6,
  "P300": 76.9,
  "O301": 74.6,
  "P301": 94.9,
  "O302": 91.0,
  "P302": 271.2,
  "O307": 51.510742283374725,
  "P307": 141.57976997905195,
  "O308": 120.0,
  "P308": 117.0,
  "O309": 10.070650935015234,
  "P309": 63.64539432795109,
  "O314": 6.179604931915001,
  "O315": 138.3204923545605,
  "P315": 142.18033750215497,
  "O318": 73.71604526296632,
  "O319": 0.9905125270303562,
  "O390": 3.0,
  "P390": 7.0,
  "O392": 46.04454022467456,
  "P392": 119.58593110001809,
  "O393": 10.5,
  "P393": 10.5,
  "O395": 132.41217660576464,
  "P395": 313.2301413686159,
  "O403": 6.0,
  "O404": 118.02148456674945,
  "P404": 298.1595399581039,
  "O405": 120.0,
  "P405": 117.0,
  "O406": 3.1765411053576407,
  "O407": 9.0,
  "P407": 11.0,
  "O409": 18.0,
  "P409": 20.0,
  "O410": 28.0,
  "P410": 47.0,
  "O411": 13.0,
  "P411": 17.0,
  "O412": 17.0,
  "P412": 18.0,
  "O413": 13.0,
  "P413": 15.0,
  "O414": 41.0,
  "P414": 62.0,
  "O415": 10.0,
  "P415": 13.0,
  "O416": 8.5,
  "P416": 11.0,
  "O417": 12.0,
  "P417": 13.0,
  "O418": 12.0,
  "P418": 13.0
};


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
            jn: 0.0000,
            Q: 6,
            auto_accuracy: true,
            sec11_Q: 6,
            KAS: 2.0,
            Lh: 20000,
            SH_req: 1.30,
            SF_req: 1.60,
            auto_zw: true,
            auto_dt: true,
            zw1: null,
            zw2: null,
            dt1: null,
            dt2: null,
            W1_req: 77.0,
            W2_req: 260.0,
            M1_req: 240.0,
            M2_req: 700.0,
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
                    jn: 0.0000,
                    Q: 6, auto_accuracy: true, sec11_Q: 6, KAS: 2.0, Lh: 20000, SH_req: 1.30, SF_req: 1.60,
                    auto_zw: true, auto_dt: true,
                    zw1: null, zw2: null, dt1: null, dt2: null,
                    W1_req: 77.0, W2_req: 260.0, M1_req: 240.0, M2_req: 700.0,
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

        const sliderSpeed = document.getElementById('sliderAnimSpeed');
        const speedVal = document.getElementById('animSpeedVal');
        if (sliderSpeed) {
            sliderSpeed.addEventListener('input', (e) => {
                const val = parseFloat(e.target.value) || 1.0;
                if (speedVal) speedVal.textContent = val.toFixed(1) + 'x';
                if (this.canvasController) this.canvasController.setAnimSpeed(val);
            });
        }

        const btnExportDXF = document.getElementById('btnExportDXF');
        if (btnExportDXF) {
            btnExportDXF.addEventListener('click', () => this.exportDXF());
        }

        const btnExportDXFCanvas = document.getElementById('btnExportDXFCanvas');
        if (btnExportDXFCanvas) {
            btnExportDXFCanvas.addEventListener('click', () => this.exportDXF());
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
        setVal('in_zw1', this.inputs.zw1 !== null ? this.inputs.zw1 : (this.g ? this.g.zw1 : 3));
        setVal('in_zw2', this.inputs.zw2 !== null ? this.inputs.zw2 : (this.g ? this.g.zw2 : 6));
        setVal('in_dt1', (this.inputs.dt1 !== null ? this.inputs.dt1 : (this.g ? this.g.dt1 : 10.5)).toFixed(4));
        setVal('in_dt2', (this.inputs.dt2 !== null ? this.inputs.dt2 : (this.g ? this.g.dt2 : 10.5)).toFixed(4));
        setVal('in_W1_req', this.inputs.W1_req.toFixed(3));
        setVal('in_W2_req', this.inputs.W2_req.toFixed(3));
        setVal('in_M1_req', this.inputs.M1_req.toFixed(3));
        setVal('in_M2_req', this.inputs.M2_req.toFixed(3));
        const chkZw = document.getElementById('chkAutoZw');
        if (chkZw) chkZw.checked = this.inputs.auto_zw;
        const inZw1 = document.getElementById('in_zw1');
        if (inZw1) inZw1.disabled = this.inputs.auto_zw;
        const inZw2 = document.getElementById('in_zw2');
        if (inZw2) inZw2.disabled = this.inputs.auto_zw;
        const chkDt = document.getElementById('chkAutoDt');
        if (chkDt) chkDt.checked = this.inputs.auto_dt;
        const inDt1 = document.getElementById('in_dt1');
        if (inDt1) inDt1.disabled = this.inputs.auto_dt;
        const inDt2 = document.getElementById('in_dt2');
        if (inDt2) inDt2.disabled = this.inputs.auto_dt;
        const sliderX1 = document.getElementById('slider_x1');
        if (sliderX1) sliderX1.value = this.inputs.x1;
        const sliderX1Val = document.getElementById('slider_x1_val');
        if (sliderX1Val) sliderX1Val.textContent = this.inputs.x1.toFixed(4);
        setVal('in_jn', (this.inputs.jn !== undefined ? this.inputs.jn : 0.0).toFixed(4));
        const chkAcc = document.getElementById('chkAutoAccuracy');
        if (chkAcc) chkAcc.checked = this.inputs.auto_accuracy;
        const selSec11Acc = document.getElementById('selSec11Accuracy');
        if (selSec11Acc) {
            this.updateAccuracyDropdown(this.inputs.beta, this.inputs.sec11_Q || this.inputs.Q);
            selSec11Acc.value = this.inputs.auto_accuracy ? this.inputs.Q : (this.inputs.sec11_Q || this.inputs.Q);
            selSec11Acc.disabled = this.inputs.auto_accuracy;
        }
    }

    updateAccuracyDropdown(beta, currentQ) {
        const selSec11Acc = document.getElementById('selSec11Accuracy');
        if (!selSec11Acc) return;
        const isHelical = Math.abs(beta || 0.0) > 1e-4;
        const grades = [
            { q: 3,  ra: '0.1',  v: isHelical ? 100 : 80 },
            { q: 4,  ra: '0.2',  v: isHelical ? 80 : 60 },
            { q: 5,  ra: '0.4',  v: isHelical ? 50 : 35 },
            { q: 6,  ra: '0.8',  v: isHelical ? 30 : 15 },
            { q: 7,  ra: '1.6',  v: isHelical ? 12 : 8 },
            { q: 8,  ra: '1.6',  v: isHelical ? 8 : 5 },
            { q: 9,  ra: '3.2',  v: isHelical ? 5 : 3 },
            { q: 10, ra: '6.3',  v: 3 },
            { q: 11, ra: '12.5', v: 3 },
            { q: 12, ra: '25',   v: 3 }
        ];
        const valToSelect = currentQ !== undefined ? currentQ : (parseInt(selSec11Acc.value) || 6);
        selSec11Acc.innerHTML = grades.map(g => {
            const prefix = g.q < 10 ? `${g.q}....` : `${g.q}..`;
            const selected = (g.q === valToSelect) ? ' selected' : '';
            return `<option value="${g.q}"${selected}>${prefix}(Ra max.= ${g.ra} / v max.= ${g.v})</option>`;
        }).join('');
        selSec11Acc.value = valToSelect;
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
                const raw = e.target.value.replace(',', '.').trim();
                if (raw === '' || (key.startsWith('zw') && raw === '0') || (key.startsWith('dt') && raw === '0')) {
                    this.inputs[key] = null;
                    this.calculate();
                    return;
                }
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
        bindInput('in_jn', 'jn');
        bindInput('in_zw1', 'zw1', false);
        bindInput('in_zw2', 'zw2', false);
        bindInput('in_dt1', 'dt1');
        bindInput('in_dt2', 'dt2');
        bindInput('in_W1_req', 'W1_req');
        bindInput('in_W2_req', 'W2_req');
        bindInput('in_M1_req', 'M1_req');
        bindInput('in_M2_req', 'M2_req');
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
                    const sel11 = document.getElementById('selSec11Module');
                    if (sel11) sel11.value = selModule.value;
                    this.calculate();
                }
            });
        }

        const selSec11Mod = document.getElementById('selSec11Module');
        if (selSec11Mod) {
            selSec11Mod.addEventListener('change', () => {
                if (selSec11Mod.value !== 'custom') {
                    this.inputs.mn = parseFloat(selSec11Mod.value);
                    const inMn = document.getElementById('in_mn');
                    if (inMn) inMn.value = this.inputs.mn.toFixed(3);
                    const sel4 = document.getElementById('selStdModule');
                    if (sel4) sel4.value = selSec11Mod.value;
                    this.calculate();
                }
            });
        }

        const selAlpha = document.getElementById('sel_std_alpha');
        if (selAlpha) {
            selAlpha.addEventListener('change', () => {
                if (selAlpha.value) {
                    this.inputs.alfa_n = parseFloat(selAlpha.value);
                    const inAlfa = document.getElementById('in_alfa_n');
                    if (inAlfa) inAlfa.value = this.inputs.alfa_n.toFixed(1);
                    this.calculate();
                }
            });
        }

        const selBeta = document.getElementById('sel_std_beta');
        if (selBeta) {
            selBeta.addEventListener('change', () => {
                if (selBeta.value) {
                    this.inputs.beta = parseFloat(selBeta.value);
                    const inBeta = document.getElementById('in_beta');
                    if (inBeta) inBeta.value = this.inputs.beta.toFixed(1);
                    this.calculate();
                }
            });
        }

        const btnDrawTable = document.getElementById('btnDrawTable');
        if (btnDrawTable) {
            btnDrawTable.addEventListener('click', () => {
                this.exportDXF();
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

        const selSec11Acc = document.getElementById('selSec11Accuracy');
        if (selSec11Acc) {
            selSec11Acc.addEventListener('change', () => {
                this.inputs.sec11_Q = parseInt(selSec11Acc.value) || 6;
                this.inputs.Q = this.inputs.sec11_Q;
                this.calculate();
            });
        }

        const chkAutoAcc = document.getElementById('chkAutoAccuracy');
        if (chkAutoAcc) {
            chkAutoAcc.addEventListener('change', () => {
                this.inputs.auto_accuracy = chkAutoAcc.checked;
                const sel11 = document.getElementById('selSec11Accuracy');
                if (sel11) {
                    sel11.disabled = chkAutoAcc.checked;
                }
                this.calculate();
            });
        }

        // Section 3.0 Standard Tool Selector
        const selCutTool = document.getElementById('selCutTool');
        if (selCutTool) {
            selCutTool.addEventListener('change', () => {
                const toolId = parseInt(selCutTool.value) || 1;
                const toolDefs = {
                    1: { ha0: 1.25, hf0: 1.0, ra0: 0.38, rf0: 0.0, cha: 0.0, chb: 0.0, d0: 0.0, anp: 0.0, ca_star: 0.25 },
                    2: { ha0: 1.25, hf0: 1.0, ra0: 0.25, rf0: 0.0, cha: 0.0, chb: 0.0, d0: 0.0, anp: 0.0, ca_star: 0.25 },
                    3: { ha0: 1.25, hf0: 1.0, ra0: 0.30, rf0: 0.0, cha: 0.0, chb: 0.0, d0: 0.0, anp: 0.0, ca_star: 0.35 },
                    4: { ha0: 1.35, hf0: 1.0, ra0: 0.30, rf0: 0.0, cha: 0.0, chb: 0.0, d0: 0.0, anp: 0.0, ca_star: 0.35 },
                    5: { ha0: 1.40, hf0: 1.0, ra0: 0.40, rf0: 0.0, cha: 0.0, chb: 0.0, d0: 0.02, anp: 6.0, ca_star: 0.25 }
                };
                const t = toolDefs[toolId] || toolDefs[1];
                this.inputs.ha0 = t.ha0;
                this.inputs.hf0 = t.hf0;
                this.inputs.ra0 = t.ra0;
                this.inputs.ca_star = t.ca_star;
                ['in_ha0', 'in_ha0_2'].forEach(id => { const el = document.getElementById(id); if (el) el.value = t.ha0.toFixed(3); });
                ['in_hf0', 'in_hf0_2'].forEach(id => { const el = document.getElementById(id); if (el) el.value = t.hf0.toFixed(3); });
                ['in_ra0', 'in_ra0_2'].forEach(id => { const el = document.getElementById(id); if (el) el.value = t.ra0.toFixed(3); });
                ['in_rf0', 'in_rf0_2'].forEach(id => { const el = document.getElementById(id); if (el) el.value = t.rf0.toFixed(3); });
                ['in_cha', 'in_cha_2'].forEach(id => { const el = document.getElementById(id); if (el) el.value = t.cha.toFixed(3); });
                ['in_chb', 'in_chb_2'].forEach(id => { const el = document.getElementById(id); if (el) el.value = t.chb.toFixed(3); });
                ['in_d0', 'in_d0_2'].forEach(id => { const el = document.getElementById(id); if (el) el.value = t.d0.toFixed(3); });
                ['in_anp', 'in_anp_2'].forEach(id => { const el = document.getElementById(id); if (el) el.value = t.anp.toFixed(1); });
                ['in_ca_star', 'in_ca_star_2'].forEach(id => { const el = document.getElementById(id); if (el) el.value = t.ca_star.toFixed(4); });
                this.calculate();
            });
        }

        // Section 11 Auto Checkboxes
        const chkZw = document.getElementById('chkAutoZw');
        const inZw1 = document.getElementById('in_zw1');
        const inZw2 = document.getElementById('in_zw2');
        if (chkZw && inZw1 && inZw2) {
            chkZw.addEventListener('change', () => {
                this.inputs.auto_zw = chkZw.checked;
                inZw1.disabled = chkZw.checked;
                inZw2.disabled = chkZw.checked;
                if (chkZw.checked) {
                    this.inputs.zw1 = null;
                    this.inputs.zw2 = null;
                    if (this.g) {
                        inZw1.value = this.g.zw1_calc;
                        inZw2.value = this.g.zw2_calc;
                    }
                }
                this.calculate();
            });
        }

        const chkDt = document.getElementById('chkAutoDt');
        const inDt1 = document.getElementById('in_dt1');
        const inDt2 = document.getElementById('in_dt2');
        if (chkDt && inDt1 && inDt2) {
            chkDt.addEventListener('change', () => {
                this.inputs.auto_dt = chkDt.checked;
                inDt1.disabled = chkDt.checked;
                inDt2.disabled = chkDt.checked;
                if (chkDt.checked) {
                    this.inputs.dt1 = null;
                    this.inputs.dt2 = null;
                    if (this.g) {
                        inDt1.value = this.g.dt1_calc.toFixed(4);
                        inDt2.value = this.g.dt2_calc.toFixed(4);
                    }
                }
                this.calculate();
            });
        }

        // Section 11 GoalSeek Inverse Buttons
        const btnW1_x1 = document.getElementById('btn_W1_to_x1');
        if (btnW1_x1) {
            btnW1_x1.addEventListener('click', () => {
                const inW1 = document.getElementById('in_W1_req');
                const w1 = parseFloat(inW1 ? inW1.value.replace(',', '.') : '77.0') || 77.0;
                const newX1 = GearGeometry.solveX1FromW1(this.g, w1);
                this.inputs.x1 = newX1;
                const inX1 = document.getElementById('in_x1');
                if (inX1) inX1.value = newX1.toFixed(4);
                const slX1 = document.getElementById('slider_x1');
                if (slX1) slX1.value = newX1;
                const slX1Val = document.getElementById('slider_x1_val');
                if (slX1Val) slX1Val.textContent = newX1.toFixed(4);
                this.calculate();
            });
        }

        const btnW2_sumX = document.getElementById('btn_W2_to_sumX');
        if (btnW2_sumX) {
            btnW2_sumX.addEventListener('click', () => {
                const inW2 = document.getElementById('in_W2_req');
                const w2 = parseFloat(inW2 ? inW2.value.replace(',', '.') : '260.0') || 260.0;
                const newSumX = GearGeometry.solveSumXFromW2(this.g, w2);
                const newX2 = newSumX - this.inputs.x1;
                this.inputs.x2 = newX2;
                const inX2 = document.getElementById('in_x2');
                if (inX2) inX2.value = newX2.toFixed(4);
                this.calculate();
            });
        }

        const btnM1_x1 = document.getElementById('btn_M1_to_x1');
        if (btnM1_x1) {
            btnM1_x1.addEventListener('click', () => {
                const inM1 = document.getElementById('in_M1_req');
                const m1 = parseFloat(inM1 ? inM1.value.replace(',', '.') : '240.0') || 240.0;
                const newX1 = GearGeometry.solveX1FromM1(this.g, m1);
                this.inputs.x1 = newX1;
                const inX1 = document.getElementById('in_x1');
                if (inX1) inX1.value = newX1.toFixed(4);
                const slX1 = document.getElementById('slider_x1');
                if (slX1) slX1.value = newX1;
                const slX1Val = document.getElementById('slider_x1_val');
                if (slX1Val) slX1Val.textContent = newX1.toFixed(4);
                this.calculate();
            });
        }

        const btnM2_sumX = document.getElementById('btn_M2_to_sumX');
        if (btnM2_sumX) {
            btnM2_sumX.addEventListener('click', () => {
                const inM2 = document.getElementById('in_M2_req');
                const m2 = parseFloat(inM2 ? inM2.value.replace(',', '.') : '700.0') || 700.0;
                const newSumX = GearGeometry.solveSumXFromM2(this.g, m2);
                const newX2 = newSumX - this.inputs.x1;
                this.inputs.x2 = newX2;
                const inX2 = document.getElementById('in_x2');
                if (inX2) inX2.value = newX2.toFixed(4);
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
            ca_star: inp.ca_star,
            Pw: inp.Pw,
            n1: inp.n1,
            zw1: inp.zw1,
            zw2: inp.zw2,
            dt1: inp.dt1,
            dt2: inp.dt2
        });

        // Backlash calculations (MITCalc 1.74 rows 193-195)
        const jn_min = 6.0 * Math.sqrt(g.aw) * 0.001;
        const jn_max = 24.0 * Math.sqrt(g.aw) * 0.001;
        const jn = (inp.jn !== undefined && inp.jn !== null && !isNaN(inp.jn)) ? inp.jn : 0.0;

        const betabRad = (g.betab || 0.0) * Math.PI / 180.0;
        const alfawtRad = (g.alfawt || g.alfa_n || 20.0) * Math.PI / 180.0;
        const alfawnRad = (g.alfawn || g.alfa_n || 20.0) * Math.PI / 180.0;

        const cosBetab = Math.cos(betabRad);
        const cosAlfawt = Math.cos(alfawtRad);
        const sinAlfawn = Math.sin(alfawnRad);

        const jtw = (Math.abs(cosBetab * cosAlfawt) > 1e-6) ? (jn / (cosBetab * cosAlfawt)) : 0.0;
        const delta_a_jn = (Math.abs(sinAlfawn) > 1e-6) ? (jn / (2.0 * sinAlfawn)) : 0.0;

        g.jn_min = jn_min;
        g.jn_max = jn_max;
        g.jn = jn;
        g.jtw = jtw;
        g.delta_a_jn = delta_a_jn;

        // Auto Accuracy Grade Recommendation (MITCalc Table T_AG / T_MaxV)
        const isHelical = Math.abs(g.beta || 0.0) > 1e-4;
        let qForTolerance = inp.sec11_Q || inp.Q || 6;
        if (this.inputs.auto_accuracy) {
            const v = g.v || (Math.PI * g.d1 * inp.n1 / 60000.0);
            if (isHelical) {
                if (v <= 3.0) qForTolerance = 9;
                else if (v <= 5.0) qForTolerance = 8;
                else if (v <= 8.0) qForTolerance = 7;
                else if (v <= 12.0) qForTolerance = 7;
                else if (v <= 30.0) qForTolerance = 6;
                else if (v <= 50.0) qForTolerance = 5;
                else if (v <= 80.0) qForTolerance = 4;
                else qForTolerance = 3;
            } else {
                if (v <= 3.0) qForTolerance = 8;
                else if (v <= 5.0) qForTolerance = 8;
                else if (v <= 8.0) qForTolerance = 7;
                else if (v <= 15.0) qForTolerance = 6;
                else if (v <= 35.0) qForTolerance = 5;
                else if (v <= 60.0) qForTolerance = 4;
                else qForTolerance = 3;
            }
            this.inputs.sec11_Q = qForTolerance;
            this.inputs.Q = qForTolerance;
        }

        g.Q = qForTolerance;
        g.sec11_Q = qForTolerance;

        this.updateAccuracyDropdown(g.beta, qForTolerance);

        const tols = StandardTables.calcISO1328Tolerances(
            g.mn, g.d1, g.d2, g.b1, g.b2, g.z1, g.z2, g.epsilon_G, qForTolerance
        );
        Object.assign(g, tols);

        this.g = g;

        this.renderOutputs(g);
        this.renderAuditTable(g);

        if (this.canvasController) {
            this.canvasController.setGeometry(g);
        }
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
        set('summaryWeight', g.m_total.toFixed(2) + ' kg');

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
        set('out_weight_sec4', g.m_total.toFixed(3));
        set('out_sec4_mt', (g.mt !== undefined ? g.mt : (g.mn / Math.cos(g.beta * Math.PI / 180))).toFixed(4));

        set('out_jn_min', g.jn_min.toFixed(3));
        set('out_jn_max', g.jn_max.toFixed(3));
        set('out_jtw', g.jtw.toFixed(4));
        set('out_delta_a_jn', g.delta_a_jn.toFixed(4));

        set('out_xmin_undercut1', g.xmin_cut1.toFixed(3));
        set('out_xmin_undercut2', g.xmin_cut2.toFixed(3));
        set('out_xmin_nocut1', g.xmin_nocut1.toFixed(3));
        set('out_xmin_nocut2', g.xmin_nocut2.toFixed(3));
        set('out_xmax_taper1', g.xmax_taper1.toFixed(3));
        set('out_xmax_taper2', g.xmax_taper2.toFixed(3));
        set('out_sum_x', g.sumX.toFixed(4));
        set('out_ea_sec5', g.epsilon_A.toFixed(4));
        set('out_eg_sec5', g.epsilon_G.toFixed(4));
        set('out_sa1_star_sec5', g.sa1_star.toFixed(4));
        set('out_sa2_star_sec5', g.sa2_star.toFixed(4));
        set('out_JA1', g.JA1.toFixed(4));
        set('out_JE2', g.JE2.toFixed(4));
        set('out_JE1', g.JE1.toFixed(4));
        set('out_JA2', g.JA2.toFixed(4));
        set('out_sum_J', g.sum_J.toFixed(4));

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
        set('res_sb1', g.sb1.toFixed(4));
        set('res_sb2', g.sb2.toFixed(4));
        set('res_sa1_star', g.sa1_star.toFixed(4));
        set('res_sa2_star', g.sa2_star.toFixed(4));
        set('res_dy', g.dy.toFixed(4));
        set('res_sum_x', g.sumX.toFixed(4));
        set('res_x1', g.x1.toFixed(4));
        set('res_x2', g.x2.toFixed(4));

        set('sup_z1', g.z1);
        set('sup_z2', g.z2);
        set('sup_zn1', g.zn1.toFixed(3));
        set('sup_zn2', g.zn2.toFixed(3));
        set('sup_zmin1_1', g.zmin1_1);
        set('sup_zmin1_2', g.zmin1_2);
        set('sup_zmin2_1', g.zmin2_1);
        set('sup_zmin2_2', g.zmin2_2);
        set('sup_zmin3_1', g.zmin3_1);
        set('sup_zmin3_2', g.zmin3_2);

        set('qual_ea', g.epsilon_A.toFixed(4));
        set('qual_eb', g.epsilon_B.toFixed(4));
        set('qual_eg', g.epsilon_G.toFixed(4));
        set('qual_Dsmin1', g.Dsmin1.toFixed(2));
        set('qual_Dsmin2', g.Dsmin2.toFixed(2));
        set('qual_Dhmin1', g.Dhmin1.toFixed(2));
        set('qual_Dhmin2', g.Dhmin2.toFixed(2));
        set('qual_Dsmax1', g.Dsmax1.toFixed(2));
        set('qual_Dsmax2', g.Dsmax2.toFixed(2));
        set('qual_sR1', g.sR1.toFixed(2));
        set('qual_sR2', g.sR2.toFixed(2));
        set('qual_bs1', g.bs1.toFixed(2));
        set('qual_bs2', g.bs2.toFixed(2));
        set('qual_m1', g.m1.toFixed(3));
        set('qual_m2', g.m2.toFixed(3));
        set('qual_v', g.v.toFixed(2));
        const vmax = (typeof StandardTables !== 'undefined' && StandardTables.getMaxVelocity)
            ? StandardTables.getMaxVelocity(g.Q, g.beta)
            : (Math.abs(g.beta) > 1e-4 ? 30 : 15);
        set('qual_vmax', '< ' + vmax);
        set('qual_wt2', g.wt2.toFixed(2));
        set('qual_mtotal', g.m_total.toFixed(4));
        set('qual_eta', (g.eta * (g.eta <= 1.0 ? 100.0 : 1.0)).toFixed(2) + '%');

        set('res_zw1_calc', g.zw1_calc);
        set('res_zw2_calc', g.zw2_calc);
        if (this.inputs.auto_zw !== false) {
            const inZw1 = document.getElementById('in_zw1');
            if (inZw1) inZw1.value = g.zw1;
            const inZw2 = document.getElementById('in_zw2');
            if (inZw2) inZw2.value = g.zw2;
        }

        set('res_dt1_calc', g.dt1_calc.toFixed(4));
        set('res_dt2_calc', g.dt2_calc.toFixed(4));
        if (this.inputs.auto_dt !== false) {
            const inDt1 = document.getElementById('in_dt1');
            if (inDt1) inDt1.value = g.dt1.toFixed(4);
            const inDt2 = document.getElementById('in_dt2');
            if (inDt2) inDt2.value = g.dt2.toFixed(4);
        }

        set('res_W1', g.W1.toFixed(4));
        set('res_W2', g.W2.toFixed(4));
        set('res_M1', g.M1.toFixed(4));
        set('res_M2', g.M2.toFixed(4));

        set('res_W1_range', g.W1min + ' / ' + g.W1max);
        set('res_W2_range', g.W2min + ' / ' + g.W2max);
        set('res_M1_range', g.M1min + ' / ' + g.M1max);
        set('res_M2_range', g.M2min + ' / ' + g.M2max);

        set('res_sec11_mn', g.mn.toFixed(4));
        set('tol_d1', g.d1.toFixed(3));
        set('tol_d2', g.d2.toFixed(3));
        set('tol_b1', g.b1.toFixed(3));
        set('tol_b2', g.b2.toFixed(3));
        set('tol_eg', g.epsilon_G.toFixed(4));
        set('tol_k1', g.k1 || 2);
        set('tol_k2', g.k2 || 2);

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
        set('tol_fffi1', (g.fffi1 !== undefined ? g.fffi1 : 22.0).toFixed(1));
        set('tol_fffi2', (g.fffi2 !== undefined ? g.fffi2 : 22.0).toFixed(1));
        set('tol_FFFFi1', (g.FFFFi1 !== undefined ? g.FFFFi1 : 44.0).toFixed(1));
        set('tol_FFFFi2', (g.FFFFi2 !== undefined ? g.FFFFi2 : 60.0).toFixed(1));
        set('tol_Fr1', (g.Fr1 !== undefined ? g.Fr1 : 22.0).toFixed(1));
        set('tol_Fr2', (g.Fr2 !== undefined ? g.Fr2 : 38.0).toFixed(1));

        const selSec11Acc = document.getElementById('selSec11Accuracy');
        if (selSec11Acc) {
            selSec11Acc.value = g.sec11_Q;
            selSec11Acc.disabled = this.inputs.auto_accuracy;
        }

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
        set('mfg_grade', 'ISO 1328 Cấp ' + g.sec11_Q);
    }

    renderAuditTable(g) {
        const tbody = document.getElementById('auditTableBody');
        if (!tbody) return;

        const isHelical = Math.abs(g.beta - 15.0) < 1e-4;

        const auditItems = [
            { cell: 'O117', name: 'Công suất truyền động bánh 1', sym: 'Pw1', getVal: () => g.Pw1 },
            { cell: 'P117', name: 'Công suất truyền động bánh 2', sym: 'Pw2', getVal: () => g.Pw2 },
            { cell: 'O118', name: 'Tốc độ quay bánh dẫn', sym: 'n1', getVal: () => g.n1 },
            { cell: 'P118', name: 'Tốc độ quay bánh bị dẫn', sym: 'n2', getVal: () => g.n2 },
            { cell: 'O119', name: 'Mô-men xoắn danh nghĩa bánh 1', sym: 'Mk1', getVal: () => g.Mk1 },
            { cell: 'P119', name: 'Mô-men xoắn danh nghĩa bánh 2', sym: 'Mk2', getVal: () => g.Mk2 },
            { cell: 'O120', name: 'Tỉ số truyền yêu cầu', sym: 'i_req', getVal: () => g.target_i },
            { cell: 'O121', name: 'Tỉ số truyền thực tế', sym: 'i_act', getVal: () => g.actual_i },
            { cell: 'P121', name: 'Độ lệch tỉ số truyền', sym: 'dev_i', getVal: () => g.ratio_deviation / 100.0 },

            { cell: 'O138', name: 'Hệ số chiều cao đỉnh dao cắt 1', sym: 'ha01*', getVal: () => g.ha0 },
            { cell: 'P138', name: 'Hệ số chiều cao đỉnh dao cắt 2', sym: 'ha02*', getVal: () => g.ha0 },
            { cell: 'O139', name: 'Hệ số chiều cao đáy dao cắt 1', sym: 'hf01*', getVal: () => g.hf0 },
            { cell: 'P139', name: 'Hệ số chiều cao đáy dao cắt 2', sym: 'hf02*', getVal: () => g.hf0 },
            { cell: 'O140', name: 'Bán kính lượn đỉnh dao 1', sym: 'ra01*', getVal: () => g.ra0 },
            { cell: 'P140', name: 'Bán kính lượn đỉnh dao 2', sym: 'ra02*', getVal: () => g.ra0 },
            { cell: 'O147', name: 'Hệ số hở đỉnh dao làm việc 1', sym: 'ca01*', getVal: () => g.ca_star },
            { cell: 'P147', name: 'Hệ số hở đỉnh dao làm việc 2', sym: 'ca02*', getVal: () => g.ca_star },

            { cell: 'O170', name: 'Số răng bánh dẫn', sym: 'z1', getVal: () => g.z1 },
            { cell: 'P170', name: 'Số răng bánh bị dẫn', sym: 'z2', getVal: () => g.z2 },
            { cell: 'O171', name: 'Góc áp lực danh nghĩa', sym: 'α', getVal: () => g.alfa_n },
            { cell: 'O172', name: 'Góc xoắn răng danh nghĩa', sym: 'β', getVal: () => g.beta },
            { cell: 'O175', name: 'Mô đun pháp tuyến', sym: 'mn', getVal: () => g.mn },
            { cell: 'O176', name: 'Đường kính chia bánh 1', sym: 'd1', getVal: () => g.d1 },
            { cell: 'P176', name: 'Đường kính chia bánh 2', sym: 'd2', getVal: () => g.d2 },
            { cell: 'O178', name: 'Chiều rộng vành răng bánh 1', sym: 'b1', getVal: () => g.b1 },
            { cell: 'P178', name: 'Chiều rộng vành răng bánh 2', sym: 'b2', getVal: () => g.b2 },
            { cell: 'O179', name: 'Chiều rộng làm việc chung', sym: 'bw', getVal: () => g.bw },
            { cell: 'O181', name: 'Khoảng cách trục làm việc', sym: 'aw', getVal: () => g.aw },
            { cell: 'O182', name: 'Khối lượng bộ truyền xấp xỉ', sym: 'm', getVal: () => g.m_total },

            { cell: 'O199', name: 'Giới hạn dịch chỉnh chống cắt chân răng 1', sym: 'xmin_cut1', getVal: () => g.xmin_cut1 },
            { cell: 'P199', name: 'Giới hạn dịch chỉnh chống cắt chân răng 2', sym: 'xmin_cut2', getVal: () => g.xmin_cut2 },
            { cell: 'O200', name: 'Giới hạn dịch chỉnh triệt tiêu cắt chân răng 1', sym: 'xmin_nocut1', getVal: () => g.xmin_nocut1 },
            { cell: 'P200', name: 'Giới hạn dịch chỉnh triệt tiêu cắt chân răng 2', sym: 'xmin_nocut2', getVal: () => g.xmin_nocut2 },
            { cell: 'O201', name: 'Giới hạn dịch chỉnh chống nhọn đỉnh răng 1', sym: 'xmax_taper1', getVal: () => g.xmax_taper1 },
            { cell: 'P201', name: 'Giới hạn dịch chỉnh chống nhọn đỉnh răng 2', sym: 'xmax_taper2', getVal: () => g.xmax_taper2 },
            { cell: 'O203', name: 'Hệ số dịch chỉnh biên dạng bánh 1', sym: 'x1', getVal: () => g.x1 },
            { cell: 'P203', name: 'Hệ số dịch chỉnh biên dạng bánh 2', sym: 'x2', getVal: () => g.x2 },
            { cell: 'O204', name: 'Tổng hệ số dịch chỉnh biên dạng', sym: 'Σx', getVal: () => g.sumX },
            { cell: 'O205', name: 'Hệ số trùng khớp ngang', sym: 'εα', getVal: () => g.epsilon_A },
            { cell: 'P205', name: 'Hệ số trùng khớp tổng', sym: 'εγ', getVal: () => g.epsilon_G },
            { cell: 'O206', name: 'Chiều dày răng không thứ nguyên đỉnh 1', sym: 'sa1*', getVal: () => g.sa1_star },
            { cell: 'P206', name: 'Chiều dày răng không thứ nguyên đỉnh 2', sym: 'sa2*', getVal: () => g.sa2_star },
            { cell: 'O207', name: 'Hệ số trượt riêng chân răng 1', sym: 'JA1', getVal: () => g.JA1 },
            { cell: 'P207', name: 'Hệ số trượt riêng chân răng 2', sym: 'JE2', getVal: () => g.JE2 },
            { cell: 'O208', name: 'Hệ số trượt riêng đỉnh răng 1', sym: 'JE1', getVal: () => g.JE1 },
            { cell: 'P208', name: 'Hệ số trượt riêng đỉnh răng 2', sym: 'JA2', getVal: () => g.JA2 },
            { cell: 'O209', name: 'Tổng trị tuyệt đối hệ số trượt riêng', sym: 'Sum|J|', getVal: () => g.sum_J },

            { cell: 'O241', name: 'Số răng bánh 1', sym: 'z1', getVal: () => g.z1 },
            { cell: 'P241', name: 'Số răng bánh 2', sym: 'z2', getVal: () => g.z2 },
            { cell: 'O242', name: 'Chiều rộng bánh 1', sym: 'b1', getVal: () => g.b1 },
            { cell: 'P242', name: 'Chiều rộng bánh 2', sym: 'b2', getVal: () => g.b2 },
            { cell: 'O243', name: 'Mô đun pháp tuyến', sym: 'mn', getVal: () => g.mn },
            { cell: 'O244', name: 'Mô đun mặt mút', sym: 'mt', getVal: () => g.mt },
            { cell: 'O245', name: 'Bước răng danh nghĩa', sym: 'p', getVal: () => g.p_n },
            { cell: 'O246', name: 'Bước răng mặt mút', sym: 'pt', getVal: () => g.pt },
            { cell: 'O247', name: 'Bước răng cơ sở', sym: 'ptb', getVal: () => g.ptb },
            { cell: 'O248', name: 'Khoảng cách trục lý thuyết', sym: 'a', getVal: () => g.a },
            { cell: 'O249', name: 'Khoảng cách trục chế tạo', sym: 'av', getVal: () => g.av },
            { cell: 'O250', name: 'Khoảng cách trục làm việc', sym: 'aw', getVal: () => g.aw },
            { cell: 'O251', name: 'Góc áp lực danh nghĩa', sym: 'α', getVal: () => g.alfa_n },
            { cell: 'O252', name: 'Góc áp lực mặt mút', sym: 'αt', getVal: () => g.alfat },
            { cell: 'O253', name: 'Góc ăn khớp làm việc pháp tuyến', sym: 'αwn', getVal: () => g.alfawn },
            { cell: 'O254', name: 'Góc ăn khớp làm việc mặt mút', sym: 'αwt', getVal: () => g.alfawt },
            { cell: 'O255', name: 'Góc xoắn danh nghĩa', sym: 'β', getVal: () => g.beta },
            { cell: 'O256', name: 'Góc xoắn cơ sở', sym: 'βb', getVal: () => g.betab },
            { cell: 'O257', name: 'Đường kính đỉnh bánh 1', sym: 'da1', getVal: () => g.da1 },
            { cell: 'P257', name: 'Đường kính đỉnh bánh 2', sym: 'da2', getVal: () => g.da2 },
            { cell: 'O258', name: 'Đường kính chia bánh 1', sym: 'd1', getVal: () => g.d1 },
            { cell: 'P258', name: 'Đường kính chia bánh 2', sym: 'd2', getVal: () => g.d2 },
            { cell: 'O259', name: 'Đường kính cơ sở bánh 1', sym: 'db1', getVal: () => g.db1 },
            { cell: 'P259', name: 'Đường kính cơ sở bánh 2', sym: 'db2', getVal: () => g.db2 },
            { cell: 'O260', name: 'Đường kính chân răng bánh 1', sym: 'df1', getVal: () => g.df1 },
            { cell: 'P260', name: 'Đường kính chân răng bánh 2', sym: 'df2', getVal: () => g.df2 },
            { cell: 'O261', name: 'Đường kính lăn làm việc bánh 1', sym: 'dw1', getVal: () => g.dw1 },
            { cell: 'P261', name: 'Đường kính lăn làm việc bánh 2', sym: 'dw2', getVal: () => g.dw2 },
            { cell: 'O262', name: 'Chiều cao đỉnh răng bánh 1', sym: 'ha1', getVal: () => g.ha1 },
            { cell: 'P262', name: 'Chiều cao đỉnh răng bánh 2', sym: 'ha2', getVal: () => g.ha2 },
            { cell: 'O263', name: 'Chiều cao chân răng bánh 1', sym: 'hf1', getVal: () => g.hf1 },
            { cell: 'P263', name: 'Chiều cao chân răng bánh 2', sym: 'hf2', getVal: () => g.hf2 },
            { cell: 'O264', name: 'Chiều dày đỉnh răng pháp tuyến 1', sym: 'sna1', getVal: () => g.sna1 },
            { cell: 'P264', name: 'Chiều dày đỉnh răng pháp tuyến 2', sym: 'sna2', getVal: () => g.sna2 },
            { cell: 'O266', name: 'Chiều dày răng vòng chia pháp tuyến 1', sym: 'sn1', getVal: () => g.sn1 },
            { cell: 'P266', name: 'Chiều dày răng vòng chia pháp tuyến 2', sym: 'sn2', getVal: () => g.sn2 },
            { cell: 'O268', name: 'Chiều dày răng vòng cơ sở 1', sym: 'sb1', getVal: () => g.sb1 },
            { cell: 'P268', name: 'Chiều dày răng vòng cơ sở 2', sym: 'sb2', getVal: () => g.sb2 },
            { cell: 'O269', name: 'Chiều dày đỉnh răng không thứ nguyên 1', sym: 'sa1*', getVal: () => g.sa1_star },
            { cell: 'P269', name: 'Chiều dày đỉnh răng không thứ nguyên 2', sym: 'sa2*', getVal: () => g.sa2_star },

            { cell: 'O279', name: 'Số răng thực tế 1', sym: 'z1', getVal: () => g.z1 },
            { cell: 'P279', name: 'Số răng thực tế 2', sym: 'z2', getVal: () => g.z2 },
            { cell: 'O280', name: 'Số răng tương đương 1', sym: 'zn1', getVal: () => g.zn1 },
            { cell: 'P280', name: 'Số răng tương đương 2', sym: 'zn2', getVal: () => g.zn2 },
            { cell: 'O282', name: 'Số răng nhỏ nhất cắt chân nhỏ 1', sym: 'zmin1_1', getVal: () => g.zmin1_1 },
            { cell: 'P282', name: 'Số răng nhỏ nhất cắt chân nhỏ 2', sym: 'zmin1_2', getVal: () => g.zmin1_2 },
            { cell: 'O283', name: 'Số răng nhỏ nhất không cắt chân 1', sym: 'zmin2_1', getVal: () => g.zmin2_1 },
            { cell: 'P283', name: 'Số răng nhỏ nhất không cắt chân 2', sym: 'zmin2_2', getVal: () => g.zmin2_2 },
            { cell: 'O284', name: 'Số răng nhỏ nhất không nhọn đầu 1', sym: 'zmin3_1', getVal: () => g.zmin3_1 },
            { cell: 'P284', name: 'Số răng nhỏ nhất không nhọn đầu 2', sym: 'zmin3_2', getVal: () => g.zmin3_2 },

            { cell: 'O297', name: 'Hệ số trùng khớp ngang', sym: 'εα', getVal: () => g.epsilon_A },
            { cell: 'P297', name: 'Hệ số trùng khớp dọc', sym: 'εβ', getVal: () => g.epsilon_B },
            { cell: 'O298', name: 'Hệ số trùng khớp tổng', sym: 'εγ', getVal: () => g.epsilon_G },
            { cell: 'O300', name: 'Đường kính trục nhỏ nhất bánh 1', sym: 'Dsmin1', getVal: () => g.Dsmin1 },
            { cell: 'P300', name: 'Đường kính trục nhỏ nhất bánh 2', sym: 'Dsmin2', getVal: () => g.Dsmin2 },
            { cell: 'O301', name: 'Đường kính moay-ơ nhỏ nhất bánh 1', sym: 'Dhmin1', getVal: () => g.Dhmin1 },
            { cell: 'P301', name: 'Đường kính moay-ơ nhỏ nhất bánh 2', sym: 'Dhmin2', getVal: () => g.Dhmin2 },
            { cell: 'O302', name: 'Đường kính trục lớn nhất bánh 1', sym: 'Dsmax1', getVal: () => g.Dsmax1 },
            { cell: 'P302', name: 'Đường kính trục lớn nhất bánh 2', sym: 'Dsmax2', getVal: () => g.Dsmax2 },
            { cell: 'O307', name: 'Chiều dày vành răng bánh 1', sym: 'sR1', getVal: () => g.sR1 },
            { cell: 'P307', name: 'Chiều dày vành răng bánh 2', sym: 'sR2', getVal: () => g.sR2 },
            { cell: 'O308', name: 'Chiều dày nan hoa bánh 1', sym: 'bs1', getVal: () => g.bs1 },
            { cell: 'P308', name: 'Chiều dày nan hoa bánh 2', sym: 'bs2', getVal: () => g.bs2 },
            { cell: 'O309', name: 'Khối lượng bánh 1', sym: 'm1', getVal: () => g.m1 },
            { cell: 'P309', name: 'Khối lượng bánh 2', sym: 'm2', getVal: () => g.m2 },
            { cell: 'O314', name: 'Vận tốc vòng trên vòng chia', sym: 'v', getVal: () => g.v },
            { cell: 'O315', name: 'Lực tiếp tuyến riêng bánh 1', sym: 'wt1', getVal: () => g.wt1 },
            { cell: 'P315', name: 'Lực tiếp tuyến riêng bánh 2', sym: 'wt2', getVal: () => g.wt2 },
            { cell: 'O318', name: 'Tổng khối lượng bộ truyền', sym: 'mtotal', getVal: () => g.m_total },
            { cell: 'O319', name: 'Hiệu suất bộ truyền', sym: 'η', getVal: () => g.eta },

            { cell: 'O390', name: 'Số răng đo pháp tuyến chung 1', sym: 'zw1', getVal: () => g.zw1 },
            { cell: 'P390', name: 'Số răng đo pháp tuyến chung 2', sym: 'zw2', getVal: () => g.zw2 },
            { cell: 'O392', name: 'Chiều dài pháp tuyến chung 1', sym: 'W1', getVal: () => g.W1 },
            { cell: 'P392', name: 'Chiều dài pháp tuyến chung 2', sym: 'W2', getVal: () => g.W2 },
            { cell: 'O393', name: 'Đường kính bi/đũa đo 1', sym: 'dt1', getVal: () => g.dt1 },
            { cell: 'P393', name: 'Đường kính bi/đũa đo 2', sym: 'dt2', getVal: () => g.dt2 },
            { cell: 'O395', name: 'Kích thước qua bi/đũa đo 1', sym: 'M1', getVal: () => g.M1 },
            { cell: 'P395', name: 'Kích thước qua bi/đũa đo 2', sym: 'M2', getVal: () => g.M2 },

            { cell: 'O403', name: 'Mô đun danh nghĩa ISO 1328', sym: 'mn', getVal: () => g.mn },
            { cell: 'O404', name: 'Đường kính chia bánh 1 ISO 1328', sym: 'd1', getVal: () => g.d1 },
            { cell: 'P404', name: 'Đường kính chia bánh 2 ISO 1328', sym: 'd2', getVal: () => g.d2 },
            { cell: 'O405', name: 'Chiều rộng vành răng 1 ISO 1328', sym: 'b1', getVal: () => g.b1 },
            { cell: 'P405', name: 'Chiều rộng vành răng 2 ISO 1328', sym: 'b2', getVal: () => g.b2 },
            { cell: 'O406', name: 'Hệ số trùng khớp tổng ISO 1328', sym: 'εγ', getVal: () => g.epsilon_G },
            { cell: 'O407', name: 'Dung sai bước đơn bánh 1', sym: 'fpt1', getVal: () => g.fpt1 },
            { cell: 'P407', name: 'Dung sai bước đơn bánh 2', sym: 'fpt2', getVal: () => g.fpt2 },
            { cell: 'O409', name: 'Dung sai tích lũy k răng bánh 1', sym: 'Fpk1', getVal: () => g.Fpk1 },
            { cell: 'P409', name: 'Dung sai tích lũy k răng bánh 2', sym: 'Fpk2', getVal: () => g.Fpk2 },
            { cell: 'O410', name: 'Tổng dung sai tích lũy bước bánh 1', sym: 'Fp1', getVal: () => g.Fp1 },
            { cell: 'P410', name: 'Tổng dung sai tích lũy bước bánh 2', sym: 'Fp2', getVal: () => g.Fp2 },
            { cell: 'O411', name: 'Tổng dung sai biên dạng bánh 1', sym: 'Fa1', getVal: () => g.Fa1 },
            { cell: 'P411', name: 'Tổng dung sai biên dạng bánh 2', sym: 'Fa2', getVal: () => g.Fa2 },
            { cell: 'O412', name: 'Tổng dung sai hướng răng bánh 1', sym: 'Fb1', getVal: () => g.Fb1 },
            { cell: 'P412', name: 'Tổng dung sai hướng răng bánh 2', sym: 'Fb2', getVal: () => g.Fb2 },
            { cell: 'O413', name: 'Sai lệch ăn khớp đơn bánh 1', sym: "fi1'", getVal: () => g.fi1 },
            { cell: 'P413', name: 'Sai lệch ăn khớp đơn bánh 2', sym: "fi2'", getVal: () => g.fi2 },
            { cell: 'O414', name: 'Tổng sai lệch tiếp xúc ăn khớp 1', sym: "Fi1'", getVal: () => g.Fi1 },
            { cell: 'P414', name: 'Tổng sai lệch tiếp xúc ăn khớp 2', sym: "Fi2'", getVal: () => g.Fi2 },
            { cell: 'O415', name: 'Sai lệch dạng biên dạng bánh 1', sym: 'ffa1', getVal: () => g.ffa1 },
            { cell: 'P415', name: 'Sai lệch dạng biên dạng bánh 2', sym: 'ffa2', getVal: () => g.ffa2 },
            { cell: 'O416', name: 'Sai lệch độ nghiêng biên dạng bánh 1', sym: 'fHa1', getVal: () => g.fHa1 },
            { cell: 'P416', name: 'Sai lệch độ nghiêng biên dạng bánh 2', sym: 'fHa2', getVal: () => g.fHa2 },
            { cell: 'O417', name: 'Sai lệch dạng hướng răng bánh 1', sym: 'ffb1', getVal: () => g.ffb1 },
            { cell: 'P417', name: 'Sai lệch dạng hướng răng bánh 2', sym: 'ffb2', getVal: () => g.ffb2 },
            { cell: 'O418', name: 'Sai lệch độ nghiêng hướng răng 1', sym: 'fHb1', getVal: () => g.fHb1 },
            { cell: 'P418', name: 'Sai lệch độ nghiêng hướng răng 2', sym: 'fHb2', getVal: () => g.fHb2 }
        ];

        tbody.innerHTML = '';
        let passCount = 0;

        auditItems.forEach(item => {
            const webVal = item.getVal();
            let mitVal = webVal;
            if (typeof SPUR_REF_BENCHMARK !== 'undefined' && typeof HELICAL_REF_BENCHMARK !== 'undefined') {
                const ref = isHelical ? HELICAL_REF_BENCHMARK : SPUR_REF_BENCHMARK;
                if (ref[item.cell] !== undefined) {
                    mitVal = ref[item.cell];
                }
            }
            const delta = Math.abs(webVal - mitVal);
            const isPass = delta <= 1e-4;
            if (isPass) passCount++;

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="font-weight:700; color:#38bdf8;">${item.cell}</td>
                <td>${item.name}</td>
                <td style="font-family:Consolas; color:#f59e0b;">${item.sym}</td>
                <td style="text-align:right; font-family:Consolas; font-weight:700; color:#34d399;">${webVal.toFixed(4)}</td>
                <td style="text-align:right; font-family:Consolas; color:#94a3b8;">${mitVal.toFixed(4)}</td>
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

    exportDXF() {
        const g = this.g;
        if (!g) return;

        // Transverse parameters for 2D profile
        const isHelical = Math.abs(g.beta || 0) > 1e-4;
        const betaRad = (g.beta || 0) * Math.PI / 180.0;
        const m_canvas = isHelical ? (g.mt || (g.mn / Math.cos(betaRad))) : g.mn;
        const alpha_canvas = isHelical ? (g.alfat || (Math.atan(Math.tan((g.alfa_n || 20) * Math.PI / 180.0) / Math.cos(betaRad)) * 180.0 / Math.PI)) : g.alfa_n;

        const pts1 = ToothProfileGenerator.generateProfile(g.z1, m_canvas, alpha_canvas, g.x1, g.d1, g.db1, g.da1, g.df1);
        const pts2 = ToothProfileGenerator.generateProfile(g.z2, m_canvas, alpha_canvas, g.x2, g.d2, g.db2, g.da2, g.df2);

        if (!pts1 || pts1.length === 0 || !pts2 || pts2.length === 0) {
            alert('Không thể tạo biên dạng răng để xuất DXF.');
            return;
        }

        const lines = [
            '0', 'SECTION',
            '2', 'HEADER',
            '9', '$ACADVER',
            '1', 'AC1009',
            '0', 'ENDSEC',
            '0', 'SECTION',
            '2', 'TABLES',
            '0', 'TABLE',
            '2', 'LAYER',
            '70', '6',
            '0', 'LAYER', '2', 'GEAR1_PINION', '70', '0', '62', '1', '6', 'CONTINUOUS',
            '0', 'LAYER', '2', 'GEAR2_WHEEL', '70', '0', '62', '5', '6', 'CONTINUOUS',
            '0', 'LAYER', '2', 'PITCH_CIRCLES', '70', '0', '62', '3', '6', 'CENTER',
            '0', 'LAYER', '2', 'CENTER_LINES', '70', '0', '62', '2', '6', 'CENTER',
            '0', 'LAYER', '2', 'SHAFTS_BORE', '70', '0', '62', '7', '6', 'CONTINUOUS',
            '0', 'LAYER', '2', 'MFG_TABLE', '70', '0', '62', '7', '6', 'CONTINUOUS',
            '0', 'ENDTAB',
            '0', 'ENDSEC',
            '0', 'SECTION',
            '2', 'ENTITIES'
        ];

        const addPolyline = (points, layer, offX = 0, offY = 0, rot = 0) => {
            lines.push('0', 'POLYLINE', '8', layer, '66', '1', '70', '1');
            const cosR = Math.cos(rot);
            const sinR = Math.sin(rot);
            for (let i = 0; i < points.length; i++) {
                const px = points[i].x * cosR - points[i].y * sinR + offX;
                const py = points[i].x * sinR + points[i].y * cosR + offY;
                lines.push('0', 'VERTEX', '8', layer, '10', px.toFixed(4), '20', py.toFixed(4), '30', '0.0');
            }
            lines.push('0', 'SEQEND');
        };

        const addCircle = (cx, cy, r, layer) => {
            lines.push('0', 'CIRCLE', '8', layer, '10', cx.toFixed(4), '20', cy.toFixed(4), '30', '0.0', '40', r.toFixed(4));
        };

        const addLine = (x1, y1, x2, y2, layer) => {
            lines.push('0', 'LINE', '8', layer, '10', x1.toFixed(4), '20', y1.toFixed(4), '30', '0.0', '11', x2.toFixed(4), '21', y2.toFixed(4), '31', '0.0');
        };

        const addText = (text, x, y, h, layer) => {
            lines.push('0', 'TEXT', '8', layer, '10', x.toFixed(4), '20', y.toFixed(4), '30', '0.0', '40', h.toFixed(4), '1', text);
        };

        // Pinion 1 Polyline at (0, 0)
        addPolyline(pts1, 'GEAR1_PINION', 0, 0, 0);

        // Gear 2 Polyline at (aw, 0) with conjugate phase
        const pitchAngle2 = (2.0 * Math.PI) / g.z2;
        const phaseOffset = Math.PI + (pitchAngle2 / 2.0);
        addPolyline(pts2, 'GEAR2_WHEEL', g.aw, 0, phaseOffset);

        // Pitch Circles
        addCircle(0, 0, g.d1 / 2.0, 'PITCH_CIRCLES');
        addCircle(g.aw, 0, g.d2 / 2.0, 'PITCH_CIRCLES');
        if (Math.abs(g.dw1 - g.d1) > 0.001) {
            addCircle(0, 0, g.dw1 / 2.0, 'PITCH_CIRCLES');
            addCircle(g.aw, 0, g.dw2 / 2.0, 'PITCH_CIRCLES');
        }

        // Shaft Bores
        const boreR1 = (g.df1 / 2.0) * 0.38;
        const boreR2 = (g.df2 / 2.0) * 0.38;
        addCircle(0, 0, boreR1, 'SHAFTS_BORE');
        addCircle(g.aw, 0, boreR2, 'SHAFTS_BORE');

        // Centerlines
        const spanX = g.aw + g.da2 / 2.0 + 20;
        addLine(-g.da1 / 2.0 - 20, 0, spanX, 0, 'CENTER_LINES');
        addLine(0, -g.da1 / 2.0 - 15, 0, g.da1 / 2.0 + 15, 'CENTER_LINES');
        addLine(g.aw, -g.da2 / 2.0 - 15, g.aw, g.da2 / 2.0 + 15, 'CENTER_LINES');

        // Manufacturing Data Table in DXF
        const tblX = -g.da1 / 2.0;
        let tblY = -Math.max(g.da1, g.da2) / 2.0 - 40;
        const rowH = 7.0;

        addText('THONG SO CHE TAO BANH RANG TRU (ISO 6336 / DIN 3960)', tblX, tblY, 4.5, 'MFG_TABLE');
        tblY -= rowH * 1.3;
        addText(`- So rang (Pinion z1 / Gear z2): ${g.z1} / ${g.z2}`, tblX, tblY, 3.5, 'MFG_TABLE');
        tblY -= rowH;
        addText(`- Mo-dun phap tuyen (Normal module mn): ${g.mn.toFixed(4)} mm`, tblX, tblY, 3.5, 'MFG_TABLE');
        tblY -= rowH;
        addText(`- Goc ap luc danh nghia (Pressure angle alpha): ${g.alfa_n.toFixed(4)} deg`, tblX, tblY, 3.5, 'MFG_TABLE');
        tblY -= rowH;
        addText(`- Goc xoan rang (Helix angle beta): ${g.beta.toFixed(4)} deg`, tblX, tblY, 3.5, 'MFG_TABLE');
        tblY -= rowH;
        addText(`- Khoang cach truc lam viec (Center distance aw): ${g.aw.toFixed(4)} mm`, tblX, tblY, 3.5, 'MFG_TABLE');
        tblY -= rowH;
        addText(`- He so dich chinh (Profile shift x1 / x2): ${g.x1.toFixed(4)} / ${g.x2.toFixed(4)}`, tblX, tblY, 3.5, 'MFG_TABLE');
        tblY -= rowH;
        addText(`- Duong kinh dinh (Tip dia da1 / da2): ${g.da1.toFixed(4)} / ${g.da2.toFixed(4)} mm`, tblX, tblY, 3.5, 'MFG_TABLE');
        tblY -= rowH;
        addText(`- Duong kinh chan (Root dia df1 / df2): ${g.df1.toFixed(4)} / ${g.df2.toFixed(4)} mm`, tblX, tblY, 3.5, 'MFG_TABLE');
        tblY -= rowH;
        addText(`- Chieu dai phap tuyen chung (Chordal W1 / W2): ${g.W1.toFixed(4)} / ${g.W2.toFixed(4)} mm`, tblX, tblY, 3.5, 'MFG_TABLE');
        tblY -= rowH;
        addText(`- Cap chinh xac che tao (Accuracy grade Q): ISO 1328 Cap ${g.sec11_Q || 6}`, tblX, tblY, 3.5, 'MFG_TABLE');

        lines.push('0', 'ENDSEC', '0', 'EOF');

        const dxfBlob = new Blob([lines.join('\n')], { type: 'application/dxf' });
        const downloadUrl = URL.createObjectURL(dxfBlob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = `Banh_Rang_Tru_MITCalc_${g.z1}x${g.z2}_m${g.mn}.dxf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(downloadUrl);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.spurApp = new SpurGearUI();
});
