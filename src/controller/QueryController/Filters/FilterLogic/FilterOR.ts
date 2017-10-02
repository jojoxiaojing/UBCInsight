import {IFilterLogic} from "./IFilterLogic";
import {IFilter} from "../IFilter";
import FilterAND from "./FilterAND";
import FilterGT from "../FilterComparison/FilterGT";
import FilterLT from "../FilterComparison/FilterLT";
import FilterEQ from "../FilterComparison/FilterEQ";

export default class FilterOR implements IFilterLogic{
    type: "FilterLogic";
    subType: "FilterOR";
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
        // console.log(objJSON)
        // the passed parameter might be an array, if the node above was AND/OR
        if (Array.isArray(objJSON)) {
            this.parseArray(objJSON);
        }
        // otherwise the object is JSON, e.g. GT/LT/EQ
        else {
/*            console.log(key)
            console.log(val)*/
            for (var key in objJSON) {

                var val = objJSON[key];
                if (key === "OR") {
                    var orFilter = new FilterOR(val, this.data);
                    this.filters.push(orFilter);
                    this.parseLogicFilters(orFilter);
                } else if (key === "AND") {
                    var andFilter = new FilterAND(val, this.data);
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

    // filter data
    applyFilter(): any[] {
                var dataFiltered: any[] = [];
/*                let element: any;
                for (element of this.data) {
                    for (let elementKey in element) {
                        if (elementKey === this.subNode1 && +element[elementKey] == this.subNode2) {
                            dataFiltered.push(element);
                        }
                    }
                }*/
                return dataFiltered;
    }
}

