export default class QueryOptions {
    options: any;
    data: any[];
    columns: string[] = [];
    order: string;

    constructor(options: any, data: any[]) {
        this.options = options;
        this.parseQueryOptions();
        this.data = data;
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
            //remove last comma and add }
            if (key === "ORDER") {
                let val = objJSON[key];
                this.order = val;
            }
        }

    }

    // apply options to the currently stored data set
    applyOptions(): any[] {
        var tempData: any [] = [];
        for (let element of this.getData()) {
            let tempObj: any = {};
            for (let col of this.columns) {
                if (element.hasOwnProperty(col)) {
                    tempObj[col] = element[col];
                    //let tempObj = (({ a, c }) => ({ a, c }))(element);
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

    getData(): any {
        return this.data;
    }


}