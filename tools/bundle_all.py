import os
import subprocess
import sys

tools_dir = os.path.dirname(os.path.abspath(__file__))
python_bin = sys.executable

print("===============================================================================")
print("          DONG GOI MA NGUON JAVASCRIPT THUAN (CORS-FREE BUNDLER)")
print("===============================================================================")
print()

print("[1/3] Dang dong goi Mo-dun Banh Rang Tru (Spur & Helical Gear)...")
res1 = subprocess.run([python_bin, os.path.join(tools_dir, "bundle_spur.py")])

print("[2/3] Dang dong goi Mo-dun Banh Rang Con (Bevel Gear)...")
res2 = subprocess.run([python_bin, os.path.join(tools_dir, "bundle_bevel.py")])

print("[3/3] Dang dong goi Mo-dun Truc Vit - Banh Vit (Worm Gear)...")
res3 = subprocess.run([python_bin, os.path.join(tools_dir, "bundle_worm.py")])

if res1.returncode == 0 and res2.returncode == 0 and res3.returncode == 0:
    print()
    print(">>> DONG GOI HOAN TAT 100% THANH CONG (3/3 MO-DUN)!")
else:
    print()
    print(">>> CO LOI XAY RA TRONG QUA TRINH DONG GOI!")
    sys.exit(1)
