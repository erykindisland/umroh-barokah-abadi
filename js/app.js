document.addEventListener('DOMContentLoaded', () => {

    // 1. Navbar Glassmorphism Scroll Effect
    const header = document.querySelector('.glass-nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.background = 'rgba(12, 31, 54, 0.95)';
            header.style.boxShadow = '0 5px 20px rgba(0,0,0,0.2)';
            header.style.padding = '10px 0';
        } else {
            header.style.background = 'rgba(12, 31, 54, 0.85)';
            header.style.boxShadow = 'none';
            header.style.padding = '15px 0';
        }
    });

    // 2. Interactive "AI" Trip Planner (Asisten Bimbingan Personal)
    const formSteps = document.querySelectorAll('.form-step');
    const optionBtns = document.querySelectorAll('.option-btn');
    const nextBtns = document.querySelectorAll('.next-step');

    // Handle Option Selection
    optionBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            // Prevent default label click double triggering
            if (e.target.tagName.toLowerCase() === 'input') return;
            
            const radio = this.querySelector('input[type="radio"]');
            radio.checked = true;

            // Remove selected class from siblings
            const siblings = this.closest('.options-grid').querySelectorAll('.option-btn');
            siblings.forEach(sib => sib.classList.remove('selected'));
            
            // Add selected class to current
            this.classList.add('selected');
        });
    });

    // Handle Next Steps/Submit
    nextBtns.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            // Validate if selection made
            const currentStep = formSteps[index];
            const hasSelection = currentStep.querySelector('input[type="radio"]:checked');
            
            if (!hasSelection && index < nextBtns.length) {
                alert('Silakan pilih salah satu opsi untuk melanjutkan bimbingan.');
                return;
            }

            // Hide current, show next
            currentStep.style.display = 'none';
            
            if (index + 1 < formSteps.length - 1) {
                formSteps[index + 1].style.display = 'block';
            } else {
                // Show result step
                const resultStep = document.getElementById('step-result');
                resultStep.style.display = 'block';
                
                // Simulate processing
                setTimeout(() => {
                    const who = document.querySelector('input[name="who"]:checked').value;
                    const when = document.querySelector('input[name="when"]:checked').value;
                    
                    const spinner = resultStep.querySelector('h3');
                    spinner.innerHTML = '<i class="ph-fill ph-check-circle text-gold"></i> Rekomendasi Ditemukan!';
                    
                    const resultContent = document.getElementById('ai-result-content');
                    
                    // Simple logic based on selection
                    let recommendation = '';
                    if (who === 'Keluarga' || who === 'Group') {
                        recommendation = `
                            <div class="ai-card">
                                <h4>Paket VIP Ramah Lansia (Rabbani Tour)</h4>
                                <p>Berdasarkan kebutuhan rombongan/keluarga di waktu ${when}, kami merekomendasikan paket dengan fasilitas bus *low-deck* dan jarak hotel ke pelataran masjid kurang dari 50 meter.</p>
                                <button class="btn btn-primary w-100 open-wa" data-wa="rabbani">Konsultasikan Paket Ini <i class="ph ph-whatsapp-logo"></i></button>
                            </div>
                        `;
                    } else if (who === 'Pasangan') {
                        recommendation = `
                            <div class="ai-card">
                                <h4>Paket Honeymoon/Couple (Alhijaz)</h4>
                                <p>Untuk pasangan di waktu ${when}, paket kamar *Double* (berdua) di Zamzam Tower memberikan kenyamanan optimal dan keintiman ibadah.</p>
                                <button class="btn btn-primary w-100 open-wa" data-wa="alhijaz">Amankan Kursi Pasangan <i class="ph ph-whatsapp-logo"></i></button>
                            </div>
                        `;
                    } else {
                        recommendation = `
                            <div class="ai-card">
                                <h4>Paket Umroh Mandiri & Milenial (Umrah Companions)</h4>
                                <p>Untuk keberangkatan pribadi/mandiri di waktu ${when}, paket ini menawarkan fleksibilitas tertinggi dan *budget* yang efisien.</p>
                                <button class="btn btn-primary w-100 open-wa" data-wa="companions">Tanya Detail Estimasi <i class="ph ph-whatsapp-logo"></i></button>
                            </div>
                        `;
                    }
                    
                    resultContent.innerHTML = recommendation;
                    
                    // Re-bind WA buttons for newly injected DOM
                    bindWAButtons();

                }, 1500);
            }
        });
    });


    // 3. WhatsApp Routing Logic
    const waNumbers = {
        'konsultasi': '628881211529',
        'alhijaz': '628881211529',
        'rabbani': '628881211529',
        'nusa': '628881211529',
        'companions': '628881211529'
    };

    const waMessages = {
        'konsultasi': 'Assalamu’alaikum, saya ingin konsultasi awal mengenai pendaftaran umroh.',
        'alhijaz': 'Assalamu’alaikum, saya tertarik dan ingin mengamankan kursi untuk Paket Alhijaz Indowisata.',
        'rabbani': 'Assalamu’alaikum, mohon informasi lebih lanjut mengenai paket dari Rabbani Tour.',
        'nusa': 'Assalamu’alaikum, saya ingin mengetahui program kemitraan/paket menarik dari Nusa Travel.',
        'companions': 'Assalamu’alaikum, saya ingin info mengenai program backpacker/milenial dari Umrah Companions.'
    };

    function bindWAButtons() {
        const waBtns = document.querySelectorAll('.open-wa');
        waBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const type = btn.getAttribute('data-wa');
                const number = waNumbers[type] || waNumbers['konsultasi'];
                const message = encodeURIComponent(waMessages[type] || waMessages['konsultasi']);
                const link = `https://wa.me/${number}?text=${message}`;
                window.open(link, '_blank');
            });
        });
    }

    bindWAButtons();

    // 4. Floating WA Widget Toggle
    const waToggle = document.getElementById('wa-toggle');
    const waMenu = document.getElementById('wa-menu');

    waToggle.addEventListener('click', () => {
        waMenu.classList.toggle('hidden');
        if (waMenu.classList.contains('hidden')) {
            waToggle.innerHTML = '<i class="ph-fill ph-whatsapp-logo"></i>';
            waToggle.style.backgroundColor = '#25d366';
        } else {
            waToggle.innerHTML = '<i class="ph ph-x"></i>';
            waToggle.style.backgroundColor = '#e53e3e';
        }
    });

    // 5. Dynamic Quota Simulator (Urgency)
    // Reduce quota slightly over time to simulate live bookings
    setTimeout(() => {
        const safeFill = document.querySelector('.safe-fill');
        const safeText = document.querySelector('.safe');
        if (safeFill && safeText) {
            safeFill.style.width = '55%';
            safeText.innerText = 'Tersisa 21 Seat';
            safeText.style.color = '#d69e2e'; // Change to warning color loosely
        }
    }, 15000);

    // 6. Hero Slider Logic (Slow, Sudden with Ken Burns)
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;

    function nextSlide() {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }

    // Auto-advance slides every 15 seconds (Very slow)
    setInterval(nextSlide, 15000);

    // 7. Mobile Menu Toggle
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');
    const navLinksList = document.querySelectorAll('.nav-links a');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (mainNav.classList.contains('active')) {
                icon.classList.remove('ph-list');
                icon.classList.add('ph-x');
            } else {
                icon.classList.remove('ph-x');
                icon.classList.add('ph-list');
            }
        });

        // Close menu when a link is clicked
        navLinksList.forEach(link => {
            link.addEventListener('click', () => {
                mainNav.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                icon.classList.remove('ph-x');
                icon.classList.add('ph-list');
            });
        });
    }

});
