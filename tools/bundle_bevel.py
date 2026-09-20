import os
import re

base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
bevel_dir = os.path.join(base_dir, "modules", "bevel-gear")

with open(os.path.join(base_dir, "shared", "js", "materials.js"), "r", encoding="utf-8") as f:
    mat_content = f.read()

mat_clean = mat_content.replace("export const Materials =", "const Materials =")
if "const MATERIALS_DB" not in mat_clean:
    mat_clean += "\nconst MATERIALS_DB = Materials;\n"

with open(os.path.join(bevel_dir, "js", "bevel-calc-engine.js"), "r", encoding="utf-8") as f:
    engine_content = f.read()
engine_clean = re.sub(r"if\s*\(\s*typeof\s*module.*?\n\}", "", engine_content, flags=re.DOTALL)

with open(os.path.join(bevel_dir, "js", "bevel-canvas.js"), "r", encoding="utf-8") as f:
    canvas_content = f.read()
canvas_clean = re.sub(r"if\s*\(\s*typeof\s*module.*?\n\}", "", canvas_content, flags=re.DOTALL)

with open(os.path.join(bevel_dir, "js", "engine", "bevel-3d-generator.js"), "r", encoding="utf-8") as f:
    lines = [l for l in f if not l.strip().startswith("import ")]
    gen3d_code = "".join(lines).replace("export const Bevel3DGenerator =", "const Bevel3DGenerator =")
    gen3d_code += "\nif (typeof window !== 'undefined') window.Bevel3DGenerator = Bevel3DGenerator;\n"

with open(os.path.join(bevel_dir, "js", "engine", "bevel-3d-exporter.js"), "r", encoding="utf-8") as f:
    lines = [l for l in f if not l.strip().startswith("import ")]
    exp3d_code = "".join(lines).replace("export const Bevel3DExporter =", "const Bevel3DExporter =")
    exp3d_code += "\nif (typeof window !== 'undefined') window.Bevel3DExporter = Bevel3DExporter;\n"

with open(os.path.join(bevel_dir, "js", "ui", "bevel-3d-visualizer.js"), "r", encoding="utf-8") as f:
    lines = [l for l in f if not l.strip().startswith("import ")]
    vis3d_code = "".join(lines).replace("export class Bevel3DVisualizer", "class Bevel3DVisualizer")
    vis3d_code += "\nif (typeof window !== 'undefined') window.Bevel3DVisualizer = Bevel3DVisualizer;\n"

with open(os.path.join(bevel_dir, "js", "engine", "bevel-dxf-exporter.js"), "r", encoding="utf-8") as f:
    lines = [l for l in f if not l.strip().startswith("import ")]
    dxf_code = "".join(lines).replace("export const BEVEL_PROFILE_RESOLUTIONS =", "const BEVEL_PROFILE_RESOLUTIONS =")
    dxf_code = dxf_code.replace("export const BevelDxfExporter =", "const BevelDxfExporter =")
    dxf_code += "\nif (typeof window !== 'undefined') { window.BevelDxfExporter = BevelDxfExporter; window.BEVEL_PROFILE_RESOLUTIONS = BEVEL_PROFILE_RESOLUTIONS; }\n"

with open(os.path.join(bevel_dir, "js", "bevel-ui.js"), "r", encoding="utf-8") as f:
    ui_content = f.read()

header = """// MITCalc Web App - Bevel Gear Classic Unified Script Bundle
// 100% Client-Side, Zero Dependencies, Zero External Module Imports
// Standards: ISO 23509, DIN 3971, DIN 3965, AGMA 2005
// Real-time 2D Canvas & 3D WebGL Visualization & CAD Export (Solid & Surface & 2D DXF)

"""

bundle = (
    header
    + mat_clean + "\n\n"
    + engine_clean + "\n\n"
    + canvas_clean + "\n\n"
    + gen3d_code + "\n\n"
    + exp3d_code + "\n\n"
    + vis3d_code + "\n\n"
    + dxf_code + "\n\n"
    + ui_content + "\n"
)

bundle_path = os.path.join(bevel_dir, "js", "bevel-engine.bundle.js")
with open(bundle_path, "w", encoding="utf-8") as f:
    f.write(bundle)

print(f"Successfully generated {bundle_path} ({len(bundle)} characters)")
