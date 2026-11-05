// Textos generales
window.AO = window.AO || {};

AO.textos = {
  marca: { logo: 'assets/marca/logo-al-objetivo.png', alt: 'Al Objetivo', ancho: 600, alto: 138 },
  meta: {
    titulo: 'Portafolio · Elizabeth Castillo · Al Objetivo',
    descripcion: 'Casos reales de estrategia, contenido, email marketing y automatización para pymes y negocios que necesitan resultados medibles. Portafolio de Al Objetivo.'
  },
  hero: {
    eyebrow: 'Portafolio · Elizabeth Castillo',
    titular: 'Cada marca tiene un objetivo.',
    titularEnfasis: 'Aquí está la prueba de que sé llevarla al centro.',
    subtitular: 'Estrategia, contenido y automatización con dirección, pensados para negocios que no tienen tiempo que perder. Esto es lo que ya he logrado con Al Objetivo.',
    cta: { texto: 'Ver el recorrido', url: null }, // lanza el recorrido guiado
    // punta = posición de la punta de la flecha dentro de la imagen (fracción de ancho y alto)
    ilustracion: { src: 'assets/marca/arquera-navy.png', src2x: 'assets/marca/arquera-navy@2x.png', alt: 'Ilustración de una arquera tensando el arco', ancho: 600, alto: 814, punta: [0.048, 0.433] }
  },
  sectores: {
    eyebrow: 'Sectores donde ya he dado en el blanco',
    instruccion: 'Toca un sector para ver las marcas de algunos de los clientes con los que he trabajado con Al Objetivo.'
  },
  arco: {
    eyebrow: '01 — El arco',
    titulo: 'Lo que da precisión a cada disparo',
    parrafos: [
      'Antes de que una flecha llegue a su blanco, hay un arco bien tensado. Así veo el marketing: con la tensión justa entre estrategia y ejecución, descartando las flechas torcidas.',
      'Combino storytelling, SEO, email marketing, contenidos, automatizaciones y CRM con una mirada que analiza resultados con el mismo rigor con el que diseño la estrategia.'
    ],
    // Trayectoria previa: etiqueta y frase sobre la tira de logos (AO.trayectoriaLogos)
    trayectoria: {
      etiqueta: 'Antes de la diana',
      frase: 'Antes de fundar Al Objetivo trabajé en estas empresas, y algunas han sido también mis clientes. Ahí se tensó el arco con el que hoy apunto.'
    },
    foto: { src: 'assets/fotos/elizabeth.jpg', alt: 'Elizabeth Castillo, Al Objetivo', ancho: 1064, alto: 1600 },
    // Vídeo "Quién soy" (YouTube oculto). Mientras videoId sea null se muestra "Disponible muy pronto".
    video: { titulo: 'Quién soy', proveedor: 'youtube', videoId: 'a1WxQii2BSQ', poster: 'assets/arco/portada-video-quien-soy.webp', descripcion: '', textura: 'assets/marca/arquera-blanco.png', alt: 'Vídeo de presentación de Elizabeth Castillo' }
  },
  tiradas: {
    eyebrow: '02 — Tiradas certeras',
    titulo: 'Tres tiradas, tres blancos distintos',
    subtitulo: 'La estrategia cambia según el negocio. La precisión, no.'
  },
  carcaj: {
    eyebrow: '03 — El carcaj',
    titulo: 'Todas las flechas, listas para usarse',
    subtitulo: 'Toca cualquier pieza para verla en detalle.'
  },
  contacto: {
    eyebrow: '04 — Da en tu objetivo',
    titulo: 'Ahora te toca a ti apuntar',
    subtitulo: 'Hablemos de tu proyecto y construyamos la estrategia que te lleve directo al centro.',
    ctaPrincipal: { texto: 'Hablemos', url: 'mailto:info@alobjetivo.com' },
    ctaSecundario: { texto: 'Ver alobjetivo.com', url: 'https://alobjetivo.com/' }  },
  pie: {
    enlaces: [
      { texto: 'LinkedIn', url: 'https://www.linkedin.com/in/elizabethcastillot/' },
      { texto: 'Pódcast Al Objetivo', url: 'https://youtube.com/@alobjetivo' },
      { texto: 'alobjetivo.com', url: 'https://alobjetivo.com' },
      { texto: 'info@alobjetivo.com', url: 'mailto:info@alobjetivo.com' }
    ],
    copy: '© Al Objetivo'
  },
  // Textos de interfaz (provisionales)
  interfaz: {
    saltar: 'Saltar al contenido',
    secciones: 'Secciones',
    cerrar: 'Cerrar',
    todos: 'Todos',
    todo: 'Todo',
    ejemplo: 'Ejemplo',
    borrador: 'Caso de éxito',
    verVideo: 'Ver vídeo',
    tirada: 'Tirada {n}',
    partesCaso: ['El reto', 'El enfoque', 'La ejecución', 'Dónde cayó la flecha'],
    partesCasoCortas: ['Reto', 'Enfoque', 'Ejecución', 'Dónde cayó la flecha'],
    partesCasoIndice: 'Partes del caso',
    verTirada: 'Ver el caso',
    resultadoBarra: 'Resultado',
    ampliarCorto: 'Ampliar',
    volverCaso: 'Volver al caso',
    reproducir: 'Reproducir el vídeo {titulo}',
    logosDesplazar: 'Empresas de mi trayectoria. Desliza o usa las flechas del teclado para ver más',
    logosAnterior: 'Ver empresas anteriores',
    logosSiguiente: 'Ver más empresas',
    verEnGrande: 'Ver en grande',
    video: 'Vídeo',
    posicion: '{n} de {m}',
    pieFoto: 'Elizabeth Castillo · Fundadora de Al Objetivo',
    ampliar: 'Ampliar infografía',
    ampliarImagen: 'Ampliar imagen',
    zoomMas: 'Acercar',
    zoomMenos: 'Ajustar',
    proximamente: 'Disponible muy pronto',
    anterior: 'Imagen anterior',
    siguiente: 'Imagen siguiente',
    nombreSectores: 'Sectores y marcas',
    recorrido: 'Vamos por la {n} de {m} · {nombre}',
    parar: 'Me quedo aquí',
    marcadores: { foto: 'Foto pendiente', imagen: 'Captura pendiente', infografia: 'Infografía pendiente', video: 'Vídeo pendiente' },
    avisoMarcas: '{n} marcas en {sector}',
    avisoMarcasTodas: 'Todas las marcas',
    avisoPiezas: '{n} piezas en {categoria}',
    avisoPiezasTodas: 'Todas las piezas'
  }
};
