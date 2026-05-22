// =============================
// FUNCIONES FLECHA
// =============================
// Todas las funciones principales de la galería están declaradas como funciones flecha:
// Ejemplo:
// const miFuncion = (param) => { ... }
// Las funciones flecha NO tienen su propio 'this', por eso son ideales para callbacks y funciones globales.

// =============================
// CLASES
// =============================
// Las imágenes se crean como instancias de la clase Fotos (ver claseFotos.js):
// class Fotos {
//   constructor(foto, title, descripcion, caracteristicas) { ... }
// }
// Así cada imagen es un objeto con esas propiedades.

// =============================
// ESCUCHADORES DE EVENTOS
// =============================
// Se usan funciones flecha como manejadores de eventos:
// btn.addEventListener('click', (e) => { ... });
// Esto permite asociar acciones a los botones de la galería (siguiente, anterior, autoplay, etc).
// --- Autoplay Carrusel con función temporizador ---
let autoplay = false;
let temporizadorId = null;

const temporizador = (callback, intervalo) => {
	return setInterval(callback, intervalo);
}

const detenerTemporizador = (id) => {
	clearInterval(id);
};


const setAutoplayState = (isPlaying) => {
	autoplay = isPlaying;
	// Cambia el icono tanto en desktop como en móvil
	const playShape = document.getElementById('playShape');
	const playShapeMobile = document.getElementById('playShapeMobileHeader');
	if (autoplay) {
		// Cambia a icono de pausa
		if (playShape) playShape.setAttribute('points', '12,10 20,10 20,22 12,22');
		if (playShapeMobile) playShapeMobile.setAttribute('points', '12,10 20,10 20,22 12,22');
		temporizadorId = temporizador(() => {
			// Avanza la imagen directamente, sin depender del botón
			currentIndex = (currentIndex + 1) % images.length;
			renderImage(currentIndex);
			renderSidebarList();
		}, 3000); // Cambia cada 3 segundos
	} else {
		// Cambia a icono de play
		if (playShape) playShape.setAttribute('points', '13,10 25,16 13,22');
		if (playShapeMobile) playShapeMobile.setAttribute('points', '13,10 25,16 13,22');
		detenerTemporizador(temporizadorId);
	}
}

document.addEventListener('DOMContentLoaded', () => {
	const autoplayBtn = document.getElementById('autoplayBtn');
	if (autoplayBtn) {
		autoplayBtn.addEventListener('click', () => {
			setAutoplayState(!autoplay);
		});
	}
	// AUTOPLAY MÓVIL
	const autoplayBtnMobile = document.getElementById('autoplayBtnMobileHeader');
	if (autoplayBtnMobile) {
		autoplayBtnMobile.addEventListener('click', () => {
			setAutoplayState(!autoplay);
		});
	}
});

let currentIndex = 0;

const renderImage = (index) => {
	const img = images[index];
	document.getElementById('mainImage').src = img.foto;
	document.getElementById('imageTitle').textContent = img.title;
	document.getElementById('imageDesc').textContent = img.descripcion;
	const list = document.getElementById('caracteristicasList');
	list.innerHTML = '';
	img.caracteristicas.forEach(carac => {
		const li = document.createElement('li');
		li.textContent = carac;
		list.appendChild(li);
	});
	document.getElementById('currentIndex').textContent = index + 1;
	document.getElementById('totalImages').textContent = images.length;
};




const renderSidebarList = () => {
	const sidebarList = document.getElementById('sidebarList');
	if (!sidebarList) {
		console.warn('No se encontró el elemento sidebarList');
		return;
	}
	sidebarList.innerHTML = '';
	if (!Array.isArray(images) || images.length === 0) {
		const li = document.createElement('li');
		li.textContent = 'No hay imágenes.';
		sidebarList.appendChild(li);
		return;
	}
	   images.forEach((img, idx) => {
		   const li = document.createElement('li');
		   li.className = 'flex items-center gap-2 cursor-pointer hover:text-yellow-300 transition-colors p-1 rounded';
		   if (idx === currentIndex) {
			   li.classList.add('font-bold', 'text-yellow-300', 'bg-purple-900', 'shadow');
		   }

		   const thumb = document.createElement('img');
		   thumb.src = img.foto;
		   thumb.alt = img.title;
		   thumb.className = 'w-10 h-10 object-cover rounded shadow-sm border border-purple-800';

		   const span = document.createElement('span');
		   span.textContent = img.title;

		   li.appendChild(thumb);
		   li.appendChild(span);

		   li.addEventListener('click', () => {
			   currentIndex = idx;
			   renderImage(currentIndex);
			   renderSidebarList();
		   });
		   sidebarList.appendChild(li);
	   });
	console.log('Lista aside generada:', images.map(i => i.title));
}

document.addEventListener('DOMContentLoaded', () => {
	renderImage(currentIndex);
	renderSidebarList();
	document.getElementById('prevBtn').addEventListener('click', () => {
		currentIndex = (currentIndex - 1 + images.length) % images.length;
		renderImage(currentIndex);
		renderSidebarList();
	});
	document.getElementById('nextBtn').addEventListener('click', () => {
		currentIndex = (currentIndex + 1) % images.length;
		renderImage(currentIndex);
		renderSidebarList();
	});

	// --- Mostrar/Ocultar sidebar en móvil ---
	const sidebarMenu = document.getElementById('sidebarMenu');
	const openSidebarBtn = document.getElementById('openSidebarBtn');
	const closeSidebarBtn = document.getElementById('closeSidebarBtn');

	if (sidebarMenu && openSidebarBtn && closeSidebarBtn) {
		openSidebarBtn.addEventListener('click', () => {
			sidebarMenu.classList.remove('-translate-x-full');
		});
		closeSidebarBtn.addEventListener('click', () => {
			sidebarMenu.classList.add('-translate-x-full');
		});
		// Opcional: cerrar sidebar al hacer click fuera en móvil
		document.addEventListener('click', (e) => {
			if (window.innerWidth < 1024 && !sidebarMenu.contains(e.target) && !openSidebarBtn.contains(e.target)) {
				sidebarMenu.classList.add('-translate-x-full');
			}
		});
	}
});