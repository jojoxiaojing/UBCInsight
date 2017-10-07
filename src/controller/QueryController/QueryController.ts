import QueryBody from "./QueryBody";


interface IQueryController {
    // data set
    data: any[];
    // JSON that we feed in
    query: JSON;
    queryBody: QueryBody;

    getQueryBody(): QueryBody;
   // getQueryOpt(): QueryOptions;
    getQuery(): JSON;
    getHasWhere(): boolean;
   // getHasOptions(): boolean;
    setHasWhere(where: boolean): void;
    //setHasOptions(options: boolean): void;
    setQueryBody(body: JSON): void;
}

// need to pass options from parsing into query body to options field
export default class QueryController implements IQueryController{

    data: any[];
    //query: {[key: string]: JSON};
    query: JSON;
    queryBody: QueryBody;
    // flags for queries validity
    hasWhere: boolean;
    hasOptions: boolean;

    constructor(query: any, data: any[]) {
        this.query = query;
        this.data = data;
        this.setHasWhere(false);
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
                this.setQueryBody(val);
                // need to add an if statement for recursively checking validity of nested query components
                this.setHasWhere(true);
            }
        }
        // throws an error if query parsing fails at any level
       // if (this.getHasWhere() !== true) throw ("error: query is invalid");
}

    // parse through JSON stored in query and construct the QueryOptions object
    parseQueryOptions(): void {
        var objJSON = this.getQuery()
        for (var key in objJSON) {
            let val = objJSON[key];

            // construct Options object and set OPTIONS flag on
            if (key === "OPTIONS") {
                this.getQueryBody().setQueryOpt(val);
                // need to add an if statement for recursively checking validity of nested query components
                //this.setHasOptions(true);
            }
        }
        // throws an error if query parsing fails at any level
        //if (this.getHasOptions() !== true) throw ("error: query is invalid");
    }


    setQueryBody(body: JSON): void {
        this.queryBody = new QueryBody(body, this.data);
    }

/*    setQueryOpt(options: QueryOptions) : void {
        this.queryOpt = new QueryOptions(options, this.data);
    }*/

    getQueryBody(): QueryBody {
        return this.queryBody;
    }

/*    getQueryOpt(): QueryOptions {
        return this.queryOpt;
    }*/

    getQuery(): any {
        return this.query;
    }

    getHasWhere(): boolean {
        return this.hasWhere;
    }

  /*  getHasOptions(): boolean {
        return this.hasOptions;
    }*/

    setHasWhere(where: boolean): void {
        this.hasWhere = where;
    }

/*    setHasOptions(options: boolean): void {
        this.hasOptions = options;
    }*/
}
