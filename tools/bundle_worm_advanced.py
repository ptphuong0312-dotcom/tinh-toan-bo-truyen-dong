import os
import re

base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
worm_dir = os.path.join(base_dir, "modules", "worm-gear-advanced")

with open(os.path.join(base_dir, "shared", "js", "materials.js"), "r", encoding="utf-8") as f:
    mat_content = f.read()

mat_clean = mat_content.replace("export const Materials =", "const Materials =")
if "const MATERIALS_DB" not in mat_clean:
    mat_clean += "\nconst MATERIALS_DB = Materials;\nconst MITCALC_MATERIALS = Materials;\n"

with open(os.path.join(worm_dir, "data", "worm-materials.js"), "r", encoding="utf-8") as f:
    worm_mat_content = f.read()
worm_mat_clean = re.sub(r"if\s*\(\s*typeof\s*module.*?\n\}", "", worm_mat_content, flags=re.DOTALL)

with open(os.path.join(worm_dir, "js", "worm-calc-engine.js"), "r", encoding="utf-8") as f:
    engine_content = f.read()
engine_clean = re.sub(r"if\s*\(\s*typeof\s*module.*?\n\}", "", engine_content, flags=re.DOTALL)

with open(os.path.join(worm_dir, "js", "worm-canvas.js"), "r", encoding="utf-8") as f:
    canvas_content = f.read()
canvas_clean = re.sub(r"if\s*\(\s*typeof\s*module.*?\n\}", "", canvas_content, flags=re.DOTALL)

with open(os.path.join(worm_dir, "js", "engine", "worm-3d-generator.js"), "r", encoding="utf-8") as f:
    gen3d_content = f.read()
gen3d_clean = re.sub(r"if\s*\(\s*typeof\s*module.*?\n\}", "", gen3d_content, flags=re.DOTALL)

with open(os.path.join(worm_dir, "js", "engine", "worm-3d-exporter.js"), "r", encoding="utf-8") as f:
    exp3d_content = f.read()
exp3d_clean = re.sub(r"if\s*\(\s*typeof\s*module.*?\n\}", "", exp3d_content, flags=re.DOTALL)

with open(os.path.join(worm_dir, "js", "ui", "worm-3d-visualizer.js"), "r", encoding="utf-8") as f:
    vis3d_content = f.read()
vis3d_clean = re.sub(r"if\s*\(\s*typeof\s*module.*?\n\}", "", vis3d_content, flags=re.DOTALL)

with open(os.path.join(worm_dir, "js", "worm-ui.js"), "r", encoding="utf-8") as f:
    ui_content = f.read()

header = """// MITCalc Web App - Advanced Worm Gear Script Bundle (Module 5)
// 100% Client-Side, Zero Dependencies, Zero External Module Imports
// Standards: DIN 3975, DIN 3996, AGMA 6022-C93
// Real-time 2D Canvas, Dynamic Chart 1963, 3D WebGL & CAD Export

"""

bundle = (
    header
    + mat_clean + "\n\n"
    + worm_mat_clean + "\n\n"
    + engine_clean + "\n\n"
    + canvas_clean + "\n\n"
    + gen3d_clean + "\n\n"
    + exp3d_clean + "\n\n"
    + vis3d_clean + "\n\n"
    + ui_content + "\n"
)

bundle_path = os.path.join(worm_dir, "js", "worm-engine.bundle.js")
with open(bundle_path, "w", encoding="utf-8") as f:
    f.write(bundle)

print(f"Successfully generated {bundle_path} ({len(bundle)} characters)")
