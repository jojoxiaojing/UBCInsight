import {IFilterComparison} from "./IFilterComparison";

export default class FilterIS implements IFilterComparison {
    type: "FilterComparison"
    subType: "FilterIS"
    filter: any;
    subNode1: string;
    subNode2: string;
    valid: boolean = true;

    data: any[];

    constructor(filter: any, data: any[]) {
        this.data = data;
        this.filter = filter;
        let keys = Object.keys(this.filter);
        let vals =  Object.keys(this.filter).map((k) => this.filter[k]);
        this.subNode1 = keys[0];
        this.subNode2 = vals[0];
        if(this.checkQueryValid()) this.valid = true;
    }

/*    processQuery(): void {
        if (this.checkQueryValid()) {
            let keys = Object.keys(this.filter);
            let vals =  Object.keys(this.filter).map((k) => this.filter[k]);
            this.subNode1 = keys[0];
            this.subNode2 = vals[0];
        } else throw new Error('query invalid')
    }*/

    // check if the subnode types are consistent with AST, for IS filter we cannot have "*" in the string
    checkQueryValid(): boolean {
        let vals =  Object.keys(this.filter).map((k) => this.filter[k]);
        let val = vals[0]
        if (this.isValidComparisonString() && typeof val === "string" && val.indexOf("*") == -1) {
            return true;
        }
        else {
            return false;
        }
    }

    // helper to check if the first subNode in the comparison is a valid key of type string
    isValidComparisonString(): boolean {
        let keys = Object.keys(this.filter);
        let val = keys[0];
        if (typeof val === "string" && (val === "courses_avg" ||
                val === "courses_pass" || val  === "courses_fail" || val  === "courses_audit"
                || val  === "courses_dept" || val  === "courses_instructor" || val  === "courses_id"
                || val === "courses_uuid")) {
            return true;
        } else return false;
    }

    // filter data
    applyFilter(): any[] {
        let subNode1 = this.subNode1;
        let subNode2 = this.subNode2;
        let dataFiltered = [];
        let element: any;
        for (element of this.data) {
            //console.log(element)
            let keys = Object.keys(element);
            for (let elementKey of keys) {
                if (elementKey === subNode1 && element[elementKey] === subNode2) {
                    dataFiltered.push(element);
                }
            }
        }
        return dataFiltered;
    }

    isValid(): boolean {
        return this.valid;
    }
}
