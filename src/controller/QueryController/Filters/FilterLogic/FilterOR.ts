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
        var dataFiltered: any[] = [];
        return this.applyFilterHelper(this.filters, dataFiltered);
    }

    // helper for recursive implementation
    applyFilterHelper(filters: IFilter[], results: any[]): any[] {

        let element: any;
        for (element of filters) {
            // unfortunately had to do this to construct a key-value pair - the input to comparison filter constructors
            // this is only sed in FilterComparison type objects, where the first element is data field, the second is number
            let elementNode1Value = Object.keys(element).map((k) => element[k])[1]
            let elementNode2Value = Object.keys(element).map((k) => element[k])[2]

            // do this to reference object key by variable instance
            let filterObj:any = {};
            filterObj[elementNode1Value] = elementNode2Value;

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
                //let arrayValues = Object.values(element).slice(1)[0];
                let arrayValues = Object.keys(element).map((k) => element[k]).slice(1)[0];
                results = results.concat(this.applyFilterHelper(arrayValues, []));
            } else if (element instanceof FilterAND) {
                //let arrayValues = Object.values(element).slice(1)[0];
                let arrayValues = Object.keys(element).map((k) => element[k]).slice(1)[0];
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
}

