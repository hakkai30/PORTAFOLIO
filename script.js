document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. BOOT SEQUENCE & CHARGING BAR ---
    const bootLines = [
        "System: Robin_OS v2.0",
        "Loading DAW/ASIR modules... [OK]",
        "Validating 6 OpenWebinars Certifications... [OK]",
        "Checking database connectivity... [OK]",
    ];

    const bootScreen = document.getElementById('boot-screen');
    const bootContainer = document.getElementById('boot-text-container');
    const progressWrapper = document.getElementById('boot-progress-wrapper');
    const progressBar = document.getElementById('boot-progress-bar');
    const progressPercent = document.getElementById('boot-progress-percent');

    let i = 0;
    
    // Step A: Print lines
    function runBoot() {
        if (i < bootLines.length) {
            const p = document.createElement('p');
            p.className = 'boot-line m-0';
            p.innerHTML = `> ${bootLines[i]}`;
            bootContainer.appendChild(p);
            i++;
            setTimeout(runBoot, 300);
        } else {
            // Step B: Show and run charging bar
            progressWrapper.style.display = 'block';
            startProgress();
        }
    }

    // Step C: Charging Bar Logic (█ and ░)
    function startProgress() {
        let p = 0;
        const interval = setInterval(() => {
            p += Math.floor(Math.random() * 8) + 2; // Increases by 2-9% each tick
            if (p >= 100) {
                p = 100;
                clearInterval(interval);
                setTimeout(endBoot, 400); // Wait half a second before fading out
            }
            
            // Calculate blocks
            const blocks = Math.floor(p / 5); // 20 blocks total
            progressBar.textContent = "█".repeat(blocks) + "░".repeat(20 - blocks);
            progressPercent.textContent = `${p}%`;
            
        }, 100); // Speed of the bar
    }

    // Step D: Destroy screen and start typewriter
    function endBoot() {
        bootScreen.style.opacity = '0'; // Fade out
        setTimeout(() => {
            bootScreen.remove(); // DELETE from HTML so it doesn't block clicks!
            initTypewriter();
        }, 500);
    }
    
    // Start everything
    runBoot();

    // --- 2. TYPEWRITER EFFECT (SAFE FALLBACK) ---
    function initTypewriter() {
        const el = document.getElementById('typewriter-text');
        const finalContent = "Highly motivated Junior Web Developer and current student of Web Application Development. I possess a strong technical foundation in C#, .NET Framework, and SQL databases. My background in customer service has equipped me with excellent communication and problem-solving skills, which I now apply to building efficient software solutions. I am eager to contribute to a professional development team while continuing to refine my skills in JavaScript, PHP, and Version Control (Git).";
        
        el.textContent = ""; 
        let charIndex = 0;

        function type() {
            if (charIndex < finalContent.length) {
                el.textContent += finalContent.charAt(charIndex);
                charIndex++;
                setTimeout(type, 15);
            }
        }
        type();
    }

    // --- 3. SCROLL REVEAL (Safe Observer) ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // --- 4. FORMULARIO DE CONTACTO (AJAX Fetch) ---
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Evitamos que la página se recargue

            // Guardamos el texto original y cambiamos a estado de "Cargando"
            const originalText = submitBtn.textContent;
            submitBtn.textContent = "EJECUTANDO_ENVIO... [ESPERE]";
            submitBtn.disabled = true; // Bloqueamos el botón para evitar doble envío

            // Recogemos los datos del formulario
            const formData = new FormData(contactForm);

            // Enviamos los datos a FormSubmit usando Fetch
            fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json' // Pedimos respuesta en JSON para no cambiar de página
                }
            })
            .then(response => {
                if (response.ok) {
                    // Éxito: Cambiamos el mensaje y limpiamos el formulario
                    submitBtn.textContent = "PAYLOAD_ENVIADO [OK]";
                    contactForm.reset(); 
                    
                    // Restauramos el botón después de 4 segundos
                    setTimeout(() => {
                        submitBtn.textContent = originalText;
                        submitBtn.disabled = false;
                    }, 4000);
                } else {
                    throw new Error('Error de red al enviar el formulario.');
                }
            })
            .catch(error => {
                // Error: Avisamos al usuario
                console.error('Error:', error);
                submitBtn.textContent = "ERROR_DE_CONEXION [RETRY]";
                submitBtn.style.backgroundColor = "red";
                submitBtn.style.color = "white";
                
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.backgroundColor = ""; // Restauramos el color original
                    submitBtn.style.color = "";
                }, 4000);
            });
        });
    }
});