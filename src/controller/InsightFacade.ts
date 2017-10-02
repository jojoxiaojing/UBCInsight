/**
 * This is the main programmatic entry point for the project.
 */
import {IInsightFacade, InsightResponse} from "./IInsightFacade";
import Log from "../Util";
var JSZip = require("jszip");
let dataStore:Course[] = [];

interface Course {
    courses_dept: string;
    courses_id: string;
    courses_avg: number;
    courses_instructor: string;
    courses_title: string;
    courses_pass: number;
    courses_fail: number;
    courses_audit: number;
    courses_uuid: string;
}

export default class InsightFacade implements IInsightFacade {
    getValue() {
        return dataStore;
    }
    constructor() {
        Log.trace('InsightFacadeImpl::init()');
    }

    addDataset(id: string, content: string): Promise<InsightResponse> {
        return new Promise<InsightResponse>((fullfill, reject) =>{
            JSZip.loadAsync(content, {base64: true}).then(function (zip:any) {
                let promiseArr:Array<Promise<any>> = new Array();
                let JSONarr:Array<any> = new Array();
                let parseResult:any[] = new Array();
                for(let key in zip.files){
                    if (zip.file(key)) {
                        let contentInFIle = zip.file(key).async("string");
                        promiseArr.push(contentInFIle);
                    }}
                Promise.all(promiseArr).then(function(value:any){

                     for (let i of value){
                         try{
                             let m = JSON.parse(i);
                             parseResult.push(m);
                         }
                         catch(err){

                         }

                     }

                    let s = {
                        code: 1,
                        body: {parseResult}
                    };
                    fullfill(
                        s
                    );
                }).catch(function(err){

                });

            }).catch(function (err:any) {
                reject(err);
            });
        });
    }

    removeDataset(id: string): Promise<InsightResponse> {
        return null;
    }

    performQuery(query: any): Promise <InsightResponse> {
        return null;
    }
}
