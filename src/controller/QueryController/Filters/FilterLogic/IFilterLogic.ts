// types of logic filters, hope this will work for polymorphism
import {IFilter} from "../IFilter";

export interface IFilterLogic extends IFilter {
    type: "FilterLogic"
    subType: "FilterAND" | "FilterOR" | "FilterNOT";
    //input data array
    data: any[];
    valid: boolean;

    parseLogicFilters(objJSON: any): void;
    checkQueryValid(): boolean;
    applyFilter(): any[];
    isValid(): boolean;
}
