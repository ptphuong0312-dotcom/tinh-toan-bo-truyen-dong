import os

tools_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(tools_dir)
base_dir = os.path.join(project_root, 'modules', 'tolerances', 'js')

files = [
    'tolerances-data.js',
    'tolerances-calc.js',
    'tolerances-canvas.js',
    'tolerances-ui.js'
]

bundle_path = os.path.join(base_dir, 'tolerances-engine.bundle.js')

bundle_content = [
    "/**\n",
    " * TOLERANCES & FITS ENGINE BUNDLE (ISO 286 / ANSI B4.1 / ISO 2768)\n",
    " * 100% Offline Client-Side Single Bundle (Zero-CORS, Zero-Node.js)\n",
    " * MITCalc Web App Engineering - SirPhuong\n",
    " */\n\n"
]

for fname in files:
    fpath = os.path.join(base_dir, fname)
    with open(fpath, 'r', encoding='utf-8') as f:
        bundle_content.append(f"/* === BEGIN {fname} === */\n")
        bundle_content.append(f.read())
        bundle_content.append(f"\n/* === END {fname} === */\n\n")

with open(bundle_path, 'w', encoding='utf-8') as f:
    f.write(''.join(bundle_content))

print(f"Dong goi tolerances thanh cong: {bundle_path} ({os.path.getsize(bundle_path)} bytes)")
