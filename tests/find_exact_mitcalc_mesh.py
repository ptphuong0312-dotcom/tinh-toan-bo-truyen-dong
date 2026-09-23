import numpy as np

# MITCalc parameters
z1 = 18
z2 = 45
gearRatio = z2 / z1 # 2.5
mmn = 10.0
b = 117.0
Re = 338.32137
Rm = 279.82137
Ri = 221.32137

delta1 = 21.801409 * np.pi / 180.0
delta2 = 68.198591 * np.pi / 180.0
sinD1, cosD1 = np.sin(delta1), np.cos(delta1)
sinD2, cosD2 = np.sin(delta2), np.cos(delta2)

alfa = 20.0 * np.pi / 180.0
beta = 30.0 * np.pi / 180.0
cos_beta = np.cos(beta)
tan_alfa_t = np.tan(alfa) / cos_beta
alfa_t = np.arctan(tan_alfa_t)
inv_alfa_t = tan_alfa_t - alfa_t

# MITCalc tooth thickness from calculation rows 227-229
x1 = 0.32
x2 = -0.32
xTau1 = 0.04
xTau2 = -0.04

# Normal module at Rm: mmn = 10.0
# Transverse module: mtm = mmn / cos_beta = 11.547 mm
sn1_m = mmn * (np.pi / 2.0 + 2.0 * x1 * np.tan(alfa_t) + xTau1)
sn2_m = mmn * (np.pi / 2.0 + 2.0 * x2 * np.tan(alfa_t) + xTau2)
print(f'At Rm: sn1={sn1_m:.3f} mm, sn2={sn2_m:.3f} mm, sum={sn1_m + sn2_m:.3f} mm')
pitch_normal = np.pi * mmn
print(f'Normal circular pitch: pi*mmn = {pitch_normal:.3f} mm')
print(f'Backlash in normal plane: {pitch_normal - (sn1_m + sn2_m):.6f} mm')

# Transverse tooth thickness:
s_t1 = sn1_m / cos_beta
s_t2 = sn2_m / cos_beta
pitch_t = np.pi * (mmn / cos_beta)
print(f'Transverse tooth thickness: st1={s_t1:.3f} mm, st2={s_t2:.3f} mm, sum={s_t1 + s_t2:.3f} mm, pitch_t={pitch_t:.3f} mm')

# Radii at Rm:
Rz1 = Rm * sinD1 # 103.923 mm
Rz2 = Rm * sinD2 # 259.808 mm
print(f'Pitch radii at Rm: Rz1={Rz1:.3f} mm, Rz2={Rz2:.3f} mm')

# Half tooth angle on gear in radians:
# Pitch cone angle development: arc = r_c * psi_c = Rz * theta => theta = psi / cosD
# On virtual spur gear:
rv1 = Rz1 / cosD1
rv2 = Rz2 / cosD2
psi_v1 = s_t1 / (2.0 * rv1)
psi_v2 = s_t2 / (2.0 * rv2)
th1_pitch = psi_v1 / cosD1
th2_pitch = psi_v2 / cosD2
print(f'Half-tooth angle on gear at pitch: th1={th1_pitch*180/np.pi:.4f} deg, th2={th2_pitch*180/np.pi:.4f} deg')

# Pinion tooth 0 center is at 0.
# Pinion tooth 0 flank is at +th1_pitch.
# World coordinate of pinion tooth 0 flank at pitch circle (Rm):
# In local pinion coords: r = Rz1, ang = +th1_pitch, z = Rm * cosD1
p_pinion_flank = np.array([Rz1 * np.cos(th1_pitch), Rz1 * np.sin(th1_pitch), Rm * cosD1])
# Map to world [z, x, y]:
P_w = np.array([p_pinion_flank[2], p_pinion_flank[0], p_pinion_flank[1]])
print(f'Pinion flank point in world: [{P_w[0]:.4f}, {P_w[1]:.4f}, {P_w[2]:.4f}]')

# Gear tooth space at Rm:
# Gear has pitch radius Rz2.
# We want Gear mating flank at world [X, Y, Z]:
# Gear local to world: [x, z, -y]
# To match P_w:
# Gear world X = P_w[0] = 259.808 mm (which is Rz2!)
# Gear world Y = P_w[1] = 103.923 mm (which is Rm * cosD2!)
# Gear world Z = P_w[2] = P_w[2]
# In Gear local coords:
# x = X = Rz2 * cos(ang2)
# y = -Z = -P_w[2] = Rz2 * sin(ang2)
# So ang2 = arctan2(-P_w[2], P_w[0])!
ang2_contact = np.arctan2(-P_w[2], P_w[0])
print(f'Gear contact angle ang2: {ang2_contact*180/np.pi:.4f} deg')

# Gear tooth flank is at ang2 = toothCenter2 - th2_pitch!
# So toothCenter2 = ang2_contact + th2_pitch!
toothCenter2 = ang2_contact + th2_pitch
print(f'Gear tooth center required for exact contact: {toothCenter2*180/np.pi:.4f} deg')
print(f'In pitch fractions: {toothCenter2 / (2.0 * np.pi / z2):.4f} pitch')
print(f'Half pitch: {np.pi / z2 * 180 / np.pi:.4f} deg')
