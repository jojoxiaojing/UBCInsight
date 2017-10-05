import QueryBody from "./QueryBody";
import QueryOptions from "./QueryOptions";
import MockData from "../../../test/MockDataTest";
import {IFilter} from "./Filters/IFilter";
import FilterGT from "./Filters/FilterComparison/FilterGT";
import FilterLT from "./Filters/FilterComparison/FilterLT";
import FilterEQ from "./Filters/FilterComparison/FilterEQ";
import FilterOR from "./Filters/FilterLogic/FilterOR";
import FilterAND from "./Filters/FilterLogic/FilterAND";

interface IQueryController {
    // data set
    data: any[];
    // JSON that we feed in
    query: JSON;
    queryObj: QueryBody;
    queryOpt: QueryOptions;

    getQueryObj(): QueryBody;
    getQueryOpt(): QueryOptions;
    getQuery(): JSON;
    getHasWhere(): boolean;
    getHasOptions(): boolean;
    setHasWhere(where: boolean): void;
    setHasOptions(options: boolean): void;
    setQueryObj(body: JSON): void;
}

export default class QueryController implements IQueryController{

    data: any[];
    //query: {[key: string]: JSON};
    query: JSON;
    queryObj: QueryBody;
    queryOpt: QueryOptions;
    // flags for queries validity
    hasWhere: boolean;
    hasOptions: boolean;

    constructor(query: any, data: any[]) {
        this.query = query;
        this.data = data;
        this.setHasWhere(false);
        this.setHasOptions(false);
        this.parseQueryBody();
        this.parseQueryOptions();
        //this.data = new MockData().getData();
    }

    // parse through JSON stored in query and construct the QueryBody object
    parseQueryBody(): void {
        var objJSON = this.getQuery()
        for (var key in objJSON) {
            let val = objJSON[key];
            // construct Query object and set WHERE flag on
            if (key ==="WHERE") {
                this.setQueryObj(val);
                // need to add an if statement for recursively checking validity of nested query components
                this.setHasWhere(true);
            }
        }
        // throws an error if query parsing fails at any level
       // if (this.getHasWhere() !== true) throw ("error: query is invalid");
        //console.log(this.queryObj)
    }

    //TODO: populate QueryOptions class with actual options and figure out how to pass processed data to QueryOptions
    // parse through JSON stored in query and construct the QueryOptions object
    parseQueryOptions(): void {
        var objJSON = this.getQuery()
        for (var key in objJSON) {
            let val = objJSON[key];

            // construct Options object and set OPTIONS flag on
            if (key === "OPTIONS") {
                this.setQueryOpt(val);
                // need to add an if statement for recursively checking validity of nested query components
                this.setHasOptions(true);
            }
        }
        // throws an error if query parsing fails at any level
        //if (this.getHasOptions() !== true) throw ("error: query is invalid");
    }


    setQueryObj(body: JSON): void {
        this.queryObj = new QueryBody(body, this.data);
    }

    setQueryOpt(options: QueryOptions) : void {
        this.queryOpt = new QueryOptions(options);
    }

    getQueryObj(): QueryBody {
        return this.queryObj;
    }

    getQueryOpt(): QueryOptions {
        return this.queryOpt;
    }

    getQuery(): any {
        return this.query;
    }

    getHasWhere(): boolean {
        return this.hasWhere;
    }

    getHasOptions(): boolean {
        return this.hasOptions;
    }

    setHasWhere(where: boolean): void {
        this.hasWhere = where;
    }
    setHasOptions(options: boolean): void {
        this.hasOptions = options;
    }
}
