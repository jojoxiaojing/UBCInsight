import {InsightResponse} from "./IInsightFacade";
import Log from "../Util";
var JSZip = require("jszip");
var fs = require("fs");

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

export default class DataController {
    dataInMemory:Map<string,any[]>;

    constructor() {
        this.dataInMemory= new Map<string,any[]>();
    }

    public getDataset(id: string): any {

        var fs = require("fs");
        let ifFileExist = fs.existsSync('./src/controller/' + id + '.txt');
        if (!ifFileExist) {
            return null;
        }

        if (!this.dataInMemory.has(id) || this.dataInMemory.get(id) === {}) {
            var data = fs.readFileSync('./src/controller/' + id + '.txt', "utf8");
            this.dataInMemory.set(id, JSON.parse(data));
        }

        return this.dataInMemory.get(id);
    }

    public processCourses(id: string, content: any): Promise<InsightResponse> {
        let that = this;
        return new Promise<InsightResponse>((fullfill, reject) =>{
            JSZip.loadAsync(content, {base64: true}).then(function (zip:any) {
                let promiseArr:Array<Promise<any>> = new Array();
                let parseResult:any[] = new Array();
                let promiseAllResult:any[] = new Array();
                for(let key in zip.files){
                    if (zip.file(key)) {
                        let contentInFIle = zip.file(key).async("string");
                        promiseArr.push(contentInFIle);
                    }}

                Promise.all(promiseArr).then(function(value:any){
                    let i = value;
                    for (let i of value){
                        try{
                            let m = JSON.parse(i);
                            parseResult.push(m);
                        }
                        catch(err){
                            //do nothing here
                        }
                    }

                    for (let i of parseResult){
                        let courseData:Array<any> = i.result;
                        for(let c of courseData){
                            let m: Course = {
                                courses_dept: c.Subject,
                                courses_id: c.Course,
                                courses_avg: c.Avg,
                                courses_instructor: c.Professor,
                                courses_title: c.Title,
                                courses_pass: c.Pass,
                                courses_fail: c.Fail,
                                courses_audit: c.Audit,
                                courses_uuid: c.id
                            };
                            promiseAllResult.push(m);
                        }
                    }
                    let m = promiseAllResult;

                    if(m.length === 0){
                        let s:InsightResponse = {
                            code: 400,
                            body: {error: "Dataset is invalid"}
                        };
                        reject(s);
                    }

                    let ifFileExist = fs.existsSync('./src/controller/' + id + '.txt');
                    if (!ifFileExist) {
                        fs.writeFileSync( './src/controller/' + id + '.txt', JSON.stringify(m), 'utf-8');
                    }

                    let c;
                    if(that.dataInMemory.has(id)){
                        c = 201;

                    }else{
                        c = 204;
                    }
                    that.dataInMemory.set(id,m);
                    let s:InsightResponse = {
                        code: c,
                        body: {dataStore: that.dataInMemory.get(id)}
                    };
                    fullfill(s);


                }).catch(function(err:any){
                    let s:InsightResponse = {
                        code: 400,
                        body: {"error":err.message}
                    };
                    reject(s);
                });

            }).
            catch(function (err:any) {
                let s:InsightResponse = {
                    code: 400,
                    body: {"error":err.message}
                };
                reject(s);
            });
        });
    }

}