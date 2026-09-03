document.addEventListener('DOMContentLoaded', () => {

    // =========================================
    // 1. MENU HAMBÚRGUER (MOBILE)
    // =========================================
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const navMenu = document.getElementById('navMenu');

    if (hamburgerBtn && navMenu) {
        hamburgerBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    // =========================================
    // 2. SISTEMA DE DRAG & DROP (TOUCH + MOUSE)
    // =========================================
    const workspace = document.getElementById('workspace');
    const draggables = document.querySelectorAll('.draggable-comp');

    if (workspace && draggables.length > 0) {
        draggables.forEach(comp => {
            const handle = comp.querySelector('.drag-handle') || comp;
            let isDragging = false;
            let startX, startY, initialLeft, initialTop;

            handle.addEventListener('pointerdown', (e) => {
                // Evita arrastar ao clicar diretamente nos botões/badges interativos
                if (e.target.classList.contains('btn-simulado') || e.target.classList.contains('status-badge')) {
                    return;
                }

                isDragging = true;
                handle.setPointerCapture(e.pointerId);

                startX = e.clientX;
                startY = e.clientY;
                initialLeft = comp.offsetLeft;
                initialTop = comp.offsetTop;

                comp.style.zIndex = 1000;
            });

            handle.addEventListener('pointermove', (e) => {
                if (!isDragging) return;

                const dx = e.clientX - startX;
                const dy = e.clientY - startY;

                let newLeft = initialLeft + dx;
                let newTop = initialTop + dy;

                // Mantém os componentes dentro da área limite do workspace
                const maxLeft = workspace.clientWidth - comp.offsetWidth;
                const maxTop = workspace.clientHeight - comp.offsetHeight;

                comp.style.left = `${Math.max(0, Math.min(newLeft, maxLeft))}px`;
                comp.style.top = `${Math.max(0, Math.min(newTop, maxTop))}px`;
            });

            const stopDrag = (e) => {
                if (isDragging) {
                    isDragging = false;
                    try {
                        handle.releasePointerCapture(e.pointerId);
                    } catch (err) {}
                    comp.style.zIndex = 10;
                }
            };

            handle.addEventListener('pointerup', stopDrag);
            handle.addEventListener('pointercancel', stopDrag);
        });
    }

    // =========================================
    // 3. LÓGICA DO SIMULADOR DE COMANDOS
    // =========================================
    let q1Fechado = false;
    let k1Ativo = false;
    let k2Ativo = false;
    let emSimulacao = true;

    const btnPlay = document.getElementById('btn-play');
    const btnStop = document.getElementById('btn-stop');
    const badgeQ1 = document.getElementById('badge-q1');
    const compQ1 = document.getElementById('comp-q1');
    const btnS0 = document.getElementById('btn-s0');
    const btnS1 = document.getElementById('btn-s1');
    const btnS2 = document.getElementById('btn-s2');
    const lampH1 = document.getElementById('lamp-h1');
    const lampH2 = document.getElementById('lamp-h2');
    const compMotor = document.getElementById('comp-motor');
    const feedback = document.getElementById('sistema-feedback');

    function atualizarEstado() {
        // Estado do Disjuntor Q1
        if (q1Fechado) {
            if (badgeQ1) {
                badgeQ1.textContent = "FECHADO";
                badgeQ1.classList.remove('aberto');
                badgeQ1.classList.add('fechado');
            }
        } else {
            if (badgeQ1) {
                badgeQ1.textContent = "1 - 2 (ABERTO)";
                badgeQ1.classList.remove('fechado');
                badgeQ1.classList.add('aberto');
            }
            k1Ativo = false;
            k2Ativo = false;
        }

        // Estado dos Contatores, Lâmpadas e Motor
        if (k1Ativo) {
            if (lampH1) lampH1.classList.add('ativa');
            if (lampH2) lampH2.classList.remove('ativa');
            if (compMotor) {
                compMotor.classList.add('ligado-horario');
                compMotor.classList.remove('ligado-anti-horario');
            }
            if (feedback) feedback.textContent = "Motor girando no sentido HORÁRIO (K1 / H1 ativo).";
        } else if (k2Ativo) {
            if (lampH2) lampH2.classList.add('ativa');
            if (lampH1) lampH1.classList.remove('ativa');
            if (compMotor) {
                compMotor.classList.add('ligado-anti-horario');
                compMotor.classList.remove('ligado-horario');
            }
            if (feedback) feedback.textContent = "Motor girando no sentido ANTI-HORÁRIO (K2 / H2 ativo).";
        } else {
            if (lampH1) lampH1.classList.remove('ativa');
            if (lampH2) lampH2.classList.remove('ativa');
            if (compMotor) compMotor.classList.remove('ligado-horario', 'ligado-anti-horario');

            if (feedback) {
                if (q1Fechado) {
                    feedback.textContent = "Circuito Energizado! Pressione -S1 (Horário) ou -S2 (Anti-Horário).";
                } else {
                    feedback.textContent = "Aguardando fechamento de -Q1 para energizar a linha 24V/380V...";
                }
            }
        }
    }

    // Toggle no Disjuntor -Q1
    if (compQ1) {
        compQ1.addEventListener('click', (e) => {
            if (e.target.closest('#badge-q1') || e.target.closest('.disjuntor-corpo')) {
                if (!emSimulacao) return;
                q1Fechado = !q1Fechado;
                atualizarEstado();
            }
        });
    }

    // Botão -S1 (Liga Horário)
    if (btnS1) {
        btnS1.addEventListener('click', () => {
            if (!emSimulacao || !q1Fechado) return;
            k1Ativo = true;
            k2Ativo = false; // Intertravamento
            atualizarEstado();
        });
    }

    // Botão -S2 (Liga Anti-Horário)
    if (btnS2) {
        btnS2.addEventListener('click', () => {
            if (!emSimulacao || !q1Fechado) return;
            k2Ativo = true;
            k1Ativo = false; // Intertravamento
            atualizarEstado();
        });
    }

    // Botão -S0 (Desliga)
    if (btnS0) {
        btnS0.addEventListener('click', () => {
            if (!emSimulacao) return;
            k1Ativo = false;
            k2Ativo = false;
            atualizarEstado();
        });
    }

    // Controles da Toolbar (Play / Stop)
    if (btnPlay) {
        btnPlay.addEventListener('click', () => {
            emSimulacao = true;
            if (feedback) feedback.textContent = "Simulação Ativa. Ligue o Disjuntor -Q1.";
        });
    }

    if (btnStop) {
        btnStop.addEventListener('click', () => {
            emSimulacao = false;
            q1Fechado = false;
            k1Ativo = false;
            k2Ativo = false;
            atualizarEstado();
            if (feedback) feedback.textContent = "Simulação Parada. Pressione Simular para reiniciar.";
        });
    }
});