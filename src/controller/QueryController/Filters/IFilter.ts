// types of filters, hope this will work for polymorphism
export interface IFilter {
    type: "FilterComparison" | "FilterLogic";
}
