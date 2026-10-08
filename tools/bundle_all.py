import os
import subprocess
import sys

tools_dir = os.path.dirname(os.path.abspath(__file__))
python_bin = sys.executable

print("===============================================================================")
print("          DONG GOI MA NGUON JAVASCRIPT THUAN (CORS-FREE BUNDLER)")
print("===============================================================================")
print()

print("[1/5] Dang dong goi Mo-dun Banh Rang Tru (Spur & Helical Gear)...")
res1 = subprocess.run([python_bin, os.path.join(tools_dir, "bundle_spur.py")])

print("[2/5] Dang dong goi Mo-dun Banh Rang Con (Bevel Gear)...")
res2 = subprocess.run([python_bin, os.path.join(tools_dir, "bundle_bevel.py")])

print("[3/5] Dang dong goi Mo-dun Truc Vit - Banh Vit (Worm Gear)...")
res3 = subprocess.run([python_bin, os.path.join(tools_dir, "bundle_worm.py")])

print("[4/5] Dang dong goi Mo-dun Banh Rang Con Mo Rong (Advanced Bevel Gear)...")
res4 = subprocess.run([python_bin, os.path.join(tools_dir, "bundle_bevel_advanced.py")])

print("[5/6] Dang dong goi Mo-dun Truc Vit - Banh Vit Mo Rong (Advanced Worm Gear)...")
res5 = subprocess.run([python_bin, os.path.join(tools_dir, "bundle_worm_advanced.py")])

print("[6/7] Dang dong goi Mo-dun Bang Tra Dung Sai & Lap Ghep (Tolerances & Fits)...")
res6 = subprocess.run([python_bin, os.path.join(tools_dir, "bundle_tolerances.py")])

print("[7/8] Dang dong goi Mo-dun Then Hoa Than Khai (Involute Splines)...")
res7 = subprocess.run([python_bin, os.path.join(tools_dir, "bundle_splines.py")])

print("[8/8] Dang dong goi Mo-dun Then & Then Hoa Rang Chu Nhat (Keys & Straight Splines)...")
res8 = subprocess.run([python_bin, os.path.join(tools_dir, "bundle_shaft_keys.py")])

if res1.returncode == 0 and res2.returncode == 0 and res3.returncode == 0 and res4.returncode == 0 and res5.returncode == 0 and res6.returncode == 0 and res7.returncode == 0 and res8.returncode == 0:
    print()
    print(">>> DONG GOI HOAN TAT 100% THANH CONG (8/8 MO-DUN)!")
else:
    print()
    print(">>> CO LOI XAY RA TRONG QUA TRINH DONG GOI!")
    sys.exit(1)

