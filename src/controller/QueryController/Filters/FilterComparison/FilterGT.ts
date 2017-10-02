import {IFilterComparison} from "./IFilterComparison";

export default class FilterGT implements IFilterComparison {
    type: "FilterComparison"
    subType: "FilterEQ"
    subNode1: string;
    subNode2: number;

    data: any[];

    constructor(filter: any, data: any[]) {
        this.data = data;
        for (var key in filter) {
            let val = filter[key];
            // this is a workaround, as object passed to filter contains EQ
            let keys = Object.keys(filter);
            let vals = Object.values(filter);
            /*        console.log(keys)
                    console.log(vals)*/
            this.subNode1 = keys[0];
            this.subNode2 = vals[0];
            //console.log(this.subNode1)
            //console.log(this.subNode2)
        }
    }

    // check if the subnode types are consistent with AST
    isValidComparisonFilter(): boolean {
        if (this.isValidComparisonString() && typeof this.subNode2 === "number") {
            return true;
        }
        else {
            return false;
        }
    }

    // helper to check if the first subNode in the comparison is a valid key of type string
    isValidComparisonString(): boolean {
        if (typeof this.subNode1 === "string" && (this.subNode1 === "courses_avg" ||
                this.subNode1 === "courses_pass" || this.subNode1 === "courses_fail" || this.subNode1 === "courses_audit")) {
            return true;
        } else return false;
    }

    // filter data
    applyFilter(): any[] {
        var dataFiltered = [];
        let element: any;
        for (element of this.data) {
            let keys = Object.keys(element);
            for (let elementKey of keys) {
                if (elementKey === this.subNode1 && +element[elementKey] > this.subNode2) {
                    dataFiltered.push(element);
                }
            }
        }
        return dataFiltered;
    }
}
