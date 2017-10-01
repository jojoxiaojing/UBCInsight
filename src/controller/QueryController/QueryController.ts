import QueryBody from "./QueryBody";
import QueryOptions from "./QueryOptions";

interface IQueryController {
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
    setQueryObj(body: QueryBody): void;
}

export default class QueryController implements IQueryController{

    //query: {[key: string]: JSON};
    query: JSON;
    queryObj: QueryBody;
    queryOpt: QueryOptions;
    // flags for queries validity
    hasWhere: boolean;
    hasOptions: boolean;

    constructor(query: any) {
        this.query = JSON.parse(query);
        this.setHasWhere(false);
        this.setHasOptions(false);
        this.parseQueryBody();
        this.parseQueryOptions();
    }

    // parse through JSON stored in query and construct the QueryBody object
    parseQueryBody(): void {
        var objJSON = this.getQuery()
        for (var key in objJSON) {
            let val = objJSON[key];
            // construct Query object and set WHERE flag on
            if (objJSON.hasOwnProperty("WHERE")) {
                this.setQueryObj(val);
                // need to add an if statement for recursively checking validity of nested query components
                this.setHasWhere(true);
            }
        }
        // throws an error if query parsing fails at any level
        if (this.getHasWhere() !== true) throw ("error: query is invalid");
    }

    // parse through JSON stored in query and construct the QueryOptions object
    parseQueryOptions(): void {
        var objJSON = this.getQuery()
        for (var key in objJSON) {
            let val = objJSON[key];

            // construct Options object and set OPTIONS flag on
            if (objJSON.hasOwnProperty("OPTIONS")) {
                this.setQueryOpt(val);
                // need to add an if statement for recursively checking validity of nested query components
                this.setHasOptions(true);
            }
        }
        // throws an error if query parsing fails at any level
        if (this.getHasOptions() !== true) throw ("error: query is invalid");
    }

    setQueryObj(body: QueryBody): void {
        this.queryObj = new QueryBody(body);
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
