const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', (req, res) => {
  // find all products
  Product.findAll({
    include: [{ model: Category }, { model: Tag }],
  })

  // be sure to include its associated Category and Tag data
  .then((products) => res.json(products))
  .catch((err) => {
    console.error(err);
    res.status(500).json(err);
  });


});

// get one product
router.get('/:id', (req, res) => {
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data

  Product.findByPk(req.params.id, {
    include: [{ model: Category }, { model: Tag }],
  })
    .then((product) => {
      if (!product) {
        res.status(404).json({ message: 'Product is  not found' });
      } else {
        res.json(product);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json(err);
    });

});

// create new product
router.post('/', async (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
    try {
      const { product_name, price, stock, tagIds } = req.body;
  
      // Create the product
      const product = await Product.create({ product_name, price, stock });
  
      // If there are tag IDs, associate them with the product
      if (tagIds && tagIds.length) {
        const productTagIdArr = tagIds.map((tag_id) => ({
          product_id: product.id,
          tag_id,
        }));
  
        await ProductTag.bulkCreate(productTagIdArr);
      }
  
      // Respond with the created product
      res.status(200).json(product);
    } catch (err) {
      console.log(err);
      res.status(400).json(err);
    }
  });
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      

// update product

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { tagIds, product_name, price, stock } = req.body;

    // Update the product's name, price, and stock
    await Product.update(
      { product_name, price, stock },
      {
        where: { id },
      }
    );

    if (tagIds && tagIds.length) {
      const product = await Product.findByPk(id);

      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      // Set product tags using the provided tagIds
      await product.setTags(tagIds);
    }

    res.status(200).json({ message: 'Product updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
});



router.delete('/:id', (req, res) => {

  // delete one product by its `id` value

   Product.destroy ({
    where: {id:req.params.id},

   })
   .then ((productDelete)  => {

    if (productDelete) {
      res.status(404).json({ message: 'Product not found' });
    } else {
      res.json({ message: 'Product deleted' });
    }
  })
.catch ((err) => {
  console.error(err);
  res.status(500).json(err);
});

});

module.exports = router;
