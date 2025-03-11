document.getElementById('whatsappForm').addEventListener('submit', function (e) {
  e.preventDefault();

  // Collect form data
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
  const address = document.getElementById('address').value;
  const product = document.getElementById('product').value;

  // Get browser info, date, and time
  const userAgent = navigator.userAgent;
  const today = new Date();
  const date = today.toLocaleDateString();
  const time = today.toLocaleTimeString();

  // Construct the message
  const message = `
    *Ada Orderan Baru Nih:*
    Nama: ${name}
    Email: ${email}
    Telepon: ${phone}
    Alamat: ${address}
    Produk: ${product}

    *Dari:* ${userAgent}
    *Tanggal:* ${date}
    *Jam:* ${time}

    _Terimakasih sudah berbelanja pada kami_
  `;

  // Encode the message for URL
  const encodedMessage = encodeURIComponent(message);

  // WhatsApp number
  const whatsappNumber = '6285773009666';

  // Redirect to WhatsApp
  window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');
});
