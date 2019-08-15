import {getConnectionManager, getConnection, createQueryBuilder} from "typeorm";
import {Clothes} from "../models/Clothes";

const itemsOnPage = 15;

export const getAll = async (keyword: string, brand: string, size : string, page: number = 1, sort: string = "default") => {
    const connection = await getConnectionManager().get("default");
    const catalogRepository = await connection.getRepository(Clothes);
    const limit = itemsOnPage;
    const offset = (page - 1)*limit;
    const sortOptions = sortCondition(sort);
    const sortField = sortOptions.field;
    const sortType = sortOptions.type;

    /*
    const data = await catalogRepository.find({     
        select: ["id", "name"],
        where :{ "brand": {id: 10}, "type": {id: 1}},
        relations: ["brand", "type", "sizes"],
        order : {[sortField] : sortType},
        skip: offset, 
        take: limit 
    });
    */

    /*
    const data = await catalogRepository.find({     
        select: ["id", "name"],
        relations: ["brand", "clothToSizes", "clothToSizes.size"],
        order : {[sortField] : sortType},
        skip: offset, 
        take: limit 
    });
    */

   const query = await createQueryBuilder("clothes", "clothes")
        .innerJoinAndSelect("clothes.brand", "brand")
        .innerJoinAndSelect("clothes.type", "type")
        .innerJoinAndSelect("clothes.sizes", "sizes")
        .orderBy("sizes.id", "ASC")
        .skip(offset)
        .take(limit)

    if(keyword) {
        query.andWhere("clothes.name = :keyword", {keyword: keyword})
            .orWhere("brand.name = :keyword", {keyword: keyword})
            .orWhere("type.name = :keyword", {keyword: keyword})
    }

    if(brand) {
        query.andWhere("brand.name = :brand", { brand: brand })
    }

    if(size) {
        query.andWhere("sizes.value = :size", { size: size })
    }

    const data = query.getMany();

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
    if (order) {
        const sort = order.split("-");
        const field : string = sort[0];
        const type : string = sort[1];
        sortOptions = {field : field, type : type.toUpperCase()};
    } else {
        sortOptions = {field: "id", type: "ASC"};
    }
    return sortOptions;
}





