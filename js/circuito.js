document.addEventListener("DOMContentLoaded", () => {
    let simulacaoAtiva = false;
    let disjuntorFechado = false;
    let sentidoRotacao = "desligado"; 

    const workspace = document.getElementById("workspace");
    const feedback = document.getElementById("sistema-feedback");
    const btnPlay = document.getElementById("btn-play");
    const btnStop = document.getElementById("btn-stop");
    
    const compQ1 = document.getElementById("comp-q1");
    const badgeQ1 = document.getElementById("badge-q1");
    const compS0 = document.getElementById("comp-s0");
    const compS1 = document.getElementById("comp-s1");
    const compS2 = document.getElementById("comp-s2");
    
    const lampH1 = document.getElementById("lamp-h1");
    const lampH2 = document.getElementById("lamp-h2");
    const compMotor = document.getElementById("comp-motor");

    function atualizarSimulacao() {
        compMotor.classList.remove("ligado-horario", "ligado-anti-horario");
        if (lampH1) lampH1.classList.remove("ativa");
        if (lampH2) lampH2.classList.remove("ativa");

        if (!simulacaoAtiva) {
            feedback.textContent = "Simulação pausada. Clique em ▶ Simular no topo para energizar a bancada.";
            return;
        }

        if (!disjuntorFechado) {
            sentidoRotacao = "desligado";
            feedback.textContent = "Comando desenergizado. Clique no Disjuntor -Q1 para fechar o circuito.";
            return;
        }

        if (sentidoRotacao === "horario") {
            compMotor.classList.add("ligado-horario");
            if (lampH1) lampH1.classList.add("ativa");
            feedback.textContent = "Motor M1 girando no sentido HORÁRIO (Contator K1 e Lâmpada H1 ativos).";
        } else if (sentidoRotacao === "anti-horario") {
            compMotor.classList.add("ligado-anti-horario");
            if (lampH2) lampH2.classList.add("ativa");
            feedback.textContent = "Motor M1 girando no sentido ANTI-HORÁRIO (Contator K2 e Lâmpada H2 ativos).";
        } else {
            feedback.textContent = "Circuito energizado e pronto. Pressione S1 (↻ Horário) ou S2 (↺ Anti-Horário).";
        }
    }

    btnPlay.addEventListener("click", () => {
        simulacaoAtiva = true;
        atualizarSimulacao();
    });

    btnStop.addEventListener("click", () => {
        simulacaoAtiva = false;
        sentidoRotacao = "desligado";
        atualizarSimulacao();
    });


    compQ1.addEventListener("click", () => {
        if (isDragging) return;
        disjuntorFechado = !disjuntorFechado;
        
        if (disjuntorFechado) {
            badgeQ1.textContent = "FECHADO";
            badgeQ1.classList.remove("aberto");
            badgeQ1.classList.add("fechado");
        } else {
            badgeQ1.textContent = "1 - 2";
            badgeQ1.classList.remove("fechado");
            badgeQ1.classList.add("aberto");
        }
        atualizarSimulacao();
    });

    compS0.addEventListener("click", () => {
        if (isDragging) return;
        sentidoRotacao = "desligado";
        feedback.textContent = "Sistema desligado via botoeira S0.";
        atualizarSimulacao();
    });

    compS1.addEventListener("click", () => {
        if (isDragging) return;
        if (!simulacaoAtiva || !disjuntorFechado) {
            atualizarSimulacao();
            return;
        }
        if (sentidoRotacao === "anti-horario") {
            feedback.textContent = "INTERTRAVAMENTO: Pressione S0 para parar antes de inverter o sentido!";
            return;
        }
        sentidoRotacao = "horario";
        atualizarSimulacao();
    });

    compS2.addEventListener("click", () => {
        if (isDragging) return;
        if (!simulacaoAtiva || !disjuntorFechado) {
            atualizarSimulacao();
            return;
        }
        if (sentidoRotacao === "horario") {
            feedback.textContent = "INTERTRAVAMENTO: Pressione S0 para parar antes de inverter o sentido!";
            return;
        }
        sentidoRotacao = "anti-horario";
        atualizarSimulacao();
    });

    let isDragging = false;
    let currentTarget = null;
    let offsetX = 0, offsetY = 0;
    let startX = 0, startY = 0;

    workspace.addEventListener("pointerdown", (e) => {
        const comp = e.target.closest(".draggable-comp");
        if (comp) {
            isDragging = false;
            currentTarget = comp;
            startX = e.clientX;
            startY = e.clientY;

            comp.setPointerCapture(e.pointerId);
            const rect = comp.getBoundingClientRect();

            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
        }
    });

    workspace.addEventListener("pointermove", (e) => {
        if (!currentTarget) return;

        if (Math.hypot(e.clientX - startX, e.clientY - startY) > 5) {
            isDragging = true;
        }

        const wRect = workspace.getBoundingClientRect();
        let x = e.clientX - wRect.left - offsetX;
        let y = e.clientY - wRect.top - offsetY;

        x = Math.max(0, Math.min(x, wRect.width - currentTarget.offsetWidth));
        y = Math.max(0, Math.min(y, wRect.height - currentTarget.offsetHeight));

        currentTarget.style.left = `${x}px`;
        currentTarget.style.top = `${y}px`;
    });

    workspace.addEventListener("pointerup", () => {
        if (currentTarget) {
            currentTarget = null;
            setTimeout(() => { isDragging = false; }, 50);
        }
    });
});