import {IFilterLogic} from "./IFilterLogic";
import {IFilter} from "../IFilter";
import FilterOR from "./FilterOR";
import FilterGT from "../FilterComparison/FilterGT";
import FilterLT from "../FilterComparison/FilterLT";
import FilterEQ from "../FilterComparison/FilterEQ";
import FilterIS from "../FilterComparison/FilterIS";
import FilterNOT from "./FilterNOT";


export default class FilterAND implements IFilterLogic{
    type: "FilterLogic";
    subType: "FilterAND";
    // input array of JSON containing subnodes
    filter: any;
    filters: IFilter[];
    data: any[];

    // potentially need to check beforehand if there is a single key-value pair,
    // otherwise throw an error before the constructor is called
    constructor(filter: any, data: any[]) {
        this.data = data;
        this.filter = filter;
        this.filters = [];
        //this.parseLogicFilters(filter);
    }

    processQuery(): void {
        if (this.checkQueryValid()) {
            this.parseLogicFilters(this.filter);
        } else throw new Error('query invalid')
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
                    orFilter.processQuery();
                    this.filters.push(orFilter);
                } else if (key === "AND") {
                    var andFilter = new FilterAND(val, this.data);
                    andFilter.processQuery();
                    this.filters.push(andFilter);
                } else if (key === "GT") {
                    var gtFilter = new FilterGT(val, this.data);
                    gtFilter.processQuery();
                    this.filters.push(gtFilter);
                } else if (key === "LT") {
                    var ltFilter = new FilterLT(val, this.data);
                    ltFilter.processQuery();
                    this.filters.push(ltFilter);
                } else if (key === "EQ") {
                    var eqFilter  = new FilterEQ(val, this.data);
                    eqFilter.processQuery();
                    this.filters.push(eqFilter);
                } else if (key === "IS") {
                    var isFilter = new FilterIS(val, this.data)
                    isFilter.processQuery();
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

    // helper for recursive implementation
    applyFilterHelper(filters: IFilter[], results: any[]): any[] {

        let element: any;
        for (element of this.filters) {

            if (element instanceof FilterGT) {
                results = element.applyFilter();
            } else if (element instanceof FilterLT) {
                results = element.applyFilter();
            } else if (element instanceof FilterEQ) {
                results = element.applyFilter();
            } else if (element instanceof FilterIS) {
                results = element.applyFilter();
            }else if (element instanceof FilterOR) {
                let arrayValues = element.filters;
                let tempResults = element.applyFilterHelper(arrayValues, []);
                results = this.findArrayIntersection(results, tempResults);
            } else if (element instanceof FilterAND) {
                let arrayValues = element.filters;
                results = this.applyFilterHelper(arrayValues, results);
            } else if (element instanceof FilterNOT) {
                results = this.arrayDifference(results, element.applyFilter());
            }
        }
        return results
    }

    findArrayIntersection(array1: any[], array2: any[]): any[] {
        let results: any[] = [];
        var len1 = array1.length;
        var len2 = array2.length;
        for(var key1 = 0; key1 < len1; key1 ++) for(var key2 = 0; key2 < len2; key2++)
            if(this.dataEntriesEqual(array2[key2], array1[key1])){
                results.push(array1[key1]);
                array2.splice(key2,1);
                key2--;
                len2--;
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
        for (let element of this.filter) {
            let keys = Object.keys(element);
            if (keys.length > 1) return false;
            else {
                let key = keys[0];
                if (key !== "AND" && key !== "OR" && key !== "NOT" && key !== "IS" && key !== "EQ" && key !== "GT" && key !== "LT") {
                    return false;
                }
            }
        }
        return true;
    }

}

