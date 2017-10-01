interface IQueryOptions {

}

export default class QueryOptions implements IQueryOptions{
    options: JSON;

    constructor(options: any) {
        this.options = options;
    }

/*    setOptions(options: any): void {
        this.options = options;
    }*/

}