import {IFilterLogic} from "./IFilterLogic";
import {IFilter} from "../IFilter";
import FilterOR from "./FilterOR";
import FilterGT from "../FilterComparison/FilterGT";
import FilterLT from "../FilterComparison/FilterLT";
import FilterEQ from "../FilterComparison/FilterEQ";

export default class FilterAND implements IFilterLogic{
    type: "FilterLogic";
    subType: "FilterAND";
    filters: IFilter[];

    // potentially need to check beforehand if there is a single key-value pair,
    // otherwise throw an error before the constructor is called
    constructor(filter: any) {
        this.filters = [];
        this.parseLogicFilters(filter);
    }

    // recursively parse JSON subnodes of logic filter
    parseLogicFilters(objJSON: any): void {
        // console.log(objJSON)
        // the passed parameter might be an array, if the node above was AND/OR
        if (Array.isArray(objJSON)) {
            this.parseArray(objJSON);
        }
        // otherwise the object is JSON, e.g. GT/LT/EQ
        else {
            for (var key in objJSON) {
                var val = objJSON[key];
/*                console.log(key)
                console.log(val)*/
                if (key === "OR") {
                    var orFilter = new FilterOR(val);
                    //var orFilter = new FilterLogic(val);
                    this.filters.push(orFilter);
                    this.parseLogicFilters(orFilter);
                } else if (key === "AND") {
                    var andFilter = new FilterAND(val);
                    //var andFilter = new FilterLogic(val);
                    this.filters.push(andFilter);
                    this.parseLogicFilters(andFilter);
                } else if (key === "GT") {
                    this.filters.push(new FilterGT(val));
                } else if (key === "LT") {
                    this.filters.push(new FilterLT(val));
                } else if (key === "EQ") {
                    this.filters.push(new FilterEQ(val));
                }
            }
        }
    }

    // helper function to parse array of JSONs
    parseArray(arrJSON: JSON[]) {
        for (let j of arrJSON) {
            this.parseLogicFilters(j);
        }
    }
}

