const API_BASE_URL = window.location.origin + '/api';

let currentUser = null;
let authToken = null;

class App {
    constructor() {
        this.init();
    }

    init() {
        this.checkAuth();
        this.setupEventListeners();
        this.showPage('dashboard');
    }

    checkAuth() {
        const token = localStorage.getItem('authToken');
        const user = localStorage.getItem('currentUser');

        if (token && user) {
            authToken = token;
            currentUser = JSON.parse(user);
            this.updateUI();
        }
    }

    setupEventListeners() {
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.login();
        });

        document.getElementById('registerForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.register();
        });

        document.getElementById('pengaduanForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.createPengaduan();
        });

        window.addEventListener('hashchange', () => {
            this.handleRouting();
        });

        this.handleRouting();
    }

    handleRouting() {
        const hash = window.location.hash.substring(1);
        
        if (hash && !this.isAuthenticated()) {
            window.location.hash = 'login';
            return;
        }

        switch(hash) {
            case 'login':
                this.showPage('login');
                break;
            case 'register':
                this.showPage('register');
                break;
            case 'pengaduan':
                if (this.isAuthenticated()) {
                    this.showPage('pengaduan');
                    this.loadKategori();
                }
                break;
            case 'tracking':
                if (this.isAuthenticated()) {
                    this.showPage('tracking');
                }
                break;
            default:
                this.showPage('dashboard');
        }
    }

    showPage(pageId) {
        document.querySelectorAll('.page-content').forEach(page => {
            page.classList.remove('active');
            page.style.display = 'none';
        });

        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
            targetPage.style.display = 'block';
        }

        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });

        const activeLink = document.querySelector(`[href="#${pageId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }

    isAuthenticated() {
        return authToken && currentUser;
    }

    updateUI() {
        if (this.isAuthenticated()) {
            document.getElementById('userMenu').style.display = 'block';
            document.getElementById('userName').textContent = currentUser.nama_lengkap;
            document.getElementById('loginMenu').style.display = 'none';

            if (currentUser.role === 'masyarakat') {
                document.getElementById('menuPengaduan').style.display = 'block';
                document.getElementById('menuTracking').style.display = 'block';
            } else if (currentUser.role === 'bidang') {
                document.getElementById('menuBidang').style.display = 'block';
            } else if (currentUser.role === 'admin') {
                document.getElementById('menuAdmin').style.display = 'block';
            }
        } else {
            document.getElementById('userMenu').style.display = 'none';
            document.getElementById('loginMenu').style.display = 'block';
            document.getElementById('menuPengaduan').style.display = 'none';
            document.getElementById('menuTracking').style.display = 'none';
            document.getElementById('menuBidang').style.display = 'none';
            document.getElementById('menuAdmin').style.display = 'none';
        }
    }

    async login() {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const result = await response.json();

            if (result.success) {
                authToken = result.data.token;
                currentUser = result.data.user;
                
                localStorage.setItem('authToken', authToken);
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                
                this.updateUI();
                this.showAlert('Login berhasil!', 'success');
                window.location.hash = 'dashboard';
            } else {
                this.showAlert(result.message || 'Login gagal', 'danger');
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showAlert('Terjadi kesalahan saat login', 'danger');
        }
    }

    async register() {
        const username = document.getElementById('username').value;
        const nama_lengkap = document.getElementById('nama_lengkap').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (password !== confirmPassword) {
            this.showAlert('Password dan konfirmasi password tidak cocok', 'danger');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    username, 
                    nama_lengkap, 
                    email, 
                    password,
                    role: 'masyarakat'
                })
            });

            const result = await response.json();

            if (result.success) {
                this.showAlert('Registrasi berhasil! Silakan login', 'success');
                window.location.hash = 'login';
            } else {
                this.showAlert(result.message || 'Registrasi gagal', 'danger');
            }
        } catch (error) {
            console.error('Register error:', error);
            this.showAlert('Terjadi kesalahan saat registrasi', 'danger');
        }
    }

    async loadKategori() {
        try {
            const response = await fetch(`${API_BASE_URL}/master/kategori`);
            const result = await response.json();

            if (result.success) {
                const select = document.getElementById('kategori');
                select.innerHTML = '<option value="">Pilih Kategori</option>';
                
                result.data.forEach(kategori => {
                    const option = document.createElement('option');
                    option.value = kategori.id;
                    option.textContent = kategori.nama_kategori;
                    select.appendChild(option);
                });
            }
        } catch (error) {
            console.error('Load kategori error:', error);
        }
    }

    async createPengaduan() {
        const formData = new FormData();
        formData.append('kategori_id', document.getElementById('kategori').value);
        formData.append('judul_pengaduan', document.getElementById('judul').value);
        formData.append('isi_pengaduan', document.getElementById('isi').value);
        formData.append('lokasi_kejadian', document.getElementById('lokasi').value);
        formData.append('tanggal_kejadian', document.getElementById('tanggal').value);

        const fileInput = document.getElementById('file_bukti');
        if (fileInput.files[0]) {
            formData.append('file_bukti', fileInput.files[0]);
        }

        try {
            const response = await fetch(`${API_BASE_URL}/pengaduan`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                },
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                this.showAlert(`Pengaduan berhasil dibuat! Kode: ${result.data.kode_pengaduan}`, 'success');
                document.getElementById('pengaduanForm').reset();
                window.location.hash = 'tracking';
            } else {
                this.showAlert(result.message || 'Pengaduan gagal dibuat', 'danger');
            }
        } catch (error) {
            console.error('Create pengaduan error:', error);
            this.showAlert('Terjadi kesalahan saat membuat pengaduan', 'danger');
        }
    }

    async trackPengaduan() {
        const kode = document.getElementById('trackingKode').value.trim();
        
        if (!kode) {
            this.showAlert('Masukkan kode pengaduan', 'warning');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/pengaduan/kode/${kode}`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });

            const result = await response.json();

            if (result.success) {
                this.displayTrackingResult(result.data);
            } else {
                this.showAlert(result.message || 'Pengaduan tidak ditemukan', 'danger');
                document.getElementById('trackingResult').innerHTML = '';
            }
        } catch (error) {
            console.error('Track pengaduan error:', error);
            this.showAlert('Terjadi kesalahan saat tracking pengaduan', 'danger');
        }
    }

    displayTrackingResult(pengaduan) {
        const statusClass = `status-${pengaduan.status.replace(' ', '-')}`;
        
        const html = `
            <div class="tracking-info">
                <div class="row">
                    <div class="col-md-6">
                        <h5>Detail Pengaduan</h5>
                        <p><strong>Kode:</strong> ${pengaduan.kode_pengaduan}</p>
                        <p><strong>Judul:</strong> ${pengaduan.judul_pengaduan}</p>
                        <p><strong>Kategori:</strong> ${pengaduan.kategori_pengaduan.nama_kategori}</p>
                        <p><strong>Tanggal:</strong> ${new Date(pengaduan.created_at).toLocaleString('id-ID')}</p>
                    </div>
                    <div class="col-md-6">
                        <h5>Status</h5>
                        <span class="status-badge ${statusClass}">${pengaduan.status.toUpperCase()}</span>
                        <p class="mt-2"><strong>Bidang:</strong> ${pengaduan.bidang ? pengaduan.bidang.nama_bidang : 'Belum di disposisikan'}</p>
                    </div>
                </div>
                <div class="row mt-3">
                    <div class="col-12">
                        <h6>Isi Pengaduan</h6>
                        <p>${pengaduan.isi_pengaduan}</p>
                        ${pengaduan.lokasi_kejadian ? `<p><strong>Lokasi:</strong> ${pengaduan.lokasi_kejadian}</p>` : ''}
                        ${pengaduan.tanggal_kejadian ? `<p><strong>Tanggal Kejadian:</strong> ${new Date(pengaduan.tanggal_kejadian).toLocaleDateString('id-ID')}</p>` : ''}
                        ${pengaduan.file_bukti ? `<p><strong>Bukti:</strong> <a href="/uploads/pengaduan/${pengaduan.file_bukti}" target="_blank">Lihat File</a></p>` : ''}
                    </div>
                </div>
            </div>
        `;

        document.getElementById('trackingResult').innerHTML = html;
    }

    showAlert(message, type = 'info') {
        const modal = new bootstrap.Modal(document.getElementById('alertModal'));
        document.getElementById('alertModalTitle').textContent = type.charAt(0).toUpperCase() + type.slice(1);
        document.getElementById('alertModalBody').innerHTML = `
            <div class="alert alert-${type}" role="alert">
                ${message}
            </div>
        `;
        modal.show();
    }
}

function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    authToken = null;
    currentUser = null;
    app.updateUI();
    window.location.hash = 'dashboard';
    app.showAlert('Anda telah logout', 'info');
}

function trackPengaduan() {
    app.trackPengaduan();
}

const app = new App();

// Counter Animation for Stats
function animateCounter() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.ceil(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        updateCounter();
    });
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate__animated', 'animate__fadeInUp');
            
            if (entry.target.classList.contains('stats-section')) {
                animateCounter();
            }
        }
    });
}, observerOptions);

// Observe elements
document.addEventListener('DOMContentLoaded', () => {
    const elementsToAnimate = document.querySelectorAll('.feature-card, .stat-item, .stats-section');
    elementsToAnimate.forEach(el => observer.observe(el));
});
