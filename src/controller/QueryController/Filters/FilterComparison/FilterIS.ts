import {IFilterComparison} from "./IFilterComparison";

export default class FilterIS implements IFilterComparison {
    type: "FilterComparison"
    subType: "FilterIS"
    subNode1: string;
    subNode2: string;

    data: any[];

    constructor(filter: any, data: any[]) {
        this.data = data;
        // this is a workaround, as object passed to filter contains EQ
        let keys = Object.keys(filter);
        let vals =  Object.keys(filter).map((k) => filter[k]);
        //need to go one level further to extract

        this.subNode1 = keys[0];
        this.subNode2 = vals[0];
    }

    // check if the subnode types are consistent with AST
    isValidComparisonFilter(): boolean {
        if (this.isValidComparisonString() && typeof this.subNode2 === "string") {
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
}
