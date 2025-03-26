let productIndex = 0;

    function addProductRow() {
      const productList = document.getElementById('product-list');
      const index = productIndex++;

      const productRow = document.createElement('div');
      productRow.classList.add('product-row');
      productRow.innerHTML = `
        <button class="remove" onclick="removeProductRow(${index})">Remove</button>
        <label for="category-${index}">Category:</label>
        <select id="category-${index}" onchange="handleCategoryChange(${index})">
          <option value="">--Select Category--</option>
          <option value="kiloan">Laundry Kiloan</option>
          <option value="satuan">Laundry Satuan</option>
        </select>

        <div id="subcategories-${index}" class="hidden">
          <!-- Subcategories will be dynamically populated here -->
        </div>

        <label for="quantity-${index}">Quantity:</label>
        <input type="number" id="quantity-${index}" min="1" value="1">

        <label for="date-${index}">Date:</label>
        <input type="date" id="date-${index}">
      `;

      productList.appendChild(productRow);
    }

    function handleCategoryChange(index) {
      const category = document.getElementById(`category-${index}`).value;
      const subcategoriesDiv = document.getElementById(`subcategories-${index}`);
      subcategoriesDiv.innerHTML = '';
      subcategoriesDiv.classList.remove('hidden');

      if (category === 'kiloan') {
        subcategoriesDiv.innerHTML = `
          <label for="subcategory-${index}">Subcategory:</label>
          <select id="subcategory-${index}">
            <option value="reguler">Laundry Reguler (Rp 9,000/kg)</option>
            <option value="ekspres">Laundry Ekspres (Rp 12,000/kg)</option>
            <option value="kilat">Laundry Kilat (Rp 15,000/kg)</option>
          </select>
        `;
      } else if (category === 'satuan') {
        subcategoriesDiv.innerHTML = `
          <label for="subcategory-${index}">Subcategory:</label>
          <select id="subcategory-${index}">
                        <option value="karpet">Karpet (Rp 15.000/m)</option>
			<option value="karpet-tebal">Karpet tebal (Rp 17.500/m)</option>
			<option value="karpet-tipis">Karpet tipis(Rp 12.500/m)</option>
                        <option value="bedcover">Bedcover (Rp 30.000,-)</option>
			<option value="bedcover-large">Bedcover large (Rp 35.000,-)</option>
			<option value="bedcover-single">Bedcover single (Rp 25.000,-)</option>
                        <option value="boneka15">Boneka <15cm</option>
			<option value="boneka20">Boneka 20-30 cm (Rp 11.500,-)</option>
			<option value="boneka30">Boneka 30-40 cm (Rp 15.000,-)</option>
			<option value="boneka40">Boneka 40-50 cm (Rp 18.500,-)</option>
			<option value="boneka50">Boneka 50-70 cm (Rp 26.000,-)</option>
			<option value="boneka70">Boneka 70-80 cm (Rp 33.000,-)</option>
			<option value="boneka80">Boneka 80-100 cm (Rp 40.000,-)</option>
			<option value="sepatu-balap">Sepatu balap (Rp 14.000)</option>
			<option value="sepatu-balap-anak">Sepatu balap anak(Rp 14.000)</option>
			<option value="sepatu-balet-anak">Sepatu balet anak (Rp 15.500)</option>
			<option value="sepatu-boot">Sepatu boot (Rp 27.000)</option>
			<option value="sepatu-olahraga">Sepatu olahraga (Rp 24.500)</option>
			<option value="sepatu-olahraga-anak">Sepatu olahraga anak(Rp 12.000)</option>
			<option value="sepatu-pantofel-kulit">Sepatu pantofel kulit (Rp 29.000)</option>
			<option value="sepatu-pantofel-kulit-anak">Sepatu pantofel kulit anak (Rp 14.000)</option>
			<option value="sepatu-wanita">Sepatu wanita (Rp 27.500)</option>
			<option value="sepatu-wanita-sebetis">Sepatu wanita sebetis(Rp 37.500)</option>
			<option value="kasur-busa-besar">Kasur busa besar (Rp 50.500)</option>
			<option value="kasur-busa-double">Kasur busa double (Rp 55.000)</option>
			<option value="kasur-busa-kecil">Kasur busa kecil(Rp 36.000)</option>
			<option value="kasur-busa-keranjang">Kasur busa keranjang (Rp 21.000)</option>
			<option value="kasur-busa-single">Kasur busa single (Rp 48.500)</option>
			<option value="kasur-dakron-besar">Kasur dakron besar (Rp 50.500)</option>
			<option value="kasur-dakron-sedang">Kasur dakron sedang (Rp 43.000)</option>
			<option value="kasur-palembang-besar">Kasur palembang besar (Rp 50.500)</option>
			<option value="kasur-palembang-sedang">Kasur palembang sedang (Rp 43.000)</option>
			<option value="kasur-palembang-single">Kasur palembang single (Rp 41.500)</option>
			<option value="matras-busa-besar">Matras busa besar (Rp 33.500)</option>
			<option value="matras-busa-kecil">Matras busa kecil (Rp 24.500)</option>
			<option value="matras-busa-sedang">Matras busa sedang(Rp 27.500)</option>
			<option value="matras-springbed-double">Matras springbed double (Rp 35.000)</option>
			<option value="matras-springbed-single">Matras springbed single (Rp 27.500)</option>
			<option value="springbed-single">Springbed single (Rp 108.000)</option>
			<option value="springbed-double">Springbed double (Rp 144.000)</option>
			<option value="sprei-polos-besar">Sprei polos besar/ double(Rp 13.000)</option>
			<option value="sprei-polos-besar-bayi">Sprei polos besar/ double bayi (Rp 5.500)</option>
			<option value="sprei-polos-kecil">Sprei polos kecil/ single (Rp 11.500)</option>
			<option value="sprei-polos-kecil-bayi">Sprei polos kecil/ single bayi (Rp 5.500)</option>
			<option value="sprei-rempel-besar">Sprei rempel besar/ double (Rp 20.500)</option>
			<option value="sprei-rempel-kecil">Sprei rempel kecil/ single (Rp 17.500)</option>
			<option value="bantal">Bantal	(Rp 15.500)</option>
			<option value="bantal-bayi">Bantal bayi (Rp9.500)</option>
			<option value="bantal-boneka">Bantal boneka (Rp 14.000)</option>
			<option value="bantal-kursi">Bantal kursi (Rp 15.500)</option>
			<option value="bantal-boneka">Bantal boneka (Rp 14.000)</option>
			<option value="bantal-kursi">Bantal kursi (Rp 15.500)</option>
			<option value="bantal-lantai">Bantal lantai (Rp 30.000)</option>
			<option value="bantalan-sandaran-mobil">Bantalan sandaran mobil (Rp 11.500)</option>
			<option value="bantalan-tempat-duduk">Bantalan tempat duduk (Rp 35.000)</option>
			<option value="sarung-bantal-besar">Sarung bantal besar (Rp 9.500)</option>
			<option value="sarung-bantal-kursi">Sarung bantal kursi (Rp 8.500)</option>
			<option value="sarung-bantal-lantai">Sarung bantal lantai (Rp 13.000)</option>
			<option value="sarung-bantal-guling-polos">Sarung bantal/guling polos (Rp 7.000)</option>
			<option value="sarung-bantal-guling-satin">Sarung bantal/guling satin (Rp 8.500)</option>
			<option value="sarung-bantal-guling-satin-bayi">Sarung bantal/guling satin bayi (Rp 4.000)</option>
			<option value="sarung-biasa">Sarung biasa (Rp 13.000)</option>
			<option value="sarung-biasa-anak">Sarung biasa anak (Rp 6.500)</option>
			<option value="sarung-kasur-busa-besar">Sarung kasur busa besar (Rp 17.000)</option>
			<option value="sarung-kasur-busa-kecil">Sarung kasur busa kecil (Rp 14.000)</option>
			<option value="selimut-bayi">Selimut bayi (Rp 11.500)</option>
			<option value="selimut-handuk">Selimut handuk (Rp 17.500)</option>
			<option value="selimut-karpet">Selimut karpet (Rp 21.500)</option>
			<option value="selimut-tebal">Selimut tebal (Rp 21.000)</option>
			<option value="selimut-tikar">Selimut tikar (Rp 21.000)</option>
			<option value="selimut-tipis">Selimut tipis (Rp 17.500)</option>
			<option value="tas-aksesoris">Tas aksesoris (Rp 21.000)</option>
			<option value="tas-bayi-besar">tas-bayi-besar (Rp 18.500)</option>
			<option value="tas-bayi-kecil">Tas bayi kecil (Rp 15.000)</option>
			<option value="tas-bayi-sedang">Tas bayi sedang (Rp 21.000)</option>
			<option value="tas-biasa-besar">Tas biasa besar (Rp 20.500)</option>
			<option value="tas-biasa-kecil">Tas biasa kecil (Rp 15.000)</option>
			<option value="tas-biasa-sedang">Tas biasa sedang (Rp 18.500)</option>
			<option value="tas-boneka">Tas boneka (Rp 17.000)</option>
			<option value="tas-gunung">Tas gunung (Rp 27.500)</option>
			<option value="tas-koper-besar">Tas koper besari (Rp 60.500)</option>
			<option value="tas-koper-besar-anak">tas-koper besar-anak (Rp 29.500)</option>
			<option value="tas-koper-sedang">Tas koper sedang (Rp 50.500)</option>
			<option value="tas-koper-sedang-anak">Tas koper sedang anak (Rp 25.000)</option>
			<option value="tas-kulit">Tas kulit (Rp 69.000)</option>
			<option value="tas-kulit-bermerk">Tas kulit bermerk (Rp 96.500)</option>
			<option value="tas-kulit-bermerk-anak">Tas kulit bermerk anak (Rp 41.500)</option>
			<option value="tas-kulit-besar">Tas kulit besar (Rp 101.000)</option>
			<option value="tas-kulit-besar-anak">Tas kulit besar anak (Rp 35.000)</option>
			<option value="tas-kulit-kecil">Tas kulit kecil (Rp 57.500)</option>
			<option value="tas-kulit-kecil-anak">Tas kulit kecil anak (Rp 27.500)</option>
			<option value="tas-kulit-sedang">Tas kulit sedang (Rp 72.000)</option>
			<option value="tas-kulit-sedang-anak">Tas kulit sedang anak (Rp 32.000)</option>
			<option value="tas-mukena">Tas mukena (Rp 7.000)</option>
			<option value="tas-ransel">Tas ransel (Rp 27.500)</option>
			<option value="tas-ransel-anak">Tas ransel anak (Rp 21.000)</option>
			<option value="tas-sleepingbag">Tas sleepingbag (Rp 41.500)</option>
			<option value="tas-wanita">Tas wanita (Rp 27.500)</option>
                        <option value="alas-boks-bayi">Alas boks bayi (Rp 35.000)</option>
			<option value="alas-kasur-springbed">Alas kasur springbed (Rp 21.000)</option>
			<option value="alas-sofa">Alas sofa (Rp 9.500)</option>
			<option value="baby-doll">Baby doll (Rp 21.000)</option>
			<option value="babby-walker">Babby walker (Rp 17.000)</option>
			<option value="baju-bayi">Baju bayi (Rp 3.000)</option>
			<option value="baju-boneka-besar">Baju boneka besar (Rp 39.500)</option>
			<option value="baju-boneka-kecil">Baju boneka kecil (Rp 32.500)</option>
			<option value="baju-drumband-anak">Baju drumband anak (Rp 11.500)</option>
			<option value="baju-ihrom">Baju ihrom (Rp 17.500)</option>
			<option value="baju-ihrom-anak">Baju ihrom anak (Rp 8.500)</option>
			<option value="baju-koko">Baju koko (Rp 14.500)</option>
			<option value="baju-lab">Baju lab (Rp 11.000)</option>
			<option value="baju-muslim-selutut">Baju muslim selutut (Rp 18.500)</option>
			<option value="baju-muslim-selutut-anak">Baju muslim selutut anak (Rp 9.000)</option>
			<option value="baju-muslim-setumit-panjang">Baju muslim setumit/panjang (Rp 22.000)</option>
			<option value="baju-penganten-internasional-1">Baju penganten internasional 1 (Rp 108.000)</option>
			<option value="baju-penganten-internasional-2">Baju penganten internasional 2 (Rp 81.000)</option>
			<option value="baju-penganten-internasional-3">Baju penganten internasional 3 (Rp 54.000)</option>
			<option value="baju-penganten-jawa-nasional">Baju penganten jawa/nasional (Rp 36.000)</option>
			<option value="baju-safari-batik">Baju safari/batik (Rp 15.500)</option>
			<option value="baju-safari-anak">Baju safari anak (Rp 8.000)</option>
			<option value="beskap">Beskap (Rp 17.500)</option>
			<option value="beskap-anak">Beskap anak (Rp 8.500)</option>
			<option value="beskap-manten">Beskap manten (Rp 25.000)</option>
			<option value="blangkon">Blangkon (Rp 9.000)</option>
			<option value="blazer">Blazer (Rp 15.500)</option>
			<option value="blus">Blus (Rp 14.500)</option>
			<option value="blus-anak">Blus anak (Rp 7.000)</option>
			<option value="blus-panjang">blus panjang (Rp 18.500)</option>
			<option value="blus-pendek">Blus pendek (Rp 14.500)</option>
			<option value="body-suit">Body suit (Rp 13.000)</option>
			<option value="body-suit-anak">Body suit anak (Rp 7.000)</option>
			<option value="body-protector">Body protector (Rp 11.500)</option>
			<option value="boneka-bantal">Boneka bantal (Rp 14.000)</option>
			<option value="boks-bayi">boks bayi (Rp 57.500)</option>
			<option value="celana-3per4">Celana 3/4 (Rp 11.500)</option>
			<option value="celana-7per8">Celana 7/8 (Rp 13.000)</option>
			<option value="celana-7per8-anak">Celana 7/8 anak (Rp 4.000)</option>
			<option value="celana-bayi">Celana bayi (Rp 3.000)</option>
			<option value="celana-dalam">Celana dalam (Rp 6.500)</option>
			<option value="celana-dalam-anak">Celana dalam anak (Rp 3.500)</option>
			<option value="celana-panjang">Celana panjang (Rp 14.500)</option>
			<option value="celana-panjang-anak">Celana panjang anak (Rp 7.000)</option>
			<option value="celana-pendek">Celana pendek (Rp 11.500)</option>
			<option value="celana-pendek-anak">Celana pendek anak (Rp 5.500)</option>
			<option value="cover-tutup-mobil">Cover (tutup) mobil (Rp 37.000)</option>
			<option value="cover-tutup-motor">Cover (tutup) motor (Rp 23.500)</option>
			<option value="cover-galon">Cover galon (Rp 10.000)</option>
			<option value="cover-bedcover">Cover bedcover (Rp 14.000)</option>
			<option value="cover-jas">Cover jas (Rp 14.000)</option>
			<option value="cover-jok-minibus-stel">Cover jok minibus (stel) (Rp 79.000)</option>
			<option value="cover-jok-mobil-terpisah">Cover jok mobil (terpisah) (Rp 14.000)</option>
			<option value="cover-jok-mobil-sedan-stel">Cover jok mobil sedan (stel) (Rp 65.000)</option>
			<option value="cover-kulkas">Cover kulkas (Rp 10.000)</option>
			<option value="cover-magicjar">Cover magicjar (Rp 10.000)</option>
			<option value="cover-piano-besar">Cover piano besar (Rp 13.000)</option>
			<option value="cover-piano-sedang">Cover piano sedang (Rp 12.000)</option>
			<option value="cover-sofa-besar">Cover sofa besar (Rp 27.500)</option>
			<option value="cover-sofa-kecil">Cover sofa kecil (Rp 11.500)</option>
			<option value="cover-sofa-sedang">Cover sofa sedang (Rp 14.000)</option>
			<option value="cover-springbed">Cover springbed (Rp 21.000)</option>
			<option value="cover-springbed-besar">Cover springbed besar (Rp 30.000)</option>
			<option value="cover-tisu">Cover tisu (Rp 8.500)</option>
			<option value="cover-tudung-saji">Cover tudung saji (Rp 10.000)</option>
			<option value="daster">Daster (Rp 17.000)</option>
			<option value="gaun-panjang">Gaun panjang (Rp 24.000)</option>
			<option value="gaun-panjang-anak">Gaun panjang anak (Rp 12.000)</option>
			<option value="gaun-pendek-selutut">Gaun pendek (selutut) (Rp 8.000)</option>
			<option value="gaun-pendek-anak">Gaun pendek anak (Rp 9.000)</option>
			<option value="gaun-penganten-1">Gaun penganten 1 (Rp 124.000)</option>
			<option value="gaun-penganten-2">Gaun penganten 2 (Rp 83.000)</option>
			<option value="gaun-penganten-3">Gaun penganten 3 (Rp 62.500)</option>
			<option value="gaun-penganten-4">Gaun penganten 4 (Rp 35.000)</option>
			<option value="gaun-pesta-biasa">Gaun pesta biasa (Rp 35.000)</option>
			<option value="gaun-pesta-variasi">Gaun pesta variasi (Rp 41.500)</option>
			<option value="gendongan">Gendongan (Rp 11.500)</option>
			<option value="gorden-per-meter">Gorden per meter (Rp 8.000)</option>
			<option value="gorden-per-kg">Gorden per kg (Rp 12.000)</option>
			<option value="guling">Guling (Rp 15.500)</option>
			<option value="guling-bayi">Guling bayi (Rp 10.000)</option>
			<option value="gurita">Gurita (Rp 5.000)</option>
			<option value="handuk-besar">Handuk besar (Rp 11.500)</option>
			<option value="handuk-kecil">Handuk kecil (Rp 8.500)</option>
			<option value="handuk-sedang">Handuk sedang (Rp 10.000)</option>
			<option value="jaket-sweater">Jaket/sweater (Rp 17.500)</option>
			<option value="jaket-sweater-anak">Jaket/sweater anak (Rp 8.500)</option>
			<option value="jaket-kulit">Jaket kulit (Rp 72.000)</option>
			<option value="jaket-kulit-anak">Jaket kulit anak (Rp 35.000)</option>
			<option value="jas">Jas (Rp 17.500)</option>
			<option value="jas-anak">Jas anak (Rp 8.500)</option>
			<option value="jas-sweater-panjang">Jas/sweater panjang (Rp 17.000)</option>
			<option value="jas-pria">Jas pria (Rp 17.500)</option>
			<option value="jubah">Jubah (Rp 17.000)</option>
			<option value="kaos">Kaos (Rp 11.500)</option>
			<option value="kaos-kaki">Kaos kaki (Rp 6.500)</option>
			<option value="kebaya-anak">Kebaya anak (Rp 5.000)</option>
			<option value="kebaya-panjang">Kebaya panjang (Rp 18.500)</option>
			<option value="kebaya-panjang-anak">Kebaya panjang anak (Rp 8.500)</option>
			<option value="kebaya-pendek">Kebaya pendek (Rp 14.500)</option>
			<option value="kebaya-pendek-anak">Kebaya pendek anak (Rp 7.000)</option>
			<option value="kelambu-bayi">Kelambu bayi (Rp 24.500)</option>
			<option value="kelambu-tempat-tidur-besar">Kelambu tempat tidur besar (Rp 46.000)</option>
			<option value="kelambu-tempat-tidur-kecil">Kelambu tempat tidur kecil (Rp 27.500)</option>
			<option value="kelambu-tempat-tidur-sedang">Kelambu tempat tidur sedang (Rp 35.000)</option>
			<option value="kemben">Kemben (Rp 8.500)</option>
			<option value="kemeja-baju-koko">Kemeja/ baju koko (Rp 14.500)</option>
			<option value="kemeja-anak">Kemeja anak (Rp 4.000)</option>
			<option value="keranjang-bayi">Keranjang bayi (Rp 25.000)</option>
			<option value="kereta-bayi-besar">Kereta bayi besar (Rp 68.000)</option>
			<option value="kereta-bayi-kecil">Kereta bayi kecil (Rp 63.500)</option>
			<option value="kerudung">Kerudung (Rp 9.500)</option>
			<option value="keset">Keset (Rp 7.000)</option>
			<option value="keset-tebal">Keset tebal (Rp 9.500)</option>
			<option value="keset-tipis">Keset tipis (Rp 8.500)</option>
			<option value="kimono">Kimono (Rp 18.000)</option>
			<option value="kursi-kantor">Kursi kantor (Rp 62.500)</option>
			<option value="kursi-salon">Kursi salon (Rp 21.000)</option>
			<option value="kutang-bh">Kutang/BH (Rp 7.000)</option>
			<option value="list-gorden-per-m">List gorden per m2 (Rp 8.000)</option>
			<option value="mantel">Mantel (Rp 24.000)</option>
			<option value="mantel-panjang-overcoat">Mantel panjang / Overcoat (Rp 27.500)</option>
			<option value="pakaian-badut">Pakaian badut (Rp 62.500)</option>
			<option value="rok-panjang-di-bawah-lutut">Rok panjang di bawah lutut (Rp 15.500)</option>
			<option value="rok-panjang-di-bawah-lutut-anak">Rok panjang di bawah lutut anak (Rp 8.000)</option>
			<option value="rok-pendek-di-atas-lutut">Rok pendek di atas lutut (Rp 13.000)</option>
			<option value="rok-pendek-di-atas-lutut-anak">Rok pendek di atas lutut anak (Rp 6.000)</option>
			<option value="rok-penganten-biasa">Rok penganten biasa (Rp 21.000)</option>
			<option value="rok-penganten-biasa-1">Rok penganten 1 (Rp 69.000)</option>
			<option value="rok-penganten-biasa-2">Rok penganten 2 (Rp 55.000)</option>
			<option value="rok-penganten-biasa-3">Rok penganten 3 (Rp 35.000)</option>
			<option value="rompi">Rompi (Rp 13.000)</option>
			<option value="rompi-anak">Rompi anak (Rp 6.000)</option>
			<option value="rompi-kulit">Rompi kulit (Rp 72.000)</option>
			<option value="rompi-kulit-anak">Rompi kulit anak (Rp 35.000)</option>
			<option value="sandal-pantofel">Sandal pantofel (Rp 17.000)</option>
			<option value="sandal-jepit-aksesoris-anak">Sandal jepit aksesoris anak (Rp 8.000)</option>
			<option value="sandal-jepit-aksesoris">Sandal jepit aksesoris (Rp 15.000)</option>
			<option value="sandal-kulit">Sandal kulit (Rp 17.000)</option>
			<option value="sandal-rumah-berbulu">Sandal rumah (berbulu) (Rp 17.000)</option>
			<option value="sandal-rumah-anak">Sandal rumah anak (Rp 8.500)</option>
			<option value="tenda">Tenda (Rp 30.500)</option>
			<option value="tikar-biasa">Tikar biasa (Rp 27.500)</option>
			<option value="tikar-busa">Tikar busa (Rp 35.000)</option>
			<option value="tikar-lipat-besar">Tikar lipat besar (Rp 41.500)</option>
			<option value="toga">Toga (Rp 24.000)</option>
			<option value="topi">Topi (Rp 9.500)</option>
			<option value="topi-anak">Topi anak (Rp 5.000)</option>
			<option value="t-shirt">T-shirt (Rp 11.500)</option>
			<option value="tudung-keranjang-bayi">Tudung keranjang bayi (Rp 6.500)</option>
			<option value="werpak-balap-motor-kulit">Werpak balap motor kulit (Rp 72.000)</option>
			<option value="werpak-kain">Werpak kain (Rp 24.000)</option>
          </select>
        `;
      }
    }

    function addCustomProductRow() {
      const productList = document.getElementById('product-list');
      const index = productIndex++;

      const productRow = document.createElement('div');
      productRow.classList.add('product-row');
      productRow.innerHTML = `
        <button class="remove" onclick="removeProductRow(${index})">Remove</button>
        <label for="custom-product-name-${index}">Product Name:</label>
        <input type="text" id="custom-product-name-${index}" placeholder="Enter product name" required>

        <label for="custom-product-price-${index}">Price (Rp):</label>
        <input type="number" id="custom-product-price-${index}" min="0" placeholder="Enter price" required>

        <label for="custom-quantity-${index}">Quantity:</label>
        <input type="number" id="custom-quantity-${index}" min="1" value="1">

        <label for="custom-date-${index}">Date:</label>
        <input type="date" id="custom-date-${index}">
      `;

      productList.appendChild(productRow);
    }

    function removeProductRow(index) {
      const productList = document.getElementById('product-list');
      const rowToRemove = document.querySelector(`#product-list > div:nth-child(${index + 1})`);
      productList.removeChild(rowToRemove);
    }

    function calculateSummary() {
      const name = document.getElementById('name').value;
      const address = document.getElementById('address').value;
      const phone = formatPhoneNumber(document.getElementById('phone').value);
      const discount = parseFloat(document.getElementById('discount').value);
      const downPayment = parseFloat(document.getElementById('down-payment').value);

      const productList = document.getElementById('product-list').children;
      const products = [];

      let totalPrice = 0;

      for (let i = 0; i < productList.length; i++) {
        const category = productList[i].querySelector('[id^="category"]')?.value;
        const subcategory = productList[i].querySelector('[id^="subcategory"]')?.value;
        const customProductName = productList[i].querySelector('[id^="custom-product-name"]')?.value;
        const customProductPrice = parseFloat(productList[i].querySelector('[id^="custom-product-price"]')?.value);
        const quantity = parseFloat(productList[i].querySelector('[id^="quantity"], [id^="custom-quantity"]').value);
        const date = productList[i].querySelector('[id^="date"], [id^="custom-date"]').value;

        let price = 0;
        if (category === 'kiloan') {
          switch (subcategory) {
            case 'reguler': price = 9000; break;
            case 'ekspres': price = 12000; break;
            case 'kilat': price = 15000; break;
          }
        } else if (category === 'satuan') {
          switch (subcategory) {
             case 'karpet': price = 15000; break;
			case 'karpet-tebal': price = 17500; break;
			case 'karpet-tipis': price = 12500; break;
            case 'bedcover': price = 30000; break;
			case 'bedcover-large': price = 35000; break;
			case 'bedcover-single': price = 25000; break;
            case 'boneka15': price = 8500; break;
			case 'boneka20': price = 11500; break;
			case 'boneka30': price = 15000; break;
			case 'boneka40': price = 18500; break;
			case 'boneka50': price = 26000; break;
			case 'boneka70': price = 33000; break;
			case 'boneka80': price = 40000; break;
			case 'sepatu-balap': price = 14000; break;
			case 'sepatu-balap-anak': price = 14000; break;
			case 'sepatu-balet-anak': price = 15500; break;
			case 'sepatu-boot': price = 27000; break;
			case 'sepatu-olahraga': price = 24500; break;
			case 'sepatu-olahraga-anak': price = 12000; break;
			case 'sepatu-pantofel-kulit': price = 29000; break;
			case 'sepatu-pantofel-kulit-anak': price = 14000; break;
			case 'sepatu-wanita': price = 27500; break;
			case 'sepatu-wanita-sebetis': price = 37500; break;
			case 'kasur-busa-besar': price = 50500; break;
			case 'kasur-busa-double': price = 55000; break;
			case 'kasur-busa-kecil': price = 36000; break;
			case 'kasur-busa-keranjang': price = 21000; break;
			case 'kasur-busa-single': price = 48500; break;
			case 'kasur-dakron-besar': price = 50500; break;
			case 'kasur-dakron-sedang': price = 43000; break;
			case 'kasur-palembang-besar': price = 50500; break;
			case 'kasur-palembang-sedang': price = 43000; break;
			case 'kasur-palembang-single': price = 41500; break;
			case 'matras-busa-besar': price = 33000; break;
			case 'matras-busa-kecil': price = 24500; break;
			case 'matras-busa-sedang': price = 27500; break;
			case 'matras-springbed-double"': price = 35000; break;
			case 'matras-springbed-single': price = 27500; break;
			case 'springbed-single': price = 108000; break;
			case 'springbed-double': price = 114000; break;
			case 'sprei-polos-besar': price = 13000; break;
			case 'sprei-polos-besar-bayi': price = 5500; break;
			case 'sprei-polos-kecil': price = 11500; break;
			case 'sprei-polos-kecil-bayi': price = 5500; break;
			case 'sprei-rempel-besar': price = 20500; break;
			case 'sprei-rempel-kecil': price = 17500; break;
			case 'bantal': price = 15500; break;
			case 'bantal-bayi': price = 9500; break;
			case 'bantal-boneka': price = 14000; break;
			case 'bantal-kursi': price = 15500; break;
			case 'bantal-boneka': price = 14000; break;
			case 'bantal-kursi': price = 15500; break;
			case 'bantal-lantai': price = 30000; break;
			case 'bantalan-sandaran-mobil': price = 11500; break;
			case 'bantalan-tempat-duduk': price = 35000; break;
			case 'sarung-bantal-besar': price = 9500; break;
			case 'sarung-bantal-kursi': price = 8500; break;
			case 'sarung-bantal-lantai': price = 13000; break;
			case 'sarung-bantal-guling-polos': price = 7000; break;
			case 'sarung-bantal-guling-satin': price = 8500; break;
			case 'sarung-bantal-guling-satin-bayi': price = 4000; break;
			case 'sarung-biasa': price = 13000; break;
			case 'sarung-biasa-anak': price = 6500; break;
			case 'sarung-kasur-busa-besar': price = 17000; break;
			case 'sarung-kasur-busa-kecil': price = 14000; break;
			case 'selimut-bayi': price = 11500; break;
			case 'selimut-handuk': price = 17500; break;
			case 'selimut-karpet': price = 21500; break;
			case 'selimut-tebal': price = 21000; break;
			case 'selimut-tikar': price = 21000; break;
			case 'selimut-tipis': price = 17500; break;
			case 'tas-aksesoris': price = 21000; break;
			case 'tas-bayi-besar': price = 18500; break;
			case 'tas-bayi-kecil': price = 15000; break;
			case 'tas-bayi-sedang': price = 21000; break;
			case 'tas-biasa-besar': price = 20500; break;
			case 'tas-biasa-kecil': price = 15000; break;
			case 'tas-biasa-sedang': price = 18500; break;
			case 'tas-boneka': price = 17000; break;
			case 'tas-gunung': price = 27500; break;
			case 'tas-koper-besar': price = 60500; break;
			case 'tas-koper-besar-anak': price = 29500; break;
			case 'tas-koper-sedang': price = 50500; break;
			case 'tas-koper-sedang-anak': price = 25000; break;
			case 'tas-kulit': price = 69000; break;
			case 'tas-kulit-bermerk': price = 96500; break;
			case 'tas-kulit-bermerk-anak': price = 41500; break;
			case 'tas-kulit-besar': price = 101000; break;
			case 'tas-kulit-besar-anak': price = 35000; break;
			case 'tas-kulit-kecil': price = 57500; break;
			case 'tas-kulit-kecil-anak': price = 27500; break;
			case 'tas-kulit-sedang': price = 72000; break;
			case 'tas-kulit-sedang-anak': price = 32000; break;
			case 'tas-mukena': price = 7000; break;
			case 'tas-ransel': price = 27500; break;
			case 'tas-ransel-anak': price = 21000; break;
			case 'tas-sleepingbag': price = 41500; break;
			case 'tas-wanita': price = 27500; break;
			case 'alas-boks-bayi': price = 35000; break;
			case 'alas-kasur-springbed': price = 21000; break;
			case 'alas-sofa': price = 9500; break;
			case 'baby-doll': price = 21000; break;
			case 'babby-walker': price = 17000; break;
			case 'baju-bayi': price = 3000; break;
			case 'baju-boneka-besar': price = 39500; break;
			case 'baju-boneka-kecil': price = 32500; break;
			case 'baju-drumband-anak': price = 11500; break;
			case 'baju-ihrom': price = 17500; break;
			case 'baju-ihrom-anak': price = 8500; break;
			case 'baju-koko': price = 14500; break;
			case 'baju-lab': price = 11000; break;
			case 'baju-muslim-selutut': price = 18500; break;
			case 'baju-muslim-selutut-anak': price = 9000; break;
			case 'baju-muslim-setumit-panjang': price = 22000; break;
			case 'baju-penganten-internasional-1': price = 108000; break;
			case 'baju-penganten-internasional-2': price = 81000; break;
			case 'baju-penganten-internasional-3': price = 54000; break;
			case 'baju-penganten-jawa-nasional': price = 36000; break;
			case 'baju-safari-batik': price = 15500; break;
			case 'baju-safari-anak': price = 8000; break;
			case 'beskap': price = 17500; break;
			case 'beskap-anak': price = 8500; break;
			case 'beskap-manten': price = 25000; break;
			case 'blangkon': price = 9000; break;
			case 'blazer': price = 15500; break;
			case 'blus': price = 14500; break;
			case 'blus-anak': price = 7000; break;
			case 'blus-panjang': price = 18500; break;
			case 'blus-pendek': price = 14500; break;
			case 'body-suit': price = 13000; break;
			case 'body-suit-anak': price = 7000; break;
			case 'body-protector': price = 11500; break;
			case 'boneka-bantal': price = 14000; break;
			case 'boks-bayi': price = 57500; break;
			case 'celana-3per4': price = 11500; break;
			case 'celana-7per8': price = 13000; break;
			case 'celana-7per8-anak': price = 4000; break;
			case 'celana-bayi': price = 3000; break;
			case 'celana-dalam': price = 6500; break;
			case 'celana-dalam-anak': price = 3500; break;
			case 'celana-panjang': price = 14500; break;
			case 'celana-panjang-anak': price = 7000; break;
			case 'celana-pendek': price = 11500; break;
			case 'celana-pendek-anak': price = 15500; break;
			case 'cover-tutup-mobil': price = 37000; break;
			case 'cover-tutup-motor': price = 23500; break;
			case 'cover-galon': price = 10000; break;
			case 'cover-bedcover': price = 14000; break;
			case 'cover-jas': price = 14000; break;
			case 'cover-jok-minibus-stel': price = 79000; break;
			case 'cover-jok-mobil-terpisah': price = 14000; break;
			case 'cover-jok-mobil-sedan-stel': price = 65000; break;
			case 'cover-kulkas': price = 10000; break;
			case 'cover-magicjar': price = 10000; break;
			case 'cover-piano-besar': price = 13000; break;
			case 'cover-piano-sedang': price = 7000; break;
			case 'cover-sofa-besar': price = 27500; break;
			case 'cover-sofa-kecil': price = 11500; break;
			case 'cover-sofa-sedang': price = 14000; break;
			case 'cover-springbed': price = 21000; break;
			case 'cover-springbed-besar': price = 30000; break;
			case 'cover-tisu': price = 8500; break;
			case 'cover-tudung-saji': price = 10000; break;
			case 'daster': price = 17000; break;
			case 'gaun-panjang': price = 24000; break;
			case 'gaun-panjang-anak': price = 12000; break;
			case 'gaun-pendek-selutut': price = 8000; break;
			case 'gaun-pendek-anak': price = 9000; break;
			case 'gaun-penganten-1': price = 124000; break;
			case 'gaun-penganten-2': price = 83000; break;
			case 'gaun-penganten-3': price = 62500; break;
			case 'gaun-penganten-4': price = 35000; break;
			case 'gaun-pesta-biasa': price = 35000; break;
			case 'gaun-pesta-variasi': price = 41500; break;
			case 'gendongan': price = 11500; break;
			case 'gorden-per-meter': price = 8000; break;
			case 'gorden-per-kg': price = 12000; break;
			case 'guling': price = 15500; break;
			case 'guling-bayi': price = 10000; break;
			case 'gurita': price = 5000; break;
			case 'handuk-besar': price = 11500; break;
			case 'handuk-kecil': price = 8500; break;
			case 'handuk-sedang': price = 10000; break;
			case 'jaket-sweater': price = 17500; break;
			case 'jaket-sweater-anak': price = 8500; break;
			case 'jaket-kulit': price = 72000; break;
			case 'jaket-kulit-anak': price = 35000; break;
			case 'jas"': price = 17500; break;
			case 'jas-anak': price = 8500; break;
			case 'jas-sweater-panjang': price = 17000; break;
			case 'jas-pria': price = 17500; break;
			case 'jubah': price = 17000; break;
			case 'kaos': price = 11500; break;
			case 'kaos-kaki': price = 6500; break;
			case 'kebaya-anak': price = 5000; break;
			case 'kebaya-panjang': price = 18500; break;
			case 'kebaya-panjang-anak': price = 8500; break;
			case 'kebaya-pendek': price = 14500; break;
			case 'kebaya-pendek-anak': price = 7000; break;
			case 'kelambu-bayi': price = 24000; break;
			case 'kelambu-tempat-tidur-besar': price = 46000; break;
			case 'kelambu-tempat-tidur-kecil': price = 27500; break;
			case 'kelambu-tempat-tidur-sedang': price = 35000; break;
			case 'Kemben': price = 8500; break;
			case 'kemeja-baju-koko': price = 14500; break;
			case 'kemeja-anak': price = 4000; break;
			case 'keranjang-bayi': price = 25000; break;
			case 'kereta-bayi-besar': price = 68000; break;
			case 'kereta-bayi-kecil': price = 63500; break;
			case 'kerudung': price = 9500; break;
			case 'keset': price = 7000; break;
			case 'keset-tebal': price = 9500; break;
			case 'keset-tipis': price = 8500; break;
			case 'kimono': price = 18000; break;
			case 'kursi-kantor': price = 62500; break;
			case 'kursi-salon': price = 21000; break;
			case 'kutang-bh': price = 7000; break;
			case 'list-gorden-per-m': price = 8000; break;
			case 'mantel': price = 24000; break;
			case 'mantel-panjang-overcoat': price = 27500; break;
			case 'pakaian-badut': price = 62500; break;
			case 'rok-panjang-di-bawah-lutut': price = 15500; break;
			case 'rok-panjang-di-bawah-lutut-anak': price = 8000; break;
			case 'rok-pendek-di-atas-lutut': price = 13000; break;
			case 'rok-pendek-di-atas-lutut-anak': price = 6000; break;
			case 'rok-penganten-biasa': price = 21000; break;
			case 'rok-penganten-biasa-1': price = 69000; break;
			case 'rok-penganten-biasa-2': price = 55000; break;
			case 'rok-penganten-biasa-3': price = 35000; break;
			case 'rompi': price = 13000; break;
			case 'rompi-anak': price = 6000; break;
			case 'rompi-kulit': price = 72000; break;
			case 'rompi-kulit-anak': price = 35000; break;
			case 'sandal-pantofel': price = 17000; break;
			case 'sandal-jepit-aksesoris-anak': price = 8000; break;
			case 'sandal-jepit-aksesoris': price = 15000; break;
			case 'sandal-kulit': price = 17000; break;
			case 'sandal-rumah-berbulu': price = 17000; break;
			case 'sandal-rumah-anak': price = 8500; break;
			case 'tenda': price = 30500; break;
			case 'tikar-biasa': price = 27500; break;
			case 'tikar-busa': price = 35000; break;
			case 'tikar-lipat-besar': price = 41500; break;
			case 'toga': price = 24000; break;
			case 'topi': price = 9500; break;
			case 'topi-anak': price = 5000; break;
			case 't-shirt': price = 11500; break;
			case 'tudung-keranjang-bayi': price = 6500; break;
			case 'werpak-balap-motor-kulit': price = 72000; break;
			case 'werpak-kain': price = 24000; break;   
          }
        } else if (customProductName && customProductPrice) {
          price = customProductPrice;
        }

        const productTotal = price * quantity;
        totalPrice += productTotal;

        products.push({
          name: customProductName || subcategory,
          quantity,
          date,
          price: productTotal
        });
      }

      const discountedPrice = totalPrice - (totalPrice * (discount / 100));
      const finalAmount = discountedPrice - downPayment;

      // Populate Summary
      document.getElementById('summary-name').innerText = name;
      document.getElementById('summary-address').innerText = address;
      document.getElementById('summary-phone').innerText = phone;

      const summaryProductsList = document.getElementById('summary-products');
      summaryProductsList.innerHTML = '';
      products.forEach((product, idx) => {
        const li = document.createElement('li');
        li.innerText = `${idx + 1}. ${product.name} (${product.quantity}) - Rp ${product.price.toLocaleString()} on ${product.date}`;
        summaryProductsList.appendChild(li);
      });

      document.getElementById('summary-date').innerText = new Date().toLocaleDateString();
      document.getElementById('summary-invoice').innerText = generateInvoice();
      document.getElementById('summary-total').innerText = totalPrice.toLocaleString();
      document.getElementById('summary-discount').innerText = discount;
      document.getElementById('summary-down-payment').innerText = downPayment.toLocaleString();
      document.getElementById('summary-final').innerText = finalAmount.toLocaleString();

      document.querySelector('.summary').classList.remove('hidden');
      document.getElementById('export-btn').classList.remove('hidden');
      document.getElementById('whatsapp-btn').classList.remove('hidden');
    }

    function formatPhoneNumber(phone) {
      // Remove spaces and non-numeric characters
      phone = phone.replace(/\D/g, '');
      // Add +62 if the number starts with 0
      if (phone.startsWith('0')) {
        phone = '+62' + phone.substring(1);
      }
      return phone;
    }

    function generateInvoice() {
      return `INV-${Math.floor(1000 + Math.random() * 9000)}`;
    }

    function exportToTxt() {
      const summaryText = `
BANDAR LAUNDRY
PerumGAS Blok Y No 1
Cileungsi Bogor
www.bandarlaundry.com 
Whatsapp: 085773009666
=========================\n
        Nama: ${document.getElementById('summary-name').innerText}
        Alamat: ${document.getElementById('summary-address').innerText}
        Telepon: ${document.getElementById('summary-phone').innerText}
        Produk:
        ${Array.from(document.getElementById('summary-products').children)
          .map(li => li.innerText)
          .join('\n')}
        Tanggal: ${document.getElementById('summary-date').innerText}
        Invoice: ${document.getElementById('summary-invoice').innerText}
        Total Harga: Rp ${document.getElementById('summary-total').innerText}
        Discount: ${document.getElementById('summary-discount').innerText}%
        Down Payment: Rp ${document.getElementById('summary-down-payment').innerText}
        Jumlah Akhir: Rp ${document.getElementById('summary-final').innerText}\n
Terimakasih sudah menggunakan jasa laundry kami.
      `;

      const blob = new Blob([summaryText], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'transaction_summary.txt';
      a.click();
    }

    function sendToWhatsApp() {
      const phone = formatPhoneNumber(document.getElementById('phone').value);
      const summaryText = `
*BANDAR LAUNDRY*
PerumGAS Blok Y No 1
Cileungsi Bogor
www.bandarlaundry.com\n
Whatsapp: 085773009666   
========================\n
        Nama: ${document.getElementById('summary-name').innerText}
        Alamat: ${document.getElementById('summary-address').innerText}
        Telepon: ${document.getElementById('summary-phone').innerText}
        Produk:
        ${Array.from(document.getElementById('summary-products').children)
          .map(li => li.innerText)
          .join('\n')}
        Tanggal: ${document.getElementById('summary-date').innerText}
        Invoice: ${document.getElementById('summary-invoice').innerText}
        Total Harga: Rp ${document.getElementById('summary-total').innerText}
        Discount: ${document.getElementById('summary-discount').innerText}%
        Down Payment: Rp ${document.getElementById('summary-down-payment').innerText}
        Jumlah Akhir: Rp ${document.getElementById('summary-final').innerText}\n
_Terimakasih sudah menggunakan jasa laundry kami_.
      `;

      const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(summaryText)}`;
      window.open(whatsappUrl, '_blank');
    }
