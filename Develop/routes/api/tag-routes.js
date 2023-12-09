const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags
  try {
    const tags = await Tag.findAll({

      include: [{ model: Product, through: ProductTag }]

    });

    res.json(tags);
  }
  catch (err) {
    res.status(500).json(err);
  }
  // be sure to include its associated Product data
});

router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data

  try {
    const tag = await Tag.findByPk(req.params.id, {

      include: [
        {
          model: Product,
          through: ProductTag
        }
      ]
    });
    if (!tag) {
      res.status(404).json({ message: "Tag doesn't found " });
      return;
    }
    res.json(tag);
  } catch (err) {
    res.status(500).json(err);
  }
});



router.post('/', async(req, res) => {
  // create a new tag
try{
 const newTag = await Tag.create(req.body);
 res.status(201).json(newTag);
} catch(err) {
  res.status(400).json(err);
}
});



router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { tag_name } = req.body;

    // Find the tag by id
    const tagToUpdate = await Tag.findByPk(id);

    if (tagToUpdate) {
      // Update the tag's name
      await tagToUpdate.update({ tag_name });

      res.status(200).json({ message: 'Tag updated successfully' });
    } else {
      res.status(404).json({ message: 'Tag not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});


router.delete('/:id', async (req, res) => {
  // delete on tag by its `id` value

  try {
    const deletedTag = await Tag.destroy({
      where: {
        id: req.params.id
      }

    });

    if (!deletedTag) {
      res.status(404).json({ message: 'Tag not found' });
      return;
    }

    res.json({ message: 'Tag deleted successfully' });

  } catch (err) {
    res.status(500).json(err);
  }

});

module.exports = router;
