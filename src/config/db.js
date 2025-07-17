import mongoose from "mongoose";

const connectMongoDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://coderDb:Espasandin123@ecommerce-cluster.e8cay4v.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=ecommerce-cluster"
    );
    console.log("Conectado con MongoDB Atlas");
  } catch (error) {
    console.error("Error al conectar con MongoDB Atlas:", error);
  }
};

export default connectMongoDB;