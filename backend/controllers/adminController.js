const Item = require("../models/Item");

exports.verifyItem = async (req, res) => {
   try {
   const item = await Item.findOneAndUpdate({ _id: req.params.id }, { verified: req.body.verified },
      { new: true, runValidators: true });

    console.log(item);
    
    res.status(201).json(item);
  } catch (error) {
    console.log(error);
    
    res.status(500).json({ message: "Error creating item", error });
  }
};