// types of comparison filters, hope this will work for polymorphism
import {IFilter} from "../IFilter";

export interface IFilterComparison extends IFilter {
    type: "FilterComparison"
    subType: "FilterEQ" | "FilterGT" | "FilterLT" | "FilterIS";
    data: any[];
    valid: boolean;
    // check if the subnode types are consistent with AST
    checkQueryValid(): boolean;

    checkQueryValid(): boolean;
    applyFilter(): any[];
    isValid(): boolean;


}
