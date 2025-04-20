const { mongoose } = require('mongoose');

const connMDB = process.env.monngoUrl
// const connMDB = "mongodb+srv://guptakishan492:ksroyal6393@cluster0.wyd884s.mongodb.net"
const DB_Name = "Ecommerce";

const connectDB = async () => {
    try {
        const connection = await mongoose.connect(`${connMDB}/${DB_Name}`);
        console.log(`\n MongoDB connected !! DB HOST ` + DB_Name);
    }
        
    catch (error) {
        console.log(error);
            process.exit(1);
    }
    
    
}
module.exports = { connectDB }
