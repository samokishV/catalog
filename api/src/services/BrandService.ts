import {getConnectionManager} from "typeorm";
import {Brands} from "../models/Brands";

export const getAll = async () => {
    const connection = await getConnectionManager().get("default");
    const BrandsRepository = await connection.getRepository(Brands);
    const data = await BrandsRepository.find({});
    
    return data;
}






