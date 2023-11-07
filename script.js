const axios = require('axios');

const shopifyApiKey = '510148dddc4a59a47d494d2bc007d82e';
const shopifyApiPassword = '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';
const shopifyBaseUrl = 'https://deeptest123.myshopify.com/admin/api/2023-04'; // You may need to adjust the API version

const updateMetafieldValue = async (productId) => {
  try {
    // Fetch the source product's metafield
    const sourceMetafieldResponse = await axios.get(`${shopifyBaseUrl}/products/${productId}/metafields.json`, {
      auth: {
        username: shopifyApiKey,
        password: shopifyApiPassword,
      },
    });
    const sourceMetafields = sourceMetafieldResponse.data.metafields;

    const sourceMetafieldKeys = ['width', 'size', 'style', 'features', 'foot_conditions'];

    // Loop through the source keys to find the matching metafield
    for (const key of sourceMetafieldKeys) {

      const sourceMetafield = sourceMetafields.find(metafield => metafield.namespace === 'custom' && metafield.key === key);

      if (sourceMetafield) {
        // Process the data (for example, split a comma-separated string)
        let sourceMetafieldData;

        if (key == 'size') {
          sourceMetafieldData = sourceMetafield.value.split(',');
        } else {
          sourceMetafieldData = sourceMetafield.value.split('||');
        }

        // Convert the processed data into a format you want
        const processedData = sourceMetafieldData
          .map(item => item.trim())
          .filter(item => item !== '');

        let data = JSON.stringify({
          "metafield": {
            "namespace": "custom",
            "key": key + '_1',
            "value": '["' + processedData.join('","') + '"]',
          }
        });

        let config = {
          method: 'post',
          maxBodyLength: Infinity,
          url: `${shopifyBaseUrl}/products/${productId}/metafields.json`,
          headers: {
            'X-Shopify-Access-Token': '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',
            'Content-Type': 'application/json'
          },
          data: data
        };

        axios.request(config)
          .then((response) => {
            console.log(JSON.stringify(response.data));
            console.log('Product metafield updated successfully.');
          })
          .catch((error) => {
            console.log(error);
          });

      } else {
        console.log('Source Metafield not found.');
      }
    }
  } catch (error) {
    console.error('Error fetching or updating product metafields:', error);
  }
};


const fetchShopifyProductIds = async () => {
  try {
    const response = await axios.get(`${shopifyBaseUrl}/products.json`, {
      auth: {
        username: shopifyApiKey,
        password: shopifyApiPassword,
      },
    });

    const products = response.data.products;
    // Extract product IDs from the products
    const productIds = products.map(product => product.id);

    // Loop through product IDs
    for (const productId of productIds) {
      // Call the function with the product ID
      updateMetafieldValue(productId);
      // You can make additional API requests or perform any other action here
    }

  } catch (error) {
    console.error('Error fetching Shopify products:', error);
  }
};

fetchShopifyProductIds();

