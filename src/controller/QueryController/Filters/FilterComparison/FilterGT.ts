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
            this.subNode1 = Object.keys(val)[0];
            this.subNode2 = Object.values(val)[0];
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
            for (let elementKey in element) {
                if (elementKey === this.subNode1 && +element[elementKey] > this.subNode2) {
                    dataFiltered.push(element);
                }
            }
        }
        return dataFiltered;
    }
}
