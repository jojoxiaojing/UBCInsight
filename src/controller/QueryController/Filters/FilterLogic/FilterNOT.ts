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
                } else if (key === "IS") {
                    this.filters.push(new FilterIS(val, this.data));
                } else if (key === "NOT") {
                    this.filters.push(new FilterNOT(val, this.data));
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
        return this.applyFilterHelper(this.filters, this.data);
    }

    // helper for recursive implmentation
    applyFilterHelper(filters: IFilter[], results: any[]): any[] {

        let element: any;
        for (element of this.filters) {
            // unfortunately had to do this to construct a key-value pair - the input to comparison filter constructors
            // this is only sed in FilterComparison type objects, where the first element is data field, the second is number

            let elementNode1Value =  Object.keys(element).map((k) => element[k])[1];
            let elementNode2Value =  Object.keys(element).map((k) => element[k])[2];


            // do this to reference object key by variable instance
            let filterObj: any = {};
            filterObj[elementNode1Value] = elementNode2Value;

            if (element instanceof FilterGT) {
                results = this.arrayDifference(results, element.applyFilter());
            } else if (element instanceof FilterLT) {
                results = this.arrayDifference(results, element.applyFilter());
            } else if (element instanceof FilterEQ) {
                results = this.arrayDifference(results, element.applyFilter());
            } else if (element instanceof FilterIS) {
                results = this.arrayDifference(results, element.applyFilter());
            }else if (element instanceof FilterOR) {
                results = this.arrayDifference(results, element.applyFilter());
            } else if (element instanceof FilterAND) {
                results = this.arrayDifference(results, element.applyFilter());
            } else if (element instanceof FilterNOT) {
                results = this.arrayDifference(results, element.applyFilter());
            }
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

}

