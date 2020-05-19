const mongoose = require('mongoose');
const SchemaCategoria = mongoose.Schema;

const CategoriaSchema = SchemaCategoria({
    name: {
        type: String
    },
    position: {
       type: Number
    }
})

module.exports = mongoose.model('categorias', CategoriaSchema);