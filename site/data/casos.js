// Tiradas certeras
// Cada caso: reto (tarjeta y expediente), enfoque y ejecucion (expediente), resultado (arranque + párrafos),
// cierre.pregunta (opcional) y cta. media[0] es la infografía; el resto, las capturas.
window.AO = window.AO || {};

AO.casos = [
  {
    id: 'indomito108-retencion-email-marketing',
    estado: 'real',
    cliente: 'Indómito 108',
    sector: 'ecommerce',
    tipoNegocio: 'Moda masculina · Tienda en Madrid y venta online',
    buyer: ['marcos'],
    titular: 'Más clientes que repiten y gastan más cuando vuelven',
    reto: 'Indómito 108 vendía y hablaba con sus clientes, pero cada pieza iba por su lado. Contenido, redes y email no seguían el mismo hilo. Faltaba una estrategia y un plan que los pusiera en la misma dirección.',
    enfoque: [
      'Puse en el centro al cliente y su segmentación: agrupándolos según sus hábitos de compra. Sin eso, cualquier correo sería genérico y cualquier contenido iría a ciegas.',
      'Sobre esa base diseñé el plan de marketing del año y el de contenidos. Los correos a clientes los puse en marcha yo misma.'
    ],
    ejecucion: [
      'Diseñé el plan de marketing anual y el plan de contenidos.',
      'Agrupé la base de clientes según su forma de comprar.',
      'Cambié los boletines sueltos por un plan de email ordenado, activo en la recta final del semestre.'
    ],
    formato: 'mixto',
    media: [
      { tipo: 'infografia', src: 'assets/casos/indomito108-retencion-email-marketing/infografia.webp', alt: 'Infografía del caso de retención de Indómito 108: retención media del semestre 43,0 %, 7,5 puntos porcentuales más que el año anterior. Ventas por tipo de cliente: clientes recurrentes +78 % y captación de nuevos +29 %. Ticket medio en pedidos de clientes habituales: +14,7 %.', ancho: 1600, alto: 905 },
      { tipo: 'imagen', src: 'assets/casos/indomito108-retencion-email-marketing/plan-de-marketing.webp', alt: 'Portada del plan de marketing de Indómito 108 con el título «Contenido»: logotipo de la marca, tres modelos con abrigos y diez apartados, desde qué hace la marca y los antecedentes hasta el plan de acción, el presupuesto, las métricas y el control.', ancho: 1600, alto: 903 },
      { tipo: 'imagen', src: 'assets/casos/indomito108-retencion-email-marketing/newsletter-venta-privada.webp', alt: 'Newsletter de venta privada de Indómito 108 con el titular «Algunos esperan a que empiecen las rebajas. Pero tú no tienes que esperar por nada», un texto que anuncia que la tienda abre 48 horas antes de las rebajas solo para el cliente, el banner «Acceso exclusivo, 20 % de descuento, venta privada» y una fila de productos destacados.', ancho: 973, alto: 1621 }
    ],
    resultado: {
      arranque: 'La retención subió 7,5 puntos y los clientes que vuelven compran más.',
      parrafos: [
        'La retención, o los clientes que vuelven a comprar, cerró el semestre en el 43,0 % de media. Unos 7,5 puntos más que el año anterior.',
        'Las ventas a clientes que repiten crecieron un 78 % frente al mismo período del año anterior, muy por delante de la captación de nuevos clientes (+29 %).',
        'Cuando los clientes vuelven, gastan más: el gasto medio por pedido de un cliente habitual subió un 14,7 %.'
      ]
    },
    cierre: { pregunta: '¿Tus clientes compran una vez y no vuelven?' },
    cta: { texto: 'Haz que vuelvan', url: 'mailto:info@alobjetivo.com?subject=Quiero%20que%20mis%20clientes%20vuelvan' }
  },
  {
    id: 'apf-captacion-programa-formativo',
    estado: 'real',
    cliente: 'Asociación de Preparadores Físicos de Fútbol (APF)',
    sector: 'deportes',
    tipoNegocio: 'Asociación profesional · Deporte y formación',
    buyer: ['laura'],
    titular: 'Un programa formativo nuevo llenó todas sus plazas sin presupuesto de publicidad',
    reto: 'Llenar la primera edición de un programa formativo nuevo, sin datos de otras ediciones ni presupuesto de publicidad. Cada inscripción se validaba a mano, una a una. A favor solo había una base de socios y contactos interesados que llevaba tiempo dormida.',
    enfoque: [
      'Antes de crear contenido, analicé lo que ya había. La base de contactos era el punto de partida.',
      'Tracé el recorrido completo, del primer interés a la aceptación, y automaticé cada paso. Solo dejé a mano la validación de perfiles, porque ahí hacía falta el criterio humano.'
    ],
    ejecucion: [
      'Agrupé la base de socios y contactos interesados según su perfil.',
      'Diseñé la serie de correos: la oferta con su página, el registro, la aceptación, la bienvenida con las claves de acceso, las instrucciones para entrar y un recordatorio antes del fin de curso.',
      'Automaticé toda la captación y dejé a mano solo la validación de perfiles.',
      'Creé contenido sobre el programa, el temario y el profesorado para las redes sociales de la asociación (Instagram, X y Facebook).'
    ],
    formato: 'mixto',
    media: [
      { tipo: 'infografia', src: 'assets/casos/apf-captacion-programa-formativo/infografia.webp', alt: 'Infografía del caso de APF, de cero presupuesto a pleno en su primera edición: 100 % de ocupación del programa, +38 % de plazas extra por demanda y 17,5 % de conversión global en email.', ancho: 1280, alto: 724 },
      { tipo: 'imagen', src: 'assets/casos/apf-captacion-programa-formativo/newsletter.webp', alt: 'Newsletter de la campaña de APF: cabecera verde con el logotipo de la asociación, texto de presentación del curso English For Football, fecha de inicio, formato online a tu ritmo y plazas limitadas, con los costes para asociados y no asociados.', ancho: 1297, alto: 1977 },
      { tipo: 'imagen', src: 'assets/casos/apf-captacion-programa-formativo/landing.webp', alt: 'Landing del curso English For Football de APF: cabecera con el logotipo, titular sobre dominar el inglés en el fútbol, imagen de un entrenador con dos jugadores, detalles del curso (30 horas de videoclases en 20 sesiones) y formulario para solicitar plaza.', ancho: 1600, alto: 1341 }
    ],
    resultado: {
      arranque: 'Pleno en la primera edición.',
      parrafos: [
        'Cubrí el 100 % de las plazas y hubo que abrir un 38 % más por la demanda. Todo esto sin pagar publicidad.',
        'El 17,5 % de los correos enviados acabó en inscripción. Entre quienes abrieron el correo, fue del 33,2 %.',
        'La conversión a leads en redes sociales mejoró también un 12 % frente al trimestre anterior.'
      ]
    },
    cierre: { pregunta: '¿Tienes una base de contactos que lleva tiempo sin moverse?' },
    cta: { texto: 'Traza tu plan', url: 'mailto:info@alobjetivo.com?subject=Quiero%20trazar%20mi%20plan%20de%20captaci%C3%B3n' }
  },
  {
    id: 'aeronav-identidad-de-marca',
    estado: 'real',
    cliente: 'Aeronav',
    sector: 'aeronautica',
    tipoNegocio: 'Empresa B2B · Sector aeronáutico',
    buyer: ['laura'],
    titular: 'Una identidad nueva que toda la empresa adoptó sin tener que imponerla',
    reto: 'Aeronav entregaba resultados sólidos en un sector que exige precisión e innovación. Pero su marca se había quedado atrás y no reflejaba una empresa moderna, técnica y en evolución constante. Esa distancia se notaba antes de cualquier conversación comercial.',
    enfoque: [
      'Empecé por la estrategia y dejé el diseño para después. Investigué el sector y los productos de Aeronav, y revisé con su equipo la misión, la visión y los valores.',
      'De ahí salió un concepto de marca propio que sostiene todo lo demás, del tono al logotipo, con la seriedad que pide el sector.'
    ],
    ejecucion: [
      'Investigué el sector, los productos y el posicionamiento de Aeronav.',
      'Definí el concepto de marca a partir de su misión, visión y valores.',
      'Diseñé la identidad visual (logotipo, paleta y tipografía) y actualicé el tono y los mensajes.',
      'Llevé el nuevo sistema a los materiales corporativos: propuestas, presentaciones, tarjetas, papelería, certificados, diplomas y otras plantillas.'
    ],
    formato: 'mixto',
    media: [
      { tipo: 'infografia', src: 'assets/casos/aeronav-identidad-de-marca/infografia.webp', alt: 'Infografía del caso de identidad de marca de Aeronav: +20 materiales corporativos actualizados con el nuevo sistema de marca, 100 % de adopción inmediata del nuevo sistema por parte del equipo y feedback interno espontáneo y positivo, sin necesidad de imponer el cambio.', ancho: 1600, alto: 905 },
      { tipo: 'imagen', src: 'assets/casos/aeronav-identidad-de-marca/tarjeta-corporativa.webp', alt: 'Mockup de una tarjeta de visita con la nueva identidad de Aeronav: logotipo con la flecha roja y el nombre en gris, código QR y datos de contacto de ejemplo.', ancho: 675, alto: 383 },
      { tipo: 'imagen', src: 'assets/casos/aeronav-identidad-de-marca/firma-email.webp', alt: 'Firma de correo electrónico con la nueva identidad de Aeronav: logotipo con la flecha roja y el nombre en gris a la izquierda, una línea vertical y, a la derecha, web, teléfono, correo y dirección de la empresa en Montreal.', ancho: 1600, alto: 444 }
    ],
    resultado: {
      arranque: 'Adoptada en toda la empresa desde el primer día.',
      parrafos: [
        'El 100 % del equipo adoptó el nuevo sistema sin que nadie tuviera que imponerlo.',
        'Más de 20 materiales corporativos ya llevan la nueva identidad, y llegaron comentarios positivos que nadie había pedido.',
        'El concepto de marca es hoy el estándar para todo lo que venga después.'
      ]
    },
    cierre: { pregunta: '¿Tu marca dice menos de lo que demuestra tu trabajo?' },
    cta: { texto: 'Moderniza tu marca', url: 'mailto:info@alobjetivo.com?subject=Quiero%20modernizar%20mi%20marca' }
  }
];
