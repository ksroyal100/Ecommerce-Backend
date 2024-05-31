const app = require(".");
const { connectDB } = require("./config/db");

const port = process.env.PORT || 3000

connectDB();


app.listen(port, () => {
        console.log(`Server is running at port : ${port} `)
    })