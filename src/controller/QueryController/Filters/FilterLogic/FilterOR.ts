import {IFilterLogic} from "./IFilterLogic";
import {IFilter} from "../IFilter";
import FilterAND from "./FilterAND";
import FilterGT from "../FilterComparison/FilterGT";
import FilterLT from "../FilterComparison/FilterLT";
import FilterEQ from "../FilterComparison/FilterEQ";
import FilterIS from "../FilterComparison/FilterIS";
import FilterNOT from "./FilterNOT";


export default class FilterOR implements IFilterLogic{
    type: "FilterLogic";
    subType: "FilterOR";
    // input array of JSON containing subnodes
    filter: any;
    filters: IFilter[];
    data: any[];
    valid: boolean = false;

    // potentially need to check beforehand if there is a single key-value pair,
    // otherwise throw an error before the constructor is called
    constructor(filter: any, data: any[]) {
        this.data = data;
        this.filter = filter;
        this.filters = [];
        this.parseLogicFilters(filter);
        if (this.checkQueryValid()) this.valid = true;
    }

/*
    processQuery(): void {
        if (this.checkQueryValid()) {
            this.parseLogicFilters(this.filter);
        } else throw new Error('query invalid')
    }
*/

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
                    var isFilter = new FilterIS(val, this.data)
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

    // filter data
    // keep passing the data through each filter iteratively for and
    applyFilter(): any[] {
        if (this.filters.length == 0) {
            this.parseLogicFilters(this.filter);
        }
        var dataFiltered: any[] = [];
        return this.applyFilterHelper(this.filters, dataFiltered);
    }

    // helper for recursive implementation
    applyFilterHelper(filters: IFilter[], results: any[]): any[] {

        let element: any;
        for (element of filters) {

            if (element instanceof FilterGT) {
                let tempResults = element.applyFilter();
                results = results.concat(tempResults);
            } else if (element instanceof FilterLT) {
                let tempResults = element.applyFilter();
                results = results.concat(tempResults);
            } else if (element instanceof FilterEQ) {
                let tempResults = element.applyFilter();
                results = results.concat(tempResults);
            } else if (element instanceof FilterIS) {
                let tempResults = element.applyFilter();
                results = results.concat(tempResults);
            } else if (element instanceof FilterOR) {
                let arrayValues = element.filters;
                results = results.concat(this.applyFilterHelper(arrayValues, []));
            } else if (element instanceof FilterAND) {
                let arrayValues = element.filters;
                //elelment is of type FilterAND so apply that class's filter function
                results = results.concat(element.applyFilterHelper(arrayValues, this.data));
            } else if (element instanceof FilterNOT) {
                results = this.arrayDifference(results, element.applyFilter());
            }
        }
        return this.removeDuplicates(results);
    }

    // returns array of unique values
    removeDuplicates(results: any[]): any[] {
        var len = results.length;
        for(var key1 = 0; key1 < len; key1 ++) for(var key2 = key1 + 1; key2 < len; key2++)
            if(this.dataEntriesEqual(results[key2], results[key1])){
                results.splice(key2,1);
                key2--;
                len--;
            }
        return results;
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

    arrayDifference(array1: any[], array2: any[]): any[] {
        var len1 = array1.length;
        var len2 = array2.length;
        for(var key1 = len1 - 1; key1 >= 0; key1 --) for(var key2 = 0; key2 < len2; key2++)
            if(this.dataEntriesEqual(array2[key2], array1[key1])){
                array1.splice(key1, 1);
            }
        return array1;
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

