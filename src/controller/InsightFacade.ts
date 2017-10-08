/**
 * This is the main programmatic entry point for the project.
 */
import {IInsightFacade, InsightResponse} from "./IInsightFacade";
import Log from "../Util";
import QueryController from "./QueryController/QueryController";
var JSZip = require("jszip");
let dataInMemory:dataStore = {id:null,data:[]};
var fs = require("fs");

interface dataStore {
    id: string;
    data:Course[];
}

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



    constructor() {
        //Log.trace('InsightFacadeImpl::init()');
    }

    addDataset(id: string, content: string): Promise<InsightResponse> {
        return new Promise<InsightResponse>((fullfill, reject) =>{
            //Log.trace("100:Begin unzip and read the file");
            JSZip.loadAsync(content, {base64: true}).then(function (zip:any) {
                let promiseArr:Array<Promise<any>> = new Array();
                let parseResult:any[] = new Array();
                for(let key in zip.files){
                    if (zip.file(key)) {
                        let contentInFIle = zip.file(key).async("string");
                        promiseArr.push(contentInFIle);
                    }}
                //Log.trace("101:Begin promise all");

                Promise.all(promiseArr).then(function(value:any){
                    //Log.trace("120:Begin json parse the data");

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
                            dataInMemory.data.push(m);
                        }
                    }

                    //Log.trace("140:Begin returning InsightResponse");
                    //decide return 201 or 204
                    let c;
                    if(id == dataInMemory.id){
                        c = 201;
                    }else{
                        c = 204;
                    }
                    dataInMemory.id =id;
                    let s:InsightResponse = {
                        code: c,
                        body: {dataStore: dataInMemory}
                    };
                    //store the data into data/data.json
                   // Log.trace(__dirname);
                    fs.writeFileSync(__dirname + '/data.txt', JSON.stringify(dataInMemory), 'utf-8');
                    fullfill(s);
                }).catch(function(err){
                    throw new Error(err);
                });


            }).catch(function (err:any) {
                let s:InsightResponse = {
                    code: 400,
                    body: {"error":err.message}
                };
                reject(s);
            });
        });
    }

    removeDataset(id: string): Promise<InsightResponse> {
        return new Promise<InsightResponse>((fullfill, reject) =>{
            var exitOfFILE:Boolean = fs.existsSync(__dirname + '/data.txt');
            let s: InsightResponse = {
                code: 204,
                body: {}
            };
            if(dataInMemory.id === null){
                if(exitOfFILE) {
                    fs.readFile(__dirname + '/data.txt', 'utf-8', function (err: any, data: any) {
                        dataInMemory = JSON.parse(data);
                        if (dataInMemory.id == id) {
                            dataInMemory.id = null;
                            dataInMemory.data = [];
                            fs.unlink(__dirname + '/data.txt');
                            s.code = 204;
                            fullfill(s);
                        } else {
                            s.code = 400;
                            reject(s);
                        }
                    });
                }else{
                    s.code = 400;
                    reject(s);
                }
            }else if(dataInMemory.id == id){
                dataInMemory.id = null;
                dataInMemory.data = [];
                if(exitOfFILE){
                    fs.unlink(__dirname + '/data.txt');
                }
                s.code = 204;
                fullfill(s);
            }else{
                s.code = 400;
                reject(s);
            }

        });
    }

    performQuery(query: any): Promise <InsightResponse> {

        return new Promise<InsightResponse>((fullfill, reject) =>{
            //Log.trace("300: Check if data is in memory, otherwise read data from disk");
                if (dataInMemory.id === null) {
                    //Log.trace("301: Begin reading file");
                    fs.readFile(__dirname + '/data.txt', 'utf-8', function (err: any, data: any) {
                        dataInMemory = JSON.parse(data);
                        let tempData = dataInMemory.data;
                        var queryController = new QueryController(query, tempData);
                        try {
                            queryController.processQuery();
                        } catch (err) {
                            reject(err)
                        }
                        let s: InsightResponse = {code: 204, body: {}};
                        s.body = queryController.getQueryBody().applyFilter();
                        fullfill(s);
                    });
                } else {
                    //Log.trace("310: If data is in memory, then just query perform");

                    let tempData = dataInMemory.data;
                    var queryController = new QueryController(query, tempData);
                    try {
                        queryController.processQuery();
                    } catch (err) {
                        reject(err)
                    }
                    //queryController.getQueryOpt().applyOptions();
                    let s: InsightResponse = {code: 204, body: {}};
                    s.body = queryController.getQueryBody().applyFilter();
                    fullfill(s);
                }
        });
    }

    getValue() {
        return dataInMemory;
    }
}
