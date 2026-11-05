// Sectores y marcas
window.AO = window.AO || {};

AO.sectores = [
  { id: 'profesionales', nombre: 'Servicios profesionales' },
  { id: 'deportes', nombre: 'Deportes' },
  { id: 'ecommerce', nombre: 'Ecommerce' },
  { id: 'educacion', nombre: 'Educación' },
  { id: 'restauracion', nombre: 'Restauración' },
  { id: 'aeronautica', nombre: 'Aeronáutica' }
];

// logoAncho y logoAlto son las dimensiones reales del archivo (para reservar espacio al cargar).
// logoRecorte = [x, y, ancho, alto] del contenido visible (quita el margen en blanco del archivo); logoAltura = alto en px de la caja (40 por defecto, 136 px de ancho como máximo).
AO.marcas = [
  { id: 'apf', nombre: 'Asoc. Preparadores Físicos', siglas: 'APF', sectores: ['deportes', 'educacion'], logo: 'assets/logos/apf.png', logoAncho: 240, logoAlto: 240, logoRecorte: [4, 5, 231, 226], logoAltura: 48, sectorConfirmado: true },
  { id: 'aeronav', nombre: 'Aeronav', siglas: 'AV', sectores: ['aeronautica'], logo: 'assets/logos/aeronav.png', logoAncho: 480, logoAlto: 203, sectorConfirmado: true },
  { id: 'indomito108', nombre: 'Indómito 108', siglas: 'I108', sectores: ['ecommerce'], logo: 'assets/logos/indomito108.png', logoAncho: 240, logoAlto: 240, logoRecorte: [25, 32, 186, 185], logoAltura: 48, sectorConfirmado: true },
  { id: 'nemnature', nombre: 'NemNature', siglas: 'NN', sectores: ['ecommerce'], logo: 'assets/logos/nemnature.png', logoAncho: 206, logoAlto: 180, sectorConfirmado: true },
  { id: 'mqwave', nombre: 'MQwave', siglas: 'MQ', sectores: ['profesionales'], logo: 'assets/logos/mqwave.png', logoAncho: 433, logoAlto: 240, sectorConfirmado: true },
  { id: 'atlantik-corner', nombre: 'Atlantik Corner', siglas: 'AC', sectores: ['restauracion'], logo: 'assets/logos/atlantik-corner.png', logoAncho: 426, logoAlto: 240, sectorConfirmado: true },
  { id: 'insitu-canada', nombre: 'InSitu Canada', siglas: 'IC', sectores: ['profesionales', 'educacion'], logo: 'assets/logos/insitu-canada.png', logoAncho: 240, logoAlto: 240, logoRecorte: [24, 70, 191, 118], logoAltura: 64, sectorConfirmado: true },
  { id: 'scribalo', nombre: 'Scribalo', siglas: 'SC', sectores: ['profesionales'], logo: 'assets/logos/scribalo.png', logoAncho: 480, logoAlto: 139, logoAltura: 32, sectorConfirmado: true }
];
