import QueryBody from "./QueryBody";
import QueryOptions from "./QueryOptions";
import MockData from "../../../test/MockData";

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
    setQueryObj(body: JSON): void;
}

export default class QueryController implements IQueryController{

    //query: {[key: string]: JSON};
    query: JSON;
    queryObj: QueryBody;
    queryOpt: QueryOptions;
    // flags for queries validity
    hasWhere: boolean;
    hasOptions: boolean;

    //TODO replace MockData by porting QueryController and DataController
    // set data set to MockDate for testing purposes
    data: MockData = new MockData();

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
            if (key ==="WHERE") {
                this.setQueryObj(val);
                // need to add an if statement for recursively checking validity of nested query components
                this.setHasWhere(true);
            }
        }
        // throws an error if query parsing fails at any level
        if (this.getHasWhere() !== true) throw ("error: query is invalid");
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
        if (this.getHasOptions() !== true) throw ("error: query is invalid");
    }


    // TODO figure out whether this method is necessary, and if so construct it
    evaluateQuery(data: MockData): any[] {
        let response: any[] = [];

        for (let element of data.getData()) {
 /*           if () {
            }*/
            return response
        }
    }


    setQueryObj(body: JSON): void {
        this.queryObj = new QueryBody(body, this.data.getData());
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
