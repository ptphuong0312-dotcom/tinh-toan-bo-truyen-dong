import os
import zipfile
import datetime
import sys

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

def run_backup():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    backup_dir = os.path.join(base_dir, "backups")
    os.makedirs(backup_dir, exist_ok=True)

    now_str = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    zip_name = f"BACKUP_MITCalc_Gear_{now_str}.zip"
    zip_path = os.path.join(backup_dir, zip_name)

    print("===============================================================================")
    print(f"[*] Dang nen toan bo du an vao: {zip_path}")
    print("===============================================================================")

    file_count = 0
    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zf:
        for root, dirs, files in os.walk(base_dir):
            if "backups" in root or "__pycache__" in root:
                continue
            for f in files:
                fp = os.path.join(root, f)
                arc = os.path.relpath(fp, base_dir)
                zf.write(fp, arc)
                file_count += 1

    size_kb = os.path.getsize(zip_path) / 1024
    print(f"[+] Thanh cong! Da sao luu {file_count} files.")
    print(f"[+] Dung luong: {size_kb:.2f} KB")
    print(f"[+] Vi tri: {zip_path}")

if __name__ == "__main__":
    run_backup()
