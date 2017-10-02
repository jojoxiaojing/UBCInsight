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

    // not sure if there is need for parsing the data at all
    // filter data
    // keep passing the data through each filter iteratively for and
    applyFilter(): any[] {
        var dataFiltered: any[] = [];
        return this.applyFilterHelper(this.filters, dataFiltered);
    }

    //TODO add AND/OR recursive implementation
    // TODO need to check whether there is need to parse this into objects at all
    // helper for recursive implementation
    applyFilterHelper(filters: IFilter[], results: any[]): any[] {
        //base case for recursive implementation
        //if (filters.length == 0) return results;

        let element: any;
        for (element of filters) {
            // unfortunately had to do this to construct a key-value pair - the input to comparison filter constructors
            let elementNode1Value = Object.values(element)[1]
            let elementNode2Value = Object.values(element)[2]
            // do this to reference object key by variable instance
            let filterObj:any = {};
            filterObj[elementNode1Value] = elementNode2Value;

            if (element instanceof FilterGT) {
                let elementGT = new FilterLT(filterObj, this.data);
                let tempResults = elementGT.applyFilter();
                results = results.concat(tempResults);
            } else if (element instanceof FilterLT) {

                let elementLT = new FilterLT(filterObj, this.data);
                let tempResults = elementLT.applyFilter();
                results = results.concat(tempResults);
            } else if (element instanceof FilterEQ) {

                let elementEQ = new FilterEQ(filterObj, this.data);
                //console.log(elementEQ)
                let tempResults = elementEQ.applyFilter();
                results = results.concat(tempResults);
                //console.log(results)

            } else if (element instanceof FilterOR) {
                let arrayValues = Object.values(element).slice(1)[0];

                results = results.concat(this.applyFilterHelper(arrayValues, []));
                // TODO figure out how to implement recursive OR, also what to do with repeated entries, maybe Set?
                // need to iterate over an array
            }
        }
        console.log(results)
        return results;
    }

}

