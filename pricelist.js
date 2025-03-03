 const priceList = [
      { name: "Alas box bayi", price: 35000 },
      { name: "Alas kasur springbed", price: 21000 },
      { name: "Alas Keranjang bayi", price: 17000 },
      { name: "Alas piring meja makan", price: 5000 },
      { name: "Alas sofa", price: 9500 },
      { name: "Atasan mukena", price: 11000 },
    ];

    // DOM elements
    const searchInput = document.getElementById("searchInput");
    const searchButton = document.getElementById("searchButton");
    const resultsContainer = document.getElementById("results");

    // Function to display filtered results
    function displayResults(filteredItems) {
      resultsContainer.innerHTML = ""; // Clear previous results

      if (filteredItems.length === 0) {
        resultsContainer.innerHTML = "<p>No results found.</p>";
        return;
      }

      filteredItems.forEach((item) => {
        const resultItem = document.createElement("div");
        resultItem.classList.add("result-item");
        resultItem.textContent = `${item.name} harga Rp ${item.price.toLocaleString()}`;
        resultsContainer.appendChild(resultItem);
      });
    }

    // Event listener for search button
    searchButton.addEventListener("click", () => {
      const query = searchInput.value.trim().toLowerCase();

      // Filter items based on the query
      const filteredItems = priceList.filter((item) =>
        item.name.toLowerCase().includes(query)
      );

      // Display the filtered results
      displayResults(filteredItems);
    });
