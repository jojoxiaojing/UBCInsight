// types of filters, hope this will work for polymorphism
export interface IFilter {
    type: "FilterComparison" | "FilterLogic";
    data: any[];
    valid: boolean
    checkQueryValid(): boolean;

    applyFilter(): any[];
    isValid(): boolean;
}
