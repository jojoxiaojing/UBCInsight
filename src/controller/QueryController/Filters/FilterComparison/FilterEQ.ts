import {IFilterComparison} from "./IFilterComparison";

export default class FilterEQ implements IFilterComparison {
    type: "FilterComparison"
    subType: "FilterEQ"
    filter: any;
    subNode1: string;
    subNode2: number;
    valid: boolean = false;

    data: any[];

    constructor(filter: any, data: any[]) {
        this.data = data;
        this.filter = filter;
        let keys = Object.keys(this.filter);
        let vals =  Object.keys(this.filter).map((k) => this.filter[k]);
        this.subNode1 = keys[0];
        this.subNode2 = vals[0];
        if (this.checkQueryValid()) this.valid = true;
    }


    // check if the subnode types are consistent with AST
    checkQueryValid(): boolean {
        let val = this.subNode2;
        if (this.isValidComparisonString() && typeof val === "number") {
            return true;
        }
        else {
            return false;
        }
    }

    // helper to check if the first subNode in the comparison is a valid key of type string
    isValidComparisonString(): boolean {
        let val = this.subNode1;
        if (!(typeof val === "string" && (val === "courses_avg" ||
                val === "courses_pass" || val  === "courses_fail" || val  === "courses_audit"))) {
            return false;
        }
        return true;
    }

    // filter data
    applyFilter(): any[] {
        let subNode1 = this.subNode1;
        let subNode2 = this.subNode2;
        let dataFiltered = [];
        let element: any;
        for (element of this.data) {
            let keys = Object.keys(element);
                for (let elementKey of keys) {
                    if (elementKey == subNode1 && +element[elementKey] === subNode2) {
                        dataFiltered.push(element);
                    }
                }
        }
        return dataFiltered;
    }

    isValid(): boolean {
        return this.valid;
    }

    setData(data: any[]): void {
        this.data = data;
    }
}
