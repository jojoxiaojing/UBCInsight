import {IFilterComparison} from "./IFilterComparison";

export default class FilterIS implements IFilterComparison {
    type: "FilterComparison"
    subType: "FilterIS"
    filter: any;
    subNode1: string;
    subNode2: string;
    valid: boolean = false;

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


    // check if the subnode types are consistent with AST, for IS filter we
    // can have wildcard "*" in the beginning or the end of the string
    checkQueryValid(): boolean {
        let val = this.subNode2;
        // it is OK to have no *, have * in the beginning and no * at the end, * at the end, and *s both at the beginning/end
        if (this.isValidComparisonString() && typeof val === "string" &&
            (val.indexOf("*") == -1 || (val.indexOf("*") == 0 && this.subNode2.slice(1).indexOf("*") == -1)
                || val.indexOf("*") == val.length-1 ||
                (this.subNode2.indexOf("*") == 0 && this.subNode2.slice(1).indexOf("*") == (this.subNode2.length - 2)))) {
            return true;
        }
        else {
            return false;
        }
    }

    // helper to check if the first subNode in the comparison is a valid key of type string
    isValidComparisonString(): boolean {
        let val = this.subNode1;
        if (!(typeof val === "string" && (val  === "courses_dept" || val === "courses_title"
                || val  === "courses_instructor" || val  === "courses_id" || val === "courses_uuid"))) {
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
        var nodeLength = this.subNode2.length
        for (element of this.data) {
            //console.log(element)

                // no wildcards case
                if (this.subNode2.indexOf("*") == -1) {
                    if (element[this.subNode1] === subNode2) {
                        dataFiltered.push(element);
                    }

                    //wildcard both at the beginning and in the end
                } else if (this.subNode2.indexOf("*") == 0 && this.subNode2.slice(1).indexOf("*") == (nodeLength - 2)) {
                    if ( this.stringContainsSubstring(element[this.subNode1], this.subNode2.slice(1).slice(0, nodeLength - 2))) {
                        dataFiltered.push(element);
                        continue;
                    }
                }
                //wildcard in the beginning of the string
                else if (this.subNode2.indexOf("*") == 0) {
                    if (this.stringContainsSubstring(element[this.subNode1].slice(element[this.subNode1].length - nodeLength + 1,
                            element[this.subNode1].length), this.subNode2.slice(1))) {
                        dataFiltered.push(element);
                    }
                    //wildcard in the end of the string
                } else if (this.subNode2.indexOf("*") == nodeLength - 1) {
                    if (this.stringContainsSubstring(element[this.subNode1].slice(0, nodeLength-1),
                            this.subNode2.slice(0, nodeLength - 1))) {
                        dataFiltered.push(element);
                    }
                }
        }
        return dataFiltered;
    }

    stringContainsSubstring(str1: string, str2: string): boolean {
        var str1 = str1.toString();
        var str2 = str2.toString();
        if (str1.indexOf(str2) !== -1) {
            return true
        }
        return false;
    }


    isValid(): boolean {
        return this.valid;
    }

    setData(data: any[]): void {
        this.data = data;
    }
}
