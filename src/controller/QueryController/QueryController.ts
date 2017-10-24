import QueryBody from "./QueryBody";


interface IQueryController {
    // data set
    data: any;
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

    data: any;
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
            // construct Query object, if WHERE is one of the keys
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

    setData(data: any): void {
        this.data = data;
        this.getQueryBody().setData(data);
    }

    whichID(): string {
        if (this.isValid()) {
            var containsCourseFields: boolean = this.checkContainsCourseFields();
            var containsRoomFields: boolean = this.checkContainsRoomFields();

            if (containsCourseFields && containsRoomFields) return "wrongID";
            else if (containsCourseFields) return "courses";
            else if (containsRoomFields) return "rooms";
            else return "wrongID"
        } else return "brokenQuery"
    }

    checkContainsCourseFields(): boolean {

        var queryBody = this.getQueryBody().getBody();
        var courseFields = ["courses_dept", "courses_id", "courses_avg", "courses_instructor",
            "courses_title", "courses_pass", "courses_fail", "courses_audit", "courses_uuid", "courses_year"];
        var response = false;
        for (let element of courseFields) {
            if (JSON.stringify(queryBody).indexOf(element) !== -1) response = true;
        }
        return response;
    }

    checkContainsRoomFields(): boolean {
        var queryBody = this.getQueryBody().getBody();
        var roomFields = ["rooms_fullname", "rooms_shortname", "rooms_number", "rooms_name", "rooms_address", "rooms_lat",
            "rooms_lon", "rooms_seats", "rooms_type", "rooms_furniture", "rooms_href"];
        var response = false;
        for (let element of roomFields) {
            if (JSON.stringify(queryBody).indexOf(element) !== -1) response = true;
        }
        return response;
    }

}
