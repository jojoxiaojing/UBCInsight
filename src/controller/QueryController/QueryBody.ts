import Filter from "./Filters/FilterLogic/FilterLogic";
import FilterOR from "./Filters/FilterLogic/FilterOR";
import FilterAND from "./Filters/FilterLogic/FilterAND";
import FilterGT from "./Filters/FilterComparison/FilterGT";
import FilterLT from "./Filters/FilterComparison/FilterLT";
import FilterEQ from "./Filters/FilterComparison/FilterEQ";

interface IQueryBody {
    filters: Filter[];

    getBody(): JSON;
    setBody(body: any): void;
    parseQueryFilters(): void;
}

export default class QueryBody implements IQueryBody{

    body: JSON;
    filters: Filter[];

    constructor(body: any) {
        this.setBody(body);
    }

    // parse through JSON stored in query and construct the QueryOptions object
    parseQueryFilters(): void {
        var objJSON = this.getBody()

        for (var key in objJSON) {
            let val = objJSON[key];

            // TODO: need to add more filter types

           // check if each filter is of type listed in AST, then push to the array of filters
            if (objJSON.hasOwnProperty("OR")) {
                this.filters.push(new FilterOR(val));
            } else if (objJSON.hasOwnProperty("AND")){
                this.filters.push(new FilterAND(val));
            } else if (objJSON.hasOwnProperty("GT")){
                this.filters.push(new FilterGT(val));
            } else if (objJSON.hasOwnProperty("LT")){
                this.filters.push(new FilterLT(val));
            } else if (objJSON.hasOwnProperty("EQ")){
                this.filters.push(new FilterEQ(val));
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