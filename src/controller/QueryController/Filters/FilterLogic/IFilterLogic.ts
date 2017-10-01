// types of logic filters, hope this will work for polymorphism
import {IFilter} from "../IFilter";

export interface IFilterLogic extends IFilter {
    type: "FilterLogic"
    subType: "FilterAND" | "FilterOR";
    parseLogicFilters(objJSON: any): void;
}
