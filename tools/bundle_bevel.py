import os
import re

base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

with open(os.path.join(base_dir, "shared", "js", "materials.js"), "r", encoding="utf-8") as f:
    mat_content = f.read()

mat_clean = mat_content.replace("export const Materials =", "const Materials =")
if "const MATERIALS_DB" not in mat_clean:
    mat_clean += "\nconst MATERIALS_DB = Materials;\n"

with open(os.path.join(base_dir, "modules", "bevel-gear", "js", "bevel-calc-engine.js"), "r", encoding="utf-8") as f:
    engine_content = f.read()
engine_clean = re.sub(r"if\s*\(\s*typeof\s*module.*?\n\}", "", engine_content, flags=re.DOTALL)

with open(os.path.join(base_dir, "modules", "bevel-gear", "js", "bevel-canvas.js"), "r", encoding="utf-8") as f:
    canvas_content = f.read()
canvas_clean = re.sub(r"if\s*\(\s*typeof\s*module.*?\n\}", "", canvas_content, flags=re.DOTALL)

with open(os.path.join(base_dir, "modules", "bevel-gear", "js", "bevel-ui.js"), "r", encoding="utf-8") as f:
    ui_content = f.read()

header = """// MITCalc Web App - Bevel Gear Classic Unified Script Bundle
// 100% Client-Side, Zero Dependencies, Zero External Module Imports
// Standards: ISO 23509, DIN 3971, ISO 10300, AGMA 2005

"""

bundle = header + mat_clean + "\n\n" + engine_clean + "\n\n" + canvas_clean + "\n\n" + ui_content + "\n"

bundle_path = os.path.join(base_dir, "modules", "bevel-gear", "js", "bevel-engine.bundle.js")
with open(bundle_path, "w", encoding="utf-8") as f:
    f.write(bundle)

print(f"Successfully generated {bundle_path} ({len(bundle)} characters)")
