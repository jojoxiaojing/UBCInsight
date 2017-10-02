// types of comparison filters, hope this will work for polymorphism
import {IFilter} from "../IFilter";

export interface IFilterComparison extends IFilter {
    type: "FilterComparison"
    subType: "FilterEQ" | "FilterGT" | "FilterLT";
    data: any[];
    // check if the subnode types are consistent with AST
    isValidComparisonFilter(): boolean;

    // helper to check if the first subNode in the comparison is a valid key of type string
    isValidComparisonString(): boolean;

    // actual comparison filter model
    applyFilter(): any[]

}
