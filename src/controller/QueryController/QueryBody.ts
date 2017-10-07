import {IFilter} from "./Filters/IFilter";
import FilterOR from "./Filters/FilterLogic/FilterOR";
import FilterAND from "./Filters/FilterLogic/FilterAND";
import FilterGT from "./Filters/FilterComparison/FilterGT";
import FilterLT from "./Filters/FilterComparison/FilterLT";
import FilterEQ from "./Filters/FilterComparison/FilterEQ";
import QueryOptions from "./QueryOptions";
import FilterIS from "./Filters/FilterComparison/FilterIS";

export default class QueryBody {

    body: JSON;
    filters: IFilter[];
    options: any;

    data: any[];

    constructor(body: any, data: any[]) {
        this.setBody(body);
        this.filters = [];
        this.data = data;
        this.parseQueryFilters(this.body);
    }

    // parse through JSON stored in query and construct the QueryOptions object
    parseQueryFilters(filters: any): void {
        var objJSON = this.getBody()
        for (var key in objJSON) {
            let val = objJSON[key];
            // TODO: need to add more filter types
           // check if each filter is of type listed in AST, then push to the array of filters
            if (key === "OR") {
                var orFilter = new FilterOR(val, this.data);
                this.filters.push(orFilter);
                orFilter.parseLogicFilters(orFilter);
            } else if (key === "AND"){
                var andFilter = new FilterAND(val, this.data);
                this.filters.push(andFilter);
                andFilter.parseLogicFilters(andFilter);
            } else if (key === "GT"){
                this.filters.push(new FilterGT(val, this.data));
            } else if (key === "LT"){
                this.filters.push(new FilterLT(val, this.data));
            } else if (key === "EQ"){
                this.filters.push(new FilterEQ(val, this.data));
            } else if (key === "IS") {
                this.filters.push(new FilterIS(val, this.data));
            }
        }
    }

    getBody(): any {
        return this.body;
    }
    setBody(body: any): void {
        this.body = body;
    }

    setData(data: any[]) {
        this.data = data;
    }

    setQueryOpt(options: any) {
        this.options = options;
    }


    applyFilter(): any[] {
        var results: any[] = []
        let element: any;
        for (element of this.filters) {
            results = element.applyFilter();
        }

       // apply options to filtered results
        var opt = new QueryOptions(this.options, results)
        return opt.applyOptions();
    }

}