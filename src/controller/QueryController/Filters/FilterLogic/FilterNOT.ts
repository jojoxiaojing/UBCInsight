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

    data: any[];

    constructor(filter: any, data: any[]) {
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


    applyFilter(): any[] {
        if (this.filters.length == 0) {
            this.parseLogicFilters(this.filter);
        }
        return this.applyFilterHelper(this.filters, this.data);
    }

    // helper for recursive implmentation
    applyFilterHelper(filters: IFilter[], results: any[]): any[] {

        let element: any;
        for (element of this.filters) {
            // NOT filter treats every type filter the same, unlike other FilterLogic filters
            // that might do smth different for each type
            results = this.arrayDifference(results, element.applyFilter());
        }
        return results
    }

    arrayDifference(array1: any[], array2: any[]): any[] {

        var len1 = array1.length;
        var len2 = array2.length;
        for(var key1 = len1 - 1; key1 >= 0; key1 --) for(var key2 = 0; key2 < len2; key2++)
            if(this.dataEntriesEqual(array2[key2], array1[key1])){
                array1.splice(key1, 1);
            }
        return array1;
    }

    //TODO move this to the data class
    // check if two data entires are equal, assume the same keys
    dataEntriesEqual(dataEntry1: any, dataEntry2: any): boolean {
        // keys are the same
        let keys = Object.keys(dataEntry1);

        for (let key of keys) {
            if (dataEntry1[key] !== dataEntry2[key]) return false;
        }
        return true;
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
            // every filter key of type AND, OR, NOT must contain array as its value
            for (var key in keys) {
                let val = element[key];
                if (key === "AND" || key === "OR" || key === "NOT") {
                    if (!Array.isArray(val) || val.length == 0) return false;
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

    setData(data: any[]): void {
        this.data = data;
    }

}

