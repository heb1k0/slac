const mongoose = require('mongoose');
const SchemaStatus = mongoose.Schema;

const StatusSchema = SchemaStatus({
    status: {
        type: Boolean,
        default: false
    },
    tienda: {
        type: String
    }
})

module.exports = mongoose.model('status', StatusSchema);