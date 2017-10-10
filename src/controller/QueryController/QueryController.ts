import QueryBody from "./QueryBody";


interface IQueryController {
    // data set
    data: any[];
    // JSON that we feed in
    query: JSON;
    queryBody: QueryBody;
    valid: boolean

    parseQueryBody(): void;
    parseQueryOptions(): void;
    checkQueryValid(): boolean;
}

// need to pass options from parsing into query body to options field
export default class QueryController implements IQueryController{

    data: any[];
    //query: {[key: string]: JSON};
    query: JSON;
    queryBody: QueryBody ;
    valid: boolean = false;

    constructor(query: any, data: any[]) {
        this.query = query;
        this.data = data;
        this.parseQueryBody();
        this.parseQueryOptions();
        if (this.checkQueryValid()) this.valid = true;
        //this.data = new MockData().getData();
    }

    isValid(): boolean {
        if (this.valid === false) return false;
        if (!this.getQueryBody().isValid()) return false;
        if (!this.getQueryBody().getQueryOpt().isValid()) return false;

        return true;
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
        // check first to see if queryBody has been initialized
        if (this.getQueryBody() != null) {
            var objJSON = this.getQuery()
            for (var key in objJSON) {
                let val = objJSON[key];

                // construct Options object, if OPTIONS is one of the keys
                if (key === "OPTIONS") {
                    this.getQueryBody().setQueryOpt(val);
                }
            }
        }
    }

    checkQueryValid(): boolean {
        let queryKeys = Object.keys(this.getQuery());
        // query is correct if its first JSON key is WHERE and second key is OPTIONS, only 2 keys are allowed
        if (queryKeys.length !== 2 || (queryKeys.length === 2 && (queryKeys[0] !== "WHERE" || queryKeys[1] !== "OPTIONS"))) {
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
