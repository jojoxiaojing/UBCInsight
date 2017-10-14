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
            if (element !== "courses_avg" &&
                element !== "courses_pass" && element !== "courses_fail" && element !== "courses_audit"
                && element !== "courses_dept" && element !== "courses_instructor" && element !== "courses_id"
                && element !== "courses_uuid" && element !== "courses_title") {
                return false;
            }
        }

        // if ORDER is specified it is one of the columns listed
        if (this.order != null && this.columns.indexOf(this.order) == -1) return false;

        return true;
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