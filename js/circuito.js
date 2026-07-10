document.addEventListener("DOMContentLoaded", () => {
    const workspace = document.getElementById("workspace");
    const feedback = document.getElementById("sistema-feedback");

    // Variáveis lógicas do Circuito Elétrico
    let disjuntorFechado = false;
    let motorLigado = false;

    // Elementos dos componentes para atualizar visualmente
    const compQ1 = document.getElementById("comp-q1");
    const compMotor = document.getElementById("comp-motor");

    // Variáveis de controle do Drag and Drop
    let isDragging = false;
    let currentTarget = null;
    let offsetX = 0, offsetY = 0;
    let startX = 0, startY = 0;

    // --- EVENTOS DO PONTEIRO (MOUSE E TOUCH JUNTOS) ---
    workspace.addEventListener("pointerdown", (e) => {
        const comp = e.target.closest(".draggable-comp");
        if (comp) {
            isDragging = true;
            currentTarget = comp;
            
            // Registra onde o clique começou para diferenciar de um clique simples
            startX = e.clientX;
            startY = e.clientY;

            // Ativa a captura do ponteiro (evita bugs ao arrastar rápido demais)
            comp.setPointerCapture(e.pointerId);

            const rect = comp.getBoundingClientRect();
            const wRect = workspace.getBoundingClientRect();
            
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
        }
    });

    workspace.addEventListener("pointermove", (e) => {
        if (!isDragging || !currentTarget) return;

        const wRect = workspace.getBoundingClientRect();
        
        // Calcula a nova posição dentro do quadradinho do painel
        let x = e.clientX - wRect.left - offsetX;
        let y = e.clientY - wRect.top - offsetY;

        // Limita o componente dentro das bordas da grade
        x = Math.max(0, Math.min(x, wRect.width - currentTarget.offsetWidth));
        y = Math.max(0, Math.min(y, wRect.height - currentTarget.offsetHeight));

        currentTarget.style.left = `${x}px`;
        currentTarget.style.top = `${y}px`;
    });

    workspace.addEventListener("pointerup", (e) => {
        if (!isDragging || !currentTarget) return;

        currentTarget.releasePointerCapture(e.pointerId);

        // Calcula a distância movida
        const diffX = Math.abs(e.clientX - startX);
        const diffY = Math.abs(e.clientY - startY);

        // Se moveu menos que 5 pixels, o usuário não queria arrastar, queria APENAS CLICAR!
        if (diffX < 5 && diffY < 5) {
            processarCliqueComponente(currentTarget.id);
        }

        isDragging = false;
        currentTarget = null;
    });

    // --- LÓGICA INTERATIVA DOS COMPONENTES ---
    function processarCliqueComponente(id) {
        if (id === "comp-q1") {
            // Lógica do Disjuntor
            disjuntorFechado = !disjuntorFechado;
            const badge = compQ1.querySelector(".status-badge");
            
            if (disjuntorFechado) {
                badge.textContent = "FECHADO";
                badge.className = "status-badge fechado";
                feedback.textContent = "Circuito energizado! Pronto para ligar no botão S1.";
            } else {
                badge.textContent = "ABERTO";
                badge.className = "status-badge aberto";
                // Se abrir o disjuntor com o motor rodando, derruba a energia de tudo
                motorLigado = false;
                feedback.textContent = "Disjuntor aberto. Circuito desarmado.";
            }
        } 
        else if (id === "comp-s1") {
            // Lógica do Botão Verde (Liga)
            if (disjuntorFechado) {
                motorLigado = true;
                feedback.textContent = "Contator K1 acionado. Motor girando perfeitamente!";
            } else {
                feedback.textContent = "❌ Impossível ligar: O disjuntor Q1 está aberto e o circuito está sem energia!";
            }
        } 
        else if (id === "comp-s0") {
            // Lógica do Botão Vermelho (Desliga)
            motorLigado = false;
            if (disjuntorFechado) {
                feedback.textContent = "Sistema desligado via botoeira S0.";
            }
        }

        atualizarSimulacao();
    }

    // Renderiza as mudanças de estado na tela
    function atualizarSimulacao() {
        if (motorLigado && disjuntorFechado) {
            compMotor.classList.add("ligado");
        } else {
            compMotor.classList.remove("ligado");
            motorLigado = false; // Força segurança lógica
        }
    }
});