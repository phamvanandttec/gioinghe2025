// Example usage of the JSON API endpoints

// 1. Get all products (first page)
fetch('/XX_afternoon/products.json')
  .then(response => response.json())
  .then(data => {
    console.log('Products:', data.data);
    console.log('Pagination:', data.pagination);
  });

// 2. Search for products containing 'apple'
fetch('/XX_afternoon/products.json?query=apple')
  .then(response => response.json())
  .then(data => {
    console.log('Search results:', data.data);
  });

// 3. Get page 2 of search results
fetch('/XX_afternoon/products.json?query=apple&page=2')
  .then(response => response.json())
  .then(data => {
    console.log('Page 2 results:', data.data);
  });

// 4. Get a specific product by GTIN
fetch('/XX_afternoon/products.json/03000123456789')
  .then(response => {
    if (response.status === 404) {
      console.log('Product not found or hidden');
      return null;
    }
    return response.json();
  })
  .then(product => {
    if (product) {
      console.log('Product details:', product);
      console.log('Company info:', product.company);
    }
  });

// 5. Error handling example
async function getProductSafely(gtin) {
  try {
    const response = await fetch(`/XX_afternoon/products.json/${gtin}`);
    
    if (response.status === 404) {
      return { error: 'Product not found' };
    }
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching product:', error);
    return { error: 'Failed to fetch product' };
  }
}

// Usage
getProductSafely('03000123456789').then(result => {
  if (result.error) {
    console.log('Error:', result.error);
  } else {
    console.log('Product:', result);
  }
});