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

    data: any[];

    // potentially need to check beforehand if there is a single key-value pair,
    // otherwise throw an error before the constructor is called
    constructor(filter: any, data: any[]) {
        this.data = data;
        this.filters = [];
        this.parseLogicFilters(filter);
    }

    // recursively parse JSON subnodes of logic filter
    parseLogicFilters(objJSON: any): void {
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
                    var orFilter = new FilterOR(val, this.data);
                    //var orFilter = new FilterLogic(val);
                    this.filters.push(orFilter);
                    this.parseLogicFilters(orFilter);
                } else if (key === "AND") {
                    var andFilter = new FilterAND(val, this.data);
                    //var andFilter = new FilterLogic(val);
                    this.filters.push(andFilter);
                    this.parseLogicFilters(andFilter);
                } else if (key === "GT") {
                    this.filters.push(new FilterGT(val, this.data));
                } else if (key === "LT") {
                    this.filters.push(new FilterLT(val, this.data));
                } else if (key === "EQ") {
                    this.filters.push(new FilterEQ(val, this.data));
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


    // not sure if there is need for parsing the data at all
    // filter data
    // pass results in the constructor
    applyFilter(): any[] {
        var dataFiltered: any[] = [];
        this.applyFilterHelper(this.filters, dataFiltered);
        return dataFiltered;
    }

    // helper for recursive implmentation
    applyFilterHelper(filters: IFilter[], results: any[]): any[] {
        if (filters.length == 0) return results;

        let element: any;
        for (element of this.filters) {
            var key = Object.keys(element)[0];
            if (key === "GT") {
                let elementGT = new FilterGT(element, results);
                results.concat(elementGT.applyFilter());
            } else if (key === "LT") {
                let elementLT = new FilterLT(element, results);
                results.concat(elementLT.applyFilter());
            } else if (key === "EQ") {
                let elementEQ = new FilterEQ(element, results);
                results.concat(elementEQ.applyFilter());
            }

            //this.applyFilterHelper(Object.values(element), results);
        }

    }

}

