// types of logic filters, hope this will work for polymorphism
import {IFilter} from "../IFilter";

export interface IFilterComparison extends IFilter {
    type: "FilterComparison"
    subType: "FilterEQ" | "FilterGT" | "FilterLT";
    // check if the subnode types are consistent with AST
    isValidComparisonFilter(): boolean;

    // helper to check if the first subNode in the comparison is a valid key of type string
    isValidComparisonString(): boolean;

}
