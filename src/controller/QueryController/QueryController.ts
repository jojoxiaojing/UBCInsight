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
    setQueryBody(body: JSON): void;
}

// need to pass options from parsing into query body to options field
export default class QueryController implements IQueryController{

    data: any[];
    //query: {[key: string]: JSON};
    query: JSON;
    queryBody: QueryBody = null;

    constructor(query: any, data: any[]) {
        this.query = query;
        this.data = data;
       // this.parseQueryBody();
     //   this.parseQueryOptions();
        //this.data = new MockData().getData();
    }

    //TODO parsing will be done inside the constructor. processQuery will recursively check if nodes are valid
    // parse query: body and options if the query contains WHERE and OPTIONS fields
    // will still need to check query string for WHERE and OPTIONS
    processQuery(): void {
        if (this.checkQueryValid()) {
            this.parseQueryBody();
            this.getQueryBody().processQueryBody();
            this.parseQueryOptions();
            this.getQueryBody().getQueryOpt().processQueryOptions();
        } else throw new Error('query invalid')
    }

    // parse through JSON stored in query and construct the QueryBody object
    parseQueryBody(): void {
        var objJSON = this.getQuery()
        for (var key in objJSON) {
            let val = objJSON[key];
            // construct Query object and set WHERE flag on
            if (key ==="WHERE") {
                this.setQueryBody(val);
            }
        }
    }

    // parse through JSON stored in query and construct the QueryOptions object
    parseQueryOptions(): void {
        var objJSON = this.getQuery()
        for (var key in objJSON) {
            let val = objJSON[key];

            // construct Options object and set OPTIONS flag on
            if (key === "OPTIONS") {
                this.getQueryBody().setQueryOpt(val);
            }
        }
    }

    // query is correct if its first JSON key is WHERE and second key is OPTIONS
    checkQueryValid(): boolean {
        let queryKeys = Object.keys(this.getQuery());
        if (queryKeys.length !== 2 || (queryKeys.length === 2 && queryKeys[0] !== "WHERE" && queryKeys[1] !== "OPTIONS")) {
            return false;
        }
        return true;
    }

    setQueryBody(body: JSON): void {
        this.queryBody = new QueryBody(body, this.data);
    }

    getQueryBody(): QueryBody {
        return this.queryBody;
    }

    getQuery(): any {
        return this.query;
    }

}
