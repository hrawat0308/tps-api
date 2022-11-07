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

const getCapacityDetails = async (req, res, next) => {
    const skuType = req.params.skuType;
    const brandID = req.params.brandID;
    let identifiedSkuType;
    try{
        [identifiedSkuType] = await db.execute(`select * from sku_type_master where sku_type='${skuType}'`);
    }
    catch(err){
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
    let capacityProperty;
    if(skuTypeID === 4){
        capacityProperty = "inverter_capacity_va"
    }
    else if(skuTypeID === 3){
        capacityProperty = "rated_power_output_kW";
    }
    let inverterCapacities;
    try{
        [inverterCapacities] = await db.execute(`select ${capacityProperty} from inverter_config_master where inverter_id in (
            select distinct sku_config_map.config_id from sku_config_map inner join sku_master
            on sku_config_map.sku_id = sku_master.sku_id and sku_master.brand_id=${brandID} and sku_config_map.sku_type_id=${skuTypeID})`);
    }catch(err){
        const error = new Error("Error fetching data from Database!!");
        error.code = 502;
        return next(error);
    }

    if(inverterCapacities.length === 0){
        const error = new Error("No capacities Found!!!");
        error.code = 404;
        return next(error);
    }
    res.json(inverterCapacities);
}

exports.getBrandDetails = getBrandDetails;
exports.getCapacityDetails = getCapacityDetails;