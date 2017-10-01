/**
 * This is the main programmatic entry point for the project.
 */
import {IInsightFacade, InsightResponse} from "./IInsightFacade";

import Log from "../Util";

export default class InsightFacade implements IInsightFacade {

    constructor() {
        Log.trace('InsightFacadeImpl::init()');
    }

    addDataset(id: string, content: string): Promise<InsightResponse> {
        // figure out how to
        //validate content (make sure it is valid json)
        //loadInDataStructure
        return null;
    }

    removeDataset(id: string): Promise<InsightResponse> {
        // set dataSet equal null?
        return null;
    }

    performQuery(query: any): Promise <InsightResponse> {
        return null;
    }
}
