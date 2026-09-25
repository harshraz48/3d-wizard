import os

# Create SVG graphics for portfolio and UI
os.makedirs('assets/images', exist_ok=True)

# 1. Background layer lines pattern
layer_lines_svg = """<svg width="600" height="600" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="layerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FF6B1A" stop-opacity="0.12" />
      <stop offset="50%" stop-color="#00E5FF" stop-opacity="0.04" />
      <stop offset="100%" stop-color="#FF6B1A" stop-opacity="0.02" />
    </linearGradient>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
      <circle cx="40" cy="40" r="1" fill="rgba(255,107,26,0.15)" />
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#grid)" />
  <g fill="none" stroke="url(#layerGrad)" stroke-width="1.2">
    <!-- Contour lines resembling 3D sliced topo layers -->
    <path d="M -50,150 Q 150,80 300,180 T 650,120" />
    <path d="M -50,200 Q 150,130 300,230 T 650,170" />
    <path d="M -50,250 Q 150,180 300,280 T 650,220" />
    <path d="M -50,300 Q 150,230 300,330 T 650,270" />
    <path d="M -50,350 Q 150,280 300,380 T 650,320" />
    <path d="M -50,400 Q 150,330 300,430 T 650,370" />
    <path d="M -50,450 Q 150,380 300,480 T 650,420" />
    <path d="M -50,500 Q 150,430 300,530 T 650,470" />
    <!-- Center topographic loop -->
    <ellipse cx="380" cy="300" rx="140" ry="80" stroke="rgba(255,107,26,0.08)" stroke-width="1.5" stroke-dasharray="4 4" />
    <ellipse cx="380" cy="300" rx="110" ry="60" stroke="rgba(0,229,255,0.08)" stroke-width="1.2" />
    <ellipse cx="380" cy="300" rx="80" ry="40" stroke="rgba(255,107,26,0.12)" stroke-width="1" />
  </g>
</svg>"""

with open('assets/images/layer-lines.svg', 'w') as f:
    f.write(layer_lines_svg)

