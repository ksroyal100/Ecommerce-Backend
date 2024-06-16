const jwt = require('jsonwebtoken');

const SECRET_KEYREF = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9S22vVQ0QIeBrWwErKthUrECbhrGkfpKm5QntrcIB7ts"

const generateToken = (userId) => {
    const token = jwt.sign({ userId }, SECRET_KEYREF, { expiresIn: "1048h" })
    if (!token) {
        throw new Error("token not found ")
    }
    return token;
}

const getUserIdFromToken = (token) => {
    const decodedToken = jwt.verify(token, SECRET_KEYREF)
    return decodedToken.userId;

}

module.exports = {generateToken, getUserIdFromToken}