
import { Museum } from './types';

export const INITIAL_MUSEUMS: Museum[] = [
  {
    id: 'stedelijk-amsterdam',
    name: 'Stedelijk Museum',
    city: 'Amsterdam',
    country: 'Nederland',
    description: 'Het belangrijkste museum voor moderne en hedendaagse kunst en vormgeving in Nederland.',
    imageUrl: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&q=80&w=1200',
    website: 'https://www.stedelijk.nl',
    highlightArtworks: [
      'De Parkieten (Henri Matisse)', 
      'Beanery (Edward Kienholz)', 
      'Compositie nr. IV (Piet Mondriaan)',
      'Werken van Kazimir Malevich',
      'Barnett Newman collectie',
      'Design & Vormgeving archief'
    ],
    type: 'Moderne Kunst',
    lat: 52.3581,
    lng: 4.8797
  },
  {
    id: 'maxxi-rome',
    name: 'MAXXI',
    city: 'Rome',
    country: 'Italië',
    description: 'Het nationale museum voor kunst uit de 21ste eeuw, ontworpen door de legendarische architect Zaha Hadid.',
    imageUrl: 'https://images.unsplash.com/photo-1543429776-2782fc8e1acd?auto=format&fit=crop&q=80&w=1200',
    website: 'https://www.maxxi.art',
    highlightArtworks: [
      'Architectuur van Zaha Hadid',
      'Ettore Spalletti installaties',
      'Michelangelo Pistoletto werken',
      'William Kentridge projecten',
      'Hedendaagse Italiaanse fotografie',
      'Interactieve media-kunst'
    ],
    type: 'Hedendaagse Kunst',
    lat: 41.9281,
    lng: 12.4665
  },
  {
    id: 'uffizi-florence',
    name: 'Galleria degli Uffizi',
    city: 'Florence',
    country: 'Italië',
    description: 'Een van de oudste en beroemdste kunstmusea ter wereld, de schatkamer van de Italiaanse Renaissance.',
    imageUrl: 'https://images.unsplash.com/photo-1594132176008-89240f907e53?auto=format&fit=crop&q=80&w=1200',
    website: 'https://www.uffizi.it',
    highlightArtworks: [
      'Geboorte van Venus (Botticelli)',
      'La Primavera (Botticelli)',
      'Annunciatie (Leonardo da Vinci)',
      'Venus van Urbino (Titiaan)',
      'Medusa (Caravaggio)',
      'Doni Tondo (Michelangelo)'
    ],
    type: 'Renaissance & Klassiek',
    lat: 43.7677,
    lng: 11.2553
  },
  {
    id: 'museo-egizio-turin',
    name: 'Museo Egizio',
    city: 'Turijn',
    country: 'Italië',
    description: 'Het oudste museum ter wereld gewijd aan de Egyptische cultuur, met een collectie die alleen onderdoet voor die van Caïro.',
    imageUrl: 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&q=80&w=1200',
    website: 'https://museoegizio.it',
    highlightArtworks: [
      'Tempel van Ellesyia',
      'Beeld van Ramses II',
      'Papyrus van Turijn',
      'Graf van Kha en Merit',
      'Sfinxengalerij',
      'Mummies van de koninklijke familie'
    ],
    type: 'Archeologie',
    lat: 45.0684,
    lng: 7.6844
  },
  {
    id: 'madre-naples',
    name: 'MADRE',
    city: 'Napels',
    country: 'Italië',
    description: 'Gehuisvest in een 19e-eeuws paleis, is dit het kloppend hart van de hedendaagse kunst in Zuid-Italië.',
    imageUrl: 'https://images.unsplash.com/photo-1561839561-b13bcfe95249?auto=format&fit=crop&q=80&w=1200',
    website: 'http://www.madrenapoli.it',
    highlightArtworks: [
      'Installaties van Jeff Koons',
      'Werken van Anish Kapoor',
      'Richard Serra sculpturen',
      'Jannis Kounellis wanden',
      'Sol LeWitt muurschilderingen',
      'Mimmo Paladino collectie'
    ],
    type: 'Hedendaagse Kunst',
    lat: 40.8550,
    lng: 14.2585
  },
  {
    id: 'peggy-guggenheim-venice',
    name: 'Peggy Guggenheim Collection',
    city: 'Venetië',
    country: 'Italië',
    description: 'Gelegen aan het Canal Grande, herbergt dit museum een van de belangrijkste collecties moderne kunst van Europa.',
    imageUrl: 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&q=80&w=1200',
    website: 'https://www.guggenheim-venice.it',
    highlightArtworks: [
      'The Empire of Light (Magritte)',
      'Alchemy (Jackson Pollock)',
      'The Angel of the City (Marino Marini)',
      'Birth of Liquid Desires (Dalí)',
      'Calder Mobiles',
      'Max Ernst collectie'
    ],
    type: 'Modernisme',
    lat: 45.4308,
    lng: 12.3315
  }
];
