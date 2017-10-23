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
                    //Log.trace("130:Begin to transform the data into Course Object");



                    for (let f of parseResult){

                        if(typeof f.result !== 'undefined'){
                            let courseData:Array<any> = f.result;
                            for(var c of courseData){
                                if(typeof c.Subject === 'string' &&
                                    typeof c.Course === 'string' &&
                                    typeof c.Avg === 'number' &&
                                    typeof c.Professor === 'string' &&
                                    typeof c.Title === 'string' &&
                                    typeof c.Pass === 'number' &&
                                    typeof c.Fail === 'number' &&
                                    typeof c.Audit === 'number' &&
                                    typeof (c.id).toString() === 'string'
                                ){
                                    let m:Course = {
                                        courses_dept: c.Subject,
                                        courses_id: c.Course,
                                        courses_avg: c.Avg,
                                        courses_instructor: c.Professor,
                                        courses_title: c.Title,
                                        courses_pass: c.Pass,
                                        courses_fail: c.Fail,
                                        courses_audit: c.Audit,
                                        courses_uuid: (c.id).toString()
                                    };
                                    promiseAllResult.push(m);
                                }

                            }
                        } else {
                            let s:InsightResponse = {
                                code: 400,
                                body: {"Error": "Dataset is invalid"}
                            };
                            reject(s);

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
                    let code;


                    if(that.dataInMemory.has(id)){
                        code = 201;

                    }else{
                        code = 204;
                    }
                    that.dataInMemory.set(id,promiseAllResult);
                    let s:InsightResponse = {
                        code: code,
                        body: {dataStore: that.dataInMemory}
                    };
                    //store the data into data/data.json
                    // Log.trace(__dirname);
                    fs.writeFileSync(__dirname + "/data.txt", JSON.stringify(promiseAllResult), 'utf-8');
                    fullfill(s);
                    return;

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
                return;
            });
        });
    }



    removeDataset(id: string): Promise<InsightResponse> {
        let that = this;

        return new Promise<InsightResponse>((fullfill, reject) =>{
            try{
                var exitOfFILE:Boolean = fs.existsSync(__dirname +"/data.txt");
                var s: InsightResponse = {
                    code: 204,
                    body: {}
                };

                if(!exitOfFILE && !(that.dataInMemory.has(id))){
                    s.code = 404;
                    s.body = {error: "dataset not in memory"}
                    reject(s);
                    return;
                }

                if(exitOfFILE){
                    fs.unlink(__dirname + "/data.txt");
                }

                if(that.dataInMemory.has(id)){
                    that.dataInMemory.delete(id);
                }

                //s.code = 204;
                fullfill(s);
                return;

            }catch(err){
                s.code = 404;
                s.body = {error: "something went wrong"}
                reject(s);
                return;
            }
        });
    }

    performQuery(query: any): Promise <InsightResponse> {

        var s: InsightResponse = {code: null, body: {}};
        var queryController = new QueryController(query, []);

        return new Promise<InsightResponse>((fullfill, reject) =>{
            //initialize response variable
            var s: InsightResponse = {code: null, body: {}};
            if (!(this.dataInMemory.has("Courses"))) {
                if (!fs.existsSync(__dirname + "/data.txt")) {
                    s.code = 424;
                    s.body = {error:"missing dataset"}
                    reject(s);
                    //return;
                }else{
                    let data = fs.readFileSync(__dirname  + "/data.txt", 'utf-8');

                    let tempData = JSON.parse(data);

                    if (!queryController.isValid()){
                        s.code = 400;
                        s.body = {error:"query invalid"};
                        reject(s);
                    } else
                    {
                        s.code = 200;
                        var output: any = {result: []}
                        output.result = this.processData(tempData, queryController)

                        s.body = output;
                        fullfill(s);
                    }
                }
            } else {
                let tempData = this.dataInMemory.get("Courses");
                if (!queryController.isValid()) {
                    s.code = 400;
                    s.body = {error:"query invalid"};
                    reject(s);
                } else {
                    s.code = 200;
                    var output: any = {result: []}
                    output.result = this.processData(tempData, queryController)

                    s.body = output;
                    fullfill(s);
                }

            }
        });
    }

    getValue() {
        return this.dataInMemory;
    }


    processData(tempData: any[], qController: QueryController): any[] {
        let res: any[] = [];
        let val: any;
        for (val of tempData) {
            qController.setData(val);
            if (qController.getQueryBody().applyFilter()) res.push(val);
        }
        qController.getQueryBody().getQueryOpt().setOptionsData(res)
        return qController.getQueryBody().getQueryOpt().applyOptions();
    }
}