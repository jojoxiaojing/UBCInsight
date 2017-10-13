/**
 * This is the main programmatic entry point for the project.
 */
import {IInsightFacade, InsightResponse} from "./IInsightFacade";
import Log from "../Util";
import QueryController from "./QueryController/QueryController";
import {isUndefined} from "util";
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
export default class InsightFacade implements IInsightFacade {
    dataInMemory:Map<string,any[]>;



    constructor() {
        //Log.trace('InsightFacadeImpl::init()');
        this.dataInMemory= new Map<string,any[]>();
    }

    addDataset(id: string, content: string): Promise<InsightResponse> {
        let that = this;
        return new Promise<InsightResponse>((fullfill, reject) =>{
            //Log.trace("100:Begin unzip and read the file");
            JSZip.loadAsync(content, {base64: true}).then(function (zip:any) {
                let promiseArr:Array<Promise<any>> = [];
                let parseResult:any[] =[];
                let promiseAllResult:any[] = [];
                for(let key in zip.files){
                    if (zip.file(key)) {
                        let contentInFIle = zip.file(key).async("string");
                        promiseArr.push(contentInFIle);
                    }}
                //Log.trace("101:Begin promise all");



                    Promise.all(promiseArr).then(function(value:any){
                        //Log.trace("120:Begin json parse the data");


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
                        //Log.trace("130:Begin to transform the data into Course Object");

                        for (let i of parseResult){
                            let courseData:Array<any> = i.result;
                            for(let c of courseData){
                                let m:Course = {
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
                                body: {"Error": "Dataset is invalid"}
                            };
                            reject(s);
                            return;
                        }

                        //Log.trace("140:Begin returning InsightResponse");
                        //decide return 201 or 204
                        let c;


                        if(that.dataInMemory.has(id)){
                            c = 201;

                        }else{
                            c = 204;
                        }
                        that.dataInMemory.set(id,promiseArr);
                        let s:InsightResponse = {
                            code: c,
                            body: {dataStore: that.dataInMemory}
                        };
                        //store the data into data/data.json
                        // Log.trace(__dirname);
                        fs.writeFileSync(__dirname + "/"+id, JSON.stringify(promiseAllResult), 'utf-8');
                        fullfill(s);


                    }).catch(function(err:any){
                        let a = err;
                        throw new Error(a.message);
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



    removeDataset(id: string): Promise<InsightResponse> {
        let that = this;
        return new Promise<InsightResponse>((fullfill, reject) =>{
            try{
            var exitOfFILE:Boolean = fs.existsSync(__dirname +"/"+ id);
            let s: InsightResponse = {
                code: 204,
                body: {}
            };

            if(!exitOfFILE && !(that.dataInMemory.has(id))){
                s.code = 404;
                reject(s);
                return;
            }

            if(exitOfFILE){
                fs.unlink(__dirname +"/"+id);
            }

            if(that.dataInMemory.has(id)){
                that.dataInMemory.delete(id);
            }

            s.code = 204;
            fullfill(s);
        }catch(err){
                let s: InsightResponse = {
                    code: 404,
                    body: err
                };
                reject(s);
                return;
            }
        });
    }

    performQuery(query: any): Promise <InsightResponse> {
        let that = this;

        return new Promise<InsightResponse>((fullfill, reject) =>{
            //initialize response variable
            var s: InsightResponse = {code: null, body: {}};
            if (!(that.dataInMemory.has("Courses"))) {
                if (!fs.existsSync(__dirname + 'Courses')) {
                    s.code = 424;
                    s.body = {"error":"missing dataset"}
                    reject(s);
                    return;
                }else{
                    let data = fs.readFileSync(__dirname + 'Courses', 'utf-8');

                    that.dataInMemory = JSON.parse(data);
                    let tempData = that.dataInMemory.get("Courses");
                    var queryController = new QueryController(query, tempData);
                    if (!queryController.isValid()) {
                        s.code = 400;
                        s.body = {"error":"query invalid"};
                        reject(s);
                    } else
                    {
                        s.code = 200;
                        s.body = queryController.getQueryBody().applyFilter();
                        fullfill(s);
                    }
                }
            } else {
                let tempData = that.dataInMemory.get("Courses");
                var queryController = new QueryController(query, tempData);
                if (!queryController.isValid()) {
                    s.code = 400;
                    s.body = {"error":"query invalid"};
                    reject(s);
                } else {
                    s.code = 200;
                    s.body = queryController.getQueryBody().applyFilter();
                    fullfill(s);
                }

            }
        });
    }

    getValue() {
        return this.dataInMemory;
    }
}