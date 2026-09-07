/**
 * pickoPlatform.js
 * Business logic controller for Picko 247 Sports & Play Hub.
 * Manages Tournaments (Tour), Leaderboards (Score), Admin Panel, and Game Synchronization.
 */

class PickoPlatform {
    constructor() {
        // Initial Tournaments Mock Database
        this.tournaments = [
            {
                id: 'T01',
                name: 'Giải Pickleball Vô Địch Quốc Gia Picko 2026',
                status: 'live', // 'live', 'upcoming', 'finished'
                category: 'Đôi Nam - Nữ (Open 4.5+)',
                prize: '100.000.000 VNĐ',
                date: '15/08/2026 08:00 - 18/08/2026 18:00',
                startTime: '2026-08-15T08:00',
                endTime: '2026-08-18T18:00',
                location: 'Picko 247 Central Hub, Hà Nội',
                teamsCount: 16,
                banner: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80',
                podium: {
                    gold: 'Lý Hoàng Nam & Nguyễn Thùy Linh',
                    silver: 'Trần Văn An & Lê Thị Bình',
                    bronze: 'Phạm Quốc Cường & Vũ Thị Dung'
                },
                matches: [
                    { round: 'Tứ Kết 1', p1: 'Lý Hoàng Nam / Thùy Linh', p2: 'Phạm Cường / Vũ Dung', score: '11 - 7, 11 - 5', winner: 1 },
                    { round: 'Tứ Kết 2', p1: 'Trần An / Lê Bình', p2: 'Đỗ Hùng / Mai Anh', score: '11 - 9, 8 - 11, 11 - 6', winner: 1 },
                    { round: 'Bán Kết', p1: 'Lý Hoàng Nam / Thùy Linh', p2: 'Trần An / Lê Bình', score: '11 - 8, 11 - 4', winner: 1 },
                    { round: 'Chung Kết', p1: 'Lý Hoàng Nam / Thùy Linh', p2: 'Vũ Hải / Đặng Yến', score: '11 - 6, 11 - 7', winner: 1 }
                ]
            },
            {
                id: 'T02',
                name: 'Picko Open Premier Cup 2026',
                status: 'upcoming',
                category: 'Đơn Nam Trình 4.0',
                prize: '50.000.000 VNĐ',
                date: '01/09/2026 08:00 - 03/09/2026 17:30',
                startTime: '2026-09-01T08:00',
                endTime: '2026-09-03T17:30',
                location: 'Picko Sport Complex, TP.HCM',
                teamsCount: 32,
                banner: 'https://images.unsplash.com/photo-1599586120429-48281b6f0eca?auto=format&fit=crop&w=800&q=80',
                podium: null,
                matches: []
            },
            {
                id: 'T03',
                name: 'Giải Pickleball Doanh Nhân Poly Cup',
                status: 'finished',
                category: 'Đôi Phong Trào',
                prize: '30.000.000 VNĐ',
                date: '10/07/2026 08:00 - 12/07/2026 17:00',
                startTime: '2026-07-10T08:00',
                endTime: '2026-07-12T17:00',
                location: 'Sân Pickleball Poly Technic',
                teamsCount: 24,
                banner: 'https://images.unsplash.com/photo-1534158914592-062992fbe900?auto=format&fit=crop&w=800&q=80',
                podium: {
                    gold: 'Nguyễn Thành Nam & Trịnh Văn B',
                    silver: 'Hoàng Văn C & Ngô Thị D',
                    bronze: 'Vũ Đức E & Lê Văn F'
                },
                matches: []
            }
        ];

        // Initial Ongoing Live Matches Database for Admin Live Management
        this.liveMatches = [
            {
                id: 'LM01',
                tourName: 'Giải Pickleball Vô Địch Quốc Gia Picko 2026',
                round: 'Chung Kết Đôi Nam-Nữ',
                court: 'Sân Trung Tâm (Court 1)',
                p1: 'Lý Hoàng Nam / Nguyễn Thùy Linh',
                p2: 'Phạm Quốc Cường / Vũ Thị Dung',
                score: '11 - 9, 8 - 11, 6 - 4',
                status: 'live', // 'live', 'paused', 'finished'
                startTime: '2026-08-15T10:30',
                endTime: '2026-08-15T12:00'
            },
            {
                id: 'LM02',
                tourName: 'Giải Pickleball Vô Địch Quốc Gia Picko 2026',
                round: 'Bán Kết Đơn Nam',
                court: 'Sân Số 2 (Court 2)',
                p1: 'Trần Văn An',
                p2: 'Lê Hoàng Yến',
                score: '11 - 7, 9 - 11, 2 - 1',
                status: 'live',
                startTime: '2026-08-15T11:00',
                endTime: '2026-08-15T12:30'
            }
        ];

        // Initial VĐV Leaderboard Mock Database (Đầy đủ Bio, Thành Tích & Lịch Sử Biến Động Điểm)
        this.players = [
            { 
                id: 'P01', 
                name: 'Lý Hoàng Nam', 
                gender: 'Nam', 
                dupr: 5.24, 
                winRate: '88%', 
                matches: 45, 
                lastDelta: '+0.25', 
                gameScore: 1250, 
                avatar: '🏓',
                bio: 'VĐV Chuyên nghiệp Pickleball Quốc Gia — Hạng 1 Picko 247 Hub. Kiểu đánh: Tấn công uy lực.',
                achievements: ['🥇 Vô Địch Picko Open Cup 2026', '🥇 Huy Chương Vàng Đôi Nam Poly Championship', '🏆 VĐV Xuất Sắc Nhất Năm 2025'],
                history: [
                    { date: '15/08/2026', event: 'Giải Pickleball Vô Địch Quốc Gia Picko 2026', delta: '+0.25', newDupr: 5.24 },
                    { date: '01/07/2026', event: 'Picko Open Summer Cup 2026', delta: '+0.15', newDupr: 4.99 },
                    { date: '10/05/2026', event: 'Giải Doanh Nhân Poly Cup', delta: '+0.10', newDupr: 4.84 }
                ]
            },
            { 
                id: 'P02', 
                name: 'Nguyễn Thùy Linh', 
                gender: 'Nữ', 
                dupr: 5.10, 
                winRate: '84%', 
                matches: 38, 
                lastDelta: '+0.18', 
                gameScore: 980, 
                avatar: '⭐',
                bio: 'Top 1 VĐV Nữ Picko 247 Score. Sở trường dink bóng khéo léo và phản công tốc độ cao.',
                achievements: ['🥇 Vô Địch Đôi Nam-Nữ Picko 2026', '🥈 Á Quân Đơn Nữ Poly Premier Cup'],
                history: [
                    { date: '15/08/2026', event: 'Giải Pickleball Vô Địch Quốc Gia Picko 2026', delta: '+0.18', newDupr: 5.10 },
                    { date: '12/06/2026', event: 'Giao Hữu Đội Tuyển Nữ Picko', delta: '+0.12', newDupr: 4.92 }
                ]
            },
            { 
                id: 'P03', 
                name: 'Trần Văn An', 
                gender: 'Nam', 
                dupr: 4.85, 
                winRate: '79%', 
                matches: 52, 
                lastDelta: '+0.12', 
                gameScore: 840, 
                avatar: '🔥',
                bio: 'VĐV Kỳ Cựu CLB Picko Hà Nội. Đạt chuẩn DUPR 4.85 với lối chơi phòng thủ bền bỉ.',
                achievements: ['🥈 Á Quân Picko Open Cup 2026', '🥉 Huy Chương Đồng Đôi Nam Poly Cup'],
                history: [
                    { date: '15/08/2026', event: 'Giải Pickleball Vô Địch Quốc Gia Picko 2026', delta: '+0.12', newDupr: 4.85 },
                    { date: '20/05/2026', event: 'Giải Mở Rộng Mùa Xuân Picko', delta: '-0.05', newDupr: 4.73 }
                ]
            },
            { 
                id: 'P04', 
                name: 'Lê Thị Bình', 
                gender: 'Nữ', 
                dupr: 4.72, 
                winRate: '75%', 
                matches: 41, 
                lastDelta: '-0.05', 
                gameScore: 720, 
                avatar: '⚡',
                bio: 'VĐV Tiềm Năng Hạng 4.5+. Tay vợt kiểm soát khu vực Kitchen cực kì nhạy bén.',
                achievements: ['🥈 Á Quân Đôi Nam-Nữ Picko 2026'],
                history: [
                    { date: '15/08/2026', event: 'Giải Pickleball Vô Địch Quốc Gia Picko 2026', delta: '-0.05', newDupr: 4.72 },
                    { date: '05/04/2026', event: 'Picko Challenge Series #1', delta: '+0.20', newDupr: 4.77 }
                ]
            },
            { 
                id: 'P05', 
                name: 'Phạm Quốc Cường', 
                gender: 'Nam', 
                dupr: 4.60, 
                winRate: '71%', 
                matches: 30, 
                lastDelta: '+0.08', 
                gameScore: 610, 
                avatar: '🏆',
                bio: 'Đội Trưởng CLB Picko Saigon. Đam mê giao lưu và huấn luyện VĐV trẻ.',
                achievements: ['🥉 Huy Chương Đồng Picko Open Cup 2026'],
                history: [
                    { date: '15/08/2026', event: 'Giải Pickleball Vô Địch Quốc Gia Picko 2026', delta: '+0.08', newDupr: 4.60 }
                ]
            },
            { 
                id: 'P06', 
                name: 'Vũ Thị Dung', 
                gender: 'Nữ', 
                dupr: 4.45, 
                winRate: '68%', 
                matches: 28, 
                lastDelta: '-0.10', 
                gameScore: 530, 
                avatar: '👑',
                bio: 'VĐV Phong Trào Trình 4.5. Kiểu đánh phản công nhanh.',
                achievements: ['🥉 Huy Chương Đồng Đôi Nữ Poly Cup'],
                history: [
                    { date: '15/08/2026', event: 'Giải Pickleball Vô Địch Quốc Gia Picko 2026', delta: '-0.10', newDupr: 4.45 }
                ]
            }
        ];

        // Account Database (Tên ID & Mã PIN 6 chữ số)
        this.accounts = [
            { id: 'ADMIN247', name: 'Nguyễn Văn Hùng (Tổng Trưởng)', pin: '666888', role: 'Quản Trị Viên', status: 'Hoạt động', score: 1250 },
            { id: 'ADMIN_POLY', name: 'Lê Hoàng Yến (Admin Giải)', pin: '123456', role: 'Quản Trị Viên', status: 'Hoạt động', score: 980 },
            { id: 'PK-VDEV-001', name: 'Lý Hoàng Nam', pin: '888999', role: 'Vận Động Viên', status: 'Hoạt động', score: 1250 },
            { id: 'PK-VDEV-002', name: 'Nguyễn Thùy Linh', pin: '654321', role: 'Vận Động Viên', status: 'Hoạt động', score: 980 },
            { id: 'PK-VDEV-003', name: 'Trần Văn An', pin: '112233', role: 'Vận Động Viên', status: 'Hoạt động', score: 840 },
            { id: 'USER_HAIPHONG', name: 'Phạm Quốc Cường', pin: '998877', role: 'Hội Viên Premier', status: 'Tạm khóa', score: 610 }
        ];
        this.showPinState = false;
        this.currentAdminId = 'ADMIN247';

        this.currentLiveGameScore = 0;
        this.isAdminLoggedIn = false;

        this.initDOM();
    }

