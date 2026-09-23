import numpy as np

z1 = 18
z2 = 45
i = z2 / z1 # 2.5
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

R_tool = 1.5 * b # 175.5 mm
ForceSign = -1 # Left-Hand Pinion

def rotX(a):
    c, s = np.cos(a), np.sin(a)
    return np.array([[1,0,0],[0,c,-s],[0,s,c]])
def rotY(a):
    c, s = np.cos(a), np.sin(a)
    return np.array([[c,0,s],[0,1,0],[-s,0,c]])

# Analytical base transforms:
# Pinion local [x, y, z] -> [z, x, y]
Mp_base = np.array([[0,0,1],[1,0,0],[0,1,0]])
# Gear local [x, y, z] -> [x, z, -y]
Mg_base = np.array([[1,0,0],[0,0,1],[0,-1,0]])

# Test across 11 slices from Toe to Heel at pinionAngle = 0
print('Slice | Rs | u | Pinion Flank World | Gear Flank World | Distance (mm)')
for s in range(11):
    frac = s / 10.0
    Rs = Re - frac * (Re - Ri) # s=0 is Heel, s=10 is Toe
    u = (Rs - Rm) / b
    
    # MITCalc dL formula:
    term = u * b + R_tool * np.sin(beta)
    dL = ForceSign * (R_tool * np.cos(beta) - np.sqrt(np.max([0.0, R_tool**2 - term**2])))
    
    # Module & tooth thickness at section Rs:
    scale_s = Rs / Re
    mn_s = mmn * (Rs / Rm)
    sn1_s = mn_s * (np.pi / 2.0 + 2.0 * 0.32 * np.tan(alfa_t) + 0.04)
    sn2_s = mn_s * (np.pi / 2.0 - 2.0 * 0.32 * np.tan(alfa_t) - 0.04)
    
    st1_s = sn1_s / cos_beta
    st2_s = sn2_s / cos_beta
    
    Rz1_s = Rs * sinD1
    Rz2_s = Rs * sinD2
    
    # Flank angle on Pinion pitch circle:
    spiral1 = dL / Rz1_s
    th_half1 = st1_s / (2.0 * Rz1_s)
    phi1 = spiral1 + th_half1
    
    # Pinion local point at pitch: r = Rz1_s, z = Rs * cosD1
    p_local_pinion = np.array([Rz1_s * np.cos(phi1), Rz1_s * np.sin(phi1), Rs * cosD1])
    Pw = Mp_base @ p_local_pinion
    
    # Flank angle on Gear pitch circle:
    # Space center is at -pi/z2
    # Spiral angle is -dL / Rz2_s
    # Half tooth thickness is st2_s / (2 * Rz2_s)
    spiral2 = -dL / Rz2_s
    th_half2 = st2_s / (2.0 * Rz2_s)
    phi2 = -np.pi / z2 + spiral2 + th_half2
    
    g_local_gear = np.array([Rz2_s * np.cos(phi2), Rz2_s * np.sin(phi2), Rs * cosD2])
    Gw = Mg_base @ g_local_gear
    
    dist = np.linalg.norm(Pw - Gw)
    print(f'{s:2d} | {Rs:5.1f} | {u:+5.2f} | [{Pw[0]:6.2f}, {Pw[1]:6.2f}, {Pw[2]:6.2f}] | [{Gw[0]:6.2f}, {Gw[1]:6.2f}, {Gw[2]:6.2f}] | {dist:.6f} mm')
