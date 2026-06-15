
<script lang="ts" setup>

</script>

<style>

</style><template>
  <section class="py-12 sm:py-16 px-4">
    <div class="max-w-2xl mx-auto">
      <h2 class="text-2xl sm:text-3xl font-bold text-center text-gray-800 dark:text-gray-100 mb-2">
        Zone de couverture
      </h2>
      <p class="text-center text-gray-500 dark:text-gray-400 text-sm sm:text-base mb-8">
        Service disponible dans un rayon d'environ 30-40 min de Shawinigan
      </p>

      <div class="bg-gray-900 rounded-2xl shadow-xl overflow-hidden border border-sky-900">
        <svg width="100%" viewBox="0 0 680 640" role="img" aria-labelledby="carte-titre carte-desc">
          <title id="carte-titre">Zone de couverture — Nicolas Lamarque, T.S.</title>
          <desc id="carte-desc">Carte de la Mauricie montrant la zone de couverture de Nicolas Lamarque T.S. dans un rayon de 30-40 minutes de Shawinigan</desc>

          <rect x="0" y="0" width="680" height="640" fill="#0f172a"/>

          <!-- Fleuve Saint-Laurent -->
          <path d="M 0 575 Q 200 558 340 565 Q 470 572 680 558" fill="none" stroke="#1d4ed8" stroke-width="9" stroke-linecap="round" opacity="0.35"/>
          <text x="120" y="592" font-size="10" fill="#3b82f6" font-family="sans-serif">Fleuve Saint-Laurent</text>

          <!-- Rivière Saint-Maurice -->
          <path d="M 335 85 Q 332 150 330 210 Q 328 270 326 330 Q 324 390 322 450 Q 320 500 318 555" fill="none" stroke="#1d4ed8" stroke-width="4" stroke-linecap="round" opacity="0.45"/>
          <text x="342" y="310" font-size="10" fill="#3b82f6" font-family="sans-serif" transform="rotate(-88, 342, 310)">Rivière Saint-Maurice</text>

          <!-- Zone de couverture -->
          <polygon points="295,90 390,82 470,105 520,170 530,255 510,340 480,410 460,460 420,510 380,555 330,565 275,550 230,510 195,460 175,375 172,255 188,175 235,115" fill="#0369a1" opacity="0.15" stroke="#0ea5e9" stroke-width="1.5" stroke-dasharray="6,4"/>

          <!-- Nord -->
          <text x="50" y="100" font-size="12" font-weight="500" fill="#64748b" font-family="sans-serif">N ↑</text>

          <!-- Shawinigan -->
          <circle cx="310" cy="430" r="14" fill="#0ea5e9" stroke="#38bdf8" stroke-width="2"/>
          <circle cx="310" cy="430" r="5" fill="white"/>
          <text x="310" y="413" text-anchor="middle" font-size="13" font-weight="500" fill="#f0f9ff" font-family="sans-serif">Shawinigan</text>
          <text x="310" y="426" text-anchor="middle" font-size="10" fill="#7dd3fc" font-family="sans-serif">(bureau)</text>

          <!-- Grand-Mère -->
          <circle cx="370" cy="400" r="7" fill="#0369a1" stroke="#38bdf8" stroke-width="1"/>
          <text x="382" y="404" font-size="11" fill="#bae6fd" font-family="sans-serif">Grand-Mère</text>

          <!-- Lac-à-la-Tortue -->
          <circle cx="420" cy="375" r="6" fill="#0369a1" stroke="#38bdf8" stroke-width="1"/>
          <text x="430" y="379" font-size="10" fill="#bae6fd" font-family="sans-serif">Lac-à-la-Tortue</text>

          <!-- Sainte-Flore -->
          <circle cx="248" cy="400" r="6" fill="#0369a1" stroke="#38bdf8" stroke-width="1"/>
          <text x="175" y="404" font-size="10" fill="#bae6fd" font-family="sans-serif">Sainte-Flore</text>

          <!-- Grandes-Piles -->
          <circle cx="270" cy="340" r="6" fill="#0369a1" stroke="#38bdf8" stroke-width="1"/>
          <text x="195" y="344" font-size="10" fill="#bae6fd" font-family="sans-serif">Grandes-Piles</text>

          <!-- Hérouxville -->
          <circle cx="255" cy="280" r="7" fill="#0369a1" stroke="#38bdf8" stroke-width="1"/>
          <text x="168" y="284" font-size="11" fill="#bae6fd" font-family="sans-serif">Hérouxville</text>

          <!-- Saint-Tite -->
          <circle cx="385" cy="250" r="8" fill="#0369a1" stroke="#38bdf8" stroke-width="1"/>
          <text x="397" y="254" font-size="11" fill="#bae6fd" font-family="sans-serif">Saint-Tite</text>

          <!-- Sainte-Thècle -->
          <circle cx="400" cy="180" r="7" fill="#0369a1" stroke="#38bdf8" stroke-width="1"/>
          <text x="412" y="184" font-size="11" fill="#bae6fd" font-family="sans-serif">Sainte-Thècle</text>

          <!-- Saint-Séverin -->
          <circle cx="470" cy="270" r="6" fill="#0369a1" stroke="#38bdf8" stroke-width="1"/>
          <text x="480" y="274" font-size="10" fill="#bae6fd" font-family="sans-serif">Saint-Séverin</text>

          <!-- Saint-Boniface -->
          <circle cx="225" cy="355" r="6" fill="#0369a1" stroke="#38bdf8" stroke-width="1"/>
          <text x="152" y="359" font-size="10" fill="#bae6fd" font-family="sans-serif">Saint-Boniface</text>

          <!-- N.-D.-du-Mont-Carmel -->
          <circle cx="360" cy="490" r="6" fill="#0369a1" stroke="#38bdf8" stroke-width="1"/>
          <text x="370" y="486" font-size="10" fill="#bae6fd" font-family="sans-serif">N.-D.-du-Mont-Carmel</text>

          <!-- Trois-Rivières -->
          <circle cx="345" cy="545" r="10" fill="#0284c7" stroke="#38bdf8" stroke-width="1.5"/>
          <text x="360" y="541" font-size="12" font-weight="500" fill="#e0f2fe" font-family="sans-serif">Trois-Rivières</text>
          <text x="360" y="554" font-size="10" fill="#7dd3fc" font-family="sans-serif">Cap-de-la-Madeleine</text>

          <!-- Louiseville -->
          <circle cx="470" cy="490" r="6" fill="#0369a1" stroke="#38bdf8" stroke-width="1"/>
          <text x="480" y="494" font-size="10" fill="#bae6fd" font-family="sans-serif">Louiseville</text>

          <!-- Légende -->
          <rect x="28" y="528" width="205" height="82" rx="8" fill="#0f172a" stroke="#1e3a5f" stroke-width="0.5"/>
          <text x="44" y="548" font-size="11" font-weight="500" fill="#e2e8f0" font-family="sans-serif">Légende</text>
          <circle cx="46" cy="564" r="6" fill="#0ea5e9" stroke="#38bdf8" stroke-width="1.5"/>
          <circle cx="46" cy="564" r="2" fill="white"/>
          <text x="58" y="568" font-size="10" fill="#bae6fd" font-family="sans-serif">Bureau principal (Shawinigan)</text>
          <circle cx="46" cy="582" r="5" fill="#0369a1" stroke="#38bdf8" stroke-width="1"/>
          <text x="58" y="586" font-size="10" fill="#bae6fd" font-family="sans-serif">Villes et secteurs couverts</text>
          <rect x="40" y="595" width="14" height="8" rx="2" fill="#0369a1" opacity="0.3" stroke="#0ea5e9" stroke-width="1" stroke-dasharray="3,2"/>
          <text x="58" y="603" font-size="10" fill="#bae6fd" font-family="sans-serif">Zone (~40 min de Shawinigan)</text>

          <!-- CTA -->
          <rect x="445" y="55" width="200" height="50" rx="8" fill="#0c2340" stroke="#0ea5e9" stroke-width="1"/>
<text x="545" y="76" text-anchor="middle" font-size="11" font-weight="500" fill="#7dd3fc" font-family="sans-serif">Conseils gratuits</text>
<text x="545" y="95" text-anchor="middle" font-size="14" font-weight="500" fill="#f0f9ff" font-family="sans-serif">(418) 931-6786</text>
        </svg>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
</script>