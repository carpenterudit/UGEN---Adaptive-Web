/**
 * UGEN Client-Side Generative Engine (Deterministic Runtime Fallback)
 * Generates rich, highly tailored, multi-component UI specifications for natural language requests.
 * Fully compatible with ComponentRegistry & Scene3D.
 */

function uid() {
  return Math.random().toString(36).substring(2, 9);
}

const DEFAULT_THEME = {
  primary: '#EAAA00',
  secondary: '#3A0F34',
  background: '#100D12',
  surface: '#19141C',
  text_primary: '#F4F0F5',
  text_secondary: '#BDB3C1',
  border: 'rgba(221, 227, 232, 0.15)',
  radius: '16px',
  mode: 'dark'
};

export function generateFallbackSpec(prompt, currentSpec = null) {
  const p = (prompt || '').toLowerCase().trim();

  // =========================================================================
  // INCREMENTAL EDITING & PATCHES ON EXISTING SPEC
  // =========================================================================

  // 1. Theme adjustments
  if (currentSpec && (p.includes('theme') || p.includes('color') || p.includes('dark mode') || p.includes('light mode'))) {
    const updated = JSON.parse(JSON.stringify(currentSpec));
    updated.version = (updated.version || 1) + 1;
    if (!updated.theme) updated.theme = { ...DEFAULT_THEME };

    if (p.includes('green') || p.includes('emerald') || p.includes('teal')) {
      updated.theme.primary = '#10B981';
      updated.theme.secondary = '#064E3B';
    } else if (p.includes('blue') || p.includes('cyan') || p.includes('azure')) {
      updated.theme.primary = '#00F0FF';
      updated.theme.secondary = '#0F172A';
    } else if (p.includes('purple') || p.includes('violet') || p.includes('aubergine')) {
      updated.theme.primary = '#A855F7';
      updated.theme.secondary = '#3A0F34';
    } else if (p.includes('gold') || p.includes('yellow') || p.includes('marigold')) {
      updated.theme.primary = '#EAAA00';
      updated.theme.secondary = '#3A0F34';
    } else if (p.includes('light mode')) {
      updated.theme.mode = 'light';
      updated.theme.background = '#F8FAFC';
      updated.theme.surface = '#FFFFFF';
      updated.theme.text_primary = '#0F172A';
      updated.theme.text_secondary = '#475569';
    } else if (p.includes('dark mode')) {
      updated.theme.mode = 'dark';
      updated.theme.background = '#100D12';
      updated.theme.surface = '#19141C';
      updated.theme.text_primary = '#F4F0F5';
      updated.theme.text_secondary = '#BDB3C1';
    }
    return updated;
  }

  // 2. Add phone number field to current form
  if (currentSpec && (p.includes('phone') || p.includes('telephone') || p.includes('contact field'))) {
    const updated = JSON.parse(JSON.stringify(currentSpec));
    updated.version = (updated.version || 1) + 1;
    const page = updated.pages?.[0];
    if (page && page.components) {
      // Find form component or add to components
      const form = page.components.find(c => c.type === 'form') || page;
      const targetList = form.children || form.components;

      const hasPhone = targetList.some(c => (c.props?.label || '').toLowerCase().includes('phone'));
      if (!hasPhone) {
        // Insert before submit button
        const btnIndex = targetList.findIndex(c => c.type === 'button');
        const phoneField = {
          id: `field-phone-${uid()}`,
          type: 'text-input',
          props: {
            name: 'phone',
            label: 'Mobile Contact Number',
            placeholder: '+1 (555) 019-2834',
            type: 'tel',
            icon: 'phone',
            required: false
          }
        };
        if (btnIndex >= 0) {
          targetList.splice(btnIndex, 0, phoneField);
        } else {
          targetList.push(phoneField);
        }
      }
    }
    return updated;
  }

  // 3. Add reset button to current form
  if (currentSpec && p.includes('reset button')) {
    const updated = JSON.parse(JSON.stringify(currentSpec));
    updated.version = (updated.version || 1) + 1;
    const page = updated.pages?.[0];
    if (page && page.components) {
      const form = page.components.find(c => c.type === 'form') || page;
      const targetList = form.children || form.components;
      const hasReset = targetList.some(c => (c.props?.label || '').toLowerCase().includes('reset'));
      if (!hasReset) {
        targetList.push({
          id: `btn-reset-${uid()}`,
          type: 'button',
          props: {
            label: 'Clear Form Inputs',
            variant: 'outline',
            icon: 'rotate-ccw',
            action_id: 'form.reset'
          }
        });
      }
    }
    return updated;
  }

  // =========================================================================
  // COMPLETE DYNAMIC WEBSITES GENERATION
  // =========================================================================

  // 1. MODERN FURNITURE STORE WEBSITE
  if (p.includes('furniture') || p.includes('interior') || p.includes('decor') || p.includes('living room') || p.includes('sofa') || p.includes('chair')) {
    return {
      id: `spec-furniture-${uid()}`,
      title: 'KROMA — Architectural Furniture & Modern Living',
      description: 'Artisanal furniture studio featuring real-time 3D interactive inspection and curated collections.',
      version: 1,
      theme: {
        ...DEFAULT_THEME,
        primary: '#EAAA00',
        secondary: '#3A0F34'
      },
      current_page_id: 'page-catalog',
      pages: [
        {
          id: 'page-catalog',
          title: 'Curated Collection',
          route: '/furniture',
          layout: 'grid',
          components: [
            {
              id: 'furn-nav',
              type: 'navigation',
              props: {
                title: 'KROMA FURNITURE STUDIO',
                items: [
                  { label: '3D Showcase', page_id: 'page-catalog', icon: 'compass' },
                  { label: 'Living', page_id: 'page-catalog', icon: 'home' },
                  { label: 'Dining', page_id: 'page-catalog', icon: 'coffee' },
                  { label: 'Cart (2)', page_id: 'page-catalog', icon: 'shopping-bag' }
                ]
              }
            },
            {
              id: 'furn-hero',
              type: 'hero-banner',
              props: {
                badge: '2026 Architectural Collection',
                title: 'Minimalist Forms. Uncompromising Comfort.',
                subtitle: 'Sculptural furniture engineered with Scandinavian solid white oak, hand-stitched Italian leather, and brushed brass joinery.',
                ctaLabel: 'Explore 3D Showroom',
                secondaryLabel: 'Material Swatches'
              }
            },
            {
              id: 'furn-3d-scene',
              type: 'scene-3d',
              props: {
                model: 'furniture',
                height: 420,
                title: 'Live 3D Inspection: The Bauhaus Lounge Chair',
                subtitle: 'Drag to inspect angles • Rotate 360° • Switch materials and wireframe mode live in browser',
                accentColor: '#EAAA00',
                showControls: true,
                autoRotateSpeed: 1.0
              }
            },
            {
              id: 'furn-filter',
              type: 'filter-bar',
              props: {
                filters: ['All Furniture', 'Lounge Chairs', 'Solid Oak Tables', 'Architectural Lighting', 'Modular Storage'],
                active: 'All Furniture'
              }
            },
            {
              id: 'furn-products-grid',
              type: 'grid',
              props: { columns: 3 },
              children: [
                {
                  id: 'prod-1',
                  type: 'product-card',
                  props: {
                    title: 'The Bauhaus Lounge Chair',
                    price: '$890',
                    category: 'Lounge & Accent',
                    rating: 4.95,
                    badge: 'Best Seller',
                    image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=600&auto=format&fit=crop&q=80'
                  }
                },
                {
                  id: 'prod-2',
                  type: 'product-card',
                  props: {
                    title: 'Nordic Oak Dining Table',
                    price: '$1,450',
                    category: 'Dining & Gathering',
                    rating: 4.9,
                    badge: 'Crafted to Order',
                    image: 'https://images.unsplash.com/photo-1577140917170-285929fb55b7?w=600&auto=format&fit=crop&q=80'
                  }
                },
                {
                  id: 'prod-3',
                  type: 'product-card',
                  props: {
                    title: 'Brushed Brass Arc Floor Lamp',
                    price: '$380',
                    category: 'Lighting',
                    rating: 4.88,
                    badge: 'Limited Run',
                    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=80'
                  }
                }
              ]
            },
            {
              id: 'furn-features-grid',
              type: 'grid',
              props: { columns: 3 },
              children: [
                {
                  id: 'feat-1',
                  type: 'card',
                  props: {
                    title: 'Sustainable Forestry Certification',
                    description: '100% of our solid oak and walnut timber is sustainably sourced from certified regenerative European woodlands.',
                    badge: 'Eco Guarantee'
                  }
                },
                {
                  id: 'feat-2',
                  type: 'card',
                  props: {
                    title: 'White-Glove Home Delivery',
                    description: 'Complimentary two-person scheduled room placement, assembly, and packaging removal across North America & Europe.',
                    badge: 'Premium Service'
                  }
                },
                {
                  id: 'feat-3',
                  type: 'card',
                  props: {
                    title: '15-Year Structural Integrity Warranty',
                    description: 'Every hand-jointed frame is guaranteed against structural failure, warpage, or joint loosening for 15 full years.',
                    badge: 'Built to Last'
                  }
                }
              ]
            }
          ]
        }
      ]
    };
  }

  // 2. CINEMATIC PORTFOLIO WITH 3D ROTATING OBJECT
  if (p.includes('portfolio') || p.includes('cinematic') || p.includes('3d rotating') || p.includes('photographer') || p.includes('creative director') || p.includes('sculpture')) {
    return {
      id: `spec-portfolio-${uid()}`,
      title: 'STUDIO NEXUS — Cinematic & Interactive Portfolio',
      description: 'Award-winning creative technologist portfolio with interactive 3D kinetic sculpture.',
      version: 1,
      theme: {
        ...DEFAULT_THEME,
        primary: '#EAAA00',
        secondary: '#3A0F34'
      },
      current_page_id: 'page-portfolio',
      pages: [
        {
          id: 'page-portfolio',
          title: 'Selected Works',
          route: '/portfolio',
          layout: 'grid',
          components: [
            {
              id: 'port-nav',
              type: 'navigation',
              props: {
                title: 'STUDIO NEXUS // DIRECTION',
                items: [
                  { label: '3D Sculpture Lab', page_id: 'page-portfolio', icon: 'sparkles' },
                  { label: 'Case Studies', page_id: 'page-portfolio', icon: 'book' },
                  { label: 'Accolades', page_id: 'page-portfolio', icon: 'star' },
                  { label: 'Initiate Contact', page_id: 'page-portfolio', icon: 'mail' }
                ]
              }
            },
            {
              id: 'port-heading',
              type: 'heading',
              props: {
                level: 1,
                text: 'Cinematic Visuals & Generative Direction',
                subtext: 'Exploring the nexus of real-time 3D WebGL computation, sensory narrative design, and autonomous user interfaces.',
                align: 'left'
              }
            },
            {
              id: 'port-3d-kinetic',
              type: 'scene-3d',
              props: {
                model: 'portfolio',
                height: 440,
                title: 'Kinetic Sculpture: "Perpetual Geometry 04"',
                subtitle: 'Procedural Torus Knot with dual gyroscopic stabilizers and 180-point particle field • Orbit with mouse',
                accentColor: '#EAAA00',
                showControls: true,
                autoRotateSpeed: 1.4
              }
            },
            {
              id: 'port-metrics-grid',
              type: 'grid',
              props: { columns: 4 },
              children: [
                {
                  id: 'metric-awwwards',
                  type: 'metric-card',
                  props: {
                    title: 'Awwwards Recognition',
                    value: 'Site of the Year',
                    change: '14 Jury Votes',
                    trend: 'up',
                    icon: 'star'
                  }
                },
                {
                  id: 'metric-audience',
                  type: 'metric-card',
                  props: {
                    title: 'Audience Reach',
                    value: '4.8M Visitors',
                    change: '+142% engagement',
                    trend: 'up',
                    icon: 'activity'
                  }
                },
                {
                  id: 'metric-awards',
                  type: 'metric-card',
                  props: {
                    title: 'Global Accolades',
                    value: '28 Trophies',
                    change: 'FWA, Webby, D&AD',
                    trend: 'up',
                    icon: 'tag'
                  }
                },
                {
                  id: 'metric-framerate',
                  type: 'metric-card',
                  props: {
                    title: 'Shader Frame Rate',
                    value: '120 FPS',
                    change: 'Zero frame drop',
                    trend: 'up',
                    icon: 'zap'
                  }
                }
              ]
            },
            {
              id: 'port-projects-heading',
              type: 'heading',
              props: {
                level: 2,
                text: 'Selected Featured Case Studies',
                subtext: 'High-concept digital products and sensory spatial interfaces crafted for global pioneers.'
              }
            },
            {
              id: 'port-projects-grid',
              type: 'grid',
              props: { columns: 3 },
              children: [
                {
                  id: 'proj-1',
                  type: 'card',
                  props: {
                    title: 'Project Chronos: Temporal Interface',
                    badge: 'Spatial Computing',
                    description: 'A WebGL spatial interface that visualizes complex multidimensional market data in realtime using GPU particle emitters.',
                    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80',
                    price: 'Read Case Study →'
                  }
                },
                {
                  id: 'proj-2',
                  type: 'card',
                  props: {
                    title: 'Aura: Audio-Reactive Synthesizer',
                    badge: 'Sonic Design',
                    description: 'Browser-based generative sound environment built with Web Audio API and interactive GLSL fragment shaders.',
                    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
                    price: 'Launch Experience →'
                  }
                },
                {
                  id: 'proj-3',
                  type: 'card',
                  props: {
                    title: 'Synthetica: Autonomous Brand OS',
                    badge: 'Generative AI',
                    description: 'Dynamic identity engine generating thousands of cohesive visual brand assets automatically from core typography rules.',
                    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
                    price: 'Inspect Architecture →'
                  }
                }
              ]
            }
          ]
        }
      ]
    };
  }

  // 3. RESTAURANT WEBSITE WITH DYNAMIC MENU AND BOOKING FORM
  if (p.includes('restaurant') || p.includes('food') || p.includes('dining') || p.includes('menu') || p.includes('booking') || p.includes('reservation') || p.includes('bistro') || p.includes('cafe')) {
    return {
      id: `spec-restaurant-${uid()}`,
      title: 'L’ATELIER — Modern Gastronomy & Reserve',
      description: 'Michelin-starred culinary experience featuring seasonal artisanal menu and table reservation engine.',
      version: 1,
      theme: {
        ...DEFAULT_THEME,
        primary: '#EAAA00',
        secondary: '#3A0F34'
      },
      current_page_id: 'page-dining',
      pages: [
        {
          id: 'page-dining',
          title: 'Dining Experience',
          route: '/dining',
          layout: 'grid',
          components: [
            {
              id: 'rest-nav',
              type: 'navigation',
              props: {
                title: 'L’ATELIER GOURMET',
                items: [
                  { label: 'Menu & Reserve', page_id: 'page-dining', icon: 'utensils' },
                  { label: 'Wine Cellar', page_id: 'page-dining', icon: 'coffee' },
                  { label: 'Tasting Journey', page_id: 'page-dining', icon: 'sparkles' },
                  { label: 'Book Table', page_id: 'page-dining', icon: 'calendar' }
                ]
              }
            },
            {
              id: 'rest-hero',
              type: 'hero-banner',
              props: {
                badge: 'Two Michelin Stars • 2026 Reserve',
                title: 'Artisanal Culinary Mastery Meets Seasonal Elegance',
                subtitle: 'Immerse yourself in progressive French gastronomy driven by biodynamic local harvests and a 1,200-bottle subterranean wine cellar.',
                ctaLabel: 'Reserve Your Table Below',
                secondaryLabel: 'View Tasting Menu'
              }
            },
            {
              id: 'menu-heading',
              type: 'heading',
              props: {
                level: 2,
                text: 'Seasonal Degustation Highlights',
                subtext: 'Every dish represents a harmonious balance of texture, provenance, and flavor innovation.'
              }
            },
            {
              id: 'menu-grid',
              type: 'grid',
              props: { columns: 2 },
              children: [
                {
                  id: 'dish-1',
                  type: 'menu-item',
                  props: {
                    title: 'Black Truffle & Chanterelle Tagliolini',
                    price: '$38',
                    description: 'Hand-rolled egg yolk pasta, 36-month aged Parmigiano Reggiano emulsion, and shaved Perigord winter truffles.',
                    tags: ['Signature', 'Handmade', 'Vegetarian'],
                    calories: 520
                  }
                },
                {
                  id: 'dish-2',
                  type: 'menu-item',
                  props: {
                    title: 'Wood-Fired A5 Miyazaki Wagyu Ribeye',
                    price: '$74',
                    description: 'Binchotan charcoal seared, smoked bone marrow reduction, charred baby leeks, and roasted matsutake mushrooms.',
                    tags: ['Chef Special', 'A5 Wagyu', 'Gluten-Free'],
                    calories: 680
                  }
                },
                {
                  id: 'dish-3',
                  type: 'menu-item',
                  props: {
                    title: 'Wild Hokkaido Scallop Crudo',
                    price: '$28',
                    description: 'Yuzu kosho vinaigrette, pickled finger lime pearls, crispy capers, and compressed white peach.',
                    tags: ['Raw Bar', 'Gluten-Free'],
                    calories: 310
                  }
                },
                {
                  id: 'dish-4',
                  type: 'menu-item',
                  props: {
                    title: 'Valrhona Grand Cru Dark Chocolate Sphere',
                    price: '$22',
                    description: 'Warm salted caramel sauce poured table-side, Sicilian bronte pistachio gelato, and gold leaf dust.',
                    tags: ['Dessert', 'Artisanal'],
                    calories: 440
                  }
                }
              ]
            },
            {
              id: 'reserve-heading',
              type: 'heading',
              props: {
                level: 2,
                text: 'Reserve a Dining Experience',
                subtext: 'We accept reservations up to 60 days in advance. Intimate dining room seating and private salon available.'
              }
            },
            {
              id: 'booking-form',
              type: 'form',
              props: { id: 'table-reservation-form' },
              children: [
                {
                  id: 'field-guest-name',
                  type: 'text-input',
                  props: {
                    name: 'guest_name',
                    label: 'Primary Guest Full Name',
                    placeholder: 'e.g. Marcus Vance',
                    icon: 'user',
                    required: true
                  }
                },
                {
                  id: 'field-guest-email',
                  type: 'email-input',
                  props: {
                    name: 'guest_email',
                    label: 'Confirmation Email Address',
                    placeholder: 'marcus@luxurygroup.com',
                    required: true
                  }
                },
                {
                  id: 'field-guest-phone',
                  type: 'text-input',
                  props: {
                    name: 'guest_phone',
                    label: 'Contact Phone Number (SMS Confirmation)',
                    placeholder: '+1 (555) 482-1920',
                    icon: 'phone',
                    required: true
                  }
                },
                {
                  id: 'field-party-size',
                  type: 'select',
                  props: {
                    name: 'party_size',
                    label: 'Party Size / Seating Preference',
                    options: [
                      { label: '2 Guests — Main Dining Room Table', value: '2' },
                      { label: '4 Guests — Banquette Booth', value: '4' },
                      { label: '6 Guests — Wine Cellar Salon', value: '6' },
                      { label: '8-12 Guests — Private Chef Dining Experience', value: '10' }
                    ]
                  }
                },
                {
                  id: 'field-dining-date',
                  type: 'text-input',
                  props: {
                    name: 'reservation_date',
                    label: 'Preferred Date & Time',
                    placeholder: 'Friday, Nov 14 at 7:30 PM',
                    icon: 'calendar',
                    required: true
                  }
                },
                {
                  id: 'field-dietary-notes',
                  type: 'textarea',
                  props: {
                    name: 'dietary_notes',
                    label: 'Dietary Restrictions or Special Occasion Notes',
                    placeholder: 'Please let us know of any allergies, anniversaries, or wine pairing preferences...',
                    rows: 3
                  }
                },
                {
                  id: 'btn-submit-booking',
                  type: 'button',
                  props: {
                    label: 'Confirm Table Reservation',
                    variant: 'primary',
                    full_width: true,
                    action_id: 'form.submit_demo'
                  }
                }
              ]
            }
          ]
        }
      ]
    };
  }

  // 4. FUTURISTIC PRODUCT LANDING PAGE WITH 3D AND SCROLL ANIMATIONS
  if (p.includes('futuristic') || p.includes('product landing') || p.includes('gadget') || p.includes('scroll animation') || p.includes('tech product') || p.includes('quantum')) {
    return {
      id: `spec-future-${uid()}`,
      title: 'SYNAPSE QUANTUM // Autonomous Neural Processor',
      description: 'Next-generation quantum neural coprocessor landing page with live 3D cybernetic model.',
      version: 1,
      theme: {
        ...DEFAULT_THEME,
        primary: '#EAAA00',
        secondary: '#3A0F34'
      },
      current_page_id: 'page-futuristic',
      pages: [
        {
          id: 'page-futuristic',
          title: 'Quantum Hardware',
          route: '/quantum',
          layout: 'grid',
          components: [
            {
              id: 'future-nav',
              type: 'navigation',
              props: {
                title: 'SYNAPSE // QUANTUM ARCHITECTURE',
                items: [
                  { label: 'Neural Core 3D', page_id: 'page-futuristic', icon: 'zap' },
                  { label: 'Specifications', page_id: 'page-futuristic', icon: 'activity' },
                  { label: 'SDK Benchmarks', page_id: 'page-futuristic', icon: 'bar-chart' },
                  { label: 'Pre-Order Tier', page_id: 'page-futuristic', icon: 'shopping-bag' }
                ]
              }
            },
            {
              id: 'future-hero',
              type: 'hero-banner',
              props: {
                badge: 'Silicon Quantum V8 • 3nm Architecture',
                title: 'Ambient Intelligence Accelerated at Quantum Scale',
                subtitle: 'The world’s first photon-coupled neural processor delivering 4,800 TOPS of localized AI inference at 12 Watts.',
                ctaLabel: 'Reserve Developer Kit',
                secondaryLabel: 'Read Whitepaper'
              }
            },
            {
              id: 'future-3d-model',
              type: 'scene-3d',
              props: {
                model: 'product',
                height: 440,
                title: 'Synapse Core V9 Holographic Disassembly',
                subtitle: 'Full 3D gyroscopic inspection • Drag to rotate hardware casing • Inspect optical photonic channels',
                accentColor: '#EAAA00',
                showControls: true,
                autoRotateSpeed: 1.6
              }
            },
            {
              id: 'future-specs-grid',
              type: 'grid',
              props: { columns: 4 },
              children: [
                {
                  id: 'spec-1',
                  type: 'metric-card',
                  props: {
                    title: 'Neural Compute',
                    value: '4,800 TOPS',
                    change: '4.2x vs prior gen',
                    trend: 'up',
                    icon: 'zap'
                  }
                },
                {
                  id: 'spec-2',
                  type: 'metric-card',
                  props: {
                    title: 'Thermal Dissipation',
                    value: '12 Watts',
                    change: '-68% energy draw',
                    trend: 'down',
                    icon: 'flame'
                  }
                },
                {
                  id: 'spec-3',
                  type: 'metric-card',
                  props: {
                    title: 'Interconnect Latency',
                    value: '0.18 μs',
                    change: 'Optical waveguide bus',
                    trend: 'up',
                    icon: 'activity'
                  }
                },
                {
                  id: 'spec-4',
                  type: 'metric-card',
                  props: {
                    title: 'Memory Bandwidth',
                    value: '2.4 TB/s',
                    change: 'HBM3e on-die stack',
                    trend: 'up',
                    icon: 'target'
                  }
                }
              ]
            },
            {
              id: 'future-preorder',
              type: 'form',
              props: { id: 'quantum-preorder-form' },
              children: [
                {
                  id: 'preorder-heading',
                  type: 'heading',
                  props: {
                    level: 2,
                    text: 'Request Early Silicon Developer Kit',
                    subtext: 'Join the commercial alpha deployment cohort. Hardware shipping Q1 2027 with certified C++ & Python SDKs.'
                  }
                },
                {
                  id: 'field-preorder-name',
                  type: 'text-input',
                  props: {
                    name: 'company_name',
                    label: 'Enterprise / Research Organization',
                    placeholder: 'e.g. Deep Dynamics Quantum Labs',
                    required: true
                  }
                },
                {
                  id: 'field-preorder-email',
                  type: 'email-input',
                  props: {
                    name: 'work_email',
                    label: 'Engineering Contact Email',
                    placeholder: 'lead-architect@quantumlabs.org',
                    required: true
                  }
                },
                {
                  id: 'btn-reserve-kit',
                  type: 'button',
                  props: {
                    label: 'Submit Developer Kit Allocation Request',
                    variant: 'primary',
                    full_width: true,
                    action_id: 'form.submit_demo'
                  }
                }
              ]
            }
          ]
        }
      ]
    };
  }

  // 5. SAAS & EXECUTIVE ANALYTICS DASHBOARD
  if (p.includes('dashboard') || p.includes('analytic') || p.includes('metric') || p.includes('revenue') || p.includes('chart') || p.includes('saas') || p.includes('filter')) {
    return {
      id: `spec-dashboard-${uid()}`,
      title: 'SYNTHESIS — Executive Analytics & Telemetry Hub',
      description: 'Real-time telemetry, revenue trajectory, user cohorts, and performance auditing.',
      version: 1,
      theme: {
        ...DEFAULT_THEME,
        primary: '#EAAA00',
        secondary: '#3A0F34'
      },
      current_page_id: 'page-overview',
      pages: [
        {
          id: 'page-overview',
          title: 'Live Metrics Overview',
          route: '/overview',
          layout: 'grid',
          components: [
            {
              id: 'dash-nav',
              type: 'navigation',
              props: {
                title: 'SYNTHESIS // TELEMETRY',
                items: [
                  { label: 'Realtime Hub', page_id: 'page-overview', icon: 'activity' },
                  { label: 'Cohorts', page_id: 'page-overview', icon: 'user' },
                  { label: 'Revenue Streams', page_id: 'page-overview', icon: 'dollar-sign' },
                  { label: 'Export Telemetry', page_id: 'page-overview', icon: 'bar-chart' }
                ]
              }
            },
            {
              id: 'dash-heading',
              type: 'heading',
              props: {
                level: 1,
                text: 'Autonomous Revenue & Synthesis Intelligence',
                subtext: 'Telemetry streaming live from 6 global regions • 99.99% runtime reliability.'
              }
            },
            {
              id: 'dash-filters',
              type: 'filter-bar',
              props: {
                filters: ['Today Realtime', 'Trailing 7 Days', 'Monthly Trajectory', 'Q3 Performance', 'All Time'],
                active: 'Trailing 7 Days'
              }
            },
            {
              id: 'dash-metrics-grid',
              type: 'grid',
              props: { columns: 4 },
              children: [
                {
                  id: 'metric-arr',
                  type: 'metric-card',
                  props: {
                    title: 'Annual Recurring Revenue',
                    value: '$1,284,900',
                    change: '+34.8% YoY',
                    trend: 'up',
                    icon: 'dollar-sign'
                  }
                },
                {
                  id: 'metric-active',
                  type: 'metric-card',
                  props: {
                    title: 'Active Adaptive Sessions',
                    value: '94,820',
                    change: '+18.4% surge',
                    trend: 'up',
                    icon: 'user'
                  }
                },
                {
                  id: 'metric-latency',
                  type: 'metric-card',
                  props: {
                    title: 'Synthesis Latency',
                    value: '14.2 ms',
                    change: '-42% reduction',
                    trend: 'down',
                    icon: 'zap'
                  }
                },
                {
                  id: 'metric-health',
                  type: 'metric-card',
                  props: {
                    title: 'Schema Validation',
                    value: '99.98%',
                    change: 'Zero regressions',
                    trend: 'up',
                    icon: 'shield'
                  }
                }
              ]
            },
            {
              id: 'dash-chart',
              type: 'chart',
              props: {
                title: 'Conversion Velocity & Synthesis Volume (Past 7 Cycles)',
                chart_type: 'bar',
                data: [48, 64, 82, 58, 96, 78, 100]
              }
            },
            {
              id: 'dash-table',
              type: 'table',
              props: {
                title: 'Recent Enterprise Audit Log & Dispatched Workflows',
                columns: ['Event ID', 'Organization', 'Session Type', 'Latency', 'Status'],
                rows: [
                  ['EV-9402', 'Stripe Global', 'Generative Studio Checkout', '12ms', 'Completed ✓'],
                  ['EV-9401', 'Vercel Labs', 'Adaptive Landing Flow', '16ms', 'Completed ✓'],
                  ['EV-9400', 'Supabase Systems', 'PostgreSQL Connection Pooling', '9ms', 'Completed ✓'],
                  ['EV-9399', 'Linear Technologies', 'Multi-tenant Task Matrix', '15ms', 'Completed ✓'],
                  ['EV-9398', 'Retool Cloud', 'Dynamic Schema Validation', '11ms', 'Completed ✓']
                ]
              }
            }
          ]
        }
      ]
    };
  }

  // 6. LOGIN / AUTHENTICATION PAGE
  if (p.includes('login') || p.includes('sign in') || p.includes('auth')) {
    return {
      id: `spec-login-${uid()}`,
      title: 'Secure Access Gateway',
      description: 'Zero-trust authentication interface with biometric & credential validation.',
      version: 1,
      theme: {
        ...DEFAULT_THEME,
        primary: '#EAAA00',
        secondary: '#3A0F34'
      },
      current_page_id: 'page-login',
      pages: [
        {
          id: 'page-login',
          title: 'Sign In',
          route: '/login',
          layout: 'form',
          components: [
            {
              id: 'login-form',
              type: 'form',
              props: { id: 'login-form-el' },
              children: [
                {
                  id: 'login-heading',
                  type: 'heading',
                  props: {
                    level: 2,
                    text: 'Welcome to UGEN',
                    subtext: 'Enter your credentials to access your autonomous generative workspace.'
                  }
                },
                {
                  id: 'field-login-email',
                  type: 'email-input',
                  props: {
                    name: 'email',
                    label: 'Registered Work Email',
                    placeholder: 'developer@enterprise.io',
                    required: true
                  }
                },
                {
                  id: 'field-login-pass',
                  type: 'password-input',
                  props: {
                    name: 'password',
                    label: 'Account Password',
                    placeholder: '••••••••••••',
                    required: true
                  }
                },
                {
                  id: 'field-remember',
                  type: 'checkbox',
                  props: {
                    name: 'remember_me',
                    label: 'Remember this browser session for 30 days',
                    checked: true
                  }
                },
                {
                  id: 'btn-do-login',
                  type: 'button',
                  props: {
                    label: 'Sign In to Workspace',
                    variant: 'primary',
                    full_width: true,
                    action_id: 'form.submit_demo'
                  }
                },
                {
                  id: 'btn-reset-login',
                  type: 'button',
                  props: {
                    label: 'Clear Inputs',
                    variant: 'outline',
                    full_width: true,
                    action_id: 'form.reset'
                  }
                }
              ]
            }
          ]
        }
      ]
    };
  }

  // 7. REGISTRATION / SIGN UP FORM
  if (p.includes('register') || p.includes('sign up') || p.includes('create account') || p.includes('registration')) {
    return {
      id: `spec-register-${uid()}`,
      title: 'Platform Member Registration',
      description: 'Streamlined account creation with inline validation and security checks.',
      version: 1,
      theme: {
        ...DEFAULT_THEME,
        primary: '#EAAA00',
        secondary: '#3A0F34'
      },
      current_page_id: 'page-register',
      pages: [
        {
          id: 'page-register',
          title: 'Join the Platform',
          route: '/register',
          layout: 'form',
          components: [
            {
              id: 'reg-form',
              type: 'form',
              props: { id: 'reg-form-el' },
              children: [
                {
                  id: 'comp-reg-title',
                  type: 'heading',
                  props: {
                    level: 2,
                    text: 'Create Your Adaptive Account',
                    subtext: 'Get started with autonomous UI generation in seconds.'
                  }
                },
                {
                  id: 'field-fullname',
                  type: 'text-input',
                  props: {
                    name: 'full_name',
                    label: 'Full Name',
                    placeholder: 'Elena Rostova',
                    icon: 'user',
                    required: true
                  }
                },
                {
                  id: 'field-reg-email',
                  type: 'email-input',
                  props: {
                    name: 'email',
                    label: 'Work Email Address',
                    placeholder: 'elena@enterprise.io',
                    required: true
                  }
                },
                {
                  id: 'field-reg-phone',
                  type: 'text-input',
                  props: {
                    name: 'phone',
                    label: 'Mobile Contact Number (Optional)',
                    placeholder: '+1 (555) 019-2834',
                    icon: 'phone',
                    required: false
                  }
                },
                {
                  id: 'field-reg-password',
                  type: 'password-input',
                  props: {
                    name: 'password',
                    label: 'Secure Password',
                    placeholder: 'Minimum 8 characters with numbers & symbols',
                    required: true
                  }
                },
                {
                  id: 'field-terms',
                  type: 'checkbox',
                  props: {
                    name: 'terms_agreed',
                    label: 'I accept the Enterprise Terms of Service and Data Privacy Policy',
                    checked: false,
                    required: true
                  }
                },
                {
                  id: 'btn-submit-reg',
                  type: 'button',
                  props: {
                    label: 'Complete Account Setup',
                    variant: 'primary',
                    full_width: true,
                    action_id: 'form.submit_demo'
                  }
                },
                {
                  id: 'btn-reset-reg',
                  type: 'button',
                  props: {
                    label: 'Reset Form Fields',
                    variant: 'outline',
                    full_width: true,
                    action_id: 'form.reset'
                  }
                }
              ]
            }
          ]
        }
      ]
    };
  }

  // 8. TASK / PROJECT MANAGER
  if (p.includes('task') || p.includes('todo') || p.includes('project manager') || p.includes('kanban')) {
    return {
      id: `spec-task-${uid()}`,
      title: 'PULSE — Adaptive Task & Workflow Manager',
      description: 'Collaborative priority task management with filters and real-time status tracking.',
      version: 1,
      theme: {
        ...DEFAULT_THEME,
        primary: '#EAAA00',
        secondary: '#3A0F34'
      },
      current_page_id: 'page-tasks',
      pages: [
        {
          id: 'page-tasks',
          title: 'Active Workflows',
          route: '/tasks',
          layout: 'grid',
          components: [
            {
              id: 'task-nav',
              type: 'navigation',
              props: {
                title: 'PULSE // TASK MATRIX',
                items: [
                  { label: 'Active Sprint', page_id: 'page-tasks', icon: 'check-square' },
                  { label: 'Roadmap', page_id: 'page-tasks', icon: 'calendar' },
                  { label: 'Team Velocity', page_id: 'page-tasks', icon: 'activity' }
                ]
              }
            },
            {
              id: 'task-heading',
              type: 'heading',
              props: {
                level: 1,
                text: 'Sprint Deliverables & Quality Gates',
                subtext: 'Manage generative UI deliverables, review PR checks, and maintain team velocity.'
              }
            },
            {
              id: 'task-filter',
              type: 'filter-bar',
              props: {
                filters: ['All Sprints', 'High Priority', 'In Progress', 'Ready for QA', 'Completed'],
                active: 'All Sprints'
              }
            },
            {
              id: 'task-creation-form',
              type: 'form',
              props: { id: 'create-task-form' },
              children: [
                {
                  id: 'task-form-title',
                  type: 'heading',
                  props: {
                    level: 3,
                    text: 'Create New Action Item'
                  }
                },
                {
                  id: 'field-task-name',
                  type: 'text-input',
                  props: {
                    name: 'task_title',
                    label: 'Task Summary / User Story',
                    placeholder: 'e.g. Audit Three.js WebGL shader performance on mobile',
                    icon: 'check-square',
                    required: true
                  }
                },
                {
                  id: 'field-task-priority',
                  type: 'select',
                  props: {
                    name: 'priority',
                    label: 'Priority Level',
                    options: [
                      { label: 'P0 — Critical Path (Immediate)', value: 'P0' },
                      { label: 'P1 — High Priority (Sprint Goal)', value: 'P1' },
                      { label: 'P2 — Medium Priority', value: 'P2' }
                    ]
                  }
                },
                {
                  id: 'btn-create-task',
                  type: 'button',
                  props: {
                    label: 'Add Task to Sprint Backlog',
                    variant: 'primary',
                    full_width: true,
                    action_id: 'form.submit_demo'
                  }
                }
              ]
            },
            {
              id: 'task-cards-grid',
              type: 'grid',
              props: { columns: 3 },
              children: [
                {
                  id: 'task-card-1',
                  type: 'card',
                  props: {
                    title: 'Three.js 3D WebGL Engine Integration',
                    badge: 'In Review',
                    description: 'Deploy hardware-accelerated 3D furniture models and kinetic sculptures directly into the component registry.',
                    progress: 95
                  }
                },
                {
                  id: 'task-card-2',
                  type: 'card',
                  props: {
                    title: 'Deterministic Natural-Language Routing',
                    badge: 'Completed',
                    description: 'Map user prompts onto structured, type-safe specifications with automatic fallback and schema verification.',
                    progress: 100
                  }
                },
                {
                  id: 'task-card-3',
                  type: 'card',
                  props: {
                    title: 'Netlify SPA Rewrites & Deployment Verification',
                    badge: 'Completed',
                    description: 'Configure Netlify headers, catch-all routing rules, and continuous push triggers on GitHub main branch.',
                    progress: 100
                  }
                }
              ]
            }
          ]
        }
      ]
    };
  }

  // =========================================================================
  // GENERAL FALLBACK: HIGH-FIDELITY ADAPTIVE INTERFACE
  // =========================================================================
  const dynamicTitle = prompt.length > 36 ? prompt.slice(0, 36) + '...' : prompt;

  return {
    id: `spec-general-${uid()}`,
    title: `Adaptive Experience: ${dynamicTitle}`,
    description: `Synthesized dynamically according to your natural-language intent: "${prompt}".`,
    version: 1,
    theme: {
      ...DEFAULT_THEME,
      primary: '#EAAA00',
      secondary: '#3A0F34'
    },
    current_page_id: 'page-main',
    pages: [
      {
        id: 'page-main',
        title: 'Generated Experience',
        route: '/main',
        layout: 'grid',
        components: [
          {
            id: 'gen-nav',
            type: 'navigation',
            props: {
              title: 'UGEN // ADAPTIVE GENERATOR',
              items: [
                { label: 'Generated View', page_id: 'page-main', icon: 'sparkles' },
                { label: 'Live Inspect', page_id: 'page-main', icon: 'activity' },
                { label: 'Revisions', page_id: 'page-main', icon: 'rotate-ccw' }
              ]
            }
          },
          {
            id: 'gen-heading',
            type: 'heading',
            props: {
              level: 1,
              text: `Adaptive Interface: "${prompt}"`,
              subtext: 'This live interface was synthesized on-the-fly to fulfill your requirements with responsive components and strict type safety.'
            }
          },
          {
            id: 'gen-3d-preview',
            type: 'scene-3d',
            props: {
              model: 'geometric',
              height: 340,
              title: 'Real-time 3D Viewport',
              subtitle: 'Interactive geometric representation synthesized for this workspace • Orbit with mouse',
              accentColor: '#EAAA00',
              showControls: true
            }
          },
          {
            id: 'gen-metrics-grid',
            type: 'grid',
            props: { columns: 3 },
            children: [
              {
                id: 'gen-stat-1',
                type: 'metric-card',
                props: {
                  title: 'Component Health',
                  value: '100%',
                  change: 'All schemas verified',
                  trend: 'up',
                  icon: 'shield'
                }
              },
              {
                id: 'gen-stat-2',
                type: 'metric-card',
                props: {
                  title: 'Execution Mode',
                  value: 'Autonomous',
                  change: 'Zero arbitrary eval',
                  trend: 'up',
                  icon: 'zap'
                }
              },
              {
                id: 'gen-stat-3',
                type: 'metric-card',
                props: {
                  title: 'Viewport Adaptivity',
                  value: 'Responsive',
                  change: 'Desktop, Tablet, Mobile',
                  trend: 'up',
                  icon: 'target'
                }
              }
            ]
          },
          {
            id: 'gen-details-card',
            type: 'card',
            props: {
              title: 'Conversational Evolution',
              badge: 'Reactive Runtime',
              description: 'You can now refine this interface interactively. Submit follow-up instructions in the chat (e.g. "Add a contact form", "Change theme to green", "Add a phone field", or "Create a furniture catalog") to evolve your application in real-time.'
            }
          }
        ]
      }
    ]
  };
}
