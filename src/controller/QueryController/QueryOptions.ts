interface IQueryOptions {

}

export default class QueryOptions implements IQueryOptions{
    options: JSON;

    constructor(options: any) {
        this.options = options;
    }

    //TODO: need to implement options subclasses
}