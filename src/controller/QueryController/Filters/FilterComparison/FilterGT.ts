
import {IFilterComparison} from "./IFilterComparison";

export default class FilterGT implements IFilterComparison {
    type: "FilterComparison"
    subType: "FilterEQ"
    subNode1: string;
    subNode2: number;

    // potential need to check beforehand if there is a single key-value pair,
    // otherwise throw an error before the constructor is called
    constructor(filter: any) {
        for (var key in filter) {
            let val = filter[key];
            this.subNode1 = key;
            this.subNode2 = val;
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
}
