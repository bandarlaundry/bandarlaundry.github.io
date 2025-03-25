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
            <option value="karpet">Laundry Karpet</option>
            <option value="bedcover">Laundry Bedcover</option>
            <option value="boneka">Laundry Boneka</option>
            <option value="dasi">Dasi (Rp 8,000)</option>
            <option value="kemeja">Kemeja (Rp 14,500)</option>
            <option value="handuk">Handuk (Rp 10,000)</option>
            <option value="bantal">Bantal (Rp 25,000)</option>
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
            case 'bedcover': price = 30000; break;
            case 'boneka': price = 10000; break;
            case 'dasi': price = 8000; break;
            case 'kemeja': price = 14500; break;
            case 'handuk': price = 10000; break;
            case 'bantal': price = 25000; break;
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
