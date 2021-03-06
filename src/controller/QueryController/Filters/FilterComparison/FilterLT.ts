import {IFilterComparison} from "./IFilterComparison";

export default class FilterLT implements IFilterComparison {
    type: "FilterComparison"
    subType: "FilterLT"
    filter: any;
    subNode1: string;
    subNode2: number;
    valid: boolean = false;

    data: any;

    constructor(filter: any, data: any) {
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
                val === "courses_pass" || val  === "courses_fail" || val  === "courses_audit" ||
                val === "courses_year" || val === "rooms_seats" || val === "rooms_lat" || val === "rooms_lon"))) {
            return false;
        }
        return true;
    }

    // filter data
    applyFilter(): boolean {
        var dataFiltered = [];
        if (+this.data[this.subNode1 ] < this.subNode2) {
            return true;
        } else return false;
    }

    isValid(): boolean {
        return this.valid;
    }

    setData(data: any): void {
        this.data = data;
    }
}
