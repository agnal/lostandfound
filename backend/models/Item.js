const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true,  },
    image: { type: String, required: true },
    verified: { type: Boolean, default: false },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
},{ timestamps: true } );


module.exports = mongoose.model('Item', itemSchema);