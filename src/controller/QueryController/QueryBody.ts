import {IFilter} from "./Filters/IFilter";
import FilterOR from "./Filters/FilterLogic/FilterOR";
import FilterAND from "./Filters/FilterLogic/FilterAND";
import FilterGT from "./Filters/FilterComparison/FilterGT";
import FilterLT from "./Filters/FilterComparison/FilterLT";
import FilterEQ from "./Filters/FilterComparison/FilterEQ";
import QueryOptions from "./QueryOptions";
import FilterIS from "./Filters/FilterComparison/FilterIS";
import FilterNOT from "./Filters/FilterLogic/FilterNOT";

export default class QueryBody {

    body: JSON;
    filters: IFilter[] = null;
    options: any;
    valid: boolean = false;

    data: any[];

    constructor(body: any, data: any[]) {
        this.setBody(body);
        this.filters = [];
        this.setData(data);
        this.parseQueryFilters(this.body);
        if (this.checkQueryValid()) this.valid = true;
    }


    // parse through JSON stored in query and construct the QueryOptions object
    parseQueryFilters(filters: any): void {
        var objJSON = this.getBody()
        for (var key in objJSON) {
            let val = objJSON[key];
           // check if each filter is of type listed in AST, then push to the array of filters
            if (key === "OR") {
                var orFilter = new FilterOR(val, this.data);
                this.filters.push(orFilter);
            } else if (key === "AND"){
                var andFilter = new FilterAND(val, this.data);
                this.filters.push(andFilter);
            } else if (key === "NOT") {
                var notFilter = new FilterNOT(val, this.data);
                this.filters.push(notFilter);;
            }else if (key === "GT"){
                var gtFilter = new FilterGT(val, this.data);
                this.filters.push(gtFilter);
            } else if (key === "LT"){
                var ltFilter = new FilterLT(val, this.data);
                this.filters.push(ltFilter);
            } else if (key === "EQ"){
                var eqFilter = new FilterEQ(val, this.data);
                this.filters.push(eqFilter);
            } else if (key === "IS") {
                var isFilter = new FilterIS(val, this.data);
                this.filters.push(isFilter);
            }
        }
    }

    // TODO chenge valid to not array for types other than AND/OR
    checkQueryValid(): boolean {
        var bodyKeys = this.getBody()
        // query is valid only if it contains query keywords specified in EBNF
        for (var key in bodyKeys) {
            if (key !== "AND" && key !== "OR" && key!== "NOT" && key !== "IS" && key !== "EQ" && key !== "GT" && key !== "LT") {
                return false;
            }
        }
        // value of filter keys AND/OR must be a non-empty array
        var key:string;
        for (key of bodyKeys) {
            let val = this.options[key];
            if ((key == "AND" || key == "OR") && (!Array.isArray(val) || val.length == 0)) return false;
        }
        // every filter in filters array must be valid
        for (var element of this.filters) {
            if (! element.isValid()) return false;
        }
        return true;
    }

    applyFilter(): any[] {
        var results: any[] = []
        let element: any;
        for (element of this.filters) {
            results = element.applyFilter();
        }

       // apply options to filtered results
        this.getQueryOpt().setData(results);
        return this.getQueryOpt().applyOptions();
    }

    isValid(): boolean {
        return this.valid;
    }

    getBody(): any {
        return this.body;
    }

    getQueryOpt(): any {
        return this.options;
    }
    setBody(body: any): void {
        this.body = body;
    }

    setData(data: any[]) {
        this.data = data;
    }

    setQueryOpt(options: any) {
        this.options = new QueryOptions(options, this.data);
    }

}