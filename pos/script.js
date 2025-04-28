 // Fetch products from CSV
    const csvUrl = 'https://bandarlaundry.github.io/pos/daftarharga.csv';
    let products = [];
    let currentPage = 1;
    const productsPerPage = 10;

    fetch(csvUrl)
      .then(response => response.text())
      .then(data => {
        const rows = data.split('\n').slice(1); // Skip header
        products = rows.map(row => {
          const [name, description, price, image] = row.split(',');
          const parsedPrice = parseFloat(price);
          return { 
            name: name || 'Aplikasi Laundry', 
            description: description || 'Transaski dengan pelanggan kini lebih mudah dan aman. Kirim bukti via Whatsapp cetak struk dengan skeli klik. Data Anda dijamin aman karena ini tidak disimpan di server.', 
            price: isNaN(parsedPrice) ? 185000 : parsedPrice, 
            image: image || 'https://ratakan.com/uploads/prd-23a9425ac5.png' 
          };
        });
        renderProducts();
      })
      .catch(error => console.error('Error fetching CSV:', error));

    function renderProducts() {
      const productGrid = document.getElementById('product-grid');
      const paginationNumbers = document.getElementById('page-numbers');
      productGrid.innerHTML = '';
      paginationNumbers.innerHTML = '';

      const filteredProducts = filterProductsByName();
      const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

      const start = (currentPage - 1) * productsPerPage;
      const end = start + productsPerPage;
      const paginatedProducts = filteredProducts.slice(start, end);

      paginatedProducts.forEach(product => {
        const item = document.createElement('div');
        item.className = 'product-item';
        item.innerHTML = `
          <img src="${product.image}" alt="${product.name}">
          <h3>${product.name}</h3>
          <p>${product.description}</p>
          <p>${product.price === 0 ? 'Gratis' : `Rp ${product.price.toLocaleString()}`}</p>
          <button onclick="addProductToSummary('${product.name}', 1)">Tambahkan</button>
        `;
        productGrid.appendChild(item);
      });

      // Pagination Numbers
      const maxVisiblePages = 3;
      let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

      if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        const pageNumber = document.createElement('button');
        pageNumber.textContent = i;
        pageNumber.className = currentPage === i ? 'active' : '';
        pageNumber.onclick = () => {
          currentPage = i;
          renderProducts();
        };
        paginationNumbers.appendChild(pageNumber);
      }

      // Enable/Disable Prev and Next Buttons
      document.getElementById('prev-page').disabled = currentPage === 1;
      document.getElementById('next-page').disabled = currentPage === totalPages;
    }

    function filterProductsByName() {
      const searchTerm = document.getElementById('search-input').value.toLowerCase();
      return products.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
      );
    }

    document.getElementById('search-input').addEventListener('input', () => {
      currentPage = 1;
      renderProducts();
    });

    function changePage(direction) {
      currentPage += direction;
      renderProducts();
    }

    const selectedProducts = {};

    function addProductToSummary(name, amount) {
      const product = products.find(p => p.name === name);
      if (!selectedProducts[name]) {
        selectedProducts[name] = { ...product, amount: amount };
      } else {
        selectedProducts[name].amount += amount;
      }
      updateSummary();
    }

    function toggleCustomProduct() {
      const customProductSection = document.getElementById('custom-product-section');
      customProductSection.style.display = customProductSection.style.display === 'none' ? 'block' : 'none';
    }

    function addCustomProduct() {
      const name = document.getElementById('custom-product').value.trim();
      const price = parseFloat(document.getElementById('custom-price').value) || 0;
      const amount = parseInt(document.getElementById('custom-amount').value) || 0;

      if (name && amount > 0) {
        if (!selectedProducts[name]) {
          selectedProducts[name] = { name, price, amount };
        } else {
          selectedProducts[name].amount += amount;
        }
        updateSummary();
        document.getElementById('custom-product').value = '';
        document.getElementById('custom-price').value = '';
        document.getElementById('custom-amount').value = '';
      } else {
        alert('Harap isi nama produk dan jumlah dengan benar.');
      }
    }

    function updateSummary() {
      const selectedProductsContainer = document.getElementById('selected-products');
      selectedProductsContainer.innerHTML = '';

      let totalAmount = 0;

      Object.keys(selectedProducts).forEach(name => {
        const product = selectedProducts[name];
        totalAmount += product.price * product.amount;
        const productDiv = document.createElement('div');
        productDiv.innerHTML = `
          <p>${product.name} - ${product.price === 0 ? 'Gratis' : `Rp ${product.price.toLocaleString()} x ${product.amount}`}</p>
          <button onclick="removeProduct('${name}')">Hapus</button>
        `;
        selectedProductsContainer.appendChild(productDiv);
      });

      // Update total amount
      document.getElementById('total-amount').textContent = `Total: Rp ${totalAmount.toLocaleString()}`;
    }

    function removeProduct(name) {
      delete selectedProducts[name];
      updateSummary();
    }

    function updateTotal() {
      const discountPercentage = parseFloat(document.getElementById('discount').value) || 0;
      const downPayment = parseFloat(document.getElementById('down-payment').value) || 0;

      let totalAmount = 0;

      Object.keys(selectedProducts).forEach(name => {
        const product = selectedProducts[name];
        totalAmount += product.price * product.amount;
      });

      const discountAmount = (totalAmount * discountPercentage) / 100;
      const finalAmount = totalAmount - discountAmount - downPayment;

      document.getElementById('total-amount').textContent = `Total Akhir: Rp ${finalAmount.toLocaleString()}`;
    }

    document.getElementById('transaction-form').addEventListener('submit', event => {
      event.preventDefault();

      const customerName = document.getElementById('name').value.trim();
      const address = document.getElementById('address').value.trim();
      const whatsappInput = document.getElementById('whatsapp').value.trim();
      const discount = parseFloat(document.getElementById('discount').value) || 0;
      const downPayment = parseFloat(document.getElementById('down-payment').value) || 0;

      // Validate required fields
      if (!customerName || !address || !whatsappInput) {
        alert('Harap isi semua data pelanggan yang wajib (Nama, Alamat, Nomor WhatsApp).');
        return;
      }

      // Format WhatsApp number
      let whatsapp = whatsappInput.startsWith('0') ? `62${whatsappInput.substring(1)}` : whatsappInput;

      const invoice = `INV-${Math.random().toString(36).substr(2, 9)}`;
      const date = new Date().toLocaleDateString();

      let message = `
        *BANDAR LAUNDRY*
	Perum GAS blok Y
	Cileungsi, Bogor
	www.bandarlaundry.com
	WA 085773009666
	=====================
        Nama Pelanggan: ${customerName}
        Alamat: ${address}
        Nomor WhatsApp: ${whatsapp}
        Tanggal Transaksi: ${date}
        Nomor Invoice: ${invoice}

        Transaksi Anda:
      `;

      let totalAmount = 0;

      Object.keys(selectedProducts).forEach(name => {
        const product = selectedProducts[name];
        totalAmount += product.price * product.amount;
        message += `\n- ${product.name} x ${product.amount} = ${product.price === 0 ? 'Gratis' : `Rp ${(product.price * product.amount).toLocaleString()}`}`;
      });

      const discountAmount = (totalAmount * discount) / 100;
      const finalAmount = totalAmount - discountAmount - downPayment;

      message += `
        Diskon (${discount}%): Rp ${discountAmount.toLocaleString()}
        Uang Muka: Rp ${downPayment.toLocaleString()}
        Total Akhir: Rp ${finalAmount.toLocaleString()}

       Terimakasih sudah menggunakan jasa kami.
      `;

      const whatsappLink = `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`;
      window.open(whatsappLink, '_blank');

      // Automatically save as TXT
      const blob = new Blob([message], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${invoice}.txt`;
      a.click();
    });

    // Toggle mobile menu
    document.querySelector('.hamburger').addEventListener('click', () => {
      const nav = document.querySelector('nav ul');
      nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
    });
