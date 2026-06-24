/* LISBOA MOTORS - TV INDOOR
   Sistema com veículos, ofertas e Instagram (foto + vídeo).
   Para editar carros e posts, altere os arquivos em /dados.
*/

const CONFIG = {
    tempoVeiculo: 15000,
    tempoOferta: 9000,
    tempoInstagram: 12000,
    telefone: "(62) 99445-6655",
    avisos: [
        "FAÇA REVISÕES REGULARES EM SEU VEÍCULO",
        "USE SEMPRE CINTO DE SEGURANÇA",
        "NÓS CUIDAMOS DO SEU SONHO!",
        "CONSULTE CONDIÇÕES DE FINANCIAMENTO",
        "AVALIAMOS SEU USADO NA TROCA"
    ]
};

const PASTA_VEICULOS = "assets/veiculos/";
const PASTA_OFERTAS = "assets/ofertas/";
const PASTA_INSTAGRAM = "assets/instagram/";
const $ = (id) => document.getElementById(id);

function normalizarArquivo(nome){
    return String(nome || "").split("/").pop();
}

function temPreco(valor){
    if(!valor) return false;
    return Number(String(valor).replace(/\D/g,"")) > 0;
}

function blocoPreco(v){
    if(temPreco(v.por)){
        return `
            <div class="price-box">
                <div class="price-ribbon">★ OFERTA ESPECIAL</div>
                <div class="from">DE ${v.de || ""}</div>
                <div class="label">POR APENAS</div>
                <div class="price">${v.por}</div>
                <div class="whatsapp-cta">🟢 62 99445-6655</div>
            </div>`;
    }

    return `
        <div class="price-box">
            <div class="price-ribbon">★ CONSULTE</div>
            <div class="label">VALOR SOB CONSULTA</div>
            <div class="price-consulte">CHAME NO<br>WHATSAPP</div>
            <div class="whatsapp-cta">🟢 62 99445-6655</div>
        </div>`;
}

function templateVeiculo(v){
    const imagem = normalizarArquivo(v.imagem);
    const specs = Array.isArray(v.specs) ? v.specs : [];

    return `
        <div class="vehicle-card">
            <img src="${PASTA_VEICULOS}${imagem}" alt="${v.modelo || "Veículo"}" onerror="this.style.display='none'">
            <div class="vehicle-info">
                <div class="brand-name">${v.marca || ""}</div>
                <div class="model">${v.modelo || ""}</div>
                <div class="version">${v.versao || ""}</div>
                <div class="specs">${specs.map(i=>`<div><span>▸</span>${i}</div>`).join("")}</div>
            </div>
            ${blocoPreco(v)}
        </div>`;
}

function templateOferta(o){
    const imagem = normalizarArquivo(o.imagem || o.arquivo);
    const specs = Array.isArray(o.specs) ? o.specs : [];

    return `
        <div class="offer-card">
            <img src="${PASTA_OFERTAS}${imagem}" alt="${o.modelo || "Oferta"}" onerror="this.style.display='none'">
            <div class="offer-text">
                <h3>${o.marca || ""}<br>${o.modelo || ""}</h3>
                <h4>${o.versao || ""}</h4>
                <ul>${specs.map(i=>`<li>• ${i}</li>`).join("")}</ul>
                <div class="installment">${o.parcela ? `ENTRADA + 48X DE<strong>${o.parcela}</strong>` : `<strong>CONSULTE</strong>`}</div>
            </div>
        </div>`;
}

function templateInstagram(post){
    const arquivo = normalizarArquivo(post.arquivo || post.imagem);
    const titulo = post.titulo || "@lisboamotors";
    const caminho = PASTA_INSTAGRAM + arquivo;
    const ext = arquivo.split(".").pop().toLowerCase();
    const video = post.tipo === "video" || ["mp4","webm","mov"].includes(ext);

    if(video){
        return `
            <div class="instagram-card">
                <video autoplay muted loop playsinline preload="metadata">
                    <source src="${caminho}" type="video/mp4">
                </video>
                <div class="instagram-caption">${titulo}</div>
            </div>`;
    }

    return `
        <div class="instagram-card">
            <img src="${caminho}" alt="${titulo}" onerror="this.style.display='none'">
            <div class="instagram-caption">${titulo}</div>
        </div>`;
}

function criarSlides(containerId, lista, classe, template){
    const container = $(containerId);
    if(!container || !Array.isArray(lista) || !lista.length) return [];

    const slides = lista.map((item,index)=>{
        const slide = document.createElement("div");
        slide.className = classe + (index === 0 ? " active" : "");
        slide.innerHTML = template(item);
        return slide;
    });

    if(containerId === "vehicleArea"){
        const contador = $("slideCounter");
        slides.forEach(slide => container.insertBefore(slide, contador));
        if(contador) contador.innerText = `1/${slides.length}`;
    }else{
        slides.forEach(slide => container.appendChild(slide));
    }

    return slides;
}

function controlarVideos(slides, atual){
    slides.forEach((slide, index)=>{
        slide.querySelectorAll("video").forEach(video=>{
            if(index === atual){
                video.play().catch(()=>{});
            }else{
                video.pause();
                video.currentTime = 0;
            }
        });
    });
}

function rodarSlides(slides, tempo, atualizarContador = false){
    if(slides.length <= 1){
        controlarVideos(slides, 0);
        return;
    }

    let atual = 0;
    const contador = $("slideCounter");
    controlarVideos(slides, atual);

    setInterval(()=>{
        slides[atual].classList.remove("active");
        atual = (atual + 1) % slides.length;
        slides[atual].classList.add("active");
        controlarVideos(slides, atual);

        if(atualizarContador && contador){
            contador.innerText = `${atual + 1}/${slides.length}`;
        }
    }, tempo);
}

function carregarTextos(){
    const ticker = $("tickerText");
    const phone = $("phone");
    if(ticker) ticker.innerText = CONFIG.avisos.join("  •  ");
    if(phone) phone.innerText = CONFIG.telefone;
}

function ajustarTela(){
    const overlay = document.querySelector(".overlay");
    if(!overlay) return;

    const escala = Math.max(
        window.innerWidth / 1920,
        window.innerHeight / 1080
    );

    overlay.style.transform = `translate(-50%,-50%) scale(${escala})`;
}

function iniciar(){
    carregarTextos();

    const slidesVeiculos = criarSlides("vehicleArea", window.VEICULOS || [], "vehicle-slide", templateVeiculo);
    const slidesOfertas = criarSlides("offerArea", window.OFERTAS || [], "offer-slide", templateOferta);
    const slidesInstagram = criarSlides("instagramArea", window.INSTAGRAM || [], "instagram-slide", templateInstagram);

    rodarSlides(slidesVeiculos, CONFIG.tempoVeiculo, true);
    rodarSlides(slidesOfertas, CONFIG.tempoOferta);
    rodarSlides(slidesInstagram, CONFIG.tempoInstagram);

    ajustarTela();
    window.addEventListener("resize", ajustarTela);

    document.addEventListener("click", ()=>{
        if(document.documentElement.requestFullscreen){
            document.documentElement.requestFullscreen();
        }
    }, {once:true});
}

document.addEventListener("DOMContentLoaded", iniciar);
