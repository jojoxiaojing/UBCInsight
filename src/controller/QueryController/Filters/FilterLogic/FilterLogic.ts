import FilterGT from "../FilterComparison/FilterGT";
import FilterLT from "../FilterComparison/FilterLT";
import FilterEQ from "../FilterComparison/FilterEQ";

export default class FilterLogic {
    filters: any[];

    // potential need to check beforehand if there is a single key-value pair,
    // otherwise throw an error before the constructor is called
    constructor(filter: any) {
        this.parseLogicFilters(filter);
    }

    // recursively parse JSON subnodes of logic filter
    parseLogicFilters(objJSON: any): void {
        for (var key in objJSON) {
            var val = objJSON[key];
            if (objJSON.hasOwnProperty("OR")) {
                //var orFilter = new FilterOR(val);
                var orFilter = new FilterLogic(val);
                this.filters.push(orFilter);
                orFilter.parseLogicFilters(orFilter);
            } else if (objJSON.hasOwnProperty("AND")){
                //var andFilter = new FilterAND(val);
                var andFilter = new FilterLogic(val);
                this.filters.push(val);
                andFilter.parseLogicFilters(andFilter);
            } else if (objJSON.hasOwnProperty("GT")){
                this.filters.push(new FilterGT(val));
            } else if (objJSON.hasOwnProperty("LT")){
                this.filters.push(new FilterLT(val));
            } else if (objJSON.hasOwnProperty("EQ")){
                this.filters.push(new FilterEQ(val));
            }
        }
    }

}

