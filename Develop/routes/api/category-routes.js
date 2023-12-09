const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  try{
    const categories = await Category.findAll( {
      include: {model: Product},
    });
  
  // find all categories
  res.json(categories);
  // be sure to include its associated Products

} catch (err) {
  console.error(err);
  res.status(500).json(err);
}
});

router.get('/:id',  async (req, res) => {
  // find one category by its `id` value
  try {
    const category = await Category.findByPk(req.params.id, {
      include: { model: Product },
    });

  // be sure to include its associated Products
  if (!category) {
    res.status(404).json({ message: 'Category cant be  found' });
  } else {
    res.json(category);
  }
} catch (err) {
  console.error(err);
  res.status(500).json(err);
}
});

router.post('/', async(req, res) => {
  // create a new category
 try {
  const newCategory = await Category.create(req.body);
     res.status(201).json(newCategory)} 
     catch (err) {console.error(err); 
      res.status(400).json(err);
}
});

router.put('/:id', async(req, res) => {
  // update a category by its `id` value

  try {
    
    const [updateCategory] = await Category.update(req.body, {
     
      where: { id: req.params.id },
    
    });
    
    if (updateCategory > 0) {
     
      res.json({ message: 'Category updated' });
    
    } else {
    
      res.status(404).json({ message: 'Category cant be found' });
    }
  
  } catch (err) {
   
    console.error(err);
    res.status(500).json(err);
}

});

router.delete('/:id', async(req, res) => {
  // delete a category by its `id` value

  try {
   
    const deleteCategory = await Category.destroy({
      where: { id: req.params.id },

    });
    if (deleteCategory > 0) {
      res.json({ message: 'Category deleted' });
    } else {
      res.status(404).json({ message: 'Category cant be found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }



});

module.exports = router;