# 2. Portfolio Items SVGs (Custom crafted 3D isometric & technical renders)
items = [
    {
        "filename": "mechanical-gear.svg",
        "title": "High-Torque Cycloidal Drive",
        "cat": "mechanical",
        "color": "#FF6B1A",
        "svg": """<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" class="portfolio-svg">
  <defs>
    <linearGradient id="gearGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#242B35" />
      <stop offset="50%" stop-color="#181D24" />
      <stop offset="100%" stop-color="#0F1217" />
    </linearGradient>
    <linearGradient id="orangeGlow" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#FF6B1A" />
      <stop offset="100%" stop-color="#FF9E42" />
    </linearGradient>
  </defs>
  <!-- Background Grid -->
  <rect width="400" height="300" fill="#0D1015"/>
  <circle cx="200" cy="150" r="110" fill="none" stroke="rgba(255,107,26,0.15)" stroke-width="1" stroke-dasharray="3 3"/>
  <circle cx="200" cy="150" r="130" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
  
  <!-- Sliced Layer Stack Effect -->
  <g transform="translate(0, 15)">
    <!-- Base Layer Shadow -->
    <ellipse cx="200" cy="180" rx="85" ry="35" fill="rgba(0,0,0,0.6)"/>
    
    <!-- 3D Layer Slices for Gear -->
    <!-- Layer 1 -->
    <path d="M 200,90 L 225,95 L 245,80 L 260,98 L 285,95 L 290,118 L 310,128 L 300,150 L 312,172 L 295,188 L 295,210 L 270,215 L 255,230 L 230,225 L 210,235 L 190,225 L 165,230 L 150,215 L 125,210 L 125,188 L 108,172 L 120,150 L 110,128 L 130,118 L 135,95 L 160,98 L 175,80 L 195,95 Z" fill="url(#gearGrad)" stroke="#3A4452" stroke-width="1.5"/>
    
    <!-- Layer Lines lines on gear side -->
    <path d="M 120,150 Q 200,170 300,150" fill="none" stroke="rgba(255,107,26,0.4)" stroke-width="1"/>
    <path d="M 115,160 Q 200,180 305,160" fill="none" stroke="rgba(255,107,26,0.25)" stroke-width="1"/>
    <path d="M 110,170 Q 200,190 310,170" fill="none" stroke="rgba(255,107,26,0.2)" stroke-width="1"/>
    
    <!-- Inner Core & Bearings -->
    <circle cx="200" cy="150" r="42" fill="#12151B" stroke="url(#orangeGlow)" stroke-width="2"/>
    <circle cx="200" cy="150" r="28" fill="#090B0E" stroke="#3A4452" stroke-width="1.5"/>
    <circle cx="200" cy="150" r="14" fill="#FF6B1A" fill-opacity="0.2" stroke="#FF6B1A" stroke-width="1"/>
    
    <!-- Keyway notch -->
    <rect x="196" y="128" width="8" height="12" fill="#090B0E" stroke="#3A4452" stroke-width="1"/>
    
    <!-- Weight reduction pockets with gyroid infill hints -->
    <circle cx="165" cy="130" r="10" fill="#171A21" stroke="rgba(255,107,26,0.5)" stroke-width="1.2"/>
    <circle cx="235" cy="130" r="10" fill="#171A21" stroke="rgba(255,107,26,0.5)" stroke-width="1.2"/>
    <circle cx="165" cy="170" r="10" fill="#171A21" stroke="rgba(255,107,26,0.5)" stroke-width="1.2"/>
    <circle cx="235" cy="170" r="10" fill="#171A21" stroke="rgba(255,107,26,0.5)" stroke-width="1.2"/>
  </g>
  
  <!-- Technical Annotations -->
  <text x="25" y="40" fill="#6A778B" font-family="monospace" font-size="11">CF-PETG / TOLERANCE ±0.04mm</text>
  <line x1="25" y1="46" x2="190" y2="46" stroke="#FF6B1A" stroke-width="1" stroke-opacity="0.6"/>
  <text x="320" y="275" fill="#00E5FF" font-family="monospace" font-size="11" text-anchor="end">LAYER: 0.12mm</text>
</svg>"""
    },
    {
        "filename": "miniature-dragon.svg",
        "title": "8K Resin Archmage Figurine",
        "cat": "miniatures",
        "color": "#00E5FF",
        "svg": """<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" class="portfolio-svg">
  <defs>
    <linearGradient id="resinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#2A3540" />
      <stop offset="50%" stop-color="#1A222B" />
      <stop offset="100%" stop-color="#0E1318" />
    </linearGradient>
    <linearGradient id="cyanGlow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00E5FF" />
      <stop offset="100%" stop-color="#0077FF" />
    </linearGradient>
  </defs>
  <rect width="400" height="300" fill="#0A0E14"/>
  <circle cx="200" cy="150" r="120" fill="none" stroke="rgba(0,229,255,0.1)" stroke-width="1"/>
  
  <!-- Hexagonal Pedestal Base -->
  <polygon points="200,230 250,245 250,260 200,275 150,260 150,245" fill="#151C24" stroke="url(#cyanGlow)" stroke-width="1.5"/>
  
  <!-- Miniature Silhouette / Geometry with ultra-sharp facets -->
  <g transform="translate(0, -10)">
    <!-- Cloak & Wings -->
    <path d="M 200,80 Q 150,90 130,140 Q 120,180 150,235 L 200,225 L 250,235 Q 280,180 270,140 Q 250,90 200,80 Z" fill="url(#resinGrad)" stroke="#3E4F61" stroke-width="1.2"/>
    <!-- Faceted folds -->
    <path d="M 200,80 L 180,150 L 165,230" stroke="rgba(0,229,255,0.4)" stroke-width="1" fill="none"/>
    <path d="M 200,80 L 220,150 L 235,230" stroke="rgba(0,229,255,0.4)" stroke-width="1" fill="none"/>
    <path d="M 180,150 L 200,190 L 220,150" stroke="rgba(255,255,255,0.2)" stroke-width="1" fill="none"/>
    
    <!-- Wizard Staff / Energy Orb -->
    <line x1="240" y1="60" x2="248" y2="235" stroke="#485B70" stroke-width="3"/>
    <circle cx="240" cy="55" r="14" fill="#00E5FF" fill-opacity="0.2" stroke="#00E5FF" stroke-width="2"/>
    <circle cx="240" cy="55" r="6" fill="#FFFFFF"/>
    <!-- Magical ring aura -->
    <ellipse cx="240" cy="55" rx="22" ry="7" fill="none" stroke="#00E5FF" stroke-width="1.2" stroke-dasharray="2 2" transform="rotate(-25 240 55)"/>
    
    <!-- Helmet / Visage -->
    <polygon points="200,90 190,115 200,125 210,115" fill="#202A35" stroke="#00E5FF" stroke-width="1.5"/>
  </g>
  
  <text x="25" y="40" fill="#6A778B" font-family="monospace" font-size="11">8K UV RESIN / 28µm XY RESOLUTION</text>
  <line x1="25" y1="46" x2="210" y2="46" stroke="#00E5FF" stroke-width="1" stroke-opacity="0.6"/>
  <text x="375" y="275" fill="#FF6B1A" font-family="monospace" font-size="11" text-anchor="end">LAYER: 0.03mm (30µm)</text>
</svg>"""
    },
    {
        "filename": "prototype-drone.svg",
        "title": "Aerodynamic Drone Arm & Duct",
        "cat": "prototypes",
        "color": "#FF6B1A",
        "svg": """<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" class="portfolio-svg">
  <defs>
    <linearGradient id="cfGrad" x1="0%" y1="0%" x2="100%" y2="50%">
      <stop offset="0%" stop-color="#1E232B" />
      <stop offset="100%" stop-color="#101317" />
    </linearGradient>
  </defs>
  <rect width="400" height="300" fill="#0B0D11"/>
  
  <!-- Vector grid lines -->
  <line x1="50" y1="150" x2="350" y2="150" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
  <line x1="200" y1="30" x2="200" y2="270" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
  
  <!-- Drone Arm Assembly Isometric -->
  <g transform="translate(10, 0)">
    <!-- Motor Duct Ring -->
    <ellipse cx="260" cy="140" rx="75" ry="50" fill="url(#cfGrad)" stroke="#FF6B1A" stroke-width="2"/>
    <ellipse cx="260" cy="140" rx="52" ry="34" fill="#0A0C0E" stroke="#3A4554" stroke-width="1.5"/>
    
    <!-- Motor Mount Stators (Generative Truss) -->
    <line x1="260" y1="140" x2="210" y2="120" stroke="#FF6B1A" stroke-width="2.5"/>
    <line x1="260" y1="140" x2="310" y2="120" stroke="#FF6B1A" stroke-width="2.5"/>
    <line x1="260" y1="140" x2="260" y2="174" stroke="#FF6B1A" stroke-width="2.5"/>
    <circle cx="260" cy="140" r="14" fill="#1C222B" stroke="#00E5FF" stroke-width="2"/>
    
    <!-- Aerodynamic Spar Body extending to chassis -->
    <path d="M 80,165 L 195,145 L 205,160 L 85,185 Z" fill="#1A1F26" stroke="#4B5868" stroke-width="1.5"/>
    <path d="M 80,165 L 120,130 L 200,125 L 195,145 Z" fill="#242B35" stroke="#FF6B1A" stroke-width="1.2"/>
    
    <!-- Lightweight topology cutouts -->
    <polygon points="105,155 125,142 145,152 125,165" fill="#0B0D11" stroke="rgba(255,107,26,0.6)" stroke-width="1"/>
    <polygon points="150,150 170,138 185,148 165,160" fill="#0B0D11" stroke="rgba(255,107,26,0.6)" stroke-width="1"/>
    
    <!-- M3 Brass Thread Insert Callout -->
    <circle cx="75" cy="175" r="5" fill="#FFC72C" stroke="#B8860B" stroke-width="1.5"/>
  </g>
  
  <text x="25" y="40" fill="#6A778B" font-family="monospace" font-size="11">PA12-CF / HEAT DEFLECTION 165°C</text>
  <line x1="25" y1="46" x2="210" y2="46" stroke="#FF6B1A" stroke-width="1" stroke-opacity="0.6"/>
  <text x="375" y="275" fill="#00E5FF" font-family="monospace" font-size="11" text-anchor="end">WEIGHT: 34.2g</text>
</svg>"""
    },
    {
        "filename": "art-voronoi-lamp.svg",
        "title": "Parametric Voronoi Luminaire",
        "cat": "art",
        "color": "#FF6B1A",
        "svg": """<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" class="portfolio-svg">
  <defs>
    <linearGradient id="warmLight" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFA84A" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#FF5500" stop-opacity="0.1"/>
    </linearGradient>
    <radialGradient id="lampGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FF7700" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="400" height="300" fill="#0C0E12"/>
  
  <!-- Ambient Internal Glow -->
  <circle cx="200" cy="150" r="100" fill="url(#lampGlow)"/>
  
  <!-- Voronoi Vessel Silhouette -->
  <g transform="translate(0, -5)">
    <!-- Base stand -->
    <ellipse cx="200" cy="245" rx="55" ry="12" fill="#161B22" stroke="#374151" stroke-width="1.5"/>
    
    <!-- Outer Contour -->
    <path d="M 160,70 Q 120,140 145,210 Q 160,240 200,240 Q 240,240 255,210 Q 280,140 240,70 Q 200,60 160,70 Z" fill="#151921" stroke="#FF6B1A" stroke-width="1.8"/>
    
    <!-- Internal Light Core -->
    <cylinder>
      <line x1="200" y1="80" x2="200" y2="230" stroke="#FFF3D6" stroke-width="6" stroke-linecap="round"/>
    </cylinder>
    
    <!-- Voronoi Cutout Cells -->
    <polygon points="180,90 195,85 205,95 195,110 180,105" fill="url(#warmLight)" stroke="#FF9E42" stroke-width="1.2"/>
    <polygon points="215,90 230,95 235,115 220,120 208,105" fill="url(#warmLight)" stroke="#FF9E42" stroke-width="1.2"/>
    <polygon points="160,110 175,108 180,128 165,140 150,125" fill="url(#warmLight)" stroke="#FF9E42" stroke-width="1.2"/>
    <polygon points="185,120 210,115 215,140 195,150 178,135" fill="url(#warmLight)" stroke="#FF9E42" stroke-width="1.5"/>
    <polygon points="225,125 245,130 250,155 230,160 218,142" fill="url(#warmLight)" stroke="#FF9E42" stroke-width="1.2"/>
    <polygon points="150,150 170,145 175,175 155,185 140,165" fill="url(#warmLight)" stroke="#FF9E42" stroke-width="1.2"/>
    <polygon points="182,155 212,150 215,180 192,192 178,175" fill="url(#warmLight)" stroke="#FF9E42" stroke-width="1.5"/>
    <polygon points="220,165 245,165 248,195 228,200 215,185" fill="url(#warmLight)" stroke="#FF9E42" stroke-width="1.2"/>
    <polygon points="165,190 185,185 192,215 175,225 160,205" fill="url(#warmLight)" stroke="#FF9E42" stroke-width="1.2"/>
    <polygon points="198,198 220,192 225,220 205,228 192,215" fill="url(#warmLight)" stroke="#FF9E42" stroke-width="1.2"/>
  </g>
  
  <text x="25" y="40" fill="#6A778B" font-family="monospace" font-size="11">MATTE PLA / SPIRAL VASE MODE</text>
  <line x1="25" y1="46" x2="200" y2="46" stroke="#FF6B1A" stroke-width="1" stroke-opacity="0.6"/>
  <text x="375" y="275" fill="#FFA84A" font-family="monospace" font-size="11" text-anchor="end">PRINT TIME: 6h 12m</text>
</svg>"""
    },
    {
        "filename": "prototype-enclosure.svg",
        "title": "IP67 Sensor Enclosure with Gasket",
        "cat": "prototypes",
        "color": "#00E5FF",
        "svg": """<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" class="portfolio-svg">
  <defs>
    <linearGradient id="darkEnclosure" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#232A33"/>
      <stop offset="100%" stop-color="#111419"/>
    </linearGradient>
  </defs>
  <rect width="400" height="300" fill="#0A0D12"/>
  
  <!-- Exploded Assembly View -->
  <g transform="translate(10, 0)">
    <!-- Top Lid (Floating) -->
    <path d="M 120,60 L 260,60 L 310,95 L 170,95 Z" fill="#2B3440" stroke="#00E5FF" stroke-width="1.5"/>
    <circle cx="140" cy="70" r="3" fill="#00E5FF"/>
    <circle cx="240" cy="70" r="3" fill="#00E5FF"/>
    <circle cx="190" cy="85" r="3" fill="#00E5FF"/>
    <circle cx="290" cy="85" r="3" fill="#00E5FF"/>
    <rect x="200" y="70" width="40" height="15" rx="2" fill="#12161D" stroke="#4E5D6E" stroke-width="1"/>
    
    <!-- TPU Gasket (Neon Orange Accent) -->
    <path d="M 125,115 L 255,115 L 305,145 L 175,145 Z" fill="none" stroke="#FF6B1A" stroke-width="3" stroke-dasharray="6 3"/>
    
    <!-- Base Enclosure Box -->
    <path d="M 120,160 L 260,160 L 310,195 L 170,195 Z" fill="url(#darkEnclosure)" stroke="#425061" stroke-width="1.5"/>
    <!-- Box Side Walls -->
    <path d="M 120,160 L 120,210 L 170,245 L 170,195 Z" fill="#171C23" stroke="#425061" stroke-width="1.5"/>
    <path d="M 170,195 L 170,245 L 310,245 L 310,195 Z" fill="#1E242E" stroke="#425061" stroke-width="1.5"/>
    
    <!-- PCB Bosses inside bottom -->
    <circle cx="180" cy="180" r="4" fill="#00E5FF" stroke="#0088AA" stroke-width="1"/>
    <circle cx="250" cy="180" r="4" fill="#00E5FF" stroke="#0088AA" stroke-width="1"/>
    
    <!-- Exploded Guide Projection Lines -->
    <line x1="120" y1="60" x2="120" y2="160" stroke="#00E5FF" stroke-width="1" stroke-dasharray="3 3" stroke-opacity="0.5"/>
    <line x1="310" y1="95" x2="310" y2="195" stroke="#00E5FF" stroke-width="1" stroke-dasharray="3 3" stroke-opacity="0.5"/>
  </g>
  
  <text x="25" y="40" fill="#6A778B" font-family="monospace" font-size="11">PETG BODY + TPU 95A GASKET</text>
  <line x1="25" y1="46" x2="200" y2="46" stroke="#00E5FF" stroke-width="1" stroke-opacity="0.6"/>
  <text x="375" y="275" fill="#00E5FF" font-family="monospace" font-size="11" text-anchor="end">IP67 WEATHERPROOF</text>
</svg>"""
    },
    {
        "filename": "mechanical-bracket.svg",
        "title": "Generative Topology Aerospace Bracket",
        "cat": "mechanical",
        "color": "#FF6B1A",
        "svg": """<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" class="portfolio-svg">
  <defs>
    <linearGradient id="bracketGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#262F3B"/>
      <stop offset="50%" stop-color="#191F26"/>
      <stop offset="100%" stop-color="#0E1217"/>
    </linearGradient>
  </defs>
  <rect width="400" height="300" fill="#0A0C10"/>
  <circle cx="200" cy="150" r="110" fill="none" stroke="rgba(255,107,26,0.12)" stroke-width="1"/>
  
  <!-- Organic Generative Bracket Geometry -->
  <g transform="translate(15, 0)">
    <!-- Main structural web -->
    <path d="M 80,210 L 80,110 Q 80,80 110,80 L 160,80 Q 220,120 280,120 L 310,120 Q 320,120 320,135 L 320,165 Q 320,180 305,180 L 250,180 Q 180,210 130,210 Z" fill="url(#bracketGrad)" stroke="#FF6B1A" stroke-width="2"/>
    
    <!-- Organic Lattice Voids (Stress-Relief Cutouts) -->
    <path d="M 115,115 Q 150,110 165,135 Q 140,160 115,150 Z" fill="#0A0C10" stroke="#48596E" stroke-width="1.2"/>
    <path d="M 185,140 Q 225,135 240,155 Q 215,175 180,165 Z" fill="#0A0C10" stroke="#48596E" stroke-width="1.2"/>
    <path d="M 115,170 Q 140,170 145,190 L 115,190 Z" fill="#0A0C10" stroke="#48596E" stroke-width="1.2"/>
    
    <!-- Fastener Bushings with stress gradient halos -->
    <circle cx="110" cy="100" r="14" fill="#12161C" stroke="#00E5FF" stroke-width="2"/>
    <circle cx="110" cy="100" r="6" fill="#0A0C10" stroke="#FFF" stroke-width="1"/>
    
    <circle cx="295" cy="150" r="16" fill="#12161C" stroke="#00E5FF" stroke-width="2"/>
    <circle cx="295" cy="150" r="8" fill="#0A0C10" stroke="#FFF" stroke-width="1"/>
    
    <!-- Load vector arrows -->
    <line x1="295" y1="100" x2="295" y2="128" stroke="#FF5500" stroke-width="2" marker-end="url(#arrow)"/>
    <text x="310" y="112" fill="#FF6B1A" font-family="monospace" font-size="10">2.4 kN LOAD</text>
  </g>
  
  <text x="25" y="40" fill="#6A778B" font-family="monospace" font-size="11">ULTEM 9085 / FEA OPTIMIZED</text>
  <line x1="25" y1="46" x2="190" y2="46" stroke="#FF6B1A" stroke-width="1" stroke-opacity="0.6"/>
  <text x="375" y="275" fill="#00E5FF" font-family="monospace" font-size="11" text-anchor="end">MASS REDUCTION: -62%</text>
</svg>"""
    }
]

for item in items:
    with open(f"assets/images/{item['filename']}", 'w') as f:
        f.write(item['svg'])

print("All asset SVGs generated successfully.")
