import Filter from "../Filter";

export default class FilterComparison extends Filter {
    filterNodes: string[];

    constructor(filter: any) {
        super();
        for (var key in filter) {
            this.filterNodes.push(filter[key]);
        }
    }
}