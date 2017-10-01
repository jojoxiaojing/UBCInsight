import Filter, {default as FilterLogic} from "./Filters/FilterLogic/FilterLogic";
import FilterGT from "./Filters/FilterComparison/FilterGT";
import FilterLT from "./Filters/FilterComparison/FilterLT";
import FilterEQ from "./Filters/FilterComparison/FilterEQ";
import FilterComparison from "./Filters/FilterComparison/FilterComparison";

interface IQueryBody {
    filters: any[];

    getBody(): JSON;
    setBody(body: any): void;
    parseQueryFilters(): void;
}

export default class QueryBody implements IQueryBody{

    body: JSON;
    filters: any[];

    constructor(body: any) {
        this.setBody(body);
        this.filters = [];
    }

    // parse through JSON stored in query and construct the QueryOptions object
    parseQueryFilters(): void {
        var objJSON = this.getBody()
        for (var key in objJSON) {
            let val = objJSON[key];
            //console.log(key)
            //console.log(val)
            // TODO: need to add more filter types
           // check if each filter is of type listed in AST, then push to the array of filters
            if (key === "OR") {
                //FILTEROR
                var orFilter = new FilterLogic(val);
                this.filters.push(orFilter);
                orFilter.parseLogicFilters(orFilter);
            } else if (key === "AND"){
                //FILTERAND
                var andFilter = new FilterLogic(val);
                this.filters.push(val);
                console.log("pushing "+andFilter)
                andFilter.parseLogicFilters(andFilter);
            } else if (key === "GT"){
                this.filters.push(new FilterComparison(val));
            } else if (key === "LT"){
                this.filters.push(new FilterComparison(val));
            } else if (key === "EQ"){
                this.filters.push(new FilterComparison(val));
            }
        }

    }

    getBody(): any {
        return this.body;
    }
    setBody(body: any): void {
        this.body = body;
    }

}