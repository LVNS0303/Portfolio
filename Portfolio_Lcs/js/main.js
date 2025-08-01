// Esperar que o DOM seja completamente carregado
document.addEventListener("DOMContentLoaded", function () {
    // Atualizar o ano atual no footer
    document.getElementById("current-year").textContent = new Date().getFullYear();

    // Menu mobile toggle
    const menuIcon = document.getElementById("menu-icon");
    const navMenu = document.getElementById("nav-menu");

    if (menuIcon) {
        menuIcon.addEventListener("click", function () {
            navMenu.classList.toggle("active");
        });
    }

    // Fechar menu ao clicar em um link
    const navLinks = document.querySelectorAll(".nav-links");
    navLinks.forEach(link => {
        link.addEventListener("click", function () {
            navMenu.classList.remove("active");
        });
    });

    // Animação das barras de progresso
    function animateProgressBars() {
        const progressBars = document.querySelectorAll(".progress-fill");
        progressBars.forEach(bar => {
            const width = bar.getAttribute("data-width");
            bar.style.width = width;
        });
    }

    // Inicializar o carrossel de projetos
    if (typeof $.fn.slick !== "undefined") {
        $(".projects-slider").slick({
            dots: true,
            infinite: true,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 3000,
            pauseOnHover: true,
            responsive: [
                {
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        infinite: true,
                        dots: true
                    }
                }
            ]
        });
    }

    const contactForm = document.getElementById("contact-form");
    const formMessage = document.getElementById("form-message");

    if (contactForm) {
        contactForm.addEventListener("submit", function (e) {
            e.preventDefault();

            formMessage.textContent = "Enviando mensagem...";
            formMessage.className = "form-message";
            formMessage.style.display = "block";

            emailjs.sendForm("service_0trkumi", "template_ivcshni", contactForm)
                .then(() => {
                    formMessage.textContent = "Mensagem enviada com sucesso!";
                    formMessage.className = "form-message success";
                    contactForm.reset();
                    setTimeout(() => formMessage.style.display = "none", 5000);
                }, (error) => {
                    console.error("Erro ao enviar email:", error);
                    formMessage.textContent = "Erro ao enviar. Tente novamente.";
                    formMessage.className = "form-message error";
                });
        });
    }

    // Animação ao scroll
    function checkScroll() {
        const skillsSection = document.getElementById("skills");
        if (skillsSection) {
            const skillsSectionPosition = skillsSection.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;

            if (skillsSectionPosition < screenPosition) {
                animateProgressBars();
            }
        }
    }

    // Verificar posição inicial
    checkScroll();

    // Verificar posição ao scroll
    window.addEventListener("scroll", checkScroll);

    // Smooth scroll para links de âncora
    document.querySelectorAll("a[href^=\"#\"]").forEach(anchor => {
        anchor.addEventListener("click", function (e) {
            e.preventDefault();

            const targetId = this.getAttribute("href");
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Ajuste para a altura da navbar
                    behavior: "smooth"
                });
            }
        });
    });

    // Tooltip corrigido - mais próximo da barra
    const tooltip = document.getElementById("tooltip");
    const progressFills = document.querySelectorAll(".progress-fill");

    progressFills.forEach(fill => {
        fill.addEventListener("mouseenter", function () {
            const tooltipText = this.getAttribute("data-tooltip");
            tooltip.textContent = tooltipText;

            // Obter a posição da barra
            const rect = this.getBoundingClientRect();

            // Posicionar o tooltip logo acima da barra (mais próximo)
            tooltip.style.left = rect.left + (rect.width / 2) + "px";
            tooltip.style.top = (rect.top - 5) + "px"; // Apenas 5px acima da barra

            // Mostrar o tooltip
            tooltip.style.opacity = "1";
            tooltip.style.visibility = "visible";
        });

        fill.addEventListener("mouseleave", function () {
            // Esconder o tooltip
            tooltip.style.opacity = "0";
            tooltip.style.visibility = "hidden";
        });

        fill.addEventListener("mousemove", function (e) {
            // Obter a posição da barra
            const rect = this.getBoundingClientRect();

            // Manter o tooltip horizontalmente alinhado com o cursor, mas verticalmente próximo à barra
            tooltip.style.left = e.clientX + "px";
            tooltip.style.top = (rect.top - 5) + "px"; // Apenas 5px acima da barra
        });
    });

    // Alternância de tema claro/escuro
    const themeToggleBtn = document.getElementById("theme-toggle-btn");
    const body = document.body;

    themeToggleBtn.addEventListener("click", function () {
        body.classList.toggle("dark-mode");

        // Atualizar ícone do botão
        const icon = this.querySelector("i");
        if (body.classList.contains("dark-mode")) {
            icon.className = "fas fa-sun";
        } else {
            icon.className = "fas fa-moon";
        }

        // Salvar preferência no localStorage
        const theme = body.classList.contains("dark-mode") ? "dark" : "light";
        localStorage.setItem("theme", theme);
    });

    // Verificar tema salvo
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        body.classList.add("dark-mode");
        themeToggleBtn.querySelector("i").className = "fas fa-sun";
    }

    // Carrossel de textos automático na Home Section
    const textCarousel = document.getElementById("text-carousel");
    const indicatorsContainer = document.getElementById("carousel-indicators");
    const indicators = indicatorsContainer.querySelectorAll(".indicator");
    let currentSlide = 0;
    const totalSlides = document.querySelectorAll(".carousel-item").length;
    let carouselInterval;

    // Função para mostrar um slide específico
    function showSlide(index) {
        // Esconder todos os slides
        document.querySelectorAll(".carousel-item").forEach(item => {
            item.classList.remove("active");
        });

        // Desativar todos os indicadores
        indicators.forEach(indicator => {
            indicator.classList.remove("active");
        });

        // Mostrar o slide atual
        document.querySelector(`.carousel-item[data-index="${index}"]`).classList.add("active");

        // Ativar o indicador correspondente
        document.querySelector(`.indicator[data-index="${index}"]`).classList.add("active");

        // Atualizar o índice atual
        currentSlide = index;
    }

    // Função para avançar para o próximo slide
    function nextSlide() {
        let nextIndex = currentSlide + 1;
        if (nextIndex >= totalSlides) {
            nextIndex = 0;
        }
        showSlide(nextIndex);
    }

    // Iniciar o carrossel automático
    function startCarousel() {
        carouselInterval = setInterval(nextSlide, 5000); // Muda a cada 5 segundos
    }

    // Parar o carrossel automático
    function stopCarousel() {
        clearInterval(carouselInterval);
    }

    // Adicionar eventos de clique aos indicadores
    indicators.forEach(indicator => {
        indicator.addEventListener("click", function () {
            const index = parseInt(this.getAttribute("data-index"));
            showSlide(index);

            // Reiniciar o intervalo quando o usuário clica em um indicador
            stopCarousel();
            startCarousel();
        });
    });

    // Iniciar o carrossel quando a página carrega
    if (textCarousel) {
        startCarousel();

        // Pausar o carrossel quando o mouse está sobre ele
        textCarousel.addEventListener("mouseenter", stopCarousel);
        textCarousel.addEventListener("mouseleave", startCarousel);
    }
});