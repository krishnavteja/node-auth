var mongoose = require("mongoose");
var userSchema = new mongoose.Schema({
    email: String,
    password: String,
    displayName: String,
    admin: Boolean
});
var User = mongoose.model("User", userSchema);
exports.User = User;
//# sourceMappingURL=user.js.map