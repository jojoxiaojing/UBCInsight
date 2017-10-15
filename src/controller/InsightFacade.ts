
/**
 * This is the main programmatic entry point for the project.
 */
import {IInsightFacade, InsightResponse} from "./IInsightFacade";
import Log from "../Util";
import QueryController from "./QueryController/QueryController";
var JSZip = require("jszip");
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

    queryController: QueryController;
    dataInMemory:dataStore;


    constructor() {
        this.dataInMemory = {id:null,data:[]};
    }

    addDataset(id: string, content: string): Promise<InsightResponse> {
        let that = this;
        return new Promise<InsightResponse>(function(fullfill, reject){
            //Log.trace("100:Begin unzip and read the file");
            JSZip.load(content, {base64: true}).then(function (zip:any) {
                let promiseArr:Array<Promise<any>> = new Array();
                let parseResult:any[] = new Array();
                for(let key in zip.files){
                    if (zip.file(key)) {
                        let contentInFIle = zip.file(key).async("string");
                        promiseArr.push(contentInFIle);
                    }}
                //Log.trace("101:Begin promise all");



                if(promiseArr.length !== 0){
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
                                this.dataInMemory.data.push(m);
                            }
                        }

                        //Log.trace("140:Begin returning InsightResponse");
                        //decide return 201 or 204
                        let c;


                        if(id == this.dataInMemory.id){
                            c = 201;
                        }else{
                            c = 204;
                        }
                        that.dataInMemory.id =id;
                        let s:InsightResponse = {
                            code: c,
                            body: {dataStore: this.dataInMemory}
                        };
                        //store the data into data/data.json
                        // Log.trace(__dirname);
                        fs.writeFileSync(__dirname + '/data.txt', JSON.stringify(this.dataInMemory), 'utf-8');
                        fullfill(s);


                    }).catch(function(err:any){
                        let a = err;
                        throw new Error(a.message);
                    });
                }else{
                    let s:InsightResponse = {
                        code: 400,
                        body: {error: "Dataset is invalid"}
                    };
                    this.removeDataset(id);
                    reject(s);
                }
            }).catch(function (err:any) {
                let s:InsightResponse = {
                    code: 400,
                    body: {error:err.message}
                };
                reject(s);
            });
        }).catch(function (err:any) {

        });
    }

    removeDataset(id: string): Promise<InsightResponse> {
        let that = this;
        return new Promise<InsightResponse>((fullfill, reject) =>{
            var exitOfFILE:Boolean = fs.existsSync(__dirname + '/data.txt');
            let s: InsightResponse = {
                code: 204,
                body: {}
            };
            if(that.dataInMemory.id === null){
                if(exitOfFILE) {
                    fs.readFile(__dirname + '/data.txt', 'utf-8', function (err: any, data: any) {
                        that.dataInMemory = JSON.parse(data);
                        if (that.dataInMemory.id == id) {
                            that.dataInMemory.id = null;
                            that.dataInMemory.data = [];
                            fs.unlink(__dirname + '/data.txt');
                            s.code = 204;
                            fullfill(s);
                        } else {
                            s.code = 404;
                            fullfill(s);
                        }
                    });
                }else{
                    s.code = 404;
                    fullfill(s);
                }
            }else if(that.dataInMemory.id == id){
                that.dataInMemory.id = null;
                that.dataInMemory.data = [];
                if(exitOfFILE){
                    fs.unlink(__dirname + '/data.txt');
                }
                s.code = 204;
                fullfill(s);
            }else{
                s.code = 404;
                fullfill(s);
            }

        }).catch(function(){
        });
    }

    performQuery(query: any): Promise <InsightResponse> {

        return new Promise<InsightResponse>((fullfill, reject) =>{
            //initialize response variable
            var s: InsightResponse = {code: null, body: {}};
            this.queryController = new QueryController(query, []);

            if (this.dataInMemory.id === null) {
                fs.readFile(__dirname + '/data.txt', 'utf-8', function (err: any, data: any) {
                    if (err) {
                        s.code = 424;
                        s.body = {error:"missing dataset"}
                        fullfill(s);
                    }
                    this.dataInMemory = JSON.parse(data);
                    let tempData = this.dataInMemory.data;
                    if (!this.queryController.isValid()) {
                        s.code = 400;
                        s.body = {error: "query invalid"};
                        fullfill(s);
                    } else
                    {
                        s.code = 200;
                        var output: any = {result: []}
                        output.result = this.processData(tempData, this.queryController)
                        s.body = output;
                        fullfill(s);
                    }

                });
            } else {
                let tempData = this.dataInMemory.data;
                if (!this.queryController.isValid()) {
                    s.code = 400;
                    s.body = {error:"query invalid"};
                    fullfill(s);
                } else {
                    var output: any = {result: []}
                    s.code = 200;
                    output.result = this.processData(tempData, this.queryController)
                    s.body = output;
                    fullfill(s);
                }

            }
        }).catch(function(){
        });
    }

    getValue() {
        return this.dataInMemory;
    }

    processData(tempData: any[], qController: QueryController): any[] {
        let res: any[] = [];
        let val: any;
        for (val of tempData) {
            this.queryController.setData(val);
            if (this.queryController.getQueryBody().applyFilter()) res.push(val);
        }
        this.queryController.getQueryBody().getQueryOpt().setOptionsData(res)
        return this.queryController.getQueryBody().getQueryOpt().applyOptions();
    }
}