export default class QueryOptions {
    options: any;
    data: any[];
    columns: string[] = [];
    order: string;
    valid: boolean = false;

    constructor(options: any, data: any[]) {
        this.options = options;
        this.data = data;
        this. parseQueryOptions();
        if (this.checkOptionsValid()) this.valid = true;
    }


    parseQueryOptions(): void {
        var objJSON = this.getOptions();
        for (var key in objJSON) {
            if (key === "COLUMNS") {
                let val = objJSON[key];
                for (let element of val) {
                    this.columns.push(element);
                }
            }
            if (key === "ORDER") {
                let val = objJSON[key];
                this.order = val;
            }
        }
    }

    checkOptionsValid(): boolean {
        // there can be either 1 or 2 keys, the first being COLUMNS, the second optional key is ORDER
        let optionKeys = Object.keys(this.options);
        if (optionKeys.length === 0 || optionKeys.length > 2 ||
            (optionKeys.length === 1 && optionKeys[0] !== "COLUMNS") ||
            (optionKeys.length === 2 && (optionKeys[0] !== "COLUMNS" || optionKeys[1] !== "ORDER"))) {
            return false;
        }

        // options are correct only if they include valid column names
        for (let element of this.columns) {
            if (!this.isValidRoomKey(element) && !this.isValidCourseKey(element)) {
                return false;
            }
        }

        // if ORDER is specified it is one of the columns listed
        if (this.order != null && this.columns.indexOf(this.order) == -1) return false;

        return true;
    }

    isValidRoomKey(val: string): boolean {
        return (val === "rooms_fullname" || val === "rooms_shortname" || val === "rooms_number" || val === "rooms_name"
            || val === "rooms_address" || val === "rooms_type" || val === "rooms_furniture" || val === "rooms_href" ||
            val === "rooms_seats" || val === "rooms_lat" || val === "rooms_lon");
    }

    isValidCourseKey(val: string): boolean {
        return (val  ===  "courses_avg" || val  ===  "courses_pass" || val  ===  "courses_fail" || val  ===  "courses_audit" ||
            val  === "courses_dept" || val === "courses_title" || val  === "courses_instructor" || val  === "courses_id" ||
            val === "courses_uuid");
    }


    // apply options to the currently stored data set
    applyOptions(): any[] {
        if (this.columns.length == 0) {
            this.parseQueryOptions();
        }
        var tempData: any [] = [];
        for (let element of this.getData()) {
            let tempObj: any = {};
            for (let col of this.columns) {
                if (element.hasOwnProperty(col)) {
                    tempObj[col] = element[col];
                }
            }
            tempData.push(tempObj);
        }
        // sort by key
        let that = this;
        return tempData.sort( function(a,b){
            if (a[that.order] > b[that.order]) return 1;
            if (a[that.order] < b[that.order]) return -1;
            return 0;});
    }

    getOptions(): any {
        return this.options;
    }

    setOptionsData(data: any[]): void{
        this.data = data;
    }

    getData(): any {
        return this.data;
    }

    isValid(): boolean {
        return this.valid;
    }

}