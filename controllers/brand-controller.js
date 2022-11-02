const db = require('../Util/database');

const getBrandDetails = async (req, res, next) => {
    const skuType = req.params.skuType;
    let identifiedSkuType;
    try{
        [identifiedSkuType] = await db.execute(`select * from sku_type_master where sku_type='${skuType}'`);
    }
    catch(err){
        // console.log(err);
        const error = new Error("Error fetching data from Database!!");
        error.code = 502;
        return next(error);
    }

    if(identifiedSkuType.length === 0){
        const error = new Error("Invalid Sku Type!!!");
        error.code = 400;
        return next(error);
    }

    const skuTypeID = identifiedSkuType[0].sku_type_id;
    
    let brandDetails;
    try{
        [brandDetails] = await db.execute(`select * from brand_master where brand_id in (select distinct sku_master.brand_id 
            from sku_master inner join sku_config_map 
            on sku_config_map.sku_id = sku_master.sku_id and sku_config_map.sku_type_id=${skuTypeID}) order by brand_id asc`);
    }
    catch(err){
        const error = new Error("Error fetching data from Database!!");
        error.code = 502;
        return next(error);
    }

    res.json(brandDetails);
}

exports.getBrandDetails = getBrandDetails;