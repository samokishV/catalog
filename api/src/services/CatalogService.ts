import {getConnectionManager} from "typeorm";
import {Clothes} from "../models/Clothes";

const itemsOnPage = 16;

export const getAll = async (page: number = 1, sort: string = "default") => {
    const connection = await getConnectionManager().get("default");
    const catalogRepository = await connection.getRepository(Clothes);
    const limit = itemsOnPage;
    const offset = (page - 1)*limit;
    const sortOptions = sortCondition(sort);
    const sortField = sortOptions.field;
    const sortType = sortOptions.type;

    const data = await catalogRepository.find({ 
        select: ["id", "name"],
        order : {[sortField] : sortType},
        relations: ["brand", "type", "sizes"],
        skip: offset, 
        take: limit 
    });

    return data;
}

export const getTotal = async() => {
    const connection = await getConnectionManager().get("default");
    const catalogRepository = await connection.getRepository(Clothes);
    const data =  await catalogRepository.count();
    return data;
}

export const countPages = async() => {
    const total = await getTotal();
    const pageCount = total/itemsOnPage;
    return Math.ceil(pageCount); 
}

export const getPrevPage = (page: number = 1) => {
    if(page == 1) return "";
    const prev = --page;
    const prevPage = `http://localhost:1000/api/catalog?p=${prev}`;
    return prevPage;
}

export const getNextPage = async (page: number = 1) => {
    const totalPages = await countPages(); 
    if(page == totalPages) return "";
    const next = ++page;
    const nextPage = `http://localhost:1000/api/catalog?p=${next}`;
    return nextPage;
}

const sortCondition = (order: string) => {
    let sortOptions;
    if (order!=='default') {
        const sort = order.split("-");
        const field : string = sort[0];
        const type : string = sort[1];
        sortOptions = {field : field, type : type.toUpperCase()};
    } else {
        sortOptions = {field: "id", type: "ASC"};
    }
    return sortOptions;
}





