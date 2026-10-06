# -*- coding: utf-8 -*-
import io

new_sec17_html = '''                            <!-- 17.5: Ma Trận Lựa Chọn Thiết Kế Bánh Răng Côn Thực Tế -->
                            <div style="background: #1e293b; border-radius: 8px; padding: 1rem; border: 1px solid #334155;">
                                <h4 style="color: #38bdf8; margin-top: 0; margin-bottom: 0.5rem; font-size: 1.05rem;">
                                    🧭 17.5 Ma Trận Lựa Chọn Thiết Kế Bánh Răng Côn Thực Tế (ISO 23509 / Gleason / Klingelnberg)
                                </h4>
                                <p style="margin-bottom: 0.75rem; font-size: 0.88rem; color: #cbd5e1;">
                                    Hệ thống hóa kinh nghiệm thiết kế xưởng và quy chuẩn quốc tế cho 10 trường hợp chế tạo bánh răng côn phổ biến nhất trong thực tế công nghiệp:
                                </p>
                                <div style="overflow-x: auto; -webkit-overflow-scrolling: touch; margin-bottom: 1rem;">
                                    <table style="width: 100%; min-width: 950px; border-collapse: collapse; font-size: 0.82rem;">
                                        <thead>
                                            <tr style="background: #334155; color: #f8fafc;">
                                                <th style="padding: 6px 8px; border: 1px solid #475569; width: 4%; text-align: center;">#</th>
                                                <th style="padding: 6px 8px; border: 1px solid #475569; width: 18%;">Ứng Dụng &amp; Điều Kiện Tải</th>
                                                <th style="padding: 6px 8px; border: 1px solid #475569; width: 14%;">Kiểu Răng (Mục 3.1)</th>
                                                <th style="padding: 6px 8px; border: 1px solid #475569; width: 14%;">Dịch Chỉnh (Mục 5.1)</th>
                                                <th style="padding: 6px 8px; border: 1px solid #475569; width: 13%;">Góc &beta;<sub>m</sub> &amp; Hướng Xoắn</th>
                                                <th style="padding: 6px 8px; border: 1px solid #475569; width: 14%;">Yêu Cầu Ổ Đỡ &amp; Vỏ Hộp</th>
                                                <th style="padding: 6px 8px; border: 1px solid #475569; width: 23%;">Lưu Ý Xưởng Sống Còn</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td style="padding: 6px 8px; border: 1px solid #475569; text-align: center; font-weight: 700; color: #94a3b8;">1</td>
                                                <td style="padding: 6px 8px; border: 1px solid #475569;">
                                                    <strong>Băng tải chậm, máy nông nghiệp, tời tay</strong><br>
                                                    <span style="color: #94a3b8; font-size: 0.78rem;">v &lt; 3 m/s &bull; Tải nhẹ &bull; z<sub>1</sub> &ge; 20</span>
                                                </td>
                                                <td style="padding: 6px 8px; border: 1px solid #475569; font-weight: 600; color: #38bdf8;">1 - Bào Gleason (Thẳng I)</td>
                                                <td style="padding: 6px 8px; border: 1px solid #475569;">DIN 870 / Tiêu chuẩn<br>(x<sub>1</sub>=0, x<sub>2</sub>=0)</td>
                                                <td style="padding: 6px 8px; border: 1px solid #475569;">&beta;<sub>m</sub> = 0°<br>(Không xoắn)</td>
                                                <td style="padding: 6px 8px; border: 1px solid #475569;">Ổ bi đỡ sâu thông thường, vỏ hộp đúc đơn giản.</td>
                                                <td style="padding: 6px 8px; border: 1px solid #475569; color: #86efac;">Chi phí thấp nhất, dễ gia công đơn chiếc trên máy phay vạn năng.</td>
                                            </tr>
                                            <tr style="background: rgba(239, 68, 68, 0.08);">
                                                <td style="padding: 6px 8px; border: 1px solid #475569; text-align: center; font-weight: 700; color: #f87171;">2</td>
                                                <td style="padding: 6px 8px; border: 1px solid #475569;">
                                                    <strong>Bánh răng thẳng tỷ số lớn, bánh nhỏ ít răng</strong><br>
                                                    <span style="color: #fca5a5; font-size: 0.78rem;">v &lt; 5 m/s &bull; z<sub>1</sub> = 12 &divide; 17 (Dễ cắt lẹm)</span>
                                                </td>
                                                <td style="padding: 6px 8px; border: 1px solid #475569; font-weight: 600; color: #38bdf8;">1 - Bào Gleason (Thẳng I)</td>
                                                <td style="padding: 6px 8px; border: 1px solid #475569; font-weight: 700; color: #f87171;">Dịch chỉnh uốn VN<br>(x<sub>1</sub> = +0.3 &divide; +0.6)</td>
                                                <td style="padding: 6px 8px; border: 1px solid #475569;">&beta;<sub>m</sub> = 0°</td>
                                                <td style="padding: 6px 8px; border: 1px solid #475569;">Ổ bi đỡ chặn hoặc đũa côn chịu tải hướng tâm lớn.</td>
                                                <td style="padding: 6px 8px; border: 1px solid #475569; color: #fca5a5;"><strong>Bắt buộc x<sub>1</sub> &gt; 0</strong> để triệt tiêu cắt lẹm chân răng z<sub>1</sub>, tăng bền uốn 30-40%.</td>
                                            </tr>
                                            <tr style="background: rgba(56, 189, 248, 0.08);">
                                                <td style="padding: 6px 8px; border: 1px solid #475569; text-align: center; font-weight: 700; color: #38bdf8;">3</td>
                                                <td style="padding: 6px 8px; border: 1px solid #475569;">
                                                    <strong>Nâng cấp hộp số cũ ồn/rung (thay thế trực tiếp)</strong><br>
                                                    <span style="color: #7dd3fc; font-size: 0.78rem;">v = 4 &divide; 10 m/s &bull; Cần êm &bull; Giữ vỏ hộp cũ</span>
                                                </td>
                                                <td style="padding: 6px 8px; border: 1px solid #475569; font-weight: 700; color: #38bdf8;">3 - Cung tròn Zerol (II)</td>
                                                <td style="padding: 6px 8px; border: 1px solid #475569;">Curved teeth<br>hoặc Dịch chỉnh uốn VN</td>
                                                <td style="padding: 6px 8px; border: 1px solid #475569; font-weight: 700; color: #38bdf8;">&beta;<sub>m</sub> = 0°<br>(Lực dọc F<sub>a</sub> &approx; 0)</td>
                                                <td style="padding: 6px 8px; border: 1px solid #475569; color: #34d399;"><strong>Giữ nguyên ổ đỡ cũ</strong> của răng thẳng (không phải làm lại vỏ).</td>
                                                <td style="padding: 6px 8px; border: 1px solid #475569; color: #7dd3fc;">Êm hơn răng thẳng 6–8 dB nhưng không sinh lực dọc trục lớn, thay thế thẳng vào vỏ cũ.</td>
                                            </tr>
                                            <tr style="background: rgba(16, 185, 129, 0.08);">
                                                <td style="padding: 6px 8px; border: 1px solid #475569; text-align: center; font-weight: 700; color: #34d399;">4 ⭐</td>
                                                <td style="padding: 6px 8px; border: 1px solid #475569;">
                                                    <strong>Hộp giảm tốc công nghiệp tải nặng 1 chiều</strong><br>
                                                    <span style="color: #86efac; font-size: 0.78rem;">Máy cán, nghiền, xi măng &bull; v = 6 &divide; 18 m/s</span>
                                                </td>
                                                <td style="padding: 6px 8px; border: 1px solid #475569; font-weight: 700; color: #34d399;">2 - Cung tròn Gleason (Xoắn II)</td>
                                                <td style="padding: 6px 8px; border: 1px solid #475569;">Curved teeth (Gleason)<br>Chiều cao thuôn (Tapered)</td>
                                                <td style="padding: 6px 8px; border: 1px solid #475569;">&beta;<sub>m</sub> = 35°<br>CW: chọn LH (Trái)<br>CCW: chọn RH (Phải)</td>
                                                <td style="padding: 6px 8px; border: 1px solid #475569;">Ổ đũa côn kép (chữ X hoặc O), gối đỡ cứng vững cao.</td>
                                                <td style="padding: 6px 8px; border: 1px solid #475569; color: #86efac;"><strong>Quy tắc khử lực dọc</strong>: Hướng xoắn phải sinh lực đẩy bánh ra xa Apex để chống kẹt khi nóng.</td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 6px 8px; border: 1px solid #475569; text-align: center; font-weight: 700; color: #fbbf24;">5</td>
                                                <td style="padding: 6px 8px; border: 1px solid #475569;">
                                                    <strong>Hộp số đảo chiều liên tục (Reversible drives)</strong><br>
                                                    <span style="color: #fde68a; font-size: 0.78rem;">Tời tàu thủy, tời neo, hộp số tiến/lùi ca-nô</span>
                                                </td>
                                                <td style="padding: 6px 8px; border: 1px solid #475569; font-weight: 600; color: #fbbf24;">2 - Cung tròn Gleason (II)</td>
                                                <td style="padding: 6px 8px; border: 1px solid #475569;">Dịch chỉnh tiếp xúc VN<br>hoặc ISO 23509</td>
                                                <td style="padding: 6px 8px; border: 1px solid #475569;">&beta;<sub>m</sub> = 25° &divide; 30°<br>(Hạn chế lực dọc)</td>
                                                <td style="padding: 6px 8px; border: 1px solid #475569;">Ổ đỡ chặn 2 chiều cố định chặt chẽ, vỏ hộp gân đối xứng.</td>
                                                <td style="padding: 6px 8px; border: 1px solid #475569; color: #fde68a;">Lực dọc trục đảo chiều 180° khi đổi chiều quay. Phải kiểm tra bền uốn cả sườn lồi và sườn lõm.</td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 6px 8px; border: 1px solid #475569; text-align: center; font-weight: 700; color: #c084fc;">6</td>
                                                <td style="padding: 6px 8px; border: 1px solid #475569;">
                                                    <strong>Cầu sau xe tải, xe buýt, xe khách (Vi sai)</strong><br>
                                                    <span style="color: #e9d5ff; font-size: 0.78rem;">Tải cực nặng, chạy liên tục, sản xuất loạt lớn</span>
                                                </td>
                                                <td style="padding: 6px 8px; border: 1px solid #475569; font-weight: 600; color: #c084fc;">4 - Epicycloid (Klingelnberg III)</td>
                                                <td style="padding: 6px 8px; border: 1px solid #475569;">Hệ Klingelnberg<br>Răng song song (h = const)</td>
                                                <td style="padding: 6px 8px; border: 1px solid #475569;">&beta;<sub>m</sub> = 30° &divide; 38°<br>Theo bước dao xoắn</td>
                                                <td style="padding: 6px 8px; border: 1px solid #475569;">Ổ đũa côn chịu tải cực cao, vỏ cầu gang dẻo có đai siết.</td>
                                                <td style="padding: 6px 8px; border: 1px solid #475569; color: #e9d5ff;"><strong>Cặp bất di bất dịch (Matched Set)</strong>: Hai bánh rà cát (Lapping) chung cặp, hỏng phải thay cả bộ.</td>
                                            </tr>
                                            <tr style="background: rgba(244, 63, 94, 0.08);">
                                                <td style="padding: 6px 8px; border: 1px solid #475569; text-align: center; font-weight: 700; color: #fb7185;">7</td>
                                                <td style="padding: 6px 8px; border: 1px solid #475569;">
                                                    <strong>Cầu xe du lịch, xe tải nhẹ (Sàn xe phẳng)</strong><br>
                                                    <span style="color: #fecdd3; font-size: 0.78rem;">Trục lệch tâm E &ne; 0 &bull; v &gt; 20 m/s &bull; Rất êm</span>
                                                </td>
                                                <td style="padding: 6px 8px; border: 1px solid #475569; font-weight: 700; color: #fb7185;">Truyền động HYPOID<br>(Trục chéo nhau)</td>
                                                <td style="padding: 6px 8px; border: 1px solid #475569;">Hệ Hypoid riêng biệt<br>(Bánh 1 phình to)</td>
                                                <td style="padding: 6px 8px; border: 1px solid #475569;">&beta;<sub>1</sub> &approx; 45°&divide;50° (Pinion)<br>&beta;<sub>2</sub> &approx; 20° (Gear)</td>
                                                <td style="padding: 6px 8px; border: 1px solid #475569;">Ổ đỡ chặn chịu tải dọc cực đại, gối đỡ công-xôn cứng.</td>
                                                <td style="padding: 6px 8px; border: 1px solid #475569; color: #fecdd3;"><strong>Bắt buộc dùng dầu bôi trơn Hypoid cực áp (GL-5)</strong> do độ trượt dọc sườn răng rất lớn.</td>
                                            </tr>
                                            <tr style="background: rgba(14, 165, 233, 0.08);">
                                                <td style="padding: 6px 8px; border: 1px solid #475569; text-align: center; font-weight: 700; color: #38bdf8;">8</td>
                                                <td style="padding: 6px 8px; border: 1px solid #475569;">
                                                    <strong>Bàn xoay CNC, tay máy Robot, Radar</strong><br>
                                                    <span style="color: #bae6fd; font-size: 0.78rem;">Độ chính xác cao &bull; Khe hở cực nhỏ Zero-Backlash</span>
                                                </td>
                                                <td style="padding: 6px 8px; border: 1px solid #475569; font-weight: 600; color: #38bdf8;">2 - Cung tròn Gleason (II)</td>
                                                <td style="padding: 6px 8px; border: 1px solid #475569;">Dịch chỉnh uốn VN<br>Cắt răng vồng (Crowning)</td>
                                                <td style="padding: 6px 8px; border: 1px solid #475569;">&beta;<sub>m</sub> = 35°</td>
                                                <td style="padding: 6px 8px; border: 1px solid #475569;"><strong>Trục có cơ cấu căn đệm dọc (Shims)</strong> hoặc đai vi chỉnh.</td>
                                                <td style="padding: 6px 8px; border: 1px solid #475569; color: #bae6fd;"><strong>Chỉnh rơ bằng căn dọc trục</strong>: Nới/chêm căn &Delta;Z là triệt tiêu hoàn toàn khe hở mà không cần tiện lại.</td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 6px 8px; border: 1px solid #475569; text-align: center; font-weight: 700; color: #e2e8f0;">9</td>
                                                <td style="padding: 6px 8px; border: 1px solid #475569;">
                                                    <strong>Hàng không, trực thăng, tuabin tàu cao tốc</strong><br>
                                                    <span style="color: #cbd5e1; font-size: 0.78rem;">v = 25 &divide; 50 m/s &bull; Siêu nhẹ &bull; An toàn tuyệt đối</span>
                                                </td>
                                                <td style="padding: 6px 8px; border: 1px solid #475569; font-weight: 600; color: #38bdf8;">2 - Cung tròn Gleason (II)</td>
                                                <td style="padding: 6px 8px; border: 1px solid #475569;">Hệ Gleason tối ưu hóa<br>Vát mép &amp; Bo tròn mép</td>
                                                <td style="padding: 6px 8px; border: 1px solid #475569;">&beta;<sub>m</sub> = 35°</td>
                                                <td style="padding: 6px 8px; border: 1px solid #475569;">Vỏ Titan/Magie, ổ lăn hàng không cấp ABEC 7/9.</td>
                                                <td style="padding: 6px 8px; border: 1px solid #475569; color: #cbd5e1;">Thép hợp kim 9310 &bull; Mài CNC &bull; <strong>Bắn bi nén (Shot Peening)</strong> triệt tiêu ứng suất dư ở chân răng.</td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 6px 8px; border: 1px solid #475569; text-align: center; font-weight: 700; color: #a1a1aa;">10</td>
                                                <td style="padding: 6px 8px; border: 1px solid #475569;">
                                                    <strong>Tay quay góc vuông, phụ kiện đồ gá, máy thô</strong><br>
                                                    <span style="color: #a1a1aa; font-size: 0.78rem;">Tỉ số truyền i = 1:1 (Miter Gears) &bull; &delta; = 45°</span>
                                                </td>
                                                <td style="padding: 6px 8px; border: 1px solid #475569; font-weight: 600; color: #38bdf8;">1 - Bào Gleason (Thẳng I)</td>
                                                <td style="padding: 6px 8px; border: 1px solid #475569;">Tiêu chuẩn đối xứng<br>(x<sub>1</sub>=0, x<sub>2</sub>=0)</td>
                                                <td style="padding: 6px 8px; border: 1px solid #475569;">&beta;<sub>m</sub> = 0°</td>
                                                <td style="padding: 6px 8px; border: 1px solid #475569;">Hai gối trục đối xứng hoàn toàn, ổ bi tương đương.</td>
                                                <td style="padding: 6px 8px; border: 1px solid #475569; color: #a1a1aa;">Hai bánh giống hệt nhau 100%, có thể gia công cùng một mẻ phôi và lắp lẫn tự do.</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <!-- 4 Nguyên Tắc Bất Biến Khi Thiết Kế Xưởng -->
                                <div style="background: #0f172a; border-radius: 6px; padding: 0.85rem; border-left: 3px solid #f59e0b;">
                                    <div style="font-weight: 700; color: #fbbf24; margin-bottom: 0.4rem;">
                                        ⚡ 4 NGUYÊN TẮC BẤT BIẾN KHI LỰA CHỌN THIẾT KẾ XƯỞNG:
                                    </div>
                                    <ol style="margin: 0 0 0 1.25rem; padding: 0; font-size: 0.83rem; color: #cbd5e1; line-height: 1.5;">
                                        <li><strong>Nguyên tắc số răng nhỏ:</strong> Khi <code>z<sub>1</sub> &le; 17</code>, <strong>bắt buộc phải có dịch chỉnh dương x<sub>1</sub> &gt; 0</strong> (chọn <em>VN Bending</em> trong Mục 5.1). Tuyệt đối không để x<sub>1</sub> = 0 vì chân răng sẽ bị cắt lẹm, rất dễ gãy ngầm khi khởi động có tải.</li>
                                        <li><strong>Nguyên tắc hướng xoắn theo chiều quay chính:</strong> Bánh dẫn quay Thuận (CW) &rArr; Chọn Xoắn Trái (LH); Bánh dẫn quay Nghịch (CCW) &rArr; Chọn Xoắn Phải (RH). Đảm bảo lực dọc trục luôn đẩy bánh răng <strong>ra xa đỉnh Apex</strong>, chống kẹt răng do giãn nở nhiệt.</li>
                                        <li><strong>Nguyên tắc tỷ lệ vành răng b/R<sub>e</sub>:</strong> Luôn khống chế <code>b &le; min(0.35 &middot; R<sub>e</sub>, 10 &middot; m<sub>mn</sub>)</code>. Vành răng quá dài sẽ làm đầu nhỏ trong (R<sub>i</sub>) quá mỏng, rất dễ sứt mép răng khi trục uốn võng.</li>
                                        <li><strong>Nguyên tắc lắp lẫn:</strong> Bánh răng mài CNC (Grinding) thì thay rời từng bánh được; còn bánh răng rà cát (Lapping) thì <strong>bắt buộc phải thay cả cặp (Matched Set)</strong>.</li>
                                    </ol>
                                </div>
                            </div>'''

with open('modules/bevel-gear/index.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Locate section 17.5 block
start_str = '                            <!-- 17.5: Bánh Răng Trụ Tương Đương Tredgold (Mục 7.0) -->'
end_str = '                        </div>\n                    </div>\n                </div>\n\n            </div>\n        </div>\n\n        <!-- TAB 2: 2D CANVAS'

pos_start = text.find(start_str)
pos_end = text.find(end_str)

if pos_start == -1 or pos_end == -1:
    print(f"Error locating boundaries: pos_start={pos_start}, pos_end={pos_end}")
    exit(1)

# Replace between pos_start and pos_end (preserving pos_end)
updated_text = text[:pos_start] + new_sec17_html + '\n\n' + text[pos_end:]

with open('modules/bevel-gear/index.html', 'w', encoding='utf-8') as f:
    f.write(updated_text)

print("Successfully replaced Section 17.5 in modules/bevel-gear/index.html!")