    initDOM() {
        this.renderTournaments('all');
        this.renderLeaderboard();
        this.renderAccountList();
        this.renderLiveMatches();
        this.setupTabSwitching();
        this.setupAdminEvents();
        
        // Click outside modal card to close modal
        document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
            backdrop.addEventListener('click', (e) => {
                if (e.target === backdrop) {
                    backdrop.classList.remove('active');
                }
            });
        });
    }

    setupTabSwitching() {
        const navLinks = document.querySelectorAll('.nav-tab-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetTab = link.getAttribute('data-tab');

                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');

                document.querySelectorAll('.tab-page-content').forEach(sec => {
                    sec.classList.add('hidden-tab');
                });

                const activeSec = document.getElementById(`tab-${targetTab}`);
                if (activeSec) {
                    activeSec.classList.remove('hidden-tab');
                }

                // If Game tab clicked, make sure engine updates canvas size
                if (targetTab === 'game' && window.engine) {
                    window.engine.showOverlay('start-overlay');
                }
            });
        });

        // Filter Tournaments Status Buttons
        const tourFilters = document.querySelectorAll('.tour-filter-btn');
        tourFilters.forEach(btn => {
            btn.addEventListener('click', () => {
                tourFilters.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const status = btn.getAttribute('data-status');
                this.renderTournaments(status);
            });
        });

        // Filter Leaderboard Gender
        const genderFilter = document.getElementById('gender-filter');
        if (genderFilter) {
            genderFilter.addEventListener('change', () => this.renderLeaderboard());
        }

        const searchInput = document.getElementById('player-search-input');
        if (searchInput) {
            searchInput.addEventListener('input', () => this.renderLeaderboard());
        }
    }

    renderTournaments(filterStatus = 'all') {
        const container = document.getElementById('tournaments-grid');
        if (!container) return;

        container.innerHTML = '';
        const filtered = this.tournaments.filter(t => filterStatus === 'all' || t.status === filterStatus);

        filtered.forEach(t => {
            const badgeClass = t.status === 'live' ? 'status-live' : (t.status === 'upcoming' ? 'status-upcoming' : 'status-finished');
            const badgeText = t.status === 'live' ? '🔴 ĐANG THI ĐẤU' : (t.status === 'upcoming' ? '📅 SẮP DIỄN RA' : '🏆 ĐÃ KẾT THÚC');

            let timeRangeDisplay = t.date;
            if (t.startTime && t.endTime) {
                const sDate = new Date(t.startTime);
                const eDate = new Date(t.endTime);
                const sStr = !isNaN(sDate) ? `${String(sDate.getDate()).padStart(2,'0')}/${String(sDate.getMonth()+1).padStart(2,'0')}/${sDate.getFullYear()} ${String(sDate.getHours()).padStart(2,'0')}:${String(sDate.getMinutes()).padStart(2,'0')}` : t.startTime;
                const eStr = !isNaN(eDate) ? `${String(eDate.getDate()).padStart(2,'0')}/${String(eDate.getMonth()+1).padStart(2,'0')}/${eDate.getFullYear()} ${String(eDate.getHours()).padStart(2,'0')}:${String(eDate.getMinutes()).padStart(2,'0')}` : t.endTime;
                timeRangeDisplay = `${sStr} ➔ ${eStr}`;
            }

            const card = document.createElement('div');
            card.className = 'tour-card';
            card.innerHTML = `
                <div class="tour-banner" style="background-image: url('${t.banner}')">
                    <span class="tour-status-badge ${badgeClass}">${badgeText}</span>
                </div>
                <div class="tour-body">
                    <h3 class="tour-title">${t.name}</h3>
                    <div class="tour-info-row"><i class="fas fa-tag"></i> <span>Category: ${t.category}</span></div>
                    <div class="tour-info-row"><i class="fas fa-trophy" style="color: var(--accent)"></i> <span>Thưởng: <strong>${t.prize}</strong></span></div>
                    <div class="tour-info-row"><i class="fas fa-clock" style="color: var(--secondary)"></i> <span>Thời gian: <strong style="color: #fff;">${timeRangeDisplay}</strong></span></div>
                    <div class="tour-info-row"><i class="fas fa-map-marker-alt"></i> <span>Địa điểm: ${t.location}</span></div>
                    
                    ${t.podium ? `
                    <div class="podium-mini-box">
                        <div class="podium-item gold">🥇 1st: ${t.podium.gold}</div>
                        <div class="podium-item silver">🥈 2nd: ${t.podium.silver}</div>
                        <div class="podium-item bronze">🥉 3rd: ${t.podium.bronze}</div>
                    </div>` : ''}

                    <div style="margin-top: 1rem; display: flex; gap: 0.5rem;">
                        <button class="btn-primary view-bracket-btn" data-id="${t.id}" style="width: 100%; text-align: center; justify-content: center;">
                            <i class="fas fa-sitemap"></i> XEM SƠ ĐỒ NHÁNH ĐẤU
                        </button>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });

        // Add event listener to Bracket Buttons
        document.querySelectorAll('.view-bracket-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                this.openBracketModal(id);
            });
        });
    }

    getAvailableMembers() {
        const memberList = [];
        const addedNames = new Set();

        // 1. Collect from VĐV Leaderboard (players)
        if (this.players && this.players.length > 0) {
            this.players.forEach(p => {
                if (!addedNames.has(p.name)) {
                    addedNames.add(p.name);
                    memberList.push({ id: p.id, name: p.name, role: 'VĐV Official', dupr: p.dupr });
                }
            });
        }

        // 2. Collect from System Account Database (accounts)
        if (this.accounts && this.accounts.length > 0) {
            this.accounts.forEach(a => {
                if (!addedNames.has(a.name)) {
                    addedNames.add(a.name);
                    memberList.push({ id: a.id, name: a.name, role: a.role, dupr: null });
                }
            });
        }

        return memberList;
    }

    openBracketModal(tourId) {
        const tour = this.tournaments.find(t => t.id === tourId);
        if (!tour) return;

        const modal = document.getElementById('bracket-modal');
        const titleEl = document.getElementById('bracket-modal-title');
        const bodyEl = document.getElementById('bracket-modal-body');

        if (titleEl) titleEl.innerText = `SƠ ĐỒ NHÁNH ĐẤU — ${tour.name}`;

        let html = '';
        if (this.isAdminLoggedIn) {
            html += `
                <div style="background: rgba(16,185,129,0.12); border: 1px solid var(--primary); padding: 0.75rem 1rem; border-radius: var(--radius-md); margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
                    <div style="font-size: 0.85rem; color: var(--gold-primary);">
                        <i class="fas fa-users-cog"></i> <strong>QUẢN LÝ NHÁNH ĐẤU ADMIN:</strong> Bấm <strong>"👤 +Chọn VĐV"</strong> để chọn tài khoản/VĐV có sẵn trong hệ thống xếp vào nhánh.
                    </div>
                    <button class="btn-primary add-bracket-match-btn" data-tour="${tour.id}" style="padding: 0.35rem 0.8rem; font-size: 0.78rem;">
                        <i class="fas fa-plus-circle"></i> + Thêm Trận Đấu Mới
                    </button>
                </div>
            `;
        }

        html += `<div class="bracket-tree">`;
        if (tour.matches && tour.matches.length > 0) {
            tour.matches.forEach((m, matchIdx) => {
                const isP1Set = m.p1 && m.p1 !== 'Chưa chọn VĐV' && m.p1 !== 'VĐV A / VĐV B';
                const isP2Set = m.p2 && m.p2 !== 'Chưa chọn VĐV' && m.p2 !== 'VĐV C / VĐV D';

                html += `
                    <div class="bracket-match-card">
                        <div class="match-round-tag">${m.round}</div>
                        <div class="match-team ${m.winner === 1 ? 'winner' : ''}">
                            <span>${m.p1}</span>
                        </div>
                        <div class="match-score-badge">${m.score}</div>
                        <div class="match-team ${m.winner === 2 ? 'winner' : ''}">
                            <span>${m.p2}</span>
                        </div>
                        ${this.isAdminLoggedIn ? `
                            <div style="margin-top: 0.65rem; display: flex; gap: 0.35rem; flex-wrap: wrap;">
                                <button class="btn-secondary select-p1-btn" data-tour="${tour.id}" data-match="${matchIdx}" style="flex: 1; font-size: 0.72rem; padding: 0.25rem 0.4rem; white-space: nowrap;">
                                    👤 Đội 1 (${isP1Set ? 'Đổi' : '+Chọn'})
                                </button>
                                <button class="btn-secondary select-p2-btn" data-tour="${tour.id}" data-match="${matchIdx}" style="flex: 1; font-size: 0.72rem; padding: 0.25rem 0.4rem; white-space: nowrap;">
                                    👤 Đội 2 (${isP2Set ? 'Đổi' : '+Chọn'})
                                </button>
                                <button class="btn-primary edit-match-score-btn" data-tour="${tour.id}" data-match="${matchIdx}" style="font-size: 0.72rem; padding: 0.25rem 0.5rem;" title="Cập nhật tỷ số / Đội thắng">
                                    ✏️ Tỷ Số
                                </button>
                            </div>
                        ` : ''}
                    </div>
                `;
            });
        } else {
            html += `<div style="text-align: center; color: var(--text-muted); padding: 2rem;">Sơ đồ nhánh đấu đang được cập nhật từ BTC...</div>`;
        }
        html += `</div>`;

        if (bodyEl) bodyEl.innerHTML = html;
        if (modal) modal.classList.add('active');

        // Admin Match Controls Event Listeners
        document.querySelectorAll('.select-p1-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const tId = btn.getAttribute('data-tour');
                const mIdx = parseInt(btn.getAttribute('data-match'));
                this.selectPlayerForMatch(tId, mIdx, 1);
            });
        });

        document.querySelectorAll('.select-p2-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const tId = btn.getAttribute('data-tour');
                const mIdx = parseInt(btn.getAttribute('data-match'));
                this.selectPlayerForMatch(tId, mIdx, 2);
            });
        });

        document.querySelectorAll('.edit-match-score-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const tId = btn.getAttribute('data-tour');
                const mIdx = parseInt(btn.getAttribute('data-match'));
                this.editMatchScore(tId, mIdx);
            });
        });

        document.querySelectorAll('.add-bracket-match-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const tId = btn.getAttribute('data-tour');
                this.addBracketMatch(tId);
            });
        });
    }

    selectPlayerForMatch(tourId, matchIdx, teamNumber) {
        const tour = this.tournaments.find(t => t.id === tourId);
        if (!tour || !tour.matches[matchIdx]) return;

        const members = this.getAvailableMembers();
        if (members.length === 0) {
            alert('⚠️ Hệ thống chưa có tài khoản / VĐV nào sẵn có. Vui lòng tạo VĐV hoặc tài khoản trước!');
            return;
        }

        let optionsPrompt = `👤 CHỌN THÀNH VIÊN TỪ TÀI KHOẢN CÓ SẴN (ĐỘI ${teamNumber}):\n\n`;
        members.forEach((m, idx) => {
            optionsPrompt += `${idx + 1}. ${m.name} (${m.role}${m.dupr ? ` • DUPR ${m.dupr.toFixed(2)}` : ''})\n`;
        });
        optionsPrompt += `\n👉 Nhập số thứ tự (1-${members.length}) hoặc nhập Tên VĐV bất kỳ:`;

        const input = prompt(optionsPrompt, "1");
        if (input !== null && input.trim() !== "") {
            let chosenName = input.trim();
            const idxNum = parseInt(chosenName);
            if (!isNaN(idxNum) && idxNum >= 1 && idxNum <= members.length) {
                chosenName = members[idxNum - 1].name;
            }

            if (teamNumber === 1) {
                tour.matches[matchIdx].p1 = chosenName;
            } else {
                tour.matches[matchIdx].p2 = chosenName;
            }

            this.openBracketModal(tourId);
            if (window.app) window.app.logSystem(`✅ Đã chọn VĐV [${chosenName}] cho Đội ${teamNumber} trận [${tour.matches[matchIdx].round}]!`, "success");
        }
    }

    addBracketMatch(tourId) {
        const tour = this.tournaments.find(t => t.id === tourId);
        if (!tour) return;

        const roundName = prompt(`➕ Nhập tên vòng đấu mới (VD: Tứ Kết 3, Bán Kết 2, Vòng 16):`, `Vòng ${tour.matches.length + 1}`);
        if (roundName !== null && roundName.trim() !== '') {
            tour.matches.push({
                round: roundName.trim(),
                p1: 'Chưa chọn VĐV',
                p2: 'Chưa chọn VĐV',
                score: '0 - 0',
                winner: 0
            });
            this.openBracketModal(tourId);
        }
    }

    editMatchScore(tourId, matchIdx) {
        const tour = this.tournaments.find(t => t.id === tourId);
        if (!tour || !tour.matches[matchIdx]) return;

        const match = tour.matches[matchIdx];
        const newScore = prompt(`✏️ Nhập tỷ số mới cho trận [${match.round}] (${match.p1} vs ${match.p2}):`, match.score);
        if (newScore !== null && newScore.trim() !== '') {
            match.score = newScore.trim();
            const winnerChoice = prompt(`Chọn đội thắng (Nhập 1 cho ${match.p1}, Nhập 2 cho ${match.p2}):`, match.winner || 1);
            if (winnerChoice === '1' || winnerChoice === '2') {
                match.winner = parseInt(winnerChoice);
            }
            this.openBracketModal(tourId);
            alert(`✅ Đã cập nhật tỷ số trận đấu thành công!`);
        }
    }

    renderLeaderboard() {
        const tbody = document.getElementById('leaderboard-tbody');
        if (!tbody) return;

        const genderVal = document.getElementById('gender-filter')?.value || 'all';
        const searchVal = (document.getElementById('player-search-input')?.value || '').toLowerCase();

        let filtered = this.players.filter(p => {
            const matchGender = genderVal === 'all' || p.gender === genderVal;
            const matchName = p.name.toLowerCase().includes(searchVal);
            return matchGender && matchName;
        });

        // Sort by DUPR rating descending
        filtered.sort((a, b) => b.dupr - a.dupr);

        tbody.innerHTML = '';
        filtered.forEach((p, index) => {
            const rank = index + 1;
            const rankBadge = rank === 1 ? '🥇 1' : (rank === 2 ? '🥈 2' : (rank === 3 ? '🥉 3' : rank));

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><span class="rank-badge rank-${rank}">${rankBadge}</span></td>
                <td>
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <span style="font-size: 1.4rem;">${p.avatar}</span>
                        <strong>${p.name}</strong>
                    </div>
                </td>
                <td>${p.gender}</td>
                <td><strong style="color: var(--primary); font-family: var(--font-mono); font-size: 1.1rem;">${p.dupr.toFixed(2)}</strong></td>
                <td>${p.winRate} (${p.matches} trận)</td>
                <td><span class="${p.lastDelta.startsWith('+') ? 'delta-plus' : 'delta-minus'}">${p.lastDelta}</span></td>
                <td><strong style="color: var(--accent); font-family: var(--font-mono);">${p.gameScore} PTS</strong></td>
                <td>
                    <button class="btn-small view-player-btn" data-id="${p.id}"><i class="fas fa-user-circle"></i> Hồ sơ</button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        document.querySelectorAll('.view-player-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                this.openPlayerModal(id);
            });
        });
    }

    openPlayerModal(playerId) {
        const player = this.players.find(p => p.id === playerId);
        if (!player) return;

        const modal = document.getElementById('player-modal');
        const content = document.getElementById('player-modal-content');
        if (!content) return;

        let achievementsHTML = '';
        if (player.achievements && player.achievements.length > 0) {
            achievementsHTML = player.achievements.map(a => `<li style="margin-bottom: 0.25rem;"><i class="fas fa-medal" style="color: var(--accent);"></i> ${a}</li>`).join('');
        } else {
            achievementsHTML = `<li>Chưa có danh hiệu chính thức.</li>`;
        }

        let historyHTML = '';
        if (player.history && player.history.length > 0) {
            historyHTML = player.history.map(h => `
                <tr>
                    <td style="font-size: 0.85rem;">${h.date}</td>
                    <td style="font-weight: 600;">${h.event}</td>
                    <td><span class="${h.delta.startsWith('+') ? 'delta-plus' : 'delta-minus'}">${h.delta}</span></td>
                    <td><strong style="color: var(--primary); font-family: var(--font-mono);">${typeof h.newDupr === 'number' ? h.newDupr.toFixed(2) : h.newDupr}</strong></td>
                </tr>
            `).join('');
        } else {
            historyHTML = `<tr><td colspan="4" style="text-align: center; color: var(--text-muted);">Chưa có lịch sử biến động điểm.</td></tr>`;
        }

        content.innerHTML = `
            <div style="display: flex; align-items: center; gap: 1.25rem; border-bottom: 1px solid var(--bg-card-border); padding-bottom: 1rem;">
                <div style="width: 70px; height: 70px; border-radius: 50%; background: rgba(16,185,129,0.15); display: flex; align-items: center; justify-content: center; font-size: 2.8rem; border: 2px solid var(--primary);">
                    ${player.avatar}
                </div>
                <div>
                    <h2 style="font-family: var(--font-heading); color: var(--primary); font-size: 1.4rem;">${player.name}</h2>
                    <div style="color: var(--gold-primary); font-size: 0.85rem; font-weight: 600;">Hồ Sơ VĐV Picko 247 Score • ID: ${player.id} • ${player.gender}</div>
                    <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.3rem;">${player.bio || 'VĐV chính thức CLB Picko 247.'}</p>
                </div>
            </div>

            <!-- Stats Grid -->
            <div class="stats-grid" style="margin-top: 1rem;">
                <div class="stat-box">
                    <div class="stat-label">Điểm Trình DUPR</div>
                    <div class="stat-value highlight">${player.dupr.toFixed(2)}</div>
                </div>
                <div class="stat-box">
                    <div class="stat-label">Tỷ Lệ Thắng</div>
                    <div class="stat-value accent">${player.winRate}</div>
                </div>
                <div class="stat-box">
                    <div class="stat-label">Biến Động Điểm</div>
                    <div class="stat-value" style="color: var(--success);">${player.lastDelta}</div>
                </div>
                <div class="stat-box">
                    <div class="stat-label">Mini Game Record</div>
                    <div class="stat-value secondary">${player.gameScore} PTS</div>
                </div>
            </div>

            <!-- Achievements Section -->
            <div style="margin-top: 1.25rem; background: rgba(0,0,0,0.2); padding: 0.85rem; border-radius: var(--radius-md); border: 1px solid rgba(255,255,255,0.06);">
                <h4 style="color: var(--gold-primary); font-family: var(--font-heading); font-size: 0.95rem; margin-bottom: 0.5rem;">
                    🏆 DANH HIỆU & HUY CHƯƠNG ĐÃ ĐẠT ĐƯỢC
                </h4>
                <ul style="list-style: none; font-size: 0.85rem; color: var(--text-main);">
                    ${achievementsHTML}
                </ul>
            </div>

            <!-- DUPR Rating History Log Table -->
            <div style="margin-top: 1.25rem;">
                <h4 style="color: var(--secondary); font-family: var(--font-heading); font-size: 0.95rem; margin-bottom: 0.5rem;">
                    📈 LỊCH SỬ BIẾN ĐỘNG ĐIỂM DUPR (RATING HISTORY LOG)
                </h4>
                <div style="max-height: 180px; overflow-y: auto;">
                    <table class="leaderboard-table" style="font-size: 0.85rem;">
                        <thead>
                            <tr>
                                <th>THỜI GIAN</th>
                                <th>GIẢI ĐẤU / SỰ KIỆN</th>
                                <th>MỨC TĂNG/GIẢM</th>
                                <th>ĐIỂM SAU GIẢI</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${historyHTML}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        if (modal) modal.classList.add('active');
    }

    syncGameScore(newScore) {
        this.currentLiveGameScore = Math.max(this.currentLiveGameScore, newScore);
        const el = document.getElementById('top-bar-game-score');
        if (el) el.innerText = `${this.currentLiveGameScore} PTS`;

        // Update top player's game score dynamically
        if (this.players.length > 0) {
            if (newScore > this.players[0].gameScore) {
                this.players[0].gameScore = newScore;
                this.renderLeaderboard();
                if (window.app) window.app.logSystem(`🏆 Kỷ Lục Mini Game mới (${newScore} PTS) được đồng bộ lên Bảng Xếp Hạng Picko 247!`, "success");
            }
        }
    }

    updateLiveScore(score) {
        const el = document.getElementById('top-bar-game-score');
        if (el) el.innerText = `${score} PTS`;
    }

    renderAccountList() {
        const tbody = document.getElementById('account-list-tbody');
        if (!tbody) return;

        tbody.innerHTML = '';
        this.accounts.forEach((acc) => {
            const tr = document.createElement('tr');
            const pinDisplay = this.showPinState 
                ? `<strong style="font-family: var(--font-mono); color: var(--gold-primary); font-size: 1.1rem; letter-spacing: 2px;">${acc.pin}</strong>` 
                : `<span style="letter-spacing: 3px; color: var(--text-muted);">••••••</span>`;
            
            const roleBadgeClass = acc.role === 'Quản Trị Viên' ? 'status-live' : (acc.role === 'Vận Động Viên' ? 'status-upcoming' : 'status-finished');
            const statusBadge = acc.status === 'Hoạt động' 
                ? '<span style="color: var(--success); font-weight: 700;"><i class="fas fa-check-circle"></i> Hoạt động</span>' 
                : '<span style="color: var(--danger); font-weight: 700;"><i class="fas fa-ban"></i> Tạm khóa</span>';

            tr.innerHTML = `
                <td><strong style="color: var(--primary); font-family: var(--font-mono);">${acc.id}</strong></td>
                <td><strong>${acc.name}</strong></td>
                <td>${pinDisplay}</td>
                <td><span class="tour-status-badge ${roleBadgeClass}" style="padding: 0.2rem 0.6rem; font-size: 0.75rem;">${acc.role}</span></td>
                <td><strong style="color: var(--gold-primary); font-family: var(--font-mono);">${acc.score} PTS</strong></td>
                <td>${statusBadge}</td>
                <td>
                    <div style="display: flex; gap: 0.35rem;">
                        <button class="btn-secondary change-pin-btn" data-id="${acc.id}" style="padding: 0.25rem 0.55rem; font-size: 0.75rem;" title="Đổi mã PIN 6 chữ số">
                            🔑 Đổi PIN
                        </button>
                        <button class="btn-secondary toggle-status-btn" data-id="${acc.id}" style="padding: 0.25rem 0.55rem; font-size: 0.75rem;" title="Khóa/Mở tài khoản">
                            ${acc.status === 'Hoạt động' ? '🔒 Khóa' : '🔓 Mở'}
                        </button>
                        <button class="btn-danger delete-acc-btn" data-id="${acc.id}" style="padding: 0.25rem 0.55rem; font-size: 0.75rem; border-radius: var(--radius-sm);" title="Xóa tài khoản">
                            🗑️
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });

        // Event listeners for account actions
        document.querySelectorAll('.change-pin-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                this.changeAccountPin(id);
            });
        });

        document.querySelectorAll('.toggle-status-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                this.toggleAccountStatus(id);
            });
        });

        document.querySelectorAll('.delete-acc-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                this.deleteAccount(id);
            });
        });
    }

    changeAccountPin(accId) {
        const acc = this.accounts.find(a => a.id === accId);
        if (!acc) return;

        const newPin = prompt(`🔑 Nhập Mã PIN 6 CHỮ SỐ MỚI cho tài khoản ID [${acc.id}] (${acc.name}):`, acc.pin);
        if (newPin !== null) {
            if (/^\d{6}$/.test(newPin.trim())) {
                acc.pin = newPin.trim();
                this.renderAccountList();
                alert(`✅ Đã cập nhật Mã PIN 6 chữ số mới [${acc.pin}] cho tài khoản ${acc.id}!`);
            } else {
                alert('❌ Mã PIN không hợp lệ! Vui lòng nhập chính xác 6 CHỮ SỐ (VD: 666888, 123456).');
            }
        }
    }

    toggleAccountStatus(accId) {
        const acc = this.accounts.find(a => a.id === accId);
        if (!acc) return;
        acc.status = acc.status === 'Hoạt động' ? 'Tạm khóa' : 'Hoạt động';
        this.renderAccountList();
    }

    deleteAccount(accId) {
        const acc = this.accounts.find(a => a.id === accId);
        if (!acc) return;
        if (confirm(`⚠️ Bạn có chắc chắn muốn XÓA tài khoản ID [${acc.id}] (${acc.name}) khỏi hệ thống?`)) {
            this.accounts = this.accounts.filter(a => a.id !== accId);
            this.renderAccountList();
        }
    }

    setupAdminEvents() {
        const loginBtn = document.getElementById('admin-login-btn');
        if (loginBtn) {
            loginBtn.addEventListener('click', () => {
                const enteredId = (document.getElementById('admin-id-input')?.value || '').trim();
                const enteredPin = (document.getElementById('admin-pin-input')?.value || '').trim();

                if (!enteredId) {
                    alert('⚠️ Vui lòng nhập Tên ID Tài Khoản!');
                    return;
                }

                if (!/^\d{6}$/.test(enteredPin)) {
                    alert('⚠️ Mã PIN phải bao gồm chính xác 6 CHỮ SỐ (VD: 666888 hoặc 123456)!');
                    return;
                }

                // Check in account list or fallback to default admin PINs
                const matchedAcc = this.accounts.find(a => a.id.toLowerCase() === enteredId.toLowerCase());

                let isValidAdmin = false;
                if (matchedAcc) {
                    if (matchedAcc.pin === enteredPin && matchedAcc.status === 'Hoạt động') {
                        isValidAdmin = true;
                        this.currentAdminId = matchedAcc.id;
                    } else if (matchedAcc.status === 'Tạm khóa') {
                        alert(`❌ Tài khoản ${enteredId} hiện đang bị TẠM KHÓA!`);
                        return;
                    }
                } else if ((enteredId.toUpperCase() === 'ADMIN247' || enteredId.toUpperCase() === 'ADMIN') && (enteredPin === '666888' || enteredPin === '123456')) {
                    isValidAdmin = true;
                    this.currentAdminId = enteredId.toUpperCase();
                }

                if (isValidAdmin) {
                    this.isAdminLoggedIn = true;
                    document.getElementById('admin-login-card')?.classList.add('hidden-tab');
                    document.getElementById('admin-management-panel')?.classList.remove('hidden-tab');
                    
                    const loggedEl = document.getElementById('logged-admin-id');
                    if (loggedEl) loggedEl.innerText = this.currentAdminId;

                    this.renderAccountList();
                    this.renderAdminAthletesList();
                    this.renderLiveMatches();
                    if (window.app) window.app.logSystem(`Admin [${this.currentAdminId}] đăng nhập thành công với PIN 6 chữ số!`, "success");
                } else {
                    alert('❌ Đăng nhập thất bại! Tên ID hoặc Mã PIN 6 chữ số không chính xác.');
                }
            });
        }

        // Admin Logout Button
        const logoutBtn = document.getElementById('admin-logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.isAdminLoggedIn = false;
                document.getElementById('admin-management-panel')?.classList.add('hidden-tab');
                document.getElementById('admin-login-card')?.classList.remove('hidden-tab');
            });
        }

        // Toggle PIN Visibility
        const pinToggleBtn = document.getElementById('btn-toggle-pin-visibility');
        if (pinToggleBtn) {
            pinToggleBtn.addEventListener('click', () => {
                this.showPinState = !this.showPinState;
                pinToggleBtn.innerHTML = this.showPinState 
                    ? '<i class="fas fa-eye-slash"></i> Ẩn Mã PIN' 
                    : '<i class="fas fa-eye"></i> Hiện / Ẩn Mã PIN';
                this.renderAccountList();
            });
        }

        // Open Add Account Modal
        const openAddModalBtn = document.getElementById('btn-open-add-account-modal');
        if (openAddModalBtn) {
            openAddModalBtn.addEventListener('click', () => {
                const modal = document.getElementById('account-modal');
                if (modal) modal.classList.add('active');
            });
        }

        // Open Add Athlete Modal
        const openAddAthleteModalBtn = document.getElementById('btn-open-add-athlete-modal');
        if (openAddAthleteModalBtn) {
            openAddAthleteModalBtn.addEventListener('click', () => {
                const modal = document.getElementById('athlete-modal');
                if (modal) modal.classList.add('active');
            });
        }

        // Auto Sync DUPR Button
        const triggerDuprSyncBtn = document.getElementById('btn-trigger-dupr-sync');
        if (triggerDuprSyncBtn) {
            triggerDuprSyncBtn.addEventListener('click', () => {
                this.players.forEach(p => {
                    const deltaVal = (Math.random() > 0.3 ? 0.05 + Math.random() * 0.15 : - (0.05 + Math.random() * 0.1)).toFixed(2);
                    const deltaStr = (parseFloat(deltaVal) >= 0 ? `+${deltaVal}` : `${deltaVal}`);
                    p.dupr = Math.max(1.0, parseFloat((p.dupr + parseFloat(deltaVal)).toFixed(2)));
                    p.lastDelta = deltaStr;
                    p.history.unshift({
                        date: new Date().toLocaleDateString('vi-VN'),
                        event: 'Cập nhật DUPR tự động từ Hệ Thống Picko',
                        delta: deltaStr,
                        newDupr: p.dupr
                    });
                });
                this.renderLeaderboard();
                this.renderAdminAthletesList();
                alert('✅ Đã đồng bộ & ghi nhận biến động điểm DUPR cho toàn bộ VĐV!');
            });
        }

        // Random 6-digit PIN Generator
        const genPinBtn = document.getElementById('btn-generate-pin');
        if (genPinBtn) {
            genPinBtn.addEventListener('click', () => {
                const randomPin = Math.floor(100000 + Math.random() * 900000).toString();
                const pinInput = document.getElementById('new-account-pin');
                if (pinInput) pinInput.value = randomPin;
            });
        }

        // Add Account Form Submit
        const addAccForm = document.getElementById('form-add-account');
        if (addAccForm) {
            addAccForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const accId = document.getElementById('new-account-id').value.trim();
                const accName = document.getElementById('new-account-name').value.trim();
                const accPin = document.getElementById('new-account-pin').value.trim();
                const accRole = document.getElementById('new-account-role').value;

                if (this.accounts.some(a => a.id.toLowerCase() === accId.toLowerCase())) {
                    alert(`❌ Tên ID [${accId}] đã tồn tại trong hệ thống! Vui lòng chọn Tên ID khác.`);
                    return;
                }

                if (!/^\d{6}$/.test(accPin)) {
                    alert('❌ Mã PIN bắt buộc phải bao gồm đúng 6 CHỮ SỐ (VD: 888999).');
                    return;
                }

                const newAcc = {
                    id: accId,
                    name: accName,
                    pin: accPin,
                    role: accRole,
                    status: 'Hoạt động',
                    score: 0
                };

                this.accounts.unshift(newAcc);
                this.renderAccountList();
                document.getElementById('account-modal')?.classList.remove('active');
                addAccForm.reset();
                alert(`✅ Đã tạo thành công tài khoản ID [${accId}] với Mã PIN 6 chữ số [${accPin}]!`);
            });
        }

        // Add Athlete Form Submit
        const addAthleteForm = document.getElementById('form-add-athlete');
        if (addAthleteForm) {
            addAthleteForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const name = document.getElementById('new-athlete-name').value.trim();
                const gender = document.getElementById('new-athlete-gender').value;
                const dupr = parseFloat(document.getElementById('new-athlete-dupr').value) || 4.5;
                const bio = document.getElementById('new-athlete-bio').value.trim() || 'VĐV mới đăng ký Picko 247.';
                const achievementsStr = document.getElementById('new-athlete-achievements').value.trim();

                const newAthlete = {
                    id: 'P' + (this.players.length + 1).toString().padStart(2, '0'),
                    name: name,
                    gender: gender,
                    dupr: dupr,
                    winRate: '100%',
                    matches: 1,
                    lastDelta: '+0.20',
                    gameScore: 0,
                    avatar: gender === 'Nam' ? '🏓' : '⭐',
                    bio: bio,
                    achievements: achievementsStr ? [achievementsStr] : [],
                    history: [
                        { date: new Date().toLocaleDateString('vi-VN'), event: 'Khởi tạo hồ sơ VĐV mới', delta: '+0.20', newDupr: dupr }
                    ]
                };

                this.players.unshift(newAthlete);
                this.renderLeaderboard();
                this.renderAdminAthletesList();
                document.getElementById('athlete-modal')?.classList.remove('active');
                addAthleteForm.reset();
                alert(`✅ Đã khởi tạo Hồ Sơ VĐV Mới [${name}] thành công!`);
            });
        }

        // Form Submit New Tournament (Kèm Thời Gian Bắt Đầu & Kết Thúc)
        const tourForm = document.getElementById('form-add-tournament');
        if (tourForm) {
            tourForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const name = document.getElementById('admin-tour-name').value;
                const category = document.getElementById('admin-tour-category').value;
                const prize = document.getElementById('admin-tour-prize').value;
                const startTime = document.getElementById('admin-tour-start-time').value;
                const endTime = document.getElementById('admin-tour-end-time').value;

                let dateStr = 'Mới tạo';
                if (startTime && endTime) {
                    const sDate = new Date(startTime);
                    const eDate = new Date(endTime);
                    const sStr = !isNaN(sDate) ? `${String(sDate.getDate()).padStart(2,'0')}/${String(sDate.getMonth()+1).padStart(2,'0')}/${sDate.getFullYear()} ${String(sDate.getHours()).padStart(2,'0')}:${String(sDate.getMinutes()).padStart(2,'0')}` : startTime;
                    const eStr = !isNaN(eDate) ? `${String(eDate.getDate()).padStart(2,'0')}/${String(eDate.getMonth()+1).padStart(2,'0')}/${eDate.getFullYear()} ${String(eDate.getHours()).padStart(2,'0')}:${String(eDate.getMinutes()).padStart(2,'0')}` : endTime;
                    dateStr = `${sStr} ➔ ${eStr}`;
                }

                const newTour = {
                    id: 'T' + (this.tournaments.length + 1).toString().padStart(2, '0'),
                    name: name,
                    status: 'live',
                    category: category,
                    prize: prize,
                    date: dateStr,
                    startTime: startTime,
                    endTime: endTime,
                    location: 'Picko 247 Hub',
                    teamsCount: 16,
                    banner: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80',
                    podium: null,
                    matches: [
                        { round: 'Tứ Kết 1', p1: 'Chưa chọn VĐV', p2: 'Chưa chọn VĐV', score: '0 - 0', winner: 0 },
                        { round: 'Tứ Kết 2', p1: 'Chưa chọn VĐV', p2: 'Chưa chọn VĐV', score: '0 - 0', winner: 0 },
                        { round: 'Bán Kết', p1: 'Thắng TK1', p2: 'Thắng TK2', score: '0 - 0', winner: 0 },
                        { round: 'Chung Kết', p1: 'Thắng BK1', p2: 'Thắng BK2', score: '0 - 0', winner: 0 }
                    ]
                };

                this.tournaments.unshift(newTour);
                this.renderTournaments('all');
                tourForm.reset();

                // TỰ ĐỘNG MỞ POPUP SƠ ĐỒ NHÁNH ĐẤU ĐỂ ADMIN XẾP VĐV TỪ TÀI KHOẢN CÓ SẴN
                this.openBracketModal(newTour.id);
                alert(`✅ Đã tạo thành công Giải Đấu Mới [${name}]\n⏰ Thời gian: ${dateStr}\n\n👉 Popup Sơ đồ Nhánh đấu đã mở! Hãy chọn VĐV từ các tài khoản có sẵn để xếp vào nhánh.`);
                if (window.app) window.app.logSystem(`🏆 Đã tạo giải đấu mới [${name}]. Hãy chọn VĐV từ tài khoản có sẵn vào nhánh đấu!`, "success");
            });
        }

        // Open Add Live Match Modal
        const openAddLiveMatchModalBtn = document.getElementById('btn-open-add-live-match-modal');
        if (openAddLiveMatchModalBtn) {
            openAddLiveMatchModalBtn.addEventListener('click', () => {
                const modal = document.getElementById('live-match-modal');
                if (modal) modal.classList.add('active');
            });
        }

        // Add Live Match Form Submit
        const addLiveMatchForm = document.getElementById('form-add-live-match');
        if (addLiveMatchForm) {
            addLiveMatchForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const tourName = document.getElementById('new-match-tour').value.trim();
                const round = document.getElementById('new-match-round').value.trim();
                const court = document.getElementById('new-match-court').value.trim();
                const p1 = document.getElementById('new-match-p1').value.trim();
                const p2 = document.getElementById('new-match-p2').value.trim();
                const score = document.getElementById('new-match-score').value.trim();
                const startTime = document.getElementById('new-match-start-time').value;
                const endTime = document.getElementById('new-match-end-time').value;

                const newMatch = {
                    id: 'LM' + (this.liveMatches.length + 1).toString().padStart(2, '0'),
                    tourName,
                    round,
                    court,
                    p1,
                    p2,
                    score,
                    status: 'live',
                    startTime,
                    endTime
                };

                this.liveMatches.unshift(newMatch);
                this.renderLiveMatches();
                document.getElementById('live-match-modal')?.classList.remove('active');
                addLiveMatchForm.reset();
                alert(`✅ Đã thêm và phát trực tiếp trận đấu mới [${round}: ${p1} vs ${p2}]!`);
            });
        }
    }

    renderLiveMatches() {
        const tbody = document.getElementById('live-matches-tbody');
        if (!tbody) return;

        tbody.innerHTML = '';
        if (this.liveMatches.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 1.5rem;">Chưa có trận đấu nào đang phát trực tiếp.</td></tr>`;
            return;
        }

        this.liveMatches.forEach(m => {
            const tr = document.createElement('tr');
            
            let statusBadge = '';
            if (m.status === 'live') {
                statusBadge = `<span class="tour-status-badge status-live" style="padding: 0.2rem 0.6rem; font-size: 0.75rem;"><i class="fas fa-dot-circle"></i> Đang Thi Đấu</span>`;
            } else if (m.status === 'paused') {
                statusBadge = `<span class="tour-status-badge status-upcoming" style="padding: 0.2rem 0.6rem; font-size: 0.75rem;"><i class="fas fa-pause"></i> Tạm Hoãn</span>`;
            } else {
                statusBadge = `<span class="tour-status-badge status-finished" style="padding: 0.2rem 0.6rem; font-size: 0.75rem;"><i class="fas fa-check-double"></i> Đã Kết Thúc</span>`;
            }

            let timeStr = 'Chưa thiết lập';
            if (m.startTime && m.endTime) {
                const sDate = new Date(m.startTime);
                const eDate = new Date(m.endTime);
                const sStr = !isNaN(sDate) ? `${String(sDate.getHours()).padStart(2,'0')}:${String(sDate.getMinutes()).padStart(2,'0')} ${String(sDate.getDate()).padStart(2,'0')}/${String(sDate.getMonth()+1).padStart(2,'0')}` : m.startTime;
                const eStr = !isNaN(eDate) ? `${String(eDate.getHours()).padStart(2,'0')}:${String(eDate.getMinutes()).padStart(2,'0')} ${String(eDate.getDate()).padStart(2,'0')}/${String(eDate.getMonth()+1).padStart(2,'0')}` : m.endTime;
                timeStr = `${sStr} ➔ ${eStr}`;
            }

            tr.innerHTML = `
                <td>
                    <strong style="color: var(--primary); font-family: var(--font-mono);">${m.id}</strong>
                    <div style="font-size: 0.8rem; color: var(--text-muted); font-weight: 600;">${m.tourName}</div>
                </td>
                <td>
                    <strong style="color: var(--gold-primary);">${m.round}</strong>
                    <div style="font-size: 0.78rem; color: var(--text-muted);"><i class="fas fa-map-marker-alt"></i> ${m.court}</div>
                </td>
                <td>
                    <div style="font-weight: 700; color: #fff;">${m.p1}</div>
                    <div style="font-size: 0.75rem; color: var(--secondary);">vs</div>
                    <div style="font-weight: 700; color: #fff;">${m.p2}</div>
                </td>
                <td>
                    <strong style="color: var(--gold-primary); font-family: var(--font-mono); font-size: 1.15rem; background: rgba(0,0,0,0.4); padding: 0.25rem 0.65rem; border-radius: 6px; border: 1px solid rgba(250,204,21,0.3); display: inline-block;">
                        ${m.score}
                    </strong>
                </td>
                <td>
                    <div style="font-size: 0.82rem; font-family: var(--font-mono); color: var(--text-main);"><i class="fas fa-clock" style="color: var(--secondary);"></i> ${timeStr}</div>
                </td>
                <td>${statusBadge}</td>
                <td>
                    <div style="display: flex; gap: 0.35rem; flex-wrap: wrap;">
                        <button class="btn-secondary update-live-score-btn" data-id="${m.id}" style="padding: 0.25rem 0.55rem; font-size: 0.75rem;" title="Cập nhật tỷ số trực tiếp">
                            ✏️ Tỷ Số
                        </button>
                        <button class="btn-secondary toggle-live-status-btn" data-id="${m.id}" style="padding: 0.25rem 0.55rem; font-size: 0.75rem;" title="Chuyển trạng thái trận đấu">
                            🔄 Trạng Thái
                        </button>
                        <button class="btn-primary declare-live-winner-btn" data-id="${m.id}" style="padding: 0.25rem 0.55rem; font-size: 0.75rem;" title="Phán quyết đội thắng">
                            🏆 Đội Thắng
                        </button>
                        <button class="btn-danger delete-live-match-btn" data-id="${m.id}" style="padding: 0.25rem 0.55rem; font-size: 0.75rem; border-radius: var(--radius-sm);" title="Xóa trận">
                            🗑️
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });

        // Event Listeners for Live Match actions
        document.querySelectorAll('.update-live-score-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                this.updateLiveMatchScore(id);
            });
        });

        document.querySelectorAll('.toggle-live-status-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                this.toggleLiveMatchStatus(id);
            });
        });

        document.querySelectorAll('.declare-live-winner-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                this.declareLiveMatchWinner(id);
            });
        });

        document.querySelectorAll('.delete-live-match-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                this.deleteLiveMatch(id);
            });
        });
    }

    updateLiveMatchScore(matchId) {
        const match = this.liveMatches.find(m => m.id === matchId);
        if (!match) return;

        const newScore = prompt(`⚡ CẬP NHẬT TỶ SỐ TRỰC TIẾP TRẬN [${match.round}]\n(${match.p1} vs ${match.p2}):`, match.score);
        if (newScore !== null && newScore.trim() !== '') {
            match.score = newScore.trim();
            this.renderLiveMatches();
            if (window.app) window.app.logSystem(`⚡ Admin vừa cập nhật Tỷ Số Trực Tiếp cho trận ${match.id}: [${match.score}]`, "success");
        }
    }

    toggleLiveMatchStatus(matchId) {
        const match = this.liveMatches.find(m => m.id === matchId);
        if (!match) return;

        if (match.status === 'live') {
            match.status = 'paused';
        } else if (match.status === 'paused') {
            match.status = 'finished';
        } else {
            match.status = 'live';
        }
        this.renderLiveMatches();
        if (window.app) window.app.logSystem(`🔄 Trạng thái trận đấu ${match.id} đổi sang: [${match.status.toUpperCase()}]`, "info");
    }

    declareLiveMatchWinner(matchId) {
        const match = this.liveMatches.find(m => m.id === matchId);
        if (!match) return;

        const winnerChoice = prompt(`🏆 PHÁN QUYẾT ĐỘI THẮNG TRẬN KẾT THÚC:\nNhập 1: ${match.p1}\nNhập 2: ${match.p2}`, '1');
        if (winnerChoice === '1' || winnerChoice === '2') {
            const winnerName = winnerChoice === '1' ? match.p1 : match.p2;
            match.status = 'finished';
            this.renderLiveMatches();
            alert(`✅ Trận đấu [${match.round}] đã kết thúc! Đội thắng cuộc: 🏆 ${winnerName}`);
            if (window.app) window.app.logSystem(`🏆 Trận đấu ${match.id} kết thúc. Đội chiến thắng: ${winnerName}`, "success");
        }
    }

    deleteLiveMatch(matchId) {
        const match = this.liveMatches.find(m => m.id === matchId);
        if (!match) return;
        if (confirm(`⚠️ Bạn có chắc chắn muốn XÓA trận đấu [${match.round}] (${match.p1} vs ${match.p2}) khỏi danh sách?`)) {
            this.liveMatches = this.liveMatches.filter(m => m.id !== matchId);
            this.renderLiveMatches();
        }
    }

    renderAdminAthletesList() {
        const tbody = document.getElementById('admin-athletes-tbody');
        if (!tbody) return;

        tbody.innerHTML = '';
        this.players.forEach(p => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong style="color: var(--primary); font-family: var(--font-mono);">${p.id}</strong></td>
                <td>
                    <div style="display: flex; align-items: center; gap: 0.4rem;">
                        <span>${p.avatar}</span>
                        <strong>${p.name}</strong>
                    </div>
                </td>
                <td>${p.gender}</td>
                <td><strong style="color: var(--gold-primary); font-size: 1.1rem; font-family: var(--font-mono);">${p.dupr.toFixed(2)}</strong></td>
                <td>${p.winRate} (${p.matches} trận)</td>
                <td><span class="${p.lastDelta.startsWith('+') ? 'delta-plus' : 'delta-minus'}">${p.lastDelta}</span></td>
                <td>
                    <div style="display: flex; gap: 0.35rem;">
                        <button class="btn-secondary adjust-dupr-btn" data-id="${p.id}" style="padding: 0.25rem 0.55rem; font-size: 0.75rem;" title="Cộng / Trừ điểm DUPR">
                            ⚡ Cộng/Trừ Điểm
                        </button>
                        <button class="btn-danger delete-athlete-btn" data-id="${p.id}" style="padding: 0.25rem 0.55rem; font-size: 0.75rem; border-radius: var(--radius-sm);" title="Xóa VĐV">
                            🗑️
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });

        document.querySelectorAll('.adjust-dupr-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                this.adjustPlayerDupr(id);
            });
        });

        document.querySelectorAll('.delete-athlete-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                this.deleteAthlete(id);
            });
        });
    }

    adjustPlayerDupr(playerId) {
        const player = this.players.find(p => p.id === playerId);
        if (!player) return;

        const deltaInput = prompt(`⚡ Nhập mức điểm muốn CỘNG hoặc TRỪ DUPR cho [${player.name}] (VD: +0.20 hoặc -0.15):`, '+0.20');
        if (deltaInput !== null && deltaInput.trim() !== '') {
            const numDelta = parseFloat(deltaInput.trim());
            if (isNaN(numDelta)) {
                alert('❌ Số điểm không hợp lệ! Vui lòng nhập số như +0.20 hoặc -0.10');
                return;
            }

            const reason = prompt(`Nhập Tên Giải Đấu / Lý do điều chỉnh điểm:`, 'Giải đấu Picko Cup');
            if (reason !== null) {
                const deltaStr = numDelta >= 0 ? `+${numDelta.toFixed(2)}` : `${numDelta.toFixed(2)}`;
                player.dupr = Math.max(1.0, parseFloat((player.dupr + numDelta).toFixed(2)));
                player.lastDelta = deltaStr;
                player.history.unshift({
                    date: new Date().toLocaleDateString('vi-VN'),
                    event: reason.trim() || 'Điều chỉnh từ Admin',
                    delta: deltaStr,
                    newDupr: player.dupr
                });

                this.renderLeaderboard();
                this.renderAdminAthletesList();
                alert(`✅ Đã điều chỉnh điểm DUPR của ${player.name} thành [${player.dupr.toFixed(2)}] (${deltaStr})!`);
            }
        }
    }

    deleteAthlete(playerId) {
        const player = this.players.find(p => p.id === playerId);
        if (!player) return;

        if (confirm(`⚠️ Bạn có chắc chắn muốn XÓA hồ sơ VĐV [${player.name}] khỏi hệ thống?`)) {
            this.players = this.players.filter(p => p.id !== playerId);
            this.renderLeaderboard();
            this.renderAdminAthletesList();
        }
    }
}

window.addEventListener('DOMContentLoaded', () => {
    window.pickoPlatform = new PickoPlatform();
});
