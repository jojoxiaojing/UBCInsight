import {IFilterLogic} from "./IFilterLogic";
import {IFilter} from "../IFilter";
import FilterOR from "./FilterOR";
import FilterGT from "../FilterComparison/FilterGT";
import FilterLT from "../FilterComparison/FilterLT";
import FilterEQ from "../FilterComparison/FilterEQ";
import FilterIS from "../FilterComparison/FilterIS";
import FilterAND from "./FilterAND";


export default class FilterNOT implements IFilterLogic{
    type: "FilterLogic";
    subType: "FilterNOT";
    filters: IFilter[];
    filter: any;
    valid: boolean = false;

    data: any;
    subtotal: any[];

    constructor(filter: any, data: any) {
        this.data = data;
        // input array of JSON containing subnodes
        this.filter = filter;
        this.filters = [];
        this.parseLogicFilters(filter);
        if (this.checkQueryValid()) this.valid = true;
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
                if (key === "OR") {
                    var orFilter = new FilterOR(val, this.data);
                    this.filters.push(orFilter);
                } else if (key === "AND") {
                    var andFilter = new FilterAND(val, this.data);
                    this.filters.push(andFilter);
                } else if (key === "GT") {
                    var gtFilter = new FilterGT(val, this.data);
                    this.filters.push(gtFilter);
                } else if (key === "LT") {
                    var ltFilter = new FilterLT(val, this.data);
                    this.filters.push(ltFilter);
                } else if (key === "EQ") {
                    var eqFilter  = new FilterEQ(val, this.data);
                    this.filters.push(eqFilter);
                } else if (key === "IS") {
                    var isFilter = new FilterIS(val, this.data);
                    this.filters.push(isFilter);
                } else if (key === "NOT") {
                    var notFilter = new FilterNOT(val, this.data);
                    this.filters.push(notFilter);
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


    // NOT can have only a single child node, the output of which we reverse
    applyFilter(): boolean {
        let result = this.filters[0].applyFilter();
        return !result;
    }

    checkQueryValid(): boolean {
        // query is valid only if it contains query keywords specified in EBNF
        for (let element of this.filter) {
            let keys = Object.keys(element);
            // there can only be a single key
            if (keys.length > 1) return false;
            else {
                let key = keys[0];
                if (key !== "AND" && key !== "OR" && key !== "NOT" && key !== "IS" && key !== "EQ" && key !== "GT" && key !== "LT") {
                    return false;
                }
            }
        }
        if (this.filters.length == 0) return false;
        for (var element of this.filters) {
            if (! element.isValid()) return false;
        }
        return true;
    }

    isValid(): boolean {
        return this.valid;
    }

    setData(data: any): void {
        this.data = data;
        for (let i of this.filters) {
            i.setData(data);
        }
    }

}