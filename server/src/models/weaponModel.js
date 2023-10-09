import mongoose from "mongoose";

const Weapon = mongoose.model(
  "Weapon",
  new mongoose.Schema({
    _id: String,
    brandModel: String,
    producer: String,
    weaponType: String,
    weaponKind: String,
    weaponSeries: String,
    weaponNumber: String,
    weaponCaliber: String,
    trunks: String,
    graduationYear: String,
    organUnit: String,
    reasonSearch: String,
    insertDate: Date,
    theftDate: Date,
  })
);
export default Weapon;
